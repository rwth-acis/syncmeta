define(['Util','viewcanvas_widget/ViewTypesUtil','promise!Metamodel'], function(Util, ViewTypesUtil, Metamodel){

    function ViewGenerator(viewpoint) {
        var that = this;

        /**
         * the viewpoint model used to generate the view
         * @private
         */
        var _viewpoint = viewpoint;

        /**
         * the view model
         * @type {{attributes: {}, nodes: {}, edges: {}}}
         * @private
         */
        var _view = {
            attributes:{},
            nodes:{},
            edges:{}
        };

        /**
         * returns the viewpoint
         * @returns {object}
         */
        this.getViewpoint = function(){
            return _viewpoint;
        };

        /**
         * returns the generated view
         * @returns {object}
         */
        this.getView= function(){
            return _view;
        };

        /**
         * computes the view based on a model and viewpoint
         * @returns {object} the computed view
         */
       this.apply = function(){
           return ViewTypesUtil.GetCurrentBaseModel().then(function(Model){
               return filterElements(Model);
           });
       };

        /**
         * Main filter methods. Starts workers to compute views.
         * @param Model - the base model the view
         * @returns {Object} a promise
         */
        var filterElements = function(Model){
            return $.when(createFilterWorker('nodes', Model), createFilterWorker('edges',Model)).then(function(nodes, edges){
                _view.nodes = nodes;
                _view.edges = edges;
                return fixReferenceWorker(_view).then(function(view){
                    return view;
                });
            }).fail(function(nodesError, edgesError){
                console.log(nodesError.message);
                console.log(edgesError.message);
            });


        };

        /**
         * computes the nodes or edges from the base model in a worker thread.
         * uses parallel.js library to create workers.
         * @param entityType - can be 'nodes' or 'edges'
         * @param Model - the base model
         * @returns {object} promise
         */
        function createFilterWorker(entityType, Model){
            var viewpoint = that.getViewpoint();
            var deferred = $.Deferred();
            var worker = new Parallel(viewpoint[entityType], {
                env:{
                    model:Model,
                    meta:Metamodel,
                    entityType:entityType
                }
            });
            worker.require(getTargetFromMetaModel)
                .require(filter)
                .require({ fn: Util.generateRandomId, name: 'generateRandomId' })
                .require({fn: Util.merge, name:'merge'})
                .spawn(function(data){
                    var entities = {};
                    for(var key in data){
                        if(data.hasOwnProperty(key)){
                            var metaNode = null;
                            if(data[key].hasOwnProperty('target')){
                                metaNode = getTargetFromMetaModel(global.env.meta,global.env.entityType,data[key].target);
                                if(metaNode)
                                    entities = merge(entities,filter(global.env.entityType, metaNode.label, data[key].label, global.env.model));
                            }
                        }
                    }
                    data = entities;
                    return data;
                }).then(function(data){
                    deferred.resolve(data);
                }, function(e){
                    deferred.reject(e);
                });
            return deferred.promise();
        }

        /**
         * filter entites
         * @param entityTypes - filter nodes or edges
         * @param type - the type of the entity
         * @param newType - the new view-type
         * @param Model - the base model
         * @returns {object} a object with the filtered node/edge entites
         */
        function filter (entityTypes, type, newType, Model){
            var entites = {};
            for(var key in Model[entityTypes]){
                if(Model[entityTypes].hasOwnProperty(key)){
                    var newKey =  generateRandomId();
                    if(Model[entityTypes][key].type === type){
                        entites[newKey] = Model[entityTypes][key];
                        entites[newKey].type = newType;
                        entites[newKey]['origin'] = key;
                    }
                    /*if(Model[entityTypes][key].type == type) {
                        entites[newKey] = Model[entityTypes][key];
                        entites[newKey].type = newType;
                        entites[newKey]['origin'] = key;
                    for(var edgeId in Model.edges){
                                if(Model.edges[edgeId].source === key)
                                    Model.edges[edgeId].source = newKey;
                                else if(Model.edges[edgeId].target === key)
                                    Model.edges[edgeId].target = newKey;
                            }*/
                }
            }

            return entites;
        }

        /**
         * this function updates the source/target references of edges
         * after parallel view computation of nodes/edges the source- and target property contains the ids of the base model
         * therefore no edge can be generated, this function updates these references with the new view type nodes.
         * @param view
         */
        function fixReferences(view){
            var toDelete = [];
            for(var edgeId in view.edges){
                if(view.edges.hasOwnProperty(edgeId)){
                    var sourceUpdated = false;
                    var targetUpdated = false;
                    for(var nodeId in view.nodes){
                        if(view.nodes.hasOwnProperty(nodeId)){
                            if(view.edges[edgeId].source === view.nodes[nodeId].origin) {
                                view.edges[edgeId].source = nodeId;
                                sourceUpdated=true;
                            }
                            if(view.edges[edgeId].target === view.nodes[nodeId].origin) {
                                view.edges[edgeId].target = nodeId;
                                targetUpdated = true;
                            }
                        }
                    }
                    if(!(sourceUpdated && targetUpdated))
                        toDelete.push(edgeId);
                }
            }
            for(var i=0;i<toDelete.length;i++){
                delete view.edges[toDelete[i]];
            }
            return view;
        }

        /**
         * Runs the fixReference in a web worker.
         * the web worker is wrapped in a jquery promise
         * @param view - the view model with nodes and edges
         * @returns {object} jquery promise object
         */
        function fixReferenceWorker(view){
            var deferred = $.Deferred();
            var worker = new Parallel(view);
            worker.require(fixReferences)
                .spawn(function(data){
                    data = fixReferences(data);
                    return data;
                }).then(function(data){
                    deferred.resolve(data);
                }, function(e){
                    console.log(e.message);
                });
            return deferred.promise();
        }

        /**
         * Look for the target node in the meta model
         * @param metamodel - the meta-model
         * @param type - can be 'nodes' or 'edges'
         * @param entityId - the nodeId or edgeId
         * @returns {object} the node or edges object from the meta-model VLS
         */
        function getTargetFromMetaModel(metamodel, type, entityId){
            if(metamodel[type].hasOwnProperty(entityId))
                return metamodel[type][entityId];
            else return null;
        }
    }
    return ViewGenerator;
});
