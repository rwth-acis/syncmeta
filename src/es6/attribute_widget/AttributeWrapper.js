import IWCW from "../lib/IWCWrapper";
import EntitySelectOperation from "../operations/non_ot/EntitySelectOperation";
import { EntityManagerInstance as EntityManager } from "./EntityManager";
import { CONFIG } from "../config";
import {
  EdgeAddOperation,
  EdgeDeleteOperation,
} from "../operations/ot/EntityOperation";
import { NodeAddOperation } from "../operations/ot/EntityOperation";
import { Map as YMap } from "yjs";
/**
 * AttributeWrapper
 * @class attribute_widget.AttributeWrapper
 * @memberof attribute_widget
 * @constructor
 * @param {jQuery} $node jquery Selector of wrapper node
 */
class AttributeWrapper {
  constructor($node) {
    var that = this;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $node;

    /**
     * Entity currently selected
     * @type {attribute_widget.AbstractNode|attribute_widget/AbstractEdge}
     * @private
     */
    var _selectedEntity = null;

    /**
     * Model attributes
     * @type {attribute_widget.ModelAttributesNode}
     * @private
     */
    var _modelAttributesNode = null;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    //var _nodes = {};
    /**
     * Callback for a Entity Select Operation
     * @param {operations.non_ot.EntitySelectOperation} operation
     */
    var entitySelectCallback = function (operation) {
      if (
        operation instanceof EntitySelectOperation &&
        operation.getSelectedEntityId() === null
      ) {
        that.select(_modelAttributesNode);
        if ($node.is(":hidden")) $node.show();
        $(".ace-container").hide();
      }
    };

    /**
     * Callback for an Node Add Operation
     * @param {operations.ot.NodeAddOperation} operation
     */
    var nodeAddCallback = function (operation) {
      if (operation instanceof NodeAddOperation) {
        var node, type, viewType;

        if (
          operation.getViewId() === EntityManager.getViewId() ||
          EntityManager.getLayer() === CONFIG.LAYER.META
        ) {
          type = operation.getType();
        } else {
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
        }

        var json = operation.getJSON();
        if (json) {
          node = EntityManager.createNodeFromJSON(
            type,
            operation.getEntityId(),
            operation.getLeft(),
            operation.getTop(),
            operation.getWidth(),
            operation.getHeight(),
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
            operation.getContainment()
          );
        }
        node.addToWrapper(that);
      }
    };

    /**
     * Callback for an Edge Add Operation
     * @param {operations.ot.EdgeAddOperation} operation
     */
    var edgeAddCallback = function (operation) {
      if (operation instanceof EdgeAddOperation) {
        var edge, type, viewType;

        if (
          operation.getViewId() === EntityManager.getViewId() ||
          EntityManager.getLayer() === CONFIG.LAYER.META
        ) {
          type = operation.getType();
        } else {
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
        }
        var json = operation.getJSON();
        if (json) {
          edge = EntityManager.createEdgeFromJSON(
            type,
            operation.getEntityId(),
            operation.getSource(),
            operation.getTarget(),
            json
          );
        } else {
          const source = EntityManager.findNode(operation.getSource()),
            target = EntityManager.findNode(operation.getTarget());
          if (!source || !target) {
            throw new Error(
              "Source or target node not found for edge " +
                operation.getEntityId()
            );
          }
          edge = EntityManager.createEdge(
            type,
            operation.getEntityId(),
            source,
            target
          );
        }
        edge.addToWrapper(that);
      }
    };

    /**
     * Get jQuery object of DOM node representing the node
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Set model attributes
     * @param node {attribute_widget.ModelAttributesNode}
     */
    this.setModelAttributesNode = function (node) {
      _modelAttributesNode = node;
    };

    /**
     * Get model Attributes
     * @returns {attribute_widget.ModelAttributesNode}
     */
    this.getModelAttributesNode = function () {
      return _modelAttributesNode;
    };

    /**
     * Select an entity
     * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} entity
     */
    this.select = function (entity) {
      if (_selectedEntity != entity) {
        if (_selectedEntity) _selectedEntity.unselect();
        if (entity) entity.select();
        _selectedEntity = entity;
      }
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      iwc.registerOnDataReceivedCallback(entitySelectCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      iwc.unregisterOnDataReceivedCallback(entitySelectCallback);
    };

    if (iwc) {
      that.registerCallbacks();
    }

    if (y) {
      const nodesMap = y.getMap("nodes");
      nodesMap.observeDeep(([event]) => {
        Array.from(event.changes.keys.entries()).forEach(function (entry) {
          const key = entry[0];
          const action = entry[1].action;
          if (action !== "add" || key.match(/\[(\w+?)\]/)) return;

          let nodeId;
          if (
            event.target.get(key) instanceof YMap &&
            event.target.get(key).has("jabberId")
          ) {
            nodeId = nodesMap.get(key).get("id");
            const newNode = event.target.get(key);
            nodeAddCallback(
              new NodeAddOperation(
                newNode.get("id"),
                newNode.get("type"),
                newNode.get("left"),
                newNode.get("top"),
                newNode.get("width"),
                newNode.get("height"),
                newNode.get("zIndex"),
                newNode.get("containment"),
                newNode.get("json"),
                null,
                null,
                newNode.has("jabberId")
              )
            );
          } else {
            nodeId = event.target.get("id");
          }

          var node = EntityManager.findNode(nodeId);
          if (!node) return;

          //Check for label
          if (node && node.getLabel().getEntityId() === key)
            node.getLabel().getValue().registerYType(event.target.get(key));
          else {
            var attrs = null;

            if (EntityManager.getLayer() === CONFIG.LAYER.META) {
              attrs = node.getAttribute("[attributes]");
              if (!attrs) attrs = node.getAttributes();
              else attrs = attrs.getAttributes();
              var attrId = key.replace(/\[\w*\]/g, "");
              if (attrs.hasOwnProperty(attrId)) {
                var attr = attrs[attrId];
                if (attr.hasOwnProperty("getKey")) {
                  if (key.indexOf("ref") != -1)
                    attr.getRef().registerYType(event.target.get(key));
                  else if (
                    attr.getKey().hasOwnProperty("registerYType") &&
                    key.indexOf("value") === -1
                  )
                    attr.getKey().registerYType(event.target.get(key));
                } else if (attr.hasOwnProperty("getValue")) {
                  if (attr.getValue().hasOwnProperty("registerYType"))
                    attr.getValue().registerYType(event.target.get(key));
                }
              } else if (attrs.hasOwnProperty(key)) {
                var attr = attrs[key];
                if (attr.getValue().hasOwnProperty("registerYType"))
                  attr.getValue().registerYType(event.target.get(key));
              }
            } else {
              attrs = node.getAttributes();
              for (var attrKey in attrs) {
                if (attrs.hasOwnProperty(attrKey)) {
                  var attr = attrs[attrKey];
                  if (
                    attr.getEntityId() === key &&
                    attr.getValue().registerYType
                  ) {
                    attr.getValue().registerYType(event.target.get(key));
                  }
                }
              }
            }
          }
        });
      });
      const edgesMap = y.getMap("edges");
      edgesMap.observe(function (event) {
        const array = Array.from(event.changes.keys.entries());
        array.forEach(function (entry) {
          const key = entry[0];
          const action = entry[1].action;
          if (action !== "add") return;

          const jabberId = edgesMap.get(key).get("jabberId");
          if (!jabberId) return;

          const map = event.currentTarget.get(key);

          edgeAddCallback(
            new EdgeAddOperation(
              map.get("id"),
              map.get("type"),
              map.get("source"),
              map.get("target"),
              null,
              null,
              null,
              jabberId
            )
          );
          var edge = EntityManager.findEdge(map.get("id"));
          if (!edge) {
            throw new Error("edge is null");
          }
          var attrs = edge.getAttributes();
          if (edge.getLabel().getEntityId() === key)
            edge.getLabel().getValue().registerYType(map.get(key));
          else {
            var attrs = edge.getAttributes();
            for (var attrKey in attrs) {
              if (attrs.hasOwnProperty(attrKey)) {
                if (attrs[attrKey].getEntityId() === key) {
                  var attr = attrs[attrKey];
                  if (attr.getValue().hasOwnProperty("registerYType"))
                    attr.getValue().registerYType(map.get(key));
                }
              }
            }
          }
        });
      });
    }
    this.select(_modelAttributesNode);
  }
}

export default AttributeWrapper;
