define([
    'iwcw',
    'operations/non_ot/ShowObjectGuidanceOperation',
    'operations/non_ot/ShowGuidanceBoxOperation',
    'graphlib',
    'classjs'
],function(IWCW ,ShowObjectGuidanceOperation, ShowGuidanceBoxOperation, graphlib) {

    var GuidanceStrategy = Class.extend({
        init: function(logicalGuidanceDefinition, space){
            this.logicalGuidanceDefinition = graphlib.json.read(logicalGuidanceDefinition);
            this.space = space;
            this.iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
        },
        showGuidanceBox: function(guidance, entityId){
            var operation = new ShowGuidanceBoxOperation(guidance, entityId);
            this.iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
        },
        onEntitySelect: function(entityId, entityType){
            //Override in child class to react to entity selection events
        },
        onUserJoin: function(user){
            //Override in child class to react to user join events   
        },
        onGuidanceFollowed: function(guidanceId){
            //Override in child class to react to guidance followed events
        },
        onNodeAdd: function(id, type){
            //Override in child class to react to node add events
        }
    });

    GuidanceStrategy.NAME = "Guidance Strategy";

    return GuidanceStrategy;

});
