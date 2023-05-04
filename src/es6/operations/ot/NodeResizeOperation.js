import { CONFIG } from "../../config";
import EntityOperation from "./EntityOperation";
import OTOperation from "./OTOperation";


/**
 * NodeResizeOperation
 * @class operations.ot.NodeResizeOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {number} offsetX Offset in x-direction
 * @param {number} offsetY Offset in y-direction
 * @param {string} optional: jabberId the jabberId of the user (is automatically set by propagateNodeMoveOperation)
 * @constructor
 */
class NodeResizeOperation extends EntityOperation {
  static TYPE = "NodeResizeOperation";
  getOffsetX
  getOffsetY
  getJabberId
  setJabberId
  constructor(entityId, offsetX, offsetY, jabberId) {
    super(
      EntityOperation.TYPES.NodeResizeOperation,
      entityId,
      CONFIG.ENTITY.NODE
    );
    var that = this;

    var _jabberId = jabberId;

    /**
     * Offset in x-direction
     * @type {number}
     * @private
     */
    var _offsetX = offsetX;

    /**
     * Offset in y-direction
     * @type {number}
     * @private
     */
    var _offsetY = offsetY;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.NODE + ":" + that.getEntityId(),
        JSON.stringify({
          offsetX: _offsetX,
          offsetY: _offsetY,
          jabberId: _jabberId,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.NODE.DIM
      );
    };

    /**
     * Get offset in x-direction
     * @returns {number}
     */
    this.getOffsetX = function () {
      return _offsetX;
    };

    /**
     * Get offset in y-direction
     * @returns {number}
     */
    this.getOffsetY = function () {
      return _offsetY;
    };

    this.getJabberId = function () {
      return _jabberId;
    };

    this.setJabberId = function (jabberId) {
      _jabberId = jabberId;
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
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {NodeResizeOperation}
     */
    this.inverse = function () {
      return new NodeResizeOperation(
        this.getEntityId(),
        -this.getOffsetX(),
        -this.getOffsetY(),
        this.getJabberId()
      );
    };
  }
  static getOperationDescription(nodeType, nodeLabel, viewId) {
    if (!nodeLabel && !viewId) {
      return "..resized " + nodeType;
    } else if (!viewId) {
      return "..resized " + nodeType + " " + nodeLabel;
    } else {
      return "..resized " + nodeType + " " + nodeLabel + " in View " + viewId;
    }
  }
  toJSON=function() {
    return {
      id: this.getEntityId(),
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      jabberId: this.getJabberId(),
      triggeredBy: this.triggeredBy,
    };
  }
}



export default NodeResizeOperation;
