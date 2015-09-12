define(['guidance_widget/GuidanceStrategy'
],function(GuidanceStrategy) {

    var AvoidConflictStrategy = GuidanceStrategy.extend({
        init: function(logicalGuidanceDefinition, space){
            this._super(logicalGuidanceDefinition, space);
        },
        onEntitySelect: function(entityId, entityType){
            // var relevantRules = this.guidanceRules.objectToolRules.filter(function(rule){
            //     return rule.srcObjectType == entityType;
            // });

            // if(this.avoidObjects.hasOwnProperty(entityId))
            //     relevantRules = [];

            // this.showObjectGuidance(entityId, relevantRules);
            this.showGuidanceBox([
                {
                    "id": "12345",
                    "type": "SELECT_TOOL_GUIDANCE",
                    "label": "Create a new attribute",
                    "tool": "Attribute"
                },
                {
                    "id": "43212",
                    "type": "SELECT_TOOL_GUIDANCE",
                    "label": "Create a new entity",
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
