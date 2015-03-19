define([
    'jqueryui',
    'lodash',
    'iwcotw',
    'operations/ot/ViewAddOperation',
    'operations/ot/ViewDeleteOperation',
    'operations/ot/ViewUpdateOperation',
    'text!templates/viewcanvas_widget/select_option.html'
], function($,_, IWCOT, ViewAddOperation, ViewDeleteOperation, ViewUpdateOperation,optionHtml){

    function ViewManager($selection){
        var that = this;
        var _viewList = {};

        var _$selection = $selection;

        var optionTpl = _.template(optionHtml);

        var _iwcot = IWCOT.getInstance(CONFIG.WIDGET.NAME.VIEWCANVAS);

        this.addView = function(viewId, viewUri,viewpointUri){
            var operation = new ViewAddOperation(viewId, viewUri, viewpointUri);
            if(_iwcot.sendRemoteOTOperation(operation))
                 processViewAddOperation(operation);

        };

        this.deleteView = function(viewId){
            var operation = new ViewDeleteOperation(viewId);
            if(_iwcot.sendRemoteOTOperation(operation))
                processViewDeleteOperation(operation);
        };

        this.updateView = function(viewId, viewUri){
          var operation = new ViewUpdateOperation(viewId, viewUri);
            if(_iwcot.sendRemoteOTOperation(operation))
                 processViewUpdateOperation(operation);
        };

        var AddViewCallback = function(operation){
            if(operation instanceof ViewAddOperation) {
                propagateViewAddOperation(operation);
            }
        };

        var propagateViewAddOperation = function(operation){
            processViewAddOperation(operation);
        };
        var processViewAddOperation = function(operation){
            var viewId = operation.getViewId();
            if(!_viewList.hasOwnProperty(viewId)) {
                var viewUri = operation.getViewUri();
                _viewList[viewId] = {uri: viewUri, viewpointUri: operation.getViewpointUri()};
                var $option = $(ViewManager.optionTpl({
                    id: viewId
                }));
                _$selection.append($option);
            }
        };
        var DeleteViewCallback = function(operation){
            if(operation instanceof ViewDeleteOperation) {
                propagateViewDeleteOperation(operation);
            }
        };
        var propagateViewDeleteOperation = function(operation){
            processViewDeleteOperation(operation);
        };
        var processViewDeleteOperation = function(operation){
            var viewId = operation.getViewId();
            delete _viewList[viewId];
            _$selection.find('#'+viewId).remove();

        };

        var UpdateViewListCallback = function(operation){
            if(operation instanceof ViewUpdateOperation){
                processViewUpdateOperation(operation);
            }
        };
        var processViewUpdateOperation = function(operation){
            var viewId = operation.getViewId();
            if(_viewList.hasOwnProperty(viewId))
                _viewList[viewId].uri = operation.getViewUri();
        };
        this.registerCallbacks = function () {
            _iwcot.registerOnRemoteDataReceivedCallback(AddViewCallback);
            _iwcot.registerOnRemoteDataReceivedCallback(UpdateViewListCallback);
            _iwcot.registerOnRemoteDataReceivedCallback(DeleteViewCallback);
        };

        this.unregisterCallbacks = function () {
            _iwcot.unregisterOnRemoteDataReceivedCallback(AddViewCallback);
            _iwcot.unregisterOnRemoteDataReceivedCallback(UpdateViewListCallback);
            _iwcot.registerOnRemoteDataReceivedCallback(DeleteViewCallback);
        };

        this.getViewList = function(){
            return _viewList;
        };
        this.getViewUri = function(viewId){
          return _viewList[viewId].uri;
        };
        this.getViewpointUri = function(viewId){
          return _viewList[viewId].viewpointUri;
        };
        this.getSelected$node= function(){
           return  _$selection.find('option:selected');
        };

        this.getViewIdOfSelected = function(){
          return that.getSelected$node().attr('id');
        };
        this.existsView = function(viewId){
          return _viewList.hasOwnProperty(viewId);
        };
        that.registerCallbacks();
    }
    ViewManager.optionTpl = _.template(optionHtml);

    ViewManager.GetViewpointList = function() {
        var resourceSpace = new openapp.oo.Resource(openapp.param.space());
        var $selection = $('#ddmViewpointSelection');
        resourceSpace.getSubResources({
            relation: openapp.ns.role + "data",
            type: CONFIG.NS.MY.VIEWPOINT,
            onEach: function (context) {
                context.getRepresentation("rdfjson", function (representation) {
                   var $option = $(ViewManager.optionTpl({
                        id: representation.id
                    }));
                    $option.attr('link',context.uri);
                    $selection.append($option);
                });
            }
        });
    };
    return ViewManager;

});