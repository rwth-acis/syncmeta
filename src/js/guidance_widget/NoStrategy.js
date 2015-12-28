define(['guidance_widget/GuidanceStrategy'
],function(GuidanceStrategy) {

    var NoStrategy = GuidanceStrategy.extend({
        init: function(logicalGuidanceDefinition, space){
            this._super(logicalGuidanceDefinition, space);
            this.showGuidanceBox("", []);
        },
        onEntitySelect: function(entityId, entityType){
        },
        onUserJoin: function(user){

        }
    });

    NoStrategy.NAME = "No Strategy";
    NoStrategy.ICON = "ban";

    return NoStrategy;

});
