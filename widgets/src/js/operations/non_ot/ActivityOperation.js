define([".//NonOTOperation"], /** @lends AbstractAttribute */ function (
  NonOTOperation
) {
  ActivityOperation.TYPE = "ActivityOperation";

  /**
   * ActivityOperation
   * @class operations.non_ot.ActivityOperation
   * @memberof operations.non_ot
   * @constructor
   * @param {string} type Type of activity
   * @param {string} entityId Entity id of the entity this activity works on
   * @param {string} sender JabberId of the user who issued this activity
   * @param {string} text Text of this activity which is displayed in the activity widget
   * @param {object} data Additional data for the activity
   */
  function ActivityOperation(type, entityId, sender, text, data) {
    /**
     * Type of activity
     * @type {string}
     * @private
     */
    var _type = type;

    /**
     * Entity id of the entity this activity works on
     * @type {string}
     * @private
     */
    var _entityId = entityId;

    /**
     * JabberId of the user who issued this activity
     * @type {string}
     * @private
     */
    var _sender = sender;

    /**
     * Text of this activity which is displayed in the activity widget
     * @type {string}
     * @private
     */
    var _text = text;

    /**
     * Additional data for the activity
     * @type {Object}
     * @private
     */
    var _data = data;

    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    var _nonOTOperation = null;

    /**
     * Get type of activity
     * @returns {string}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get entity id of the entity this activity works on
     * @returns {string}
     */
    this.getEntityId = function () {
      return _entityId;
    };

    /**
     * Get JabberId of the user who issued this activity
     * @returns {string}
     */
    this.getSender = function () {
      return _sender;
    };

    /**
     * Get text of this activity which is displayed in the activity widget
     * @returns {string}
     */
    this.getText = function () {
      return _text;
    };

    /**
     * Get additional data for the activity
     * @returns {Object}
     */
    this.getData = function () {
      return _data;
    };

    /**
     * Convert operation to NonOTOperation
     * @returns {operations.non_ot.NonOTOperation}
     */
    this.toNonOTOperation = function () {
      if (_nonOTOperation === null) {
        _nonOTOperation = new NonOTOperation(
          ActivityOperation.TYPE,
          JSON.stringify({
            type: _type,
            entityId: _entityId,
            sender: _sender,
            text: _text,
            data: _data,
          })
        );
      }
      return _nonOTOperation;
    };
  }
  ActivityOperation.prototype.toJSON = function () {
    return {
      type: this.getType(),
      entityId: this.getEntityId(),
      sender: this.getSender(),
      text: this.getText(),
      data: this.getData(),
    };
  };
  return ActivityOperation;
});