define([
    'iwcotw',
    'jqueryui',
    'lodash',
    'text!templates/guidance_modeling/collaboration_guidance.html'
],/** @lends ContextNode */function(IWCOTW, $,_, selectToolGuidanceHtml) {
    function CollaborationGuidance(id, label, tool, canvas){
        var _iwc = IWCOTW.getInstance(CONFIG.WIDGET.NAME.MAIN);
        var _id = id;
        var _label = label;
        var _canvas = canvas;
        var _$node = $(_.template(selectToolGuidanceHtml, {text: label}));

        _$node.click(function(){
            console.log("Click on collaboration guidance");
        });

        this.get$node = function(){
            return _$node;
        };

    };

    return CollaborationGuidance;

});