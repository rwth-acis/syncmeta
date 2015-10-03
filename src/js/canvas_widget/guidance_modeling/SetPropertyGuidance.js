define([
    'iwcotw',
    'jqueryui',
    'lodash',
    'operations/non_ot/ObjectGuidanceFollowedOperation',
    'text!templates/canvas_widget/abstract_node.html',
    'text!templates/guidance_modeling/select_tool_guidance.html'
],/** @lends ContextNode */function(IWCOTW, $,_,ObjectGuidanceFollowedOperation,abstractNodeHtml, selectToolGuidanceHtml) {
    function SetPropertyGuidance(id, label, entityId, propertyName, canvas){
        var _iwc = IWCOTW.getInstance(CONFIG.WIDGET.NAME.MAIN);
        var _id = id;
        var _label = label;
        var _entityId = entityId;
        var _propertyName = propertyName;
        var _canvas = canvas;
        var _$node = $(_.template(selectToolGuidanceHtml, {text: label, icon:'edit'}));

        _$node.click(function(){
            console.log("Set property");
        });

        _$node.hover(function(){
            console.log("Hover");
            if(_entityId)
                _canvas.highlightNode(_entityId);
        },
        function(){
            console.log("Unhover");
            if(_entityId)
                _canvas.unhighlightNode(_entityId);
        });

        this.get$node = function(){
            return _$node;
        };

    };

    return SetPropertyGuidance;

});