/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'require',
    'iwcw',
    'operations/non_ot/EntitySelectOperation',
    'guidance_widget/GuidanceStrategy',
    'promise!GuidanceRules'
],function (require, IWCW, EntitySelectOperation, GuidanceStrategy, GuidanceRules) {
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ACTIVITY);
    var guidanceStrategy = new GuidanceStrategy(GuidanceRules);

    var operationCallback = function(operation){
        if(operation instanceof EntitySelectOperation){
            guidanceStrategy.establishContext(operation.getSelectedEntityId(), operation.getSelectedEntityType());
        }
    };

    var registerCallbacks = function(){
        iwc.registerOnDataReceivedCallback(operationCallback);
    };

    registerCallbacks();
});