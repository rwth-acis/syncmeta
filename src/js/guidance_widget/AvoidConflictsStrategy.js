define(['guidance_widget/GuidanceStrategy'
],function(GuidanceStrategy) {

    var AvoidConflictStrategy = GuidanceStrategy.extend({
        init: function(guidanceRules){
            this._super(guidanceRules);
        },
        onEntitySelect: function(entityId, entityType){
            var relevantRules = this.guidanceRules.objectToolRules.filter(function(rule){
                return rule.srcObjectType == entityType;
            });

            this.showObjectGuidance(entityId, relevantRules);
        },
        onUserJoin: function(user){

        }
    });

    return AvoidConflictStrategy;

});
