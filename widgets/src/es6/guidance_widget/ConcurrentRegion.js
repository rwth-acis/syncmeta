import IWCW from 'iwcw';
import Util from 'Util';
import RevokeSharedActivityOperation from 'operations/non_ot/RevokeSharedActivityOperation';
import 'classjs';
import 'graphlib';

    var ConcurrentRegion = Class.extend({
        init: function(activity, logicalGuidanceRepresentation, initialNode){
            this.activity = activity;
            this.logicalGuidanceRepresentation = logicalGuidanceRepresentation;
            this.initialNode = initialNode;
            this.iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
            this.subConcurrentRegion = null;
            this.threadStartingNodes = this.logicalGuidanceRepresentation.successors(initialNode);
        	this.currentThreadId = null;
        	this.remainingThreadIds = [];
        	this.threads = [];
        	this._isFinished = false;
            this.started = false;
            this._isOwner = true;

        	var startingNodes = this.logicalGuidanceRepresentation.successors(initialNode);
        	for(var i = 0; i < startingNodes.length; i++){
        		this.remainingThreadIds.push(i);
        		this.threads.push(this.findThread(startingNodes[i]));
        	}


        	this.currentThreadId = this.remainingThreadIds.shift();

        },
        isOwner: function(){
            return this._isOwner;
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
                if(!this.started){
                    this.started = true;
                    this.activity.shareActivityOperation(this.initialNode, this.remainingThreadIds);

                }
        		return;
        	}
        	if(this.isLastThread()){
                if(!this._isFinished){
                    this._isFinished = true;
                }

        		return;
        	}

        	for(var i = 0; i < this.remainingThreadIds.length; i++){
        		var threadId = this.remainingThreadIds[i];
        		//Have we moved to another thread?
        		if(this.threads[threadId].indexOf(nodeId) >= 0){
        			this.remainingThreadIds.splice(this.remainingThreadIds.indexOf(threadId), 1);
        			this.currentThreadId = threadId;
                    this.activity.updateSharedActivityOperation(threadId);

                    if(this.isLastThread()){
                        var operation = new RevokeSharedActivityOperation(this.activity.id);
                        this.iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
                    }
        			return;
        		}
        	}
        },
        isLastThread: function(){
        	return this.remainingThreadIds.length == 0;
        },
        removeOpenThread: function(threadId){
            var index = this.remainingThreadIds.indexOf(threadId);
            if(index >= 0){
                this.remainingThreadIds.splice(index, 1);
            }
        },
        startNextThread: function(threadId){
            this.currentThreadId = this.remainingThreadIds.shift();
            this.activity.updateSharedActivityOperation(this.currentThreadId);
        },
        findThread: function(startNodeId){
        	var nodesInThread = [startNodeId];
        	var nodesToCheck = [];
        	var nextNodesToCheck = [];
        	nodesToCheck = this.logicalGuidanceRepresentation.successors(startNodeId);
        	while(nodesToCheck.length > 0){
	        	nextNodesToCheck = [];
	        	for(var i = 0; i < nodesToCheck.length; i++){
	        		var nodeId = nodesToCheck[i];
	        		var node = this.logicalGuidanceRepresentation.node(nodeId);
	        		if(nodesInThread.indexOf(nodeId) >= 0)
	        			continue;
	        		else{
	        			if(node.type == "CONCURRENCY_NODE"){

	        			}
	        			else{
	        				nodesInThread.push(nodeId);
	        				nextNodesToCheck = nextNodesToCheck.concat(this.logicalGuidanceRepresentation.successors(nodeId));
	        			}
	        		}
	        	}
	        	nodesToCheck = nextNodesToCheck;
	        }
	        return nodesInThread;
        }
    });

    export default ConcurrentRegion;


