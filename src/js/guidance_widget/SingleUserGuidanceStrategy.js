define(['guidance_widget/GuidanceStrategy'
],function(GuidanceStrategy) {

    var SingleUserGuidanceStrategy = GuidanceStrategy.extend({
        init: function(logicalGuidanceDefinition, space){
            this._super(logicalGuidanceDefinition, space);
            this.initialNodes = this.logicalGuidanceDefinition.sources();
            this.nodeMappings = {};
            this.activityStatusList = {};
            this.lastCreatedObjectId = "";

            this.resetActivityStatusList();
        },
        onEntitySelect: function(entityId, entityType){
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
            this.lastCreatedObjectId = id;
            for(var activityId in this.activityStatusList){
                var activityStatus = this.activityStatusList[activityId];
                for(var i = 0; i < activityStatus.currentNodes.length; i++){
                    var nodeId = activityStatus.currentNodes[i];
                    var node = this.logicalGuidanceDefinition.node(nodeId);
                    if(node.type == "CREATE_OBJECT_ACTION" && node.objectType == type){
                        this.nodeMappings[node.createdObjectId] = id;
                        this.proceedInActivity(activityId, nodeId);
                    }
                }
            }
            this.showExpectedActions(id);
        },
        onEdgeAdd: function(id, type){
            for(var activityId in this.activityStatusList){
                var activityStatus = this.activityStatusList[activityId];
                for(var i = 0; i < activityStatus.currentNodes.length; i++){
                    var nodeId = activityStatus.currentNodes[i];
                    var node = this.logicalGuidanceDefinition.node(nodeId);
                    if(node.type == "CREATE_RELATIONSHIP_ACTION" && node.relationshipType == type){
                        this.proceedInActivity(activityId, nodeId);
                    }
                }
            }
            this.showExpectedActions(this.lastCreatedObjectId);
        },
        showExpectedActions: function(entityId){
            var guidanceItems = [];
            for(var activityId in this.activityStatusList){
                var activityStatus = this.activityStatusList[activityId];
                for(var i = 0; i < activityStatus.currentNodes.length; i++){
                    var nodeId = activityStatus.currentNodes[i];
                    var node = this.logicalGuidanceDefinition.node(nodeId);

                    switch(node.type){
                        case "SET_PROPERTY_ACTION":
                        guidanceItems.push(this.createSetPropertyGuidanceItem("", node));
                        break;
                        case "CREATE_OBJECT_ACTION":
                        guidanceItems.push(this.createSelectToolGuidanceItem("", node));
                        break;
                        case "CREATE_RELATIONSHIP_ACTION":
                        guidanceItems.push(this.createGhostEdgeGuidanceItem("", node));
                        break;
                    }
                }
            }
            this.showGuidanceBox(guidanceItems, entityId);
        },
        createSetPropertyGuidanceItem: function(id, action){
            var guidanceItem = {
                "id": id,
                "type": "SET_PROPERTY_GUIDANCE",
                "label": "Set " + action.propertyName + " property",
                "entityId": this.nodeMappings[action.sourceObjectId],
                "propertyName": action.propertyName
            };
            return guidanceItem;
        },
        createSelectToolGuidanceItem: function(id, action){
            var guidanceItem = {
                "id": id,
                "type": "SELECT_TOOL_GUIDANCE",
                "label": action.objectType,
                "tool": action.objectType
            };
            return guidanceItem;
        },
        createGhostEdgeGuidanceItem: function(id, action){
            var guidanceItem = {
                "id": id,
                "type": "GHOST_EDGE_GUIDANCE",
                "sourceId": this.nodeMappings[action.sourceObjectId],
                "targetId": this.nodeMappings[action.targetObjectId],
                "relationshipType": action.relationshipType
            };
            return guidanceItem;
        },
        proceedInActivity: function(activityId, nodeId){
            var nodesToResolve = this.logicalGuidanceDefinition.successors(nodeId);
            var currentNodes = [];
            while(nodesToResolve.length > 0){
                var nextNodesToResolve = [];
                for (var i = 0; i < nodesToResolve.length; i++){
                    var nodeId = nodesToResolve[i];
                    var node = this.logicalGuidanceDefinition.node(nodeId);
                    if(node.type == "SET_PROPERTY_ACTION"){
                        currentNodes.push(nodeId);
                        nextNodesToResolve = nextNodesToResolve.concat(this.logicalGuidanceDefinition.successors(nodeId));
                    }
                    else if(node.type == "MERGE_NODE"){
                        nextNodesToResolve = nextNodesToResolve.concat(this.logicalGuidanceDefinition.successors(nodeId));
                    }
                    else{
                        currentNodes.push(nodeId);
                    }
                }
                nodesToResolve = nextNodesToResolve;
            }
            
            var activityStatus = this.activityStatusList[activityId];
            activityStatus.currentNodes = currentNodes;
            console.log("Proceed in Activity!");
            console.log(activityStatus);
        },
        resetActivityStatusList: function(){
            this.activityStatusList = {};
            for(var i = 0; i < this.initialNodes.length; i++){
                var nodeId = this.initialNodes[i];
                var nodeData = this.logicalGuidanceDefinition.node(nodeId);
                this.activityStatusList[nodeId] = {
                    name: nodeData.name,
                    currentNodes: [nodeId]
                }
                this.proceedInActivity(nodeId, nodeId);
            }
        }
    });

    SingleUserGuidanceStrategy.NAME = "Single User Guidance Strategy";
    SingleUserGuidanceStrategy.ICON = "user";

    return SingleUserGuidanceStrategy;

});
