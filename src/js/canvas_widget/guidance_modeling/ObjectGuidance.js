define([
    'jqueryui',
    'lodash',
    'text!templates/canvas_widget/abstract_node.html'
],/** @lends ContextNode */function($,_,abstractNodeHtml) {
    function ObjectGuidance(id, $shape, left, top, width, height){
        var _$node = $(_.template(abstractNodeHtml,{id: id})).append($shape.clone());
        var _canvas;

        var _appearance = {
            left: left,
            top: top,
            width: width,
            height: height
        };

        var $edge = null;

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

        };
    };

    return ObjectGuidance;

});