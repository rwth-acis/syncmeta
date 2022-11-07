import { CONFIG } from "../../config";
import EntityOperation from "./EntityOperation";
import OTOperation from "./OTOperation";
import $__operations_ot_NodeDeleteOperation from "./NodeDeleteOperation";


;
/**
 * NodeAddOperation
 * @class operations.ot.NodeAddOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {String} type Type of node to add
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 * @param {boolean} containment containment
 * @param {object} json JSON representation of node
 * @param {string} viewId the identifier of the view
 * @param {string} oType the original Type, only set in views
 * @param {string} jabberId the jabberId of the user
 * @param defaultAttributeValues May be used to set default attribute values for nodes.
 * @constructor
 */
export class NodeAddOperation extends EntityOperation {
  static TYPE = "NodeAddOperation";
  getType;
  getOriginType;
  getLeft;
  getTop;
  getWidth;
  getHeight;
  getZIndex;
  getContainment;
  getJSON;
  getViewId;
  getJabberId;
  getDefaultLabel;
  getDefaultAttributeValues;
  toJSON;

  constructor(
    entityId,
    type,
    left,
    top,
    width,
    height,
    zIndex,
    containment,
    json = null,
    viewId = null,
    oType = null,
    jabberId = null,
    defaultLabel = null,
    defaultAttributeValues = null
  ) {
    super(EntityOperation.TYPES.NodeAddOperation, entityId, CONFIG.ENTITY.NODE);
    var that = this;

    /**
     * the identifier of the view
     * @type {string}
     * @private
     */
    var _viewId = viewId;

    /**
     * the jabberId of the user
     * @type {string}
     * @private
     */
    var _jabberId = jabberId;

    var _oType = oType;

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
     * Default label of node
     * @type {String}
     * @private
     */
    var _defaultLabel = defaultLabel;

    /**
     * May be used to set default values for node attributes.
     */
    var _defaultAttributeValues = defaultAttributeValues;

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
          viewId: _viewId,
          oType: _oType,
          jabberId: _jabberId,
        }),
        CONFIG.OPERATION.TYPE.INSERT,
        CONFIG.IWC.POSITION.NODE.ADD
      );
    };

    /**
     * Get type of node to add
     * @returns {String}
     */
    this.getType = function () {
      return _type;
    };

    this.getOriginType = function () {
      return _oType;
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
     * Get containment
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
     * the identifier of the view
     * @returns {string}
     */
    this.getViewId = function () {
      return _viewId;
    };

    /**
     * Get the jabberid
     * @returns {string}
     */
    this.getJabberId = function () {
      return _jabberId;
    };

    /**
     * Get default label of node
     * @returns {string}
     */
    this.getDefaultLabel = function () {
      return _defaultLabel;
    };

    /**
     * Get default values for node attributes.
     * @returns {*}
     */
    this.getDefaultAttributeValues = function () {
      return _defaultAttributeValues;
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
     * @returns {NodeDeleteOperation}
     */
    this.inverse = function () {
      var NodeDeleteOperation = $__operations_ot_NodeDeleteOperation;

      return new NodeDeleteOperation(
        this.getEntityId(),
        this.getType(),
        this.getLeft(),
        this.getTop(),
        this.getWidth(),
        this.getHeight(),
        this.getZIndex(),
        this.getContainment(),
        json
      );
    };

    this.toJSON = function () {
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
        viewId: this.getViewId(),
        oType: this.getOriginType(),
        jabberId: this.getJabberId(),
        defaultLabel: this.getDefaultLabel(),
        defaultAttributeValues: this.getDefaultAttributeValues(),
      };
    };
  }
  static getOperationDescription(nodeType, nodeLabel, viewId) {
    if (!nodeLabel && !viewId) {
      return "..created a new " + nodeType;
    } else if (!viewId) {
      return "..created " + nodeType + " " + nodeLabel;
    } else
      return ".. created " + nodeType + " " + nodeLabel + " in View " + viewId;
  }
}



export default NodeAddOperation;
