define(['Util','viewcanvas_widget/ViewTypesUtil','promise!Metamodel'],
    /** @lends ViewGenerator*/ function(Util, ViewTypesUtil, Metamodel){

        /**
         * Generates a view based on a viewpoint and the current base model of the main canvas widget
         * @param viewpoint -the viewpoint model
         * @constructor
         */
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
                attributes: {},
                nodes: {},
                edges: {}
            };

            /**
             * returns the viewpoint
             * @returns {object}
             */
            this.getViewpoint = function () {
                return _viewpoint;
            };


            /**
             * computes the view based on a model and viewpoint
             * @returns {object} the computed view
             */
            this.apply = function () {
                return ViewTypesUtil.GetCurrentBaseModel().then(function (Model) {
                    return computeView(Model);
                });
            };

            /**
             * Main filter methods. Starts workers to compute views.
             * @param Model - the base model the view
             * @returns {Object} a promise
             */
            var computeView = function (Model) {
                return $.when(createFilterWorker('nodes', Model), createFilterWorker('edges', Model)).then(function (nodes, edges) {
                    _view.nodes = nodes;
                    _view.edges = edges;
                    return $.when(createFilterByConditionWorker('nodes'), createFilterByConditionWorker('edges')).then(function(nodes, edges){
                        _view.nodes = nodes;
                        _view.edges = edges;
                        return fixReferenceWorker(_view).then(function (view) {
                            _view.edges = view.edges;
                            return _view;
                        });
                    }).fail(function (error) {
                        console.log(error.message);
                    });

                }).fail(function (error) {
                    console.log(error.message);

                });


            };


            /**
             * computes the nodes or edges from the base model in a worker thread.
             * uses parallel.js library to create workers.
             * @param entityType - can be 'nodes' or 'edges'
             * @param Model - the base model
             * @returns {object} promise
             */
            function createFilterWorker(entityType, Model) {
                var viewpoint = that.getViewpoint();
                var deferred = $.Deferred();
                var worker = new Parallel(viewpoint[entityType], {
                    env: {
                        model: Model,
                        meta: Metamodel,
                        entityType: entityType
                    }
                });
                worker.require(getTargetFromMetaModel)
                    .require(filter)
                    .require({fn: Util.generateRandomId, name: 'generateRandomId'})
                    .require({fn: Util.merge, name: 'merge'})
                    .spawn(function (data) {
                        var entities = {};
                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                var metaNode = null;
                                if (data[key].hasOwnProperty('target')) {
                                    metaNode = getTargetFromMetaModel(global.env.meta, global.env.entityType, data[key].target);
                                    if (metaNode)
                                        entities = merge(entities, filter(global.env.entityType, metaNode.label, data[key].label, global.env.model));
                                }
                            }
                        }
                        return entities;
                    }).then(function (data) {
                        deferred.resolve(data);
                    }, function (e) {
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
            function filter(entityTypes, type, newType, Model) {
                var entites = {};
                for (var key in Model[entityTypes]) {
                    if (Model[entityTypes].hasOwnProperty(key)) {
                        var newKey = generateRandomId();
                        if (Model[entityTypes][key].type === type) {
                            entites[newKey] = Model[entityTypes][key];
                            entites[newKey].type = newType;
                            entites[newKey]['origin'] = key;
                        }
                    }
                }
                return entites;
            }

            /**
             * creates a web worker to filter nodes or edges by their attribute condition
             * @param entityType can be nodes or edges
             * @returns {promise} a jquery promise object
             */
            function createFilterByConditionWorker(entityType){
                var deferred = $.Deferred();
                var worker = new Parallel(undefined, {
                    env:{
                        entities:_view[entityType],
                        viewTypes:_viewpoint[entityType]
                    }
                });
                worker.require(filterByConditions)
                    .require(getViewTypeEntities)
                    .require(applyConditions)
                    .require(getAttributeValue)
                    .require(resolveCondition)
                    .spawn(function(){
                        return filterByConditions(global.env.viewTypes,global.env.entities);
                    }).then(function(data){
                        deferred.resolve(data);
                    }, function(e){
                        deferred.reject(e);
                    });
                return deferred.promise();
        }


            /**
             * filters node or edges entities by conditions defined on attributes
             * @param {object} viewTypes the view types
             * @param {object} viewEntities the instances of the view types
             * @returns {object} a json object with the nodes/edges
             */
            function filterByConditions(viewTypes, viewEntities){
                var filteredEntities = {};
                for(var entityKey in viewTypes){
                    if(viewTypes.hasOwnProperty(entityKey)) {
                        var classType = viewTypes[entityKey].label;
                        var viewTypeEntities = getViewTypeEntities(viewEntities, classType);
                        for (var nodeKey in viewTypeEntities) {
                            if(viewTypeEntities.hasOwnProperty(nodeKey)){
                                var result = applyConditions(viewTypeEntities[nodeKey], viewTypes[entityKey]);
                                if(result)
                                    filteredEntities[nodeKey] = viewTypeEntities[nodeKey];
                            }
                        }
                    }
                }
                return filteredEntities;
            }

            /**
             * returns the instances of a viewtype
             * @param {string} viewEntities instances of the view types
             * @param {string} classType the type of the view type
             * @returns {object}
             */
            function getViewTypeEntities(viewEntities, classType){
                var entities ={};
                for(var entityKey in viewEntities){
                    if(viewEntities.hasOwnProperty(entityKey) && viewEntities[entityKey].type === classType){
                        entities[entityKey] = viewEntities[entityKey];
                    }
                }
                return entities;
            }

            /**
             * applies the conditions defined for a view type on a instance of the view type
             * @param node the instance of the view type
             * @param viewType the view type object
             * @returns {boolean} true if the conditions are fulfilled else false
             */
            function applyConditions(node, viewType){
                var conditions = viewType.conditions;
                for(var condKey in conditions){
                    if(conditions.hasOwnProperty(condKey)){
                        var condition = conditions[condKey];
                       if(viewType.attributes.hasOwnProperty(condition.property)){
                           var attrName = viewType.attributes[condition.property].key;
                           var attrValue = getAttributeValue(node, attrName);
                           var result= resolveCondition(attrValue, condition.operator, condition.value);
                           if(result && viewType.conjunction === 'OR')
                               return true;
                           else if(!result && viewType.conjunction === 'AND')
                               return false;
                       }
                    }
                }
                return true;
            }

            /**
             * get the attribute value for a node
             * @param node the node
             * @param attrName the attribute name
             * @returns {*} the value of the attribute of the node object
             */
            function getAttributeValue(node, attrName){
                for(var attrKey in node.attributes){
                    if(node.attributes.hasOwnProperty(attrKey) && node.attributes[attrKey].name === attrName)
                        return node.attributes[attrKey].value.value;
                }
            }

            /**
             * resolves a condition
             * @param attrValue the attribute value from the instance of a view type
             * @param {string} operator the operator defined in the view type definition
             * @param {string} value the value defined in the view type definition
             * @returns {boolean} true if the condition is true else false
             */
            function resolveCondition(attrValue, operator, value){
                var val = null;
                try{
                    if(typeof val === 'boolean')
                         val = value;
                    else
                        val = parseInt(value);
                    if(isNaN(val))
                        val = value;
                }
                catch(e){
                    val = value;
                }
                switch(operator){
                    case 'greater':
                        return attrValue > val;
                    case 'smaller':
                        return attrValue < val;
                    case 'equal':
                        return attrValue === val;
                    case 'greater_eq':
                        return attrValue >= val;
                    case 'smaller_eq':
                        return attrValue <= val;
                    case 'nequal':
                        return attrValue != val;
                }
            }

            /**
             * this function updates the source/target references of edges
             * after parallel view computation of nodes/edges the source- and target property contains the ids of the base model
             * therefore no edge can be generated, this function updates these references with the new view type nodes.
             * @param view
             */
            function fixReferences(view) {
                var toDelete = [];
                for (var edgeId in view.edges) {
                    if (view.edges.hasOwnProperty(edgeId)) {
                        var sourceUpdated = false;
                        var targetUpdated = false;
                        for (var nodeId in view.nodes) {
                            if (view.nodes.hasOwnProperty(nodeId)) {
                                if (view.edges[edgeId].source === view.nodes[nodeId].origin) {
                                    view.edges[edgeId].source = nodeId;
                                    sourceUpdated = true;
                                }
                                if (view.edges[edgeId].target === view.nodes[nodeId].origin) {
                                    view.edges[edgeId].target = nodeId;
                                    targetUpdated = true;
                                }
                            }
                        }
                        if (!(sourceUpdated && targetUpdated))
                            toDelete.push(edgeId);
                    }
                }
                for (var i = 0; i < toDelete.length; i++) {
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
            function fixReferenceWorker(view) {
                var deferred = $.Deferred();
                var worker = new Parallel(view);
                worker.require(fixReferences)
                    .spawn(function (data) {
                        data = fixReferences(data);
                        return data;
                    }).then(function (data) {
                        deferred.resolve(data);
                    }, function (e) {
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
            function getTargetFromMetaModel(metamodel, type, entityId) {
                if (metamodel[type].hasOwnProperty(entityId))
                    return metamodel[type][entityId];
                else return null;
            }
        }
    return ViewGenerator;
});
