define([
    'iwcotw',
    'jqueryui',
    'lodash',
    'operations/non_ot/ObjectGuidanceFollowedOperation',
    'text!templates/canvas_widget/abstract_node.html'
],/** @lends ContextNode */function(IWCOTW, $,_,ObjectGuidanceFollowedOperation,abstractNodeHtml) {
    function ObjectGuidance(id, $shape, left, top, width, height, srcObjectId, objectGuidanceRule){
        var _iwc = IWCOTW.getInstance(CONFIG.WIDGET.NAME.MAIN);

        var _$node = $(_.template(abstractNodeHtml,{id: id})).append($shape.clone());
        var _canvas;

        var _srcObjectId = srcObjectId;
        var _objectGuidanceRule = objectGuidanceRule;

        var _appearance = {
            left: left,
            top: top,
            width: width,
            height: height
        };

        var $edge = null;

        _$node
        .click(function(event) {
            var nodeId = _canvas.createNode(_objectGuidanceRule.destObjectType, _appearance.left, _appearance.top, width, height);
            _canvas.createEdge(_objectGuidanceRule.relationshipType, _srcObjectId, nodeId);
            _canvas.hideObjectGuidance();

            var operation = new ObjectGuidanceFollowedOperation(_srcObjectId, _objectGuidanceRule);
            operation.toNonOTOperation();
            processObjectGuidanceFollowedOperation(operation);
            propagateObjectGuidanceFollowedOperation(operation);
            event.stopPropagation();
        });

        var propagateObjectGuidanceFollowedOperation = function(operation){
            _iwc.sendRemoteNonOTOperation(operation.getNonOTOperation());
        };

        var processObjectGuidanceFollowedOperation = function(operation){
            _iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.GUIDANCE,operation.getNonOTOperation());
        };

        var onObjectGuidanceFollowedCallback = function(operation){
            if(operation instanceof ObjectGuidanceFollowedOperation)
                processObjectGuidanceFollowedOperation(operation)
        };

        var registerCallbacks = function(){
            _iwc.registerOnRemoteDataReceivedCallback(onObjectGuidanceFollowedCallback)
        };

        registerCallbacks();

        _$node.find(".label").append(_objectGuidanceRule.label);
        _$node.find(".label").css({
            "font-size": "60%",
            "text-align": "center"
        });

        this.get$node = function(){
            return _$node;
        };

        this.draw = function(){
            _$node.css({
                left: _appearance.left,
                top: _appearance.top,
                width: _appearance.width,
                height: _appearance.height,
                zIndex: 100000
            });
        };

        this.addToCanvas = function(canvas){
            _canvas = canvas;
            canvas.get$canvas().append(_$node);
        };

        this.remove = function(){
            _$node.remove();
        };
    };

    return ObjectGuidance;

});