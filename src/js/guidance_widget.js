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
    'operations/ot/NodeAddOperation',
    'operations/ot/EdgeAddOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/non_ot/ShareGuidanceActivityOperation',
    'guidance_widget/NoStrategy',
    'guidance_widget/AvoidConflictsStrategy',
    'guidance_widget/CollaborationStrategy',
    'promise!LogicalGuidanceDefinition',
    'promise!Space',
    'bootstrap'
],function ($, _, require, IWCW, EntitySelectOperation, ObjectGuidanceFollowedOperation, NodeAddOperation, EdgeAddOperation, NodeDeleteOperation, ShareGuidanceActivityOperation, NoStrategy, AvoidConflictsStrategy, CollaborationStrategy, LogicalGuidanceDefinition, Space) {
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
    var strategies = [
        NoStrategy,
        AvoidConflictsStrategy,
        CollaborationStrategy
    ];
    var selectedStrategy = new strategies[0](LogicalGuidanceDefinition, Space);
    selectedStrategy.buildUi();

    var $strategies = $("#guidanceSelect");

    for(var i = 0; i < strategies.length; i++){
        var strategy = strategies[i];
        var $strategy = $(_.template("<li><a href='javascript:;'><i class='fa fa-${icon}' style='margin-right:5px;'></i>${name}</a></li>")({name: strategy.NAME, icon: strategy.ICON}));
        $strategy.find("a").val(i);
        $strategies.append($strategy);
    }
    $strategies.find("a").click(function(){
        var index = $(this).val();
        selectedStrategy = new strategies[index](LogicalGuidanceDefinition, Space);
        $("#guidance-strategy-ui").empty();
        $("#guidance-strategy-ui").append(selectedStrategy.buildUi());
        $("#strategyButton").text(strategies[index].NAME);
    });

    var operationCallback = function(operation){
        if(operation instanceof EntitySelectOperation){
            selectedStrategy.onEntitySelect(operation.getSelectedEntityId(), operation.getSelectedEntityType());
        }
        else if(operation instanceof ObjectGuidanceFollowedOperation){
            selectedStrategy.onGuidanceFollowed(operation.getNonOTOperation().getSender(), operation.getObjectId(), operation.getObjectGuidanceRule());
        }
        else if(operation instanceof NodeAddOperation){
            selectedStrategy.onNodeAdd(operation.getEntityId(), operation.getType());
        }
        else if (operation instanceof EdgeAddOperation){
            selectedStrategy.onEdgeAdd(operation.getEntityId(), operation.getType());
        }
        else if (operation instanceof NodeDeleteOperation){
            selectedStrategy.onNodeDelete(operation.getEntityId(), operation.getType());
        }
    };

    var registerCallbacks = function(){
        iwc.registerOnDataReceivedCallback(operationCallback);
    };

    registerCallbacks();
});