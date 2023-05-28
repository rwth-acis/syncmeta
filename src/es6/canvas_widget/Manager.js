import {
  EVENT_DRAG_START,
  EVENT_DRAG_STOP,
  EVENT_CONNECTION_CLICK,
} from "@jsplumb/browser-ui";
import { AnchorLocations } from "@jsplumb/browser-ui";
import { BezierConnector } from "@jsplumb/browser-ui";
import { FlowchartConnector } from "@jsplumb/browser-ui";
import { StraightConnector, isCustomOverlay } from "@jsplumb/browser-ui";
import "https://cdnjs.cloudflare.com/ajax/libs/graphlib/2.1.8/graphlib.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.2/jquery.contextMenu.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import interact from "interactjs";
import { default as _ } from "lodash-es";
import { Map as YMap, Text as YText } from "yjs";
import { eventWasTriggeredByMe } from "../yeventChecker";
import { CONFIG } from "../config";
import { getQuerySelectorFromNode } from "../getQuerySelectorFromNode";
import { default as loadHTML } from "../html.template.loader";
import { default as IWCW } from "../lib/IWCWrapper";
import "../lib/jquery/jquery.autoGrowInput";
import { OpenAppProvider } from "../lib/openapp";
import { default as ActivityOperation } from "../operations/non_ot/ActivityOperation";
import {
  AttributeAddOperation,
  AttributeDeleteOperation,
  EdgeAddOperation,
  EdgeDeleteOperation,
  NodeAddOperation,
  NodeDeleteOperation,
} from "../operations/ot/EntityOperation";
import { default as NodeMoveOperation } from "../operations/ot/NodeMoveOperation";
import { default as NodeMoveZOperation } from "../operations/ot/NodeMoveZOperation";
import { default as NodeResizeOperation } from "../operations/ot/NodeResizeOperation";
import { default as ValueChangeOperation } from "../operations/ot/ValueChangeOperation";
import { default as Util } from "../Util";
import { default as AbstractAttribute } from "./AbstractAttribute";
import { default as AbstractEntity } from "./AbstractEntity";
import { default as AbstractValue } from "./AbstractValue";
import Arrows from "./Arrows";
import { default as BooleanAttribute } from "./BooleanAttribute";
import { default as FileAttribute } from "./FileAttribute";
import { default as SingleMultiLineValueAttribute } from "./SingleMultiLineValueAttribute";
import ViewEdge from "./view/ViewEdge";
import ViewNode from "./view/ViewNode";
import LogicalConjunctions from "./viewpoint/LogicalConjunctions";
import LogicalOperator from "./viewpoint/LogicalOperator";
import ViewTypesUtil from "./viewpoint/ViewTypesUtil";
import { MultiValue } from "./MultiValue";
import ViewManager from "./viewpoint/ViewManager";

const keySelectionValueSelectionValueListAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/list_attribute.html",
  import.meta.url
);

const singleQuizAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/single_quiz_attribute.html",
  import.meta.url
);

const singleValueListAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/list_attribute.html",
  import.meta.url
);

const canvasSingleValueAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/single_value_attribute.html",
  import.meta.url
);

const listHtml = await loadHTML(
  "../../templates/canvas_widget/list_attribute.html",
  import.meta.url
);

const renamingAttrHTML = await loadHTML(
  "../../templates/attribute_widget/renaming_attribute.html",
  import.meta.url
);

const singleSelectionAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/single_selection_attribute.html",
  import.meta.url
);

const singleColorValueAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/single_value_attribute.html",
  import.meta.url
);

const keySelectionValueSelectionValueAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/key_value_attribute.html",
  import.meta.url
);

const keySelectionValueListAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/list_attribute.html",
  import.meta.url
);

const keySelectionValueAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/key_value_attribute.html",
  import.meta.url
);
const integerAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/integer_attribute.html",
  import.meta.url
);

let integerValueHtml = await loadHTML(
  "../../templates/canvas_widget/integer_value.html",
  import.meta.url
);
const attributeIntegerValueHtml = await loadHTML(
  "../../templates/attribute_widget/integer_value.html",
  import.meta.url
);

const valueHtml = await loadHTML(
  "../../templates/canvas_widget/value.html",
  import.meta.url
);

let selectionValueHtml = await loadHTML(
  "../../templates/canvas_widget/selection_value.html",
  import.meta.url
);
const attributeSelectionValueHtml = await loadHTML(
  "../../templates/attribute_widget/selection_value.html",
  import.meta.url
);

const viewrelationshipNodeHtml = await loadHTML(
  "../../templates/canvas_widget/viewrelationship_node.html",
  import.meta.url
);

const viewobjectNodeHtml = await loadHTML(
  "../../templates/canvas_widget/viewobject_node.html",
  import.meta.url
);

const nodeShapeNodeHtml = await loadHTML(
  "../../templates/canvas_widget/node_shape_node.html",
  import.meta.url
);

const modelAttributesNodeHtml = await loadHTML(
  "../../templates/canvas_widget/model_attributes_node.html",
  import.meta.url
);

const relationshipGroupNodeHtml = await loadHTML(
  "../../templates/canvas_widget/relationship_group_node.html",
  import.meta.url
);

const enumNodeHtml = await loadHTML(
  "../../templates/canvas_widget/enum_node.html",
  import.meta.url
);

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

const multiValueAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/multi_value_attribute.html",
  import.meta.url
);

var shapes = {
  straight: {
    type: StraightConnector.type,
    options: { gap: 0 },
  },
  curved: {
    type: BezierConnector.type,
    options: { gap: 0 },
  },
  segmented: {
    type: FlowchartConnector.type,
    options: { gap: 0 },
  },
};

function HistoryManager() {
  var bufferSize = 20;

  var _canvas = null;

  var latestOp = null;
  var undo = [];
  var redo = [];

  var $undo = $("#undo");

  var $redo = $("#redo");

  var propagateHistoryOperationFromJson = function (json) {
    var operation = null,
      data = null,
      entity;
    switch (json.TYPE) {
      case NodeDeleteOperation.TYPE: {
        entity = EntityManagerInstance.findNode(json.id);
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
        entity = EntityManagerInstance.findEdge(json.id);
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
        entity = EntityManagerInstance.findNode(json.id);
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
        entity = EntityManagerInstance.findNode(json.id);
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
        entity = EntityManagerInstance.findNode(json.id);
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
      if (!canvas) throw new Error("Canvas is null");
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
      var entityIdFilter = function (value) {
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
Object.freeze(HistoryManagerInstance);

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
            anchors = {
              type: "Perimeter",
              options: {
                shape: "Rectangle",
                anchorCount: 10,
              },
            };
          }
        } catch (e) {
          anchors = {
            type: "Perimeter",
            options: {
              shape: "Rectangle",
              anchorCount: 10,
            },
          };
        }
      } else {
        switch (node.shape.shape) {
          case "circle":
            anchors = {
              type: "Perimeter",
              options: {
                shape: "Circle",
                anchorCount: 10,
              },
            };
            break;
          case "diamond":
            anchors = {
              type: "Perimeter",
              options: {
                shape: "Diamond",
                anchorCount: 10,
              },
            };
            break;
          case "rounded_rectangle":
            anchors = {
              type: "Perimeter",
              options: {
                shape: "Rectangle",
                anchorCount: 10,
              },
            };
            break;
          case "triangle":
            anchors = {
              type: "Perimeter",
              options: {
                shape: "Triangle",
                anchorCount: 10,
              },
            };
            break;
          default:
          case "rectangle":
            anchors = {
              type: "Perimeter",
              options: {
                shape: "Rectangle",
                anchorCount: 10,
              },
            };
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
        _nodeTypes[node.label] = makeNode(
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
        _edgeTypes[edge.label] = makeEdge(
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
  _selectedPaintStyle = { strokeWidth: 6, stroke: "black" };
  _hoverPaintStyle = { strokeWidth: 6, stroke: "black" };

  constructor(id, type, source, target, overlayRotate, y) {
    super(id);
    y = y || window.y;
    var that = this;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y); // y comes from the window object but should in the future be passed through the constructor since we should avoid binding to window

    var _ymap = null;
    if (!y) {
      throw new Error("y is not defined");
    }

    const edgeMap = y.getMap("edges");
    if (edgeMap.has(id)) {
      _ymap = edgeMap.get(id);
    } else if (id && type && source && target) {
      y.transact(() => {
        _ymap = new YMap();
        _ymap.set("id", id);
        _ymap.set("type", type);
        _ymap.set("source", source.getEntityId());
        _ymap.set("target", target.getEntityId());
        _ymap.set("jabberId", _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
        edgeMap.set(id, _ymap);
      });
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
    var _label = new SingleValueAttribute(id + "[label]", "Label", this, y);

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

    // make label position absolute and shift down 105%
    const maxZIndex = Math.max(
      _appearance.source.getZIndex(),
      _appearance.target.getZIndex()
    );
    _$overlay
      .find(".edge_label")
      .parent()
      .css({
        position: "absolute",
        top: "105%",
        background: "white",
        zIndex: maxZIndex + 1,
      });

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
    var processEdgeDeleteOperation = function () {
      that.remove();
    };

    /**
     * Propagate an Edge Delete Operation to the remote users and the local widgets
     * @param {operations.ot.EdgeDeleteOperation} operation
     */
    var propagateEdgeDeleteOperation = function (operation) {
      processEdgeDeleteOperation(operation);

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
        ).toJSON()
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
      } else throw new Error("jsPlumbConnection is null");
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
      if (!canvas) throw new Error("Canvas is null");
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
      window.jsPlumbInstance.deleteConnection(_jsPlumbConnection, {
        fireEvent: false,
      });
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
      jsPlumbConnection.setHoverPaintStyle(this._hoverPaintStyle);
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

        for (const overlay of Object.values(overlays)) {
          if (isCustomOverlay(overlay)) {
            $(overlay.canvas)
              .find(".fixed")
              .not(".segmented")
              .each(makeRotateOverlayCallback(angle));
            //Always flip type overlay
            $(overlay.canvas)
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
      } else throw new Error("jsPlumbConnection is null");
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
      _jsPlumbConnection = window.jsPlumbInstance.connect({
        source: _appearance.source.get$node().get(0),
        target: _appearance.target.get$node().get(0),
        paintStyle: { stroke: "#7c7c7d", outlineWidth: 4 },
        endpoint: "Dot",
        connector: { type: FlowchartConnector.type },
        anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
        overlays: [
          {
            type: "Custom",
            options: {
              create: function () {
                return _$overlay.get(0);
              },
              location: 0.5,
              id: "label",
            },
          },
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
    this.select = () => {
      var overlays, i, numOfOverlays;

      function makeBold() {
        $(this).css("fontWeight", "bold");
      }

      _isSelected = true;

      if (_jsPlumbConnection) {
        _jsPlumbConnection.setPaintStyle(this._selectedPaintStyle);
        overlays = _jsPlumbConnection.getOverlays();
        for (const overlay of Object.values(overlays)) {
          if (isCustomOverlay(overlay)) {
            $(overlay.canvas).find(".fixed").each(makeBold);
          }
        }
      } else throw new Error("jsPlumbConnection is null");
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
      this.unhighlight();
      if (_jsPlumbConnection) {
        _jsPlumbConnection.setPaintStyle(_defaultPaintStyle);
        overlays = _jsPlumbConnection.getOverlays();
        for (const overlay of Object.values(overlays)) {
          if (isCustomOverlay(overlay)) {
            $(overlay.canvas).find(".fixed").each(unmakeBold);
          }
        }
      }
    };

    /**
     * Highlight the edge
     * @param {String} color
     */
    this.highlight = function (color = "green") {
      var paintStyle = _.clone(_defaultPaintStyle);

      if (color) {
        paintStyle = {
          ...paintStyle,
          stroke: color,
          fill: color,
          outlineStroke: "black",
          strokeWidth: 8,
        };
        if (_jsPlumbConnection) _jsPlumbConnection.setPaintStyle(paintStyle);
        else throw new Error("jsPlumbConnection is null");
      }
    };

    /**
     * Unhighlight the edge
     */
    this.unhighlight = function () {
      if (_jsPlumbConnection) {
        _jsPlumbConnection.setPaintStyle(_defaultPaintStyle);
      } else throw new Error("jsPlumbConnection is null");
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
    this.bindMoveToolEvents = () => {
      if (_jsPlumbConnection) {
        //Enable Edge Select
        //class contains id
        jsPlumbInstance.bind(EVENT_CONNECTION_CLICK, (connection) => {
          if (connection.cssClass.indexOf(id) === -1) return;
          console.log(connection);

          _canvas.select(that);
        });

        $(_jsPlumbConnection.getOverlay("label").canvas)
          .find("input")
          .prop("disabled", false)
          .css("pointerEvents", "");
      } else throw new Error("jsPlumbConnection is null");

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
        $("." + id).off("click");

        $(_jsPlumbConnection.getOverlay("label").canvas)
          .find("input")
          .prop("disabled", true)
          .css("pointerEvents", "none");
      } else throw new Error("jsPlumbConnection is null");

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
  nodeSelector;
  _$node;
  _isBeingDragged = false;
  constructor(
    id,
    type,
    left,
    top,
    width,
    height,
    zIndex,
    containment,
    json,
    y
  ) {
    super(id);
    var that = this;
    y = y || window.y;
    if (!y) {
      throw new Error("y is undefined");
    }

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);
    /**y-map instances which belongs to the node
     * @type {YMap}
     * @private
     * */
    var _ymap = null;
    y = y || window.y;
    if (!y) {
      throw new Error("y is undefined");
    }
    const nodesMap = y.getMap("nodes");

    if (nodesMap.has(id)) {
      _ymap = nodesMap.get(id);
    } else {
      window.y.transact(() => {
        _ymap = new YMap();
        nodesMap.set(id, _ymap);
        _ymap.set("modifiedBy", window.y.clientID);
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
      });
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
    var _label = new SingleValueAttribute(id + "[label]", "Label", this, y);

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
    this._$node = _$node;
    const resizeHandle = $(
      `<div class="resize-handle"><i class="bi bi-aspect-ratio" style="font-size:1.5rem;"></i></div>`
    );
    resizeHandle.css({
      position: "absolute",
      bottom: "-15px",
      right: "-15px",
      cursor: "nwse-resize",
      zIndex: 100000,
    });

    // append to node
    _$node.append(resizeHandle);
    resizeHandle.on("mouseover", () => {
      this.disableDraggable();
    });
    resizeHandle.on("mouseout", () => {
      this.enableDraggable();
    });

    this.nodeSelector = getQuerySelectorFromNode(this._$node[0]);

    // this is the node's awareness trace.
    // If I understand correctly, it is showing the activity of other users on the node.
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

    this._$node.on("mousedown", function () {
      _canvas.select(that);
      _canvas.unbindMoveToolEvents();
    });

    this._$node.on("mouseup", function () {
      _canvas.bindMoveToolEvents();
    });

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
      EntityManagerInstance.storeDataYjs();

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
        ).toJSON()
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
        ).toJSON()
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
      EntityManagerInstance.storeDataYjs();
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
        ).toJSON()
      );

      if (_ymap) _ymap.set("NodeResizeOperation", operation.toJSON());
    };

    /**
     * Apply a Node Delete Operation
     * @param {operations.ot.NodeDeleteOperation} operation
     */
    var processNodeDeleteOperation = function () {
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
      EntityManagerInstance.storeDataYjs();
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
        ).toJSON()
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
          var EntityManager = EntityManagerInstance;

          offsetClick = $(e.target).offset();
          offsetCanvas = that.getCanvas().get$node().offset();

          if (
            _canvas.getSelectedEntity() === null ||
            _canvas.getSelectedEntity() === that
          ) {
            menuItems = _.extend(_contextMenuItemCallback(), {
              connectTo: EntityManagerInstance.generateConnectToMenu(that),
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

    /**
     * Anchor options for new connections
     * @type {object}
     */
    var _anchorOptions = AnchorLocations.AutoDefault;

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
      if (!canvas) throw new Error("Canvas is null");
      _canvas = canvas;
      canvas.get$canvas().append(_$awarenessTrace);
      canvas.get$canvas().append(this._$node);
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
      this._$node.remove();
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
      return this._$node;
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
      this._$node.css({
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
    this.move = function (offsetX, offsetY) {
      const x = _appearance.left + offsetX;
      const y = _appearance.top + offsetY;
      if (
        x < 0 ||
        y < 0 ||
        x > _canvas.width - _appearance.width ||
        y > _canvas.height - _appearance.height
      ) {
        // reset the position
        _$node.css({
          left: _appearance.left,
          top: _appearance.top,
        });
        console.error("Node cannot be moved outside of canvas");
        if (_ymap) {
          window.y.transact(() => {
            _ymap.set("left", _appearance.left);
            _ymap.set("top", _appearance.top);
            _ymap.set("zIndex", _zIndex);
          });
        }
      } else {
        if (_ymap) {
          window.y.transact(() => {
            _ymap.set("left", (_appearance.left += offsetX));
            _ymap.set("top", (_appearance.top += offsetY));
            _ymap.set("zIndex", _zIndex);
          });
        }
      }
      this._draw();
      this.repaint();
    };

    this.moveAbs = function (left, top, zIndex) {
      if (left < 0 || top < 0) {
        console.error("Node cannot be moved outside of canvas");
      }
      if (
        left > _canvas.width - _appearance.width ||
        top > _canvas.height - _appearance.height
      ) {
        console.error("Node cannot be moved outside of canvas");
      }
      _appearance.left = left;
      _appearance.top = top;

      if (zIndex) _zIndex = zIndex;

      if (_ymap) {
        y.transact(() => {
          _ymap.set("left", _appearance.left);
          _ymap.set("top", _appearance.top);
          if (zIndex) _ymap.set("zIndex", _zIndex);
        });
      }
      this._draw();
      this.repaint();
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
        y.transact(() => {
          _ymap.set("width", _appearance.width);
          _ymap.set("height", _appearance.height);
        });
      }
      this._draw();
      this.repaint();
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
      var targetEntityId = target?.getEntityId();
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
      var targetEntityId = target?.getEntityId();
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
      this._$node.addClass("lowlighted");
    };

    /**
     * Unlowlight the node
     */
    this.unlowlight = function () {
      this._$node.removeClass("lowlighted");
    };

    /**
     * Select the node
     */
    this.select = function () {
      _isSelected = true;
      this.unhighlight();
      this._$node.addClass("selected");
      Util.delay(100).then(function () {
        _.each(EntityManagerInstance.getEdges(), function (e) {
          e.setZIndex();
        });
      });
    };

    /**
     * Unselect the node
     */
    this.unselect = function () {
      _isSelected = false;
      // this.highlight(_highlightColor, _highlightUsername);
      this._$node.removeClass("selected");
      //trigger save when unselecting an entity
      Util.delay(100).then(function () {
        _.each(EntityManagerInstance.getEdges(), function (e) {
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
      if (color && username) {
        this._$node.css({ border: "2px solid " + color });
        this._$node.append(
          $("<div></div>")
            .addClass("user_highlight")
            .css("color", color)
            .text(username)
        );
        Util.delay(100).then(function () {
          _.each(EntityManagerInstance.getEdges(), function (e) {
            e.setZIndex();
          });
        });
      }
    };

    /**
     * Unhighlight the node
     */
    this.unhighlight = function () {
      this._$node.css({ border: "" });
      this._$node.find(".user_highlight").remove();
      Util.delay(100).then(function () {
        _.each(EntityManagerInstance.getEdges(), function (e) {
          e.setZIndex();
        });
      });
    };

    /**
     * Remove the node
     */
    this.remove = function () {
      clearInterval(_awarenessTimer);
      this.removeFromCanvas();
      jsPlumbInstance.removeAllEndpoints(_$node.get(0));
      jsPlumbInstance.unmanage(_$node.get(0));
      EntityManagerInstance.deleteNode(this.getEntityId());
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
    this.bindMoveToolEvents = () => {
      this.enableDraggable();
      var originalPos = {
        left: 0,
        top: 0,
      };

      var $sizePreview = $('<div class="size-preview"></div>').hide();

      this.makeResizable(that, _canvas, $sizePreview, id);

      this._$node
        //Enable Node Rightclick menu
        .contextMenu(true)
        .find("input")
        .prop("disabled", false)
        .css("pointerEvents", "");

      jsPlumbInstance.bind(EVENT_DRAG_START, (params) => {
        if (params.el.id !== this._$node.attr("id")) return true;

        this._isBeingDragged = true;

        originalPos.top = params.el.offsetTop;
        originalPos.left = params.el.offsetLeft;

        _canvas.hideGuidanceBox();
        _canvas.unbindMoveToolEvents();
        _$node.css({ opacity: 0.5 });
      });

      jsPlumbInstance.bind(EVENT_DRAG_STOP, (params) => {
        if (params.el.id !== this._$node.attr("id")) return true;

        if (this._isBeingDragged === false) return; // for some reason, dragstop is called multiple times, see #139. This is a workaround to prevent the second call from doing anything

        this._isBeingDragged = false;

        //Avoid node selection on drag stop
        _canvas.showGuidanceBox();
        _canvas.bindMoveToolEvents();
        _$node.css({ opacity: "" });

        // if offset bigger than canvas size, no need to send the operation
        if (
          params.el.offsetLeft < 0 ||
          params.el.offsetTop < 0 ||
          params.el.offsetLeft > _canvas.width ||
          params.el.offsetTop > _canvas.height
        ) {
          console.warn(" offset bigger than canvas size");
          return;
        }

        var offsetX = Math.round(params.el.offsetLeft - originalPos.left);
        var offsetY = Math.round(params.el.offsetTop - originalPos.top);

        // if offset is 0, no need to send the operation
        if (offsetX === 0 && offsetY === 0) return;

        var operation = new NodeMoveOperation(
          that.getEntityId(),
          offsetX,
          offsetY
        );
        that.propagateNodeMoveOperation(operation);
      });

      // view_only is used by the CAE and allows to show a model in the Canvas which is not editable
      // therefore, the nodes should not be draggable and their context menu should be disabled
      const widgetConfigMap = y.getMap("widgetConfig");
      var viewOnly = widgetConfigMap.get("view_only");
      if (viewOnly) {
        this.disableDraggable();
        _$node.on("click").contextMenu(false);
      }
    };

    /**
     * Unbind events for move tool
     */
    this.unbindMoveToolEvents = () => {
      //Disable Node Selection
      // called for e.g. if we want to draw an edge
      this._$node
        .off("click")
        .contextMenu(false)
        .find("input")
        .prop("disabled", true)
        .css("pointerEvents", "none");

      //Disable Node Dragging
      this.disableDraggable();
    };

    /**
     * Bind source node events for edge tool
     */
    this.makeSource = () => {
      _$node.addClass("source");
      this.endPoint = window.jsPlumbInstance.addEndpoint(this._$node.get(0), {
        connectorPaintStyle: { fill: "black", strokeWidth: 4 },
        source: true,
        endpoint: {
          type: "Rectangle",
          options: {
            width: _$node.width() + 50,
            height: _$node.height() + 50,
          },
        },
        paintStyle: { fill: "transparent" },
        anchor: AnchorLocations.Center,
        deleteOnEmpty: true,
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
    this.makeTarget = () => {
      _$node.addClass("target");
      this.endPoint = window.jsPlumbInstance.addEndpoint(this._$node.get(0), {
        target: true,
        endpoint: {
          type: "Rectangle",
          options: {
            width: _$node.width() + 50,
            height: _$node.height() + 50,
          },
        },
        paintStyle: { fill: "transparent" },
        anchor: AnchorLocations.Center,
        uniqueEndpoint: false,
        //maxConnections:1,
        deleteOnEmpty: true,
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
      try {
        _$node.removeClass("source target");
        jsPlumbInstance.getEndpoints(_$node.get(0)).forEach((endpoint) => {
          // We need to remove the endpoint that was created to enable node connection by dragging
          // since we are not using the edge tool anymore
          if (endpoint.connections.length === 0) {
            jsPlumbInstance.deleteEndpoint(endpoint);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    that.init();

    this._registerYMap = function () {
      _ymap.observe(function (event) {
        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key]) => {
          const data = event.currentTarget.get(key);
          if (data?.id && data.triggeredBy !== window.y.clientID) {
            var operation;

            const userMap = y.getMap("users");
            var jabberId = userMap.get(window.y.clientID);
            switch (key) {
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
      });
    };

    this.jsPlumbManagedElement = jsPlumbInstance.manage(this._$node.get(0));

    // EntityManagerInstance.storeDataYjs();
  }
  nodeSelector;
  jsPlumbManagedElement;
  endPoint;

  repaint() {
    window.jsPlumbInstance.repaint(this._$node.get(0));

    Object.values(EntityManagerInstance.getEdges()).forEach((edge) => {
      edge.setZIndex();
      // window.jsPlumbInstance.repaint(document.querySelector(`[class=".${edge.getJsPlumbConnection().cssClass.trim()}"]`));
    });
  }

  enableDraggable() {
    jsPlumbInstance.setDraggable(this._$node.get(0), true);
  }

  disableDraggable() {
    jsPlumbInstance.setDraggable(this._$node.get(0), false);
  }

  makeResizable(that, _canvas, $sizePreview, id) {
    const initialSize = {
      width: that._$node.width(),
      height: that._$node.height(),
    };
    interact(that.nodeSelector)
      .resizable({
        // resize from all edges and corners
        edges: { right: ".bi", bottom: ".bi" },
        square: true,
        listeners: {
          move(event) {
            that.disableDraggable();
            let { x, y } = event.target.dataset;

            x = (parseFloat(x) || 0) + event.deltaRect.left;
            y = (parseFloat(y) || 0) + event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`,
            });

            Object.assign(event.target.dataset, { x, y });

            event.rect.width = Math.max(50, event.rect.width);
            event.rect.height = Math.max(50, event.rect.height);

            $sizePreview.text(
              Math.round(event.rect.width) +
                "\u00D7" +
                Math.round(event.rect.height)
            );
            // that.repaint();
          },
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: "parent",
          }),
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 40, height: 40 },
          }),
        ],
        inertia: { enabled: false },
      })
      .on(["resizestart"], () => {
        // add resizing class
        that._$node.addClass("resizing");
        that.disableDraggable();
        _canvas.hideGuidanceBox();
        $sizePreview.show();
        that._$node.css({ opacity: 0.5 });
        that._$node.append($sizePreview);
        initialSize.width = that._$node.width();
        initialSize.height = that._$node.height();
        _canvas.unbindMoveToolEvents();
      })
      .on(["resizeend"], (event) => {
        // remove resizing class
        that._$node.removeClass("resizing");
        that.enableDraggable();
        const offsetX = event.rect.width - initialSize.width;
        const offsetY = event.rect.height - initialSize.height;
        $sizePreview.hide();
        that._$node.css({ opacity: "" });
        that.repaint();
        var operation = new NodeResizeOperation(id, offsetX, offsetY);
        that.propagateNodeResizeOperation(operation);
        _canvas.bindMoveToolEvents();
      });
  }

  disableResizable() {
    interact(this.nodeSelector).unset();
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
    window.jsPlumbInstance.hide(this.get$node());
  }
  /**
   * show the node and all associated edges
   */
  show() {
    this.get$node().show();
    window.jsPlumbInstance.show(this.get$node()[0]);
    window.jsPlumbInstance.repaint(this.get$node()[0]);
  }
  registerYMap() {
    this._registerYMap();
  }
}

/**
 * Abstract Class Node
 * @class canvas_widget.EnumNode
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
export class EnumNode extends AbstractNode {
  static TYPE = "Enumeration";
  static DEFAULT_WIDTH = 150;
  static DEFAULT_HEIGHT = 100;
  constructor(id, left, top, width, height, zIndex, json) {
    super(id, EnumNode.TYPE, left, top, width, height, zIndex, json);
    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(enumNodeHtml)({ type: that.getType() }));

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
      json.type = EnumNode.TYPE;
      return json;
    };
    var attr = new SingleValueListAttribute("[attributes]", "Attributes", this);
    this.addAttribute(attr);

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
      attr.registerYMap();
    };
    this.unregisterCallbacks = function () {
      that.getAttribute("[attributes]").unregisterCallbacks();
    };
    this.registerYTextAttributes = function (map) {
      map.get(that.getLabel().getValue().getEntityId()).then(function (ytext) {
        that.getLabel().getValue().registerYType(ytext);
      });
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
 * Abstract Class Node
 * @class canvas_widget.NodeShapeNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 * @param {boolean} containment containment
 */
export class NodeShapeNode extends AbstractNode {
  static TYPE = "Node Shape";
  static DEFAULT_WIDTH = 150;
  static DEFAULT_HEIGHT = 150;
  constructor(id, left, top, width, height, zIndex, containment, json) {
    super(
      id,
      "Node Shape",
      left,
      top,
      width,
      height,
      zIndex,
      containment,
      json
    );
    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(nodeShapeNodeHtml)({ type: that.getType() }));

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
      json.type = NodeShapeNode.TYPE;
      return json;
    };

    var attrShapeSelect = new SingleSelectionAttribute(
      this.getEntityId() + "[shape]",
      "Shape",
      this,
      {
        circle: "Circle",
        diamond: "Diamond",
        rectangle: "Rectangle",
        rounded_rectangle: "Rounded Rectangle",
        triangle: "Triangle",
      }
    );
    var attrWidth = new IntegerAttribute(
      this.getEntityId() + "[defaultWidth]",
      "Default Width",
      this
    );
    var attrHeight = new IntegerAttribute(
      this.getEntityId() + "[defaultHeight]",
      "Default Height",
      this
    );
    var attrColor = new SingleColorValueAttribute(
      this.getEntityId() + "[color]",
      "Color",
      this
    );
    var attrContaintment = new BooleanAttribute(
      this.getEntityId() + "[containment]",
      "Containment",
      this
    );
    var attrCustomShape = new SingleMultiLineValueAttribute(
      this.getEntityId() + "[customShape]",
      "Custom Shape",
      this
    );
    var attrAnchors = new SingleValueAttribute(
      this.getEntityId() + "[customAnchors]",
      "Custom Anchors",
      this
    );

    this.addAttribute(attrShapeSelect);
    this.addAttribute(attrColor);
    this.addAttribute(attrWidth);
    this.addAttribute(attrHeight);
    this.addAttribute(attrContaintment);
    this.addAttribute(attrCustomShape);
    this.addAttribute(attrAnchors);

    _$node.find(".label").append(this.getLabel().get$node());

    for (var attributeKey in _attributes) {
      if (_attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(_attributes[attributeKey].get$node());
      }
    }

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      attrShapeSelect.getValue().registerYType();
      attrWidth.getValue().registerYType();
      attrHeight.getValue().registerYType();
      attrContaintment.getValue().registerYType();
      that.getLabel().getValue().registerYType();
      attrColor.getValue().registerYType();
      attrAnchors.getValue().registerYType();
      attrCustomShape.getValue().registerYType();
    };
  }
}

/**
 * EntityManager
 * @class canvas_widget.EntityManager
 * @memberof canvas_widget
 * @constructor
 */
class EntityManager {
  y = null;
  setSharedDocument(y) {
    this.y = y;
  }
  _nodes;
  _edges;

  constructor() {
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
    this._nodes = _nodes;
    /**
     * Edges of the graph
     * @type {{}}
     * @private
     */
    var _edges = {};
    this._edges = _edges;

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
       * @param {number} y the yjs map
       * @param {boolean} store if the node should be stored in the meta model
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
        json,
        y,
        store = true
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
            json,
            y
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
            json,
            y
          );
        }
        _nodes[id] = node;
        if (store) EntityManagerInstance.storeDataYjs();
        return node;
      },
      saveState: function () {
        // if metamodel
        const viewId = ViewManager.getCurrentView();
        if (viewId && !metamodel) {
          ViewManager.updateViewContent(viewId);
        } else {
          EntityManagerInstance.storeDataYjs();
        }
      },
      findObjectNodeByLabel(searchTerm) {
        const re = new RegExp(searchTerm, "gi");
        const { nodes } = EntityManagerInstance.graphToJSON();
        for (const [nodeId, node] of Object.entries(nodes)) {
          if (node?.type.match(re)) {
            // type matches searchTerm
            return EntityManagerInstance.find(nodeId);
          }
          if (node?.label?.value?.value.match(re)) {
            // label matches searchTerm
            return EntityManagerInstance.find(nodeId);
          }
          for (const attr of Object.values(node?.attributes)) {
            // search attributes
            if (typeof attr?.value?.value !== "string") {
              continue;
            }
            if (attr?.value?.value.match(re)) {
              // attribute value matches searchTerm
              return EntityManagerInstance.find(nodeId);
            }
          }
        }
        return null;
      },
      /**
       * Create model Attributes node
       * @returns {canvas_widget.ModelAttributesNode}
       */
      createModelAttributesNode: function (y) {
        if (_modelAttributesNode === null) {
          if (metamodel)
            _modelAttributesNode = new ModelAttributesNode(
              "modelAttributes",
              metamodel.attributes,
              y
            );
          else
            _modelAttributesNode = new ModelAttributesNode(
              "modelAttributes",
              null,
              y
            );
          return _modelAttributesNode;
        }
        return _modelAttributesNode;
      },
      /**
       * Find nodeby attr
       * @memberof attribute_widget.EntityManager#
       * @param {string} name Entity name
       * @returns {canvas_widget.AbstractNode}
       */
      findNodeByAttribute: function (attr, name) {
        for (const key in _nodes) {
          const node = _nodes[key];
          if (node.getAttribute(attr) === name) {
            return node;
          }
        }
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
        EntityManagerInstance.storeDataYjs();
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
      createEdge: function (type, id, source, target, store = true) {
        var edge;

        if (_viewId && viewEdgeTypes.hasOwnProperty(type)) {
          edge = viewEdgeTypes[type](id, source, target);
        } else if (edgeTypes.hasOwnProperty(type)) {
          edge = new edgeTypes[type](id, source, target);
        } else {
          return undefined;
        }
        source.addOutgoingEdge(edge);
        target?.addIngoingEdge(edge);
        _edges[id] = edge;
        if (store) EntityManagerInstance.storeDataYjs();
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
        EntityManagerInstance.storeDataYjs();
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
          ? _modelAttributesNode?.toJSON()
          : {};
        _.forEach(_nodes, function (val, key) {
          nodesJSON[key] = val?.toJSON();
        });
        _.forEach(_edges, function (val, key) {
          edgesJSON[key] = val?.toJSON();
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
        json,
        y
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
          json,
          y,
          false
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
        const sourceNode = this.findNode(source);
        const targetNode = this.findNode(target);
        var edge = this.createEdge(type, id, sourceNode, targetNode, false);
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
              32000,
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
       * generates the context menu for the show and hide operations on node types
       * @returns {object}
       */
      generateVisibilityNodeMenu: function (visibility) {
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

            items[visibility + nodeType] = {
              name: ".." + nodeType,
              callback: _applyVisibilityCallback(nodeType, visibility),
              disabled: (function (nodeType) {
                return function () {
                  if (visibility === "hide")
                    return this.data(visibility + nodeType + "Disabled");
                  else return !this.data(visibility + nodeType + "Disabled");
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
            var label = guidancemodel.getCreateObjectNodeLabelForType(
              node.label
            );
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
            var entityLabel = guidancemodel.getEntityNodeLabelForType(
              node.label
            );
            createObjectNodeToEntityNodeRelation.targetTypes.push(label);
            id = Util.generateRandomId();
            guidanceMetamodel.nodes[id] = {
              label: entityLabel,
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
              targetTypes: [entityLabel],
            });

            //Define the 'entity node' to 'set property node' relation
            dataFlowEdgeRelations.push({
              sourceTypes: [entityLabel],
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
                    sourceTypes: [entityLabel],
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
            var entityLabel = guidancemodel.getEntityNodeLabelForType(
              edge.label
            );

            var id = Util.generateRandomId();
            guidanceMetamodel.nodes[id] = {
              label: entityLabel,
              attributes: {},
              shape: {
                shape: "rectangle",
                color: "black",
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
              var setPropertyLabel =
                guidancemodel.getSetPropertyNodeLabelForType(edge.label);
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

              guidanceMetamodel.nodes[id].attributes[Util.generateRandomId()] =
                {
                  key: "Property",
                  value: "Value",
                  options: options,
                };
            }

            //Define the 'create relationship node' to 'entity node' relation
            dataFlowEdgeRelations.push({
              sourceTypes: [label],
              targetTypes: [entityLabel],
            });

            //Define the 'entity node' to 'set property node' relation
            dataFlowEdgeRelations.push({
              sourceTypes: [entityLabel],
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
            color: "black",
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

        var getEntityPredecessorsForCreateRelationshipAction = function (
          nodeId
        ) {
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
              graph.setEdge(
                nodeId,
                successors.targets[i],
                successors.labels[i]
              );
            }
          } else if (type == guidancemodel.MERGE_NODE_LABEL) {
            var successors = getFlowSuccessors(nodeId);
            graph.setNode(nodeId, {
              type: "MERGE_NODE",
            });
            for (var i = 0; i < successors.targets.length; i++) {
              graph.setEdge(
                nodeId,
                successors.targets[i],
                successors.labels[i]
              );
            }
          } else if (type == guidancemodel.CONCURRENCY_NODE_LABEL) {
            var successors = getFlowSuccessors(nodeId);
            graph.setNode(nodeId, {
              type: "CONCURRENCY_NODE",
            });
            for (var i = 0; i < successors.targets.length; i++) {
              graph.setEdge(
                nodeId,
                successors.targets[i],
                successors.labels[i]
              );
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
              graph.setEdge(
                nodeId,
                successors.targets[i],
                successors.labels[i]
              );
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
              graph.setEdge(
                nodeId,
                successors.targets[i],
                successors.labels[i]
              );
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
              graph.setEdge(
                nodeId,
                successors.targets[i],
                successors.labels[i]
              );
            }
          } else if (type == guidancemodel.CALL_ACTIVITY_NODE_LABEL) {
            var successors = getFlowSuccessors(nodeId);
            graph.setNode(nodeId, {
              type: "CALL_ACTIVITY_ACTION",
              initialNodeId: getInitialNodeForCallActivityAction(nodeId),
            });
            for (var i = 0; i < successors.targets.length; i++) {
              graph.setEdge(
                nodeId,
                successors.targets[i],
                successors.labels[i]
              );
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
                destObjectType =
                  guidancemodel.getObjectTypeForObjectContextType(target.type);
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
       * Generate the JSON Representation of the meta-model for a new editor instance based on the current graph
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
                  ((target === node &&
                    (neighbor = source) instanceof EnumNode) ||
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
              if (
                node.getLabel().getValue().getValue() === "Model Attributes"
              ) {
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
                          .getAttribute(
                            neighbor.getEntityId() + "[containment]"
                          )
                          .getValue()
                          .getValue(),
                        customShape: neighbor
                          .getAttribute(
                            neighbor.getEntityId() + "[customShape]"
                          )
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
                        .getAttribute(
                          neighbor.getEntityId() + "[overlayRotate]"
                        )
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
        window.y.transact(() => {
          if (guidancemodel.isGuidanceEditor()) {
            dataMap.set("guidancemodel", data);
          } else if (!metamodel) {
            dataMap.set("metamodelpreview", this.generateMetaModel());
            dataMap.set("guidancemetamodel", this.generateGuidanceMetamodel());
            dataMap.set("model", data);
          } else {
            dataMap.set("model", data);
          }
        });
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
          relations[UniDirAssociationEdge.TYPE] =
            UniDirAssociationEdge.RELATIONS;
          relations[GeneralisationEdge.TYPE] = GeneralisationEdge.RELATIONS;
        }
      },
    };
  }
}

export const EntityManagerInstance = new EntityManager();
Object.freeze(EntityManagerInstance);

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
export function makeNode(type, $shape, anchors, attributes) {
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

      this.nodeSelector = getQuerySelectorFromNode(_$node);

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
              case "list":
                attrObj[attributeId] = new MultiValueAttribute(
                  id + "[" + attribute.key.toLowerCase() + "]",
                  attribute.key,
                  that
                );
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
      this.makeSource = () => {
        _$node.addClass("source");
        window.jsPlumbInstance.addEndpoint(_$node.get(0), {
          connectorPaintStyle: { fill: "black", strokeWidth: 4 },
          source: true,
          endpoint: {
            type: "Rectangle",
            options: {
              width: _$node.width() + 50,
              height: _$node.height() + 50,
            },
          },
          paintStyle: { fill: "transparent" },
          anchor: AnchorLocations.Center,
          deleteOnEmpty: true,
          uuid: id + "_eps1",
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
      this.makeTarget = () => {
        _$node.addClass("target");
        window.jsPlumbInstance.addEndpoint(_$node.get(0), {
          target: true,
          endpoint: {
            type: "Rectangle",
            options: {
              width: _$node.width() + 50,
              height: _$node.height() + 50,
            },
          },
          uuid: id + "_ept1",
          paintStyle: { fill: "transparent" },
          anchor: AnchorLocations.Center,
          uniqueEndpoint: false,
          //maxConnections:1,
          deleteOnEmpty: true,
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
        window.jsPlumbInstance.bind("beforeDrop", function (info) {
          var allConn = window.jsPlumbInstance.getConnections({
            target: info.targetId,
            source: info.sourceId,
          });
          var length = allConn.length;
          //if true => Detected a duplicated edge
          if (length > 0) return false; //don't create the edge
          else return true; //no duplicate create the edge
        });
      };

      /**
       * Unbind events for edge tool
       */
      this.unbindEdgeToolEvents = function () {
        try {
          _$node.removeClass("source target");
          jsPlumbInstance.getEndpoints(_$node.get(0)).forEach((endpoint) => {
            // We need to remove the endpoint that was created to enable node connection by dragging
            // since we are not using the edge tool anymore
            if (endpoint.connections.length === 0) {
              jsPlumbInstance.deleteEndpoint(endpoint);
            }
          });
        } catch (error) {
          console.error(error);
        }
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
            if (val.registerYType) {
              val.registerYType();
            }
          }
        }
      };
    }
    nodeSelector;
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
  constructor(id, left, top, width, height, zIndex, json, y) {
    super(id, ObjectNode.TYPE, left, top, width, height, zIndex, json, y);
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
        list: "Multiple Texts",
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
      return {
        addShape: {
          name: "Add Node Shape",
          callback: function () {
            var canvas = that.getCanvas(),
              appearance = that.getAppearance();

            //noinspection JSAccessibilityCheck
            const id = canvas.createNode(
              NodeShapeNode.TYPE,
              appearance.left + appearance.width + 50,
              appearance.top,
              150,
              100
            );
            canvas.createEdge(
              BiDirAssociationEdge.TYPE,
              that.getEntityId(),
              id
            );
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
                  RelationshipNode.TYPE,
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
                  RelationshipGroupNode.TYPE,
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
  static TYPE = "Abstract Class";
  static DEFAULT_WIDTH = 150;
  static DEFAULT_HEIGHT = 100;

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
        list: "Multiple Texts",
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
                  RelationshipNode.TYPE,
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
                  RelationshipGroupNode.TYPE,
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
    super(id, "Relationship", left, top, width, height, zIndex, json);
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
      return {
        addShape: {
          name: "Add Edge Shape",
          callback: function () {
            var canvas = that.getCanvas(),
              appearance = that.getAppearance();

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
                  RelationshipGroupNode.TYPE,
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

    this.registerYMap = function (map) {
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
 * makeEdge
 * @class canvas_widget.makeEdge
 * @memberof canvas_widget
 * @constructor
 * @param {string} type Type of edge
 * @param arrowType
 * @param shapeType
 * @param color
 * @param dashstyle
 * @param overlay
 * @param overlayPosition
 * @param overlayRotate
 * @param attributes
 * @returns {Edge}
 */
export function makeEdge(
  type,
  arrowType,
  shapeType,
  color,
  dashstyle,
  overlay,
  overlayPosition,
  overlayRotate,
  attributes
) {
  var shape = shapes.hasOwnProperty(shapeType)
    ? shapes[shapeType]
    : _.values(shapes)[0];
  color = color
    ? $colorTestElement.css("color", "#000000").css("color", color).css("color")
    : "#000000";

  dashstyle = dashstyle || "";

  /**
   * Edge
   * @class canvas_widget.Edge
   * @extends canvas_widget.AbstractEdge
   * @constructor
   * @param {string} id Entity identifier of edge
   * @param {canvas_widget.AbstractNode} source Source node
   * @param {canvas_widget.AbstractNode} target Target node
   */
  class Edge extends AbstractEdge {
    constructor(id, source, target) {
      super(id, type, source, target, overlayRotate);
      var that = this;

      var currentViewType = null;

      /**
       * Set the currently applied view type
       * @param {string} type
       */
      this.setCurrentViewType = function (type) {
        currentViewType = type;
      };

      /**
       * Get the currently applied view type
       * @returns {string} the view type
       */
      this.getCurrentViewType = function () {
        return currentViewType;
      };

      /**
       * Stores jsPlumb overlays for the edge
       * @type {Array}
       */
      var overlays = [];

      /**
       * make jsPlumb overlay
       * @param text
       * @returns {Function}
       */
      var makeOverlayFunction = function (text) {
        return function () {
          return $("<div></div>").append(
            $("<div></div>")
              .addClass("edge_label fixed")
              .css("color", color)
              .text(text)
          );
        };
      };

      /**
       * make a jsPlumb overlay for a attribute
       * @param attribute
       * @returns {Function}
       */
      var makeAttributeOverlayFunction = function (attribute) {
        return function () {
          const $node = $("<div></div>").append(
            $("<div></div>").addClass("edge_label").append(attribute.get$node())
          );
          return $node.get(0);
        };
      };
      var init = function () {
        var attribute, attributeId, attrObj;

        if (Arrows().hasOwnProperty(arrowType)) {
          overlays.push(Arrows(color)[arrowType]);
        }

        if (overlay) {
          switch (overlayPosition) {
            case "top":
              overlays.push({
                type: "Custom",
                options: {
                  create: makeOverlayFunction(overlay),
                  location: 0.9,
                  id: "label",
                },
              });
              break;
            case "bottom":
              overlays.push({
                type: "Custom",
                options: {
                  create: makeOverlayFunction(overlay),
                  location: 0.1,
                  id: "label",
                },
              });
              break;
            default:
            case "center":
              overlays.push({
                type: "Custom",
                options: {
                  create: makeOverlayFunction(overlay),
                  location: 0.5,
                  id: "label",
                },
              });
              break;
          }
        }

        attrObj = {};
        for (attributeId in attributes) {
          if (attributes.hasOwnProperty(attributeId)) {
            attribute = attributes[attributeId];
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

            switch (attribute.position) {
              case "top":
                overlays.push({
                  type: "Custom",
                  options: {
                    create: makeAttributeOverlayFunction(attrObj[attributeId]),
                    location: 1,
                    id: "label " + attributeId,
                  },
                });
                break;
              case "center":
                overlays.push({
                  type: "Custom",
                  options: {
                    create: makeAttributeOverlayFunction(attrObj[attributeId]),
                    location: 0.5,
                    id: "label " + attributeId,
                  },
                });
                break;
              case "bottom":
                overlays.push({
                  type: "Custom",
                  options: {
                    create: makeAttributeOverlayFunction(attrObj[attributeId]),
                    location: 0,
                    id: "label " + attributeId,
                  },
                });
                break;
            }
          }
        }
        that.setAttributes(attrObj);

        overlays.push({
          type: "Custom",
          options: {
            create: function () {
              that.get$overlay().find(".type").addClass(shapeType);
              return that.get$overlay().get(0);
            },
            location: 0.5,
            id: "label",
          },
        });

        if (overlay) {
          that
            .get$overlay()
            .find("input[name='Label']")
            .css("visibility", "hidden");
        }

        that.setDefaultPaintStyle({
          stroke: color,
          strokeWidth: 4,
        });
      };

      /**
       * Connect source and target node and draw the edge on canvas
       */
      this.connect = function () {
        var source = this.getSource();
        var target = this.getTarget();
        var connectOptions = {
          source: source.get$node().get(0),
          target: target.get$node().get(0),
          paintStyle: that.getDefaultPaintStyle(),
          endpoint: "Dot",
          anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
          connector: shape,
          overlays: overlays,
          cssClass: this.getEntityId(),
        };

        if (source === target) {
          connectOptions.anchors = ["TopCenter", "LeftMiddle"];
        }

        source.addOutgoingEdge(this);
        target.addIngoingEdge(this);
        this.setJsPlumbConnection(
          window.jsPlumbInstance.connect(connectOptions)
        );

        this.repaintOverlays();
        _.each(EntityManagerInstance.getEdges(), function (e) {
          e.setZIndex();
        });
      };

      /**
       * Get JSON representation of the edge
       * @returns {object}
       */
      this.toJSON = function () {
        var json = AbstractEdge.prototype.toJSON.call(this);
        json.type = type;
        return json;
      };

      /**
       * restyles the edge
       * @param arrowType
       * @param color
       * @param shapeType
       * @param dashstyle
       * @param overlay
       * @param overlayPosition
       * @param overlayRotate
       * @param attributes
       */
      this.restyle = function (
        arrowType,
        color,
        shapeType,
        dashstyle,
        overlay,
        overlayPosition,
        overlayRotate,
        attributes
      ) {
        overlays = [];

        color = color
          ? $colorTestElement
              .css("color", "black")
              .css("color", color)
              .css("color")
          : "black";

        if (Arrows().hasOwnProperty(arrowType)) {
          overlays.push(Arrows(color)[arrowType]);
        }

        if (overlay) {
          switch (overlayPosition) {
            case "top":
              overlays.push({
                type: "Custom",
                options: {
                  create: makeOverlayFunction(overlay),
                  location: 0.9,
                  id: "label",
                },
              });
              break;
            case "bottom":
              overlays.push({
                type: "Custom",
                options: {
                  create: makeOverlayFunction(overlay),
                  location: 0.1,
                  id: "label",
                },
              });
              break;
            default:
            case "center":
              overlays.push({
                type: "Custom",
                options: {
                  create: makeOverlayFunction(overlay),
                  location: 0.5,
                  id: "label",
                },
              });
              break;
          }
        }

        overlays.push({
          type: "Custom",
          options: {
            create: function () {
              that.get$overlay().find(".type").addClass(shapeType);
              return that.get$overlay().get(0);
            },
            location: 0.5,
            id: "label",
          },
        });

        if (overlay) {
          that
            .get$overlay()
            .find("input[name='Label']")
            .css("visibility", "hidden");
        }

        for (var attributeId in attributes) {
          if (attributes.hasOwnProperty(attributeId)) {
            var attribute = attributes[attributeId];
            switch (attribute.position) {
              case "top":
                overlays.push({
                  type: "Custom",
                  options: {
                    create: makeAttributeOverlayFunction(
                      that.getAttribute(attributeId)
                    ),
                    location: 1,
                    id: "label " + attributeId,
                  },
                });
                break;
              case "center":
                overlays.push({
                  type: "Custom",
                  options: {
                    create: makeAttributeOverlayFunction(
                      that.getAttribute(attributeId)
                    ),
                    location: 0.5,
                    id: "label " + attributeId,
                  },
                });
                break;
              case "bottom":
                overlays.push({
                  type: "Custom",
                  options: {
                    create: makeAttributeOverlayFunction(
                      that.getAttribute(attributeId)
                    ),
                    location: 0,
                    id: "label " + attributeId,
                  },
                });
                break;
            }
          }
        }

        var paintStyle = {
          strokeStyle: color,
          lineWidth: 2,
          dashstyle: dashstyle,
        };

        that.setDefaultPaintStyle(paintStyle);
        that.setRotateOverlay(overlayRotate);

        if (that.getJsPlumbConnection()) {
          //if the edge is drawn on the canvas
          that.getJsPlumbConnection().removeAllOverlays();
          for (var i = 0; i < overlays.length; i++) {
            that.getJsPlumbConnection().addOverlay(overlays[i]);
          }
          that.getJsPlumbConnection().setPaintStyle(paintStyle);
          that.repaintOverlays();
        }
      };

      this.registerYMap = function () {
        AbstractEdge.prototype.registerYMap.call(this);

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

      init();
    }
    /**
     * Get the arrow type of the edge type
     * @static
     * @returns {*}
     */
    static getArrowType() {
      return arrowType;
    }
    /**
     * Get the shape type of the edge type
     * @static
     * @returns {*}
     */
    static getShapeType() {
      return shapeType;
    }
    /**
     * Get the color of the edge type
     * @static
     * @returns {*}
     */
    static getShape() {
      return shape;
    }
    static getColor() {
      return color;
    }
    /**
     * Get the overlay of the edge type
     * @static
     * @returns {*}
     */
    static getOverlay() {
      return overlay;
    }
    /**
     * Get the overlay position of the edge type
     * @static
     * @returns {*}
     */
    static getOverlayPosition() {
      return overlayPosition;
    }
    /**
     * Get the overlay rotate of the edge type
     * @static
     * @returns {*}
     */
    static getOverlayRotate() {
      return overlayRotate;
    }
    /**
     * Get the attribute definition of the edge type
     * @static
     * @returns {*}
     */
    static getAttributes() {
      return attributes;
    }
    static getType() {
      return type;
    }
    static getArrowOverlays() {
      var overlays = [];
      if (Arrows().hasOwnProperty(arrowType)) {
        overlays.push(Arrows(color)[arrowType]);
      }
      return overlays;
    }
  }

  return Edge;
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
 * Abstract Class Node
 * @class canvas_widget.RelationshipGroupNode
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
export class RelationshipGroupNode extends AbstractNode {
  static TYPE = "Relation";
  static DEFAULT_WIDTH = 150;
  static DEFAULT_HEIGHT = 100;
  constructor(id, left, top, width, height, zIndex) {
    super(id, RelationshipGroupNode.TYPE, left, top, width, height, zIndex);
    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(
      _.template(relationshipGroupNodeHtml)({ type: that.getType() })
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
      json.type = RelationshipGroupNode.TYPE;
      return json;
    };

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
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
 * SelectionValue
 * @class canvas_widget.SelectionValue
 * @extends canvas_widget.AbstractValue
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 * @param {Object} options Selection options
 */
export class SelectionValue extends AbstractValue {
  constructor(
    id,
    name,
    subjectEntity,
    rootSubjectEntity,
    options,
    useAttributeHtml
  ) {
    super(id, name, subjectEntity, rootSubjectEntity);

    var that = this;

    useAttributeHtml =
      typeof useAttributeHtml !== "undefinded" ? useAttributeHtml : false;

    /**
     * Value
     * @type {string}
     * @private
     */
    var _value = _.keys(options)[0];

    if (useAttributeHtml) {
      selectionValueHtml = attributeSelectionValueHtml;
    }

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(
      _.template(selectionValueHtml)({
        name: name,
        options: options,
      })
    );

    if (useAttributeHtml) {
      _$node.off();
    }

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    y = y || window.y;
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

    /**
     * Apply a Value Change Operation
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var processValueChangeOperation = function (operation) {
      that.setValue(operation.getValue());
    };

    /**
     * Set value
     * @param {string} value
     */
    this.setValue = function (value) {
      _value = value;
      if (useAttributeHtml) {
        _$node.val(value);
        if (value == "Quiz") {
          Object.values(rootSubjectEntity.getAttributes()).forEach((value) => {
            if (value instanceof QuizAttribute) {
              value.showTable();
            }
          });
        } else
          Object.values(rootSubjectEntity.getAttributes()).forEach((value) => {
            if (value instanceof QuizAttribute) {
              value.hideTable();
            }
          });
      } else _$node.text(options[value]);
    };

    /**
     * Get value
     * @returns {string}
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * Get jQuery object of DOM node representing the value
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the edge
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractValue.prototype.toJSON.call(this);
      json.value = _value;
      return json;
    };

    /**
     * Set value by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      this.setValue(json.value);
    };

    this.registerYType = function () {
      //observer
      that
        .getRootSubjectEntity()
        .getYMap()
        .observeDeep(function ([event]) {
          const array = Array.from(event.changes.keys.entries());
          array.forEach(([key]) => {
            const updated = event.currentTarget.get(key);
            if (
              updated?.type !== "update" ||
              !(updated?.entityId === that.getEntityId())
            )
              return;
            var operation = new ValueChangeOperation(
              updated.entityId,
              updated.value,
              updated.type,
              updated.position,
              updated.jabberId
            );
            _iwcw.sendLocalOTOperation(
              CONFIG.WIDGET.NAME.GUIDANCE,
              operation.getOTOperation()
            );
            processValueChangeOperation(operation);

            //Only the local user Propagates the activity and saves the state of the model
            if (
              _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] ===
              operation.getJabberId()
            ) {
              const activityMap = y.getMap("activity");

              activityMap.set(
                ActivityOperation.TYPE,
                new ActivityOperation(
                  "ValueChangeActivity",
                  that.getEntityId(),
                  _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                  ValueChangeOperation.getOperationDescription(
                    that.getSubjectEntity().getName(),
                    that.getRootSubjectEntity().getType(),
                    that.getRootSubjectEntity().getLabel().getValue().getValue()
                  ),
                  {
                    value: operation.getValue(),
                    subjectEntityName: that.getSubjectEntity().getName(),
                    rootSubjectEntityType: that
                      .getRootSubjectEntity()
                      .getType(),
                    rootSubjectEntityId: that
                      .getRootSubjectEntity()
                      .getEntityId(),
                  }
                ).toJSON()
              );

              //its a view type and create a reference to the origin
              if (updated.entityId.indexOf("[target]") != -1) {
                ViewTypesUtil.createReferenceToOrigin(
                  that.getRootSubjectEntity()
                );
                //CVG
                import("./viewpoint/ClosedViewGeneration").then(function (CVG) {
                  CVG(rootSubjectEntity);
                });
              }
              //trigger the save
              EntityManagerInstance.storeDataYjs();
            } else {
              //the remote users propagtes the change to their local attribute widget
              //TODO(PENDING): can be replaced with yjs as well
              _iwcw.sendLocalOTOperation(
                CONFIG.WIDGET.NAME.ATTRIBUTE,
                operation.getOTOperation()
              );
            }
          });
        });
      window.onbeforeunload = () => {
        that.getRootSubjectEntity().getYMap().unobserveDeep();
      };
    };
  }
}

/**
 * IntegerAttribute
 * @class canvas_widget.IntegerAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
export class IntegerAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity, useAttributeHtml) {
    super(id, name, subjectEntity);
    useAttributeHtml =
      typeof useAttributeHtml !== "undefined" ? useAttributeHtml : false;

    /***
     * Value object of value
     * @type {canvas_widget.IntegerValue}
     * @private
     */
    var _value = new IntegerValue(
      id,
      name,
      this,
      this.getRootSubjectEntity(),
      useAttributeHtml
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(integerAttributeHtml)());

    /**
     * Set Value object of value
     * @param {canvas_widget.IntegerValue} value
     */
    this.setValue = function (value) {
      _value = value;
      _$node.val(value);
    };

    /**
     * Get Value object of value
     * @return {canvas_widget.IntegerValue} value
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.value = _value.toJSON();
      return json;
    };

    /**
     * Set attribute value by its JSON representation
     * @param {Object} json
     */
    this.setValueFromJSON = function (json) {
      _value.setValueFromJSON(json.value);
    };

    _$node.find(".name").text(this.getName());
    _$node.find(".value").append(_value.get$node());
  }
}

/**
 * SingleSelectionAttribute
 * @class canvas_widget.SingleSelectionAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options as key value object
 */

export class SingleSelectionAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity, options, useAttributeHtml) {
    super(id, name, subjectEntity);
    useAttributeHtml =
      typeof useAttributeHtml !== "undefinded" ? useAttributeHtml : false;
    var that = this;
    /***
     * Value object of value
     * @type {canvas_widget.SelectionValue}
     * @private
     */
    var _value = new SelectionValue(
      id,
      name,
      this,
      this.getRootSubjectEntity(),
      options,
      useAttributeHtml
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(singleSelectionAttributeHtml)());

    /**
     * Set Value object of value
     * @param {canvas_widget.SelectionValue} value
     */
    this.setValue = function (value) {
      _value = value;
      _$node.val(value);
    };

    /**
     * Get Value object of value
     * @return {canvas_widget.SelectionValue} value
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get the options object for the Attribute
     * @returns {Object}
     */
    this.getOptionValue = function () {
      return options.hasOwnProperty(_value.getValue())
        ? options[_value.getValue()]
        : null;
    };

    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.value = _value.toJSON();
      json.option = that.getOptionValue();
      return json;
    };

    this.getOptions = function () {
      return options;
    };

    /**
     * Set attribute value by its JSON representation
     * @param {Object} json
     */
    this.setValueFromJSON = function (json) {
      _value.setValueFromJSON(json.value);
    };

    _$node.find(".name").text(this.getName());
    _$node.find(".value").append(_value.get$node());
  }
}

/**
 * IntegerValue
 * @class canvas_widget.IntegerValue
 * @extends canvas_widget.AbstractValue
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 */
export class IntegerValue extends AbstractValue {
  constructor(id, name, subjectEntity, rootSubjectEntity, useAttributeHtml) {
    super(id, name, subjectEntity, rootSubjectEntity);
    var that = this;

    if (useAttributeHtml) integerValueHtml = attributeIntegerValueHtml;

    /**
     * Value
     * @type {number}
     * @private
     */
    var _value = 0;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(integerValueHtml)({ value: _value }));

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    y = y || window.y;
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

    /**
     * Apply a Value Change Operation
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var processValueChangeOperation = function (operation) {
      that.setValue(operation.getValue());
    };

    var init = function () {
      _$node.off();
    };

    /**
     * Set value
     * @param {number} value
     */
    this.setValue = function (value) {
      _value = value;
      if (useAttributeHtml) _$node.val(value);
      else _$node.text(value);
    };

    /**
     * Get value
     * @returns {number}
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * Get jQuery object of DOM node representing the value
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the edge
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractValue.prototype.toJSON.call(this);
      json.value = _value;
      return json;
    };

    /**
     * Set value by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      this.setValue(json?.value);
    };

    this.registerYType = function () {
      //observer
      that
        .getRootSubjectEntity()
        .getYMap()
        .observe(function (event) {
          const array = Array.from(event.changes.keys.entries());
          array.forEach(([key, change]) => {
            if (change.action !== "update") return;
            // check if key is the entity id
            if (key !== that.getEntityId()) return;
            const data = event.target.get(key);
            var operation = new ValueChangeOperation(
              data.entityId,
              data.value,
              data.type,
              data.position,
              data.jabberId
            );
            _iwcw.sendLocalOTOperation(
              CONFIG.WIDGET.NAME.GUIDANCE,
              operation.getOTOperation()
            );
            processValueChangeOperation(operation);

            //Only the local user Propagates the activity
            if (
              _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] ===
              operation.getJabberId()
            ) {
              EntityManagerInstance.storeDataYjs();
              const activityMap = y.getMap("activity");

              activityMap.set(
                ActivityOperation.TYPE,
                new ActivityOperation(
                  "ValueChangeActivity",
                  that.getEntityId(),
                  _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                  ValueChangeOperation.getOperationDescription(
                    that.getSubjectEntity().getName(),
                    that.getRootSubjectEntity().getType(),
                    that.getRootSubjectEntity().getLabel().getValue().getValue()
                  ),
                  {
                    value: operation.getValue(),
                    subjectEntityName: that.getSubjectEntity().getName(),
                    rootSubjectEntityType: that
                      .getRootSubjectEntity()
                      .getType(),
                    rootSubjectEntityId: that
                      .getRootSubjectEntity()
                      .getEntityId(),
                  }
                ).toJSON()
              );
            } else {
              //the remote users propagtes the change to their local attribute widget
              //TODO(PENDING): can be replaced with yjs as well
              _iwcw.sendLocalOTOperation(
                CONFIG.WIDGET.NAME.ATTRIBUTE,
                operation.getOTOperation()
              );
            }
          });
        });
      window.onbeforeunload = () => {
        that.getRootSubjectEntity().getYMap().unobserve();
      };
    };

    init();
  }
}

/**
 * SingleValueAttribute
 * @class canvas_widget.SingleValueAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
export class SingleValueAttribute extends AbstractAttribute {
  value;
  constructor(id, name, subjectEntity, y) {
    y = y || window.y;
    if (!y) {
      throw new Error("y is undefined");
    }
    super(id, name, subjectEntity);

    /***
     * Value object of value
     * @type {canvas_widget.Value}
     * @private
     */
    var _value = new Value(id, name, this, this.getRootSubjectEntity(), y);
    this.value = _value;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(canvasSingleValueAttributeHtml)());

    /**
     * Set Value object of value
     * @param {canvas_widget.Value} value
     */
    this.setValue = function (value) {
      _value = value;
      this.value = value;
    };

    /**
     * Get Value object of value
     * @returns {canvas_widget.Value}
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.value = _value.toJSON();
      return json;
    };

    /**
     * Set attribute value by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _value.setValueFromJSON(json.value);
    };

    this.registerYType = function () {
      _value.registerYType();
    };

    _$node.find(".name").text(this.getName());
    _$node.find(".value").append(_value.get$node());
  }
}

/**
 * SingleValueListAttribute
 * @class canvas_widget.SingleValueListAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
export class SingleValueListAttribute extends AbstractAttribute {
  static TYPE = "SingleValueListAttribute";
  constructor(id, name, subjectEntity) {
    super(id, name, subjectEntity);
    var that = this;

    /**
     * List of attributes
     * @type {Object}
     * @private
     */
    var _list = {};

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(singleValueListAttributeHtml)());
    y = y || window.y;
    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

    /**
     * Apply an Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var processAttributeAddOperation = function (operation) {
      var attribute = new SingleValueAttribute(
        operation.getEntityId() + "[value]",
        "Attribute",
        that
      );
      attribute.registerYType();
      that.addAttribute(attribute);
      _$node.find(".list").append(attribute.get$node());
    };

    /**
     * Apply an Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var processAttributeDeleteOperation = function (operation) {
      var attribute = that.getAttribute(operation.getEntityId());
      if (attribute) {
        that.deleteAttribute(attribute.getEntityId());
        attribute.get$node().remove();
      }
    };
    /**
     * Propagate an Attribute Add Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var propagateAttributeAddOperation = function (operation) {
      processAttributeAddOperation(operation);
      EntityManagerInstance.storeDataYjs();
    };

    /**
     * Propagate an Attribute Delete Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var propagateAttributeDeleteOperation = function (operation) {
      processAttributeDeleteOperation(operation);
      var ynode = that.getRootSubjectEntity().getYMap();
      ynode.delete(operation.getEntityId());
      EntityManagerInstance.storeDataYjs();
    };

    /**
     * Callback for a remote Attrbute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var remoteAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a remote Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var remoteAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeDeleteOperation(operation);
      }
    };

    var localAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a local Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var localAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeDeleteOperation(operation);
      }
    };

    /**
     * Add attribute to attribute list
     * @param {canvas_widget.AbstractAttribute} attribute
     */
    this.addAttribute = function (attribute) {
      var id = attribute.getEntityId();
      if (!_list.hasOwnProperty(id)) {
        _list[id] = attribute;
      }
    };

    /**
     * Get attribute of attribute list by its entity id
     * @param id
     * @returns {canvas_widget.AbstractAttribute}
     */
    this.getAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        return _list[id];
      }
      return null;
    };

    /**
     * Delete attribute from attribute list by its entity id
     * @param {string} id
     */
    this.deleteAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        delete _list[id];
      }
    };

    /**
     * Get attribute list
     * @returns {Object}
     */
    this.getAttributes = function () {
      return _list;
    };

    /**
     * Set attribute list
     * @param {Object} list
     */
    this.setAttributes = function (list) {
      _list = list;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute (list)
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the attribute (list)
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.type = SingleValueListAttribute.TYPE;
      var attr = {};
      _.forEach(this.getAttributes(), function (val, key) {
        attr[key] = val.toJSON();
      });
      json.list = attr;
      return json;
    };

    /**
     * Set attribute list by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _.forEach(json.list, function (val, key) {
        var attribute = new SingleValueAttribute(key, key, that, y);
        attribute.setValueFromJSON(json.list[key]);
        that.addAttribute(attribute);
        _$node.find(".list").append(attribute.get$node());
      });
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwcw.registerOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.registerOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwcw.unregisterOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.unregisterOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    _$node.find(".name").text(this.getName());

    for (var attributeId in _list) {
      if (_list.hasOwnProperty(attributeId)) {
        _$node.find(".list").append(_list[attributeId].get$node());
      }
    }

    if (_iwcw) {
      that.registerCallbacks();
    }
    this.registerYMap = function () {
      var ymap = that.getRootSubjectEntity().getYMap();

      var attrs = that.getAttributes();
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          var attr = attrs[key];
          attr.getValue().registerYType();
        }
      }

      ymap.observe(function (event) {
        var operation;

        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key, change]) => {
          if (key.indexOf("[value]") != -1) {
            switch (change.action) {
              case "add": {
                operation = new AttributeAddOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeAddCallback(operation);
                break;
              }
              case "delete": {
                operation = new AttributeDeleteOperation(
                  key,
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeDeleteCallback(operation);
              }
            }
          }
        });
      });
    };
  }
}

/**
 * Value
 * @class canvas_widget.Value
 * @extends canvas_widget.AbstractValue
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 */
export class Value extends AbstractValue {
  value;
  constructor(id, name, subjectEntity, rootSubjectEntity, y) {
    super(id, name, subjectEntity, rootSubjectEntity);
    this.value = "";
    y = y || window.y;
    if (!y) throw new Error("y is undefined");
    var _ytext = null;

    const yMap = rootSubjectEntity.getYMap();
    if (!yMap) {
      throw new Error("yMap is undefined");
    }

    var that = this;
    /**
     * Value
     * @type {string}
     * @private
     */
    var _value = "";
    this.value = _value;
    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(valueHtml)({ name: name }));

    /**
     * Set value
     * @param {string} value
     */
    this.setValue = function (value) {
      _value = value;
      _$node.text(value);
    };

    /**
     * Get value
     * @returns {string}
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * Get jQuery object of DOM node representing the value
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the edge
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractValue.prototype.toJSON.call(this);
      json.value = _value;
      return json;
    };

    /**
     * Set value by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      if (!json?.value) {
        return;
      }
      this.setValue(json?.value);
    };

    this.registerYType = function () {
      y.transact(() => {
        if (!yMap.has(id) || !(yMap.get(id) instanceof YText)) {
          _ytext = new YText(_value);
          yMap.set(id, _ytext);
        } else {
          _ytext = yMap.get(id);
        }
      });
      _ytext.observe(
        _.debounce(function (event) {
          _value = _ytext.toString().replace(/\n/g, "");
          that.setValue(_value);
          EntityManagerInstance.storeDataYjs();
          const userMap = y.getMap("users");
          const jabberId = userMap.get(event.currentTarget.doc.clientID);

          const activityMap = y.getMap("activity");
          activityMap.set(
            ActivityOperation.TYPE,
            new ActivityOperation(
              "ValueChangeActivity",
              that.getEntityId(),
              jabberId,
              ValueChangeOperation.getOperationDescription(
                that.getSubjectEntity().getName(),
                that.getRootSubjectEntity().getType(),
                that.getRootSubjectEntity().getLabel().getValue().getValue()
              ),
              {
                value: _value,
                subjectEntityName: that.getSubjectEntity().getName(),
                rootSubjectEntityType: that.getRootSubjectEntity().getType(),
                rootSubjectEntityId: that.getRootSubjectEntity().getEntityId(),
              }
            ).toJSON()
          );
        }, 500)
      );

      window.onbeforeunload = () => {
        _ytext.unobserve();
      };
    };

    this.getYText = function () {
      return _ytext;
    };

    //automatically determines the size of input
    _$node
      .autoGrowInput({
        comfortZone: 15,
        minWidth: 40,
        maxWidth: 1000,
      })
      .trigger("blur");
  }
}

/**
 * MultiValueAttribute
 * @memberof canvas_widget
 * @extends canvas_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
export class MultiValueAttribute extends AbstractAttribute {
  /***
   * Value object of value
   * @type {canvas_widget.MultiValue}
   * @private
   */
  _value = null;
  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  _$node = null;

  constructor(id, name, subjectEntity) {
    super(id, name, subjectEntity);

    this._value = new MultiValue(id, name, this, this.getRootSubjectEntity());

    this._$node = $(_.template(multiValueAttributeHtml)({ id: id }));

    this._$node.find(".name").text(this.getName());

    this._$node.find(".value").append(this._value.get$node());

    // check if view only mode is enabled for the property browser
    // because then the input fields should be disabled
    if (window.hasOwnProperty("y")) {
      const widgetConfigMap = y.getMap("widgetConfig");
      if (widgetConfigMap.get("view_only_property_browser")) {
        this._$node.find(".val").attr("disabled", "true");
      }
    }
  }

  /**
   * Set Value object of value
   * @param {canvas_widget.Value} value
   */
  setValue(value) {
    this._value = value;
  }

  /**
   * Get Value object of value
   * @returns {canvas_widget.Value}
   */
  getValue() {
    return this._value;
  }

  /**
   * jQuery object of DOM node representing the attribute
   * @type {jQuery}
   * @public
   */
  get$node() {
    return this._$node;
  }

  /**
   * Set attribute value by its JSON representation
   * @param json
   */
  setValueFromJSON(json) {
    this._value.setValueFromJSON(json?.value);
  }

  /**
   * Get attribute value as JSON
   */
  toJSON() {
    const json = AbstractAttribute.prototype.toJSON.call(this);
    json.value = this._value.toJSON();
    return json;
  }
  registerYType() {
    _value.registerYType();
  }
}

/**
 * QuizAttribute
 * @class attribute_widget.SingleValueAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
export class QuizAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity) {
    super(id, name, subjectEntity);
    /***
     * Value object of value
     * @type {attribute_widget.Value}
     * @private
     */
    var _value = new Value(id, name, this, this.getRootSubjectEntity());

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(singleQuizAttributeHtml)({ id: id }));

    /**
     * Set Value object of value
     * @param {attribute_widget.Value} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    /**
     * Get Value object of value
     * @returns {attribute_widget.Value}
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @public
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.value = _value.toJSON();
      return json;
    };

    /**
     * Set attribute value by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _value.setValueFromJSON(json.value);
    };

    this.registerYType = function () {
      _value.registerYType();
    };

    _$node.find(".name").text(this.getName());
    _$node.find(".value").append(_value.get$node());

    function addRow() {
      var table = _$node.find("#table")[0];
      var rows = table.rows.length;
      var row = table.insertRow(table.rows.length);
      var cell0 = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      var cell3 = row.insertCell(3);
      var input0 = document.createElement("input");
      var input1 = document.createElement("input");
      var input2 = document.createElement("input");
      var input3 = document.createElement("input");
      input0.id = rows + "0";
      input1.id = rows + "1";
      input2.id = rows + "2";
      input3.id = rows + "3";
      input1.type = "text";
      input2.type = "text";
      input3.type = "text";
      cell0.appendChild(input0);
      cell1.appendChild(input1);
      cell2.appendChild(input2);
      cell3.appendChild(input3);
    }

    this.showTable = function () {
      _$node.find("#table")[0].style.visibility = "visible";
      _$node.find("#b")[0].style.visibility = "visible";
      _$node.find("#c")[0].style.visibility = "visible";
      _$node.find("#submit")[0].style.visibility = "visible";
      _$node.find("#display")[0].style.visibility = "visible";
    };

    this.hideTable = function () {
      _$node.find("#table")[0].style.visibility = "hidden";
      _$node.find("#b")[0].style.visibility = "hidden";
      _$node.find("#c")[0].style.visibility = "hidden";
      _$node.find("#submit")[0].style.visibility = "hidden";
      _$node.find("#display")[0].style.visibility = "hidden";
    };

    _$node.find("#b").click(function () {
      addRow();
    });

    // remove rows from table
    _$node.find("#c").click(function () {
      var table = _$node.find("#table")[0];
      var rows = table.rows.length;
      table.deleteRow(rows - 1);
    });

    // write table input into attribute field
    _$node.find("#submit").click(function () {
      var table = _$node.find("#table")[0];
      var Json = {};
      Json["topic"] = _$node.find("#topic")[0].value;
      var Sequence = [];
      var Questions = [];
      var Intents = [];
      var Hints = [];
      var row = table.rows.length;
      for (var i = 2; i < row; i++) {
        if (
          _$node.find("#" + i.toString() + "1")[0].value == "" ||
          _$node.find("#" + i.toString() + "2")[0].value == ""
        ) {
          continue;
        }
        Sequence.push(_$node.find("#" + i.toString() + "0")[0].value);
        Questions.push(_$node.find("#" + i.toString() + "1")[0].value);
        Intents.push(_$node.find("#" + i.toString() + "2")[0].value);
        if (_$node.find("#" + i.toString() + "3")[0].value == "") {
          Hints.push("No Hint Available for this Question");
        } else Hints.push(_$node.find("#" + i.toString() + "3")[0].value);
      }
      Json["Questions"] = Questions;
      Json["Sequence"] = Sequence;
      Json["Intents"] = Intents;
      Json["Hints"] = Hints;
      _$node.find(".val")[0].value = JSON.stringify(Json);
      var field = _$node.find(".val")[0];
      field.dispatchEvent(new Event("input"));
    });

    // take content from attribute field and display as table
    _$node.find("#display").click(function () {
      var table = _$node.find("#table")[0];
      var Json = _$node.find(".val")[0].value;

      var content = JSON.parse(Json);
      _$node.find("#topic")[0].value = content.topic;
      var rowNumb = content.Questions.length;

      var currRows = table.rows.length - 2;

      if (currRows < rowNumb) {
        for (currRows; currRows < rowNumb; currRows++) {
          addRow();
        }
      }
      for (var i = 2; i < rowNumb + 2; i++) {
        if (_$node.find("#" + i.toString() + "0")[0].value == null) {
          break;
        }
        _$node.find("#" + i.toString() + "0")[0].value =
          content.Sequence[i - 2];
        _$node.find("#" + i.toString() + "1")[0].value =
          content.Questions[i - 2];
        _$node.find("#" + i.toString() + "2")[0].value = content.Intents[i - 2];
        _$node.find("#" + i.toString() + "3")[0].value = content.Hints[i - 2];
      }
    });
  }
}

/**
 * KeySelectionValueAttribute
 * @class canvas_widget.KeySelectionValueAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 */
export class KeySelectionValueAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity, options) {
    super(id, name, subjectEntity);

    var _ymap = null;

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    /**
     * Value object of key
     * @type {canvas_widget.Value}
     * @private
     */
    var _key = new Value(id + "[key]", "", this, this.getRootSubjectEntity());

    /***
     * Value object of value
     * @type {canvas_widget.Value}
     * @private
     */
    var _value = new SelectionValue(
      id + "[value]",
      "",
      this,
      this.getRootSubjectEntity(),
      _options
    );

    /**
     * jQuery object of the DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(keySelectionValueAttributeHtml)({ id: id }));

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set Value object of key
     * @param {canvas_widget.Value} key
     */
    this.setKey = function (key) {
      _key = key;
    };

    /**
     * Get Value object of key
     * @returns {canvas_widget.Value}
     */
    this.getKey = function () {
      return _key;
    };

    /**
     * Set Value object of value
     * @param {canvas_widget.Value} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    /**
     * Get Value object of value
     * @returns {canvas_widget.Value}
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.key = _key.toJSON();
      json.value = _value.toJSON();
      return json;
    };

    /**
     * Set value of key and value by their JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _key.setValueFromJSON(json.key);
      _value.setValueFromJSON(json.value);
    };

    this.registerYMap = function () {
      _key.registerYType();
      _value.registerYType();
    };

    this.getYMap = function () {
      return _ymap;
    };

    _$node.find(".key").append(_key.get$node());
    _$node.find(".value").append(_value.get$node());
  }
}

/**
 * ConditionListAttribute
 * @class canvas_widget.ConditionListAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @param {Object} options2 Selection options
 */
export class ConditionListAttribute extends AbstractAttribute {
  static TYPE = "ConditionListAttribute";
  constructor(id, name, subjectEntity, options, options2, y) {
    y = y || window.y;
    super(id, name, subjectEntity);
    var that = this;

    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options2 = options2;

    /**
     * List of attributes
     * @type {Object}
     * @private
     */
    var _list = {};

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(listHtml)());

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

    /**
     * Apply an Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     * @param {YText} ytext
     */
    var processAttributeAddOperation = function (operation) {
      var attribute = new ConditionPredicateAttribute(
        operation.getEntityId(),
        "Attribute",
        that,
        _options,
        _options2
      );
      attribute.registerYMap();
      that.addAttribute(attribute);
      _$node.find(".list").append(attribute.get$node());
    };

    /**
     * Propagate an Attribute Add Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var propagateAttributeAddOperation = function (operation) {
      processAttributeAddOperation(operation);
      EntityManagerInstance.storeDataYjs();
    };

    /**
     * Apply an Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var processAttributeDeleteOperation = function (operation) {
      var attribute = that.getAttribute(operation.getEntityId());
      if (attribute) {
        that.deleteAttribute(attribute.getEntityId());
        attribute.get$node().remove();
      }
      EntityManagerInstance.storeDataYjs();
    };

    /**
     * Propagate an Attribute Delete Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var propagateAttributeDeleteOperation = function (operation) {
      processAttributeDeleteOperation(operation);
      var ymap = that.getRootSubjectEntity().getYMap();
      ymap.delete(operation.getEntityId() + "[val]");
    };

    /**
     * Callback for a remote Attrbute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var remoteAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a remote Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var remoteAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeDeleteOperation(operation);
      }
    };

    /**
     * Callback for a local Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var localAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a local Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var localAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeDeleteOperation(operation);
      }
    };

    /**
     * Add attribute to attribute list
     * @param {canvas_widget.AbstractAttribute} attribute
     */
    this.addAttribute = function (attribute) {
      var id = attribute.getEntityId();
      if (!_list.hasOwnProperty(id)) {
        _list[id] = attribute;
      }
    };

    /**
     * Get attribute of attribute list by its entity id
     * @param id
     * @returns {canvas_widget.AbstractAttribute}
     */
    this.getAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        return _list[id];
      }
      return null;
    };

    /**
     * Delete attribute from attribute list by its entity id
     * @param {string} id
     */
    this.deleteAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        delete _list[id];
      }
    };

    /**
     * Get attribute list
     * @returns {Object}
     */
    this.getAttributes = function () {
      return _list;
    };

    /**
     * Set attribute list
     * @param {Object} list
     */
    this.setAttributes = function (list) {
      _list = list;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute (list)
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    this.setOptions = function (options) {
      _options = options;
    };

    /**
     * Get JSON representation of the attribute (list)
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.type = ConditionListAttribute.TYPE;
      var attr = {};
      _.forEach(this.getAttributes(), function (val, key) {
        attr[key] = val.toJSON();
      });
      json.list = attr;
      return json;
    };

    /**
     * Set attribute list by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _.forEach(json.list, function (val, key) {
        var attribute = new ConditionPredicateAttribute(
          key,
          key,
          that,
          _options,
          _options2
        );
        attribute.setValueFromJSON(json.list[key]);
        that.addAttribute(attribute);
        _$node.find(".list").append(attribute.get$node());
      });
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwcw.registerOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.registerOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwcw.unregisterOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.unregisterOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    _$node.find(".name").text(this.getName());

    for (var attributeId in _list) {
      if (_list.hasOwnProperty(attributeId)) {
        _$node.find(".list").append(_list[attributeId].get$node());
      }
    }

    this.registerYMap = function () {
      var ymap = that.getRootSubjectEntity().getYMap();
      var attrs = that.getAttributes();
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          attrs[key].registerYMap();
        }
      }

      ymap.observe(function (event) {
        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key, change]) => {
          if (key.indexOf("[value]") != -1) {
            var operation;
            switch (change.action) {
              case "add": {
                if (eventWasTriggeredByMe(event)) return;
                const jabberId = event.currentTarget.get("jabberId");
                if (jabberId === _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID])
                  return;
                operation = new AttributeAddOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeAddCallback(operation);

                break;
              }
              case "delete": {
                operation = new AttributeDeleteOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeDeleteCallback(operation);
                break;
              }
            }
          } else if (key.indexOf("updateConditionOption") != -1) {
            that.setOptions(event.value);
          }
        });
      });
    };

    if (_iwcw) {
      that.registerCallbacks();
    }
  }
}

/**
 * RenamingAttribute
 * @class canvas_widget.ConditionPredicateAttribute
 * @memberof canvas_widget
 * @extends canvas_widget.AbstractAttribute
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @constructor
 */
export class RenamingAttribute extends AbstractAttribute {
  static TYPE = "RenamingAttribute";
  constructor(id, name, subjectEntity, options) {
    super(id, name, subjectEntity);

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    /**
     * Value object of key
     * @type {canvas_widget.Value}
     * @private
     */
    var _key = new Value(
      id + "[val]",
      "Attribute Name",
      this,
      this.getRootSubjectEntity()
    );

    /***
     * Value object of ref
     * @type {canvas_widget.Value}
     * @private
     */
    var _ref = new Value(
      id + "[ref]",
      "Attribute Reference",
      this,
      this.getRootSubjectEntity()
    );

    /***
     * Value object of vis
     * @type {canvas_widget.Value}
     * @private
     */
    var _vis = new SelectionValue(
      id + "[vis]",
      "Attribute Visibility",
      this,
      this.getRootSubjectEntity(),
      _options
    );

    /**
     * jQuery object of the DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(renamingAttrHTML)());

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set Value object of key
     * @param {canvas_widget.Value} key
     */
    this.setKey = function (key) {
      _key = key;
    };

    /**
     * Get Value object of key
     * @returns {canvas_widget.Value}
     */
    this.getKey = function () {
      return _key;
    };

    /**
     * Get Value object of value
     * @returns {canvas_widget.Value}
     */
    this.getRef = function () {
      return _ref;
    };

    /**
     * Get Visibility object of value
     * @returns {canvas_widget.Value}
     */
    this.getVis = function () {
      return _vis;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set Value object of value
     * @param {canvas_widget.Value} value
     */
    this.setVis = function (value) {
      _vis = value;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Set value of key and value by their JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _key.setValueFromJSON(json.val);
      _ref.setValueFromJSON(json.ref);
      _vis.setValueFromJSON(json.vis || { value: "" });
    };

    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.val = _key.toJSON();
      json.ref = _ref.toJSON();
      json.vis = _vis.toJSON();
      return json;
    };
    _$node.find(".val").append(_key.get$node());
    _$node.find(".ref").append(_ref.get$node()).hide();
    _$node.find(".vis").append(_vis.get$node());

    this.registerYMap = function () {
      _key.registerYType();
      _ref.registerYType();
      _vis.registerYType();
    };
  }
}

/**
 * KeySelectionValueSelectionValueListAttribute
 * @class canvas_widget.KeySelectionValueSelectionValueListAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @param {Object} options2 Selection options
 */
export class KeySelectionValueSelectionValueListAttribute extends AbstractAttribute {
  static TYPE = "KeySelectionValueSelectionValueListAttribute";

  constructor(id, name, subjectEntity, options, options2) {
    super(id, name, subjectEntity);
    var that = this;

    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options2 = options2;

    /**
     * List of attributes
     * @type {Object}
     * @private
     */
    var _list = {};

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(
      _.template(keySelectionValueSelectionValueListAttributeHtml)()
    );

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    y = y || window.y;
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

    /**
     * Apply an Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var processAttributeAddOperation = function (operation) {
      var attribute = new KeySelectionValueSelectionValueAttribute(
        operation.getEntityId(),
        "Attribute",
        that,
        _options,
        _options2
      );
      attribute.registerYType();
      that.addAttribute(attribute);
      if (_$node.find(".list").find("#" + attribute.getEntityId()).length == 0)
        _$node.find(".list").append(attribute.get$node());
      EntityManagerInstance.storeDataYjs();
    };

    /**
     * Apply an Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var processAttributeDeleteOperation = function (operation) {
      var attribute = that.getAttribute(operation.getEntityId());
      if (attribute) {
        that.deleteAttribute(attribute.getEntityId());
        attribute.get$node().remove();
      }
      EntityManagerInstance.storeDataYjs();
    };

    /**
     * Propagate an Attribute Add Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var propagateAttributeAddOperation = function (operation) {
      processAttributeAddOperation(operation);
    };

    /**
     * Propagate an Attribute Delete Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var propagateAttributeDeleteOperation = function (operation) {
      processAttributeDeleteOperation(operation);
      var ynode = that.getRootSubjectEntity().getYMap();
      ynode.delete(operation.getEntityId() + "[key]");
    };

    /**
     * Callback for a remote Attrbute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var remoteAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a remote Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var remoteAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.ATTRIBUTE,
          operation.getOTOperation()
        );
        processAttributeDeleteOperation(operation);
      }
    };

    var localAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a local Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var localAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeDeleteOperation(operation);
      }
    };

    /**
     * Add attribute to attribute list
     * @param {canvas_widget.AbstractAttribute} attribute
     */
    this.addAttribute = function (attribute) {
      var id = attribute.getEntityId();
      if (!_list.hasOwnProperty(id)) {
        _list[id] = attribute;
      }
    };

    /**
     * Get attribute of attribute list by its entity id
     * @param id
     * @returns {canvas_widget.AbstractAttribute}
     */
    this.getAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        return _list[id];
      }
      return null;
    };

    /**
     * Delete attribute from attribute list by its entity id
     * @param {string} id
     */
    this.deleteAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        delete _list[id];
      }
    };

    /**
     * Get attribute list
     * @returns {Object}
     */
    this.getAttributes = function () {
      return _list;
    };

    /**
     * Set attribute list
     * @param {Object} list
     */
    this.setAttributes = function (list) {
      _list = list;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute (list)
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the attribute (list)
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.type = KeySelectionValueSelectionValueListAttribute.TYPE;
      var attr = {};
      _.forEach(this.getAttributes(), function (val, key) {
        attr[key] = val.toJSON();
      });
      json.list = attr;
      return json;
    };

    /**
     * Set attribute list by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _.forEach(json.list, function (val, key) {
        var attribute = new KeySelectionValueSelectionValueAttribute(
          key,
          key,
          that,
          _options,
          _options2
        );
        attribute.setValueFromJSON(json.list[key]);
        that.addAttribute(attribute);
        if (
          _$node.find(".list").find("#" + attribute.getEntityId()).length == 0
        )
          _$node.find(".list").append(attribute.get$node());
      });
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwcw.registerOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.registerOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwcw.unregisterOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.unregisterOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    _$node.find(".name").text(this.getName());

    for (var attributeId in _list) {
      if (_list.hasOwnProperty(attributeId)) {
        _$node.find(".list").append(_list[attributeId].get$node());
      }
    }

    if (_iwcw) {
      that.registerCallbacks();
    }

    this.registerYMap = function () {
      var ymap = that.getRootSubjectEntity().getYMap();
      var attrs = that.getAttributes();
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          var attr = attrs[key];
          attr.registerYType();
        }
      }

      ymap.observe(function (event) {
        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key, change]) => {
          if (key.indexOf("[key]") != -1) {
            var operation;
            switch (change.action) {
              case "add": {
                const jabberId = event.currentTarget.get("jabberId");
                if (jabberId === _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID])
                  return;
                operation = new AttributeAddOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeAddCallback(operation);
                break;
              }
              case "delete": {
                operation = new AttributeDeleteOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeDeleteCallback(operation);
                break;
              }
            }
          }
        });
      });
    };
  }
}

/**
 * RenamingListAttribute
 * @class canvas_widget.RenamingListAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 */
export class RenamingListAttribute extends AbstractAttribute {
  static TYPE = "RenamingListAttribute";
  constructor(id, name, subjectEntity, options, y) {
    y = y || window.y;
    super(id, name, subjectEntity);
    var that = this;

    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    /**
     * List of attributes
     * @type {Object}
     * @private
     */
    var _list = {};

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(listHtml)());

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

    /**
     * Apply an Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     * @param { YText} ytext
     */
    var processAttributeAddOperation = function (operation) {
      var attribute = new RenamingAttribute(
        operation.getEntityId(),
        "Attribute",
        that,
        _options
      );
      that.addAttribute(attribute);
      attribute.registerYMap();
      _$node.find(".list").append(attribute.get$node());
      EntityManagerInstance.storeDataYjs();
      return attribute;
    };

    /**
     * Propagate an Attribute Add Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeAddOperation} operation
     */
    this.propagateAttributeAddOperation = function (operation) {
      return processAttributeAddOperation(operation);
    };

    /**
     * Apply an Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var processAttributeDeleteOperation = function (operation) {
      var attribute = that.getAttribute(operation.getEntityId());
      if (attribute) {
        that.deleteAttribute(attribute.getEntityId());
        attribute.get$node().remove();
      }
    };

    /**
     * Propagate an Attribute Delete Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var propagateAttributeDeleteOperation = function (operation) {
      processAttributeDeleteOperation(operation);
      var ymap = that.getRootSubjectEntity().getYMap();
      ymap.delete(operation.getEntityId() + "[val]");
      EntityManagerInstance.storeDataYjs();
    };

    /**
     * Callback for a remote Attrbute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var remoteAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeAddOperation(operation);
        subjectEntity.showAttributes();
      }
    };

    /**
     * Callback for a remote Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var remoteAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeDeleteOperation(operation);
      }
    };

    /**
     * Callback for a local Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var localAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a local Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var localAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeDeleteOperation(operation);
      }
    };

    /**
     * Add attribute to attribute list
     * @param {canvas_widget.AbstractAttribute} attribute
     */
    this.addAttribute = function (attribute) {
      var id = attribute.getEntityId();
      if (!_list.hasOwnProperty(id)) {
        _list[id] = attribute;
      }
    };

    /**
     * Get attribute of attribute list by its entity id
     * @param id
     * @returns {canvas_widget.AbstractAttribute}
     */
    this.getAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        return _list[id];
      }
      return null;
    };

    /**
     * Delete attribute from attribute list by its entity id
     * @param {string} id
     */
    this.deleteAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        delete _list[id];
      }
    };

    /**
     * Get attribute list
     * @returns {Object}
     */
    this.getAttributes = function () {
      return _list;
    };

    /**
     * Set attribute list
     * @param {Object} list
     */
    this.setAttributes = function (list) {
      _list = list;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute (list)
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    this.setOptions = function (options) {
      _options = options;
    };

    /**
     * Get JSON representation of the attribute (list)
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.type = RenamingListAttribute.TYPE;
      var attr = {};
      _.forEach(this.getAttributes(), function (val, key) {
        attr[key] = val.toJSON();
      });
      json.list = attr;
      return json;
    };

    /**
     * Set attribute list by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _.forEach(json.list, function (val, key) {
        var attribute = new RenamingAttribute(key, key, that, _options);
        attribute.setValueFromJSON(json.list[key]);
        that.addAttribute(attribute);
        _$node.find(".list").append(attribute.get$node());
      });
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwcw.registerOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.registerOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwcw.unregisterOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.unregisterOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    _$node.find(".name").text(this.getName());

    for (var attributeId in _list) {
      if (_list.hasOwnProperty(attributeId)) {
        _$node.find(".list").append(_list[attributeId].get$node());
      }
    }

    if (_iwcw) {
      that.registerCallbacks();
    }
    this.registerYMap = function () {
      var ymap = that.getRootSubjectEntity().getYMap();
      var attrs = that.getAttributes();
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          var attr = attrs[key];
          attr.registerYMap();
        }
      }

      ymap.observe(function (event) {
        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key, change]) => {
          if (key.indexOf("[val]") != -1) {
            switch (change.action) {
              case "add": {
                //  var yUserId = event.object.map[key][0];
                //  if (yUserId === y.clientID) return;
                const operation = new AttributeAddOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeAddCallback(operation);

                break;
              }
              case "delete": {
                const operation = new AttributeDeleteOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeDeleteCallback(operation);
                break;
              }
            }
          }
        });
      });
    };
  }
}

/**
 * ConditionPredicateAttribute
 * @class attribute_widget.ConditionPredicateAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @param {Object} options2 Selection options
 * @constructor
 */
export class ConditionPredicateAttribute extends AbstractAttribute {
  static TYPE = "ConditionPredicateAttribute";
  constructor(id, name, subjectEntity, options, options2) {
    super(id, name, subjectEntity);

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options2 = options2;

    //var _options3 = options3;
    /**
     * Value object of key
     * @type {attribute_widget.Value}
     * @private
     */
    var _key = new Value(
      id + "[value]",
      "Attribute Value",
      this,
      this.getRootSubjectEntity()
    );

    /***
     * Value object of value
     * @type {attribute_widget.Value}
     * @private
     */
    var _value = new SelectionValue(
      id + "[property]",
      "Attribute Name",
      this,
      this.getRootSubjectEntity(),
      _options
    );

    /***
     * Value object of value
     * @type {attribute_widget.Value}
     * @private
     */
    var _value2 = new SelectionValue(
      id + "[operator]",
      "Logical Operator",
      this,
      this.getRootSubjectEntity(),
      _options2
    );

    /**
     * jQuery object of the DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(condition_predicateHtml)());

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set Value object of key
     * @param {attribute_widget.Value} key
     */
    this.setKey = function (key) {
      _key = key;
    };

    /**
     * Get Value object of key
     * @returns {attribute_widget.Value}
     */
    this.getKey = function () {
      return _key;
    };

    /**
     * Set Value object of value
     * @param {attribute_widget.Value} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    /**
     * Get Value object of value
     * @returns {attribute_widget.Value}
     */
    this.getValue = function () {
      return _value;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set Value object of value
     * @param {attribute_widget.Value} value
     */
    this.setValue2 = function (value) {
      _value2 = value;
    };

    /**
     * Get Value object of value
     * @returns {attribute_widget.Value}
     */
    this.getValue2 = function () {
      return _value2;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Set value of key and value by their JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _key.setValueFromJSON(json.val);
      _value.setValueFromJSON(json.property);
      _value2.setValueFromJSON(json.operator || { value: "" });
    };
    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.val = _key.toJSON();
      json.property = _value.toJSON();
      json.operator = _value2.toJSON();
      return json;
    };
    _$node.find(".val").append(_key.get$node());
    _$node.find(".property").append(_value.get$node());
    _$node.find(".operator").append(_value2.get$node());
    //_$node.find(".operator2").append(_value3.get$node());
    this.registerYMap = function () {
      _key.registerYType();
      _value.registerYType();
      _value2.registerYType();
    };
  }
}

/**
 * SingleColorValueAttribute
 * @class canvas_widget.SingleColorValueAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
export class SingleColorValueAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity) {
    super(id, name, subjectEntity);

    /***
     * Value object of value
     * @type {canvas_widget.Value}
     * @private
     */
    var _value = new Value(id, name, this, this.getRootSubjectEntity());

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(singleColorValueAttributeHtml)());

    /**
     * Set Value object of value
     * @param {canvas_widget.Value} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    /**
     * Get Value object of value
     * @returns {canvas_widget.Value}
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.value = _value.toJSON();
      return json;
    };

    /**
     * Set attribute value by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _value.setValueFromJSON(json.value);
    };

    _$node.find(".name").text(this.getName());
    _$node.find(".value").append(_value.get$node());
  }
}

/**
 * KeySelectionValueSelectionValueAttribute
 * @class canvas_widget.KeySelectionValueSelectionValueAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @param {Object} options2 Selection options
 */
export class KeySelectionValueSelectionValueAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity, options, options2) {
    super(id, name, subjectEntity);

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options2 = options2;

    /**
     * Value object of key
     * @type {canvas_widget.Value}
     * @private
     */
    var _key = new Value(id + "[key]", "", this, this.getRootSubjectEntity());

    /***
     * Value object of value
     * @type {canvas_widget.Value}
     * @private
     */
    var _value = new SelectionValue(
      id + "[value]",
      "",
      this,
      this.getRootSubjectEntity(),
      _options
    );

    /***
     * Value object of value
     * @type {canvas_widget.Value}
     * @private
     */
    var _value2 = new SelectionValue(
      id + "[value2]",
      "",
      this,
      this.getRootSubjectEntity(),
      _options2
    );

    /**
     * jQuery object of the DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(
      _.template(keySelectionValueSelectionValueAttributeHtml)({ id: id })
    );

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set Value object of key
     * @param {canvas_widget.Value} key
     */
    this.setKey = function (key) {
      _key = key;
    };

    /**
     * Get Value object of key
     * @returns {canvas_widget.Value}
     */
    this.getKey = function () {
      return _key;
    };

    /**
     * Set Value object of value
     * @param {canvas_widget.Value} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    /**
     * Get Value object of value
     * @returns {canvas_widget.Value}
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * Set Value object of value
     * @param {canvas_widget.Value} value
     */
    this.setValue2 = function (value) {
      _value2 = value;
    };

    /**
     * Get Value object of value
     * @returns {canvas_widget.Value}
     */
    this.getValue2 = function () {
      return _value2;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.key = _key.toJSON();
      json.value = _value.toJSON();
      json.value2 = _value2.toJSON();
      return json;
    };

    /**
     * Set value of key and value by their JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _key.setValueFromJSON(json.key);
      _value.setValueFromJSON(json.value);
      _value2.setValueFromJSON(json.value2 || { value: "" });
    };

    this.registerYType = function () {
      _key.registerYType();
      _value.registerYType();
      _value2.registerYType();
    };

    _$node.find(".key").append(_key.get$node());
    _$node.find(".value").append(_value.get$node());
  }
}

/**
 * KeySelectionValueListAttribute
 * @class canvas_widget.KeySelectionValueListAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 */
export class KeySelectionValueListAttribute extends AbstractAttribute {
  static TYPE = "KeySelectionValueListAttribute";
  constructor(id, name, subjectEntity, options) {
    super(id, name, subjectEntity);
    var that = this;

    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    /**
     * List of attributes
     * @type {Object}
     * @private
     */
    var _list = {};

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(keySelectionValueListAttributeHtml)());

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    y = y || window.y;
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

    /**
     * Apply an Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var processAttributeAddOperation = function (operation) {
      var attribute = new KeySelectionValueAttribute(
        operation.getEntityId(),
        "Attribute",
        that,
        _options
      );
      attribute.registerYMap();
      that.addAttribute(attribute);
      if (_$node.find(".list").find("#" + attribute.getEntityId()).length == 0)
        _$node.find(".list").append(attribute.get$node());
    };

    /**
     * Apply an Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var processAttributeDeleteOperation = function (operation) {
      var attribute = that.getAttribute(operation.getEntityId());
      if (attribute) {
        that.deleteAttribute(attribute.getEntityId());
        attribute.get$node().remove();
      }
    };

    /**
     * Propagate an Attribute Add Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var propagateAttributeAddOperation = function (operation) {
      processAttributeAddOperation(operation);
      EntityManagerInstance.storeDataYjs();
    };

    /**
     * Propagate an Attribute Delete Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var propagateAttributeDeleteOperation = function (operation) {
      processAttributeDeleteOperation(operation);
      var ymap = that.getRootSubjectEntity().getYMap();
      ymap.delete(operation.getEntityId() + "[key]");
      EntityManagerInstance.storeDataYjs();
    };

    /**
     * Callback for a remote Attrbute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var remoteAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a remote Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var remoteAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeDeleteOperation(operation);
      }
    };

    var localAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeAddOperation(operation);
      }
    };
    /**
     * Callback for a local Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var localAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeDeleteOperation(operation);
      }
    };

    /**
     * Add attribute to attribute list
     * @param {canvas_widget.AbstractAttribute} attribute
     */
    this.addAttribute = function (attribute) {
      var id = attribute.getEntityId();
      if (!_list.hasOwnProperty(id)) {
        _list[id] = attribute;
      }
    };

    /**
     * Get attribute of attribute list by its entity id
     * @param id
     * @returns {canvas_widget.AbstractAttribute}
     */
    this.getAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        return _list[id];
      }
      return null;
    };

    /**
     * Delete attribute from attribute list by its entity id
     * @param {string} id
     */
    this.deleteAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        delete _list[id];
      }
    };

    /**
     * Get attribute list
     * @returns {Object}
     */
    this.getAttributes = function () {
      return _list;
    };

    /**
     * Set attribute list
     * @param {Object} list
     */
    this.setAttributes = function (list) {
      _list = list;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute (list)
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Get JSON representation of the attribute (list)
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.type = KeySelectionValueListAttribute.TYPE;
      var attr = {};
      _.forEach(this.getAttributes(), function (val, key) {
        attr[key] = val.toJSON();
      });
      json.list = attr;
      return json;
    };

    /**
     * Set attribute list by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _.forEach(json.list, function (val, key) {
        var attribute = new KeySelectionValueAttribute(
          key,
          key,
          that,
          _options
        );
        attribute.setValueFromJSON(json.list[key]);
        that.addAttribute(attribute);
        if (
          _$node.find(".list").find("#" + attribute.getEntityId()).length == 0
        )
          _$node.find(".list").append(attribute.get$node());
      });
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwcw.registerOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.registerOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwcw.unregisterOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.unregisterOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    _$node.find(".name").text(this.getName());

    for (var attributeId in _list) {
      if (_list.hasOwnProperty(attributeId)) {
        _$node.find(".list").append(_list[attributeId].get$node());
      }
    }

    if (_iwcw) {
      that.registerCallbacks();
    }

    this.registerYMap = function () {
      var ymap = that.getRootSubjectEntity().getYMap();
      var attrs = that.getAttributes();
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          var attr = attrs[key];
          attr.getKey().registerYType();
          attr.getValue().registerYType();
        }
      }

      ymap.observe(function (event) {
        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key, change]) => {
          if (key.indexOf("[key]") != -1) {
            var operation;
            switch (change.action) {
              case "add": {
                //  var yUserId = event.object.map[key][0];
                //  if (yUserId === y.clientID) return;
                operation = new AttributeAddOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeAddCallback(operation);

                break;
              }
              case "delete": {
                operation = new AttributeDeleteOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeDeleteCallback(operation);
                break;
              }
            }
          }
        });
      });
    };
  }
}

/**
 * Abstract Class Node
 * @class canvas_widget.ModelAttributesNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {object} [attr] model attributes
 */
export class ModelAttributesNode extends AbstractNode {
  static TYPE = "ModelAttributesNode";

  constructor(id, attr, y) {
    super(id, ModelAttributesNode.TYPE, 0, 0, 0, 0, 0, null, null, y);
    y = y || window.y;
    if (!y) {
      throw new Error("y is not defined");
    }

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(modelAttributesNodeHtml)());

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
      json.type = ModelAttributesNode.TYPE;
      return json;
    };

    if (attr) {
      for (var attrKey in attr) {
        if (attr.hasOwnProperty(attrKey)) {
          switch (attr[attrKey].value) {
            case "boolean":
              this.addAttribute(
                new BooleanAttribute(
                  this.getEntityId() +
                    "[" +
                    attr[attrKey].key.toLowerCase() +
                    "]",
                  attr[attrKey].key,
                  this
                )
              );
              break;
            case "string":
              this.addAttribute(
                new SingleValueAttribute(
                  this.getEntityId() +
                    "[" +
                    attr[attrKey].key.toLowerCase() +
                    "]",
                  attr[attrKey].key,
                  this
                )
              );
              break;
            case "integer":
              this.addAttribute(
                new IntegerAttribute(
                  this.getEntityId() +
                    "[" +
                    attr[attrKey].key.toLowerCase() +
                    "]",
                  attr[attrKey].key,
                  this
                )
              );
              break;
            case "file":
              this.addAttribute(
                new FileAttribute(
                  this.getEntityId() +
                    "[" +
                    attr[attrKey].key.toLowerCase() +
                    "]",
                  attr[attrKey].key,
                  this
                )
              );
              break;
            default:
              if (attr[attrKey].options) {
                this.addAttribute(
                  new SingleSelectionAttribute(
                    this.getEntityId() +
                      "[" +
                      attr[attrKey].key.toLowerCase() +
                      "]",
                    attr[attrKey].key,
                    this,
                    attr[attrKey].options
                  )
                );
              }
              break;
          }
        }
      }
    } else {
      this.addAttribute(
        new SingleValueAttribute(this.getEntityId() + "[name]", "Name", this, y)
      );
      this.addAttribute(
        new SingleMultiLineValueAttribute(
          this.getEntityId() + "[description]",
          "Description",
          this,
          y
        )
      );
    }

    this.getLabel().getValue().setValue("Model Attributes");

    _$node.find(".label").text("Model Attributes");
    _$node.hide();

    for (var attributeKey in _attributes) {
      if (_attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(_attributes[attributeKey].get$node());
      }
    }

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      var attrs = this.getAttributes();
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          var attr = attrs[key];
          if (
            attr instanceof SingleValueAttribute ||
            attr instanceof SingleMultiLineValueAttribute
          ) {
            attr.getValue().registerYType();
          } else if (
            !(attr instanceof FileAttribute) &&
            !(attr instanceof SingleValueAttribute) &&
            !(attr instanceof SingleMultiLineValueAttribute)
          ) {
            attr.getValue().registerYType();
          }
        }
      }
    };
  }
}

/**
 * ViewObjectNode
 * @class canvas_widget.ViewObjectNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 * @param {object} jsonFromResource the ViewObjectNode is created from a json
 */
export class ViewObjectNode extends AbstractNode {
  static TYPE = "ViewObject";
  static DEFAULT_WIDTH = 150;
  static DEFAULT_HEIGHT = 100;
  constructor(id, left, top, width, height, zIndex, json) {
    var that = this;

    super(id, "ViewObject", left, top, width, height, zIndex, json);

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(
      _.template(viewobjectNodeHtml)({ type: that.getType() })
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node
      .call(this)
      .append(_$template)
      .addClass("viewobject");

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var _$attributeNode = _$node.find(".attributes");

    /**
     * Get JSON representation of the node
     * @returns {Object}
     */
    this.toJSON = function () {
      return AbstractNode.prototype.toJSON.call(this);
    };

    this.createConditionListAttribute = function (refAttrs) {
      var targetAttrList = {};
      if (refAttrs && refAttrs.constructor.name === "RenamingListAttribute") {
        var attrs = refAttrs.getAttributes();
        for (var key in attrs) {
          if (attrs.hasOwnProperty(key)) {
            targetAttrList[key] = attrs[key].getKey().getValue();
          }
        }
      } else {
        for (var key in refAttrs) {
          if (refAttrs.hasOwnProperty(key)) {
            targetAttrList[key] = refAttrs[key].val.value;
          }
        }
      }
      var conditionListAttr = new ConditionListAttribute(
        "[condition]",
        "Conditions",
        that,
        targetAttrList,
        LogicalOperator
      );
      that.addAttribute(conditionListAttr);
      _$attributeNode.append(conditionListAttr.get$node());
      conditionListAttr.get$node().hide();
      return conditionListAttr;
    };

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
      renamingList.registerYMap();
      if (cla) cla.registerYMap();
      targetAttribute.getValue().registerYType();
      conjSelection.getValue().registerYType();
    };

    this.showAttributes = function () {
      if (renamingList.get$node().is(":hidden")) renamingList.get$node().show();
      if (conjSelection.get$node().is(":hidden"))
        conjSelection.get$node().show();
      if (cla.get$node().is(":hidden")) cla.get$node().show();
      if (!targetAttribute.get$node().is(":hidden"))
        targetAttribute.get$node().hide();
    };

    var targetAttribute, renamingList, conjSelection, cla;
    _$node.find(".label").append(this.getLabel().get$node());
    if (window.hasOwnProperty("y")) {
      const dataMap = y.getMap("data");
      var model = dataMap.get("model");
      if (model) {
        var selectionValues =
          ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes, [
            "Object",
          ]);
        targetAttribute = new SingleSelectionAttribute(
          id + "[target]",
          "Target",
          that,
          selectionValues
        );
        that.addAttribute(targetAttribute);
        _$attributeNode.prepend(targetAttribute.get$node());
      }
      if (json)
        cla = that.createConditionListAttribute(
          json.attributes["[attributes]"].list
        );
      else cla = that.createConditionListAttribute();
    }

    renamingList = new RenamingListAttribute(
      "[attributes]",
      "Attributes",
      that,
      {
        show: "Visible",
        hide: "Hidden",
      }
    );
    that.addAttribute(renamingList);
    _$attributeNode.append(renamingList.get$node());
    renamingList.get$node().hide();

    conjSelection = new SingleSelectionAttribute(
      id + "[conjunction]",
      "Conjunction",
      that,
      LogicalConjunctions
    );
    that.addAttribute(conjSelection);
    _$attributeNode.append(conjSelection.get$node());
    conjSelection.get$node().hide();

    if (json && conjSelection && cla && renamingList && targetAttribute)
      that.showAttributes();

    this.setContextMenuItemCallback(function () {
      var viewId = $("#lblCurrentView").text();
      return {
        addShape: {
          name: "Add Node Shape",
          callback: function () {
            var canvas = that.getCanvas(),
              appearance = that.getAppearance();

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
                  nodeId,
                  null,
                  null,
                  viewId
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
        sep: "---------",
      };
    });
  }
}

/**
         * ViewRelationshipNode
         * @class canvas_widget.ViewRelationshipNode
         * @extends canvas_widget.AbstractNode
         * @memberof canvas_widget
         * @constructor
         * @param {string} id Entity identifier of node
         * @param {number} left x-coordinate of node position
         * @param {number} top y-coordinate of node position
         * @param {number} width Width of node
         * @param {number} height Height of node
         * @param {number} zIndex Position of node on z-axis
         * @param {object} json indicates if the ViewObjectNode is created from a json
    
         */
export class ViewRelationshipNode extends AbstractNode {
  static TYPE = "ViewRelationship";
  static DEFAULT_WIDTH = 150;
  static DEFAULT_HEIGHT = 100;
  constructor(id, left, top, width, height, zIndex, json) {
    super(id, "ViewRelationship", left, top, width, height, zIndex, json);
    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(
      _.template(viewrelationshipNodeHtml)({
        type: that.getType(),
      })
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node
      .call(this)
      .append(_$template)
      .addClass("viewrelationship");

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var _$attributeNode = _$node.find(".attributes");

    /**
     * Get JSON representation of the node
     * @returns {Object}
     */
    this.toJSON = function () {
      return AbstractNode.prototype.toJSON.call(this);
    };

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
      attributeList.registerYMap();
      if (cla) cla.registerYMap();
      attribute.getValue().registerYType();
      conjSelection.getValue().registerYType();
    };

    this.showAttributes = function () {
      if (renamingList.get$node().is(":hidden")) renamingList.get$node().show();
      if (conjSelection.get$node().is(":hidden"))
        conjSelection.get$node().show();
      if (cla.get$node().is(":hidden")) cla.get$node().show();
      if (!targetAttribute.get$node().is(":hidden"))
        targetAttribute.get$node().hide();
    };

    this.createConditionListAttribute = function (refAttrs) {
      var targetAttrList = {};
      if (refAttrs && refAttrs.constructor.name === "RenamingListAttribute") {
        var attrs = refAttrs.getAttributes();
        for (var key in attrs) {
          if (attrs.hasOwnProperty(key)) {
            targetAttrList[key] = attrs[key].getKey().getValue();
          }
        }
      } else {
        for (var key in refAttrs) {
          if (refAttrs.hasOwnProperty(key)) {
            targetAttrList[key] = refAttrs[key].val.value;
          }
        }
      }
      var conditionListAttr = new ConditionListAttribute(
        "[condition]",
        "Conditions",
        that,
        targetAttrList,
        LogicalOperator
      );
      that.addAttribute(conditionListAttr);
      _$attributeNode.append(conditionListAttr.get$node());
      conditionListAttr.get$node().hide();
      return conditionListAttr;
    };

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
      renamingList.registerYMap();
      if (cla) cla.registerYMap();
      targetAttribute.getValue().registerYType();
      conjSelection.getValue().registerYType();
    };

    var targetAttribute, renamingList, conjSelection, cla;
    _$node.find(".label").append(this.getLabel().get$node());
    if (window.hasOwnProperty("y")) {
      const dataMap = y.getMap("data");
      var model = dataMap.get("model");
      if (model) {
        var selectionValues =
          ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes, [
            "Relationship",
          ]);
        targetAttribute = new SingleSelectionAttribute(
          id + "[target]",
          "Reference",
          that,
          selectionValues
        );
        that.addAttribute(targetAttribute);
        _$attributeNode.prepend(targetAttribute.get$node());

        if (json)
          cla = that.createConditionListAttribute(
            json.attributes["[attributes]"].list
          );
        else cla = that.createConditionListAttribute();
      }
    }

    renamingList = new RenamingListAttribute(
      "[attributes]",
      "Attributes",
      that,
      {
        hidden: "Show",
        top: "Show Top",
        center: "Show Center",
        bottom: "Show Bottom",
        hide: "Hide",
      }
    );
    that.addAttribute(renamingList);
    _$attributeNode.append(renamingList.get$node());
    renamingList.get$node().hide();

    conjSelection = new SingleSelectionAttribute(
      id + "[conjunction]",
      "Conjunction",
      that,
      LogicalConjunctions
    );
    that.addAttribute(conjSelection);
    _$attributeNode.append(conjSelection.get$node());
    conjSelection.get$node().hide();

    if (json && conjSelection && cla && renamingList && targetAttribute)
      that.showAttributes();

    this.setContextMenuItemCallback(function () {
      var viewId = $("#lblCurrentView").text();
      return {
        addShape: {
          name: "Add Edge Shape",
          callback: function () {
            var canvas = that.getCanvas(),
              appearance = that.getAppearance(),
              nodeId;

            canvas.createNode(
              EdgeShapeNode.TYPE,
              appearance.left + appearance.width + 50,
              appearance.top,
              150,
              100
            );
            canvas.createEdge(
              BiDirAssociationEdge.TYPE,
              that.getEntityId(),
              nodeId,
              null,
              null,
              viewId
            );
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
        sep: "---------",
      };
    });
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
 * GeneralisationEdge
 * @class GeneralisationEdge
 * @extends AbstractEdge
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of edge
 * @param {canvas_widget.AbstractNode} source Source node
 * @param {canvas_widget.AbstractNode} target Target node
 */
export class GeneralisationEdge extends AbstractEdge {
  static TYPE = "Generalisation";
  static RELATIONS = [
    {
      sourceTypes: [ObjectNode.TYPE],
      targetTypes: [ObjectNode.TYPE, AbstractClassNode.TYPE],
    },
    {
      sourceTypes: [RelationshipNode.TYPE],
      targetTypes: [RelationshipNode.TYPE, AbstractClassNode.TYPE],
    },
    {
      sourceTypes: [RelationshipGroupNode.TYPE],
      targetTypes: [RelationshipNode.TYPE, ViewRelationshipNode.TYPE],
    },
    {
      sourceTypes: [AbstractClassNode.TYPE],
      targetTypes: [AbstractClassNode.TYPE],
    },
    {
      sourceTypes: [EnumNode.TYPE],
      targetTypes: [EnumNode.TYPE],
    },
  ];

  constructor(id, source, target) {
    super(id, GeneralisationEdge.TYPE, source, target);
    var that = this;

    /**
     * Connect source and target node and draw the edge on canvas
     */
    this.connect = function () {
      var source = this.getSource();
      var target = this.getTarget();
      var connectOptions = {
        source: source.get$node().get(0),
        target: target.get$node().get(0),
        paintStyle: {
          stroke: "black",
          strokeWidth: 4,
        },
        endpoint: "Dot",
        anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
        connector: {
          type: StraightConnector.type,
          options: { gap: 0 },
        },
        overlays: [
          {
            type: "Arrow",
            options: {
              width: 20,
              length: 25,
              location: 1,
              foldback: 1,
              paintStyle: {
                fill: "#ffffff",
                outlineWidth: 2,
                dashstyle: "black",
              },
            },
          },
          {
            type: "Custom",
            options: {
              create: function () {
                return that.get$overlay().get(0);
              },
              location: 0.5,
              id: "label",
            },
          },
        ],
        cssClass: this.getEntityId(),
      };

      if (source === target) {
        connectOptions.anchor = ["TopCenter", "LeftMiddle"];
      }

      source.addOutgoingEdge(this);
      target.addIngoingEdge(this);
      this.setJsPlumbConnection(window.jsPlumbInstance.connect(connectOptions));

      this.repaintOverlays();
      _.each(EntityManagerInstance.getEdges(), function (e) {
        e.setZIndex();
      });
    };

    this.get$overlay().find(".type").addClass("segmented");
  }
}

/**
 * UniDirAssociationEdge
 * @class canvas_widget.UniDirAssociationEdge
 * @extends canvas_widget.AbstractEdge
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of edge
 * @param {canvas_widget.AbstractNode} source Source node
 * @param {canvas_widget.AbstractNode} target Target node
 */
export class UniDirAssociationEdge extends AbstractEdge {
  static TYPE = "Uni-Dir-Association";
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
    super(id, UniDirAssociationEdge.TYPE, source, target);
    var that = this;

    /**
     * Connect source and target node and draw the edge on canvas
     */
    this.connect = function () {
      var source = this.getSource();
      var target = this.getTarget();
      var connectOptions = {
        source: source.get$node().get(0),
        target: target.get$node().get(0),
        paintStyle: {
          stroke: "black",
          strokeWidth: 4,
        },
        endpoint: "Dot",
        anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
        connector: {
          type: StraightConnector.type,
          options: { gap: 0 },
        },
        overlays: [
          {
            type: "Arrow",
            options: {
              width: 20,
              length: 30,
              location: 1,
              foldback: 0.5,
              paintStyle: {
                fill: "#ffffff",
                outlineWidth: 2,
                outlineStroke: "black",
              },
            },
          },
          {
            type: "Custom",
            options: {
              create: function () {
                return that.get$overlay().get(0);
              },
              location: 0.5,
              id: "label",
            },
          },
        ],
        cssClass: this.getEntityId(),
      };

      if (source === target) {
        connectOptions.anchors = ["TopCenter", "LeftMiddle"];
      }

      source.addOutgoingEdge(this);
      target.addIngoingEdge(this);
      this.setJsPlumbConnection(window.jsPlumbInstance.connect(connectOptions));

      this.repaintOverlays();
      _.each(EntityManagerInstance.getEdges(), function (e) {
        e.setZIndex();
      });
    };

    this.get$overlay().find(".type").addClass("segmented");

    /*this.setContextMenuItems({
              sep0: "---------",
              convertToBiDirAssociationEdge: {
                  name: "Convert to Bi-Dir. Assoc. Edge",
                  callback: function(){
                      var canvas = that.getCanvas();
  
                      //noinspection JSAccessibilityCheck
                      canvas.createEdge(require('canvas_widget/BiDirAssociationEdge').TYPE,that.getSource().getEntityId(),that.getTarget().getEntityId(),that.toJSON());
  
                      that.triggerDeletion();
  
                  }
              }
          });*/
  }
}

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
        source: source.get$node().get(0),
        target: target.get$node().get(0),
        paintStyle: {
          stroke: "black",
          strokeWidth: 4,
        },
        endpoint: "Dot",
        anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
        connector: {
          type: StraightConnector.type,
          options: { gap: 0 },
        },
        overlays: [
          {
            type: "Custom",
            options: {
              create: function () {
                return that.get$overlay().get(0);
              },
              location: 0.5,
              id: "label",
            },
          },
        ],
        cssClass: this.getEntityId(),
      };

      if (source === target) {
        connectOptions.anchors = ["TopCenter", "LeftMiddle"];
      }

      source.addOutgoingEdge(this);
      target.addIngoingEdge(this);
      this.setJsPlumbConnection(window.jsPlumbInstance.connect(connectOptions));

      this.repaintOverlays();
      _.each(EntityManagerInstance.getEdges(), function (e) {
        e.setZIndex();
      });
    };

    this.get$overlay().find(".type").addClass("segmented");
  }
}
