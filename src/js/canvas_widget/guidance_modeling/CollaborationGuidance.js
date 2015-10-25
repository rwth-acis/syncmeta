define([
    'iwcotw',
    'jqueryui',
    'lodash',
    'text!templates/guidance_modeling/collaboration_guidance.html'
],/** @lends ContextNode */function(IWCOTW, $,_, selectToolGuidanceHtml) {
    function CollaborationGuidance(id, label, activityId, canvas){
        var _iwc = IWCOTW.getInstance(CONFIG.WIDGET.NAME.MAIN);
        var _id = id;
        var _label = label;
        var _canvas = canvas;
        var _activityId = activityId;
        var _$node = $(_.template(selectToolGuidanceHtml, {text: label, icon:"users"}));

        _$node.click(function(){
            console.log("Click on collaboration guidance");
        });

        this.get$node = function(){
            return _$node;
        };

    };

    return CollaborationGuidance;

});