define([
	'Util',
    'classjs',
    'graphlib'
],function(Util) {

    var ConcurrentRegion = Class.extend({
        init: function(logicalGuidanceDefinition, initialNode){
            this.logicalGuidanceDefinition = logicalGuidanceDefinition;
            this.initialNode = initialNode;
            this.subConcurrentRegion = null;
            this.threadStartingNodes = this.logicalGuidanceDefinition.successors(initialNode);
        	this.currentThreadId = null;
        	this.remainingThreadIds = [];
        	this.threads = [];
        	this._isFinished = false;

        	var startingNodes = this.logicalGuidanceDefinition.successors(initialNode);
        	for(var i = 0; i < startingNodes.length; i++){
        		this.remainingThreadIds.push(i);
        		this.threads.push(this.findThread(startingNodes[i]));
        	}

        	this.currentThreadId = this.remainingThreadIds.shift();
        },
        getCurrentThreadStart: function(nodeId){
        	return this.threadStartingNodes[this.currentThreadId];
        },
        getNextThreadStart: function(nodeId){
        	return this.threadStartingNodes[this.remainingThreadIds[0]];
        },
        isFinished: function(){
        	return this._isFinished;
        },
        update: function(nodeId){
        	//Check if we are still in the current thread
        	if(this.threads[this.currentThreadId].indexOf(nodeId) >=0){
        		return;
        	}
        	if(this.isLastThread()){
        		this.isFinished = true;
        		return;
        	}
        	for(var i = 0; i < this.remainingThreadIds.length; i++){
        		var threadId = this.remainingThreadIds[i];
        		//Have we moved to another thread?
        		if(this.threads[threadId].indexOf(nodeId) >= 0){
        			this.remainingThreadIds.splice(this.remainingThreadIds.indexOf(this.currentThreadId), 1);
        			this.currentThreadId = threadId;
        			return;
        		}
        	}
        },
        isLastThread: function(){
        	return this.remainingThreadIds.length == 0;
        },
        findThread: function(startNodeId){
        	var nodesInThread = [startNodeId];
        	var nodesToCheck = [];
        	var nextNodesToCheck = [];
        	nodesToCheck = this.logicalGuidanceDefinition.successors(startNodeId);
        	while(nodesToCheck.length > 0){
	        	nextNodesToCheck = [];
	        	for(var i = 0; i < nodesToCheck.length; i++){
	        		var nodeId = nodesToCheck[i];
	        		var node = this.logicalGuidanceDefinition.node(nodeId);
	        		if(nodesInThread.indexOf(nodeId) >= 0)
	        			continue;
	        		else{
	        			if(node.type == "CONCURRENCY_NODE"){

	        			}
	        			else{
	        				nodesInThread.push(nodeId);
	        				nextNodesToCheck = nextNodesToCheck.concat(this.logicalGuidanceDefinition.successors(nodeId));
	        			}
	        		}
	        	}
	        	nodesToCheck = nextNodesToCheck;
	        }
	        return nodesInThread;
        }
    });

    return ConcurrentRegion;

});
