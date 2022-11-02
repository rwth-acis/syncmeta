import $ from "jquery-ui";
import _ from "lodash";
import Util from "Util";
import IWCW from "../lib/IWCWrapper";
import EntitySelectOperation from "../operations/non_ot/EntitySelectOperation";
import NodeDeleteOperation from "../operations/ot/NodeDeleteOperation";
import AbstractEntity from "./AbstractEntity";
import SingleValueAttribute from "./SingleValueAttribute";
import $__attribute_widget_EntityManager from "./EntityManager";

const abstractNodeHtml = await loadHTML(
  "../../../html/templates/attribute_widget/abstract_node.html",
  import.meta.url
);

AbstractNode.prototype = new AbstractEntity();
AbstractNode.prototype.constructor = AbstractNode;
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
function AbstractNode(id, type, left, top, width, height, containment, viewId) {
  var that = this;

  AbstractEntity.call(this, id);

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
   * Select the node
   */
  this.select = function () {
    var connectToText =
      $__attribute_widget_EntityManager.generateConnectToText(this);
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
    var EntityManager = $__attribute_widget_EntityManager;
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
AbstractNode.prototype.draw = function () {
  return this._draw();
};
AbstractNode.prototype.get$node = function () {
  return this._get$node();
};

AbstractNode.prototype.registerYType = function () {
  this._registerYType();
};

AbstractNode.prototype.remove = function () {
  this._remove();
};

export default AbstractNode;
