import { CONFIG } from "../../config";
import EntityOperation from "./EntityOperation";
import OTOperation from "./OTOperation";
import $__operations_ot_AttributeDeleteOperation from "./AttributeDeleteOperation";

AttributeAddOperation.TYPE = "AttributeAddOperation";

AttributeAddOperation.prototype = new EntityOperation();
AttributeAddOperation.prototype.constructor = AttributeAddOperation;
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
function AttributeAddOperation(
  entityId,
  subjectEntityId,
  rootSubjectEntityId,
  type,
  data
) {
  var that = this;

  EntityOperation.call(
    this,
    EntityOperation.TYPES.AttributeAddOperation,
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
}

AttributeAddOperation.prototype.toJSON = function () {
  return {
    entityId: this.getEntityId(),
    type: this.getType(),
    subjectEntityId: this.getSubjectEntityId(),
    rootSubjectEntityId: this.getRootSubjectEntityId(),
    data: this.getData(),
  };
};

export default AttributeAddOperation;
