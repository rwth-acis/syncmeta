define(['guidance_widget/GuidanceStrategy'
],function(GuidanceStrategy) {

    var NoStrategy = GuidanceStrategy.extend({
        init: function(guidanceRules, space){
            this._super(guidanceRules, space);
        },
        onEntitySelect: function(entityId, entityType){
            this.showObjectGuidance(entityId, []);
        },
        onUserJoin: function(user){

        }
    });

    NoStrategy.NAME = "No Strategy";

    return NoStrategy;

});
