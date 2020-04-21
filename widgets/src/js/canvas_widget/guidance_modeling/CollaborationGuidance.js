define([
    'iwcw',
    'jqueryui',
    'lodash',
    'operations/non_ot/CollaborateInActivityOperation',
    'text!templates/guidance_modeling/collaboration_guidance.html'
],function(IWCW, $,_, CollaborateInActivityOperation, selectToolGuidanceHtml) {
    function CollaborationGuidance(id, label, activityId, objectId, canvas){
        var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);
        var _canvas = canvas;
        var _$node = $(_.template(selectToolGuidanceHtml, {text: label, icon:"users"}));

        _$node.click(function(){
            var operation = new CollaborateInActivityOperation(activityId);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.GUIDANCE, operation.toNonOTOperation());
            _canvas.hideGuidanceBox();
            _canvas.scrollNodeIntoView(objectId);
        });

        this.get$node = function(){
            return _$node;
        };

    }

    return CollaborationGuidance;

});