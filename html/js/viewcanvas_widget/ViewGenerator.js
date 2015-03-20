define(['Util','viewcanvas_widget/ViewTypesUtil','promise!Metamodel'], function(Util, ViewTypesUtil, Metamodel){

    function ViewGenerator(viewpoint) {
        var that = this;
        var _viewpoint = viewpoint;
        var _view = {
            attributes:{},
            nodes:{},
            edges:{}
        };
        this.getViewpoint = function(){
            return _viewpoint;
        };

        this.getView= function(){
            return _view;
        };

       this.apply = function(){
           return ViewTypesUtil.GetCurrentBaseModel().then(function(Model){
               filterElements(Model);
                return that.getView();
           });
       };

        var filterElements = function(Model){
            var viewpoint = that.getViewpoint();
            for(var key in viewpoint.nodes){
                if(viewpoint.nodes.hasOwnProperty(key)){
                    var metaNode = null;
                    if(viewpoint.nodes[key].hasOwnProperty('target')){
                        metaNode = getTargetNodeFromMetaModel(viewpoint.nodes[key]);
                        if(metaNode)
                            filter('nodes', metaNode.label, viewpoint.nodes[key].label, Model);
                    }
                }
            }
            for(var key in viewpoint.edges){
                if(viewpoint.edges.hasOwnProperty(key)){
                    var metaNode = null;
                    if(viewpoint.edges[key].hasOwnProperty('target')){
                        metaNode = getTargetEdgeFromMetaModel(viewpoint.edges[key]);
                        if(metaNode)
                            filter('edges', metaNode.label,viewpoint.edges[key].label, Model);
                    }
                }
            }
        };
        var filter = function(entityTypes, type, newType, Model){
            for(var key in Model[entityTypes]){
                if(Model[entityTypes].hasOwnProperty(key)){
                    var newKey =  Util.generateRandomId();
                    if(Model[entityTypes][key].type === type){
                        if(entityTypes === 'edges'){
                            if(_view.nodes.hasOwnProperty(Model[entityTypes][key].source) && _view.nodes.hasOwnProperty(Model[entityTypes][key].target)){
                                that.getView()[entityTypes][newKey] = Model[entityTypes][key];
                                that.getView()[entityTypes][newKey].type = newType;
                            }
                        }
                        else {
                            that.getView()[entityTypes][newKey] = Model[entityTypes][key];
                            that.getView()[entityTypes][newKey].type = newType;
                            for(var edgeId in Model.edges){
                                if(Model.edges[edgeId].source === key)
                                    Model.edges[edgeId].source = newKey;
                                else if(Model.edges[edgeId].target === key)
                                    Model.edges[edgeId].target = newKey;
                            }
                        }
                    }
                }
            }
        };

        var getTargetNodeFromMetaModel = function(node){
           return getTargetFromMetaModel('nodes',  node);
        };
        var getTargetEdgeFromMetaModel = function(node){
            return getTargetFromMetaModel('edges',  node);
        };
        var getTargetFromMetaModel = function(type, node){
            var id = node.target;
            if(Metamodel[type].hasOwnProperty(id))
                return Metamodel[type][id];
            else return null;
        };
    }
    return ViewGenerator;
});
