import { CONFIG } from "../config";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import { EntityManagerInstance as EntityManager } from "./Manager";
import AbstractCanvasTool from "./AbstractCanvasTool";
import {
  EVENT_DRAG_START,
  EVENT_ENDPOINT_MOUSEOVER,
} from "@jsplumb/browser-ui";
import { getQuerySelectorFromNode } from "../getQuerySelectorFromNode";
import { EVENT_CONNECTION, EVENT_CONNECTION_DETACHED } from "@jsplumb/core";

/**
 * EdgeTool
 * @class canvas_widget.EdgeTool
 * @extends canvas_widget.AbstractCanvasTool
 * @memberof canvas_widget
 * @constructor
 * @param {string} name Name of tool
 * @param {string[]} relations Array of valid relations of node types the edge can connect
 * @param {string} [className] Class name assigned to canvas node when tool is mounted
 * @param {string} [description] Description of tool
 */
class EdgeTool extends AbstractCanvasTool {
  constructor(name, relations, className, description) {
    super(name, className || "tool-edge", description || "Add an edge");
    const jsPlumbInstance = window.jsPlumbInstance;

    var _relations = relations;

    /**
     * Mount the tool on canvas
     */
    this.mount = function () {
      AbstractCanvasTool.prototype.mount.call(this);
      function makeNeighborhoodFilter(nodeId) {
        return function (n) {
          return (
            n.getEntityId() !== nodeId &&
            !n.getNeighbors().hasOwnProperty(nodeId)
          );
        };
      }

      function makeMakeTargetCallback() {
        return function (node) {
          node.makeTarget();
          node.unlowlight();
        };
      }

      var that = this;

      var $canvas = this.getCanvas().get$canvas();

      //Bind Node Events
      var nodes = EntityManager.getNodes();
      var nodeId, node, nodeType, strGetNodesByType;
      var i, numOfRelations;

      for (nodeId in nodes) {
        if (nodes.hasOwnProperty(nodeId)) {
          node = nodes[nodeId];
          node.lowlight();
          if (
            EntityManager.getViewId() === undefined ||
            EntityManager.getLayer() === CONFIG.LAYER.META
          ) {
            nodeType = node.getType();
            strGetNodesByType = "getNodesByType";
          } else {
            nodeType = node.getCurrentViewType();
            strGetNodesByType = "getNodesByViewType";
          }
          for (
            i = 0, numOfRelations = _relations.length;
            i < numOfRelations;
            i++
          ) {
            if (relations[i].sourceTypes.indexOf(nodeType) !== -1) {
              if (
                _.size(
                  _.filter(
                    EntityManager[strGetNodesByType](relations[i].targetTypes),
                    makeNeighborhoodFilter(node.getEntityId())
                  )
                ) > 0
              ) {
                node.makeSource();
                node.unbindMoveToolEvents();
                node.unlowlight();
                break;
              }
            }
          }
        }
      }

      jsPlumbInstance.bind("beforeDrag", function (info) {
        var sourceNode = EntityManager.findNode(info.sourceId),
          sourceType,
          i,
          numOfRelations,
          strGetNodesByType;
        if (sourceNode) {
          if (
            EntityManager.getViewId() === undefined ||
            EntityManager.getLayer() === CONFIG.LAYER.META
          ) {
            sourceType = sourceNode.getType();
            strGetNodesByType = "getNodesByType";
          } else {
            sourceType = sourceNode.getCurrentViewType();
            strGetNodesByType = "getNodesByViewType";
          }

          for (
            i = 0, numOfRelations = _relations.length;
            i < numOfRelations;
            i++
          ) {
            if (relations[i].sourceTypes.indexOf(sourceType) !== -1) {
              _.each(
                _.filter(
                  EntityManager[strGetNodesByType](relations[i].targetTypes),
                  makeNeighborhoodFilter(sourceNode.getEntityId())
                ),
                makeMakeTargetCallback()
              );
            }
          }
        }
        $(info.source).addClass("current");
        $canvas.addClass("dragging");
        return true;
      });
      jsPlumbInstance.bind("beforeDrop", function () {
        $canvas.removeClass("dragging");
        $(".node.current").removeClass("current");
        return true;
      });
      jsPlumbInstance.bind("beforeDetach", function (info) {
        if (info.connection?.pending) {
          $(".node.current").removeClass("current");
          $canvas.removeClass("dragging");
        }
        return true;
      });

      jsPlumbInstance.bind("connection", function (info, originalEvent) {
        if (typeof originalEvent !== "undefined") {
          //Was the connection established using Drag'n Drop?
          // If so we delete the connection and form it manually again
          if (info.connection.endpoints) {
            jsPlumbInstance.removeAllEndpoints(info.source);
            jsPlumbInstance.removeAllEndpoints(info.target);
            jsPlumbInstance.deleteConnection(info.connection, {
              fireEvent: false,
            });
          }

          that
            .getCanvas()
            .createEdge(that.getName(), info.sourceId, info.targetId);
        }
        return true;
      });

      $canvas.bind("contextmenu", function (ev) {
        if (ev.target == this) {
          ev.preventDefault();
          that.getCanvas().resetTool();
          return false;
        }
        return true;
      });

      $canvas.find(".node").bind("contextmenu", function (ev) {
        ev.preventDefault();
        that.getCanvas().resetTool();
        that.getCanvas().select(EntityManager.findNode($(this).attr("id")));
        return false;
      });
    };

    /**
     * Unmount the tool from canvas
     */
    this.unmount = function () {
      AbstractCanvasTool.prototype.unmount.call(this, arguments);

      var $canvas = this.getCanvas().get$canvas();

      //Unbind Node Events
      //TODO Not very nicely implemented. Iterates over all nodes again like it was in MoveTool
      var nodes = EntityManager.getNodes();
      var nodeId, node;
      for (nodeId in nodes) {
        if (nodes.hasOwnProperty(nodeId)) {
          node = nodes[nodeId];
          node.unlowlight();
          node.unbindEdgeToolEvents();
          node.bindMoveToolEvents();
        }
      }

      //Disable Edge Dragging
      $canvas.find(".node").each(function () {
        var $this = $(this);
        try {
          const nodeSelector = getQuerySelectorFromNode($this);
          jsPlumbInstance.removeSourceSelector(nodeSelector);
          jsPlumbInstance.removeTargetSelector(nodeSelector);
        } catch (error) {
          console.error(error);
        }
      });
      jsPlumbInstance.unbind("connectionDrag");
      jsPlumbInstance.unbind("beforeDrop");
      jsPlumbInstance.unbind("connection");

      $canvas.unbind("contextmenu");
      $canvas.find(".node").unbind("contextmenu");
    };
  }
}

export default EdgeTool;
