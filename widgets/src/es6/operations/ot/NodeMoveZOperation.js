import { CONFIG } from "../../config";
import EntityOperation from "./EntityOperation";
import OTOperation from "./OTOperation";


/**
 * NodeMoveZOperation
 * @class operations.ot.NodeMoveZOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {number} offsetZ Offset in z-direction
 * @param {string} optional: jabberId the jabberId of the user (is automatically set by propagateNodeMoveOperation)
 * @constructor
 */
class NodeMoveZOperation extends EntityOperation {
  static TYPE = "NodeMoveZOperation";
  getOffsetZ;
  getJabberId;
  setJabberId;
  constructor(entityId, offsetZ, jabberId) {
    super(
      EntityOperation.TYPES.NodeMoveZOperation,
      entityId,
      CONFIG.ENTITY.NODE
    );
    var that = this;

    /**
     * Offset in y-direction
     * @type {number}
     * @private
     */
    var _offsetZ = offsetZ;

    /**
     * the jabberId
     * @type {string}
     * @private
     */
    var _jabberId = jabberId;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.NODE + ":" + that.getEntityId(),
        JSON.stringify({
          offsetZ: _offsetZ,
          jabberId: _jabberId,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.NODE.Z
      );
    };

    /**
     * Get offset in z-direction
     * @returns {number}
     */
    this.getOffsetZ = function () {
      return _offsetZ;
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
     * @returns {NodeMoveZOperation}
     */
    this.inverse = function () {
      var NodeMoveZOperation = NodeMoveZOperation;

      return new NodeMoveZOperation(
        this.getEntityId(),
        -this.getOffsetZ(),
        this.getJabberId()
      );
    };
  }
  static getOperationDescription(nodeType, nodeLabel, viewId) {
    if (!nodeLabel && !viewId) {
      return "..moved " + nodeType + " on on Z-Axis";
    } else if (!viewId) {
      return "..moved " + nodeType + " " + nodeLabel + " on Z-Axis";
    } else {
      return (
        "..moved " +
        nodeType +
        " " +
        nodeLabel +
        " in View " +
        viewId +
        " on Z-Axis"
      );
    }
  }
  toJSON = function () {
    return {
      id: this.getEntityId(),
      offsetZ: this.getOffsetZ(),
      jabberId: this.getJabberId(),
    };
  };
}

export default NodeMoveZOperation;
