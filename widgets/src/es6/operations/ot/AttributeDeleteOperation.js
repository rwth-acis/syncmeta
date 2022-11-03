import { CONFIG } from "../../config";
import EntityOperation from "./EntityOperation";
import OTOperation from "./OTOperation";
import $__operations_ot_AttributeAddOperation from "./AttributeAddOperation";

AttributeDeleteOperation.TYPE = "AttributeDeleteOperation";
AttributeDeleteOperation.prototype = new EntityOperation();
AttributeDeleteOperation.prototype.constructor = AttributeDeleteOperation;
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
function AttributeDeleteOperation(
  entityId,
  subjectEntityId,
  rootSubjectEntityId,
  type
) {
  var that = this;

  EntityOperation.call(
    this,
    EntityOperation.TYPES.AttributeDeleteOperation,
    entityId,
    CONFIG.ENTITY.ATTR
  );

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
}

AttributeDeleteOperation.prototype.toJSON = function () {
  return {
    entityId: this.getEntityId(),
    type: this.getType(),
    subjectEntityId: this.getSubjectEntityId(),
    rootSubjectEntityId: this.getRootSubjectEntityId(),
  };
};

export default AttributeDeleteOperation;
