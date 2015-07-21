define(['iwcw','operations/non_ot/ShowObjectGuidanceOperation', 'classjs'
],function(IWCW ,ShowObjectGuidanceOperation) {

    var GuidanceStrategy = Class.extend({
        init: function(guidanceRules){
            this.guidanceRules = guidanceRules;
            this.iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
        },
        showObjectGuidance: function(objectId, guidanceRules){
            var operation = new ShowObjectGuidanceOperation(objectId, guidanceRules);
            this.iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
        },
        onEntitySelect: function(entityId, entityType){
            //Override in child class to react to entity selection events
        },
        onUserJoin: function(user){
            //Override in child class to react to user join events   
        }
    });

    return GuidanceStrategy;

});
