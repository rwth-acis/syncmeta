define([
    'jqueryui',
    'lodash',
    'text!templates/canvas_widget/abstract_node.html'
],/** @lends ContextNode */function($,_,abstractNodeHtml) {
    function ObjectGuidance(id, $shape, left, top, width, height, srcObjectId, objectGuidanceRule){
        var _$node = $(_.template(abstractNodeHtml,{id: id})).append($shape.clone());
        var _canvas;

        var _srcObjectId = srcObjectId;
        var _objectGuidanceRule = objectGuidanceRule;
        
        var _isSelected = false;

        console.log(height);
        var _appearance = {
            left: left,
            top: top,
            width: width,
            height: height
        };

        var $edge = null;

        _$node
        .click(function(event) {
            console.log("click");
            _isSelected = !_isSelected;
            var nodeId = _canvas.createNode(_objectGuidanceRule.destObjectType, _appearance.left, _appearance.top, width, height);
            _canvas.createEdge(_objectGuidanceRule.relationshipType, _srcObjectId, nodeId);
            _canvas.hideObjectGuidance();
            event.stopPropagation();
        });

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