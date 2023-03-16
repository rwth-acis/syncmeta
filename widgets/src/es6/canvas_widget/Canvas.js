import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.4.1/jquery-migrate.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
// note that the version from the CDN  does not come with bezier connectors
import "https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.2/jquery.contextMenu.js";
import AbstractEntity from "../canvas_widget/AbstractEntity";
import DagreLayout from "../canvas_widget/DagreLayout";
import CollaborationGuidance from "../canvas_widget/guidance_modeling/CollaborationGuidance";
import GhostEdgeGuidance from "../canvas_widget/guidance_modeling/GhostEdgeGuidance";
import GuidanceBox from "../canvas_widget/guidance_modeling/GuidanceBox";
import SelectToolGuidance from "../canvas_widget/guidance_modeling/SelectToolGuidance";
import SetPropertyGuidance from "../canvas_widget/guidance_modeling/SetPropertyGuidance";
import MoveTool from "../canvas_widget/MoveTool";
import { CONFIG } from "../config";
import IWCW from "../lib/IWCWrapper";
import { Map as YMap } from "yjs";
import ActivityOperation from "../operations/non_ot/ActivityOperation";
import CanvasViewChangeOperation from "../operations/non_ot/CanvasViewChangeOperation";
import EntitySelectOperation from "../operations/non_ot/EntitySelectOperation";
import ExportImageOperation from "../operations/non_ot/ExportImageOperation";
import ExportLogicalGuidanceRepresentationOperation from "../operations/non_ot/ExportLogicalGuidanceRepresentationOperation";
import ExportMetaModelOperation from "../operations/non_ot/ExportMetaModelOperation";
import GuidanceStrategyOperation from "../operations/non_ot/GuidanceStrategyOperation";
import MoveCanvasOperation from "../operations/non_ot/MoveCanvasOperation";
import RevokeSharedActivityOperation from "../operations/non_ot/RevokeSharedActivityOperation";
import ShowGuidanceBoxOperation from "../operations/non_ot/ShowGuidanceBoxOperation";
import ToolSelectOperation from "../operations/non_ot/ToolSelectOperation";
import {
  EdgeAddOperation,
  EdgeDeleteOperation,
  NodeAddOperation,
  NodeDeleteOperation,
} from "../operations/ot/EntityOperation";
import Util from "../Util";
import AbstractCanvas from "./AbstractCanvas";
import {
  EntityManagerInstance as EntityManager,
  HistoryManagerInstance as HistoryManager,
} from "./Manager";
import { newInstance } from "@jsplumb/browser-ui";
import { eventWasTriggeredByMe } from "../yeventChecker";

/**
 * Canvas
 * @class canvas_widget.Canvas
 * @extends canvas_widget.AbstractCanvas
 * @memberof canvas_widget
 * @constructor
 * @param {jQuery} $node jquery Selector of canvas node
 */
export default class Canvas extends AbstractCanvas {
  constructor($node, y = window.y) {
    super($node);
    var that = this;

    /**
     * jQuery object of DOM node representing the canvas
     * @type {jQuery}
     * @private
     */
    var _$node = $node;

    /**
     * Current zoom level
     * @type {number}
     * @private
     */
    var _zoom = 1;

    /**
     * Array of callback functions listening for Canvas events
     * @type {Array}
     * @private
     */
    var _listeners = [];

    /**
     * Default canvas width
     * @type {number}
     * @private
     */
    var _canvasWidth = 9000;
    this.width = _canvasWidth;

    /**
     * Default canvas height
     * @type {number}
     * @private
     */
    var _canvasHeight = 9000;
    this.height = _canvasHeight;

    /**
     * Model attributes
     * @type {canvas_widget.ModelAttributesNode}
     * @private
     */
    var _modelAttributesNode = null;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

    /**
     * Entity currently selected
     * @type {canvas_widget.AbstractNode|canvas_widget/AbstractEdge}
     * @private
     */
    var _selectedEntity = null;

    /**
     * Offset of the DOM node representating the canvas
     * @type {{left: number, top: number, right: number, bottom: number}}
     */
    var canvasOffset = _$node.offset();

    var _guidanceBox = null;
    var _guidanceBoxLabel = "";
    var _guidanceDefinition = null;
    var _ghostEdges = [];
    var _guidanceBoxEntityId = null;

    const jsPlumbInstance = newInstance({
      container: _$node.get(0),
      elementsDraggable: true,
      connectionsDetachable: false,
      dragOptions: {
        filter: ".resizing",
      },
    });

    window.jsPlumbInstance = jsPlumbInstance;

    $(window).resize(function () {
      sendViewChangeOperation();
    });

    /**
     * Apply a Tool Select Operation
     * @param {operations.non_ot.ToolSelectOperation} operation
     */
    var processToolSelectOperation = function (operation) {
      that.mountTool(
        operation.getSelectedToolName(),
        operation.getDefaultLabel(),
        operation.getDefaultAttributeValues()
      );
    };

    /**
     * Apply a Node Add Operation
     * @param {operations.ot.NodeAddOperation} operation
     * @param {YMap} ymap
     */
    var processNodeAddOperation = function (operation) {
      var node;
      if (operation.getJSON()) {
        node = EntityManager.createNodeFromJSON(
          operation.getType(),
          operation.getEntityId(),
          operation.getLeft(),
          operation.getTop(),
          operation.getWidth(),
          operation.getHeight(),
          operation.getZIndex(),
          operation.getContainment(),
          operation.getJSON()
        );
      } else {
        node = EntityManager.createNode(
          operation.getType(),
          operation.getEntityId(),
          operation.getLeft(),
          operation.getTop(),
          operation.getWidth(),
          operation.getHeight(),
          operation.getZIndex(),
          operation.getContainment()
        );
      }

      if (operation.getDefaultLabel()) {
        node.getLabel().getValue().setValue(operation.getDefaultLabel());
      }

      if (operation.getDefaultAttributeValues()) {
        for (const [key, value] of Object.entries(
          operation.getDefaultAttributeValues()
        )) {
          node.getAttribute(key).getValue().setValue(value);
        }
      }
      const userMap = y.getMap("users");
      if (userMap.get(y.clientID) !== operation.getJabberId()) {
        const userList = y.getMap("userList");
        var color = Util.getColor(
          userList.get(operation.getJabberId()).globalId
        );
        node.refreshTraceAwareness(color);
      }
      if (y) node.registerYMap();

      node.draw();
      node.addToCanvas(that);
      node.bindMoveToolEvents();
      that.remountCurrentTool();
    };

    /**
     * Propagate a Node Add Operation to the remote users and the local widgets
     * @param {operations.ot.NodeAddOperation} operation
     */
    var propagateNodeAddOperation = function (operation) {
      processNodeAddOperation(operation);
      $("#save").click();
      //_iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
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
          "NodeAddActivity",
          operation.getEntityId(),
          _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
          NodeAddOperation.getOperationDescription(operation.getType()),
          {
            nodeType: operation.getType(),
          }
        ).toJSON()
      );
    };

    /**
     * Apply an Edge Add Operation
     * @param {operations.ot.EdgeAddOperation} operation
     * @param {YMap} ymap
     */
    var processEdgeAddOperation = function (operation) {
      var edge;

      if (operation.getJSON()) {
        edge = EntityManager.createEdgeFromJSON(
          operation.getType(),
          operation.getEntityId(),
          operation.getSource(),
          operation.getTarget(),
          operation.getJSON()
        );
      } else {
        edge = EntityManager.createEdge(
          operation.getType(),
          operation.getEntityId(),
          EntityManager.findNode(operation.getSource()),
          EntityManager.findNode(operation.getTarget())
        );
      }

      if (window.hasOwnProperty("y")) edge.registerYMap();

      edge.connect();
      edge.addToCanvas(that);
      edge.bindMoveToolEvents();
      that.remountCurrentTool();
    };
    /**
     * Propagate an Edge Add Operation to the remote users and the local widgets
     * @param {operations.ot.EdgeAddOperation} operation
     */
    var propagateEdgeAddOperation = function (operation) {
      var sourceNode = EntityManager.findNode(operation.getSource());
      var targetNode = EntityManager.findNode(operation.getTarget());

      processEdgeAddOperation(operation);
      $("#save").click();

      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "EdgeAddActivity",
          operation.getEntityId(),
          _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
          EdgeAddOperation.getOperationDescription(
            operation.getType(),
            "",
            sourceNode.getLabel().getValue().getValue(),
            sourceNode.getType(),
            targetNode.getType(),
            targetNode.getLabel().getValue().getValue()
          ),
          {
            nodeType: operation.getType(),
            sourceNodeId: operation.getSource(),
            sourceNodeLabel: sourceNode.getLabel().getValue().getValue(),
            sourceNodeType: sourceNode.getType(),
            targetNodeId: operation.getTarget(),
            targetNodeLabel: targetNode.getLabel().getValue().getValue(),
            targetNodeType: targetNode.getType(),
          }
        ).toJSON()
      );
    };

    /**
     * Callback for a remote Node Add Operation
     * @param {operations.ot.NodeAddOperation} operation
     */
    var remoteNodeAddCallback = function (operation) {
      if (operation instanceof NodeAddOperation) {
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.HEATMAP,
          operation.getOTOperation()
        );
        if (
          operation.getViewId() === EntityManager.getViewId() &&
          EntityManager.getLayer() === CONFIG.LAYER.META
        ) {
          processNodeAddOperation(operation);
        } else if (EntityManager.getLayer() === CONFIG.LAYER.MODEL) {
          var type, node, viewType;

          if (!operation.getViewId()) {
            type = operation.getType();
          } else {
            type = operation.getOriginType();
          }

          if (EntityManager.getViewId()) {
            viewType = EntityManager.getNodeType(type).VIEWTYPE;
            if (viewType) {
              type = viewType;
            }
          }

          //processNodeAddOperation
          if (operation.getJSON()) {
            node = EntityManager.createNodeFromJSON(
              type,
              operation.getEntityId(),
              operation.getLeft(),
              operation.getTop(),
              operation.getWidth(),
              operation.getHeight(),
              operation.getZIndex(),
              operation.getContainment(),
              operation.getJSON()
            );
          } else {
            node = EntityManager.createNode(
              type,
              operation.getEntityId(),
              operation.getLeft(),
              operation.getTop(),
              operation.getWidth(),
              operation.getHeight(),
              operation.getZIndex(),
              operation.getContainment()
            );
          }

          if (operation.getDefaultLabel()) {
            node.getLabel().getValue().setValue(operation.getDefaultLabel());
          }

          if (operation.getDefaultAttributeValues()) {
            for (const [key, value] of Object.entries(
              operation.getDefaultAttributeValues()
            )) {
              node.getAttribute(key).getValue().setValue(value);
            }
          }

          node.registerYMap();
          node.draw();
          node.addToCanvas(that);
          node.bindMoveToolEvents();

          //if we are in a view but the view type got no mapping in this view -> hide the element
          if (!viewType && EntityManager.getViewId()) {
            node.hide();
          } else {
            const userMap = y.getMap("users");
            if (
              userMap.get(y.clientID) !== operation.getJabberId() &&
              operation.getJabberId() != null
            ) {
              const userList = y.getMap("userList");
              var color = Util.getColor(
                userList.get(operation.getJabberId()).globalId
              );
              node.refreshTraceAwareness(color);
            }
          }
          that.remountCurrentTool();
        }
      }
    };

    var sendViewChangeOperation = function () {
      var canvasFrame = $("#canvas-frame");
      var operation = new CanvasViewChangeOperation(
        _$node.position().left,
        _$node.position().top,
        canvasFrame.width(),
        canvasFrame.height(),
        _zoom
      );
      _iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.HEATMAP,
        operation.toNonOTOperation()
      );
    };

    /**
     * Callback for a remote Edge Add Operation
     * @param {operations.ot.EdgeAddOperation} operation
     */
    var remoteEdgeAddCallback = function (operation) {
      if (operation instanceof EdgeAddOperation) {
        var sourceNode = EntityManager.findNode(operation.getSource());
        var targetNode = EntityManager.findNode(operation.getTarget());

        if (
          operation.getViewId() === EntityManager.getViewId() ||
          EntityManager.getLayer() === CONFIG.LAYER.META
        ) {
          processEdgeAddOperation(operation);
        } else if (EntityManager.getLayer() === CONFIG.LAYER.MODEL) {
          var type, edge, viewType;

          if (!operation.getViewId()) {
            type = operation.getType();
          } else {
            type = operation.getOriginType();
          }

          if (EntityManager.getViewId()) {
            viewType = EntityManager.getEdgeType(type).VIEWTYPE;
            if (viewType) {
              type = viewType;
            }
          }

          if (operation.getJSON()) {
            edge = EntityManager.createEdgeFromJSON(
              type,
              operation.getEntityId(),
              operation.getSource(),
              operation.getTarget(),
              operation.getJSON()
            );
          } else {
            edge = EntityManager.createEdge(
              type,
              operation.getEntityId(),
              EntityManager.findNode(operation.getSource()),
              EntityManager.findNode(operation.getTarget())
            );
          }

          edge.registerYMap();
          edge.connect();
          edge.addToCanvas(that);

          //if we are in a view but the view type got no mapping in this view -> hide the element
          if (!viewType && EntityManager.getViewId()) {
            edge.hide();
          }

          that.remountCurrentTool();
        }
      }
    };

    /**
     * Callback for a local Tool Select Operation
     * @param {operations.non_ot.ToolSelectOperation.non_ot.ToolSelectOperation} operation
     */
    var localToolSelectCallback = function (operation) {
      if (operation instanceof ToolSelectOperation) {
        processToolSelectOperation(operation);
      }
    };

    var localShowGuidanceBoxCallback = function (operation) {
      if (operation instanceof ShowGuidanceBoxOperation) {
        processShowGuidanceBoxOperation(operation);
      }
    };

    var processShowGuidanceBoxOperation = function (operation) {
      _guidanceDefinition = operation.getGuidance();
      _guidanceBoxLabel = operation.getLabel();
      that.showGuidanceBox(operation.getEntityId());
    };

    /**
     * Callback for a local Export Data Operation
     * @param {operations.non_ot.ExportMetaModelOperation} operation
     */
    var localExportMetaModelCallback = function (operation) {
      if (operation instanceof ExportMetaModelOperation) {
        if (operation.getData() === null) {
          operation.setData(EntityManager.generateMetaModel());
          _iwcw.sendLocalNonOTOperation(
            operation.getRequestingComponent(),
            operation.toNonOTOperation()
          );
        } else {
          var data = operation.getData();
          var op = new ActivityOperation(
            "EditorGenerateActivity",
            "-1",
            _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
            '..generated new Editor <a href="' +
              data.spaceURI +
              '" target="_blank">' +
              data.spaceTitle +
              "</a>",
            {}
          );
          const activityMap = y.getMap("activity");
          activityMap.set("EditorGenerateActivity", op.toJSON());
        }
      }
    };

    var localMoveCanvasOperation = function (operation) {
      if (operation instanceof MoveCanvasOperation) {
        that.scrollEntityIntoView(operation.getObjectId());
      }
    };

    var localExportLogicalGuidanceRepresentationCallback = function (
      operation
    ) {
      if (operation instanceof ExportLogicalGuidanceRepresentationOperation) {
        if (operation.getData() === null) {
          operation.setData(
            EntityManager.generateLogicalGuidanceRepresentation()
          );
          _iwcw.sendLocalNonOTOperation(
            operation.getRequestingComponent(),
            operation.toNonOTOperation()
          );
        }
      }
    };

    var localGuidanceStrategyOperationCallback = function (operation) {
      const canvasMap = y.getMap("canvas");
      if (operation instanceof GuidanceStrategyOperation) {
        //Just forward the message to remote users
        canvasMap.set(GuidanceStrategyOperation.TYPE, operation.toJSON());
      }
    };

    var localRevokeSharedActivityOperationCallback = function (operation) {
      if (operation instanceof RevokeSharedActivityOperation) {
        const canvasMap = y.getMap("canvas");
        //Just forward the message to remote users
        canvasMap.set(RevokeSharedActivityOperation.TYPE, operation.toJSON());
      }
    };

    var remoteGuidanceStrategyOperation = function (operation) {
      if (operation instanceof GuidanceStrategyOperation) {
        //Just forward the message to the local guidance widget
        _iwcw.sendLocalNonOTOperation(
          CONFIG.WIDGET.NAME.GUIDANCE,
          operation.toNonOTOperation()
        );
      }
    };

    var remoteRevokeSharedActivityOperationCallback = function (operation) {
      if (operation instanceof RevokeSharedActivityOperation) {
        //Just forward the message to the local guidance widget
        _iwcw.sendLocalNonOTOperation(
          CONFIG.WIDGET.NAME.GUIDANCE,
          operation.toNonOTOperation()
        );
      }
    };

    /**
     * Callback for a local Export Data Operation
     * @param {operations.non_ot.ExportImageOperation} operation
     */
    var localExportImageCallback = function (operation) {
      if (operation instanceof ExportImageOperation) {
        that.toPNG().then(function (url) {
          operation.setData(url);
          _iwcw.sendLocalNonOTOperation(
            operation.getRequestingComponent(),
            operation.toNonOTOperation()
          );
        });
      }
    };

    /**
     * Callback for an undone resp. redone Node Add Operation
     * @param {operations.ot.NodeAddOperation} operation
     */
    var init = function () {
      var $canvasFrame = _$node.parent();

      that.addTool(MoveTool.TYPE, new MoveTool());

      _$node.css({
        width: _canvasWidth,
        height: _canvasHeight,
        left: (-_canvasWidth + $canvasFrame.width()) / 2,
        top: (-_canvasHeight + $canvasFrame.height()) / 2,
      });

      _$node.draggable({
        stop: function () {
          sendViewChangeOperation();
        },
      });

      if (_$node.transformable != null) {
        // since recently, this method doesnt exist anymore.  BUGFIX
        _$node.transformable({
          rotatable: false,
          skewable: false,
          scalable: false,
        });
      }
      _$node.mousewheel(function (event) {
        that.setZoom(that.getZoom() + 0.1 * event.deltaY);
        event.preventDefault();
      });
    };

    /**
     * Get jQuery object of DOM node representing the canvas
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    this.showGuidanceBox = function (entityId) {
      this.hideGuidanceBox();
      var entity;
      if (typeof entityId == "undefined") {
        entityId = _guidanceBoxEntityId;
      } else {
        _guidanceBoxEntityId = entityId;
      }
      if (_guidanceDefinition === null) return;
      if (_guidanceDefinition.length == 0) return;
      if (!entityId) entityId = _selectedEntity.getEntityId();

      entity = EntityManager.findNode(entityId);
      if (!entity) return;

      var itemWidth = 100;
      var itemHeight = 100;
      var entityAppearance = entity.getAppearance();
      var appearance = {
        top: entityAppearance.top,
        left: entityAppearance.left,
        width: entityAppearance.width,
        height: entityAppearance.height,
      };
      appearance.top += entityAppearance.height + 10;
      appearance.left += entityAppearance.width / 2;
      _guidanceBox = new GuidanceBox(
        Util.generateRandomId(),
        _guidanceBoxLabel,
        appearance.left,
        appearance.top
      );
      var inView = false;
      if (
        EntityManager.getViewId() != null &&
        EntityManager.getLayer() === CONFIG.LAYER.MODEL
      ) {
        inView = true;
      }
      for (var i = 0; i < _guidanceDefinition.length; i++) {
        var guidanceItem = null;
        switch (_guidanceDefinition[i].type) {
          case "SELECT_TOOL_GUIDANCE":
            var tool;
            if (
              inView &&
              EntityManager.getNodeType(_guidanceDefinition[i].tool)
                .VIEWTYPE === null
            )
              continue;
            else if (inView)
              tool = EntityManager.getNodeType(
                _guidanceDefinition[i].tool
              ).VIEWTYPE;
            else tool = _guidanceDefinition[i].tool;

            guidanceItem = new SelectToolGuidance(
              _guidanceDefinition[i].id,
              _guidanceDefinition[i].label,
              tool,
              that,
              _guidanceDefinition[i].icon
            );
            break;
          case "SET_PROPERTY_GUIDANCE":
            var entity = EntityManager.findNode(
              _guidanceDefinition[i].entityId
            );
            if (!entity)
              entity = EntityManager.findEdge(_guidanceDefinition[i].entityId);
            guidanceItem = new SetPropertyGuidance(
              _guidanceDefinition[i].id,
              _guidanceDefinition[i].label,
              entity,
              _guidanceDefinition[i].propertyName,
              that
            );
            break;
          case "COLLABORATION_GUIDANCE":
            guidanceItem = new CollaborationGuidance(
              "",
              _guidanceDefinition[i].label,
              _guidanceDefinition[i].activityId,
              _guidanceDefinition[i].objectId,
              that
            );
            break;
          case "GHOST_EDGE_GUIDANCE":
            var relationshipType;
            if (
              inView &&
              EntityManager.getEdgeType(_guidanceDefinition[i].relationshipType)
                .VIEWTYPE === undefined
            )
              continue;
            else if (inView) {
              relationshipType = EntityManager.getEdgeType(
                _guidanceDefinition[i].relationshipType
              ).VIEWTYPE;
            } else {
              relationshipType = _guidanceDefinition[i].relationshipType;
            }
            that.showGhostEdge(
              _guidanceDefinition[i].sourceId,
              _guidanceDefinition[i].targetId,
              relationshipType
            );
            break;
        }
        if (guidanceItem) _guidanceBox.addGuidance(guidanceItem);
      }

      _guidanceBox.addToCanvas(that);
      _guidanceBox.draw();
    };

    this.hideGuidanceBox = function () {
      if (_guidanceBox !== null) _guidanceBox.remove();
      _guidanceBox = null;
      for (var i = 0; i < _ghostEdges.length; i++) {
        _ghostEdges[i].remove();
      }
      _ghostEdges = [];
    };

    /**
     * Set model attributes
     * @param {canvas_widget.ModelAttributesNode} node
     */
    this.setModelAttributesNode = function (node) {
      _modelAttributesNode = node;
    };

    /**
     * Get model attributes
     * @returns {canvas_widget.ModelAttributesNode}
     */
    this.getModelAttributesNode = function () {
      return _modelAttributesNode;
    };

    /**
     * Bind events for move tool
     */
    this.bindMoveToolEvents = function () {
      //Enable Canvas Dragging
      _$node.draggable("enable");

      // view_only is used by the CAE and allows to show a model in the Canvas which is not editable
      // therefore, the context menu in the Canvas must be disabled
      const widgetConfigMap = y.getMap("widgetConfig");
      var viewOnly = widgetConfigMap.get("view_only");

      //Define Node Rightclick Menu
      if (viewOnly) {
        // view only mode is activated, no context menu should be shown
        $.contextMenu({
          selector: "#" + _$node.attr("id"),
          build: function ($trigger, e) {
            return false;
          },
        });
        return;
      }
      // otherwise show normal context menu
      $.contextMenu({
        selector: "#" + _$node.attr("id"),
        zIndex: AbstractEntity.CONTEXT_MENU_Z_INDEX,
        build: function ($trigger, e) {
          if (_selectedEntity === null) {
            return {
              items: {
                addNode: {
                  name: "Add node..",
                  items: EntityManager.generateAddNodeMenu(
                    that,
                    e.originalEvent.offsetX,
                    e.originalEvent.offsetY
                  ),
                },
                hide: {
                  name: "Hide entities..",
                  items: {
                    nodes: {
                      name: "nodes..",
                      items: EntityManager.generateVisibilityNodeMenu("hide"),
                    },
                    edges: {
                      name: "edges..",
                      items: EntityManager.generateVisibilityEdgeMenu("hide"),
                    },
                  },
                },
                show: {
                  name: "Show entities..",
                  items: {
                    nodes: {
                      name: "nodes..",
                      items: EntityManager.generateVisibilityNodeMenu("show"),
                    },
                    edges: {
                      name: "edges..",
                      items: EntityManager.generateVisibilityEdgeMenu("show"),
                    },
                  },
                },
              },
            };
          } else {
            that.select(null);
            return false;
          }
        },
      });
    };

    /**
     * Bind events for move tool
     */
    this.unbindMoveToolEvents = function () {
      //Disable Canvas Dragging
      _$node.draggable("disable");

      if (_$node.transformable != null) {
        _$node.transformable("destroy");
      }

      //Unbind Node and Edge Events
      //this.select(null);
      //Disable Canvas Rightclick Menu
      _$node.unbind("contextmenu");
    };

    /**
     * Select an entity
     * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} entity
     */
    this.select = function (entity) {
      if (_selectedEntity != entity) {
        if (_selectedEntity) _selectedEntity.unselect();
        if (entity) entity.select();
      }

      var operation = new EntitySelectOperation(
        entity ? entity.getEntityId() : null,
        entity ? entity.getType() : null,
        _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
      );

      _iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.toNonOTOperation()
      );
      _iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.toNonOTOperation()
      );
      _iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.METADATA,
        operation.toNonOTOperation()
      );
      _iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.OPENAPI,
        operation.toNonOTOperation()
      );
      const selectionMap = y.getMap("select");
      const userMap = y.getMap("users");
      if (entity === null) {
        selectionMap.set(userMap.get(y.clientID), null);
      } else {
        selectionMap.set(userMap.get(y.clientID), entity.getEntityId());
      }
      _selectedEntity = entity;
    };

    /**
     * Get entity currently selected
     * @return {canvas_widget.AbstractNode|canvas_widget/AbstractEdge}
     */
    this.getSelectedEntity = function () {
      return _selectedEntity;
    };

    /**
     * Set zoom level (between 0.5 and 2, default is 1)
     * @param {number} zoom
     */
    this.setZoom = function (zoom) {
      if (zoom < 0.1 || zoom > 2) {
        return;
      }
      _zoom = zoom;

      _$node.css("transform", `scaleX(${zoom}) scaleY(${zoom})`);
      _$node.animate({
        transform: `scaleX(${zoom}) scaleY(${zoom})`,
      });

      window.jsPlumbInstance.setZoom(zoom);
      sendViewChangeOperation();
    };

    this.showGhostEdge = function (sourceId, targetId, relationshipType) {
      var source = EntityManager.findNode(sourceId);
      var target = EntityManager.findNode(targetId);
      if (!source || !target) {
        //console.error('GhostEdge guidance not possible. Bad params: src' + source + ' target: ' + target + ' type: ' + relationshipType);
        return;
      }
      var ghostEdgeGuidance = null;
      //Check if there already is a ghost edge between the two nodes
      for (var i = 0; i < _ghostEdges.length; i++) {
        var ghostEdge = _ghostEdges[i];
        var node1 = ghostEdge.getNode1();
        var node2 = ghostEdge.getNode2();
        if (
          (source == node1 && target == node2) ||
          (source == node2 && target == node1)
        ) {
          ghostEdgeGuidance = ghostEdge;
          break;
        }
      }
      if (!ghostEdgeGuidance) {
        ghostEdgeGuidance = new GhostEdgeGuidance(that, source, target);
        _ghostEdges.push(ghostEdgeGuidance);
      }
      if (
        EntityManager.getViewId() &&
        EntityManager.getLayer() === CONFIG.LAYER.MODEL
      ) {
        ghostEdgeGuidance.addEdge(
          EntityManager.getViewEdgeType(relationshipType),
          source,
          target
        );
      } else {
        ghostEdgeGuidance.addEdge(
          EntityManager.getEdgeType(relationshipType),
          source,
          target
        );
      }
      for (var j = 0; j < _ghostEdges.length; j++) {
        _ghostEdges[j].show();
      }
    };

    this.highlightEntity = function (entityId) {
      var entity = EntityManager.findNode(entityId);

      if (entity) entity.highlight("blue", "Set property");
      else {
        entity = EntityManager.findEdge(entityId);
        entity.highlight("blue");
      }
    };

    this.unhighlightEntity = function (entityId) {
      var entity = EntityManager.findNode(entityId);

      if (!entity) entity = EntityManager.findEdge(entityId);

      entity.unhighlight();
    };

    /**
     * Get zoom level
     * @returns {number}
     */
    this.getZoom = function () {
      return _zoom;
    };

    /**
     * Reset the currently mounted tool back to the Move Tool
     */
    this.resetTool = function () {
      var operation = new ToolSelectOperation(MoveTool.TYPE);

      _iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.PALETTE,
        operation.toNonOTOperation()
      );
      this.mountTool(MoveTool.TYPE);
      //this.callListeners(CONFIG.CANVAS.LISTENERS.RESET);
    };

    /**
     * Create a new node and draw it on the canvas
     * @param {string} type Type of node
     * @param {Number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {number} [zIndex] Position of node on z-axis
     * @param {boolean} containment containment
     * @param {object} [json] representation of node
     * @param {string} identifier the identifier of the node, if null a new id is generated
     * @param defaultAttributeValues May be used to set default values for node attributes.
     * @return {number} id of new node
     */
    this.createNode = function (
      type,
      left,
      top,
      width,
      height,
      zIndex,
      containment,
      json,
      identifier,
      historyFlag,
      defaultLabel,
      defaultAttributeValues
    ) {
      var id,
        oType = null;
      if (identifier) id = identifier;
      else id = Util.generateRandomId(24);
      zIndex = zIndex || AbstractEntity.maxZIndex + 1;

      if (
        EntityManager.getViewId() !== undefined &&
        EntityManager.getLayer() === CONFIG.LAYER.MODEL
      ) {
        oType = EntityManager.getViewNodeType(type).getTargetNodeType().TYPE;
      }

      var operation = new NodeAddOperation(
        id,
        type,
        left,
        top,
        width,
        height,
        zIndex,
        containment,
        json || null,
        EntityManager.getViewId(),
        oType,
        _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
        defaultLabel,
        defaultAttributeValues
      );
      try {
        propagateNodeAddOperation(operation);
      } catch (error) {
        console.error(error);
      }
      if (y) {
        const canvasMap = y.getMap("canvas");
        canvasMap.set(NodeAddOperation.TYPE, operation.toJSON());
      }
      if (!historyFlag) HistoryManager.add(operation);
      return id;
    };

    /**
     * Create a new edge and draw it on the canvas
     * @param {string} type Type of edge
     * @param {canvas_widget.AbstractNode} source Source node entity id
     * @param {canvas_widget.AbstractNode} target Target node entity id
     * @param {object} [json] representation of edge
     * @param {string} identifier the identifier of the edge
     * @return {number} id of new edge
     */
    this.createEdge = function (
      type,
      source,
      target,
      json,
      identifier,
      historyFlag
    ) {
      var id = null,
        oType = null;

      if (identifier) id = identifier;
      else id = Util.generateRandomId(24);
      if (
        EntityManager.getViewId() !== undefined &&
        EntityManager.getLayer() === CONFIG.LAYER.MODEL
      ) {
        oType = EntityManager.getViewEdgeType(type).getTargetEdgeType().TYPE;
      }
      var operation = new EdgeAddOperation(
        id,
        type,
        source,
        target,
        json || null,
        EntityManager.getViewId(),
        oType,
        _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
      );
      propagateEdgeAddOperation(operation);

      if (window.hasOwnProperty("y")) {
        const canvasMap = y.getMap("canvas");
        canvasMap.set(EdgeAddOperation.TYPE, operation.toJSON());
      }

      if (!historyFlag) HistoryManager.add(operation);
      return id;
    };

    this.scrollNodeIntoView = function (node) {
      if (!node) return;

      var frameOffset = $("#canvas-frame").offset();
      var frameWidth = $("#canvas-frame").width();
      var frameHeight = $("#canvas-frame").height();

      var nodeOffset = node.get$node().offset();
      var nodeWidth = node.get$node().width();
      var nodeHeight = node.get$node().height();

      var scrollX = nodeOffset.left - frameOffset.left;
      var scrollY = nodeOffset.top - frameOffset.top;
      var canvasTop = _$node.position().top;
      var canvasLeft = _$node.position().left;

      _$node.animate(
        {
          top: "+=" + (frameHeight / 2 - scrollY - nodeHeight / 2),
          left: "+=" + (frameWidth / 2 - scrollX - nodeWidth / 2),
        },
        1000
      );
    };

    this.scrollEdgeIntoView = function (edge) {
      if (!edge) return;
      var frameOffset = $("#canvas-frame").offset();
      var frameWidth = $("#canvas-frame").width();
      var frameHeight = $("#canvas-frame").height();

      var srcNode = edge.getSource();
      var targetNode = edge.getTarget();

      var srcNodeOffset = srcNode.get$node().offset();
      var srcNodeWidth = srcNode.get$node().width();
      var srcNodeHeight = srcNode.get$node().height();

      var targetNodeOffset = targetNode.get$node().offset();
      var targetNodeWidth = targetNode.get$node().width();
      var targetNodeHeight = targetNode.get$node().height();

      var scrollX =
        (srcNodeOffset.left + targetNodeOffset.left) / 2 - frameOffset.left;
      var scrollY =
        (srcNodeOffset.top + targetNodeOffset.top) / 2 - frameOffset.top;
      var canvasTop = _$node.position().top;
      var canvasLeft = _$node.position().left;

      _$node.animate(
        {
          top:
            "+=" +
            (frameHeight / 2 -
              scrollY -
              Math.max(srcNodeHeight, targetNodeHeight) / 2),
          left:
            "+=" +
            (frameWidth / 2 -
              scrollX -
              Math.max(srcNodeWidth, targetNodeWidth) / 2),
        },
        1000
      );
    };

    this.scrollEntityIntoView = function (entityId) {
      if (!entityId) return null;
      if (entityId.indexOf("[") != -1 && entityId.indexOf("]") != -1)
        entityId = entityId.replace(/\[\w*\]/g, "");
      var entity = EntityManager.findNode(entityId);
      if (!entity) {
        entity = EntityManager.findEdge(entityId);
        if (!entity) return null;
        else that.scrollEdgeIntoView(entity);
      } else that.scrollNodeIntoView(entity);
      return true;
    };

    /**
     * Convert current canvas content to PNG image file
     * @return {string} Data-URI of generated PNG image
     */
    this.toPNG = function () {
      var $renderedCanvas = $("<canvas></canvas>")
          .insertAfter(_$node)
          .attr("width", _$node.width())
          .attr("height", _$node.height()),
        ctx = $renderedCanvas[0].getContext("2d"),
        deferred = $.Deferred(),
        promises = [],
        oldZoom = this.getZoom();

      $("#loading").show();

      this.setZoom(1);

      canvasOffset = _$node.offset();

      ctx.beginPath();
      ctx.rect(0, 0, _canvasWidth, _canvasHeight);
      ctx.fillStyle = _$node.css("backgroundColor");
      ctx.fill();

      _.each(
        _.sortBy($.makeArray(_$node.children()), function (e) {
          return $(e).css("zIndex");
        }),
        function (e) {
          var $this = $(e);
          if (
            typeof $this.attr("id") === "undefined" ||
            (!$this.attr("id").startsWith("modelAttributes") &&
              !$this.attr("id").endsWith("awareness"))
          ) {
            promises.push(convertNodeTreeToCanvas($this, ctx));
          }
        }
      );

      $.when.apply($, promises).then(function () {
        var tempCanvas = document.createElement("canvas"),
          tCtx = tempCanvas.getContext("2d"),
          minLeft = _canvasWidth,
          minTop = _canvasHeight,
          maxRight = 0,
          maxBottom = 0,
          nodes = EntityManager.getNodes(),
          nodeId,
          appearance,
          width,
          height,
          padding = 20,
          nodeExists = false;

        for (nodeId in nodes) {
          if (nodes.hasOwnProperty(nodeId)) {
            nodeExists = true;
            appearance = nodes[nodeId].getAppearance();
            //noinspection JSAccessibilityCheck
            minLeft = Math.min(minLeft, appearance.left);
            minTop = Math.min(minTop, appearance.top);
            //noinspection JSAccessibilityCheck
            maxRight = Math.max(maxRight, appearance.left + appearance.width);
            maxBottom = Math.max(maxBottom, appearance.top + appearance.height);
          }
        }

        if (!nodeExists) {
          minLeft = _canvasWidth / 2;
          minTop = _canvasHeight / 2;
          maxRight = _canvasWidth / 2;
          maxBottom = _canvasHeight / 2;
        }

        minLeft -= padding;
        minTop -= padding;
        maxRight += padding;
        maxBottom += padding;

        width = maxRight - minLeft;
        height = maxBottom - minTop;

        tempCanvas.width = width;
        tempCanvas.height = height;

        tCtx.drawImage(
          $renderedCanvas[0],
          minLeft,
          minTop,
          width,
          height,
          0,
          0,
          width,
          height
        );

        that.setZoom(oldZoom);
        $("#loading").hide();
        deferred.resolve(tempCanvas.toDataURL());
      });

      return deferred.promise();
    };

    /**
     * Draw DOM node onto canvas
     * @param $node jquery object of node
     * @param ctx Canvas context
     * @returns {promise}
     */
    var convertNodeTreeToCanvas = function ($node, ctx) {
      function drawSVGOnCanvas(ctx, svgMarkup, x, y) {
        var svg = new Blob([svgMarkup], {
            type: "image/svg+xml;charset=utf-8",
          }),
          DOMURL = self.URL || self.webkitURL || self,
          url = DOMURL.createObjectURL(svg),
          img = new Image(),
          deferred = $.Deferred();

        img.onload = function () {
          ctx.drawImage(img, x, y);
          DOMURL.revokeObjectURL(url);
          deferred.resolve();
        };
        img.src = url;
        setTimeout(function () {
          deferred.resolve();
        }, 500);
        return deferred.promise();
      }

      function convertNodeToSVG($node) {
        if ($node[0].nodeType === Node.TEXT_NODE) {
          if ($.trim($node.text()) === "") {
            return $.Deferred().resolve().promise();
          } else {
            $node = $node.wrap($("<span></span>")).parent();
          }
        }

        if (!$node.is(":visible")) {
          return $.Deferred().resolve().promise();
        }

        var height = $node.height(),
          width = $node.width(),
          padding = {
            left: parseInt($node.css("paddingLeft"), 10),
            top: parseInt($node.css("paddingTop"), 10),
            right: parseInt($node.css("paddingRight"), 10),
            bottom: parseInt($node.css("paddingBottom"), 10),
          },
          border = {
            width: parseInt($node.css("borderWidth")),
            color: $node.css("borderColor"),
            left: {
              width: parseInt($node.css("borderLeftWidth")),
              color: $node.css("borderLeftColor"),
            },
            top: {
              width: parseInt($node.css("borderTopWidth")),
              color: $node.css("borderTopColor"),
            },
            right: {
              width: parseInt($node.css("borderRightWidth")),
              color: $node.css("borderRightColor"),
            },
            bottom: {
              width: parseInt($node.css("borderBottomWidth")),
              color: $node.css("borderBottomColor"),
            },
          },
          borderMarkup = [],
          backgroundColor = $node.css("backgroundColor"),
          color = $node.css("color"),
          font = $node.css("font"),
          fontSize = parseInt($node.css("fontSize"), 10),
          textDecoration = $node.css("textDecoration").split(" ")[0],
          offset = $node.offset(),
          value,
          textX,
          textY = height,
          textAnchor,
          contents = $node.contents();

        if ($node[0].nodeName.toLowerCase() === "svg") {
          $node.attr("width", width);
          $node.attr("height", height);

          return drawSVGOnCanvas(
            ctx,
            $node[0].outerHTML
              .replace(/style="[^"]*"/, "")
              .replace(
                /http:\/\/www\.w3\.org\/1999\/xhtml/g,
                "http://www.w3.org/2000/svg"
              ),
            offset.left - canvasOffset.left,
            offset.top - canvasOffset.top
          );
        }

        if (contents.length === 1 && contents[0].nodeType === Node.TEXT_NODE) {
          value = $node.text();
        } else {
          value = $node.val();
        }

        var tagsToReplace = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
        };

        value = $.trim(value).replace(/[&<>]/g, function (tag) {
          return tagsToReplace[tag] || tag;
        });

        switch ($node.css("textAlign")) {
          case "right":
            textX = width;
            textAnchor = "right";
            break;
          case "center":
            textX = width / 2;
            textAnchor = "middle";
            break;
          default:
          case "left":
            textX = 0;
            textAnchor = "left";
            break;
        }

        textX += padding.left;
        textY +=
          padding.top + border.width - Math.ceil((height - fontSize) / 2) - 1;
        height += padding.top + padding.bottom + 2 * border.width;
        width += padding.left + padding.right + 2 * border.width;

        if (
          border.color.split(" ").length !== 1 ||
          border.width.split(" ").length !== 1
        ) {
          border.width = 0;
          if (border.left.width > 0) {
            borderMarkup.push(
              '<line x1="0" y1="0" x2="0" y2="' +
                height +
                '" style="stroke:' +
                border.left.color +
                "; stroke-width:" +
                border.left.width +
                '" />'
            );
          }
          if (border.top.width > 0) {
            borderMarkup.push(
              '<line x1="0" y1="0" x2="' +
                width +
                '" y2="0" style="stroke:' +
                border.top.color +
                "; stroke-width:" +
                border.top.width +
                '" />'
            );
          }
          if (border.right.width > 0) {
            borderMarkup.push(
              '<line x1="' +
                width +
                '" y1="0" x2="' +
                width +
                '" y2="' +
                height +
                '" style="stroke:' +
                border.right.color +
                "; stroke-width:" +
                border.right.width +
                '" />'
            );
          }
          if (border.bottom.width > 0) {
            borderMarkup.push(
              '<line x1="0" y1="' +
                height +
                '" x2="' +
                width +
                '" y2="' +
                height +
                '" style="stroke:' +
                border.bottom.color +
                "; stroke-width:" +
                border.bottom.width +
                '" />'
            );
          }
        }

        return drawSVGOnCanvas(
          ctx,
          '<svg xmlns="http://www.w3.org/2000/svg" width="' +
            width +
            '" height="' +
            height +
            '">' +
            '<rect x="0" y="0" width="' +
            width +
            '" height="' +
            height +
            '" fill="' +
            backgroundColor +
            '" style="stroke: ' +
            border.color +
            "; stroke-width: " +
            border.width +
            '"/>' +
            borderMarkup.join("\n") +
            '<text x="' +
            textX +
            '" y="' +
            textY +
            '" fill="' +
            color +
            '" style="text-anchor: ' +
            textAnchor +
            "; font: " +
            font +
            "; text-decoration: " +
            textDecoration +
            ';">' +
            value +
            "</text>" +
            "</svg>",
          offset.left - canvasOffset.left,
          offset.top - canvasOffset.top
        );
      }

      var contents = $node.contents();

      return convertNodeToSVG($node).then(function () {
        var promises = [];
        if (contents.length !== 1 || contents[0].nodeType !== Node.TEXT_NODE) {
          contents.each(function () {
            var $this = $(this);
            if ($node[0].nodeName.toLowerCase() !== "svg") {
              promises.push(convertNodeTreeToCanvas($this, ctx));
            }
          });
        }
        return $.when.apply($, promises).then(function () {
          return true;
        });
      });
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwcw.registerOnDataReceivedCallback(localToolSelectCallback);
      _iwcw.registerOnDataReceivedCallback(localExportMetaModelCallback);
      _iwcw.registerOnDataReceivedCallback(
        localExportLogicalGuidanceRepresentationCallback
      );
      _iwcw.registerOnDataReceivedCallback(localExportImageCallback);
      _iwcw.registerOnDataReceivedCallback(localShowGuidanceBoxCallback);
      _iwcw.registerOnDataReceivedCallback(
        localRevokeSharedActivityOperationCallback
      );
      _iwcw.registerOnDataReceivedCallback(localMoveCanvasOperation);
      _iwcw.registerOnDataReceivedCallback(
        localGuidanceStrategyOperationCallback
      );
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwcw.unregisterOnDataReceivedCallback(localToolSelectCallback);
      _iwcw.unregisterOnDataReceivedCallback(localExportMetaModelCallback);
      _iwcw.unregisterOnDataReceivedCallback(
        localExportLogicalGuidanceRepresentationCallback
      );
      _iwcw.unregisterOnDataReceivedCallback(localExportImageCallback);
      _iwcw.unregisterOnDataReceivedCallback(localShowGuidanceBoxCallback);
      _iwcw.unregisterOnLocalDataReceivedCallback(
        localRevokeSharedActivityOperationCallback
      );
      _iwcw.unregisterOnLocalDataReceivedCallback(localMoveCanvasOperation);
      _iwcw.unregisterOnLocalDataReceivedCallback(
        localGuidanceStrategyOperationCallback
      );
    };

    init();

    if (window.hasOwnProperty("y")) {
      const canvasMap = y.getMap("canvas");
      canvasMap.observe(function (event) {
        var yUserId = event.currentTarget.doc.clientID;

        event.keysChanged.forEach(function (key) {
          const data = event.currentTarget.get(key);
          const eventTriggeredLocally = window.y.clientID === data.triggeredBy;
          if (!eventTriggeredLocally || data.historyFlagSet) {
            const userMap = y.getMap("users");
            var jabberId = userMap.get(yUserId);
            var operation;

            switch (key) {
              case NodeAddOperation.TYPE: {
                operation = new NodeAddOperation(
                  data.id,
                  data.type,
                  data.left,
                  data.top,
                  data.width,
                  data.height,
                  data.zIndex,
                  data.containment,
                  data.json,
                  data.viewId,
                  data.oType,
                  jabberId || data.jabberId,
                  data.defaultLabel,
                  data.defaultAttributeValues
                );
                remoteNodeAddCallback(operation);
                break;
              }
              case EdgeAddOperation.TYPE: {
                operation = new EdgeAddOperation(
                  data.id,
                  data.type,
                  data.source,
                  data.target,
                  data.json,
                  data.viewId,
                  data.oType,
                  jabberId || data.jabberId
                );
                remoteEdgeAddCallback(operation);
                break;
              }
              case RevokeSharedActivityOperation.TYPE: {
                operation = new RevokeSharedActivityOperation(data.id);
                remoteRevokeSharedActivityOperationCallback(operation);
                break;
              }
              case GuidanceStrategyOperation.TYPE: {
                operation = new GuidanceStrategyOperation(data.data);
                remoteGuidanceStrategyOperation(operation);
                break;
              }
              case "ViewApplyActivity": {
                var activityOperation = new ActivityOperation(
                  "ViewApplyActivity",
                  event.value.viewId,
                  event.value.jabberId
                );
                const activityMap = y.getMap("activity");

                activityMap.set(
                  ActivityOperation.TYPE,
                  activityOperation.toJSON()
                );
                break;
              }
              case "triggerSave": {
                if (data.value === _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID])
                  $("#save").click();
                break;
              }
              case "applyLayout": {
                //remote user
                DagreLayout.apply();
                jsPlumbInstance.repaintEverything();
                break;
              }
              //used by the syncmeta-plugin only
              case "highlight": {
                var userId = _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID];
                if (!event.value.remote && userId !== event.value.userId)
                  return;

                // when an entity (or multiple entities) get highlighted, then
                // one of them can be selected where the canvas should move to
                if (event.value.moveCanvasToEntity) {
                  var entityId = event.value.moveCanvasToEntity;
                  var entity = EntityManager.find(entityId);

                  // move canvas to entity
                  that.scrollEntityIntoView(entityId);

                  // select the entity (note: this needs to be done before the highlighting,
                  // because otherwise the "select" overwrites the highlighting)
                  that.select(entity);
                }

                // highlight entity/entities
                for (var i = 0; i < event.value.entities.length; i++) {
                  var entityId = event.value.entities[i];
                  var entity = EntityManager.find(entityId);
                  if (entity) {
                    entity.highlight(event.value.color, event.value.label);
                  }
                }

                break;
              }
              //used by the syncmeta-plugin only
              case "unhighlight": {
                var userId = _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID];
                if (!event.value.remote && userId !== event.value.userId)
                  return;
                for (var i = 0; i < event.value.entities.length; i++) {
                  var entityId = event.value.entities[i];
                  var entity = EntityManager.find(entityId);
                  if (entity) {
                    entity.unhighlight();
                  }
                }
                break;
              }
              //used by the syncmeta-plugin only
              case NodeDeleteOperation.TYPE: {
                var userId = _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID];
                const nodesMap = y.getMap("nodes");
                if (event.value.jabberId === userId)
                  nodesMap.delete(event.value.entityId);
                setTimeout(function () {
                  $("#save").click();
                }, 300);
                break;
              }
              //used by the syncmeta-plugin only
              case EdgeDeleteOperation.TYPE: {
                break;
              }
            }
            //local user. todo ugly coding style
          } else if (key === "applyLayout") {
            DagreLayout.apply();
            $("#save").click();
          }
        });
      });
      const selectionMap = y.getMap("select");
      selectionMap.observe(function (event) {
        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key, change]) => {
          const userMap = y.getMap("users");
          if (key !== userMap.get(y.clientID)) {
            const userList = y.getMap("userList");
            var userInfo = userList.get(key);
            if (event.oldValue != null) {
              var unselectedEntity = EntityManager.find(event.oldValue);
              if (unselectedEntity) unselectedEntity.unhighlight();
            }

            if (event.value != null) {
              var selectedEntity = EntityManager.find(event.value);
              if (selectedEntity)
                selectedEntity.highlight(
                  Util.getColor(userInfo.globalId),
                  userInfo[CONFIG.NS.PERSON.TITLE]
                );
            }
          }
        });
      });
      const nodesMap = y.getMap("nodes");
      nodesMap.observe(function (event) {
        if (eventWasTriggeredByMe(event)) return;

        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key, change]) => {
          switch (change.action) {
            case "delete": {
              var node = EntityManager.findNode(key);
              if (node)
                node.remoteNodeDeleteCallback(new NodeDeleteOperation(key));
              break;
            }
          }
        });
      });
      const edgeMap = y.getMap("edges");
      edgeMap.observe(function (event) {
        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key, change]) => {
          switch (change.action) {
            case "delete": {
              var edge = EntityManager.findEdge(key);
              if (edge)
                edge.remoteEdgeDeleteCallback(new EdgeDeleteOperation(key));
              break;
            }
          }
        });
      });
    }
    if (_iwcw) {
      that.registerCallbacks();
    }
  }
  width;
  height;
}
