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
                    else{
                        expectedNodes.push(nodeId);
                    }
                }
                nodesToResolve = nextNodesToResolve;
            }
            
            this.expectedNodes = expectedNodes;
        },
        proceed: function(nodeId){
            this.currentNode = nodeId;
            this.computeExpectedNodes();
        },
        reset: function(){
            this.currentNode = this.initialNode;
            this.computeExpectedNodes();
        }
       
    });

    return ActivityStatus;

});
