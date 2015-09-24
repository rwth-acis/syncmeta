define(['guidance_widget/GuidanceStrategy'
],function(GuidanceStrategy) {

    var AvoidConflictStrategy = GuidanceStrategy.extend({
        init: function(logicalGuidanceDefinition, space){
            this._super(logicalGuidanceDefinition, space);
            this.initialNodes = this.logicalGuidanceDefinition.sources();
        },
        onEntitySelect: function(entityId, entityType){
            if(entityId === null)
                return;
            
            this.showGuidanceBox([
                {
                    "id": "12345",
                    "type": "SELECT_TOOL_GUIDANCE",
                    "label": "Attribute",
                    "tool": "Attribute"
                },
                {
                    "id": "43212",
                    "type": "SELECT_TOOL_GUIDANCE",
                    "label": "Entity",
                    "tool": "Entity"
                }
            ]);
        },
        onUserJoin: function(user){

        },
        onGuidanceFollowed: function(user, objectId, rule){
            // if(user == this.space.user[CONFIG.NS.PERSON.JABBERID]){
            //     console.log("Self follow");
            // }
            // else{
            //     this.avoidObjects[objectId] = {};
            //     var that = this;
            //     setTimeout(function(){
            //         console.log("Timeout!");
            //         if(that.avoidObjects.hasOwnProperty(objectId))
            //             delete that.avoidObjects[objectId]
            //     },10000);
            // }
        }
    });

    AvoidConflictStrategy.NAME = "Avoid Conflicts Strategy";

    return AvoidConflictStrategy;

});
