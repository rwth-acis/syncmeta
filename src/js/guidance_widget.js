/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'require',
    'iwcw',
    'operations/non_ot/EntitySelectOperation',
    'guidance_widget/AvoidConflictsStrategy',
    'promise!GuidanceRules'
],function (require, IWCW, EntitySelectOperation, AvoidConflictsStrategy, GuidanceRules) {
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ACTIVITY);
    var guidanceStrategy = new AvoidConflictsStrategy(GuidanceRules);

    var operationCallback = function(operation){
        if(operation instanceof EntitySelectOperation){
            guidanceStrategy.onEntitySelect(operation.getSelectedEntityId(), operation.getSelectedEntityType());
        }
    };

    var registerCallbacks = function(){
        iwc.registerOnDataReceivedCallback(operationCallback);
    };

    registerCallbacks();
});