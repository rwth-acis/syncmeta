import graphlib from "graphlib/dist/graphlib.core.min.js";
import "jquery";
import "jquery-contextmenu";
import "jquery-ui";
import "jsplumb/dist/js/jsPlumb-1.7.9.js";
import { default as _ } from "lodash-es";
import { CONFIG } from "../config";
import loadHTML from "../html.template.loader";
import { default as IWCW } from "../lib/IWCWrapper";
import { OpenAppProvider } from "../lib/openapp";
import { default as ActivityOperation } from "../operations/non_ot/ActivityOperation";
import {
  EdgeAddOperation,
  EdgeDeleteOperation,
  NodeAddOperation,
  NodeDeleteOperation,
} from "../operations/ot/EntityOperation";
import { default as NodeMoveOperation } from "../operations/ot/NodeMoveOperation";
import { default as NodeMoveZOperation } from "../operations/ot/NodeMoveZOperation";
import { default as NodeResizeOperation } from "../operations/ot/NodeResizeOperation";
import { default as Util } from "../Util";
import { default as AbstractEntity } from "./AbstractEntity";
import { default as BooleanAttribute } from "./BooleanAttribute";
import Edge from "./Edge";
import { default as EnumNode } from "./EnumNode";
import FileAttribute from "./FileAttribute";
import GeneralisationEdge from "./GeneralisationEdge";
import IntegerAttribute from "./IntegerAttribute";
import { default as KeySelectionValueListAttribute } from "./KeySelectionValueListAttribute";
import KeySelectionValueSelectionValueListAttribute from "./KeySelectionValueSelectionValueListAttribute";
import ModelAttributesNode from "./ModelAttributesNode";
import { default as NodeShapeNode } from "./NodeShapeNode";
import QuizAttribute from "./QuizAttribute";
import { default as RelationshipGroupNode } from "./RelationshipGroupNode";
import SingleColorValueAttribute from "./SingleColorValueAttribute";
import SingleSelectionAttribute from "./SingleSelectionAttribute";
import { default as SingleValueAttribute } from "./SingleValueAttribute";
import { default as UniDirAssociationEdge } from "./UniDirAssociationEdge";
import ViewEdge from "./view/ViewEdge";
import ViewNode from "./view/ViewNode";
import { default as ViewObjectNode } from "./viewpoint/ViewObjectNode";
import { default as ViewRelationshipNode } from "./viewpoint/ViewRelationshipNode";

const abstractEdgeHtml = await loadHTML(
  "../../templates/canvas_widget/abstract_edge.html",
  import.meta.url
);

const edgeShapeNodeHtml = await loadHTML(
  "../../templates/canvas_widget/edge_shape_node.html",
  import.meta.url
);

const abstractNodeHtml = await loadHTML(
  "../../templates/canvas_widget/abstract_node.html",
  import.meta.url
);
const awarenessTraceHtml = await loadHTML(
  "../../templates/canvas_widget/awareness_trace.html",
  import.meta.url
);

const abstractClassNodeHtml = await loadHTML(
  "../../templates/canvas_widget/abstract_class_node.html",
  import.meta.url
);

const relationshipNodeHtml = await loadHTML(
  "../../templates/canvas_widget/relationship_node.html",
  import.meta.url
);
const actionNodeHtml = await loadHTML(
  "../../templates/canvas_widget/action_node.html",
  import.meta.url
);
const circleNodeHtml = await loadHTML(
  "../../templates/canvas_widget/circle_node.html",
  import.meta.url
);
const diamondNodeHtml = await loadHTML(
  "../../templates/canvas_widget/diamond_node.html",
  import.meta.url
);
const objectNodeHtml = await loadHTML(
  "../../templates/canvas_widget/object_node.html",
  import.meta.url
);
const rectangleNodeHtml = await loadHTML(
  "../../templates/canvas_widget/rectangle_node.html",
  import.meta.url
);
const roundedRectangleNodeHtml = await loadHTML(
  "../../templates/canvas_widget/rounded_rectangle_node.html",
  import.meta.url
);
const startActivityNodeHtml = await loadHTML(
  "../../templates/canvas_widget/start_activity_node.html",
  import.meta.url
);
const triangleNodeHtml = await loadHTML(
  "../../templates/canvas_widget/triangle_node.html",
  import.meta.url
);
const activityFinalNodeHtml = await loadHTML(
  "../../templates/guidance_modeling/activity_final_node.html",
  import.meta.url
);
const callActivityNodeHtml = await loadHTML(
  "../../templates/guidance_modeling/call_activity_node.html",
  import.meta.url
);
const entityNodeHtml = await loadHTML(
  "../../templates/guidance_modeling/entity_node.html",
  import.meta.url
);
const setPropertyNodeHtml = await loadHTML(
  "../../templates/guidance_modeling/set_property_node.html",
  import.meta.url
);

/**
 * AbstractNode
 * @class canvas_widget.AbstractNode
 * @extends canvas_widget.AbstractEntity
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {string} type Type of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {boolean} containment containment
 * @param {number} zIndex Position of node on z-axis
 */
export class AbstractNode extends AbstractEntity {
  constructor(id, type, left, top, width, height, zIndex, containment, json) {
    super(id);
    var that = this;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);
    /**y-map instances which belongs to the node
     * @type {Y.Map}
     * @private
     * */
    var _ymap = null;
    if (window.hasOwnProperty("y")) {
      const nodesMap = y.getMap("nodes");
      if (nodesMap.has(id)) {
        _ymap = nodesMap.get(id);
      } else {
        _ymap = nodesMap.set(id, new Y.Map());
        _ymap.set("left", left);
        _ymap.set("top", top);
        _ymap.set("width", width);
        _ymap.set("height", height);
        _ymap.set("zIndex", zIndex);
        _ymap.set("containment", containment);
        _ymap.set("type", type);
        _ymap.set("id", id);
        if (json) _ymap.set("json", json);
        if (_iwcw.getUser().globalId !== -1)
          _ymap.set("jabberId", _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
      }
    }
    this.getYMap = function () {
      return _ymap;
    };

    /**
     * Type of node
     * @type {string}
     * @private
     */
    var _type = type;

    /**
     * Label of edge
     * @type {canvas_widget.SingleValueAttribute}
     * @private
     */
    var _label = new SingleValueAttribute(id + "[label]", "Label", this);

    /**
     * Appearance information of edge
     * @type {{left: number, top: number, width: number, height: number}}
     * @private
     */
    var _appearance = {
      left: left,
      top: top,
      width: width,
      height: height,
      containment: containment,
    };

    /**
     * Position of node on z-axis
     * @type {number}
     * @private
     */
    var _zIndex = zIndex;

    /**
     * Type of node
     * @containment {boolean}
     * @private
     */
    var _containment = containment;

    /**
     * Canvas the node is drawn on
     * @type {canvas_widget.AbstractCanvas}
     * @private
     */
    var _canvas = null;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(abstractNodeHtml)({ id: id }));

    var _$awarenessTrace = $(
      _.template(awarenessTraceHtml)({ id: id + "_awareness" })
    );

    var _awarenessTimer = setInterval(function () {
      var opacity = _$awarenessTrace.css("opacity");
      opacity -= 0.1;
      if (opacity < 0) opacity = 0;
      _$awarenessTrace.css({
        opacity: opacity,
      });
    }, 3000);

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = {};

    /**
     * Stores if node is selected
     * @type {boolean}
     * @private
     */
    var _isSelected = false;

    /**
     * Callback to generate list of context menu items
     * @type {function}
     */
    var _contextMenuItemCallback = function () {
      return {};
    };

    /**
     * Set of ingoing edges
     * @type {Object}
     * @private
     */
    var _ingoingEdges = {};

    /**
     * Set of outgoing edges
     * @type {Object}
     * @private
     */
    var _outgoingEdges = {};

    /**
     * Set of nodes with an edge to the node
     * @type {Object}
     * @private
     */
    var _ingoingNeighbors = {};

    /**
     * Set of nodes with an edge from the node
     * @type {Object}
     * @private
     */
    var _outgoingNeighbors = {};

    var _relatedGhostEdges = [];

    /**
     * Apply a Node Move Operation
     * @param {operations.ot.NodeMoveOperation} operation
     */
    var processNodeMoveOperation = function (operation) {
      _canvas.hideGuidanceBox();
      that.move(operation.getOffsetX(), operation.getOffsetY(), 0);
      _canvas.showGuidanceBox();
    };

    /**
     * Apply a Node Move Z Operation
     * @param {operations.ot.NodeMoveZOperation} operation
     */
    var processNodeMoveZOperation = function (operation) {
      that.move(0, 0, operation.getOffsetZ());
    };

    /**
     * Propagate a Node Move Operation to the remote users and the local widgets
     * @param {operations.ot.NodeMoveOperation} operation
     */
    this.propagateNodeMoveOperation = function (operation) {
      operation.setJabberId(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
      processNodeMoveOperation(operation);
      HistoryManagerInstance.add(operation);
      $("#save").click();

      hideTraceAwareness();
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.HEATMAP,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "NodeMoveActivity",
          operation.getEntityId(),
          operation.getJabberId(),
          NodeMoveOperation.getOperationDescription(
            that.getType(),
            that.getLabel().getValue().getValue()
          ),
          { nodeType: that.getType() }
        )
      );

      if (_ymap) {
        _ymap.set(NodeMoveOperation.TYPE, operation.toJSON());
      }
    };

    /**
     * Propagate a Node Move Z Operation to the remote users and the local widgets
     * @param {operations.ot.NodeMoveZOperation} operation
     */
    this.propagateNodeMoveZOperation = function (operation) {
      var jabberId = _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID];
      operation.setJabberId(jabberId);
      processNodeMoveZOperation(operation);
      HistoryManagerInstance.add(operation);
      hideTraceAwareness();
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "NodeMoveActivity",
          operation.getEntityId(),
          jabberId,
          NodeMoveOperation.getOperationDescription(
            that.getType(),
            that.getLabel().getValue().getValue()
          ),
          { nodeType: that.getType() }
        )
      );

      if (_ymap) _ymap.set(NodeMoveZOperation.TYPE, operation.toJSON());
    };

    /**
     * Apply a Node Resize Operation
     * @param {operations.ot.NodeResizeOperation} operation
     */
    var processNodeResizeOperation = function (operation) {
      _canvas.hideGuidanceBox();
      that.resize(operation.getOffsetX(), operation.getOffsetY());
      _canvas.showGuidanceBox();
    };

    /**
     * Propagate a Node Resize Operation to the remote users and the local widgets
     * @param {operations.ot.NodeResizeOperation} operation
     */
    this.propagateNodeResizeOperation = function (operation) {
      operation.setJabberId(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
      processNodeResizeOperation(operation);
      HistoryManagerInstance.add(operation);
      $("#save").click();
      hideTraceAwareness();
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.HEATMAP,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "NodeResizeActivity",
          operation.getEntityId(),
          operation.getJabberId(),
          NodeResizeOperation.getOperationDescription(
            that.getType(),
            that.getLabel().getValue().getValue()
          ),
          { nodeType: that.getType() }
        )
      );

      if (_ymap) _ymap.set("NodeResizeOperation", operation.toJSON());
    };

    /**
     * Apply a Node Delete Operation
     * @param {operations.ot.NodeDeleteOperation} operation
     */
    var processNodeDeleteOperation = function (operation) {
      var edges = that.getEdges(),
        edgeId,
        edge;

      for (edgeId in edges) {
        if (edges.hasOwnProperty(edgeId)) {
          edge = edges[edgeId];
          edge.remove();
        }
      }

      for (var i = 0; i < _relatedGhostEdges.length; i++) {
        if (typeof _relatedGhostEdges[i].remove == "function")
          _relatedGhostEdges[i].remove();
      }
      if (_ymap) {
        _ymap = null;
      }
      that.remove();
    };

    /**
     * Propagate a Node Delete Operation to the remote users and the local widgets
     * @param {operations.ot.NodeDeleteOperation} operation
     */
    var propagateNodeDeleteOperation = function (operation) {
      processNodeDeleteOperation(operation);
      $("#save").click();
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.HEATMAP,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "NodeDeleteActivity",
          operation.getEntityId(),
          _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
          NodeDeleteOperation.getOperationDescription(
            that.getType(),
            that.getLabel().getValue().getValue()
          ),
          {}
        )
      );
    };

    var refreshTraceAwareness = function (color) {
      _$awarenessTrace.css({
        opacity: 1,
        fill: color,
      });
    };

    var hideTraceAwareness = function () {
      _$awarenessTrace.css({
        opacity: 0,
      });
    };

    /**
     * Callback for a remote Node Move Operation
     * @param {operations.ot.NodeMoveOperation} operation
     */
    var remoteNodeMoveCallback = function (operation) {
      if (
        operation instanceof NodeMoveOperation &&
        operation.getEntityId() === that.getEntityId()
      ) {
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.ATTRIBUTE,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.HEATMAP,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.GUIDANCE,
          operation.getOTOperation()
        );
        const userMap = y.getMap("users");
        if (userMap.get(y.clientID) !== operation.getJabberId()) {
          const userList = y.getMap("userList");
          var color = Util.getColor(
            userList.get(operation.getJabberId()).globalId
          );
          refreshTraceAwareness(color);
        }

        processNodeMoveOperation(operation);
      }
    };

    /**
     * Callback for a remote Node Move Z Operation
     * @param {operations.ot.NodeMoveZOperation} operation
     */
    var remoteNodeMoveZCallback = function (operation) {
      if (
        operation instanceof NodeMoveZOperation &&
        operation.getEntityId() === that.getEntityId()
      ) {
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.ATTRIBUTE,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.GUIDANCE,
          operation.getOTOperation()
        );
        const userMap = y.getMap("users");
        if (userMap.get(y.clientID) !== operation.getJabberId()) {
          const userList = y.getMap("userList");
          var color = Util.getColor(
            userList.get(operation.getJabberId()).globalId
          );
          refreshTraceAwareness(color);
        }
        processNodeMoveZOperation(operation);
      }
    };

    /**
     * Callback for a remote Node Resize Operation
     * @param {operations.ot.NodeResizeOperation} operation
     */
    var remoteNodeResizeCallback = function (operation) {
      if (
        operation instanceof NodeResizeOperation &&
        operation.getEntityId() === that.getEntityId()
      ) {
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.ATTRIBUTE,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.HEATMAP,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.GUIDANCE,
          operation.getOTOperation()
        );
        const userMap = y.getMap("users");
        if (userMap.get(y.clientID) !== operation.getJabberId()) {
          const userList = y.getMap("userList");
          var color = Util.getColor(
            userList.get(operation.getJabberId()).globalId
          );
          refreshTraceAwareness(color);
        }
        processNodeResizeOperation(operation);
      }
    };

    /**
     * Callback for a remote Node Delete Operation
     * @param {operations.ot.NodeDeleteOperation} operation
     */
    this.remoteNodeDeleteCallback = function (operation) {
      if (
        operation instanceof NodeDeleteOperation &&
        operation.getEntityId() === that.getEntityId()
      ) {
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.ATTRIBUTE,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.GUIDANCE,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.HEATMAP,
          operation.getOTOperation()
        );
        processNodeDeleteOperation(operation);
        HistoryManagerInstance.clean(operation.getEntityId());
      }
    };

    this.init = function () {
      //Define Node Rightclick Menu
      $.contextMenu({
        selector: "#" + id,
        zIndex: AbstractEntity.CONTEXT_MENU_Z_INDEX,
        build: function ($trigger, e) {
          var menuItems, offsetClick, offsetCanvas;
          var EntityManager = require("canvas_widget/EntityManager");

          offsetClick = $(e.target).offset();
          offsetCanvas = that.getCanvas().get$node().offset();

          if (
            _canvas.getSelectedEntity() === null ||
            _canvas.getSelectedEntity() === that
          ) {
            menuItems = _.extend(_contextMenuItemCallback(), {
              connectTo: EntityManager.generateConnectToMenu(that),
              sepMove: "---------",
              moveToForeground: {
                name: "Move to Foreground",
                callback: function (/*key, opt*/) {
                  that.propagateNodeMoveZOperation(
                    new NodeMoveZOperation(
                      that.getEntityId(),
                      ++AbstractEntity.maxZIndex - _zIndex
                    )
                  );
                },
              },
              moveToBackground: {
                name: "Move to Background",
                callback: function (/*key, opt*/) {
                  that.propagateNodeMoveZOperation(
                    new NodeMoveZOperation(
                      that.getEntityId(),
                      --AbstractEntity.minZIndex - _zIndex
                    )
                  );
                },
              },
              sepDelete: "---------",
              delete: {
                name: "Delete",
                callback: function (/*key, opt*/) {
                  that.triggerDeletion();
                },
              },
              quit: {
                name: " ",
                disabled: true,
              },
            });

            return {
              items: menuItems,
              events: {
                show: function (/*opt*/) {
                  _canvas.select(that);
                },
              },
            };
          } else {
            _canvas.select(null);
            return false;
          }
        },
      });
    };

    /**
     * Triggers jsPlumb's repaint function and adjusts the angle of the edge labels
     */
    var repaint = function () {
      //var edgeId,
      //    edges = that.getEdges();
      jsPlumb.repaint(_$node);
      /*for(edgeId in edges){
               if(edges.hasOwnProperty(edgeId)){
               edges[edgeId].repaintOverlays();
               edges[edgeId].setZIndex();
               }
               }*/
      _.each(require("canvas_widget/EntityManager").getEdges(), function (e) {
        e.setZIndex();
      });
    };

    /**
     * Anchor options for new connections
     * @type {object}
     */
    var _anchorOptions = ["Perimeter", { shape: "Rectangle", anchorCount: 10 }];

    /**
     * Get options for new connections
     * @returns {Object}
     */
    this.getAnchorOptions = function () {
      return _anchorOptions;
    };

    /**
     * Send NodeDeleteOperation for node
     */
    this.triggerDeletion = function (historyFlag) {
      var edgeId,
        edges = this.getEdges(),
        edge;
      _canvas.select(null);
      for (edgeId in edges) {
        if (edges.hasOwnProperty(edgeId)) {
          edge = edges[edgeId];
          edge.triggerDeletion();
        }
      }
      var operation = new NodeDeleteOperation(
        id,
        that.getType(),
        _appearance.left,
        _appearance.top,
        _appearance.width,
        _appearance.height,
        _zIndex,
        _appearance.containment,
        that.toJSON()
      );
      if (_ymap) {
        propagateNodeDeleteOperation(operation);
        const nodesMap = y.getMap("nodes");
        nodesMap.delete(that.getEntityId());
      } else {
        propagateNodeDeleteOperation(operation);
      }
      if (!historyFlag) HistoryManagerInstance.add(operation);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get callback to generate list of context menu items
     * @returns {object}
     */
    this.getContextMenuItemCallback = function () {
      return _contextMenuItemCallback;
    };

    /**
     * Set callback to generate list of context menu items
     * @param {function} contextMenuItemCallback
     */
    this.setContextMenuItemCallback = function (contextMenuItemCallback) {
      if (typeof contextMenuItemCallback === "function") {
        _contextMenuItemCallback = contextMenuItemCallback;
      }
    };

    /**
     * Get node appearance
     * @returns {{left: number, top: number, width: number, height: number}}
     */
    this.getAppearance = function () {
      return _appearance;
    };

    /**
     * Get position of node on z-axis
     * @return {number}
     */
    this.getZIndex = function () {
      return _zIndex;
    };

    this.refreshTraceAwareness = function (color) {
      refreshTraceAwareness(color);
    };

    /**
     * Adds node to canvas
     * @param {canvas_widget.AbstractCanvas} canvas
     */
    this.addToCanvas = function (canvas) {
      _canvas = canvas;
      canvas.get$canvas().append(_$awarenessTrace);
      canvas.get$canvas().append(_$node);
    };

    /**
     * Get associated canvas
     * @returns {canvas_widget.AbstractCanvas}
     */
    this.getCanvas = function () {
      return _canvas;
    };

    /**
     * Removes node from canvas
     */
    this.removeFromCanvas = function () {
      _$node.remove();
      //destroy the context menu
      $.contextMenu("destroy", "#" + that.getEntityId());
      _canvas = null;
      _$awarenessTrace.remove();
      if (this.hasOwnProperty("unregisterCallbacks"))
        this.unregisterCallbacks();
    };

    /**
     * Add attribute to node
     * @param {canvas_widget.AbstractAttribute} attribute
     */
    this.addAttribute = function (attribute) {
      var id = attribute.getEntityId();
      if (!_attributes.hasOwnProperty(id)) {
        _attributes[id] = attribute;
      }
    };

    /**
     * Get attribute by id
     * @param {String} id Attribute's entity id
     * @returns {canvas_widget.AbstractAttribute}
     */
    this.getAttribute = function (id) {
      if (_attributes.hasOwnProperty(id)) {
        return _attributes[id];
      }
      return null;
    };

    /**
     * Delete attribute by id
     * @param {String} id Attribute's entity id
     */
    this.deleteAttribute = function (id) {
      if (_attributes.hasOwnProperty(id)) {
        delete _attributes[id];
      }
    };

    /**
     * Set node's attributes
     * @param {Object} attributes
     */
    this.setAttributes = function (attributes) {
      _attributes = attributes;
    };

    /**
     * Get node's attributes
     * @returns {Object}
     */
    this.getAttributes = function () {
      return _attributes;
    };

    /**
     * Set edge label
     * @param {canvas_widget.SingleValueAttribute} label
     */
    this.setLabel = function (label) {
      _label = label;
    };

    /**
     * Get edge label
     * @returns {canvas_widget.SingleValueAttribute}
     */
    this.getLabel = function () {
      return _label;
    };

    /**
     * Get edge type
     * @returns {string}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get edge type
     * @returns {boolean}
     */
    this.getContainment = function () {
      return _containment;
    };

    /**
     * Get jQuery object of DOM node representing the node
     * @returns {jQuery}
     * @private
     */
    this._get$node = function () {
      return _$node;
    };

    /**
     * Apply position and dimension attributes to the node
     * @private
     */
    this._draw = function () {
      //noinspection JSAccessibilityCheck
      _$awarenessTrace.css({
        left: _appearance.left + _appearance.width / 2,
        top: _appearance.top + _appearance.height / 2,
        width: _appearance.width * 1.2,
        height: _appearance.height * 1.2,
        zIndex: _zIndex - 1,
      });
      _$node.css({
        left: _appearance.left,
        top: _appearance.top,
        width: _appearance.width,
        height: _appearance.height,
        zIndex: _zIndex,
      });
    };

    /**
     * Move the node
     * @param {number} offsetX Offset in x-direction
     * @param {number} offsetY Offset in y-direction
     * @param {number} offsetZ Offset in z-direction
     */
    this.move = function (offsetX, offsetY, offsetZ) {
      _appearance.left += offsetX;
      _appearance.top += offsetY;

      _zIndex += offsetZ;

      if (_ymap) {
        _ymap.set("left", _appearance.left);
        _ymap.set("top", _appearance.top);
        _ymap.set("zIndex", _zIndex);
      }
      this._draw();
      repaint();
    };

    this.moveAbs = function (left, top, zIndex) {
      _appearance.left = left;
      _appearance.top = top;

      if (zIndex) _zIndex = zIndex;

      if (_ymap) {
        _ymap.set("left", _appearance.left);
        _ymap.set("top", _appearance.top);
        if (zIndex) _ymap.set("zIndex", _zIndex);
      }
      this._draw();
      repaint();
    };

    /**
     * Resize the node
     * @param {number} offsetX Offset in x-direction
     * @param {number} offsetY Offset in y-direction
     */
    this.resize = function (offsetX, offsetY) {
      _appearance.width += offsetX;
      _appearance.height += offsetY;
      if (_ymap) {
        _ymap.set("width", _appearance.width);
        _ymap.set("height", _appearance.height);
      }
      this._draw();
      repaint();
    };

    /**
     * Add ingoing edge
     * @param {canvas_widget.AbstractEdge} edge
     */
    this.addIngoingEdge = function (edge) {
      var id = edge.getEntityId();
      var source = edge.getSource();
      var sourceEntityId = source.getEntityId();
      if (!_ingoingEdges.hasOwnProperty(id)) {
        _ingoingEdges[id] = edge;
        if (!_ingoingNeighbors.hasOwnProperty(sourceEntityId)) {
          _ingoingNeighbors[sourceEntityId] = source;
        }
      }
    };

    /**
     * Add outgoing edge
     * @param {canvas_widget.AbstractEdge} edge
     */
    this.addOutgoingEdge = function (edge) {
      var id = edge.getEntityId();
      var target = edge.getTarget();
      var targetEntityId = target.getEntityId();
      if (!_outgoingEdges.hasOwnProperty(id)) {
        _outgoingEdges[id] = edge;
        if (!_outgoingNeighbors.hasOwnProperty(targetEntityId)) {
          _outgoingNeighbors[targetEntityId] = target;
        }
      }
    };

    /**
     * Delete ingoing edge
     * @param {canvas_widget.AbstractEdge} edge
     */
    this.deleteIngoingEdge = function (edge) {
      var id = edge.getEntityId();
      var source = edge.getSource();
      var sourceEntityId = source.getEntityId();
      var isMultiEdge = false;
      if (_ingoingEdges.hasOwnProperty(id)) {
        delete _ingoingEdges[id];
        for (var edgeId in _ingoingEdges) {
          if (
            _ingoingEdges.hasOwnProperty(edgeId) &&
            _ingoingEdges[edgeId].getSource().getEntityId() === sourceEntityId
          ) {
            isMultiEdge = true;
          }
        }
        if (!isMultiEdge) {
          delete _ingoingNeighbors[sourceEntityId];
        }
      }
    };

    /**
     * Delete outgoing edge
     * @param {canvas_widget.AbstractEdge} edge
     */
    this.deleteOutgoingEdge = function (edge) {
      var id = edge.getEntityId();
      var target = edge.getTarget();
      var targetEntityId = target.getEntityId();
      var isMultiEdge = false;
      if (_outgoingEdges.hasOwnProperty(id)) {
        delete _outgoingEdges[id];
        for (var edgeId in _outgoingEdges) {
          if (
            _outgoingEdges.hasOwnProperty(edgeId) &&
            _outgoingEdges[edgeId].getTarget().getEntityId() === targetEntityId
          ) {
            isMultiEdge = true;
          }
        }
        if (!isMultiEdge) {
          delete _outgoingNeighbors[targetEntityId];
        }
      }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get ingoing edges
     * @returns {Object}
     */
    this.getIngoingEdges = function () {
      return _ingoingEdges;
    };

    /**
     * Get outgoing edges
     * @returns {Object}
     */
    this.getOutgoingEdges = function () {
      return _outgoingEdges;
    };

    /**
     * Get all ingoing and outgoing edges
     * @returns {Array}
     */
    this.getEdges = function () {
      return Util.union(_ingoingEdges, _outgoingEdges);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get neighbors with an edge to the node
     * @returns {Object}
     */
    this.getIngoingNeighbors = function () {
      return _ingoingNeighbors;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get neighbors with an edge from the node
     * @returns {Object}
     */
    this.getOutgoingNeighbors = function () {
      return _outgoingNeighbors;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get neighbors with an edge to or from the node
     * @returns {Object}
     */
    this.getNeighbors = function () {
      return Util.union(_ingoingNeighbors, _outgoingNeighbors);
    };

    /**
     * Lowlight the node
     */
    this.lowlight = function () {
      _$node.addClass("lowlighted");
    };

    /**
     * Unlowlight the node
     */
    this.unlowlight = function () {
      _$node.removeClass("lowlighted");
    };

    /**
     * Select the node
     */
    this.select = function () {
      _isSelected = true;
      this.unhighlight();
      _$node.addClass("selected");
      Util.delay(100).then(function () {
        _.each(require("canvas_widget/EntityManager").getEdges(), function (e) {
          e.setZIndex();
        });
      });
    };

    /**
     * Unselect the node
     */
    this.unselect = function () {
      _isSelected = false;
      //this.highlight(_highlightColor,_highlightUsername);
      _$node.removeClass("selected");
      //tigger save when unselecting an entity
      $("#save").click();
      Util.delay(100).then(function () {
        _.each(require("canvas_widget/EntityManager").getEdges(), function (e) {
          e.setZIndex();
        });
      });
    };

    /**
     * Highlight the node by assigning it the passed color and label it with the passed username
     * @param {String} color
     * @param {String} username
     */
    this.highlight = function (color, username) {
      //unhighlight everything else
      //$('.node:not(.selected)').css({border: "2px solid transparent"});
      //$('.user_highlight').remove();
      if (color && username) {
        _$node.css({ border: "2px solid " + color });
        _$node.append(
          $("<div></div>")
            .addClass("user_highlight")
            .css("color", color)
            .text(username)
        );
        Util.delay(100).then(function () {
          _.each(
            require("canvas_widget/EntityManager").getEdges(),
            function (e) {
              e.setZIndex();
            }
          );
        });
      }
    };

    /**
     * Unhighlight the node
     */
    this.unhighlight = function () {
      _$node.css({ border: "" });
      _$node.find(".user_highlight").remove();
      Util.delay(100).then(function () {
        var EntityManager = null;
        try {
          EntityManager = require("canvas_widget/EntityManager");
          _.each(EntityManager.getEdges(), function (e) {
            e.setZIndex();
          });
        } catch (error) {
          require(["canvas_widget/EntityManager"], function (EntityManager) {
            _.each(EntityManager.getEdges(), function (e) {
              e.setZIndex();
            });
          });
        }
      });
    };

    /**
     * Remove the node
     */
    this.remove = function () {
      clearInterval(_awarenessTimer);
      this.removeFromCanvas();
      require("canvas_widget/EntityManager").deleteNode(this.getEntityId());
    };

    /**
     * Get JSON representation of the node
     * @returns {Object}
     * @private
     */
    this._toJSON = function () {
      var attr = {};
      _.forEach(this.getAttributes(), function (val, key) {
        attr[key] = val.toJSON();
      });
      //noinspection JSAccessibilityCheck
      return {
        label: _label.toJSON(),
        left: _appearance.left,
        top: _appearance.top,
        width: _appearance.width,
        height: _appearance.height,
        zIndex: _zIndex,
        type: _type,
        attributes: attr,
      };
    };

    this.addGhostEdge = function (ghostEdge) {
      _relatedGhostEdges.push(ghostEdge);
    };

    /**
     * Bind events for move tool
     */
    this.bindMoveToolEvents = function () {
      //$canvas.find(".node.ui-draggable").draggable("option","disabled",false);
      var originalPos = {
        left: 0,
        top: 0,
      };

      var lastDragPos = {
        left: 0,
        top: 0,
      };

      //Enable Node Selection
      var drag = false;
      var $sizePreview = $('<div class="size-preview"></div>').hide();
      var clickedNode = _$node.on("click", function () {
        _canvas.select(that);
      });

      if (that.getContainment()) {
        clickedNode.droppable({
          hoverClass: "selected",
          drop: function (event, ui) {
            const EntityManager = require("canvas_widget/EntityManager");

            var containerNode = EntityManager.getNodes()[$(this).attr("id")];
            var childNode = EntityManager.getNodes()[ui.draggable.attr("id")];
            var relations = EntityManager.getRelations();

            var isConnected = false;
            var relationshipType = null;

            _.each(containerNode.getOutgoingEdges(), function (edge) {
              if (edge.getTarget().getEntityId() === childNode.getEntityId()) {
                isConnected = true;
                return false;
              }
            });

            _.each(relations, function (relation, key) {
              _.each(relation, function (r) {
                _.each(r.sourceTypes, function (source) {
                  if (containerNode.getType() === source) {
                    _.each(r.targetTypes, function (target) {
                      if (childNode.getType() === target) {
                        relationshipType = key;
                        return false;
                      }
                    });
                  }
                });
              });
            });

            if (!isConnected && relationshipType) {
              _canvas.createEdge(
                relationshipType,
                $(this).attr("id"),
                ui.draggable.attr("id")
              );
            }

            // // now, the attributes left and top of the node are not related to the top left corner of the
            // // canvas anymore, but instead they are related to the top left corner of the parent element
            // // => move node to correct left and right attribute
            // const EntityManager = require('canvas_widget/EntityManager');
            //
            // const containerLeft = that.getAppearance().left;
            // const containerTop = that.getAppearance().top;
            //
            // const operation = new NodeMoveOperation(ui.draggable.attr("id"), -containerLeft, -containerTop);
            // EntityManager.getNodes()[ui.draggable.attr("id")].propagateNodeMoveOperation(operation);
          },
        });
      }

      clickedNode
        //Enable Node Resizing
        .resizable({
          containment: "parent",
          start: function (ev /*,ui*/) {
            _canvas.hideGuidanceBox();
            $sizePreview.show();
            _$node.css({ opacity: 0.5 });
            _$node.append($sizePreview);
            _$node.resizable("option", "aspectRatio", ev.shiftKey);
            _$node.resizable("option", "grid", ev.ctrlKey ? [20, 20] : "");
          },
          resize: function (ev, ui) {
            _canvas.hideGuidanceBox();
            $sizePreview.text(
              Math.round(ui.size.width) + "x" + Math.round(ui.size.height)
            );
            repaint();
            _$node.resizable("option", "aspectRatio", ev.shiftKey);
            _$node.resizable("option", "grid", ev.ctrlKey ? [20, 20] : "");
          },
          stop: function (ev, ui) {
            $sizePreview.hide();
            _$node.css({ opacity: "" });
            var $target = ui.helper;
            $target.css({
              width: ui.originalSize.width,
              height: ui.originalSize.height,
            });
            var offsetX = ui.size.width - ui.originalSize.width;
            var offsetY = ui.size.height - ui.originalSize.height;
            var operation = new NodeResizeOperation(id, offsetX, offsetY);
            that.propagateNodeResizeOperation(operation);
            _$node.resizable("option", "aspectRatio", false);
            _$node.resizable("option", "grid", "");

            //TODO: check that! Already called in processNodeResizeOperation called by propagateNodeResizeOperation
            //_canvas.showGuidanceBox();
          },
        })

        //Enable Node Dragging
        .draggable({
          containment: "parent",
          start: function (ev, ui) {
            originalPos.top = ui.position.top;
            originalPos.left = ui.position.left;

            lastDragPos.top = ui.position.top;
            lastDragPos.left = ui.position.left;

            //ui.position.top = 0;
            //ui.position.left = 0;
            _canvas.select(that);
            _canvas.hideGuidanceBox();
            _$node.css({ opacity: 0.5 });
            _$node.resizable("disable");
            drag = false;
            _$node.draggable("option", "grid", ev.ctrlKey ? [20, 20] : "");
          },
          drag: function (ev, ui) {
            // ui.position.left = Math.round(ui.position.left  / _canvas.getZoom());
            // ui.position.top = Math.round(ui.position.top / _canvas.getZoom());
            var offsetX = Math.round(
              (ui.position.left - lastDragPos.left) / _canvas.getZoom()
            );
            var offsetY = Math.round(
              (ui.position.top - lastDragPos.top) / _canvas.getZoom()
            );

            function setChildPosition(node) {
              if (node.getContainment()) {
                _.each(node.getOutgoingEdges(), function (edge) {
                  $("#" + edge.getTarget().getEntityId()).offset({
                    top:
                      $("#" + edge.getTarget().getEntityId()).offset().top +
                      offsetY,
                    left:
                      $("#" + edge.getTarget().getEntityId()).offset().left +
                      offsetX,
                  });
                  setChildPosition(edge.getTarget());
                });
              }
            }

            setChildPosition(that);

            lastDragPos.top = ui.position.top;
            lastDragPos.left = ui.position.left;

            if (drag) repaint();
            drag = true;

            _canvas.hideGuidanceBox();
            _$node.draggable("option", "grid", ev.ctrlKey ? [20, 20] : "");
          },
          stop: function (ev, ui) {
            _$node.css({ opacity: "" });
            _$node.resizable("enable");
            var id = _$node.attr("id");
            //_$node.css({top: originalPos.top / _canvas.getZoom(), left: originalPos.left / _canvas.getZoom()});
            var offsetX = Math.round(
              (ui.position.left - originalPos.left) / _canvas.getZoom()
            );
            var offsetY = Math.round(
              (ui.position.top - originalPos.top) / _canvas.getZoom()
            );

            var operation = new NodeMoveOperation(
              that.getEntityId(),
              offsetX,
              offsetY
            );
            that.propagateNodeMoveOperation(operation);

            function propagateChildPosition(node) {
              if (node.getContainment()) {
                _.each(node.getOutgoingEdges(), function (edge) {
                  var operation = new NodeMoveOperation(
                    edge.getTarget().getEntityId(),
                    offsetX,
                    offsetY
                  );
                  edge.getTarget().propagateNodeMoveOperation(operation);
                  propagateChildPosition(edge.getTarget());
                });
              }
            }

            propagateChildPosition(that);

            //Avoid node selection on drag stop
            _$node.draggable("option", "grid", "");
            _canvas.showGuidanceBox();
            $(ev.toElement).one("click", function (ev) {
              ev.stopImmediatePropagation();
            });
          },
        })

        //Enable Node Rightclick menu
        .contextMenu(true)

        .transformable({
          rotatable: false,
          skewable: false,
          scalable: false,
        })

        .find("input")
        .prop("disabled", false)
        .css("pointerEvents", "");

      // view_only is used by the CAE and allows to show a model in the Canvas which is not editable
      // therefore, the nodes should not be draggable and their context menu should be disabled
      const widgetConfigMap = y.getMap("widgetConfig");
      var viewOnly = widgetConfigMap.get("view_only");
      if (viewOnly) {
        _$node.on("click").draggable().draggable("destroy");
        _$node.on("click").contextMenu(false);
      }
    };

    /**
     * Unbind events for move tool
     */
    this.unbindMoveToolEvents = function () {
      //Disable Node Selection
      _$node
        .off("click")

        //$canvas.find(".node.ui-draggable").draggable( "option", "disabled", true);
        //Disable Node Resizing
        .resizable()
        .resizable("destroy")

        //Disable Node Draggin
        .draggable()
        .draggable("destroy")

        //Disable Node Rightclick Menu
        .contextMenu(false)

        .transformable("destroy")

        .find("input")
        .prop("disabled", true)
        .css("pointerEvents", "none");
    };

    /**
     * Bind source node events for edge tool
     */
    this.makeSource = function () {
      _$node.addClass("source");
      jsPlumb.makeSource(_$node, {
        connectorPaintStyle: { strokeStyle: "#aaaaaa", lineWidth: 2 },
        endpoint: "Blank",
        anchor: _anchorOptions,
        //maxConnections:1,
        uniqueEndpoint: false,
        deleteEndpointsOnDetach: true,
        onMaxConnections: function (info /*, originalEvent*/) {
          console.log(
            "element is ",
            info.element,
            "maxConnections is",
            info.maxConnections
          );
        },
      });
    };

    /**
     * Bind target node events for edge tool
     */
    this.makeTarget = function () {
      _$node.addClass("target");
      jsPlumb.makeTarget(_$node, {
        isTarget: false,
        endpoint: "Blank",
        anchor: _anchorOptions,
        uniqueEndpoint: false,
        //maxConnections:1,
        deleteEndpointsOnDetach: true,
        onMaxConnections: function (info /*, originalEvent*/) {
          console.log(
            "user tried to drop connection",
            info.connection,
            "on element",
            info.element,
            "with max connections",
            info.maxConnections
          );
        },
      });
    };

    /**
     * Unbind events for edge tool
     */
    this.unbindEdgeToolEvents = function () {
      _$node.removeClass("source target");
      jsPlumb.unmakeSource(_$node);
      jsPlumb.unmakeTarget(_$node);
    };

    that.init();

    this._registerYMap = function () {
      _ymap.observe(function (event) {
        var yUserId = event.object.map[event.name][0];

        if (
          y.clientID !== yUserId ||
          (event.value && event.value.historyFlag)
        ) {
          var operation;
          var data = event.value;
          const userMap = y.getMap("users");
          var jabberId = userMap.get(yUserId);
          switch (event.name) {
            case NodeMoveOperation.TYPE: {
              operation = new NodeMoveOperation(
                data.id,
                data.offsetX,
                data.offsetY,
                jabberId
              );
              remoteNodeMoveCallback(operation);
              break;
            }
            case NodeMoveZOperation.TYPE: {
              operation = new NodeMoveZOperation(
                data.id,
                data.offsetZ,
                jabberId
              );
              remoteNodeMoveZCallback(operation);
              break;
            }
            case NodeResizeOperation.TYPE: {
              operation = new NodeResizeOperation(
                data.id,
                data.offsetX,
                data.offsetY,
                jabberId
              );
              remoteNodeResizeCallback(operation);
              break;
            }
          }
        }
      });
    };
  }
  /**
   * Apply position and dimension attributes to the node
   */
  draw() {
    return this._draw();
  }
  /**
   * Get jQuery object of DOM node representing the node
   * @returns {jQuery}
   */
  get$node() {
    return this._get$node();
  }
  /**
   * Get JSON representation of the node
   * @returns {{label: Object, left: number, top: number, width: number, height: number, type: string, attributes: Object}}
   */
  toJSON() {
    return this._toJSON();
  }
  /**
   * hide the node and all associated edges
   */
  hide() {
    this.get$node().hide();
    jsPlumb.hide(this.get$node());
  }
  /**
   * show the node and all associated edges
   */
  show() {
    this.get$node().show();
    jsPlumb.show(this.get$node()[0]);
    jsPlumb.repaint(this.get$node()[0]);
  }
  registerYMap() {
    this._registerYMap();
  }
}

function HistoryManager() {
  var bufferSize = 20;

  var _canvas = null;

  var latestOp = null;
  var undo = [];
  var redo = [];

  var $undo = $("#undo");

  var $redo = $("#redo");

  var propagateHistoryOperationFromJson = function (json) {
    var EntityManager = EntityManager;
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

export const HistoryManagerInstance = new HistoryManager();

const openapp = new OpenAppProvider().openapp;

/**
 * Predefined node shapes, first is default
 * @type {{circle: *, diamond: *, rectangle: *, triangle: *}}
 */
var nodeShapeTypes = {
  circle: circleNodeHtml,
  diamond: diamondNodeHtml,
  rectangle: rectangleNodeHtml,
  rounded_rectangle: roundedRectangleNodeHtml,
  triangle: triangleNodeHtml,
};

/**
 * jQuery object to test for valid color
 * @type {$}
 */
var $colorTestElement = $("<div></div>");

/** Determines the current layer of syncmeta.
 *  can be CONFIG.LAYER.MODEL or CONFIG.LAYER.META*/
var _layer = null;

/**
 * Different node types
 * @type {object}
 */
var nodeTypes = {};

var _initNodeTypes = function (vls) {
  var _nodeTypes = {};

  var nodes = vls.nodes,
    node,
    shape,
    anchors;

  // Start creating nodes based on metamodel
  for (var nodeId in nodes) {
    if (nodes.hasOwnProperty(nodeId)) {
      node = nodes[nodeId];
      if (node.shape.customShape) {
        shape = node.shape.customShape;
      } else {
        shape = nodeShapeTypes.hasOwnProperty(node.shape.shape)
          ? nodeShapeTypes[node.shape.shape]
          : _.keys(nodeShapeTypes)[0];
      }
      if (node.shape.customAnchors) {
        try {
          if (node.shape.customAnchors) {
            anchors = JSON.parse(node.shape.customAnchors);
          }
          if (!node.shape.customAnchors instanceof Array) {
            anchors = [
              "Perimeter",
              {
                shape: "Rectangle",
                anchorCount: 10,
              },
            ];
          }
        } catch (e) {
          anchors = [
            "Perimeter",
            {
              shape: "Rectangle",
              anchorCount: 10,
            },
          ];
        }
      } else {
        switch (node.shape.shape) {
          case "circle":
            anchors = [
              "Perimeter",
              {
                shape: "Circle",
                anchorCount: 10,
              },
            ];
            break;
          case "diamond":
            anchors = [
              "Perimeter",
              {
                shape: "Diamond",
                anchorCount: 10,
              },
            ];
            break;
          case "rounded_rectangle":
            anchors = [
              "Perimeter",
              {
                shape: "Rectangle",
                anchorCount: 10,
              },
            ];
            break;
          case "triangle":
            anchors = [
              "Perimeter",
              {
                shape: "Triangle",
                anchorCount: 10,
              },
            ];
            break;
          default:
          case "rectangle":
            anchors = [
              "Perimeter",
              {
                shape: "Rectangle",
                anchorCount: 10,
              },
            ];
            break;
        }
      }
      var color = node.shape.color
        ? $colorTestElement
            .css("color", "#FFFFFF")
            .css("color", node.shape.color)
            .css("color")
        : "#FFFFFF";
      var $shape = $(_.template(shape)({ color: color, type: node.label }));

      if (
        node.hasOwnProperty("targetName") &&
        !$.isEmptyObject(nodeTypes) &&
        nodeTypes.hasOwnProperty(node.targetName)
      ) {
        _nodeTypes[node.label] = ViewNode(
          node.label,
          $shape,
          anchors,
          node.attributes,
          nodeTypes[node.targetName],
          node.conditions,
          node.conjunction
        );
        nodeTypes[node.targetName].VIEWTYPE = node.label;
      } else {
        _nodeTypes[node.label] = Node(
          node.label,
          $shape,
          anchors,
          node.attributes
        );
      }
      _nodeTypes[node.label].TYPE = node.label;
      _nodeTypes[node.label].DEFAULT_WIDTH = node.shape.defaultWidth;
      _nodeTypes[node.label].DEFAULT_HEIGHT = node.shape.defaultHeight;
      _nodeTypes[node.label].CONTAINMENT = node.shape.containment;
      _nodeTypes[node.label].SHAPE = $shape;
      /*
                 nodeTypes[node.label] = Node(node.label, $shape, anchors, node.attributes, node.jsplumb);
                 nodeTypes[node.label].TYPE = node.label;
                 nodeTypes[node.label].SHAPE = $shape;
                 nodeTypes[node.label].DEFAULT_WIDTH = node.shape.defaultWidth;
                 nodeTypes[node.label].DEFAULT_HEIGHT = node.shape.defaultHeight;*/
    }
  }
  return _nodeTypes;
};

/**
 * Guidance modeling specific objects
 * Unused
 */

var objectContextTypes = {};
var relationshipContextTypes = {};
var objectToolTypes = {};
var edgesByLabel = {};
var objectToolNodeTypes = {};

var _initEdgeTypes = function (vls) {
  var _edgeTypes = {};
  var _relations = {};
  var edges = vls.edges,
    edge;
  for (var edgeId in edges) {
    if (edges.hasOwnProperty(edgeId)) {
      edge = edges[edgeId];

      if (
        edge.hasOwnProperty("targetName") &&
        !$.isEmptyObject(edgeTypes) &&
        edgeTypes.hasOwnProperty(edge.targetName)
      ) {
        _edgeTypes[edge.label] = ViewEdge(
          edge.label,
          edge.shape.arrow,
          edge.shape.shape,
          edge.shape.color,
          edge.shape.dashstyle,
          edge.shape.overlay,
          edge.shape.overlayPosition,
          edge.shape.overlayRotate,
          edge.attributes,
          edgeTypes[edge.targetName],
          edge.conditions,
          edge.conjunction
        );
        edgeTypes[edge.targetName].VIEWTYPE = edge.label;
      } else {
        _edgeTypes[edge.label] = Edge(
          edge.label,
          edge.shape.arrow,
          edge.shape.shape,
          edge.shape.color,
          edge.shape.dashstyle,
          edge.shape.overlay,
          edge.shape.overlayPosition,
          edge.shape.overlayRotate,
          edge.attributes
        );
      }

      _edgeTypes[edge.label].TYPE = edge.label;
      _relations[edge.label] = edge.relations;
    }
  }
  return {
    edgeTypes: _edgeTypes,
    relations: _relations,
  };
};

/**
 * contains all view node types of the current view
 * @type {{}}
 */
var viewNodeTypes = {};

/**
 * contains all view edge types of the current view
 * @type {{}}
 */
var viewEdgeTypes = {};

/**
 * Different edge types
 * @type {object}
 */
var edgeTypes = {};
var relations = {};
/*
     if (metamodel && metamodel.hasOwnProperty("edges")) {
     var res = _initEdgeTypes(metamodel);
     edgeTypes = res.edgeTypes;
     relations = res.relations;
     } else {
     edgeTypes[GeneralisationEdge.TYPE] = GeneralisationEdge;
     edgeTypes[BiDirAssociationEdge.TYPE] = BiDirAssociationEdge;
     edgeTypes[UniDirAssociationEdge.TYPE] = UniDirAssociationEdge;

     relations[BiDirAssociationEdge.TYPE] = BiDirAssociationEdge.RELATIONS;
     relations[UniDirAssociationEdge.TYPE] = UniDirAssociationEdge.RELATIONS;
     relations[GeneralisationEdge.TYPE] = GeneralisationEdge.RELATIONS;
     }*/

/**
 * EntityManager
 * @class canvas_widget.EntityManager
 * @memberof canvas_widget
 * @constructor
 */
function EntityManager() {
  /**
   * the view id indicates if the EntityManager should use View types for modeling or node types
   * @type {string}
   * @private
   */
  var _viewId = undefined;

  /**
   * Model attributes node
   * @type {canvas_widget.ModelAttributesNode}
   * @private
   */
  var _modelAttributesNode = null;
  /**
   * Nodes of the graph
   * @type {{}}
   * @private
   */
  var _nodes = {};
  /**
   * Edges of the graph
   * @type {{}}
   * @private
   */
  var _edges = {};

  var metamodel = null;

  var guidancemodel = null;

  //noinspection JSUnusedGlobalSymbols
  return {
    /**
     * Create a new node
     * @memberof canvas_widget.EntityManager#
     * @param {string} type Type of node
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {number} zIndex Position of node on z-axis
     * @param {object} json the json representation
     * @returns {canvas_widget.AbstractNode}
     */
    createNode: function (
      type,
      id,
      left,
      top,
      width,
      height,
      zIndex,
      containment,
      json
    ) {
      var node;
      AbstractEntity.maxZIndex = Math.max(AbstractEntity.maxZIndex, zIndex);
      AbstractEntity.minZIndex = Math.min(AbstractEntity.minZIndex, zIndex);

      if (_viewId && viewNodeTypes.hasOwnProperty(type)) {
        node = viewNodeTypes[type](
          id,
          left,
          top,
          width,
          height,
          zIndex,
          containment,
          json
        );
      } else if (nodeTypes.hasOwnProperty(type)) {
        node = new nodeTypes[type](
          id,
          left,
          top,
          width,
          height,
          zIndex,
          containment,
          json
        );
      }
      _nodes[id] = node;
      return node;
    },
    /**
     * Create model Attributes node
     * @returns {canvas_widget.ModelAttributesNode}
     */
    createModelAttributesNode: function () {
      if (_modelAttributesNode === null) {
        if (metamodel)
          _modelAttributesNode = new ModelAttributesNode(
            "modelAttributes",
            metamodel.attributes
          );
        else
          _modelAttributesNode = new ModelAttributesNode(
            "modelAttributes",
            null
          );
        return _modelAttributesNode;
      }
      return _modelAttributesNode;
    },
    /**
     * Find node by id
     * @memberof canvas_widget.EntityManager#
     * @param {string} id Entity id
     * @returns {canvas_widget.AbstractNode}
     */
    findNode: function (id) {
      if (_nodes.hasOwnProperty(id)) {
        return _nodes[id];
      }
      return null;
    },
    /**
     * Find node or edge by id
     * @memberof attribute_widget.EntityManager#
     * @param {string} id Entity id
     * @returns {*}
     */
    find: function (id) {
      return this.findNode(id) || this.findEdge(id);
    },
    /**
     * Delete node by id
     * @memberof canvas_widget.EntityManager#
     * @param {string} id Entity id
     */
    deleteNode: function (id) {
      if (_nodes.hasOwnProperty(id)) {
        delete _nodes[id];
      }
    },
    /**
     * Get all nodes
     * @memberof canvas_widget.EntityManager#
     * @returns {object}
     */
    getNodes: function () {
      return _nodes;
    },
    /**
     * Get nodes by type
     * @memberof canvas_widget.EntityManager#
     * @param {string|string[]} type Entity type
     * @returns {object}
     */
    getNodesByType: function (type) {
      var nodeId,
        node,
        nodesByType = {};

      if (typeof type === "string") {
        type = [type];
      }

      for (nodeId in _nodes) {
        if (_nodes.hasOwnProperty(nodeId)) {
          node = _nodes[nodeId];
          if (type.indexOf(node.getType()) !== -1) {
            nodesByType[nodeId] = node;
          }
        }
      }
      return nodesByType;
    },
    /**
     * Create a new edge
     * @memberof canvas_widget.EntityManager#
     * @param {string} type Type of edge
     * @param {string} id Entity identifier of edge
     * @param {canvas_widget.AbstractNode} source Source node
     * @param {canvas_widget.AbstractNode} target Target node
     * @returns {canvas_widget.AbstractEdge}
     */
    //TODO: switch id and type
    createEdge: function (type, id, source, target) {
      var edge;

      if (_viewId && viewEdgeTypes.hasOwnProperty(type)) {
        edge = viewEdgeTypes[type](id, source, target);
      } else if (edgeTypes.hasOwnProperty(type)) {
        edge = new edgeTypes[type](id, source, target);
      } else {
        return undefined;
      }
      source.addOutgoingEdge(edge);
      target.addIngoingEdge(edge);
      _edges[id] = edge;
      return edge;
    },
    /**
     * Find edge by id
     * @memberof canvas_widget.EntityManager#
     * @param {string} id Entity id
     * @returns {*}
     */
    findEdge: function (id) {
      if (_edges.hasOwnProperty(id)) {
        return _edges[id];
      }
      return null;
    },
    /**
     * Delete edge by id
     * @memberof canvas_widget.EntityManager#
     * @param {string} id Entity id
     */
    deleteEdge: function (id) {
      if (_edges.hasOwnProperty(id)) {
        delete _edges[id];
      }
    },
    /**
     * Get all edges
     * @memberof canvas_widget.EntityManager#
     * @returns {object}
     */
    getEdges: function () {
      return _edges;
    },
    /**
     * Get edges by type
     * @memberof canvas_widget.EntityManager#
     * @param {string} type Entity type
     * @returns {object}
     */
    getEdgesByType: function (type) {
      var edgeId,
        edge,
        edgesByType = {};

      for (edgeId in _edges) {
        if (_edges.hasOwnProperty(edgeId)) {
          edge = _edges[edgeId];
          if (edge.getType() === type) {
            edgesByType[edgeId] = edge;
          }
        }
      }
      return edgesByType;
    },
    /**
     * Get JSON representation of whole graph
     * @memberof canvas_widget.EntityManager#
     * @returns {object}
     */
    graphToJSON: function () {
      var attributesJSON;
      var nodesJSON = {};
      var edgesJSON = {};
      attributesJSON = _modelAttributesNode
        ? _modelAttributesNode.toJSON()
        : {};
      _.forEach(_nodes, function (val, key) {
        nodesJSON[key] = val.toJSON();
      });
      _.forEach(_edges, function (val, key) {
        edgesJSON[key] = val.toJSON();
      });
      return {
        attributes: attributesJSON,
        nodes: nodesJSON,
        edges: edgesJSON,
      };
    },
    /**
     * Create model attributes node by its JSON representation
     * @memberof canvas_widget.EntityManager#
     * @param {object} json JSON representation
     * @returns {canvas_widget.AbstractNode}
     */
    createModelAttributesNodeFromJSON: function (json) {
      var node = this.createModelAttributesNode();
      if (node) {
        node.getLabel().getValue().setValue(json.label.value.value);
        for (var attrId in json.attributes) {
          if (json.attributes.hasOwnProperty(attrId)) {
            var attr = node.getAttribute(attrId);
            if (attr) {
              attr.setValueFromJSON(json.attributes[attrId]);
            }
          }
        }
      }
      return node;
    },
    /**
     * Create a new node by its JSON representation
     * @memberof canvas_widget.EntityManager#
     * @param {string} type Type of node
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {object} json JSON representation
     * @param {number} zIndex Position of node on z-axis
     * @returns {canvas_widget.AbstractNode}
     */
    createNodeFromJSON: function (
      type,
      id,
      left,
      top,
      width,
      height,
      zIndex,
      containment,
      json
    ) {
      var node = this.createNode(
        type,
        id,
        left,
        top,
        width,
        height,
        zIndex,
        containment,
        json
      );
      if (node) {
        node.getLabel().getValue().setValue(json.label.value.value);
        for (var attrId in json.attributes) {
          if (json.attributes.hasOwnProperty(attrId)) {
            var attr = node.getAttribute(attrId);
            if (attr) {
              attr.setValueFromJSON(json.attributes[attrId]);
            } else {
              var newId = attrId.replace(/[^\[\]]*/, id);
              attr = node.getAttribute(newId);
              if (attr) {
                attr.setValueFromJSON(json.attributes[attrId]);
              }
            }
          }
        }
      }
      return node;
    },
    /**
     * Create a new node by its JSON representation
     * @memberof canvas_widget.EntityManager#
     * @param {string} type Type of edge
     * @param {string} id Entity identifier of edge
     * @param {canvas_widget.AbstractNode} source Source node entity id
     * @param {canvas_widget.AbstractNode} target Target node entity id
     * @param {object} json JSON representation
     * @returns {canvas_widget.AbstractEdge}
     */
    createEdgeFromJSON: function (type, id, source, target, json) {
      var edge = this.createEdge(
        type,
        id,
        this.findNode(source),
        this.findNode(target)
      );
      if (edge) {
        edge.getLabel().getValue().setValue(json.label.value.value);
        for (var attrId in json.attributes) {
          if (json.attributes.hasOwnProperty(attrId)) {
            var attr = edge.getAttribute(attrId);
            if (attr) {
              attr.setValueFromJSON(json.attributes[attrId]);
            }
          }
        }
      }
      return edge;
    },
    /**
     * Generate the 'Add node..' context menu options
     * @param canvas Canvas to add node to
     * @param left Position of node on x-axis
     * @param top Position of node on <-axis
     * @returns {object} Menu items
     */
    generateAddNodeMenu: function (canvas, left, top) {
      function makeAddNodeCallback(nodeType, width, height, containment) {
        return function () {
          canvas.createNode(
            nodeType,
            left,
            top,
            width,
            height,
            that.getZIndex(),
            containment
          );
        };
      }
      var items = {},
        nodeType,
        _nodeTypes;

      if (_viewId && _layer === CONFIG.LAYER.MODEL) {
        _nodeTypes = viewNodeTypes;
      } else {
        _nodeTypes = nodeTypes;
      }

      for (nodeType in _nodeTypes) {
        if (_nodeTypes.hasOwnProperty(nodeType)) {
          if (
            _layer === CONFIG.LAYER.META &&
            !_viewId &&
            (nodeType === "ViewObject" || nodeType === "ViewRelationship")
          )
            continue;
          if (
            _layer === CONFIG.LAYER.META &&
            _viewId &&
            (nodeType === "Object" ||
              nodeType === "Relationship" ||
              nodeType === "Enumeration" ||
              nodeType === "Abstract Class")
          )
            continue;

          items[nodeType] = {
            name: ".." + nodeType,
            callback: makeAddNodeCallback(
              nodeType,
              _nodeTypes[nodeType].DEFAULT_WIDTH,
              _nodeTypes[nodeType].DEFAULT_HEIGHT,
              _nodeTypes[nodeType].CONTAINMENT
            ),
          };
        }
      }
      return items;
    },
    /**
     * generates the context menu for the show and hide opeations on node types
     * @returns {object}
     */
    generateVisibilityNodeMenu: function (visibilty) {
      var _applyVisibilityCallback = function (nodeType, vis) {
        return function () {
          if (vis !== "show" && vis !== "hide") return;

          var nodes;
          if (_viewId && _layer === CONFIG.LAYER.MODEL) {
            nodes = that.getNodesByViewType(nodeType);
          } else {
            nodes = that.getNodesByType(nodeType);
          }
          for (var nKey in nodes) {
            if (nodes.hasOwnProperty(nKey)) {
              nodes[nKey][vis]();
            }
          }
          if (vis === "hide") {
            this.data("show" + nodeType + "Disabled", true);
          } else {
            this.data("show" + nodeType + "Disabled", false);
          }

          return false;
        };
      };

      var that = this;
      var items = {},
        nodeType,
        _nodeTypes;

      if (_viewId && _layer === CONFIG.LAYER.MODEL) {
        _nodeTypes = viewNodeTypes;
      } else {
        _nodeTypes = nodeTypes;
      }

      for (nodeType in _nodeTypes) {
        if (_nodeTypes.hasOwnProperty(nodeType)) {
          if (
            _layer === CONFIG.LAYER.META &&
            !_viewId &&
            (nodeType === "ViewObject" || nodeType === "ViewRelationship")
          )
            continue;
          if (
            _layer === CONFIG.LAYER.META &&
            _viewId &&
            (nodeType === "Object" ||
              nodeType === "Relationship" ||
              nodeType === "Enumeration" ||
              nodeType === "Abstract Class")
          )
            continue;

          items[visibilty + nodeType] = {
            name: ".." + nodeType,
            callback: _applyVisibilityCallback(nodeType, visibilty),
            disabled: (function (nodeType) {
              return function () {
                if (visibilty === "hide")
                  return this.data(visibilty + nodeType + "Disabled");
                else return !this.data(visibilty + nodeType + "Disabled");
              };
            })(nodeType),
          };
        }
      }
      return items;
    },
    /**
     * generates a the context menu for the show and hide operations on edge types
     * @returns {object}
     */
    generateVisibilityEdgeMenu: function (visibility) {
      function _applyVisibilityCallback(edgeType, vis) {
        return function () {
          if (vis !== "show" && vis !== "hide") return;
          var edges;
          if (_viewId && _layer === CONFIG.LAYER.MODEL) {
            edges = that.getEdgesByViewType(edgeType);
          } else {
            edges = that.getEdgesByType(edgeType);
          }
          for (var eKey in edges) {
            if (edges.hasOwnProperty(eKey)) {
              edges[eKey][vis]();
            }
          }
          if (vis === "hide") {
            this.data("show" + edgeType + "Disabled", true);
          } else {
            this.data("show" + edgeType + "Disabled", false);
          }
        };
      }
      var that = this;
      var items = {},
        edgeType,
        _edgeTypes;

      if (_viewId && _layer === CONFIG.LAYER.MODEL) {
        _edgeTypes = viewEdgeTypes;
      } else {
        _edgeTypes = edgeTypes;
      }

      for (edgeType in _edgeTypes) {
        if (_edgeTypes.hasOwnProperty(edgeType)) {
          items[visibility + edgeType] = {
            name: ".." + edgeType,
            callback: _applyVisibilityCallback(edgeType, visibility),
            disabled: (function (edgeType) {
              return function () {
                if (visibility === "hide")
                  return this.data(visibility + edgeType + "Disabled");
                else return !this.data(visibility + edgeType + "Disabled");
              };
            })(edgeType),
          };
        }
      }
      return items;
    },
    /**
     * Generate the 'Connect to..' context menu options for the passed node
     * @param {canvas_widget.AbstractNode} node
     */
    generateConnectToMenu: function (node) {
      function makeTargetNodeCallback(connectionType, targetNodeId) {
        return function (/*key, opt*/) {
          node
            .getCanvas()
            .createEdge(connectionType, node.getEntityId(), targetNodeId);
        };
      }

      var connectionType,
        sourceNodeTypes,
        targetNodeTypes,
        targetNodeType,
        connectionItems,
        targetNodeTypeItems,
        targetNodeItems,
        i,
        numOfRelations,
        j,
        numOfTargetTypes,
        existsLinkableTargetNode,
        targetNodes,
        targetNodeId,
        targetNode,
        targetAppearance,
        sourceAppearance = node.getAppearance();

      connectionItems = {};
      for (connectionType in relations) {
        if (relations.hasOwnProperty(connectionType)) {
          targetNodeTypeItems = {};
          for (
            i = 0, numOfRelations = relations[connectionType].length;
            i < numOfRelations;
            i++
          ) {
            sourceNodeTypes = relations[connectionType][i].sourceTypes;
            targetNodeTypes = relations[connectionType][i].targetTypes;
            if (
              sourceNodeTypes.indexOf(node.getType()) !== -1 ||
              (_layer === CONFIG.LAYER.MODEL &&
                _viewId &&
                sourceNodeTypes.indexOf(node.getCurrentViewType()) !== -1)
            ) {
              for (
                j = 0, numOfTargetTypes = targetNodeTypes.length;
                j < numOfTargetTypes;
                j++
              ) {
                targetNodeType = targetNodeTypes[j];
                targetNodeItems = {};
                if (_viewId && _layer === CONFIG.LAYER.MODEL) {
                  targetNodes = this.getNodesByViewType(targetNodeType);
                } else {
                  targetNodes = this.getNodesByType(targetNodeType);
                }
                existsLinkableTargetNode = false;
                for (targetNodeId in targetNodes) {
                  if (targetNodes.hasOwnProperty(targetNodeId)) {
                    targetNode = targetNodes[targetNodeId];
                    if (targetNode === node) continue;
                    if (
                      _layer === CONFIG.LAYER.MODEL &&
                      _viewId &&
                      targetNode.getCurrentViewType() === null
                    )
                      continue;
                    targetAppearance = targetNode.getAppearance();
                    if (
                      !targetNode
                        .getNeighbors()
                        .hasOwnProperty(node.getEntityId())
                    ) {
                      targetNodeItems[
                        connectionType + targetNodeType + i + targetNodeId
                      ] = {
                        name:
                          ".." +
                          (targetNode.getLabel().getValue().getValue() ||
                            targetNode.getType()),
                        callback: makeTargetNodeCallback(
                          connectionType,
                          targetNodeId
                        ),
                        distanceSquare:
                          Math.pow(
                            targetAppearance.left - sourceAppearance.left,
                            2
                          ) +
                          Math.pow(
                            targetAppearance.top - sourceAppearance.top,
                            2
                          ),
                        targetNodeId:
                          connectionType + targetNodeType + i + targetNodeId,
                      };
                    }
                  }
                }
                if (_.size(targetNodeItems) > 0) {
                  var targetNodeItemsTmp = _.sortBy(
                    targetNodeItems,
                    "distanceSquare"
                  );
                  targetNodeItems = {};
                  for (
                    var k = 0, numOfItems = targetNodeItemsTmp.length;
                    k < numOfItems;
                    k++
                  ) {
                    targetNodeItems[k + targetNodeItemsTmp[k].targetNodeId] =
                      targetNodeItemsTmp[k];
                  }
                  targetNodeTypeItems[connectionType + targetNodeType + i] = {
                    name: "..to " + targetNodeType + "..",
                    items: targetNodeItems,
                  };
                }
              }
            }
          }
          if (_.size(targetNodeTypeItems) > 0) {
            connectionItems[connectionType] = {
              name: "..with " + connectionType + "..",
              items: targetNodeTypeItems,
            };
          }
        }
      }

      return {
        name: "Connect..",
        items: connectionItems,
        disabled: (function (connectionItems) {
          return _.size(connectionItems) === 0;
        })(connectionItems),
      };
    },
    generateGuidanceMetamodel: function () {
      var metamodel = this.generateMetaModel();
      var actionNodes = [];
      var actionNodeLabels = [];
      var createEntityNodeLabels = [];
      //Create guidance metamodel
      var guidanceMetamodel = {
        attributes: {},
        nodes: {},
        edges: {},
      };

      //Create initial node
      var initialNode = {
        label: guidancemodel.INITIAL_NODE_LABEL,
        shape: {
          shape: "",
          color: "",
          defaultWidth: 200,
          defaultHeight: 60,
          containment: false,
          customShape: startActivityNodeHtml,
          customAnchors: "",
        },
        attributes: {},
      };

      //Add a label attribute to the initial node
      initialNode.attributes[Util.generateRandomId()] = {
        key: "label",
        value: "string",
      };

      guidanceMetamodel.nodes[Util.generateRandomId()] = initialNode;

      //Create final node
      var finalNode = {
        label: guidancemodel.ACTIVITY_FINAL_NODE_LABEL,
        shape: {
          shape: "circle",
          color: "",
          defaultWidth: 50,
          defaultHeight: 50,
          containment: false,
          customShape: activityFinalNodeHtml,
          customAnchors: ["Perimeter", { shape: "Circle", anchorCount: 60 }],
        },
        attributes: {},
      };

      guidanceMetamodel.nodes[Util.generateRandomId()] = finalNode;

      //Create merge node
      var mergeNode = {
        label: guidancemodel.MERGE_NODE_LABEL,
        shape: {
          shape: "diamond",
          color: "yellow",
          defaultWidth: 0,
          defaultHeight: 0,
          containment: false,
          customShape: "",
          customAnchors: "",
        },
        attributes: {},
      };

      guidanceMetamodel.nodes[Util.generateRandomId()] = mergeNode;

      //Create 'call activity node'
      var callActivityNode = {
        label: guidancemodel.CALL_ACTIVITY_NODE_LABEL,
        shape: {
          shape: "rounded_rectangle",
          color: "",
          defaultWidth: 100,
          defaultHeight: 50,
          containment: false,
          customShape: callActivityNodeHtml,
          customAnchors: "",
        },
        attributes: {},
      };

      actionNodeLabels.push(guidancemodel.CALL_ACTIVITY_NODE_LABEL);

      //Add a label attribute to the call activity node
      callActivityNode.attributes[Util.generateRandomId()] = {
        key: "label",
        value: "string",
      };

      guidanceMetamodel.nodes[Util.generateRandomId()] = callActivityNode;

      //Create concurrency node
      var concurrencyNode = {
        label: guidancemodel.CONCURRENCY_NODE_LABEL,
        shape: {
          shape: "rectangle",
          color: "black",
          defaultWidth: 10,
          defaultHeight: 200,
          containment: false,
          customShape: "",
          customAnchors: "",
        },
        attributes: {},
      };

      guidanceMetamodel.nodes[Util.generateRandomId()] = concurrencyNode;

      //Create 'create object nodes'
      var createObjectNodeLabels = [];
      var createObjectNodes = {};
      var entityNodes = {};

      var flowEdgeRelations = [];
      var dataFlowEdgeRelations = [];

      var nodes = metamodel.nodes;
      for (var nodeId in nodes) {
        if (nodes.hasOwnProperty(nodeId)) {
          var node = nodes[nodeId];

          var createObjectNodeToEntityNodeRelation = {
            sourceTypes: [],
            targetTypes: [],
          };
          //Generate the 'create object node'
          var label = guidancemodel.getCreateObjectNodeLabelForType(node.label);
          createObjectNodeToEntityNodeRelation.sourceTypes.push(label);
          actionNodeLabels.push(label);
          createEntityNodeLabels.push(label);
          createObjectNodeLabels.push(label);
          var id = Util.generateRandomId();
          guidanceMetamodel.nodes[id] = {
            label: label,
            attributes: {},
            shape: {
              shape: "rounded_rectangle",
              color: "",
              defaultWidth: 100,
              defaultHeight: 50,
              containment: false,
              customShape: _.template(actionNodeHtml)({
                label: node.label,
                icon: "plus",
              }),
              customAnchors: "",
            },
          };

          createObjectNodes[id] = guidanceMetamodel.nodes[id];

          //Generate the 'entity node'
          var entitylabel = guidancemodel.getEntityNodeLabelForType(node.label);
          createObjectNodeToEntityNodeRelation.targetTypes.push(label);
          id = Util.generateRandomId();
          guidanceMetamodel.nodes[id] = {
            label: entitylabel,
            attributes: {},
            shape: {
              shape: "rectangle",
              color: "",
              defaultWidth: 100,
              defaultHeight: 50,
              containment: false,
              customShape: _.template(entityNodeHtml)({
                icon: "square",
                label: node.label,
              }),
              customAnchors: "",
            },
          };

          //Generate the 'set property node'
          setPropertyLabel = guidancemodel.getSetPropertyNodeLabelForType(
            node.label
          );
          actionNodeLabels.push(setPropertyLabel);
          id = Util.generateRandomId();
          guidanceMetamodel.nodes[id] = {
            label: setPropertyLabel,
            attributes: {},
            shape: {
              shape: "",
              defaultWidth: 130,
              defaultHeight: 50,
              containment: false,
              customShape: _.template(setPropertyNodeHtml)(),
              customAnchors: "",
            },
          };

          var options = {};
          for (var attributeId in node.attributes) {
            var attribute = node.attributes[attributeId];
            options[attribute.key] = attribute.key;
          }

          guidanceMetamodel.nodes[id].attributes[Util.generateRandomId()] = {
            key: "Property",
            value: "Value",
            options: options,
          };

          entityNodes[id] = guidanceMetamodel.nodes[id];

          //Define the 'create object node' to 'entity node' relation
          dataFlowEdgeRelations.push({
            sourceTypes: [label],
            targetTypes: [entitylabel],
          });

          //Define the 'entity node' to 'set property node' relation
          dataFlowEdgeRelations.push({
            sourceTypes: [entitylabel],
            targetTypes: [setPropertyLabel],
          });

          //Define the 'entity node' to 'create relationship node' relation
          for (var edgeId in metamodel.edges) {
            var edge = metamodel.edges[edgeId];
            for (var relationId in edge.relations) {
              var relation = edge.relations[relationId];
              if (
                relation.sourceTypes.indexOf(node.label) > -1 ||
                relation.targetTypes.indexOf(node.label) > -1
              ) {
                dataFlowEdgeRelations.push({
                  sourceTypes: [entitylabel],
                  targetTypes:
                    guidancemodel.getCreateRelationshipNodeLabelForType(
                      edge.label
                    ),
                });
                break;
              }
            }
          }
        }
      }

      //Create 'create relationship nodes'
      var createRelationshipNodes = {};
      var edgesByLabel = {};

      var edges = metamodel.edges;
      for (var edgeId in edges) {
        if (edges.hasOwnProperty(edgeId)) {
          var edge = edges[edgeId];
          //Generate 'create relationship node'
          var label = guidancemodel.getCreateRelationshipNodeLabelForType(
            edge.label
          );
          actionNodeLabels.push(label);
          createEntityNodeLabels.push(label);
          edgesByLabel[edge.label] = edge;

          var id = Util.generateRandomId();
          guidanceMetamodel.nodes[id] = {
            label: label,
            attributes: {},
            shape: {
              shape: "rounded_rectangle",
              color: "",
              defaultWidth: 100,
              defaultHeight: 50,
              containment: false,
              customShape: _.template(actionNodeHtml)({
                label: edge.label,
                icon: "plus",
              }),
              customAnchors: "",
            },
          };

          createRelationshipNodes[id] = guidanceMetamodel.nodes[id];

          //Generate 'entity node'
          var entitylabel = guidancemodel.getEntityNodeLabelForType(edge.label);

          var id = Util.generateRandomId();
          guidanceMetamodel.nodes[id] = {
            label: entitylabel,
            attributes: {},
            shape: {
              shape: "rectangle",
              color: "blue",
              defaultWidth: 100,
              defaultHeight: 50,
              containment: false,
              customShape: _.template(entityNodeHtml)({
                icon: "exchange",
                label: edge.label,
              }),
              customAnchors: "",
            },
          };

          entityNodes[id] = guidanceMetamodel.nodes[id];

          //Generate the 'set property node'
          if (Object.keys(edge.attributes).length > 0) {
            var setPropertyLabel = guidancemodel.getSetPropertyNodeLabelForType(
              edge.label
            );
            actionNodeLabels.push(setPropertyLabel);
            id = Util.generateRandomId();
            guidanceMetamodel.nodes[id] = {
              label: setPropertyLabel,
              attributes: {},
              shape: {
                shape: "",
                defaultWidth: 0,
                defaultHeight: 0,
                containment: false,
                customShape: _.template(setPropertyNodeHtml)({
                  type: setPropertyLabel,
                  color: "white",
                }),
                customAnchors: "",
              },
            };

            var options = {};
            for (var attributeId in edge.attributes) {
              var attribute = edge.attributes[attributeId];
              options[attribute.key] = attribute.key;
            }

            guidanceMetamodel.nodes[id].attributes[Util.generateRandomId()] = {
              key: "Property",
              value: "Value",
              options: options,
            };
          }

          //Define the 'create relationship node' to 'entity node' relation
          dataFlowEdgeRelations.push({
            sourceTypes: [label],
            targetTypes: [entitylabel],
          });

          //Define the 'entity node' to 'set property node' relation
          dataFlowEdgeRelations.push({
            sourceTypes: [entitylabel],
            targetTypes: [setPropertyLabel],
          });
        }
      }

      //Create the flow edge

      //Relations between all action nodes
      flowEdgeRelations = flowEdgeRelations.concat({
        sourceTypes: actionNodeLabels,
        targetTypes: actionNodeLabels.concat([
          guidancemodel.MERGE_NODE_LABEL,
          guidancemodel.ACTIVITY_FINAL_NODE_LABEL,
          guidancemodel.CONCURRENCY_NODE_LABEL,
        ]),
      });

      //Relations for the initial node
      flowEdgeRelations = flowEdgeRelations.concat({
        sourceTypes: [guidancemodel.INITIAL_NODE_LABEL],
        targetTypes: [
          guidancemodel.CALL_ACTIVITY_NODE_LABEL,
          guidancemodel.MERGE_NODE_LABEL,
          guidancemodel.CONCURRENCY_NODE_LABEL,
        ].concat(createEntityNodeLabels),
      });

      //Relations for the merge node
      flowEdgeRelations = flowEdgeRelations.concat({
        sourceTypes: [guidancemodel.MERGE_NODE_LABEL],
        targetTypes: [
          guidancemodel.ACTIVITY_FINAL_NODE_LABEL,
          guidancemodel.MERGE_NODE_LABEL,
          guidancemodel.CONCURRENCY_NODE_LABEL,
        ].concat(actionNodeLabels),
      });

      //Relations for the concurrency node
      flowEdgeRelations = flowEdgeRelations.concat({
        sourceTypes: [guidancemodel.CONCURRENCY_NODE_LABEL],
        targetTypes: [
          guidancemodel.ACTIVITY_FINAL_NODE_LABEL,
          guidancemodel.CONCURRENCY_NODE_LABEL,
          guidancemodel.MERGE_NODE_LABEL,
        ].concat(actionNodeLabels),
      });

      //Create the action flow edge
      guidanceMetamodel.edges[Util.generateRandomId()] = {
        label: "Action flow edge",
        shape: {
          arrow: "unidirassociation",
          shape: "curved",
          color: "black",
          overlay: "",
          overlayPosition: "top",
          overlayRotate: true,
        },
        relations: flowEdgeRelations,
      };

      //Create the data flow edge
      var dataFlowEdge = {
        label: "Data flow edge",
        shape: {
          arrow: "unidirassociation",
          shape: "curved",
          color: "blue",
          overlay: "",
          overlayPosition: "top",
          overlayRotate: true,
        },
        attributes: {},
        relations: dataFlowEdgeRelations,
      };

      dataFlowEdge.attributes[Util.generateRandomId()] = {
        key: "Destination",
        value: "Value",
        options: {
          Source: "Source",
          Target: "Target",
        },
      };
      guidanceMetamodel.edges[Util.generateRandomId()] = dataFlowEdge;

      //Create the association edge
      guidanceMetamodel.edges[Util.generateRandomId()] = {
        label: "Association edge",
        shape: {
          arrow: "unidirassociation",
          shape: "curved",
          color: "",
          dashstyle: "4 2",
          overlay: "",
          overlayPosition: "hidden",
          overlayRotate: true,
        },
        relations: [
          {
            sourceTypes: [guidancemodel.CALL_ACTIVITY_NODE_LABEL],
            targetTypes: [guidancemodel.INITIAL_NODE_LABEL],
          },
        ],
      };

      return guidanceMetamodel;
    },
    generateLogicalGuidanceRepresentation: function (m) {
      const dataMap = y.getMap("data");
      var graph = new graphlib.Graph();
      var model;
      if (m) model = m;
      else model = dataMap.get("guidancemodel");
      if (!model) return null;
      var nodes = model.nodes;
      var edges = model.edges;
      //Returns successor node which belong to the action flow (everything except entity nodes)
      var getFlowSuccessors = function (nodeId) {
        var targets = [];
        var labels = [];
        for (var edgeId in edges) {
          var edge = edges[edgeId];
          if (edge.source == nodeId) {
            //var targetType = nodes[edge.target].type
            if (edge.type == "Action flow edge") {
              targets.push(edge.target);
              labels.push(edge.label.value.value);
            }
          }
        }
        return {
          targets: targets,
          labels: labels,
        };
      };

      var getEntitySuccessor = function (nodeId) {
        var targets = [];
        for (var edgeId in edges) {
          var edge = edges[edgeId];
          if (edge.source == nodeId) {
            var targetType = nodes[edge.target].type;
            if ((targetType = guidancemodel.isEntityNodeLabel(targetType)))
              return edge.target;
          }
        }
        return "";
      };

      var getEntityPredecessorsForCreateRelationshipAction = function (nodeId) {
        var entities = {
          Source: "",
          Target: "",
        };
        for (var edgeId in edges) {
          var edge = edges[edgeId];
          if (edge.target == nodeId) {
            var sourceType = nodes[edge.source].type;
            if ((sourceType = guidancemodel.isEntityNodeLabel(sourceType))) {
              var destination = getAttributeValue(edge, "Destination");
              entities[destination] = edge.source;
            }
          }
        }
        return entities;
      };

      var getEntityPredecessorForSetPropertyAction = function (nodeId) {
        for (var edgeId in edges) {
          var edge = edges[edgeId];
          if (edge.target == nodeId) {
            var sourceType = nodes[edge.source].type;
            if ((sourceType = guidancemodel.isEntityNodeLabel(sourceType))) {
              return edge.source;
            }
          }
        }
        return "";
      };

      var getInitialNodeForCallActivityAction = function (nodeId) {
        for (var edgeId in edges) {
          var edge = edges[edgeId];
          if (edge.source == nodeId && edge.type == "Association edge") {
            return edge.target;
          }
        }
        return "";
      };

      var getAttributeValue = function (node, attributeName) {
        for (var attributeId in node.attributes) {
          var attribute = node.attributes[attributeId];
          if (attribute.name == attributeName) return attribute.value.value;
        }
        return "";
      };

      for (var nodeId in nodes) {
        var node = nodes[nodeId];
        var type = node.type;
        var subType = "";

        if (type == guidancemodel.INITIAL_NODE_LABEL) {
          var successors = getFlowSuccessors(nodeId);
          graph.setNode(nodeId, {
            type: "INITIAL_NODE",
            name: getAttributeValue(node, "label"),
          });
          for (var i = 0; i < successors.targets.length; i++) {
            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
          }
        } else if (type == guidancemodel.MERGE_NODE_LABEL) {
          var successors = getFlowSuccessors(nodeId);
          graph.setNode(nodeId, {
            type: "MERGE_NODE",
          });
          for (var i = 0; i < successors.targets.length; i++) {
            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
          }
        } else if (type == guidancemodel.CONCURRENCY_NODE_LABEL) {
          var successors = getFlowSuccessors(nodeId);
          graph.setNode(nodeId, {
            type: "CONCURRENCY_NODE",
          });
          for (var i = 0; i < successors.targets.length; i++) {
            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
          }
        } else if (type == guidancemodel.ACTIVITY_FINAL_NODE_LABEL) {
          graph.setNode(nodeId, {
            type: "ACTIVITY_FINAL_NODE",
          });
        } else if ((subType = guidancemodel.isCreateObjectNodeLabel(type))) {
          var successors = getFlowSuccessors(nodeId);
          graph.setNode(nodeId, {
            type: "CREATE_OBJECT_ACTION",
            objectType: subType,
            createdObjectId: getEntitySuccessor(nodeId),
          });
          for (var i = 0; i < successors.targets.length; i++) {
            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
          }
        } else if (
          (subType = guidancemodel.isCreateRelationshipNodeLabel(type))
        ) {
          var entities =
            getEntityPredecessorsForCreateRelationshipAction(nodeId);
          var successors = getFlowSuccessors(nodeId);
          graph.setNode(nodeId, {
            type: "CREATE_RELATIONSHIP_ACTION",
            relationshipType: subType,
            createdRelationshipId: getEntitySuccessor(nodeId),
            sourceObjectId: entities["Source"],
            targetObjectId: entities["Target"],
          });
          for (var i = 0; i < successors.targets.length; i++) {
            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
          }
        } else if ((subType = guidancemodel.isSetPropertyNodeLabel(type))) {
          var successors = getFlowSuccessors(nodeId);
          graph.setNode(nodeId, {
            type: "SET_PROPERTY_ACTION",
            entityType: subType,
            propertyName: getAttributeValue(node, "Property"),
            sourceObjectId: getEntityPredecessorForSetPropertyAction(nodeId),
          });
          for (var i = 0; i < successors.targets.length; i++) {
            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
          }
        } else if (type == guidancemodel.CALL_ACTIVITY_NODE_LABEL) {
          var successors = getFlowSuccessors(nodeId);
          graph.setNode(nodeId, {
            type: "CALL_ACTIVITY_ACTION",
            initialNodeId: getInitialNodeForCallActivityAction(nodeId),
          });
          for (var i = 0; i < successors.targets.length; i++) {
            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
          }
        }
      }
      return graphlib.json.write(graph);
    },
    generateGuidanceRules: function () {
      var guidanceRules = { objectToolRules: [] };
      var nodes = guidancemodel.guidancemodel.nodes;
      var edges = guidancemodel.guidancemodel.edges;
      for (var nodeId in nodes) {
        var node = nodes[nodeId];
        var type = node.type;

        if (guidancemodel.isObjectToolType(type)) {
          var srcObjectType =
            guidancemodel.getObjectTypeForObjectToolType(type);
          var destObjectType = null;
          var relationshipType = null;
          var relevantEdges = [];
          var label = "";
          //Get the label attribute
          for (var attributeId in node.attributes) {
            if (node.attributes[attributeId].name == "label")
              label = node.attributes[attributeId].value.value;
          }
          var edgeId;
          for (edgeId in edges) {
            if (edges[edgeId].source == nodeId)
              relevantEdges.push(edges[edgeId]);
          }
          for (var i = 0; i < relevantEdges.length; i++) {
            var edge = relevantEdges[i];
            var target = nodes[edge.target];
            if (guidancemodel.isObjectContextType(target.type)) {
              destObjectType = guidancemodel.getObjectTypeForObjectContextType(
                target.type
              );
            } else if (guidancemodel.isRelationshipContextType(target.type)) {
              relationshipType =
                guidancemodel.getRelationshipTypeForRelationshipContextType(
                  target.type
                );
            }
          }
          if (destObjectType !== null && relationshipType !== null) {
            var objectToolRule = {
              srcObjectType: srcObjectType,
              destObjectType: destObjectType,
              relationshipType: relationshipType,
              label: label,
            };
            guidanceRules.objectToolRules.push(objectToolRule);
          }
        }
      }
      return guidanceRules;
    },
    /**
     * Generate the JSON Representation of the meta-model for a new editr instance based on the current graph
     * @returns {{nodes: {}, edges: {}}} JSON representation of meta model
     */
    generateMetaModel: function () {
      /**
       * Determine the type of the concrete classes (ObjectNodes) of the class diagram contained in the sub graph rooted by the passed node
       * @param node Node to start with
       * @param [visitedNodes] List of node that already have been visited
       * @returns {object}
       */
      function getConcreteObjectNodeTypes(node, visitedNodes) {
        var edgeId,
          edge,
          ingoingEdges,
          source,
          type,
          classTypes = [];

        if (!visitedNodes) visitedNodes = [];

        if (visitedNodes.indexOf(node) !== -1) return [];

        visitedNodes.push(node);

        type = node.getLabel().getValue().getValue();
        if (node instanceof ObjectNode && classTypes.indexOf(type) === -1) {
          classTypes.push(type);
        }

        ingoingEdges = node.getIngoingEdges();
        for (edgeId in ingoingEdges) {
          if (ingoingEdges.hasOwnProperty(edgeId)) {
            edge = ingoingEdges[edgeId];
            source = edge.getSource();
            if (
              (edge instanceof GeneralisationEdge &&
                source instanceof ObjectNode) ||
              (edge instanceof GeneralisationEdge &&
                source instanceof AbstractClassNode)
            ) {
              classTypes = classTypes.concat(
                getConcreteObjectNodeTypes(source, visitedNodes)
              );
            }
          }
        }
        return classTypes;
      }

      /**
       * Determine the attributes of the passed node by traversing the underlying class diagram
       * @param node Node to start with
       * @param [visitedNodes] List of node that already have been visited
       * @returns {object}
       */
      function getNodeAttributes(node, visitedNodes) {
        var nodeAttributes, attributeId, attribute;
        var edgeId, edge, edges;
        var source, target;
        var neighbor, options;
        var attributes = {};
        var obj = {};

        if (!visitedNodes) visitedNodes = [];

        if (visitedNodes.indexOf(node) !== -1) return {};

        visitedNodes.push(node);

        //Traverse edges to check for inheritance and linked enums
        edges = node.getOutgoingEdges();
        for (edgeId in edges) {
          if (edges.hasOwnProperty(edgeId)) {
            edge = edges[edgeId];
            source = edge.getSource();
            target = edge.getTarget();

            //Does the node inherit attributes from a parent node?
            if (
              (edge instanceof GeneralisationEdge &&
                target instanceof AbstractClassNode) ||
              (edge instanceof GeneralisationEdge &&
                node instanceof ObjectNode &&
                target instanceof ObjectNode) ||
              (edge instanceof GeneralisationEdge &&
                node instanceof RelationshipNode &&
                target instanceof RelationshipNode) ||
              (edge instanceof GeneralisationEdge &&
                node instanceof EnumNode &&
                target instanceof EnumNode)
            ) {
              Util.merge(attributes, getNodeAttributes(target, visitedNodes));

              //Is there an enum linked to the node
            } else if (
              (edge instanceof BiDirAssociationEdge &&
                ((target === node && (neighbor = source) instanceof EnumNode) ||
                  (source === node &&
                    (neighbor = target) instanceof EnumNode))) ||
              (edge instanceof UniDirAssociationEdge &&
                (neighbor = target) instanceof EnumNode)
            ) {
              options = {};
              nodeAttributes = {};
              Util.merge(nodeAttributes, getNodeAttributes(neighbor, []));
              for (attributeId in nodeAttributes) {
                if (nodeAttributes.hasOwnProperty(attributeId)) {
                  attribute = nodeAttributes[attributeId];
                  options[attribute.value] = attribute.value;
                }
              }
              obj = {};
              obj[neighbor.getEntityId()] = {
                key: edge.getLabel().getValue().getValue(),
                value: neighbor.getLabel().getValue().getValue(),
                options: options,
              };
              Util.merge(attributes, obj);
            }
          }
        }
        //Compute node attributes
        nodeAttributes = node.getAttribute("[attributes]").getAttributes();
        for (attributeId in nodeAttributes) {
          if (nodeAttributes.hasOwnProperty(attributeId)) {
            attribute = nodeAttributes[attributeId];
            if (node instanceof RelationshipNode) {
              obj = {};
              obj[attributeId] = {
                key: attribute.getKey().getValue(),
                value: attribute.getValue().getValue(),
                position: attribute.getValue2().getValue(),
              };
              Util.merge(attributes, obj);
            } else if (node instanceof EnumNode) {
              obj = {};
              obj[attributeId] = {
                value: attribute.getValue().getValue(),
              };
              Util.merge(attributes, obj);
            } else {
              obj = {};
              obj[attributeId] = {
                key: attribute.getKey().getValue(),
                value: attribute.getValue().getValue(),
              };
              Util.merge(attributes, obj);
            }
          }
        }
        return attributes;
      }

      var metamodel = {
        attributes: {},
        nodes: {},
        edges: {},
      };

      var nodeId, node;
      var attributes;
      var edge, edgeId, edges;
      var source, target;
      var neighbor;
      var groupSource, groupTarget;
      var groupNeighbor;
      var shape;
      var sourceTypes, targetTypes, concreteTypes;
      var groupSourceTypes, groupTargetTypes, groupConcreteTypes;
      var relations;
      var groupEdge, groupEdgeId, groupEdges;

      for (nodeId in _nodes) {
        if (_nodes.hasOwnProperty(nodeId)) {
          node = _nodes[nodeId];
          if (node instanceof ObjectNode) {
            if (node.getLabel().getValue().getValue() === "Model Attributes") {
              attributes = getNodeAttributes(node);
              metamodel.attributes = attributes;
            } else {
              attributes = getNodeAttributes(node);
              edges = node.getEdges();
              shape = null;
              for (edgeId in edges) {
                if (edges.hasOwnProperty(edgeId)) {
                  edge = edges[edgeId];
                  source = edge.getSource();
                  target = edge.getTarget();
                  if (
                    (edge instanceof BiDirAssociationEdge &&
                      ((target === node &&
                        (neighbor = source) instanceof NodeShapeNode) ||
                        (source === node &&
                          (neighbor = target) instanceof NodeShapeNode))) ||
                    (edge instanceof UniDirAssociationEdge &&
                      (neighbor = target) instanceof NodeShapeNode)
                  ) {
                    shape = {
                      shape: neighbor
                        .getAttribute(neighbor.getEntityId() + "[shape]")
                        .getValue()
                        .getValue(),
                      color: neighbor
                        .getAttribute(neighbor.getEntityId() + "[color]")
                        .getValue()
                        .getValue(),
                      defaultWidth: parseInt(
                        neighbor
                          .getAttribute(
                            neighbor.getEntityId() + "[defaultWidth]"
                          )
                          .getValue()
                          .getValue()
                      ),
                      defaultHeight: parseInt(
                        neighbor
                          .getAttribute(
                            neighbor.getEntityId() + "[defaultHeight]"
                          )
                          .getValue()
                          .getValue()
                      ),
                      containment: neighbor
                        .getAttribute(neighbor.getEntityId() + "[containment]")
                        .getValue()
                        .getValue(),
                      customShape: neighbor
                        .getAttribute(neighbor.getEntityId() + "[customShape]")
                        .getValue()
                        .getValue(),
                      customAnchors: neighbor
                        .getAttribute(
                          neighbor.getEntityId() + "[customAnchors]"
                        )
                        .getValue()
                        .getValue(),
                    };
                  }
                }
              }
              metamodel.nodes[nodeId] = {
                label: node.getLabel().getValue().getValue(),
                attributes: attributes,
                shape: shape || {
                  shape: "rectangle",
                  color: "white",
                  containment: false,
                  customShape: "",
                  customAnchors: "",
                  defaultWidth: 0,
                  defaultHeight: 0,
                },
              };
            }
          } else if (node instanceof RelationshipNode) {
            attributes = getNodeAttributes(node);
            edges = node.getEdges();
            sourceTypes = [];
            targetTypes = [];
            relations = [];
            shape = null;
            for (edgeId in edges) {
              if (edges.hasOwnProperty(edgeId)) {
                edge = edges[edgeId];
                source = edge.getSource();
                target = edge.getTarget();
                if (
                  edge instanceof BiDirAssociationEdge &&
                  ((target === node &&
                    (neighbor = source) instanceof ObjectNode) ||
                    (source === node &&
                      (neighbor = target) instanceof ObjectNode))
                ) {
                  concreteTypes = getConcreteObjectNodeTypes(neighbor);
                  sourceTypes = sourceTypes.concat(concreteTypes);
                  targetTypes = targetTypes.concat(concreteTypes);
                } else if (
                  edge instanceof UniDirAssociationEdge &&
                  source === node &&
                  target instanceof ObjectNode
                ) {
                  targetTypes = targetTypes.concat(
                    getConcreteObjectNodeTypes(target)
                  );
                } else if (
                  edge instanceof UniDirAssociationEdge &&
                  target === node &&
                  source instanceof ObjectNode
                ) {
                  sourceTypes = sourceTypes.concat(
                    getConcreteObjectNodeTypes(source)
                  );
                } else if (
                  edge instanceof BiDirAssociationEdge &&
                  ((target === node &&
                    (neighbor = source) instanceof AbstractClassNode) ||
                    (source === node &&
                      (neighbor = target) instanceof AbstractClassNode))
                ) {
                  concreteTypes = getConcreteObjectNodeTypes(neighbor);
                  sourceTypes = sourceTypes.concat(concreteTypes);
                  targetTypes = targetTypes.concat(concreteTypes);
                } else if (
                  edge instanceof UniDirAssociationEdge &&
                  source === node &&
                  target instanceof AbstractClassNode
                ) {
                  targetTypes = targetTypes.concat(
                    getConcreteObjectNodeTypes(target)
                  );
                } else if (
                  edge instanceof UniDirAssociationEdge &&
                  target === node &&
                  source instanceof AbstractClassNode
                ) {
                  sourceTypes = sourceTypes.concat(
                    getConcreteObjectNodeTypes(source)
                  );
                } else if (
                  (edge instanceof BiDirAssociationEdge &&
                    ((target === node &&
                      (neighbor = source) instanceof EdgeShapeNode) ||
                      (source === node &&
                        (neighbor = target) instanceof EdgeShapeNode))) ||
                  (edge instanceof UniDirAssociationEdge &&
                    source === node &&
                    (neighbor = target) instanceof EdgeShapeNode)
                ) {
                  shape = {
                    arrow: neighbor
                      .getAttribute(neighbor.getEntityId() + "[arrow]")
                      .getValue()
                      .getValue(),
                    shape: neighbor
                      .getAttribute(neighbor.getEntityId() + "[shape]")
                      .getValue()
                      .getValue(),
                    color: neighbor
                      .getAttribute(neighbor.getEntityId() + "[color]")
                      .getValue()
                      .getValue(),
                    overlay: neighbor
                      .getAttribute(neighbor.getEntityId() + "[overlay]")
                      .getValue()
                      .getValue(),
                    overlayPosition: neighbor
                      .getAttribute(
                        neighbor.getEntityId() + "[overlayPosition]"
                      )
                      .getValue()
                      .getValue(),
                    overlayRotate: neighbor
                      .getAttribute(neighbor.getEntityId() + "[overlayRotate]")
                      .getValue()
                      .getValue(),
                  };
                } else if (
                  edge instanceof GeneralisationEdge &&
                  target === node &&
                  (neighbor = source) instanceof RelationshipGroupNode
                ) {
                  groupEdges = neighbor.getEdges();
                  groupSourceTypes = [];
                  groupTargetTypes = [];
                  for (groupEdgeId in groupEdges) {
                    if (groupEdges.hasOwnProperty(groupEdgeId)) {
                      groupEdge = groupEdges[groupEdgeId];
                      groupSource = groupEdge.getSource();
                      groupTarget = groupEdge.getTarget();
                      if (
                        groupEdge instanceof BiDirAssociationEdge &&
                        ((groupTarget === neighbor &&
                          (groupNeighbor = groupSource) instanceof
                            ObjectNode) ||
                          (groupSource === neighbor &&
                            (groupNeighbor = groupTarget) instanceof
                              ObjectNode))
                      ) {
                        groupConcreteTypes =
                          getConcreteObjectNodeTypes(groupNeighbor);
                        groupSourceTypes =
                          groupSourceTypes.concat(groupConcreteTypes);
                        groupTargetTypes =
                          groupTargetTypes.concat(groupConcreteTypes);
                      } else if (
                        groupEdge instanceof UniDirAssociationEdge &&
                        groupSource === neighbor &&
                        groupTarget instanceof ObjectNode
                      ) {
                        groupTargetTypes = groupTargetTypes.concat(
                          getConcreteObjectNodeTypes(groupTarget)
                        );
                      } else if (
                        groupEdge instanceof UniDirAssociationEdge &&
                        groupTarget === neighbor &&
                        groupSource instanceof ObjectNode
                      ) {
                        groupSourceTypes = groupSourceTypes.concat(
                          getConcreteObjectNodeTypes(groupSource)
                        );
                      } else if (
                        groupEdge instanceof BiDirAssociationEdge &&
                        ((groupTarget === neighbor &&
                          (groupNeighbor = groupSource) instanceof
                            AbstractClassNode) ||
                          (groupSource === neighbor &&
                            (groupNeighbor = groupTarget) instanceof
                              AbstractClassNode))
                      ) {
                        groupConcreteTypes =
                          getConcreteObjectNodeTypes(groupNeighbor);
                        groupSourceTypes =
                          groupSourceTypes.concat(groupConcreteTypes);
                        groupTargetTypes =
                          groupTargetTypes.concat(groupConcreteTypes);
                      } else if (
                        groupEdge instanceof UniDirAssociationEdge &&
                        groupSource === neighbor &&
                        groupTarget instanceof AbstractClassNode
                      ) {
                        groupTargetTypes = groupTargetTypes.concat(
                          getConcreteObjectNodeTypes(groupTarget)
                        );
                      } else if (
                        groupEdge instanceof UniDirAssociationEdge &&
                        groupTarget === neighbor &&
                        groupSource instanceof AbstractClassNode
                      ) {
                        groupSourceTypes = groupSourceTypes.concat(
                          getConcreteObjectNodeTypes(groupSource)
                        );
                      }
                    }
                  }

                  if (
                    groupSourceTypes.length > 0 &&
                    groupTargetTypes.length > 0
                  ) {
                    relations.push({
                      sourceTypes: groupSourceTypes,
                      targetTypes: groupTargetTypes,
                    });
                  }
                }
              }
            }

            if (sourceTypes.length > 0 && targetTypes.length > 0) {
              relations.push({
                sourceTypes: sourceTypes,
                targetTypes: targetTypes,
              });
            }

            metamodel.edges[nodeId] = {
              label: node.getLabel().getValue().getValue(),
              shape: shape || {
                arrow: "bidirassociation",
                shape: "straight",
                color: "black",
                overlay: "",
                overlayPosition: "top",
                overlayRotate: true,
              },
              relations: relations,
              attributes: attributes,
            };
          }
        }
      }
      return metamodel;
    },
    /**
     * Store current graph representation in the ROLE space
     * @returns {Deferred}
     */
    storeData: function () {
      var resourceSpace = new openapp.oo.Resource(openapp.param.space());

      var data = this.graphToJSON();

      var resourcesToSave = [];
      var promises = [];

      //In the guidance model editor update the guidance model
      if (guidancemodel.isGuidanceEditor()) {
        resourcesToSave.push({
          typeName: CONFIG.NS.MY.GUIDANCEMODEL,
          representation: data,
        });
      }
      //In the metamodel editor create the guidance metamodel needed for the guidance editor
      else if (!metamodel.hasOwnProperty("nodes")) {
        resourcesToSave.push({
          typeName: CONFIG.NS.MY.METAMODELPREVIEW,
          representation: this.generateMetaModel(),
        });
        resourcesToSave.push({
          typeName: CONFIG.NS.MY.GUIDANCEMETAMODEL,
          representation: this.generateGuidanceMetamodel(),
        });
        resourcesToSave.push({
          typeName: CONFIG.NS.MY.MODEL,
          representation: data,
        });
      }
      //In the model editor just update the model
      else {
        resourcesToSave.push({
          typeName: CONFIG.NS.MY.MODEL,
          representation: data,
        });
      }

      var recreateResource = function (type, representation) {
        var deferred = $.Deferred();
        var innerDeferred = $.Deferred();
        //noinspection JSUnusedGlobalSymbols
        resourceSpace.getSubResources({
          relation: openapp.ns.role + "data",
          type: type,
          onEach: function (doc) {
            doc.del();
          },
          onAll: function () {
            innerDeferred.resolve();
          },
        });
        innerDeferred.then(function () {
          resourceSpace.create({
            relation: openapp.ns.role + "data",
            type: type,
            representation: representation,
            callback: function () {
              deferred.resolve();
            },
          });
        });
        return deferred.promise();
      };

      for (var i = 0; i < resourcesToSave.length; i++) {
        var item = resourcesToSave[i];
        promises.push(recreateResource(item.typeName, item.representation));
      }

      return $.when.apply($, promises);
    },
    storeDataYjs: function () {
      var data = this.graphToJSON();
      const dataMap = y.getMap("data");
      if (guidancemodel.isGuidanceEditor()) {
        dataMap.set("guidancemodel", data);
      } else if (!metamodel) {
        dataMap.set("metamodelpreview", this.generateMetaModel());
        dataMap.set("guidancemetamodel", this.generateGuidanceMetamodel());
        dataMap.set("model", data);
      } else {
        dataMap.set("model", data);
      }
    },
    /**
     * Delete the Model Attribute Node
     */
    deleteModelAttribute: function () {
      _modelAttributesNode = null;
    },
    /**
     * resets the EntityManager
     */
    reset: function () {
      _nodes = {};
      _edges = {};
      this.deleteModelAttribute();
    },
    /**
     * initializes the node types
     * @param vls the vvs
     */
    initNodeTypes: function (vls) {
      nodeTypes = _initNodeTypes(vls);
    },
    /**
     * initializes the view edge types
     * @param vls the vvs
     */
    initEdgeTypes: function (vls) {
      var res = _initEdgeTypes(vls);
      edgeTypes = res.edgeTypes;
      relations = res.relations;
    },
    /**
     * initializes both the node types- and the edge types Object
     * @param vls the vvs
     */
    initModelTypes: function (vls) {
      this.initNodeTypes(vls);
      this.initEdgeTypes(vls);
    },
    /**
     * Get the node type by its name
     * @param type the name of the node type
     * @returns {object}
     */
    getNodeType: function (type) {
      return nodeTypes.hasOwnProperty(type) ? nodeTypes[type] : null;
    },
    /**
     * Get the edge type bt its name
     * @param {string} type the name of the edge type
     * @returns {*}
     */
    getEdgeType: function (type) {
      return edgeTypes.hasOwnProperty(type) ? edgeTypes[type] : null;
    },
    /**
     * initializes the node types of a view
     * @param vvs
     */
    initViewNodeTypes: function (vvs) {
      //delete the old view type references
      for (var nodeTypeName in nodeTypes) {
        if (nodeTypes.hasOwnProperty(nodeTypeName)) {
          delete nodeTypes[nodeTypeName].VIEWTYPE;
        }
      }
      viewNodeTypes = _initNodeTypes(vvs);
    },
    /**
     * initializes the edge types of a view
     * @param vvs
     */
    initViewEdgeTypes: function (vvs) {
      //delete the old view type references
      for (var edgeTypeName in edgeTypes) {
        if (edgeTypes.hasOwnProperty(edgeTypeName)) {
          delete edgeTypes[edgeTypeName].VIEWTYPE;
        }
      }
      var res = _initEdgeTypes(vvs);
      viewEdgeTypes = res.edgeTypes;
      relations = res.relations;
    },
    /**
     * initializes the node and edge types of view
     * @param vvs
     */
    initViewTypes: function (vvs) {
      this.setViewId(vvs.id);
      this.initViewNodeTypes(vvs);
      this.initViewEdgeTypes(vvs);
    },
    /**
     * get a view node type
     * @param {string} type the name of the view type
     * @returns {*}
     */
    getViewNodeType: function (type) {
      return viewNodeTypes.hasOwnProperty(type) ? viewNodeTypes[type] : null;
    },
    /**
     * get a view edge type
     * @param {string} type the name of the view edge type
     * @returns {*}
     */
    getViewEdgeType: function (type) {
      return viewEdgeTypes.hasOwnProperty(type) ? viewEdgeTypes[type] : null;
    },
    /**
     * set the identifier of the view
     * @param {string} viewId
     */
    setViewId: function (viewId) {
      _viewId = viewId;
    },
    /**
     * get the identifier of the view
     * @returns {*}
     */
    getViewId: function () {
      return _viewId;
    },
    /**
     * get nodes by view type
     * @param {string} type the name of the view type
     * @returns {object} a map of objects with key as identifier and value as Node
     */
    getNodesByViewType: function (type) {
      if (viewNodeTypes.hasOwnProperty(type)) {
        return this.getNodesByType(
          viewNodeTypes[type].getTargetNodeType().TYPE
        );
      }
      return null;
    },
    /**
     * get edges by view type
     * @param {string}type the view type
     * @returns {*}
     */
    getEdgesByViewType: function (type) {
      if (viewEdgeTypes.hasOwnProperty(type)) {
        return this.getEdgesByType(
          viewEdgeTypes[type].getTargetEdgeType().TYPE
        );
      }
      return null;
    },
    /**
     * Get the current layer you are operating on
     * @returns {string} CONFIG.LAYER.META or CONFIG.LAYER.MODEL
     */
    getLayer: function () {
      return _layer;
    },
    /**
     * Get the relations between nodes and edges types
     * @returns {{}}
     */
    getRelations: function () {
      return relations;
    },
    setGuidance: function (guidance) {
      guidancemodel = guidance;
    },
    init: function (mm) {
      metamodel = mm;
      if (metamodel && metamodel.hasOwnProperty("nodes")) {
        nodeTypes = _initNodeTypes(metamodel);
        _layer = CONFIG.LAYER.MODEL;
      } else {
        _layer = CONFIG.LAYER.META;

        nodeTypes[ObjectNode.TYPE] = ObjectNode;
        nodeTypes[AbstractClassNode.TYPE] = AbstractClassNode;
        nodeTypes[RelationshipNode.TYPE] = RelationshipNode;
        nodeTypes[RelationshipGroupNode.TYPE] = RelationshipGroupNode;
        nodeTypes[EnumNode.TYPE] = EnumNode;
        nodeTypes[NodeShapeNode.TYPE] = NodeShapeNode;
        nodeTypes[EdgeShapeNode.TYPE] = EdgeShapeNode;

        //add view types
        nodeTypes[ViewObjectNode.TYPE] = ViewObjectNode;
        nodeTypes[ViewRelationshipNode.TYPE] = ViewRelationshipNode;
      }

      if (metamodel && metamodel.hasOwnProperty("edges")) {
        var res = _initEdgeTypes(metamodel);
        edgeTypes = res.edgeTypes;
        relations = res.relations;
      } else {
        edgeTypes[GeneralisationEdge.TYPE] = GeneralisationEdge;
        edgeTypes[BiDirAssociationEdge.TYPE] = BiDirAssociationEdge;
        edgeTypes[UniDirAssociationEdge.TYPE] = UniDirAssociationEdge;

        relations[BiDirAssociationEdge.TYPE] = BiDirAssociationEdge.RELATIONS;
        relations[UniDirAssociationEdge.TYPE] = UniDirAssociationEdge.RELATIONS;
        relations[GeneralisationEdge.TYPE] = GeneralisationEdge.RELATIONS;
      }
    },
  };
}
export const EntityManagerInstance = new EntityManager();

/**
 * Node
 * @class canvas_widget.makeNode
 * @memberof canvas_widget
 * @constructor
 * @param type Type of node
 * @param $shape
 * @param anchors
 * @param attributes
 * @returns {Node}
 */
export function makeNode(type, $shape, anchors, attributes, jsplumb) {
  /**
   * Node
   * @class canvas_widget.Node
   * @extends canvas_widget.AbstractNode
   * @constructor
   * @param {string} id Entity identifier of node
   * @param {number} left x-coordinate of node position
   * @param {number} top y-coordinate of node position
   * @param {number} width Width of node
   * @param {number} height Height of node
   * @param {number} zIndex Position of node on z-axis
   * @param {boolean} containment containment
   */
  class Node extends AbstractNode {
    constructor(id, left, top, width, height, zIndex, containment) {
      super(id, type, left, top, width, height, zIndex, containment);
      var that = this;

      var currentViewType = null;

      this.setCurrentViewType = function (type) {
        currentViewType = type;
      };

      this.getCurrentViewType = function () {
        return currentViewType;
      };

      /**
       * jQuery object of node template
       * @type {jQuery}
       * @private
       */
      var _$template = $shape.clone();

      /**
       * jQuery object of DOM node representing the node
       * @type {jQuery}
       * @private
       */
      var _$node = AbstractNode.prototype.get$node
        .call(this)
        .append(_$template);

      /**
       * Options for new connections
       * @type {object}
       */
      var _anchorOptions = anchors;

      var init = function () {
        var attribute, attributeId, attrObj;
        attrObj = {};
        for (attributeId in attributes) {
          if (attributes.hasOwnProperty(attributeId)) {
            attribute = attributes[attributeId];
            var key = attribute.key.toLowerCase();
            switch (attribute.value) {
              case "boolean":
                attrObj[attributeId] = new BooleanAttribute(
                  id + "[" + attribute.key.toLowerCase() + "]",
                  attribute.key,
                  that
                );
                break;
              case "string":
                attrObj[attributeId] = new SingleValueAttribute(
                  id + "[" + attribute.key.toLowerCase() + "]",
                  attribute.key,
                  that
                );
                if (
                  attribute.key.toLowerCase() === "label" ||
                  attribute.key.toLowerCase() === "title" ||
                  attribute.key.toLowerCase() === "name"
                ) {
                  that.setLabel(attrObj[attributeId]);
                }
                break;
              case "integer":
                attrObj[attributeId] = new IntegerAttribute(
                  id + "[" + attribute.key.toLowerCase() + "]",
                  attribute.key,
                  that
                );
                break;
              case "file":
                attrObj[attributeId] = new FileAttribute(
                  id + "[" + attribute.key.toLowerCase() + "]",
                  attribute.key,
                  that
                );
                break;
              case "quiz":
                attrObj[attributeId] = new QuizAttribute(
                  id + "[" + attribute.key.toLowerCase() + "]",
                  attribute.key,
                  that
                );
                if (
                  attribute.key.toLowerCase() === "label" ||
                  attribute.key.toLowerCase() === "title" ||
                  attribute.key.toLowerCase() === "name"
                ) {
                  that.setLabel(attrObj[attributeId]);
                }
              default:
                if (attribute.options) {
                  attrObj[attributeId] = new SingleSelectionAttribute(
                    id + "[" + attribute.key.toLowerCase() + "]",
                    attribute.key,
                    that,
                    attribute.options
                  );
                }
            }
            _$node.find("." + key).append(attrObj[attributeId].get$node());
          }
        }
        that.setAttributes(attrObj);
      };

      /**
       * Get anchor options for new connections
       * @returns {Object}
       */
      this.getAnchorOptions = function () {
        return _anchorOptions;
      };

      /** Set anchor options for new connections
       *
       */
      this.setAnchorOptions = function (anchors) {
        _anchorOptions = anchors;
      };

      /**
       * Bind source node events for edge tool
       */
      this.makeSource = function () {
        _$node.addClass("source");
        jsPlumb.makeSource(_$node, {
          connectorPaintStyle: { strokeStyle: "#aaaaaa", lineWidth: 2 },
          endpoint: "Blank",
          anchor: _anchorOptions,
          //maxConnections:1,
          uniqueEndpoint: false,
          deleteEndpointsOnDetach: true,
          onMaxConnections: function (info /*, originalEvent*/) {
            console.log(
              "element is ",
              info.element,
              "maxConnections is",
              info.maxConnections
            );
          },
        });

        if (jsplumb)
          jsPlumb.addEndpoint(_$node, jsplumb.endpoint, { uuid: id + "_eps1" });
      };

      /**
       * Bind target node events for edge tool
       */
      this.makeTarget = function () {
        _$node.addClass("target");
        jsPlumb.makeTarget(_$node, {
          isTarget: false,
          uniqueEndpoint: false,
          endpoint: "Blank",
          anchor: _anchorOptions,
          //maxConnections:1,
          deleteEndpointsOnDetach: true,
          onMaxConnections: function (info /*, originalEvent*/) {
            console.log(
              "user tried to drop connection",
              info.connection,
              "on element",
              info.element,
              "with max connections",
              info.maxConnections
            );
          },
        });
        //local user wants to create an edge selected from the pallette
        jsPlumb.bind("beforeDrop", function (info) {
          var allConn = jsPlumb.getConnections({
            target: info.targetId,
            source: info.sourceId,
          });
          var length = allConn.length;
          //if true => Detected a duplicated edge
          if (length > 0) return false; //don't create the edge
          else return true; //no duplicate create the edge
        });

        if (jsplumb)
          jsPlumb.addEndpoint(_$node, jsplumb.endpoint, { uuid: id + "_ept1" });
      };

      /**
       * Unbind events for edge tool
       */
      this.unbindEdgeToolEvents = function () {
        _$node.removeClass("source target");
        jsPlumb.unmakeSource(_$node);
        jsPlumb.unmakeTarget(_$node);
      };

      /**
       * Get JSON representation of the node
       * @returns {Object}
       */
      this.toJSON = function () {
        var json = AbstractNode.prototype.toJSON.call(this);
        json.type = type;
        return json;
      };

      /**
       * set a new shape for the node
       * @param $shape
       */
      this.set$shape = function ($shape) {
        _$template.remove();
        var _$shape = $shape.clone();

        var attributes = that.getAttributes();
        for (var attrKey in attributes) {
          if (attributes.hasOwnProperty(attrKey)) {
            var attribute = attributes[attrKey];
            var $tmp = _$shape.find("." + attribute.getName().toLowerCase());
            if ($tmp.length > 0) {
              //initialize the value again
              if (attribute.getValue().hasOwnProperty("init"))
                attribute.getValue().init();
              $tmp.append(attribute.get$node());
              break;
            }
          }
        }
        _$template = _$shape;
        _$node.append(_$shape);
      };

      this.get$node = function () {
        return _$node;
      };

      init();

      this.registerYMap = function () {
        AbstractNode.prototype.registerYMap.call(this);
        var labelAttr = that.getLabel();
        if (labelAttr) labelAttr.registerYType();
        var attr = that.getAttributes();
        for (var key in attr) {
          if (attr.hasOwnProperty(key)) {
            var val = attr[key].getValue();
            if (val.hasOwnProperty("registerYType")) {
              val.registerYType();
            }
          }
        }
      };
    }
    /**
     * Get the jquery shape object from the node type
     * @static
     * @returns {*}
     */
    static get$shape() {
      return $shape;
    }
    /**
     * Get the anchors of the node type
     * @static
     * @returns {*}
     */
    static getAnchors() {
      return anchors;
    }
    static getAttributes() {
      return attributes;
    }
  }

  return Node;
}

/**
 * AbstractNode
 * @class canvas_widget.AbstractNode
 * @extends canvas_widget.AbstractEntity
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {string} type Type of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {boolean} containment containment
 * @param {number} zIndex Position of node on z-axis
 */

/**
 * ObjectNode
 * @class canvas_widget.ObjectNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 */
export class ObjectNode extends AbstractNode {
  static TYPE = "Object";
  static DEFAULT_WIDTH = 150;
  static DEFAULT_HEIGHT = 100;
  constructor(id, left, top, width, height, zIndex, json) {
    super(id, ObjectNode.TYPE, left, top, width, height, zIndex, json);
    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(objectNodeHtml)({ type: that.getType() }));

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node
      .call(this)
      .append(_$template)
      .addClass("object");

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var _$attributeNode = _$node.find(".attributes");

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = this.getAttributes();

    /**
     * Get JSON representation of the node
     * @returns {Object}
     */
    this.toJSON = function () {
      return AbstractNode.prototype.toJSON.call(this);
    };
    var attr = new KeySelectionValueListAttribute(
      "[attributes]",
      "Attributes",
      this,
      {
        string: "String",
        boolean: "Boolean",
        integer: "Integer",
        file: "File",
        quiz: "Questions",
      }
    );
    this.addAttribute(attr);

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
      attr.registerYMap();
    };

    _$node.find(".label").append(this.getLabel().get$node());

    for (var attributeKey in _attributes) {
      if (_attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(_attributes[attributeKey].get$node());
      }
    }

    this.unregisterCallbacks = function () {
      that.getAttribute("[attributes]").unregisterCallbacks();
    };

    this.setContextMenuItemCallback(function () {
      var NodeShapeNode = NodeShapeNode,
        BiDirAssociationEdge = BiDirAssociationEdge,
        UniDirAssociationEdge = UniDirAssociationEdge;
      return {
        addShape: {
          name: "Add Node Shape",
          callback: function () {
            var canvas = that.getCanvas(),
              appearance = that.getAppearance(),
              nodeId;

            //noinspection JSAccessibilityCheck
            canvas
              .createNode(
                NodeShapeNode.TYPE,
                appearance.left + appearance.width + 50,
                appearance.top,
                150,
                100
              )
              .done(function (nodeId) {
                canvas.createEdge(
                  BiDirAssociationEdge.TYPE,
                  that.getEntityId(),
                  nodeId
                );
              });
          },
          disabled: function () {
            var edges = that.getEdges(),
              edge,
              edgeId;

            for (edgeId in edges) {
              if (edges.hasOwnProperty(edgeId)) {
                edge = edges[edgeId];
                if (
                  (edge instanceof BiDirAssociationEdge &&
                    ((edge.getTarget() === that &&
                      edge.getSource() instanceof NodeShapeNode) ||
                      (edge.getSource() === that &&
                        edge.getTarget() instanceof NodeShapeNode))) ||
                  (edge instanceof UniDirAssociationEdge &&
                    edge.getTarget() instanceof NodeShapeNode)
                ) {
                  return true;
                }
              }
            }
            return false;
          },
        },
        sepConvertTo: "---------",
        convertTo: {
          name: "Convert to..",
          items: {
            abstractClassNode: {
              name: "..Abstract Class",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  AbstractClassNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
            relationshipNode: {
              name: "..Relationship",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  $__canvas_widget_RelationshipNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
            relationshipGroupNode: {
              name: "..Relationship Group",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  $__canvas_widget_RelationshipGroupNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
          },
        },
        sep: "---------",
      };
    });
  }
}

/**
 * Abstract Class Node
 * @class canvas_widget.AbstractClassNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 */
export class AbstractClassNode extends AbstractNode {
  constructor(id, left, top, width, height, zIndex, json) {
    super(id, AbstractClassNode.TYPE, left, top, width, height, zIndex, json);

    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(
      _.template(abstractClassNodeHtml)({ type: that.getType() })
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node
      .call(this)
      .append(_$template)
      .addClass("class");

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var _$attributeNode = _$node.find(".attributes");

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = this.getAttributes();

    /**
     * Get JSON representation of the node
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractNode.prototype.toJSON.call(this);
      json.type = AbstractClassNode.TYPE;
      return json;
    };

    var attr = new KeySelectionValueListAttribute(
      "[attributes]",
      "Attributes",
      this,
      {
        string: "String",
        boolean: "Boolean",
        integer: "Integer",
        file: "File",
        quiz: "Questions",
      }
    );
    this.addAttribute(attr);

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
      attr.registerYMap();
    };

    this.unregisterCallbacks = function () {
      that.getAttribute("[attributes]").unregisterCallbacks();
    };

    _$node.find(".label").append(this.getLabel().get$node());

    for (var attributeKey in _attributes) {
      if (_attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(_attributes[attributeKey].get$node());
      }
    }

    this.setContextMenuItemCallback(function () {
      return {
        convertTo: {
          name: "Convert to..",
          items: {
            objectNode: {
              name: "..Object",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  ObjectNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.getContainment(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
            relationshipNode: {
              name: "..Relationship",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  $__canvas_widget_RelationshipNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.getContainment(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
            relationshipGroupNode: {
              name: "..Relationship Group",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  $__canvas_widget_RelationshipGroupNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.getContainment(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
          },
        },
        sep: "---------",
      };
    });
  }
}

/**
 * RelationshipNode
 * @class canvas_widget.RelationshipNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 */
export class RelationshipNode extends AbstractNode {
  static TYPE = "Relationship";
  static DEFAULT_WIDTH = 150;
  static DEFAULT_HEIGHT = 100;

  constructor(id, left, top, width, height, zIndex, json) {
    super(this, id, "Relationship", left, top, width, height, zIndex, json);
    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(
      _.template(relationshipNodeHtml)({ type: that.getType() })
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var $node = AbstractNode.prototype.get$node
      .call(this)
      .append(_$template)
      .addClass("relation");

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var _$attributeNode = $node.find(".attributes");

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = this.getAttributes();

    /**
     * Get JSON representation of the node
     * @returns {Object}
     */
    this.toJSON = function () {
      return AbstractNode.prototype.toJSON.call(this);
    };

    var attr = new KeySelectionValueSelectionValueListAttribute(
      "[attributes]",
      "Attributes",
      this,
      {
        string: "String",
        boolean: "Boolean",
        integer: "Integer",
        file: "File",
      },
      { hidden: "Hide", top: "Top", center: "Center", bottom: "Bottom" }
    );
    this.addAttribute(attr);

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
      attr.registerYMap();
    };

    this.unregisterCallbacks = function () {
      that.getAttribute("[attributes]").unregisterCallbacks();
    };

    $node.find(".label").append(this.getLabel().get$node());

    for (var attributeKey in _attributes) {
      if (_attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(_attributes[attributeKey].get$node());
      }
    }

    this.setContextMenuItemCallback(function () {
      var EdgeShapeNode = EdgeShapeNode,
        BiDirAssociationEdge = BiDirAssociationEdge,
        UniDirAssociationEdge = UniDirAssociationEdge;
      return {
        addShape: {
          name: "Add Edge Shape",
          callback: function () {
            var canvas = that.getCanvas(),
              appearance = that.getAppearance(),
              nodeId;

            //noinspection JSAccessibilityCheck
            canvas
              .createNode(
                EdgeShapeNode.TYPE,
                appearance.left + appearance.width + 50,
                appearance.top,
                150,
                100
              )
              .done(function (nodeId) {
                canvas.createEdge(
                  BiDirAssociationEdge.TYPE,
                  that.getEntityId(),
                  nodeId
                );
              });
          },
          disabled: function () {
            var edges = that.getEdges(),
              edge,
              edgeId;

            for (edgeId in edges) {
              if (edges.hasOwnProperty(edgeId)) {
                edge = edges[edgeId];
                if (
                  (edge instanceof BiDirAssociationEdge &&
                    ((edge.getTarget() === that &&
                      edge.getSource() instanceof EdgeShapeNode) ||
                      (edge.getSource() === that &&
                        edge.getTarget() instanceof EdgeShapeNode))) ||
                  (edge instanceof UniDirAssociationEdge &&
                    edge.getTarget() instanceof EdgeShapeNode)
                ) {
                  return true;
                }
              }
            }
            return false;
          },
        },
        sepConvertTo: "---------",
        convertTo: {
          name: "Convert to..",
          items: {
            abstractNode: {
              name: "..Abstract Class Node",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  AbstractClassNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
            objectNode: {
              name: "..Object Node",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  ObjectNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
            relationshipGroupNode: {
              name: "..Relationship Group",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  $__canvas_widget_RelationshipGroupNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
          },
        },
        sep: "---------",
      };
    });
  }
}

/**
 * Abstract Class Node
 * @class canvas_widget.EdgeShapeNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 */
export class EdgeShapeNode extends AbstractNode {
  static TYPE = "Edge Shape";
  static DEFAULT_WIDTH = 150;
  static DEFAULT_HEIGHT = 150;

  constructor(id, left, top, width, height, zIndex, json) {
    super(id, EdgeShapeNode.TYPE, left, top, width, height, zIndex, json);
    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(edgeShapeNodeHtml)({ type: that.getType() }));

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node
      .call(this)
      .append(_$template)
      .addClass("class");

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var _$attributeNode = _$node.find(".attributes");

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = this.getAttributes();

    /**
     * Get JSON representation of the node
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractNode.prototype.toJSON.call(this);
      json.type = EdgeShapeNode.TYPE;
      return json;
    };

    var attrArrow = new SingleSelectionAttribute(
      this.getEntityId() + "[arrow]",
      "Arrow",
      this,
      {
        bidirassociation: "---",
        unidirassociation: "-->",
        generalisation: "--▷",
        diamond: "-◁▷",
      }
    );
    var attrShape = new SingleSelectionAttribute(
      this.getEntityId() + "[shape]",
      "Shape",
      this,
      { straight: "Straight", curved: "Curved", segmented: "Segmented" }
    );
    var attrColor = new SingleColorValueAttribute(
      this.getEntityId() + "[color]",
      "Color",
      this
    );
    var attrOverlay = new SingleValueAttribute(
      this.getEntityId() + "[overlay]",
      "Overlay Text",
      this
    );
    var attrOverlayPos = new SingleSelectionAttribute(
      this.getEntityId() + "[overlayPosition]",
      "Overlay Position",
      this,
      { hidden: "Hide", top: "Top", center: "Center", bottom: "Bottom" }
    );
    var attrOverlayRotate = new BooleanAttribute(
      this.getEntityId() + "[overlayRotate]",
      "Autoflip Overlay",
      this
    );

    this.addAttribute(attrArrow);
    this.addAttribute(attrShape);
    this.addAttribute(attrColor);
    this.addAttribute(attrOverlay);
    this.addAttribute(attrOverlayPos);
    this.addAttribute(attrOverlayRotate);

    this.registerYMap = function (map, disableYText) {
      AbstractNode.prototype.registerYMap.call(this, map);
      attrArrow.getValue().registerYType();
      attrShape.getValue().registerYType();
      attrOverlayPos.getValue().registerYType();
      attrOverlayRotate.getValue().registerYType();
      that.getLabel().getValue().registerYType();
      attrColor.getValue().registerYType();
      attrOverlay.getValue().registerYType();
    };

    _$node.find(".label").append(this.getLabel().get$node());

    for (var attributeKey in _attributes) {
      if (_attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(_attributes[attributeKey].get$node());
      }
    }
  }
}

/**
 * BiDirAssociationEdge
 * @class canvas_widget.BiDirAssociationEdge
 * @extends canvas_widget.AbstractEdge
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of edge
 * @param {canvas_widget.AbstractNode} source Source node
 * @param {canvas_widget.AbstractNode} target Target node
 */
/**
 * BiDirAssociationEdge
 * @class canvas_widget.BiDirAssociationEdge
 * @extends canvas_widget.AbstractEdge
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of edge
 * @param {canvas_widget.AbstractNode} source Source node
 * @param {canvas_widget.AbstractNode} target Target node
 */
export class BiDirAssociationEdge extends AbstractEdge {
  static TYPE = "Bi-Dir-Association";
  static RELATIONS = [
    {
      sourceTypes: [ObjectNode.TYPE],
      targetTypes: [
        EnumNode.TYPE,
        NodeShapeNode.TYPE,
        RelationshipNode.TYPE,
        RelationshipGroupNode.TYPE,
        ViewRelationshipNode.TYPE,
      ],
    },
    {
      sourceTypes: [RelationshipNode.TYPE],
      targetTypes: [
        EnumNode.TYPE,
        EdgeShapeNode.TYPE,
        ObjectNode.TYPE,
        AbstractClassNode.TYPE,
        ViewObjectNode.TYPE,
      ],
    },
    {
      sourceTypes: [RelationshipGroupNode.TYPE],
      targetTypes: [ObjectNode.TYPE, AbstractClassNode.TYPE],
    },
    {
      sourceTypes: [AbstractClassNode.TYPE],
      targetTypes: [
        EnumNode.TYPE,
        RelationshipNode.TYPE,
        RelationshipGroupNode.TYPE,
      ],
    },
    {
      sourceTypes: [EnumNode.TYPE],
      targetTypes: [
        ObjectNode.TYPE,
        RelationshipNode.TYPE,
        AbstractClassNode.TYPE,
      ],
    },
    {
      sourceTypes: [NodeShapeNode.TYPE],
      targetTypes: [ObjectNode.TYPE],
    },
    {
      sourceTypes: [EdgeShapeNode.TYPE],
      targetTypes: [RelationshipNode.TYPE],
    },
    {
      sourceTypes: [ViewObjectNode.TYPE],
      targetTypes: [
        EnumNode.TYPE,
        NodeShapeNode.TYPE,
        RelationshipNode.TYPE,
        RelationshipGroupNode.TYPE,
        ViewRelationshipNode.TYPE,
      ],
    },
    {
      sourceTypes: [ViewRelationshipNode.TYPE],
      targetTypes: [
        EnumNode.TYPE,
        EdgeShapeNode.TYPE,
        ObjectNode.TYPE,
        AbstractClassNode.TYPE,
        ViewObjectNode.TYPE,
      ],
    },
  ];
  constructor(id, source, target) {
    super(id, BiDirAssociationEdge.TYPE, source, target);
    var that = this;

    /**
     * Connect source and target node and draw the edge on canvas
     */
    this.connect = function () {
      var source = this.getSource();
      var target = this.getTarget();
      var connectOptions = {
        source: source.get$node(),
        target: target.get$node(),
        paintStyle: {
          strokeStyle: "#aaaaaa",
          lineWidth: 2,
        },
        endpoint: "Blank",
        anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
        connector: ["Straight", { gap: 0 }],
        overlays: [
          [
            "Custom",
            {
              create: function () {
                return that.get$overlay();
              },
              location: 0.5,
              id: "label",
            },
          ],
        ],
        cssClass: this.getEntityId(),
      };

      if (source === target) {
        connectOptions.anchors = ["TopCenter", "LeftMiddle"];
      }

      source.addOutgoingEdge(this);
      target.addIngoingEdge(this);

      this.setJsPlumbConnection(jsPlumb.connect(connectOptions));
      this.repaintOverlays();
      _.each(EntityManagerInstance.getEdges(), function (e) {
        e.setZIndex();
      });
    };

    this.get$overlay().find(".type").addClass("segmented");
  }
}

/**
 * AbstractEdge
 * @class canvas_widget.AbstractEdge
 * @extends canvas_widget.AbstractEntity
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of edge
 * @param {string} type Type of edge
 * @param {canvas_widget.AbstractNode} source Source node
 * @param {canvas_widget.AbstractNode} target Target node
 * @param {boolean} [overlayRotate] Flag if edge overlay should be flipped automatically to avoid being upside down
 */
export class AbstractEdge extends AbstractEntity {
  constructor(id, type, source, target, overlayRotate) {
    super(id);
    var that = this;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);

    var _ymap = null;

    if (window.hasOwnProperty("y")) {
      const edgeMap = y.getMap("edges");
      if (edgeMap.has(id) != -1) {
        _ymap = edgeMap.get(id);
      } else if (id && type && source && target) {
        _ymap = edgeMap.set(id, new Y.Map());
        _ymap.set("id", id);
        _ymap.set("type", type);
        _ymap.set("source", source.getEntityId());
        _ymap.set("target", target.getEntityId());
        _ymap.set("jabberId", _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
      }
    }
    this.getYMap = function () {
      return _ymap;
    };

    /**
     * Type of edge
     * @type {string}
     * @private
     */
    var _type = type;

    /**
     * Label of edge
     * @type {canvas_widget.SingleValueAttribute}
     * @private
     */
    var _label = new SingleValueAttribute(id + "[label]", "Label", this);

    /**
     * Appearance information of edge
     * @type {{source: (canvas_widget.AbstractNode), target: (canvas_widget.AbstractNode)}}
     * @private
     */
    var _appearance = {
      source: source,
      target: target,
    };

    /**
     * Flag if edge overlay should be flipped automatically to avoid being upside down
     * @type {boolean}
     * @private
     */
    var _overlayRotate = overlayRotate !== false;

    /**
     * jQuery object of DOM node representing the edge's overlay
     * @type {jQuery}
     * @private
     */
    var _$overlay = $(_.template(abstractEdgeHtml)({ type: type }))
      .find(".edge_label")
      .append(_label.get$node())
      .parent();

    /**
     * Canvas the edge is drawn on
     * @type {canvas_widget.AbstractCanvas}
     * @private
     */
    var _canvas = null;

    /**
     * jsPlumb object representing the edge
     * @type {Object}
     * @private
     */
    var _jsPlumbConnection = null;

    /**
     * Attributes of edge
     * @type {Object}
     * @private
     */
    var _attributes = {};

    /**
     * Stores if edge is selected
     * @type {boolean}
     * @private
     */
    var _isSelected = false;

    /**
     * Stores current highlighting color
     * @type {string}
     * @private
     */
    var _highlightColor = null;

    /**
     * Callback to generate list of context menu items
     * @type {function}
     */
    var _contextMenuItemCallback = function () {
      return {};
    };

    //noinspection JSUnusedLocalSymbols
    /**
     * Apply an Edge Delete Operation
     * @param {operations.ot.EdgeDeleteOperation} operation
     */
    var processEdgeDeleteOperation = function (operation) {
      that.remove();
    };

    /**
     * Propagate an Edge Delete Operation to the remote users and the local widgets
     * @param {operations.ot.EdgeDeleteOperation} operation
     */
    var propagateEdgeDeleteOperation = function (operation) {
      processEdgeDeleteOperation(operation);
      $("#save").click();

      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "EdgeDeleteActivity",
          operation.getEntityId(),
          _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
          EdgeDeleteOperation.getOperationDescription(
            that.getType(),
            that.getLabel().getValue().getValue()
          ),
          {}
        )
      );
    };

    /**
     * Callback for a remote Edge Delete Operation
     * @param {operations.ot.EdgeDeleteOperation} operation
     */
    this.remoteEdgeDeleteCallback = function (operation) {
      if (
        operation instanceof EdgeDeleteOperation &&
        operation.getEntityId() == that.getEntityId()
      ) {
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.ATTRIBUTE,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.GUIDANCE,
          operation.getOTOperation()
        );
        processEdgeDeleteOperation(operation);
      }
    };

    /**
     * Get jQuery object of all DOM nodes belonging to the edge
     */
    var getAllAssociatedDOMNodes = function () {
      var overlays,
        i,
        numOfOverlays,
        $e = $("." + id);

      if (_jsPlumbConnection) {
        overlays = _jsPlumbConnection.getOverlays();
        for (i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++) {
          if (overlays[i] instanceof jsPlumb.Overlays.Custom) {
            $e = $e.add(overlays[i].getElement());
          }
        }
      }
      return $e;
    };

    /**
     * Default paint style of edge
     */
    var _defaultPaintStyle;

    /**
     * Set the default paint style
     * @param paintStyle
     */
    this.setDefaultPaintStyle = function (paintStyle) {
      _defaultPaintStyle = paintStyle;
    };

    /**
     * Get the default paint style
     * @returns {*}
     */
    this.getDefaultPaintStyle = function () {
      return _defaultPaintStyle;
    };

    /**
     * Send NodeDeleteOperation for node
     */
    this.triggerDeletion = function (historyFlag) {
      _canvas.select(null);
      var operation = new EdgeDeleteOperation(
        id,
        that.getType(),
        that.getSource().getEntityId(),
        that.getTarget().getEntityId()
      );

      if (_ymap) {
        propagateEdgeDeleteOperation(operation);
        const edgeMap = y.getMap("edges");
        edgeMap.delete(that.getEntityId());
      } else {
        propagateEdgeDeleteOperation(operation);
      }
      if (!historyFlag) HistoryManagerInstance.add(operation);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get callback to generate list of context menu items
     * @returns {object}
     */
    this.getContextMenuItemCallback = function () {
      return _contextMenuItemCallback;
    };

    /**
     * Set callback to generate list of context menu items
     * @param {function} contextMenuItemCallback
     */
    this.setContextMenuItemCallback = function (contextMenuItemCallback) {
      _contextMenuItemCallback = contextMenuItemCallback;
    };

    /**
     * Adds edge to canvas
     * @param {canvas_widget.AbstractCanvas} canvas
     */
    this.addToCanvas = function (canvas) {
      _canvas = canvas;
    };

    /**
     * Get associated canvas
     * @returns {canvas_widget.AbstractCanvas}
     */
    this.getCanvas = function () {
      return _canvas;
    };

    /**
     * Removes edge from canvas
     */
    this.removeFromCanvas = function () {
      _canvas = null;
      $.contextMenu("destroy", "." + that.getEntityId());
      jsPlumb.detach(_jsPlumbConnection, { fireEvent: false });
      _jsPlumbConnection = null;
    };

    /**
     * Add attribute to edge
     * @param {canvas_widget.AbstractAttribute} attribute
     */
    this.addAttribute = function (attribute) {
      var id = attribute.getEntityId();
      if (!_attributes.hasOwnProperty(id)) {
        _attributes[id] = attribute;
      }
    };

    /**
     * Set edge's attributes
     * @param {Object} attributes
     */
    this.setAttributes = function (attributes) {
      _attributes = attributes;
    };

    /**
     * Get edge's attributes
     * @returns {Object}
     */
    this.getAttributes = function () {
      return _attributes;
    };

    /**
     * Get attribute by id
     * @param {String} id Attribute's entity id
     * @returns {canvas_widget.AbstractAttribute}
     */
    this.getAttribute = function (id) {
      if (_attributes.hasOwnProperty(id)) {
        return _attributes[id];
      }
      return null;
    };

    /**
     * Delete attribute by id
     * @param {String} id Attribute's entity id
     */
    this.deleteAttribute = function (id) {
      if (!_attributes.hasOwnProperty(id)) {
        delete _attributes[id];
      }
    };

    /**
     * Set edge label
     * @param {canvas_widget.SingleValueAttribute} label
     */
    this.setLabel = function (label) {
      _label = label;
    };

    /**
     * Get edge label
     * @returns {canvas_widget.SingleValueAttribute}
     */
    this.getLabel = function () {
      return _label;
    };

    /**
     * Get edge type
     * @returns {string}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get source node
     * @returns {canvas_widget.AbstractNode}
     */
    this.getSource = function () {
      return _appearance.source;
    };

    /**
     * Get target node
     * @returns {canvas_widget.AbstractNode}
     */
    this.getTarget = function () {
      //noinspection JSAccessibilityCheck
      return _appearance.target;
    };

    /**
     * Get jQuery object of DOM node representing the edge's overlay
     * @returns {jQuery}
     */
    this.get$overlay = function () {
      return _$overlay;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set flag if edge overlay should be flipped automatically to avoid being upside down
     * @param {boolean} rotateOverlay
     */
    this.setRotateOverlay = function (rotateOverlay) {
      _overlayRotate = rotateOverlay;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get flag if edge overlay should be flipped automatically to avoid being upside down
     * @return {boolean} rotateOverlay
     */
    this.isRotateOverlay = function () {
      return _overlayRotate;
    };

    /**
     * Set jsPlumb object representing the edge
     * @param {Object} jsPlumbConnection
     */
    this.setJsPlumbConnection = function (jsPlumbConnection) {
      _jsPlumbConnection = jsPlumbConnection;
      _defaultPaintStyle = jsPlumbConnection.getPaintStyle();
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get jsPlumb object representing the edge
     * @return {Object} jsPlumbConnection
     */
    this.getJsPlumbConnection = function () {
      return _jsPlumbConnection;
    };

    /**
     * Repaint edge overlays (adjust angle of fixed overlays)
     */
    this.repaintOverlays = function () {
      function makeRotateOverlayCallback(angle) {
        return function rotateOverlay() {
          var $this = $(this),
            oldTransform = $this.css("transform", "").css("transform");

          if (oldTransform === "none") oldTransform = "";

          $this.css({
            transform: oldTransform + " rotate(" + angle + "rad)",
            "-o-transform": oldTransform + " rotate(" + angle + "rad)",
            "-ms-transform": oldTransform + " rotate(" + angle + "rad)",
            "-moz-transform": oldTransform + " rotate(" + angle + "rad)",
            "-webkit-transform": oldTransform + " rotate(" + angle + "rad)",
          });
        };
      }

      var i, numOfOverlays, overlays, sourceEndpoint, targetEndpoint, angle;

      if (_jsPlumbConnection) {
        sourceEndpoint = _jsPlumbConnection.endpoints[0].endpoint;
        targetEndpoint = _jsPlumbConnection.endpoints[1].endpoint;
        angle = Math.atan2(
          sourceEndpoint.y - targetEndpoint.y,
          sourceEndpoint.x - targetEndpoint.x
        );
        if (!_overlayRotate || Math.abs(angle) > Math.PI / 2) {
          angle += Math.PI;
        }
        overlays = _jsPlumbConnection.getOverlays();
        for (i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++) {
          if (overlays[i] instanceof jsPlumb.Overlays.Custom) {
            $(overlays[i].getElement())
              .find(".fixed")
              .not(".segmented")
              .each(makeRotateOverlayCallback(angle));
            //Always flip type overlay
            $(overlays[i].getElement())
              .find(".fixed.type")
              .not(".segmented")
              .each(
                makeRotateOverlayCallback(
                  Math.abs(angle - Math.PI) > Math.PI / 2
                    ? angle
                    : angle + Math.PI
                )
              );
          }
        }
      }
    };

    /**
     * Sets position of edge on z-axis as max of the z-indices of source and target
     */
    this.setZIndex = function () {
      var $e = getAllAssociatedDOMNodes(),
        zIndex = Math.max(source.getZIndex(), target.getZIndex());
      $e.css("zIndex", zIndex);
    };

    /**
     * Connect source and target node and draw the edge on canvas
     */
    this.connect = function () {
      source.addOutgoingEdge(this);
      target.addIngoingEdge(this);
      //noinspection JSAccessibilityCheck
      _jsPlumbConnection = jsPlumb.connect({
        source: _appearance.source.get$node(),
        target: _appearance.target.get$node(),
        paintStyle: { strokeStyle: "#aaaaaa", lineWidth: 2 },
        endpoint: "Blank",
        connector: ["Flowchart", { gap: 0 }],
        anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
        overlays: [
          [
            "Custom",
            {
              create: function () {
                return _$overlay;
              },
              location: 0.5,
              id: "label",
            },
          ],
        ],
        cssClass: id,
      });
      this.repaintOverlays();
      _.each(EntityManagerInstance.getEdges(), function (e) {
        e.setZIndex();
      });
    };

    /**
     * Lowlight the edge
     */
    this.lowlight = function () {
      $("." + id).addClass("lowlighted");
    };

    /**
     * Unlowlight the edge
     */
    this.unlowlight = function () {
      $("." + id).removeClass("lowlighted");
    };

    /**
     * Select the edge
     */
    this.select = function () {
      var paintStyle = _.clone(_defaultPaintStyle),
        overlays,
        i,
        numOfOverlays;

      function makeBold() {
        $(this).css("fontWeight", "bold");
      }

      _isSelected = true;
      this.unhighlight();
      if (_jsPlumbConnection) {
        paintStyle.lineWidth = 4;
        _jsPlumbConnection.setPaintStyle(paintStyle);
        overlays = _jsPlumbConnection.getOverlays();
        for (i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++) {
          if (overlays[i] instanceof jsPlumb.Overlays.Custom) {
            $(overlays[i].getElement()).find(".fixed").each(makeBold);
          }
        }
      }
    };

    /**
     * Unselect the edge
     */
    this.unselect = function () {
      var overlays, i, numOfOverlays;

      function unmakeBold() {
        $(this).css("fontWeight", "");
      }

      _isSelected = false;
      this.highlight(_highlightColor);
      if (_jsPlumbConnection) {
        _jsPlumbConnection.setPaintStyle(_defaultPaintStyle);
        overlays = _jsPlumbConnection.getOverlays();
        for (i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++) {
          if (overlays[i] instanceof jsPlumb.Overlays.Custom) {
            $(overlays[i].getElement()).find(".fixed").each(unmakeBold);
          }
        }
      }
      $("#save").click();
    };

    /**
     * Highlight the edge
     * @param {String} color
     */
    this.highlight = function (color) {
      var paintStyle = _.clone(_defaultPaintStyle);

      if (color) {
        paintStyle.strokeStyle = color;
        paintStyle.lineWidth = 4;
        if (_jsPlumbConnection) _jsPlumbConnection.setPaintStyle(paintStyle);
      }
    };

    /**
     * Unhighlight the edge
     */
    this.unhighlight = function () {
      if (_jsPlumbConnection) {
        _jsPlumbConnection.setPaintStyle(_defaultPaintStyle);
      }
    };

    /**
     * Remove the edge
     */
    this.remove = function () {
      source.deleteOutgoingEdge(this);
      target.deleteIngoingEdge(this);
      this.removeFromCanvas();
      //this.unregisterCallbacks();
      EntityManagerInstance.deleteEdge(this.getEntityId());
      if (_ymap) {
        _ymap = null;
      }
    };

    /**
     * Get JSON representation of the edge
     * @returns {Object}
     * @private
     */
    this._toJSON = function () {
      var attr = {};
      _.forEach(this.getAttributes(), function (val, key) {
        attr[key] = val.toJSON();
      });
      return {
        label: _label.toJSON(),
        source: source.getEntityId(),
        target: target.getEntityId(),
        attributes: attr,
        type: _type,
      };
    };

    /**
     * Bind events for move tool
     */
    this.bindMoveToolEvents = function () {
      if (_jsPlumbConnection) {
        //Enable Edge Select
        _jsPlumbConnection.bind("click", function (/*conn*/) {
          _canvas.select(that);
        });

        $(_jsPlumbConnection.getOverlay("label").canvas)
          .find("input")
          .prop("disabled", false)
          .css("pointerEvents", "");

        /*$(_jsPlumbConnection.getOverlay("label").canvas).find("input[type=text]").autoGrowInput({
                   comfortZone: 10,
                   minWidth: 40,
                   maxWidth: 100
                   }).trigger("blur");*/
      }

      if (id) {
        // view_only is used by the CAE and allows to show a model in the Canvas which is not editable
        // therefore, the context menu of every edge must be disabled
        const widgetConfigMap = y.getMap("widgetConfig");
        var viewOnly = widgetConfigMap.get("view_only");
        if (viewOnly) return;
      }

      //Define Edge Rightclick Menu
      $.contextMenu({
        selector: "." + id,
        zIndex: AbstractEntity.CONTEXT_MENU_Z_INDEX,
        build: function () {
          var menuItems = _.extend(_contextMenuItemCallback(), {
            delete: {
              name: "Delete",
              callback: function (/*key, opt*/) {
                that.triggerDeletion();
              },
            },
          });

          return {
            items: menuItems,
            events: {
              show: function (/*opt*/) {
                _canvas.select(that);
              },
            },
          };
        },
      });

      //$("."+id).contextMenu(true);
    };

    /**
     * Unbind events for move tool
     */
    this.unbindMoveToolEvents = function () {
      if (_jsPlumbConnection) {
        //Disable Edge Select
        _jsPlumbConnection.unbind("click");

        $(_jsPlumbConnection.getOverlay("label").canvas)
          .find("input")
          .prop("disabled", true)
          .css("pointerEvents", "none");
      }

      //$("."+id).contextMenu(false);
    };

    this._registerYMap = function () {
      that.getLabel().getValue().registerYType();
    };
  }
  /**
   * Get JSON representation of the edge
   * @returns {{label: Object, source: string, target: string, attributes: Object, type: string}}
   */
  toJSON() {
    return this._toJSON();
  }
  /**
   * Hide a jsPlumb connection
   */
  hide() {
    var connector = this.getJsPlumbConnection();
    connector.setVisible(false);
  }
  /**
   * Show a jsPlumb connection
   */
  show() {
    var connector = this.getJsPlumbConnection();
    connector.setVisible(true);
  }
  registerYMap() {
    this._registerYMap();
  }
}
