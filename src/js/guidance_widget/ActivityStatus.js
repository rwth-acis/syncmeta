define([
    'Util',
    'guidance_widget/ConcurrentRegion',
    'classjs',
    'graphlib'
],function(Util,ConcurrentRegion) {

    var ActivityStatus = Class.extend({
        init: function(logicalGuidanceDefinition, initialNode){
            this.id = Util.generateRandomId();
            this.logicalGuidanceDefinition = logicalGuidanceDefinition;
            this.initialNode = initialNode;
            this.currentNode = initialNode;
            this.name = logicalGuidanceDefinition.node(initialNode).name || "";
            this.computeExpectedNodes();
            this.currentSubActivity = null;
            this.possibleSubActivities = [];
            this.nodeMappings = {};
            this.concurrentRegion = null;
        },
        computeExpectedNodes: function(){
            var nodesToResolve = this.logicalGuidanceDefinition.successors(this.currentNode);
            var expectedNodes = [];
            this.possibleSubActivities = [];
            while(nodesToResolve.length > 0){
                var nextNodesToResolve = [];
                for (var i = 0; i < nodesToResolve.length; i++){
                    var nodeId = nodesToResolve[i];
                    var node = this.logicalGuidanceDefinition.node(nodeId);
                    if(node.type == "SET_PROPERTY_ACTION"){
                        expectedNodes.push(nodeId);
                        nextNodesToResolve = nextNodesToResolve.concat(this.logicalGuidanceDefinition.successors(nodeId));
                    }
                    else if(node.type == "MERGE_NODE"){
                        nextNodesToResolve = nextNodesToResolve.concat(this.logicalGuidanceDefinition.successors(nodeId));
                    }
                    else if(node.type == "CALL_ACTIVITY_ACTION"){
                        var subActivity = new ActivityStatus(this.logicalGuidanceDefinition, node.initialNodeId);
                        this.possibleSubActivities.push(subActivity);
                        expectedNodes = expectedNodes.concat(subActivity.getExpectedNodes());
                    }
                    else if(node.type == "CONCURRENCY_NODE"){
                        //Check if it is a fork or a join node
                        var ingoing = this.logicalGuidanceDefinition.predecessors(nodeId).length;
                        var outgoing = this.logicalGuidanceDefinition.successors(nodeId).length;
                        if(outgoing > ingoing){
                            // Fork node
                            if(!this.concurrentRegion)
                                this.concurrentRegion = new ConcurrentRegion(this, this.logicalGuidanceDefinition, nodeId);
                            nextNodesToResolve.push(this.concurrentRegion.getCurrentThreadStart());
                        }
                        else{
                            // Join node
                            if(this.concurrentRegion.isLastThread()){
                                //If it is the last thread we can take the actions after the join node
                                nextNodesToResolve = nextNodesToResolve.concat(this.logicalGuidanceDefinition.successors(nodeId));
                            }
                            else{
                                console.log("Next thread start");
                                console.log(this.concurrentRegion.getNextThreadStart());
                                //If it is not the last thread we take the actions of the next thread
                                nextNodesToResolve.push(this.concurrentRegion.getNextThreadStart());
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
            var node = this.logicalGuidanceDefinition.node(nodeId);
            //Are we entering a subactivity?
            if(!this.currentSubActivity && this.possibleSubActivities.length > 0){
                for(var i = 0; i < this.possibleSubActivities.length; i++){
                    var subActivity = this.possibleSubActivities[i];
                    if(subActivity.getExpectedNodes().indexOf(nodeId) >= 0){
                        this.currentSubActivity = subActivity;
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
                this.subActivity = null;
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
            this.subActivity = null;
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
                var node = this.logicalGuidanceDefinition.node(nodeId);
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
        }
       
    });

    ActivityStatus.createFromShareOperation = function(logicalGuidanceDefinition, operation){
        var id = operation.getId();
        var initialNode = operation.getInitialNode();
        var joinNode = operation.getJoinNode();
        var objectMappings = operation.getObjectMappings();
        var remainingThreads = operation.getRemainingThreads();
        var lastAddedNode = operation.getObjectId();
        
        var activity = new ActivityStatus(logicalGuidanceDefinition, initialNode);
        activity.nodeMappings = objectMappings;
        activity.id = id;
        activity.lastAddedNode = lastAddedNode;

        var concurrentRegion = new ConcurrentRegion(activity, logicalGuidanceDefinition, joinNode);
        concurrentRegion.remainingThreadIds = remainingThreads;
        concurrentRegion.currentThreadId = remainingThreads[0];
        concurrentRegion.started = true;

        activity.concurrentRegion = concurrentRegion;
        activity.currentNode = joinNode;
        return activity;
    };

    return ActivityStatus;

});
