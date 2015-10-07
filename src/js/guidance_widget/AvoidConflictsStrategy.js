define(['guidance_widget/GuidanceStrategy'
],function(GuidanceStrategy) {

    var AvoidConflictStrategy = GuidanceStrategy.extend({
        init: function(logicalGuidanceDefinition, space){
            this._super(logicalGuidanceDefinition, space);
            this.initialNodes = this.logicalGuidanceDefinition.sources();
            this.currentAction = null;
            this.expectedActions = [];
            this.nodeMappings = {};
        },
        onEntitySelect: function(entityId, entityType){
            console.log("Entity select!");
            if(entityId === null)
                return;
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
        },
        onNodeAdd: function(id, type){
            //If there are no expected actions anticipate the next action based
            //on the starting actions of activities
            var expected = [];
            if(this.expectedActions.length == 0){
                for(var i = 0; i < this.initialNodes.length; i++){
                    var successors = this.logicalGuidanceDefinition.successors(this.initialNodes[i]);
                    for(var j = 0; j < successors.length; j++){
                        var successor = this.logicalGuidanceDefinition.node(successors[j]);
                        console.log(successor);
                        if(successor.type == "CREATE_OBJECT_ACTION" && successor.objectType == type){
                            expected = expected.concat(this.logicalGuidanceDefinition.successors(successors[j]));
                            this.nodeMappings[successor.createdObjectId] = id;
                        }
                    }
                }
                this.expectedActions = expected;
                this.resolveMergeNodes();
                this.showExpectedActions(id);
            }
            else{
                for(var i = 0; i < this.expectedActions.length; i++){
                    var action = this.logicalGuidanceDefinition.node(this.expectedActions[i]);
                    if(action.type == "CREATE_OBJECT_ACTION" && action.objectType == type){
                        expected = expected.concat(this.logicalGuidanceDefinition.successors(this.expectedActions[i]));
                        this.nodeMappings[action.createdObjectId] = id;
                    }
                }
                this.expectedActions = expected;
                this.resolveMergeNodes();
                this.showExpectedActions(id);
            }
        },
        onEdgeAdd: function(id, type){
            var expected = [];
            for(var i = 0; i < this.expectedActions.length; i++){
                var action = this.logicalGuidanceDefinition.node(this.expectedActions[i]);
                if(action.type == "CREATE_RELATIONSHIP_ACTION" && action.relationshipType == type){
                    expected = expected.concat(this.logicalGuidanceDefinition.successors(this.expectedActions[i]));
                }
            }
            this.expectedActions = expected;
            this.resolveMergeNodes();
            //this.showExpectedActions(id);
        },
        showExpectedActions: function(entityId){
            console.log("Expected actions")
            console.log(this.expectedActions);
            var guidanceItems = [];
            for(var i = 0; i < this.expectedActions.length; i++){
                var action = this.logicalGuidanceDefinition.node(this.expectedActions[i]);
                console.log(action);
                switch(action.type){
                case "SET_PROPERTY_ACTION":
                    guidanceItems.push({
                        "id": "12345",
                        "type": "SET_PROPERTY_GUIDANCE",
                        "label": "Set " + action.propertyName + " property",
                        "entityId": this.nodeMappings[action.sourceObjectId],
                        "propertyName": action.propertyName
                    });
                    break;
                case "CREATE_OBJECT_ACTION":
                    guidanceItems.push({
                        "id": "12345",
                        "type": "SELECT_TOOL_GUIDANCE",
                        "label": action.objectType,
                        "tool": action.objectType
                    });
                    break;
                case "CREATE_RELATIONSHIP_ACTION":
                    guidanceItems.push({
                        "id": "12345",
                        "type": "GHOST_EDGE_GUIDANCE",
                        "sourceId": this.nodeMappings[action.sourceObjectId],
                        "targetId": this.nodeMappings[action.targetObjectId],
                        "relationshipType": action.relationshipType
                    });
                    break;

                }
            }
            if(guidanceItems.length == 0)
                this.expectedActions = [];
            this.showGuidanceBox(guidanceItems, entityId);
        },
        resolveMergeNodes: function(){
            var expected = [];
            for(var i = 0; i < this.expectedActions.length; i++){
                var action = this.logicalGuidanceDefinition.node(this.expectedActions[i]);
                if(action.type == "MERGE_NODE"){
                    var mergeSuccessors = this.logicalGuidanceDefinition.successors(this.expectedActions[i]);
                    expected = expected.concat(mergeSuccessors);
                }
                else{
                    expected.push(this.expectedActions[i]);
                }
            }
            console.log("Resolve merge node");
            console.log(expected);
            this.expectedActions = expected;
        }
    });

    AvoidConflictStrategy.NAME = "Avoid Conflicts Strategy";

    return AvoidConflictStrategy;

});
