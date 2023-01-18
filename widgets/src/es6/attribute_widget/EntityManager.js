import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import { default as _ } from "lodash-es";
import LogicalConjunctions from "../canvas_widget/viewpoint/LogicalConjunctions";
import LogicalOperator from "../canvas_widget/viewpoint/LogicalOperator";
import ViewTypesUtil from "../canvas_widget/viewpoint/ViewTypesUtil";
import { CONFIG } from "../config";
import { default as loadHTML } from "../html.template.loader";
import { default as IWCW } from "../lib/IWCWrapper";
import { default as EntitySelectOperation } from "../operations/non_ot/EntitySelectOperation";
import {
  EdgeDeleteOperation,
  NodeDeleteOperation,
} from "../operations/ot/EntityOperation";
import Util from "../Util";
import { default as AbstractEntity } from "./AbstractEntity";
import { default as BooleanAttribute } from "./BooleanAttribute";
import { default as FileAttribute } from "./FileAttribute";
import { default as IntegerAttribute } from "./IntegerAttribute";
import KeySelectionValueListAttribute from "./KeySelectionValueListAttribute";
import KeySelectionValueSelectionValueListAttribute from "./KeySelectionValueSelectionValueListAttribute";
import QuizAttribute from "./QuizAttribute";
import SingleCodeEditorValueAttribute from "./SingleCodeEditorValueAttribute";
import SingleColorValueAttribute from "./SingleColorValueAttribute";
import SingleMultiLineValueAttribute from "./SingleMultiLineValueAttribute";
import { default as SingleSelectionAttribute } from "./SingleSelectionAttribute";
import { default as SingleValueAttribute } from "./SingleValueAttribute";
import SingleValueListAttribute from "./SingleValueListAttribute";
import ViewEdge from "./view/ViewEdge";
import ViewNode from "./view/ViewNode";
import ConditionListAttribute from "./viewpoint/ConditionListAttribute";
import RenamingListAttribute from "./viewpoint/RenamingListAttribute";

const relationshipNodeHtml = await loadHTML(
  "../../templates/attribute_widget/relationship_node.html",
  import.meta.url
);

const relationshipGroupNodeHtml = await loadHTML(
  "../../templates/attribute_widget/relationship_group_node.html",
  import.meta.url
);
const objectNodeHtml = await loadHTML(
  "../../templates/attribute_widget/object_node.html",
  import.meta.url
);

const nodeShapeNodeHtml = await loadHTML(
  "../../templates/attribute_widget/node_shape_node.html",
  import.meta.url
);

const modelAttributesNodeHtml = await loadHTML(
  "../../templates/attribute_widget/model_attributes_node.html",
  import.meta.url
);

const enumNodeHtml = await loadHTML(
  "../../templates/attribute_widget/enum_node.html",
  import.meta.url
);

const edgeShapeNodeHtml = await loadHTML(
  "../../templates/attribute_widget/edge_shape_node.html",
  import.meta.url
);
const abstractEdgeHtml = await loadHTML(
  "../../templates/attribute_widget/abstract_edge.html",
  import.meta.url
);

const abstractClassNodeHtml = await loadHTML(
  "../../templates/attribute_widget/abstract_class_node.html",
  import.meta.url
);

const abstractNodeHtml = await loadHTML(
  "../../templates/attribute_widget/abstract_node.html",
  import.meta.url
);

const nodeHtml = await loadHTML(
  "../../templates/attribute_widget/node.html",
  import.meta.url
);

/**
 * EntityManager
 * @class attribute_widget.EntityManager
 * @memberof attribute_widget
 * @constructor
 */
function EntityManager() {
  var metamodel = null;

  var _layer = null;

  /**
   * Different node types
   * @type {object}
   */
  var nodeTypes = {};
  /**
   * Different edge types
   * @type {object}
   */
  var edgeTypes = {};
  var relations = {};

  var _initNodeTypes = function (vls) {
    var nodes = vls.nodes,
      node;
    var _nodeTypes = {};
    for (var nodeId in nodes) {
      if (nodes.hasOwnProperty(nodeId)) {
        node = nodes[nodeId];
        if (
          node.hasOwnProperty("targetName") &&
          !$.isEmptyObject(nodeTypes) &&
          nodeTypes.hasOwnProperty(node.targetName)
        ) {
          _nodeTypes[node.label] = ViewNode(
            node.label,
            node.attributes,
            nodeTypes[node.targetName]
          );
          nodeTypes[node.targetName].VIEWTYPE = node.label;
        } else {
          _nodeTypes[node.label] = makeNode(
            node.label,
            node.shape.shape,
            node.shape.customShape,
            node.shape.customAnchors,
            node.shape.color,
            node.attributes
          );
        }
      }
    }
    return _nodeTypes;
  };
  var _initEdgeTypes = function (vls) {
    var edges = vls.edges,
      edge;
    var _edgeTypes = {},
      _relations = {};

    for (var edgeId in edges) {
      if (edges.hasOwnProperty(edgeId)) {
        edge = edges[edgeId];
        if (
          edge.hasOwnProperty("targetName") &&
          !$.isEmptyObject(edgeTypes) &&
          edgeTypes.hasOwnProperty(edge.targetName)
        ) {
          _edgeTypes[edge.label] = ViewEdge(
            edge.attributes,
            edgeTypes[edge.targetName]
          );
          edgeTypes[edge.targetName].VIEWTYPE = edge.label;
        } else {
          _edgeTypes[edge.label] = makeEdge(
            edge.label,
            edge.shape.arrow,
            edge.shape.shape,
            edge.shape.color,
            edge.shape.overlay,
            edge.shape.overlayPosition,
            edge.shape.overlayRotate,
            edge.attributes
          );
        }
        _relations[edge.label] = edge.relations;
      }
    }
    return {
      edgeTypes: _edgeTypes,
      relations: _relations,
    };
  };

  /**
   * Model attributes node
   * @type {attribute_widget.ModelAttributesNode}
   */
  var _modelAttributesNode = null;
  /**
   * Nodes of the graph
   * @type {{}}
   */
  var _nodes = {};
  /**
   * Edges of the graph
   * @type {{}}
   */

  var _map = {};

  /**
   * the view id indicates if the EntityManager should use View types for modeling or node types
   * @type {string}
   * @private
   */
  var viewId = null;

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

  var _edges = {};

  //noinspection JSUnusedGlobalSymbols
  return {
    /**
     * Create a new node
     * @memberof attribute_widget.EntityManager#
     * @param {string} type Type of node
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {object} json  the json representation of the node
     * @returns {attribute_widget.AbstractNode}
     */
    createNode: function (
      type,
      id,
      left,
      top,
      width,
      height,
      containment,
      json
    ) {
      var node;

      if (viewNodeTypes.hasOwnProperty(type) && viewId) {
        node = viewNodeTypes[type](id, left, top, width, height, json);
      } else if (nodeTypes.hasOwnProperty(type)) {
        node = new nodeTypes[type](id, left, top, width, height, json);
      }
      _nodes[id] = node;
      return node;
    },
    /**
     * Create model Attributes node
     * @returns {attribute_widget.ModelAttributesNode}
     */
    createModelAttributesNode: function () {
      if (_modelAttributesNode === null)
        if (metamodel)
          return new ModelAttributesNode(
            "modelAttributes",
            metamodel.attributes
          );
        else return new ModelAttributesNode("modelAttributes", null);
      return null;
    },
    /**
     * Find node by id
     * @memberof attribute_widget.EntityManager#
     * @param {string} id Entity id
     * @returns {attribute_widget.AbstractNode}
     */
    findNode: function (id) {
      if (_nodes.hasOwnProperty(id)) {
        return _nodes[id];
      }
      return null;
    },
    /**
     * Delete node by id
     * @memberof attribute_widget.EntityManager#
     * @param {string} id Entity id
     */
    deleteNode: function (id) {
      if (_nodes.hasOwnProperty(id)) {
        delete _nodes[id];
      }
    },
    /**
     * Get nodes by type
     * @memberof attribute_widget.EntityManager#
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
     * Create a new edge
     * @memberof attribute_widget.EntityManager#
     * @param {string} type Type of edge
     * @param {string} id Entity identifier of edge
     * @param {attribute_widget.AbstractNode} source Source node
     * @param {attribute_widget.AbstractNode} target Target node
     * @returns {attribute_widget.AbstractEdge}
     */
    createEdge: function (type, id, source, target) {
      if (!source || !target) {
        throw new Error("Source or target node is not defined");
      }
      var edge;

      if (viewId && viewEdgeTypes.hasOwnProperty(type)) {
        edge = viewEdgeTypes[type](id, source, target);
      } else if (edgeTypes.hasOwnProperty(type)) {
        edge = new edgeTypes[type](id, source, target);
      }
      source.addOutgoingEdge(edge);
      target.addIngoingEdge(edge);
      _edges[id] = edge;

      return edge;
    },
    /**
     * Find edge by id
     * @memberof attribute_widget.EntityManager#
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
     * @memberof attribute_widget.EntityManager#
     * @param {string} id Entity id
     */
    deleteEdge: function (id) {
      if (_edges.hasOwnProperty(id)) {
        delete _edges[id];
      }
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
     * Create model attributes node by its JSON representation
     * @memberof attribute_widget.EntityManager#
     * @param {object} json JSON representation
     * @returns {attribute_widget.AbstractNode}
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
     * @memberof attribute_widget.EntityManager
     * @param {string} type Type of node
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {object} json JSON representation
     * @returns {attribute_widget.AbstractNode}
     */
    createNodeFromJSON: function (
      type,
      id,
      left,
      top,
      width,
      height,
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
        containment,
        json
      );
      if (!node) {
        console.error("Node could not be created: " + type + " " + id);
        return null;
      }

      node.getLabel().getValue().setValue(json.label.value.value);
      for (var attrId in json.attributes) {
        if (json.attributes.hasOwnProperty(attrId)) {
          var attr = node.getAttribute(attrId);
          if (attr) {
            attr.setValueFromJSON(json.attributes[attrId]);
          } else {
            var newId = attrId.replace(/[^\[\]]*/, id);
            attr = node.getAttribute(newId);
            if (attr) attr.setValueFromJSON(json.attributes[attrId]);
            else {
              var attributeList = node.getAttributes();
              this.setAttributesByName(
                attributeList,
                json.attributes[attrId].name,
                json.attributes[attrId]
              );
            }
          }
        }
      }

      return node;
    },
    /**
     * Create a new node by its JSON representation
     * @memberof attribute_widget.EntityManager#
     * @param {string} type Type of edge
     * @param {string} id Entity identifier of edge
     * @param {attribute_widget.AbstractNode} sourceId Source node entity id
     * @param {attribute_widget.AbstractNode} targetId Target node entity id
     * @param {object} json JSON representation
     * @returns {attribute_widget.AbstractEdge}
     */
    createEdgeFromJSON: function (type, id, sourceId, targetId, json) {
      const sourceNode = this.findNode(sourceId);
      const targetNode = this.findNode(targetId);
      var edge = this.createEdge(type, id, sourceNode, targetNode, viewId);
      if (edge) {
        edge.getLabel().getValue().setValue(json.label.value.value);
        for (var attrId in json.attributes) {
          if (json.attributes.hasOwnProperty(attrId)) {
            var attr = edge.getAttribute(attrId);
            if (attr) {
              attr.setValueFromJSON(json.attributes[attrId]);
            } else {
              var attributeList = edge.getAttributes();
              this.setAttributesByName(
                attributeList,
                json.attributes[attrId].name,
                json.attributes[attrId]
              );
            }
          }
        }
      }
      return edge;
    },
    /**
     * Sets a attribute by its name
     * @param attributeList the attribute list
     * @param name the name of attribute in the attribute list
     * @param value the value
     */
    setAttributesByName: function (attributeList, name, value) {
      for (var key in attributeList) {
        if (
          attributeList.hasOwnProperty(key) &&
          attributeList[key].getName() === name
        ) {
          attributeList[key].setValueFromJSON(value);
          break;
        }
      }
    },
    /**
     * Generate the 'This node can be connected to..' hint for the passed node
     * @param {attribute_widget.AbstractNode} node
     */
    generateConnectToText: function (node) {
      function mapTargetNodeItems(e) {
        return "<i>" + e + "</i>";
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
        targetNode;

      connectionItems = [];
      for (connectionType in relations) {
        if (relations.hasOwnProperty(connectionType)) {
          targetNodeTypeItems = [];
          for (
            i = 0, numOfRelations = relations[connectionType].length;
            i < numOfRelations;
            i++
          ) {
            sourceNodeTypes = relations[connectionType][i].sourceTypes;
            targetNodeTypes = relations[connectionType][i].targetTypes;
            if (sourceNodeTypes.indexOf(node.getType()) !== -1) {
              for (
                j = 0, numOfTargetTypes = targetNodeTypes.length;
                j < numOfTargetTypes;
                j++
              ) {
                targetNodeType = targetNodeTypes[j];
                targetNodeItems = [];
                targetNodes = this.getNodesByType(targetNodeType);
                existsLinkableTargetNode = false;
                for (targetNodeId in targetNodes) {
                  if (targetNodes.hasOwnProperty(targetNodeId)) {
                    targetNode = targetNodes[targetNodeId];
                    if (
                      targetNode === node ||
                      targetNode
                        .getNeighbors()
                        .hasOwnProperty(node.getEntityId())
                    )
                      continue;
                    targetNodeItems.push(
                      targetNode.getLabel().getValue().getValue() ||
                        targetNode.getType()
                    );
                  }
                }
                targetNodeItems.sort();
                if (_.size(targetNodeItems) > 0) {
                  targetNodeTypeItems.push(
                    " to <strong>" +
                      targetNodeType +
                      "</strong> " +
                      _.map(targetNodeItems, mapTargetNodeItems).join(", ")
                  );
                }
              }
            }
          }
          if (_.size(targetNodeTypeItems) > 0) {
            connectionItems.push(
              "..with <strong>" +
                connectionType +
                "</strong> " +
                targetNodeTypeItems.join(", ")
            );
          }
        }
      }

      if (_.size(connectionItems) > 0) {
        return (
          "This node can be connected..<br>" +
          _.map(connectionItems, function (e) {
            return e + "<br>";
          }).join("")
        );
      } else {
        return "";
      }
    },
    /**
     * initializes the node types
     * @param vls the vls
     */
    initNodeTypes: function (vls) {
      nodeTypes = _initNodeTypes(vls);
    },
    /**
     * initializes the edge types
     * @param vls the vls
     */
    initEdgeTypes: function (vls) {
      var res = _initEdgeTypes(vls);
      edgeTypes = res.edgeTypes;
      relations = res.relations;
    },
    /**
     * initializes both the node and edge types
     * @param vls the vls
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
      //initialize the new
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
      //initialize the new
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
     * @param {string} id
     */
    setViewId: function (id) {
      viewId = id;
    },
    /**
     * get the identifier of the view
     * @returns {*}
     */
    getViewId: function () {
      return viewId;
    },
    getLayer: function () {
      return _layer;
    },
    init: function (mm) {
      console.log("init model types for attribute widget");
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
    getEdges: function () {
      return _edges;
    },
    getNodes: function () {
      return _nodes;
    },
  };
}

export const EntityManagerInstance = new EntityManager();

//noinspection JSUnusedLocalSymbols
/**
 * makeNode
 * @class attribute_widget.makeNode
 * @memberof attribute_widget
 * @constructor
 * @param type Type of node
 * @param shapeType
 * @param customShape
 * @param customAnchors
 * @param color
 * @param attributes
 * @returns {Node}
 */
export function makeNode(
  type,
  shapeType,
  customShape,
  customAnchors,
  color,
  attributes
) {
  /**
   * Node
   * @class attribute_widget.Node
   * @extends attribute_widget.AbstractNode
   * @constructor
   * @param {string} id Entity identifier of node
   * @param {number} left x-coordinate of node position
   * @param {number} top y-coordinate of node position
   * @param {number} width Width of node
   * @param {number} height Height of node
   */
  class Node extends AbstractNode {
    constructor(id, left, top, width, height) {
      super(id, type, left, top, width, height);
      var that = this;
      /**
       * jQuery object of node template
       * @type {jQuery}
       * @private
       */
      var $template = $(_.template(nodeHtml)({ type: type }));

      /**
       * jQuery object of DOM node representing the node
       * @type {jQuery}
       * @private
       */
      var _$node = AbstractNode.prototype.get$node.call(this).append($template);

      var init = function () {
        var attribute,
          attributeId,
          attrObj = {};

        for (attributeId in attributes) {
          if (attributes.hasOwnProperty(attributeId)) {
            attribute = attributes[attributeId];
            if (
              attribute.hasOwnProperty("visibility") &&
              attribute.visibility === "hide"
            )
              continue;
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
          }
        }
        that.setAttributes(attrObj);

        var $attributeNode = _$node.find(".attributes");
        for (var attributeKey in attrObj) {
          if (attrObj.hasOwnProperty(attributeKey)) {
            $attributeNode.append(attrObj[attributeKey].get$node());
          }
        }
      };
      init();
    }
    static getType() {
      return type;
    }
    static getAttributes() {
      return attributes;
    }
    registerYType() {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(this.getEntityId());
      var attr = this.getAttributes();
      for (var key in attr) {
        if (attr.hasOwnProperty(key)) {
          var val = attr[key].getValue();
          var ytext = ymap.get(val.getEntityId());
          if (val.hasOwnProperty("registerYType")) {
            val.registerYType(ytext);
          }
        }
      }
    }
    /**
     *
     */
    applyAttributeRenaming(renamingAttributes) {
      var renAttr,
        $attr,
        attributes = this.getAttributes();
      for (var attrKey in attributes) {
        if (attributes.hasOwnProperty(attrKey)) {
          renAttr = renamingAttributes[attrKey];
          $attr = attributes[attrKey].get$node();
          if (renAttr) {
            if (renAttr.visibility === "hide") {
              $attr.hide();
            } else {
              $attr.find(".attribute_name").text(renAttr.key);
              if ($attr.is(":hidden")) {
                $attr.show();
              }
            }
          } else {
            $attr.hide();
          }
        }
      }
    }
  }

  return Node;
}

/**
 * AbstractNode
 * @class attribute_widget.AbstractNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractEntity
 * @param {string} id Entity identifier of node
 * @param {string} type Type of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {boolean} containment containment
 * @param {string} viewId the identifier of the view the node belongs to
 * @constructor
 */
export class AbstractNode extends AbstractEntity {
  constructor(id, type, left, top, width, height, containment, viewId) {
    super(id);
    var that = this;

    /**
     * identifier of view the node belongs to
     * @type {string}
     * @private
     */
    var _viewId = viewId;

    /**
     * Type of node
     * @type {string}
     * @private
     */
    var _type = type;

    /**
     * Type of node
     * @containment {boolean}
     * @private
     */
    var _containment = containment;

    /**
     * Label of edge
     * @type {attribute_widget.SingleValueAttribute}
     * @private
     */
    var _label = new SingleValueAttribute(id + "[label]", "Label", this);

    /**
     * Appearance information of edge
     * @type {{left: number, top: number, width: number, height: number}}
     * @private
     */
    var appearance = {
      left: left,
      top: top,
      width: width,
      height: height,
    };

    /**
     * Wrapper the node is drawn on
     * @type {attribute_widget.AttributeWrapper}
     * @private
     */
    var _wrapper = null;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(abstractNodeHtml)({ id: id }));

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = {};

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

    //noinspection JSUnusedLocalSymbols
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
      that.remove();
    };

    /**
     * Callback for an Entity Select Operation
     * @param {EntitySelectOperation} operation
     */
    var entitySelectCallback = function (operation) {
      if (
        operation instanceof EntitySelectOperation &&
        operation.getSelectedEntityId() === that.getEntityId()
      ) {
        $(".ace-container").hide();
        if (_wrapper.get$node().is(":hidden")) _wrapper.get$node().show();
        _wrapper.select(that);
      }
    };

    /**
     * Callback for a Node Delete Operation
     * @param {operations.ot.NodeDeleteOperation} operation
     */
    var nodeDeleteCallback = function (operation) {
      if (
        operation instanceof NodeDeleteOperation &&
        operation.getEntityId() === that.getEntityId()
      ) {
        processNodeDeleteOperation(operation);
      }
    };

    var init = function () {
      _$node
        .find(".show_hint a")
        .click(function (e) {
          var $this = $(this),
            $hint = _$node.find(".hint");

          e.preventDefault();
          if ($hint.is(":visible")) {
            $hint.hide();
            $this.text("Show list of possible connections");
          } else {
            $hint.show();
            $this.text("Hide list of possible connections");
          }
        })
        .text("Show list of possible connections");
      _$node.find(".hint").hide();
    };

    /**
     * Adds node to wrapper
     * @param {attribute_widget.AttributeWrapper} wrapper
     */
    this.addToWrapper = function (wrapper) {
      _wrapper = wrapper;
      _wrapper.get$node().append(_$node.hide());
      init();
    };

    /**
     * Removes node from wrapper
     */
    this.removeFromWrapper = function () {
      _wrapper = null;
      _$node.remove();
    };

    /**
     * Add attribute to node
     * @param {attribute_widget.AbstractAttribute} attribute
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
     * @returns {attribute_widget.AbstractAttribute}
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
     * @param {attribute_widget.SingleValueAttribute} label
     */
    this.setLabel = function (label) {
      _label = label;
    };

    /**
     * get the identifier of the view the node belongs to
     * @returns {string}
     */
    this.getViewId = function () {
      return _viewId;
    };

    this.setViewId = function (viewId) {
      _viewId = viewId;
    };
    /**
     * Get edge label
     * @returns {attribute_widget.SingleValueAttribute}
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
     * Add ingoing edge
     * @param {attribute_widget.AbstractEdge} edge
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
     * @param {attribute_widget.AbstractEdge} edge
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
     * @param {attribute_widget.AbstractEdge} edge
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
     * @param {attribute_widget.AbstractEdge} edge
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
     * Select the node
     */
    this.select = function () {
      var connectToText = EntityManagerInstance.generateConnectToText(this);
      _$node.find(".hint").html(connectToText).hide();
      _$node.find(".show_hint").toggle(connectToText !== "");
      this.show();
    };

    /**
     * Unselect the node
     */
    this.unselect = function () {
      this.hide();
    };

    /**
     * Show the node
     */
    this.hide = function () {
      _$node.hide();
    };

    /**
     * Hide the node
     */
    this.show = function () {
      _$node.show();
    };

    /**
     * Remove the node
     */
    this._remove = function () {
      this.removeFromWrapper();
      this.unregisterCallbacks();
      var EntityManager = EntityManagerInstance;
      EntityManager.deleteNode(this.getEntityId());
      this.unregisterCallbacks();
    };

    /**
     * Get JSON representation of the node
     * @returns {Object}
     * @private
     */
    this.toJSON = function () {
      return {
        id: id,
        label: _label.getValue(),
        appearance: appearance,
      };
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwc.registerOnDataReceivedCallback(entitySelectCallback);
      _iwc.registerOnDataReceivedCallback(nodeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwc.unregisterOnDataReceivedCallback(entitySelectCallback);
      _iwc.unregisterOnDataReceivedCallback(nodeDeleteCallback);
    };

    this._registerYType = function () {
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());
      if (ymap) {
        var ytext = ymap.get(that.getLabel().getValue().getEntityId());
        that.getLabel().getValue().registerYType(ytext);
      }
    };

    if (_iwc) {
      that.registerCallbacks();
    }
  }
  draw() {
    return this._draw();
  }
  get$node() {
    return this._get$node();
  }
  registerYType() {
    this._registerYType();
  }
  remove() {
    this._remove();
  }
}

/**
 * AbstractEdge
 * @class attribute_widget.AbstractEdge
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractEntity
 * @constructor
 * @param {string} id Entity identifier of edge
 * @param {string} type Type of edge
 * @param {attribute_widget.AbstractNode} source Source node
 * @param {attribute_widget.AbstractNode} target Target node
 * @param {string} viewId the identifier of the view the edge belongs to
 */
export class AbstractEdge extends AbstractEntity {
  constructor(type, id, source, target, viewId) {
    super(id);
    var that = this;

    /**
     * Type of edge
     * @type {string}
     * @private
     */
    var _type = type;

    /**
     * identifier of the view the edge belongs to
     * @type {string}
     * @private
     */
    var _viewId = viewId;

    /**
     * Label of edge
     * @type {attribute_widget.SingleValueAttribute}
     * @private
     */
    var _label = new SingleValueAttribute(id + "[label]", "Label", this);

    /**
     * Appearance information of edge
     * @type {{source: (attribute_widget.AbstractNode), target: (attribute_widget.AbstractNode)}}
     * @private
     */
    var _appearance = {
      source: source,
      target: target,
    };

    /**
     * jQuery object of DOM node representing the edge
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(abstractEdgeHtml)({ id: id, type: type }));

    /**
     * Wrapper the edge is drawn on
     * @type {attribute_widget.AttributeWrapper}
     * @private
     */
    var _wrapper = null;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    /**
     * Attributes of edge
     * @type {Object}
     * @private
     */
    var _attributes = {};

    //noinspection JSUnusedLocalSymbols
    /**
     * Apply an Edge Delete Operation
     * @param {operations.ot.EdgeDeleteOperation} operation
     */
    var processEdgeDeleteOperation = function (operation) {
      that.getSource().deleteOutgoingEdge(that);
      that.getTarget().deleteIngoingEdge(that);
      that.remove();
    };

    /**
     * Callback for an Entity Select Operation
     * @param {operations.non_ot.EntitySelectOperation} operation
     */
    var entitySelectCallback = function (operation) {
      if (
        operation instanceof EntitySelectOperation &&
        operation.getSelectedEntityId() === that.getEntityId()
      ) {
        $(".ace-container").hide();
        if (_wrapper.get$node().is(":hidden")) _wrapper.get$node().show();
        _wrapper.select(that);
      }
    };

    /**
     * Callback for an Edge Delete Operation
     * @param {operations.ot.EdgeDeleteOperation} operation
     */
    var edgeDeleteCallback = function (operation) {
      if (
        operation instanceof EdgeDeleteOperation &&
        operation.getEntityId() === that.getEntityId()
      ) {
        processEdgeDeleteOperation(operation);
      }
    };

    /**
     * Adds edge to wrapper
     * @param {attribute_widget.AttributeWrapper} wrapper
     */
    this.addToWrapper = function (wrapper) {
      _wrapper = wrapper;
      _wrapper.get$node().append(_$node.hide());
    };

    /**
     * Removes edge from wrapper
     */
    this.removeFromWrapper = function () {
      _wrapper = null;
      _$node.detach();
    };

    /**
     * Add attribute to edge
     * @param {attribute_widget.AbstractAttribute} attribute
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
     * @returns {attribute_widget.AbstractAttribute}
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
     * @param {attribute_widget.SingleValueAttribute} label
     */
    this.setLabel = function (label) {
      _label = label;
    };

    /**
     * Get edge label
     * @returns {attribute_widget.SingleValueAttribute}
     */
    this.getLabel = function () {
      return _label;
    };

    /**
     * return the identifier of the view the edge belongs to
     * @returns {string}
     */
    this.getViewId = function () {
      return _viewId;
    };

    /**
     * sets the identifier the edge belongs to
     * @param viewId the identifier of the view
     */
    this.setViewId = function (viewId) {
      _viewId = viewId;
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
     * @returns {attribute_widget.AbstractNode}
     */
    this.getSource = function () {
      return _appearance.source;
    };

    /**
     * Get target node
     * @returns {attribute_widget.AbstractNode}
     */
    this.getTarget = function () {
      //noinspection JSAccessibilityCheck
      return _appearance.target;
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
     * Select the edge
     */
    this.select = function () {
      this.show();
    };

    /**
     * Unselect the edge
     */
    this.unselect = function () {
      this.hide();
    };

    /**
     * Hide edge
     */
    this.hide = function () {
      _$node.hide();
    };

    /**
     * Show edge
     */
    this.show = function () {
      _$node.show();
    };

    /**
     * Remove the edge
     */
    this.remove = function () {
      source.deleteOutgoingEdge(this);
      target.deleteIngoingEdge(this);
      this.removeFromWrapper();
      this.unregisterCallbacks();
      var EntityManager = EntityManagerInstance;
      EntityManager.deleteEdge(this.getEntityId());
    };

    /**
     * Get JSON representation of the edge
     * @returns {Object}
     */
    this.toJSON = function () {
      return {
        id: id,
        label: _label,
        appearance: _appearance,
      };
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      iwc.registerOnDataReceivedCallback(entitySelectCallback);
      iwc.registerOnDataReceivedCallback(edgeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      iwc.unregisterOnDataReceivedCallback(entitySelectCallback);
      iwc.unregisterOnDataReceivedCallback(edgeDeleteCallback);
    };

    this._registerYType = function () {
      const edgeMap = y.getMap("edges");
      var ymap = edgeMap.get(that.getEntityId());
      if (ymap) {
        var ytext = ymap.get(that.getLabel().getValue().getEntityId());
        that.getLabel().getValue().registerYType(ytext);
      }
    };

    _$node.find(".label").append(this.getLabel().get$node());

    if (iwc) {
      that.registerCallbacks();
    }
  }
  /**
   * Get jQuery object of DOM node representing the node
   * @returns {jQuery}
   */
  get$node() {
    return this._get$node();
  }
  registerYType() {
    this._registerYType();
  }
}

/**
 * Abstract Class Node
 * @class attribute_widget.AbstractClassNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 */
export class AbstractClassNode extends AbstractNode {
  static TYPE = "Abstract Class";

  constructor(id, left, top, width, height) {
    super(id, AbstractClassNode.TYPE, left, top, width, height);
    var that = this;
    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(abstractClassNodeHtml)());

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

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

    this.addAttribute(
      new KeySelectionValueListAttribute("[attributes]", "Attributes", this, {
        string: "String",
        boolean: "Boolean",
        integer: "Integer",
        file: "File",
        quiz: "Questions",
      })
    );

    _$node.find(".label").append(this.getLabel().get$node());

    this.registerYType = function () {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());
      var attrs = _attributes["[attributes]"].getAttributes();
      for (var attributeKey in attrs) {
        if (attrs.hasOwnProperty(attributeKey)) {
          var keyVal = attrs[attributeKey].getKey();
          var ytext = ymap.get(keyVal.getEntityId());
          keyVal.registerYType(ytext);
        }
      }
    };

    for (var attributeKey in _attributes) {
      if (_attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(_attributes[attributeKey].get$node());
      }
    }
  }
}

//noinspection JSUnusedLocalSymbols
/**
 * makeEdge
 * @class attribute_widget.makeEdge
 * @memberof attribute_widget
 * @constructor
 * @param {string} type Type of edge
 * @param arrowType
 * @param shapeType
 * @param color
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
  overlay,
  overlayPosition,
  overlayRotate,
  attributes
) {
  /**
   * Edge
   * @class attribute_widget.Edge
   * @extends attribute_widget.AbstractEdge
   * @param {string} id Entity identifier of edge
   * @param {attribute_widget.AbstractNode} source Source node
   * @param {attribute_widget.AbstractNode} target Target node
   * @constructor
   */
  class Edge extends AbstractEdge {
    constructor(id, source, target) {
      super(type, id, source, target);
      var that = this;

      /**
       * jQuery object of DOM node representing the node
       * @type {jQuery}
       * @private
       */
      var _$node = AbstractEdge.prototype.get$node.call(this);

      var init = function () {
        var attribute,
          attributeId,
          attrObj = {};
        for (attributeId in attributes) {
          if (attributes.hasOwnProperty(attributeId)) {
            attribute = attributes[attributeId];
            if (
              attribute.hasOwnProperty("position") &&
              attribute.position === "hide"
            )
              continue;
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
          }
        }
        that.setAttributes(attrObj);

        var $attributeNode = _$node.find(".attributes");
        for (var attributeKey in attrObj) {
          if (attrObj.hasOwnProperty(attributeKey)) {
            $attributeNode.append(attrObj[attributeKey].get$node());
          }
        }
      };

      this.registerYType = function () {
        AbstractEdge.prototype.registerYType.call(this);
        const edgeMap = y.getMap("edges");
        var ymap = edgeMap.get(that.getEntityId());
        var attr = that.getAttributes();
        for (var key in attr) {
          if (attr.hasOwnProperty(key)) {
            var val = attr[key].getValue();
            if (val.hasOwnProperty("registerYType")) {
              var ytext = ymap.get(val.getEntityId());
              val.registerYType(ytext);
            }
          }
        }
      };

      init();
    }
    static getType() {
      return type;
    }
    static getAttributes() {
      return attributes;
    }
    applyAttributeRenaming(renamingAttributes) {
      var renAttr,
        $attr,
        attributes = this.getAttributes();
      for (var attrKey in attributes) {
        if (attributes.hasOwnProperty(attrKey)) {
          renAttr = renamingAttributes[attrKey];
          $attr = attributes[attrKey].get$node();
          if (renAttr) {
            if (renAttr.position === "hide") {
              $attr.hide();
            } else {
              $attr.find(".attribute_name").text(renAttr.key);
              if ($attr.is(":hidden")) {
                $attr.show();
              }
            }
          } else {
            $attr.hide();
          }
        }
      }
    }
  }

  return Edge;
}

/**
 * Abstract Class Node
 * @class attribute_widget.EdgeShapeNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 */
export class EdgeShapeNode extends AbstractNode {
  static TYPE = "Edge Shape";

  constructor(id, left, top, width, height) {
    super(id, EdgeShapeNode.TYPE, left, top, width, height);

    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(edgeShapeNodeHtml)());

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var $attributeNode = _$node.find(".attributes");

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var attributes = this.getAttributes();

    this.addAttribute(
      new SingleSelectionAttribute(
        this.getEntityId() + "[arrow]",
        "Arrow",
        this,
        {
          bidirassociation: "---",
          unidirassociation: "-->",
          generalisation: "--▷",
          diamond: "-◁▷",
        }
      )
    );
    this.addAttribute(
      new SingleSelectionAttribute(
        this.getEntityId() + "[shape]",
        "Shape",
        this,
        { straight: "Straight", curved: "Curved", segmented: "Segmented" }
      )
    );
    this.addAttribute(
      new SingleColorValueAttribute(
        this.getEntityId() + "[color]",
        "Color",
        this
      )
    );
    this.addAttribute(
      new SingleValueAttribute(
        this.getEntityId() + "[overlay]",
        "Overlay Text",
        this
      )
    );
    this.addAttribute(
      new SingleSelectionAttribute(
        this.getEntityId() + "[overlayPosition]",
        "Overlay Position",
        this,
        { hidden: "Hide", top: "Top", center: "Center", bottom: "Bottom" }
      )
    );
    this.addAttribute(
      new BooleanAttribute(
        this.getEntityId() + "[overlayRotate]",
        "Autoflip Overlay",
        this
      )
    );

    _$node.find(".label").append(this.getLabel().get$node());

    this.registerYType = function () {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());
      var colorVal = that
        .getAttribute(that.getEntityId() + "[color]")
        .getValue();
      var ytextColor = ymap.get(colorVal.getEntityId());
      colorVal.registerYType(ytextColor);

      var customShapeVal = that
        .getAttribute(that.getEntityId() + "[overlay]")
        .getValue();
      var ytextCustomShape = ymap.get(customShapeVal.getEntityId());
      customShapeVal.registerYType(ytextCustomShape);
    };

    for (var attributeKey in attributes) {
      if (attributes.hasOwnProperty(attributeKey)) {
        $attributeNode.append(attributes[attributeKey].get$node());
      }
    }
  }
}

/**
 * Abstract Class Node
 * @class attribute_widget.EnumNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 */
export class EnumNode extends AbstractNode {
  static TYPE = "Enumeration";
  constructor(id, left, top, width, height) {
    super(id, EnumNode.TYPE, left, top, width, height);
    var that = this;
    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(enumNodeHtml)());

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var $attributeNode = _$node.find(".attributes");

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = this.getAttributes();

    this.addAttribute(
      new SingleValueListAttribute("[attributes]", "Attributes", this)
    );

    _$node.find(".label").append(this.getLabel().get$node());

    this.registerYMap = function () {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());
      var attrs = _attributes["[attributes]"].getAttributes();
      for (var attributeKey in attrs) {
        if (attrs.hasOwnProperty(attributeKey)) {
          var val = attrs[attributeKey].getValue();
          var ytext = ymap.get(val.getEntityId());
          val.registerYType(ytext);
        }
      }
    };

    for (var attributeKey in _attributes) {
      if (_attributes.hasOwnProperty(attributeKey)) {
        $attributeNode.append(_attributes[attributeKey].get$node());
      }
    }
  }
}

/**
 * Abstract Class Node
 * @class attribute_widget.ModelAttributesNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {object} [attr] model attributes
 */
export class ModelAttributesNode extends AbstractNode {
  static TYPE = "ModelAttributesNode";

  constructor(id, attr) {
    super(id, ModelAttributesNode.TYPE, 0, 0, 0, 0);

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
    var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

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
    var attributes = this.getAttributes();

    if (attr) {
      if (_.size(attr) === 0) {
        _$node.children().hide();
      }
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
        new SingleValueAttribute(this.getEntityId() + "[name]", "Name", this)
      );
      this.addAttribute(
        new SingleMultiLineValueAttribute(
          this.getEntityId() + "[description]",
          "Description",
          this
        )
      );
    }

    this.registerYType = function () {
      var attrs = this.getAttributes();
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          var val = attrs[key].getValue();
          if (
            val.constructor.name === "Value" ||
            val.constructor.name === "MultiLineValue"
          ) {
            const nodesMap = y.getMap("nodes");
            var ymap = nodesMap.get(this.getEntityId());
            var ytext = ymap.get(val.getEntityId());
            val.registerYType(ytext);
          }
        }
      }
    };

    _$node.find(".label").hide();

    for (var attributeKey in attributes) {
      if (attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(attributes[attributeKey].get$node());
      }
    }
  }
}

/**
 * Abstract Class Node
 * @class attribute_widget.NodeShapeNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {boolean} containment Height of node
 */
/**
 * Abstract Class Node
 * @class attribute_widget.NodeShapeNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {boolean} containment Height of node
 */
export class NodeShapeNode extends AbstractNode {
  static TYPE = "Node Shape";

  constructor(id, left, top, width, height, containment) {
    super(id, NodeShapeNode.TYPE, left, top, width, height, containment);

    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(nodeShapeNodeHtml)());

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var $attributeNode = _$node.find(".attributes");

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var attributes = this.getAttributes();

    this.addAttribute(
      new SingleSelectionAttribute(
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
      )
    );
    this.addAttribute(
      new SingleColorValueAttribute(
        this.getEntityId() + "[color]",
        "Color",
        this
      )
    );
    this.addAttribute(
      new IntegerAttribute(
        this.getEntityId() + "[defaultWidth]",
        "Default Width",
        this
      )
    );
    this.addAttribute(
      new IntegerAttribute(
        this.getEntityId() + "[defaultHeight]",
        "Default Height",
        this
      )
    );
    this.addAttribute(
      new BooleanAttribute(
        this.getEntityId() + "[containment]",
        "Containment",
        this
      )
    );
    this.addAttribute(
      new SingleCodeEditorValueAttribute(
        this.getEntityId() + "[customShape]",
        "Custom Shape",
        this
      )
    );
    this.addAttribute(
      new SingleValueAttribute(
        this.getEntityId() + "[customAnchors]",
        "Custom Anchors",
        this
      )
    );

    _$node.find(".label").append(this.getLabel().get$node());

    this.registerYType = function () {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());

      var colorVal = that
        .getAttribute(that.getEntityId() + "[color]")
        .getValue();
      var ytextColor = ymap.get(colorVal.getEntityId());
      colorVal.registerYType(ytextColor);

      var customAnchorVal = that
        .getAttribute(that.getEntityId() + "[customAnchors]")
        .getValue();
      var ytextCustomAnchor = ymap.get(customAnchorVal.getEntityId());
      customAnchorVal.registerYType(ytextCustomAnchor);
    };

    for (var attributeKey in attributes) {
      if (attributes.hasOwnProperty(attributeKey)) {
        $attributeNode.append(attributes[attributeKey].get$node());
      }
    }
  }
}

/**
 * ObjectNode
 * @class attribute_widget.ObjectNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 */
export class ObjectNode extends AbstractNode {
  static TYPE = "Object";

  constructor(id, left, top, width, height) {
    super(id, ObjectNode.TYPE, left, top, width, height);
    var that = this;
    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(objectNodeHtml)({ type: "Object" }));

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

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

    this.registerYType = function () {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());
      var attrs = _attributes["[attributes]"].getAttributes();
      for (var attributeKey in attrs) {
        if (attrs.hasOwnProperty(attributeKey)) {
          var keyVal = attrs[attributeKey].getKey();
          var ytext = ymap.get(keyVal.getEntityId());
          keyVal.registerYType(ytext);
        }
      }
    };

    this.remove = function () {
      AbstractNode.prototype.remove.call(this);
      this.getAttribute("[attributes]").unregisterCallbacks();
    };

    this.addAttribute(
      new KeySelectionValueListAttribute("[attributes]", "Attributes", this, {
        string: "String",
        boolean: "Boolean",
        integer: "Integer",
        file: "File",
        quiz: "Questions",
      })
    );

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
 * @class attribute_widget.RelationshipGroupNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 */
/**
 * Abstract Class Node
 * @class attribute_widget.RelationshipGroupNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 */
export class RelationshipGroupNode extends AbstractNode {
  static TYPE = "Relation";

  constructor(id, left, top, width, height) {
    super(id, RelationshipGroupNode.TYPE, left, top, width, height);

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(relationshipGroupNodeHtml)());

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

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
    var attributes = this.getAttributes();

    //this.addAttribute(new KeySelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File"}));
    _$node.find(".label").append(this.getLabel().get$node());

    for (var attributeKey in attributes) {
      if (attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(attributes[attributeKey].get$node());
      }
    }
  }
}

/**
 * RelationshipNode
 * @class attribute_widget.RelationshipNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @constructor
 */
/**
 * RelationshipNode
 * @class attribute_widget.RelationshipNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @constructor
 */
export class RelationshipNode extends AbstractNode {
  static TYPE = "Relationship";

  constructor(id, left, top, width, height) {
    super(id, RelationshipNode.TYPE, left, top, width, height);
    var that = this;
    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var $template = $(
      _.template(relationshipNodeHtml)({ type: "Relationship" })
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node.call(this).append($template);

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

    this.addAttribute(
      new KeySelectionValueSelectionValueListAttribute(
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
      )
    );

    this.registerYType = function () {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());
      var attrs = _attributes["[attributes]"].getAttributes();
      for (var attributeKey in attrs) {
        if (attrs.hasOwnProperty(attributeKey)) {
          var keyVal = attrs[attributeKey].getKey();
          var ytext = ymap.get(keyVal.getEntityId());
          keyVal.registerYType(ytext);
        }
      }
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
 * ViewObjectNode
 * @class attribute_widget.ViewObjectNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {object} json the json representation
 */
export class ViewObjectNode extends AbstractNode {
  static TYPE = "ViewObject";
  constructor(id, left, top, width, height, json) {
    super(id, "ViewObject", left, top, width, height, json);

    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(objectNodeHtml)({ type: "ViewObject" }));

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

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

    var targetAttribute, renamingList, conjSelection, cla;

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

    _$node.find(".label").append(this.getLabel().get$node());
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

      renamingList = new RenamingListAttribute(
        "[attributes]",
        "Attributes",
        that,
        { show: "Visible", hide: "Hidden" }
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

      if (json) {
        cla = that.createConditionListAttribute(
          json.attributes["[attributes]"].list
        );
        that.showAttributes();
        targetAttribute.get$node().hide();
      } else cla = that.createConditionListAttribute();
    }

    /**
     * register the y-object to enable NRT collaboration
     */
    this.registerYType = function () {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());
      var attrs = _attributes["[attributes]"].getAttributes();
      for (var attributeKey in attrs) {
        if (attrs.hasOwnProperty(attributeKey)) {
          var keyVal = attrs[attributeKey].getKey();
          var ytext = ymap.get(keyVal.getEntityId());
          keyVal.registerYType(ytext);
        }
      }

      if (_attributes["[condition]"]) {
        var conditions = _attributes["[condition]"].getAttributes();
        for (var attrKey4 in conditions) {
          if (conditions.hasOwnProperty(attrKey4)) {
            var keyVal = attrs[attributeKey].getKey();
            var ytext = ymap.get(keyVal.getEntityId());
            keyVal.registerYType(ytext);
          }
        }
      }
    };
  }
}

/**
 * ViewRelationshipNode
 * @class attribute_widget.ViewRelationshipNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {object} json the json representation form the role resource
 * @constructor
 */
export class ViewRelationshipNode extends AbstractNode {
  static TYPE = "ViewRelationship";
  constructor(id, left, top, width, height, json) {
    super(id, ViewRelationshipNode.TYPE, left, top, width, height, json);
    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var $template = $(
      _.template(relationshipNodeHtml)({ type: "ViewRelationship" })
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node.call(this).append($template);

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
     * shows attributes and hides the reference attribute
     */
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

    var targetAttribute, renamingList, conjSelection, cla;
    _$node.find(".label").append(this.getLabel().get$node());
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

      if (json) {
        cla = that.createConditionListAttribute(
          json.attributes["[attributes]"].list
        );
        that.showAttributes();
        targetAttribute.get$node().hide();
      } else cla = that.createConditionListAttribute();
    }

    /**
     * register the y-object to enable NRT collaboration
     */
    this.registerYType = function () {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());
      var attrs = _attributes["[attributes]"].getAttributes();
      for (var attributeKey in attrs) {
        if (attrs.hasOwnProperty(attributeKey)) {
          var keyVal = attrs[attributeKey].getKey();
          var ytext = ymap.get(keyVal.getEntityId());
          keyVal.registerYType(ytext);
        }
      }

      if (_attributes["[condition]"]) {
        var conditions = _attributes["[condition]"].getAttributes();
        for (var attrKey4 in conditions) {
          if (conditions.hasOwnProperty(attrKey4)) {
            var keyVal = attrs[attributeKey].getKey();
            var ytext = ymap.get(keyVal.getEntityId());
            keyVal.registerYType(ytext);
          }
        }
      }
    };
  }
}

/**
 * UniDirAssociationEdge
 * @class attribute_widget.UniDirAssociationEdge
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractEdge
 * @constructor
 * @param {string} id
 * @param {attribute_widget.AbstractNode} source
 * @param {attribute_widget.AbstractNode} target
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
    super("Uni-Dir-Association", id, source, target);
  }
}

/**
 * BiDirAssociationEdge
 * @class attribute_widget.BiDirAssociationEdge
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractEdge
 * @constructor
 * @param {string} id
 * @param {attribute_widget.AbstractNode} source
 * @param {attribute_widget.AbstractNode} target
 */
class BiDirAssociationEdge extends AbstractEdge {
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
    super(BiDirAssociationEdge.TYPE, id, source, target);
  }
}

/**
 * GeneralisationEdge
 * @class attribute_widget.GeneralisationEdge
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractEdge
 * @param {string} id Entity identifier of edge
 * @param {attribute_widget.AbstractNode} source Source node
 * @param {attribute_widget.AbstractNode} target Target node
 * @constructor
 */
class GeneralisationEdge extends AbstractEdge {
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
      targetTypes: [RelationshipNode.TYPE],
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
    super("Generalisation", id, source, target);
  }
}
