import { CONFIG } from "../../config";

import OTOperation from "./OTOperation";
import $__operations_ot_NodeAddOperation from "./NodeAddOperation";

/**
 * EntityOperation
 * @class operations.ot.EntityOperation
 * @memberof operations.ot
 * @param {string} operationType Type of operation
 * @param {string} entityId Entity id of the entity this activity works on
 * @param {string} entityType Type of the entity this activity works on
 * @constructor
 */
class EntityOperation {
  static TYPES = {
    AttributeAddOperation: "AttributeAddOperation",
    AttributeDeleteOperation: "AttributeDeleteOperation",
    EdgeAddOperation: "EdgeAddOperation",
    EdgeDeleteOperation: "EdgeDeleteOperation",
    NodeAddOperation: "NodeAddOperation",
    NodeDeleteOperation: "NodeDeleteOperation",
    NodeMoveOperation: "NodeMoveOperation",
    NodeMoveZOperation: "NodeMoveZOperation",
    NodeResizeOperation: "NodeResizeOperation",
    ValueChangeOperation: "ValueChangeOperation",
  };
  getOperationType;
  setOTOperation;
  _getOTOperation;
  getEntityId;
  getEntityType;
  adjust;
  inverse;
  toJSON;
  constructor(operationType, entityId, entityType) {
    /**
     * Type of operation
     * @type {string}
     * @private
     */
    var _operationType = operationType;

    /**
     * Corresponding OtOperation
     * @type {operations.ot.OTOperation}
     * @private
     */
    var _otOperation = null;

    /**
     * Entity id of the entity this activity works on
     * @type {string}
     * @private
     */
    var _entityId = entityId;

    /**
     * Type of the entity this activity works on
     * @type {string}
     * @private
     */
    var _entityType = entityType;

    /**
     * Get type of operation
     * @returns {string}
     */
    this.getOperationType = function () {
      return _operationType;
    };

    /**
     * Set corresponding ot operation
     * @param {operations.ot.OTOperation} otOperation
     */
    this.setOTOperation = function (otOperation) {
      _otOperation = otOperation;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this._getOTOperation = function () {
      return _otOperation;
    };

    /**
     * Get entity id of the entity this activity works onf
     * @returns {string}
     */
    this.getEntityId = function () {
      return _entityId;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get type of the entity this activity works on
     * @returns {string}
     */
    this.getEntityType = function () {
      return _entityType;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {operations.ot.EntityOperation}
     */
    this.inverse = function () {
      return this;
    };
  }
  //noinspection JSAccessibilityCheck
  /**
   * Get corresponding ot operation
   * @returns {operations.ot.OTOperation}
   */
  getOTOperation() {
    return this._getOTOperation();
  }
}

/**
 * NodeDeleteOperation
 * @class operations.ot.NodeDeleteOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {String} type Type of node to delete
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 * @param {boolean} containment containment
 * @param {object} json JSON representation of node
 * @constructor
 */
class NodeDeleteOperation extends EntityOperation {
  static TYPE = "NodeDeleteOperation";
  getType;
  getLeft;
  getTop;
  getWidth;
  getHeight;
  getZIndex;
  getContainment;
  getJSON;
  constructor(
    entityId,
    type,
    left,
    top,
    width,
    height,
    zIndex,
    containment,
    json
  ) {
    super(
      EntityOperation.TYPES.NodeDeleteOperation,
      entityId,
      CONFIG.ENTITY.NODE
    );
    var that = this;

    /**
     * Type of node to add
     * @type {String}
     * @private
     */
    var _type = type;

    /**
     * x-coordinate of node position
     * @type {number}
     * @private
     */
    var _left = left;

    /**
     * y-coordinate of node position
     * @type {number}
     * @private
     */
    var _top = top;

    /**
     * Width of node
     * @type {number}
     * @private
     */
    var _width = width;

    /**
     * Height of node
     * @type {number}
     * @private
     */
    var _height = height;

    /**
     * Position of node on z-axis
     * @type {number}
     * @private
     */
    var _zIndex = zIndex;

    /**
     * is containment type
     * @type {boolean}
     * @private
     */
    var _containment = containment;

    /**
     * JSON representation of node
     * @type {Object}
     * @private
     */
    var _json = json;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.NODE + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          left: _left,
          top: _top,
          width: _width,
          height: _height,
          zIndex: _zIndex,
          containment: _containment,
          json: _json,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.NODE.DEL
      );
    };

    /**
     * Get type of node to add
     * @returns {String}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get x-coordinate of node position
     * @returns {number}
     */
    this.getLeft = function () {
      return _left;
    };

    /**
     * Get y-coordinate of node position
     * @returns {number}
     */
    this.getTop = function () {
      return _top;
    };

    /**
     * Get width of node
     * @returns {number}
     */
    this.getWidth = function () {
      return _width;
    };

    /**
     * Get height of node
     * @returns {number}
     */
    this.getHeight = function () {
      return _height;
    };

    /**
     * Get position of node on z-axis
     * @returns {number}
     */
    this.getZIndex = function () {
      return _zIndex;
    };

    /**
     * is containment type
     * @returns {boolean}
     */
    this.getContainment = function () {
      return _containment;
    };

    /**
     * Get JSON representation of node
     * @return {Object}
     */
    this.getJSON = function () {
      return _json;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        this.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      var edge;
      switch (operation.getOperationType()) {
        case EntityOperation.TYPES.AttributeAddOperation:
        case EntityOperation.TYPES.AttributeDeleteOperation:
          edge = EntityManager.findEdge(operation.getRootSubjectEntityId());
          if (
            edge &&
            (edge.getSource().getEntityId() === this.getEntityId() ||
              edge.getTarget().getEntityId() === this.getEntityId())
          ) {
            return null;
          }
          if (this.getEntityId() === operation.getRootSubjectEntityId()) {
            return null;
          }
          break;
        case EntityOperation.TYPES.EdgeAddOperation:
        case EntityOperation.TYPES.EdgeDeleteOperation:
          edge = EntityManager.findEdge(operation.getEntityId());
          if (
            edge &&
            (edge.getSource().getEntityId() === this.getEntityId() ||
              edge.getTarget().getEntityId() === this.getEntityId())
          ) {
            return null;
          }
          break;
        case EntityOperation.TYPES.NodeAddOperation:
        case EntityOperation.TYPES.NodeDeleteOperation:
        case EntityOperation.TYPES.NodeMoveOperation:
        case EntityOperation.TYPES.NodeResizeOperation:
          if (this.getEntityId() === operation.getEntityId()) {
            return null;
          }
          break;
        case EntityOperation.TYPES.ValueChangeOperation:
          edge = EntityManager.findEdge(operation.getRootSubjectEntityId());
          if (
            edge &&
            (edge.getSource().getEntityId() === this.getEntityId() ||
              edge.getTarget().getEntityId() === this.getEntityId())
          ) {
            return null;
          }
          if (operation.getRootSubjectEntityId() === this.getEntityId()) {
            return null;
          }
          break;
      }

      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {operations.ot.NodeAddOperation}
     */
    this.inverse = function () {
      var NodeAddOperation = $__operations_ot_NodeAddOperation;

      return new NodeAddOperation(
        this.getEntityId(),
        this.getType(),
        this.getLeft(),
        this.getTop(),
        this.getWidth(),
        this.getHeight(),
        this.getZIndex(),
        this.getContainment(),
        this.getContainment(),
        json
      );
    };
  }
  static getOperationDescription(nodeType, nodeLabel, viewId) {
    if (!nodeLabel && !viewId) {
      return "..deleted " + nodeType;
    } else if (!viewId) {
      return "..deleted " + nodeType + " " + nodeLabel;
    } else
      return "..deleted " + nodeType + " " + nodeLabel + " in View " + viewId;
  }
  toJSON = function () {
    return {
      id: this.getEntityId(),
      type: this.getType(),
      left: this.getLeft(),
      top: this.getTop(),
      width: this.getWidth(),
      height: this.getHeight(),
      zIndex: this.getZIndex(),
      containment: this.getContainment(),
      json: this.getJSON(),
    };
  };
}

export default NodeDeleteOperation;
