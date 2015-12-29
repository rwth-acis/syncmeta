define(['guidance_widget/GuidanceStrategy'
],function(GuidanceStrategy) {

    var NoStrategy = GuidanceStrategy.extend({
        init: function(logicalGuidanceRepresentation, space){
            this._super(logicalGuidanceRepresentation, space);
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
