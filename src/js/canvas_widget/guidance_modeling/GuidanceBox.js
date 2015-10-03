define([
    'iwcotw',
    'jqueryui',
    'lodash',
    'operations/non_ot/ObjectGuidanceFollowedOperation',
    'text!templates/canvas_widget/abstract_node.html',
    'text!templates/guidance_modeling/guidance_box_node.html'
],/** @lends ContextNode */function(IWCOTW, $,_,ObjectGuidanceFollowedOperation,abstractNodeHtml, guidanceBoxNodeHtml) {
    function GuidanceBox(id, left, top){
        var _iwc = IWCOTW.getInstance(CONFIG.WIDGET.NAME.MAIN);

        var _$node = $(_.template(abstractNodeHtml,{id: id})).append(guidanceBoxNodeHtml);
        var _canvas;

        var _appearance = {
            left: left,
            top: top
        };

        //registerCallbacks();


        this.get$node = function(){
            return _$node;
        };

        this.addGuidance = function(guidance){
            console.log("Add guidance");
            _$node.find(".buttons").append(guidance.get$node());
        };

        this.draw = function(){
            _$node.css({
                left: _appearance.left,
                top: _appearance.top,
                zIndex: 30000
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

    return GuidanceBox;

});