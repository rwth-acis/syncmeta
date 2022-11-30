import { CONFIG } from "../../config";

/**
 * EntityOperation
 * @class operations.ot.EntityOperation
 * @memberof operations.ot
 * @param {string} operationType Type of operation
 * @param {string} entityId Entity id of the entity this activity works on
 * @param {string} entityType Type of the entity this activity works on
 * @constructor
 */
export class EntityOperation {
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
export class NodeDeleteOperation extends EntityOperation {
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

/**
 * EdgeDeleteOperation
 * @class operations.ot.EdgeDeleteOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param entityId Entity id of the entity this activity works on
 * @param {String} type Type of edge to delete
 * @param {String} source Entity id of source node
 * @param {String} target Entity id of target node
 * @param {object} json JSON representation of edge
 * @constructor
 */
export class EdgeDeleteOperation extends EntityOperation {
  static TYPE = "EdgeDeleteOperation";
  getType;
  getSource;
  getTarget;
  getJSON;
  constructor(entityId, type, source, target, json = null) {
    super(
      EntityOperation.TYPES.EdgeDeleteOperation,
      entityId,
      CONFIG.ENTITY.EDGE
    );
    var that = this;

    /**
     * Type of edge to delte
     * @type {String}
     * @private
     */
    var _type = type;

    /**
     * Entity id of source node
     * @type {String}
     * @private
     */
    var _source = source;

    /**
     * Entity id of target node
     * @type {String}
     * @private
     */
    var _target = target;

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
        CONFIG.ENTITY.EDGE + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          source: _source,
          target: _target,
          json: _json,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.EDGE.DEL
      );
    };

    /**
     * Get type of edge to delete
     * @returns {String}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get entity id of source node
     * @returns {String}
     */
    this.getSource = function () {
      return _source;
    };

    /**
     * Get entity id of target node
     * @returns {String}
     */
    this.getTarget = function () {
      return _target;
    };

    /**
     * Get JSON representation of edge
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
      switch (operation.getOperationType()) {
        case EntityOperation.TYPES.AttributeAddOperation:
        case EntityOperation.TYPES.AttributeDeleteOperation:
          if (this.getEntityId() === operation.getRootSubjectEntityId()) {
            return null;
          }
          break;
        case EntityOperation.TYPES.EdgeAddOperation:
        case EntityOperation.TYPES.EdgeDeleteOperation:
          if (this.getEntityId() === operation.getEntityId()) {
            return null;
          }
          break;
        case EntityOperation.TYPES.ValueChangeOperation:
          if (this.getEntityId() === operation.getRootSubjectEntityId()) {
            return null;
          }
          break;
      }

      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {EdgeAddOperation}
     */
    this.inverse = function () {
      var EdgeAddOperation = $__operations_ot_EdgeAddOperation;

      return new EdgeAddOperation(
        this.getEntityId(),
        this.getType(),
        this.getSource(),
        this.getTarget()
      );
    };
  }
  static getOperationDescription(edgeType, edgeLabel, viewId) {
    if (!edgeLabel && !viewId) {
      return "..deleted " + edgeType;
    } else if (!viewId) {
      return "..deleted " + edgeType + " " + edgeLabel;
    } else {
      return "..deleted " + edgeType + " " + edgeLabel + "in View " + viewId;
    }
  }
  toJSON = function () {
    return {
      id: this.getEntityId(),
      type: this.getType(),
      source: this.getSource(),
      target: this.getTarget(),
      json: this.getJSON(),
    };
  };
}

/**
 * EdgeAddOperation
 * @class operations.ot.EdgeAddOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {String} type Type of edge to add
 * @param {String} source Entity id of source node
 * @param {String} target Entity id of target node
 * @param {object} json JSON representation of edge
 * @param {string} viewId the identifier of the view
 * @param {string} oType oType the original Type, only set in views
 * @param {string} jabberId the jabberId of the user
 * @constructor
 */
export class EdgeAddOperation extends EntityOperation {
  static TYPE = "EdgeAddOperation";
  getOriginType;
  getType;
  getSource;
  getTarget;
  getViewId;
  getJabberId;
  getJSON;
  constructor(
    entityId,
    type,
    source,
    target,
    json = null,
    viewId = null,
    oType = null,
    jabberId = null
  ) {
    super(EntityOperation.TYPES.EdgeAddOperation, entityId, CONFIG.ENTITY.EDGE);
    var that = this;

    var _oType = oType;

    var _jabberId = jabberId;

    this.getOriginType = function () {
      return _oType;
    };

    /**
     * the identifier of the view
     * @type {string}
     * @private
     */
    var _viewId = viewId;

    /**
     * Type of edge to add
     * @type {String}
     * @private
     */
    var _type = type;

    /**
     * Entity id of source node
     * @type {String}
     * @private
     */
    var _source = source;

    /**
     * Entity id of target node
     * @type {String}
     * @private
     */
    var _target = target;

    /**
     * JSON representation of edge
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
        CONFIG.ENTITY.EDGE + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          source: _source,
          target: _target,
          json: _json,
          viewId: _viewId,
          oType: _oType,
          jabberId: _jabberId,
        }),
        CONFIG.OPERATION.TYPE.INSERT,
        CONFIG.IWC.POSITION.EDGE.ADD
      );
    };

    /**
     * Get type of edge to add
     * @returns {String}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get entity id of source node
     * @returns {String}
     */
    this.getSource = function () {
      return _source;
    };

    /**
     * Get entity id of target node
     * @returns {String}
     */
    this.getTarget = function () {
      return _target;
    };

    /**
     * get the identifier of the view
     * @returns {string}
     */
    this.getViewId = function () {
      return _viewId;
    };

    /**
     * Get the jabber id
     * @returns {string}
     */
    this.getJabberId = function () {
      return _jabberId;
    };

    /**
     * Get JSON representation of edge
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
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {EdgeDeleteOperation}
     */
    this.inverse = function () {
      var EdgeDeleteOperation = $__operations_ot_EdgeDeleteOperation;

      return new EdgeDeleteOperation(
        this.getEntityId(),
        this.getType(),
        this.getSource(),
        this.getTarget()
      );
    };
  }
  static getOperationDescription(
    edgeType,
    edgeLabel,
    sourceNodeType,
    sourceNodeLabel,
    targetNodeType,
    targetNodeLabel,
    viewId
  ) {
    if (!edgeLabel && !viewId) {
      return (
        "..created a new " +
        edgeType +
        " between " +
        sourceNodeType +
        " " +
        sourceNodeLabel +
        " and " +
        targetNodeType +
        " " +
        targetNodeLabel
      );
    } else if (!viewId) {
      return (
        "..created " +
        edgeType +
        " " +
        edgeLabel +
        " between " +
        sourceNodeType +
        " " +
        sourceNodeLabel +
        " and " +
        targetNodeType +
        " " +
        targetNodeLabel
      );
    } else {
      return (
        "..created " +
        edgeType +
        " " +
        edgeLabel +
        " between " +
        sourceNodeType +
        " " +
        sourceNodeLabel +
        " and " +
        targetNodeType +
        " " +
        targetNodeLabel +
        " in View " +
        viewId
      );
    }
  }
  toJSON = function () {
    return {
      id: this.getEntityId(),
      type: this.getType(),
      source: this.getSource(),
      target: this.getTarget(),
      json: this.getJSON(),
      viewId: this.getViewId(),
      oType: this.getOriginType(),
      jabberId: this.getJabberId(),
    };
  };
}

/**
 * AttributeAddOperation
 * @class operations.ot.AttributeAddOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {String} subjectEntityId Id of the entity the attribute is assigned to
 * @param {String} rootSubjectEntityId Id of topmost entity in the chain of entities the attribute is assigned to
 * @param {String} type Type of attribute to add
 * @constructor
 */
export class AttributeAddOperation extends EntityOperation {
  static TYPE = "AttributeAddOperation";
  getSubjectEntityId;
  getRootSubjectEntityId;
  getType;
  getData;
  toJSON;
  constructor(
    entityId,
    subjectEntityId,
    rootSubjectEntityId,
    type,
    data = null
  ) {
    super(
      EntityOperation.TYPES.AttributeAddOperation,
      entityId,
      CONFIG.ENTITY.ATTR
    );
    var that = this;

    /**
     * Id of the entity the attribute is assigned to
     * @type {String}
     * @private
     */
    var _subjectEntityId = subjectEntityId;

    /**
     * Id of topmost entity in the chain of entities the attribute is assigned to
     * @type {String}
     * @private
     */
    var _rootSubjectEntityId = rootSubjectEntityId;

    /**
     * Type of attribute to add
     * @type {String}
     * @private
     */
    var _type = type;

    var _data = data;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.ATTR + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          subjectEntityId: _subjectEntityId,
          rootSubjectEntityId: _rootSubjectEntityId,
          data: _data,
        }),
        CONFIG.OPERATION.TYPE.INSERT,
        CONFIG.IWC.POSITION.ATTR.ADD
      );
    };

    /**
     * Get id of the entity the attribute is assigned to
     * @returns {*}
     */
    this.getSubjectEntityId = function () {
      return _subjectEntityId;
    };

    /**
     * Get id of topmost entity in the chain of entities the attribute is assigned to
     * @returns {*}
     */
    this.getRootSubjectEntityId = function () {
      return _rootSubjectEntityId;
    };

    /**
     * Get type of attribute to add
     * @returns {*}
     */
    this.getType = function () {
      return _type;
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
        that.setOTOperation(otOperation);
      }
      return otOperation;
    };

    this.getData = function () {
      return _data;
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
     * @returns {AttributeDeleteOperation}
     */
    this.inverse = function () {
      var AttributeDeleteOperation = $__operations_ot_AttributeDeleteOperation;

      return new AttributeDeleteOperation(
        that.getEntityId(),
        that.getSubjectEntityId(),
        that.getRootSubjectEntityId(),
        that.getType()
      );
    };

    this.toJSON = function () {
      return {
        entityId: this.getEntityId(),
        type: this.getType(),
        subjectEntityId: this.getSubjectEntityId(),
        rootSubjectEntityId: this.getRootSubjectEntityId(),
        data: this.getData(),
      };
    };
  }
}

/**
 * AttributeDeleteOperation
 * @class operations.ot.AttributeDeleteOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {String} subjectEntityId Id of the entity the attribute is assigned to
 * @param {String} rootSubjectEntityId Id of topmost entity in the chain of entities the attribute is assigned to
 * @param {String} type Type of attribute to delete
 * @constructor
 */
export class AttributeDeleteOperation extends EntityOperation {
  static TYPE = "AttributeDeleteOperation";
  getSubjectEntityId;
  getRootSubjectEntityId;
  getType;
  toJSON;
  constructor(entityId, subjectEntityId, rootSubjectEntityId, type) {
    super(
      EntityOperation.TYPES.AttributeDeleteOperation,
      entityId,
      CONFIG.ENTITY.ATTR
    );
    var that = this;

    /**
     * Id of the entity the attribute is assigned to
     * @type {String}
     * @private
     */
    var _subjectEntityId = subjectEntityId;

    /**
     * Id of topmost entity in the chain of entities the attribute is assigned to
     * @type {String}
     * @private
     */
    var _rootSubjectEntityId = rootSubjectEntityId;

    /**
     * Type of attribute to add
     * @type {String}
     * @private
     */
    var _type = type;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.ATTR + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          subjectEntityId: _subjectEntityId,
          rootSubjectEntityId: _rootSubjectEntityId,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.ATTR.DEL
      );
    };

    /**
     * Get id of the entity the attribute is assigned to
     * @returns {*}
     */
    this.getSubjectEntityId = function () {
      return _subjectEntityId;
    };

    /**
     * Get id of topmost entity in the chain of entities the attribute is assigned to
     * @returns {*}
     */
    this.getRootSubjectEntityId = function () {
      return _rootSubjectEntityId;
    };

    /**
     * Get type of attribute to add
     * @returns {*}
     */
    this.getType = function () {
      return _type;
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
        that.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {operations.ot.EntityOperation} operation Remote operation
     * @returns {operations.ot.EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      switch (operation.getOperationType()) {
        case EntityOperation.TYPES.AttributeAddOperation:
        case EntityOperation.TYPES.AttributeDeleteOperation:
          if (
            that.getRootSubjectEntityId() === operation.getRootSubjectEntityId()
          ) {
            return null;
          }
          break;
        case EntityOperation.TYPES.ValueChangeOperation:
          if (operation.getEntityIdChain().indexOf(this.getEntityId()) !== -1) {
            return null;
          }
          break;
      }

      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {operations.ot.AttributeAddOperation}
     */
    this.inverse = function () {
      var AttributeAddOperation = $__operations_ot_AttributeAddOperation;

      return new AttributeAddOperation(
        this.getEntityId(),
        this.getSubjectEntityId(),
        this.getRootSubjectEntityId(),
        this.getType()
      );
    };
    this.toJSON = function () {
      return {
        entityId: this.getEntityId(),
        type: this.getType(),
        subjectEntityId: this.getSubjectEntityId(),
        rootSubjectEntityId: this.getRootSubjectEntityId(),
      };
    };
  }
}

export default EntityOperation;
