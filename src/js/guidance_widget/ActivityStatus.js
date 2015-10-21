define([
    'classjs',
    'graphlib'
],function() {

    var ActivityStatus = Class.extend({
        init: function(logicalGuidanceDefinition, initialNode){
            this.logicalGuidanceDefinition = logicalGuidanceDefinition;
            this.initialNode = initialNode;
            this.currentNode = initialNode;
            this.name = logicalGuidanceDefinition.node(initialNode).name;
            this.computeExpectedNodes();
            this.subActivity = null;
            this.subActivityNode = null;
            this.nodeMappings = {};
        },
        computeExpectedNodes: function(){
            var nodesToResolve = this.logicalGuidanceDefinition.successors(this.currentNode);
            var expectedNodes = [];
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
                        this.subActivity = new ActivityStatus(this.logicalGuidanceDefinition, node.initialNodeId);
                        this.subActivityNode = nodeId;
                        expectedNodes = expectedNodes.concat(this.subActivity.getExpectedNodes());
                    }
                    else{
                        expectedNodes.push(nodeId);
                    }
                }
                nodesToResolve = nextNodesToResolve;
            }
            
            this.expectedNodes = expectedNodes;
        },
        proceed: function(nodeId){
            var node = this.logicalGuidanceDefinition.node(nodeId);
            if(this.subActivity && this.subActivity.getExpectedNodes().indexOf(nodeId) >= 0){
                this.subActivity.proceed(nodeId);
                this.currentNode = this.subActivityNode;
            }
            else{
                this.subActivity = null;
                this.currentNode = nodeId;
                this.computeExpectedNodes();
            }
        },
        getExpectedNodes: function(){
            var expectedNodes = [];
            if(this.subActivity && !this.subActivity.isAtStart()){
                expectedNodes = this.subActivity.getExpectedNodes();
                if(this.subActivity.reachesEnd()){
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
            if(this.subActivity && !this.subActivity.isAtStart())
                name = name + " > " + this.subActivity.getName();
            return name;
        },
        setNodeMapping: function(guidanceNodeId, modelNodeId){
            this.nodeMappings[guidanceNodeId] = modelNodeId;
        },
        getNodeMapping: function(guidanceNodeId){
            return this.nodeMappings[guidanceNodeId];
        }
       
    });

    return ActivityStatus;

});
