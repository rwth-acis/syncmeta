define([
    'Util',
    'guidance_widget/ConcurrentRegion',
    'classjs',
    'graphlib'
],function(Util,ConcurrentRegion) {

    var ActivityStatus = Class.extend({
        init: function(logicalGuidanceRepresentation, initialNode, strategy){
            this.id = Util.generateRandomId();
            this.logicalGuidanceRepresentation = logicalGuidanceRepresentation;
            this.initialNode = initialNode;
            this.currentNode = initialNode;
            this.name = logicalGuidanceRepresentation.node(initialNode).name || "";
            this.computeExpectedNodes();
            this.currentSubActivity = null;
            this.possibleSubActivities = [];
            this.nodeMappings = {};
            this.concurrentRegion = null;
            this.nodeHistory = [];
            this.strategy = strategy;
            this.isOwner = true;
        },
        computeExpectedNodes: function(){
            var nodesToResolve = this.logicalGuidanceRepresentation.successors(this.currentNode);
            var expectedNodes = [];
            this.possibleSubActivities = [];
            while(nodesToResolve.length > 0){
                console.log("Nodes to resolve: ");
                console.log(nodesToResolve);
                var nextNodesToResolve = [];
                for (var i = 0; i < nodesToResolve.length; i++){
                    var nodeId = nodesToResolve[i];
                    var node = this.logicalGuidanceRepresentation.node(nodeId);
                    if(node.type == "SET_PROPERTY_ACTION"){
                        expectedNodes.push(nodeId);
                        nextNodesToResolve = nextNodesToResolve.concat(this.logicalGuidanceRepresentation.successors(nodeId));
                    }
                    else if(node.type == "MERGE_NODE"){
                        nextNodesToResolve = nextNodesToResolve.concat(this.logicalGuidanceRepresentation.successors(nodeId));
                    }
                    else if(node.type == "CALL_ACTIVITY_ACTION"){
                        var subActivity = new ActivityStatus(this.logicalGuidanceRepresentation, node.initialNodeId, this.strategy);
                        subActivity.lastAddedNode = this.lastAddedNode;
                        subActivity.nodeMappings = this.nodeMappings;
                        this.possibleSubActivities.push(subActivity);
                        expectedNodes = expectedNodes.concat(subActivity.getExpectedNodes());
                    }
                    else if(node.type == "CONCURRENCY_NODE"){
                        //Check if it is a fork or a join node
                        var ingoing = this.logicalGuidanceRepresentation.predecessors(nodeId).length;
                        var outgoing = this.logicalGuidanceRepresentation.successors(nodeId).length;
                        if(outgoing > ingoing){
                            // Fork node
                            if(!this.concurrentRegion)
                                this.concurrentRegion = new ConcurrentRegion(this, this.logicalGuidanceRepresentation, nodeId);
                            nextNodesToResolve.push(this.concurrentRegion.getCurrentThreadStart());
                        }
                        else{
                            // Join node
                            if(this.concurrentRegion.isLastThread() && this.concurrentRegion.isOwner()){
                                //If it is the last thread we can take the actions after the join node
                                nextNodesToResolve = nextNodesToResolve.concat(this.logicalGuidanceRepresentation.successors(nodeId));
                            }
                            else{
                                //If it is not the last thread we take the actions of the next thread
                                var nextThreadStart = this.concurrentRegion.getNextThreadStart();
                                if(nextThreadStart)
                                    nextNodesToResolve.push(nextThreadStart);
                            }
                        }
                    }
                    else{
                        expectedNodes.push(nodeId);
                    }
                }
                nodesToResolve = nextNodesToResolve;
            }
            
            expectedNodes = expectedNodes.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
            });
            this.expectedNodes = expectedNodes;
        },
        proceed: function(nodeId){
            var node = this.logicalGuidanceRepresentation.node(nodeId);
            //Are we entering a subactivity?
            if(!this.currentSubActivity && this.possibleSubActivities.length > 0){
                for(var i = 0; i < this.possibleSubActivities.length; i++){
                    var subActivity = this.possibleSubActivities[i];
                    if(subActivity.getExpectedNodes().indexOf(nodeId) >= 0){
                        this.currentSubActivity = subActivity;
                        this.nodeHistory.push(this.currentNode);
                        this.currentNode = subActivity.initialNode;
                    }
                }
            }
            //Are we proceeding in an active subactivity?
            if(this.currentSubActivity && this.currentSubActivity.getExpectedNodes().indexOf(nodeId) >= 0){
                this.currentSubActivity.proceed(nodeId);
            }
            //Are we proceeding in the main activity?
            else{
                this.currentSubActivity = null;
                this.nodeHistory.push(this.currentNode);
                this.currentNode = nodeId;
                //Check if we are in a concurrent region and have advanced there
                if(this.concurrentRegion){
                    this.concurrentRegion.update(nodeId);
                    if(this.concurrentRegion.isFinished()){
                        this.concurrentRegion = null;
                    }
                }
                this.computeExpectedNodes();
            }
        },
        revertLastAction: function(){
            if(this.nodeHistory.length == 0){
                return;
            }
            if(this.currentSubActivity){
                console.log("Revert subactivity action!");
                this.currentSubActivity.revertLastAction();
            }
            else{
                this.currentNode = this.nodeHistory.pop();
                this.computeExpectedNodes();
            }
        },
        getExpectedNodes: function(){
            var expectedNodes = [];
            if(this.currentSubActivity){
                expectedNodes = this.currentSubActivity.getExpectedNodes();
                if(this.currentSubActivity.reachesEnd()){
                    this.computeExpectedNodes();
                    expectedNodes = expectedNodes.concat(this.expectedNodes);
                }
            }
            else{
                expectedNodes =  this.expectedNodes;
            }

            return expectedNodes;
        },
        reset: function(){
            this.currentSubActivity = null;
            this.currentNode = this.initialNode;
            this.computeExpectedNodes();
            this.nodeMappings = {};
        },
        isAtStart: function(){
            return this.currentNode == this.initialNode;
        },
        reachesEnd: function(){
            for(var i = 0; i < this.expectedNodes.length; i++){
                var nodeId = this.expectedNodes[i];
                var node = this.logicalGuidanceRepresentation.node(nodeId);
                if(node.type == "ACTIVITY_FINAL_NODE")
                    return true;
            }
            return false;
        },
        getName: function(){
            var name = this.name;
            if(this.currentSubActivity)
                name = name + " > " + this.currentSubActivity.getName();
            return name;
        },
        setNodeMapping: function(guidanceNodeId, modelNodeId){
            this.lastAddedNode = modelNodeId;
            this.nodeMappings[guidanceNodeId] = modelNodeId;
        },
        getNodeMapping: function(guidanceNodeId){
            return this.nodeMappings[guidanceNodeId];
        },
        shareActivityOperation: function(joinNode, remainingThreads){
            var data = {
                operationType: "CollaborationStrategy:ShareActivity",
                joinNode: joinNode,
                remainingThreads: remainingThreads,
                id: this.id,
                initialNode: this.initialNode,
                objectMappings: this.nodeMappings,
                objectId: this.lastAddedNode,
                sender: this.strategy.getUserName()
            };
            this.strategy.sharedActivities[this.id] = this;
            this.strategy.sendGuidanceStrategyOperation(data);
        },
        updateSharedActivityOperation: function(removedThreadId){
            var data = {
                operationType: "CollaborationStrategy:UpdateSharedActivity",
                activityId: this.id,
                removedThreadId: removedThreadId
            };
            this.strategy.sendGuidanceStrategyOperation(data);
        },
        removeThreadFromConcurrentRegion: function(threadId){
            if(this.concurrentRegion){
                this.concurrentRegion.removeOpenThread(threadId);
            }
        }
       
    });

    ActivityStatus.createFromShareOperation = function(logicalGuidanceRepresentation, strategy, opData){
        var id = opData.id;
        var initialNode = opData.initialNode;
        var joinNode = opData.joinNode;
        var objectMappings = opData.objectMappings;
        var remainingThreads = opData.remainingThreads;
        var lastAddedNode = opData.objectId;
        
        var activity = new ActivityStatus(logicalGuidanceRepresentation, initialNode, strategy);
        activity.nodeMappings = objectMappings;
        activity.id = id;
        activity.lastAddedNode = lastAddedNode;
        activity.isOwner = false;

        var concurrentRegion = new ConcurrentRegion(activity, logicalGuidanceRepresentation, joinNode);
        console.log("Created shared activity. Remaining thread ids:");
        console.log(remainingThreads);
        concurrentRegion.remainingThreadIds = remainingThreads;
        concurrentRegion.started = true;
        concurrentRegion._isOwner = false;

        activity.concurrentRegion = concurrentRegion;
        activity.currentNode = logicalGuidanceRepresentation.predecessors(joinNode)[0];
        return activity;
    };

    return ActivityStatus;

});
