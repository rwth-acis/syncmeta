/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'iwcw',
    'operations/non_ot/EntitySelectOperation',
    'guidance_widget/GuidanceStrategy'
],function (IWCW, EntitySelectOperation, GuidanceStrategy) {
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ACTIVITY);
    var guidanceStrategy = new GuidanceStrategy();

    var operationCallback = function(operation){
        if(operation instanceof EntitySelectOperation){
            console.log("Entity select!");
            guidanceStrategy.establishContext(operation.getSelectedEntityId());
        }
    };

    var registerCallbacks = function(){
        iwc.registerOnDataReceivedCallback(operationCallback);
    };

    registerCallbacks();
});