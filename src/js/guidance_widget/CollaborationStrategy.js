define(['Util', 'iwcw', 'guidance_widget/GuidanceStrategy', 'guidance_widget/ActivityStatus','operations/non_ot/ShareGuidanceActivityOperation', 'operations/non_ot/RevokeSharedActivityOperation','operations/non_ot/CollaborateInActivityOperation', 'operations/non_ot/MoveCanvasOperation', 'text!templates/guidance_modeling/guidance_strategy_ui.html'
],function(Util,IWCW,GuidanceStrategy, ActivityStatus, ShareGuidanceActivityOperation, RevokeSharedActivityOperation, CollaborateInActivityOperation, MoveCanvasOperation, guidanceStrategyUiHtml) {

    var CollaborationStrategy = GuidanceStrategy.extend({
        init: function(logicalGuidanceDefinition, space){
            this._super(logicalGuidanceDefinition, space);
            this.initialNodes = this.logicalGuidanceDefinition.sources();
            this.nodeMappings = {};
            this.activityStatusList = {};
            this.lastCreatedObjectId = "";
            this.currentActivity = null;
            this.activityHistory = [];
            this.ui = "";
            this.sharedActivities = {};

            for(var i = 0; i < this.initialNodes.length; i++){
                var nodeId = this.initialNodes[i];
                this.activityStatusList[Util.generateRandomId()] = new ActivityStatus(this.logicalGuidanceDefinition, nodeId);
            }

            this.iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
            this.iwc.registerOnDataReceivedCallback(this.onShareGuidanceActivityOperation, this);
            this.iwc.registerOnDataReceivedCallback(this.onRevokeSharedActivityOperation, this);
            this.iwc.registerOnDataReceivedCallback(this.onCollaborateInActivityOperation, this);
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
        checkNodeAddForActivity: function(id, type, activityStatus){
            var activityExpectedNodes = activityStatus.getExpectedNodes();
            for(var i = 0; i < activityExpectedNodes.length; i++){
                var nodeId = activityExpectedNodes[i];
                var node = this.logicalGuidanceDefinition.node(nodeId);
                if(node.type == "CREATE_OBJECT_ACTION" && node.objectType == type){
                    return nodeId;
                }
            }
            return null;
        },
        checkEdgeAddForActivity: function(id, type, activityStatus){
            var activityExpectedNodes = activityStatus.getExpectedNodes();
            for(var i = 0; i < activityExpectedNodes.length; i++){
                var nodeId = activityExpectedNodes[i];
                var node = this.logicalGuidanceDefinition.node(nodeId);
                if(node.type == "CREATE_RELATIONSHIP_ACTION" && node.relationshipType == type){
                    return nodeId;
                }
            }
            return null;
        },
        onNodeAdd: function(id, type){
            this.lastCreatedObjectId = id;
            var nextNode = null;
            //Check if we can proceed in the current activity
            if(this.currentActivity){
                nextNode = this.checkNodeAddForActivity(id, type, this.currentActivity);
            }
            //If we could not proceed check if we can start a new activity
            if(!nextNode){
                this.addActivityToHistory(this.currentActivity);
                this.currentActivity = null;
                for(var i = 0; i < this.initialNodes.length; i++){
                    var nodeId = this.initialNodes[i];
                    var newActivity = new ActivityStatus(this.logicalGuidanceDefinition, nodeId);
                    nextNode = this.checkNodeAddForActivity(id, type, newActivity);
                    if(nextNode){
                        this.currentActivity = newActivity;
                        break;
                    }
                }
            }
            if(this.currentActivity){
                var node = this.logicalGuidanceDefinition.node(nextNode);
                this.currentActivity.setNodeMapping(node.createdObjectId, id);
                this.currentActivity.proceed(nextNode);
            }
            this.highlightActiveActivity();
            this.showExpectedActions(id);
        },
        onNodeDelete: function(id, type){
            this.showGuidanceBox("", []);
        },
        onEdgeAdd: function(id, type){
            var nextNode = null;
            if(this.currentActivity){
                nextNode = this.checkEdgeAddForActivity(id, type, this.currentActivity)
            }
            if(nextNode)
                this.currentActivity.proceed(nextNode);
            else
                this.currentActivity = null;
            
            this.showExpectedActions(this.lastCreatedObjectId);
        },
        showExpectedActions: function(entityId){
            var guidanceItems = [];
            var activityName = "";

            if(this.currentActivity){
                activityName = this.currentActivity.getName();
                var activityExpectedNodes = this.currentActivity.getExpectedNodes();
                for(var i = 0; i < activityExpectedNodes.length; i++){
                    var nodeId = activityExpectedNodes[i];
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
                        case "ACTIVITY_FINAL_NODE":
                        break;
                    }
                }
            }

            //Add collaboration guidance
            for(var activityId in this.sharedActivities){
                var activity = this.sharedActivities[activityId];
                guidanceItems.push(this.createCollaborationGuidanceItem(activity));
            }
            this.showGuidanceBox(activityName, guidanceItems, entityId);
        },
        createSetPropertyGuidanceItem: function(id, action){
            var guidanceItem = {
                "id": id,
                "type": "SET_PROPERTY_GUIDANCE",
                "label": "Set " + action.propertyName + " property",
                "entityId": this.currentActivity.getNodeMapping(action.sourceObjectId),
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
                "sourceId": this.currentActivity.getNodeMapping(action.sourceObjectId),
                "targetId": this.currentActivity.getNodeMapping(action.targetObjectId),
                "relationshipType": action.relationshipType
            };
            return guidanceItem;
        },
        createCollaborationGuidanceItem: function(activity){
            var guidanceItem = {
                "type": "COLLABORATION_GUIDANCE",
                "activityId": activity.id,
                "label": "Help",
                "objectId": activity.lastAddedNode
            };
            return guidanceItem;
        },
        buildUi: function(){
            this.ui = $(guidanceStrategyUiHtml);
            //Create the available guidance list
            var guidanceList = this.ui.find(".guidance-list")
            for(var i = 0; i < this.initialNodes.length; i++){
                var nodeId = this.initialNodes[i];
                var node = this.logicalGuidanceDefinition.node(nodeId);
                var listItem = $("<li class='bs-list-group-item guidance-item'><p><i class='fa fa-puzzle-piece' style='margin-right:5px;'></i><span class='name'></span></p><p><small class='bs-text-muted description'></small></p></li>");
                listItem.attr("id", nodeId + "guidance-text");
                listItem.find(".name").text(node.name);
                //Get expected start nodes to create the description text
                var tempActivity = new ActivityStatus(this.logicalGuidanceDefinition, nodeId);
                var expectedNodes = tempActivity.getExpectedNodes();

                listItem.find(".description").text(this.getDescriptionTextForAction(expectedNodes[0]) + " to start this activity.");
                guidanceList.append(listItem);
            }
            return this.ui;
        },
        highlightActiveActivity: function(){
            $(".guidance-item").removeClass("bs-list-group-item-info");
            if(this.currentActivity){
                var nodeId = this.currentActivity.initialNode;
                $('#' + nodeId + 'guidance-text').addClass("bs-list-group-item-info");
            }
        },
        getDescriptionTextForAction: function(nodeId){
            var node = this.logicalGuidanceDefinition.node(nodeId);
            switch(node.type){
                case "CREATE_OBJECT_ACTION":
                    return "Create a new " + node.objectType;
                    break;
                default:
                    break;

            }
        },
        addActivityToHistory: function(activity){
            if(activity == null)
                return;
            if(this.activityHistory.length > 4){
                this.activityHistory.shift();
            }
            this.activityHistory.push(activity);

            var historyList = this.ui.find(".history-list")
            historyList.find(".guidance-history-item").off("click");
            historyList.empty();
            var that = this;
            for(var i = this.activityHistory.length - 1; i >= 0; i--){
                var activity = this.activityHistory[i];
                var nodeId = activity.initialNode;
                var node = this.logicalGuidanceDefinition.node(nodeId);
                var listItem = $("<li class='bs-list-group-item guidance-history-item' style='cursor: pointer;'><p><i class='fa fa-puzzle-piece' style='margin-right:5px;'></i><span class='name'></span></p><p><small class='bs-text-muted description'></small></p></li>");
                listItem.attr("id", nodeId + "guidance-history-item");
                listItem.find(".name").text(node.name);
                listItem.val(i);
                listItem.click(function(){
                    var id = $(this).val();
                    var currentActivity = that.currentActivity;
                    that.currentActivity = that.activityHistory[id];
                    that.showExpectedActions(that.currentActivity.lastAddedNode);
                    var operation = new MoveCanvasOperation(that.currentActivity.lastAddedNode, false);
                    that.iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
                    that.addActivityToHistory(currentActivity);
                });
                historyList.append(listItem);
            }
        },
        onShareGuidanceActivityOperation: function(operation){
            if(operation instanceof ShareGuidanceActivityOperation){
                console.log("Received remote share guidance op!!!");
                var activity = ActivityStatus.createFromShareOperation(this.logicalGuidanceDefinition, operation);
                this.sharedActivities[activity.id] = activity;
            }
        },
        onRevokeSharedActivityOperation: function(operation){
            if(operation instanceof RevokeSharedActivityOperation){
                console.log("Received remote revoke guidance op!!!");
                if(this.sharedActivities.hasOwnProperty(operation.getId())){
                    delete this.sharedActivities[operation.getId()];
                }
            }
        },
        onCollaborateInActivityOperation: function(operation){
            if(operation instanceof CollaborateInActivityOperation){
                console.log("I want to collaborate!!!");
                if(this.sharedActivities.hasOwnProperty(operation.getId())){
                    this.addActivityToHistory(this.currentActivity);
                    this.currentActivity = this.sharedActivities[operation.getId()];
                    delete this.sharedActivities[operation.getId()];
                    this.currentActivity.computeExpectedNodes();
                    this.showExpectedActions(this.currentActivity.lastAddedNode);
                }
            }
        }
    });

    CollaborationStrategy.NAME = "Collaboration Strategy";
    CollaborationStrategy.ICON = "users";

    return CollaborationStrategy;

});
