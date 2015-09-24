define([
    'iwcotw',
    'jqueryui',
    'lodash',
    'operations/non_ot/ObjectGuidanceFollowedOperation',
    'text!templates/canvas_widget/abstract_node.html',
    'text!templates/guidance_modeling/select_tool_guidance.html'
],/** @lends ContextNode */function(IWCOTW, $,_,ObjectGuidanceFollowedOperation,abstractNodeHtml, selectToolGuidanceHtml) {
    function SelectToolGuidance(id, label, tool, canvas){
        var _iwc = IWCOTW.getInstance(CONFIG.WIDGET.NAME.MAIN);
        var _id = id;
        var _label = label;
        var _tool = tool;
        var _canvas = canvas;
        var _$node = $(_.template(selectToolGuidanceHtml, {text: label, icon:'plus-circle'}));

        _$node.click(function(){
            _canvas.mountTool(tool);
        });

        this.get$node = function(){
            return _$node;
        };

    };

    return SelectToolGuidance;

});