import $ from "jquery-ui";
import NodeAddOperation from "../operations/ot/NodeAddOperation";
import EdgeAddOperation from "../operations/ot/EdgeAddOperation";
import NodeDeleteOperation from "../operations/ot/NodeDeleteOperation";
import EdgeDeleteOperation from "../operations/ot/EdgeDeleteOperation";
import NodeMoveOperation from "../operations/ot/NodeMoveOperation";
import NodeMoveZOperation from "../operations/ot/NodeMoveZOperation";
import NodeResizeOperation from "../operations/ot/NodeResizeOperation";
import $__canvas_widget_EntityManager from "./EntityManager";
function HistoryManager() {
  var bufferSize = 20;

  var _canvas = null;

  var latestOp = null;
  var undo = [];
  var redo = [];

  var $undo = $("#undo");

  var $redo = $("#redo");

  var propagateHistoryOperationFromJson = function (json) {
    var EntityManager = $__canvas_widget_EntityManager;
    var operation = null,
      data = null,
      entity;
    switch (json.TYPE) {
      case NodeDeleteOperation.TYPE: {
        entity = EntityManager.findNode(json.id);
        if (entity) {
          entity.triggerDeletion(true);
          operation = new NodeDeleteOperation(
            json.id,
            json.type,
            json.left,
            json.top,
            json.width,
            json.height,
            json.zIndex,
            json.containment,
            json.json
          );
        }
        break;
      }
      case NodeAddOperation.TYPE: {
        _canvas.createNode(
          json.type,
          json.left,
          json.top,
          json.width,
          json.height,
          json.zIndex,
          json.containment,
          json.json,
          json.id,
          true
        );
        operation = new NodeAddOperation(
          json.id,
          json.type,
          json.left,
          json.top,
          json.width,
          json.height,
          json.zIndex,
          json.containment,
          json.json
        );
        break;
      }
      case EdgeAddOperation.TYPE: {
        _canvas.createEdge(
          json.type,
          json.source,
          json.target,
          json.json,
          json.id,
          true
        );
        operation = new EdgeAddOperation(
          json.id,
          json.type,
          json.source,
          json.target,
          json.json
        );
        break;
      }
      case EdgeDeleteOperation.TYPE: {
        entity = EntityManager.findEdge(json.id);
        if (entity) {
          entity.triggerDeletion(true);
          operation = new EdgeDeleteOperation(
            json.id,
            json.type,
            json.source,
            json.target,
            json.json
          );
        }
        break;
      }
      case NodeMoveOperation.TYPE: {
        entity = EntityManager.findNode(json.id);
        if (entity) {
          const nodesMap = y.getMap("nodes");
          operation = new NodeMoveOperation(
            json.id,
            json.offsetX,
            json.offsetY
          );
          var ymap = nodesMap.get(json.id);
          data = operation.toJSON();
          data.historyFlag = true;
          ymap.set(NodeMoveOperation.TYPE, data);
        }
        break;
      }
      case NodeMoveZOperation.TYPE: {
        entity = EntityManager.findNode(json.id);
        if (entity) {
          operation = new NodeMoveZOperation(json.id, json.offsetZ);
          const nodesMap = y.getMap("nodes");
          var ymap = nodesMap.get(json.id);
          data = operation.toJSON();
          data.historyFlag = true;
          ymap.set(NodeMoveZOperation.TYPE, data);
        }
        break;
      }
      case NodeResizeOperation.TYPE: {
        entity = EntityManager.findNode(json.id);
        if (entity) {
          operation = new NodeResizeOperation(
            json.id,
            json.offsetX,
            json.offsetY
          );
          const nodesMap = y.getMap("nodes");
          var ymap = nodesMap.get(json.id);
          data = operation.toJSON();
          data.historyFlag = true;
          ymap.set(NodeResizeOperation.TYPE, data);
        }
        break;
      }
    }
    return operation;
  };

  return {
    init: function (canvas) {
      _canvas = canvas;
    },
    add: function (operation) {
      if (operation.hasOwnProperty("inverse")) {
        var inverseOp = operation.inverse();
        var json = inverseOp.toJSON();
        json.TYPE = inverseOp.constructor.name;
        undo.push(json);
        redo = [];
        $undo.prop("disabled", false);
        $redo.prop("disabled", true);
      }
      if (undo.length > bufferSize) {
        undo.shift();
      }
    },
    undo: function () {
      if (undo.length > 0) {
        var jsonOp = undo.pop();
        if (undo.length === 0) {
          $undo.prop("disabled", true);
        }
        var operation = propagateHistoryOperationFromJson(jsonOp);
        if (!operation) {
          this.undo();
          return;
        } else latestOp = operation;

        var inverseOp = operation.inverse();
        var json = inverseOp.toJSON();
        json.TYPE = inverseOp.constructor.name;

        if (redo.length === 0) $redo.prop("disabled", false);
        redo.push(json);
      } else {
        $undo.prop("disabled", true);
      }
    },
    redo: function () {
      if (redo.length > 0) {
        var jsonOp = redo.pop();
        if (redo.length === 0) {
          $redo.prop("disabled", true);
        }
        var operation = propagateHistoryOperationFromJson(jsonOp);
        if (!operation) {
          this.redo();
          return;
        } else latestOp = operation;
        var inverseOp = operation.inverse();
        var json = inverseOp.toJSON();
        json.TYPE = inverseOp.constructor.name;

        if (undo.length === 0) $undo.prop("disabled", false);
        undo.push(json);
      } else {
        $redo.prop("disabled", true);
      }
    },
    clean: function (entityId) {
      var entityIdFilter = function (value, idx) {
        if (value.id === entityId) return false;
        else return true;
      };
      undo = undo.filter(entityIdFilter);
      redo = redo.filter(entityIdFilter);
      if (undo.length === 0) {
        $undo.prop("disabled", true);
      }
      if (redo.length === 0) {
        $redo.prop("disabled", true);
      }
    },
    getLatestOperation: function () {
      return latestOp;
    },
    getUndoList: function () {
      return undo;
    },
    getRedoList: function () {
      return redo;
    },
  };
}
export default new HistoryManager();
