/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'jqueryui',
    'lodash',
    'require',
    'iwcw',
    'operations/non_ot/EntitySelectOperation',
    'operations/non_ot/ObjectGuidanceFollowedOperation',
    'guidance_widget/NoStrategy',
    'guidance_widget/AvoidConflictsStrategy',
    'promise!GuidanceRules',
    'promise!Space'
],function ($, _, require, IWCW, EntitySelectOperation, ObjectGuidanceFollowedOperation, NoStrategy, AvoidConflictsStrategy, GuidanceRules, Space) {
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
    var strategies = [
        NoStrategy,
        AvoidConflictsStrategy
    ];
    var selectedStrategy = new strategies[0](GuidanceRules, Space);

    var $strategies = $("<div class='strategies'><select></select></div>");
    $('#guidance').append($strategies);

    for(var i = 0; i < strategies.length; i++){
        var strategy = strategies[i];
        var $strategy = $(_.template("<option>${name}</option>")({name: strategy.NAME}));
        $strategy.val(i);
        $strategies.find("select").append($strategy);
    }
    $strategies.find("select").change(function(){
        var index = $(this).val();
        selectedStrategy = new strategies[index](GuidanceRules, Space);
    });

    var operationCallback = function(operation){
        if(operation instanceof EntitySelectOperation){
            selectedStrategy.onEntitySelect(operation.getSelectedEntityId(), operation.getSelectedEntityType());
        }
        else if(operation instanceof ObjectGuidanceFollowedOperation){
            selectedStrategy.onGuidanceFollowed(operation.getNonOTOperation().getSender(), operation.getObjectId(), operation.getObjectGuidanceRule());
        }
    };

    var registerCallbacks = function(){
        iwc.registerOnDataReceivedCallback(operationCallback);
    };

    registerCallbacks();
});