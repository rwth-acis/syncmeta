define(['viewcanvas_widget/ViewTypesUtil','promise!Metamodel'], function(ViewTypesUtil, Metamodel){

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
                    if(viewpoint.nodes[key].type === 'ViewObject'){
                        metaNode = getTargetNodeFromMetaModel(key, viewpoint.nodes[key]);
                        if(metaNode)
                            filter('nodes', metaNode.label, Model);
                    }
                    else if(viewpoint.nodes[key].type == 'ViewRelationship'){
                        metaNode = getTargetEdgeFromMetaModel(key, viewpoint.nodes[key]);
                        if(metaNode)
                            filter('edges', metaNode.label, Model);
                    }
                }
            }
        };
        var filter = function(entityTypes, type, Model){
            for(var key in Model[entityTypes]){
                if(Model[entityTypes].hasOwnProperty(key)){
                    if(Model[entityTypes][key].type === type){
                        if(entityTypes === 'edges'){
                            if(_view.nodes.hasOwnProperty(Model[entityTypes][key].source) && _view.nodes.hasOwnProperty(Model[entityTypes][key].target))
                                that.getView()[entityTypes][key] = Model[entityTypes][key];
                        }
                        else
                            that.getView()[entityTypes][key] = Model[entityTypes][key];
                    }
                }
            }
        };
        var getTargetId = function(key, node){
            return node.attributes[key+'[target]'].value.value;
        };
        var getTargetNodeFromMetaModel = function(key, node){
           return getTargetFromMetaModel('nodes', key, node);
        };
        var getTargetEdgeFromMetaModel = function(key, node){
            return getTargetFromMetaModel('edges', key, node);
        };
        var getTargetFromMetaModel = function(type, key, node){
            var id = getTargetId(key, node);
            if(Metamodel[type].hasOwnProperty(id))
                return Metamodel[type][id];
            else return null;
        };
    }
    return ViewGenerator;
});
