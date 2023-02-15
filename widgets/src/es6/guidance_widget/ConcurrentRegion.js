import IWCW from "../lib/IWCWrapper";
import RevokeSharedActivityOperation from "../operations/non_ot/RevokeSharedActivityOperation";
import { CONFIG } from "../config";
import "https://cdnjs.cloudflare.com/ajax/libs/graphlib/2.1.8/graphlib.min.js";
class ConcurrentRegion {
  constructor() {}
  init(activity, logicalGuidanceRepresentation, initialNode) {
    this.activity = activity;
    this.logicalGuidanceRepresentation = logicalGuidanceRepresentation;
    this.initialNode = initialNode;
    this.iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
    this.subConcurrentRegion = null;
    this.threadStartingNodes =
      this.logicalGuidanceRepresentation.successors(initialNode);
    this.currentThreadId = null;
    this.remainingThreadIds = [];
    this.threads = [];
    this._isFinished = false;
    this.started = false;
    this._isOwner = true;

    var startingNodes =
      this.logicalGuidanceRepresentation.successors(initialNode);
    for (var i = 0; i < startingNodes.length; i++) {
      this.remainingThreadIds.push(i);
      this.threads.push(this.findThread(startingNodes[i]));
    }

    this.currentThreadId = this.remainingThreadIds.shift();
  }
  isOwner() {
    return this._isOwner;
  }
  getCurrentThreadStart(nodeId) {
    return this.threadStartingNodes[this.currentThreadId];
  }
  getNextThreadStart(nodeId) {
    return this.threadStartingNodes[this.remainingThreadIds[0]];
  }
  isFinished() {
    return this._isFinished;
  }
  update(nodeId) {
    //Check if we are still in the current thread
    if (this.threads[this.currentThreadId].indexOf(nodeId) >= 0) {
      if (!this.started) {
        this.started = true;
        this.activity.shareActivityOperation(
          this.initialNode,
          this.remainingThreadIds
        );
      }
      return;
    }
    if (this.isLastThread()) {
      if (!this._isFinished) {
        this._isFinished = true;
      }

      return;
    }

    for (var i = 0; i < this.remainingThreadIds.length; i++) {
      var threadId = this.remainingThreadIds[i];
      //Have we moved to another thread?
      if (this.threads[threadId].indexOf(nodeId) >= 0) {
        this.remainingThreadIds.splice(
          this.remainingThreadIds.indexOf(threadId),
          1
        );
        this.currentThreadId = threadId;
        this.activity.updateSharedActivityOperation(threadId);

        if (this.isLastThread()) {
          var operation = new RevokeSharedActivityOperation(this.activity.id);
          this.iwc.sendLocalNonOTOperation(
            CONFIG.WIDGET.NAME.MAIN,
            operation.toNonOTOperation()
          );
        }
        return;
      }
    }
  }
  isLastThread() {
    return this.remainingThreadIds.length == 0;
  }
  removeOpenThread(threadId) {
    var index = this.remainingThreadIds.indexOf(threadId);
    if (index >= 0) {
      this.remainingThreadIds.splice(index, 1);
    }
  }
  startNextThread(threadId) {
    this.currentThreadId = this.remainingThreadIds.shift();
    this.activity.updateSharedActivityOperation(this.currentThreadId);
  }
  findThread(startNodeId) {
    var nodesInThread = [startNodeId];
    var nodesToCheck = [];
    var nextNodesToCheck = [];
    nodesToCheck = this.logicalGuidanceRepresentation.successors(startNodeId);
    while (nodesToCheck.length > 0) {
      nextNodesToCheck = [];
      for (var i = 0; i < nodesToCheck.length; i++) {
        var nodeId = nodesToCheck[i];
        var node = this.logicalGuidanceRepresentation.node(nodeId);
        if (nodesInThread.indexOf(nodeId) >= 0) continue;
        else {
          if (node.type == "CONCURRENCY_NODE") {
          } else {
            nodesInThread.push(nodeId);
            nextNodesToCheck = nextNodesToCheck.concat(
              this.logicalGuidanceRepresentation.successors(nodeId)
            );
          }
        }
      }
      nodesToCheck = nextNodesToCheck;
    }
    return nodesInThread;
  }
}


export default ConcurrentRegion;
