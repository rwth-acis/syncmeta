define([
    'jqueryui',
    'lodash',
    'text!templates/viewcanvas_widget/select_option.html'
], function($,_, optionHtml){

    function ViewManager(){
        var _viewList = {};

        var _$selection = $('#ddmViewSelection');

        var optionTpl = _.template(optionHtml);

        return {
            GetViewpointList : function() {
                var resourceSpace = new openapp.oo.Resource(openapp.param.space());
                var $selection = $('#ddmViewpointSelection');
                resourceSpace.getSubResources({
                    relation: openapp.ns.role + "data",
                    type: CONFIG.NS.MY.VIEWPOINT,
                    onEach: function (context) {
                        context.getRepresentation("rdfjson", function (representation) {
                            var $option = $(optionTpl({
                                id: representation.id
                            }));
                            $option.attr('link', context.uri);
                            $selection.append($option);
                        });
                    }
                });
            },
            existsView : function(viewId) {
                return _viewList.hasOwnProperty(viewId);
            },
            getViewIdOfSelected : function(){
                return this.getSelected$node().attr('id');
            },
            getViewList : function(){
                return _viewList;
            },
            getViewUri : function(viewId){
                return _viewList.hasOwnProperty(viewId)? _viewList[viewId].uri : null;
            },
            getViewpointUri : function(viewId){
                return _viewList.hasOwnProperty(viewId)? _viewList[viewId].viewpointUri : null;
            },
            getSelected$node : function(){
                return  _$selection.find('option:selected');
            },
            addView : function(viewId, viewUri,viewpointUri){
                if(!_viewList.hasOwnProperty(viewId)){
                    _viewList[viewId] = {uri: viewUri, viewpointUri: viewpointUri};
                    var $option = $(optionTpl({
                        id: viewId
                    }));
                    _$selection.append($option);
                }
            },
            updateView: function(viewId, viewUri){
                if(_viewList.hasOwnProperty(viewId)){
                    _viewList[viewId].uri = viewUri;
                }
            },
            deleteView: function(viewId){
                delete _viewList[viewId];
                _$selection.find('#'+viewId).remove();
            },
            initViewList : function(){
                var that = this;
                var resourceSpace = new openapp.oo.Resource(openapp.param.space());
                resourceSpace.getSubResources({
                    relation: openapp.ns.role + "data",
                    type: CONFIG.NS.MY.VIEW,
                    onEach: function (context) {
                        context.getRepresentation("rdfjson", function (data) {
                            if(that.existsView(data.id))
                                that.updateView(data.id, context.uri);
                            else
                                that.addView(data.id, context.uri, data.viewpoint);
                        });
                    }
                });
            }
        }
    }
    return new ViewManager();
});