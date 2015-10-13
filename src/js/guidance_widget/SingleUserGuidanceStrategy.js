define(['Util','guidance_widget/GuidanceStrategy', 'guidance_widget/ActivityStatus'
],function(Util,GuidanceStrategy, ActivityStatus) {

    var SingleUserGuidanceStrategy = GuidanceStrategy.extend({
        init: function(logicalGuidanceDefinition, space){
            this._super(logicalGuidanceDefinition, space);
            this.initialNodes = this.logicalGuidanceDefinition.sources();
            this.nodeMappings = {};
            this.activityStatusList = {};
            this.lastCreatedObjectId = "";

            for(var i = 0; i < this.initialNodes.length; i++){
                var nodeId = this.initialNodes[i];
                this.activityStatusList[Util.generateRandomId()] = new ActivityStatus(this.logicalGuidanceDefinition, nodeId);
            }
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
                //Check if there is a fitting expected node
                var fittingNode = null;
                for(var i = 0; i < activityStatus.expectedNodes.length; i++){
                    var nodeId = activityStatus.expectedNodes[i];
                    var node = this.logicalGuidanceDefinition.node(nodeId);
                    if(node.type == "CREATE_OBJECT_ACTION" && node.objectType == type){
                        fittingNode = nodeId;
                        this.nodeMappings[node.createdObjectId] = id;
                        break;
                    }
                }
                if(!fittingNode){
                    activityStatus.reset();
                    for(var i = 0; i < activityStatus.expectedNodes.length; i++){
                        var nodeId = activityStatus.expectedNodes[i];
                        var node = this.logicalGuidanceDefinition.node(nodeId);
                        if(node.type == "CREATE_OBJECT_ACTION" && node.objectType == type){
                            fittingNode = nodeId;
                            this.nodeMappings[node.createdObjectId] = id;
                            break;
                        }
                    }
                }

                if(fittingNode)
                    activityStatus.proceed(fittingNode);

            }
            this.showExpectedActions(id);
        },
        onNodeDelete: function(id, type){
            this.showGuidanceBox([]);
        },
        onEdgeAdd: function(id, type){
            for(var activityId in this.activityStatusList){
                var activityStatus = this.activityStatusList[activityId];
                for(var i = 0; i < activityStatus.expectedNodes.length; i++){
                    var nodeId = activityStatus.expectedNodes[i];
                    var node = this.logicalGuidanceDefinition.node(nodeId);
                    if(node.type == "CREATE_RELATIONSHIP_ACTION" && node.relationshipType == type){
                        activityStatus.proceed(nodeId);
                    }
                }
            }
            this.showExpectedActions(this.lastCreatedObjectId);
        },
        showExpectedActions: function(entityId){
            var guidanceItems = [];
            for(var activityId in this.activityStatusList){
                var activityStatus = this.activityStatusList[activityId];
                for(var i = 0; i < activityStatus.expectedNodes.length; i++){
                    var nodeId = activityStatus.expectedNodes[i];
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
        resetActivityStatus: function(activityId){
            this.activityStatusList[activityId].currentNodes = [activityId];
            this.proceedInActivity(activityId, activityId);
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
