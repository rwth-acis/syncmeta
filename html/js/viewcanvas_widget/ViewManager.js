define([
    'jqueryui',
    'lodash',
    'text!templates/viewcanvas_widget/select_option.html'
], function($,_, optionHtml){

    function ViewManager(){
        var _viewResourceDictionary = {};

        var _viewViewpointDictionary={};
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
                return _viewResourceDictionary.hasOwnProperty(viewId);
            },
            getViewIdOfSelected : function(){
                return this.getSelected$node().attr('id');
            },
            getResourceDictionary : function(){
                return _viewResourceDictionary;
            },
            getViewUri : function(viewId){
                return _viewResourceDictionary.hasOwnProperty(viewId)? _viewResourceDictionary[viewId].uri : null;
            },
            getViewpointUri : function(viewId){
                return _viewViewpointDictionary.hasOwnProperty(viewId)? _viewViewpointDictionary[viewId] : null;
            },
            getSelected$node : function(){
                return  _$selection.find('option:selected');
            },
            getResource : function(viewId){
              if(_viewResourceDictionary.hasOwnProperty(viewId)){
                  return _viewResourceDictionary[viewId];
              }
            },
            addView : function(viewId, viewUri,viewpointUri, resource){
                if(!_viewResourceDictionary.hasOwnProperty(viewId)){
                    _viewResourceDictionary[viewId] = resource;
                    _viewViewpointDictionary[viewId] = viewpointUri;
                    var $option = $(optionTpl({
                        id: viewId
                    }));
                    _$selection.append($option);
                }
            },
            deleteView: function(viewId){
                delete _viewResourceDictionary[viewId];
                delete _viewViewpointDictionary[viewId];
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
                            that.addView(data.id, context.uri, data.viewpoint, context);
                        });
                    }
                });
            }
        }
    }
    return new ViewManager();
});