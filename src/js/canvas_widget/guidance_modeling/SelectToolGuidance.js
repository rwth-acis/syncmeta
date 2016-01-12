define([
    'iwcotw',
    'jqueryui',
    'lodash',
    'text!templates/guidance_modeling/select_tool_guidance.html'
],function(IWCOTW, $,_, selectToolGuidanceHtml) {
    function SelectToolGuidance(id, label, tool, canvas, icon){
        //var _iwc = IWCOTW.getInstance(CONFIG.WIDGET.NAME.MAIN);
        //var _id = id;
        //var _label = label;
        //var _tool = tool;
        var _canvas = canvas;
        var _$node = $(_.template(selectToolGuidanceHtml, {text: label, icon: icon || 'plus-circle'}));

        _$node.click(function(){
            _canvas.mountTool(tool);
            _canvas.hideGuidanceBox();
           //guidanceFollowed does not exists, seems to be unnecessary and obsolete
           // _canvas.guidanceFollowed();
        });

        this.get$node = function(){
            return _$node;
        };

    }

    return SelectToolGuidance;

});