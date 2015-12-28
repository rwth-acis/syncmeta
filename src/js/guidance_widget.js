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
    'operations/non_ot/GuidanceStrategyOperation',
    'operations/ot/NodeAddOperation',
    'operations/ot/EdgeAddOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/ot/EdgeDeleteOperation',
    'guidance_widget/NoStrategy',
    'guidance_widget/AvoidConflictsStrategy',
    'guidance_widget/CollaborationStrategy',
    'promise!LogicalGuidanceDefinition',
    'promise!Space',
    'bootstrap'
],function ($, _, require, IWCW, EntitySelectOperation, ObjectGuidanceFollowedOperation, GuidanceStrategyOperation, NodeAddOperation, EdgeAddOperation, NodeDeleteOperation, EdgeDeleteOperation, NoStrategy, AvoidConflictsStrategy, CollaborationStrategy, LogicalGuidanceDefinition, Space) {
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
        initStrategy(index);
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
        else if (operation instanceof EdgeDeleteOperation){
            selectedStrategy.onEdgeDelete(operation.getEntityId(), operation.getType());
        }
        else if(operation instanceof GuidanceStrategyOperation){
            console.log("Received Guidance Strategy Operation");
            selectedStrategy.onGuidanceOperation(operation.getData());
        }
    };

    var sendGuidanceStrategyOperation = function(data){
        var operation = new GuidanceStrategyOperation(data);
        iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
    }

    var initStrategy = function(index){
        selectedStrategy = new strategies[index](LogicalGuidanceDefinition, Space);
        selectedStrategy.sendGuidanceStrategyOperation = sendGuidanceStrategyOperation;
        $("#guidance-strategy-ui").empty();
        $("#guidance-strategy-ui").append(selectedStrategy.buildUi());
        $("#strategyButton").text(strategies[index].NAME);
    }

    var registerCallbacks = function(){
        iwc.registerOnDataReceivedCallback(operationCallback);
    };

    registerCallbacks();
});