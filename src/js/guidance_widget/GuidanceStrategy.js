define([
    'iwcw',
    'operations/non_ot/ShowObjectGuidanceOperation',
    'operations/non_ot/ShowGuidanceBoxOperation',
    'classjs'
],function(IWCW ,ShowObjectGuidanceOperation, ShowGuidanceBoxOperation) {

    var GuidanceStrategy = Class.extend({
        init: function(logicalGuidanceDefinition, space){
            this.logicalGuidanceDefinition = logicalGuidanceDefinition;
            this.space = space;
            this.iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
        },
        // showObjectGuidance: function(objectId, logicalGuidanceDefinition){
        //     var operation = new ShowObjectGuidanceOperation(objectId, guidanceRules);
        //     this.iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
        // },
        showGuidanceBox: function(guidance){
            var operation = new ShowGuidanceBoxOperation(guidance);
            this.iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
        },
        onEntitySelect: function(entityId, entityType){
            //Override in child class to react to entity selection events
        },
        onUserJoin: function(user){
            //Override in child class to react to user join events   
        },
        onGuidanceFollowed: function(user, rule){
            //Override in child class to react to guidance followed events
        }
    });

    GuidanceStrategy.NAME = "Guidance Strategy";

    return GuidanceStrategy;

});
