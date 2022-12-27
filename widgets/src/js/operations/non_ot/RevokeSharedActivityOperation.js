define([".//NonOTOperation"], /** @lends EntitySelectOperation */ function (
  NonOTOperation
) {
  RevokeSharedActivityOperation.TYPE = "RevokeSharedActivityOperation";

  /**
   * Entity Select Operation
   * @class operations.non_ot.EntitySelectOperation
   * @memberof operations.non_ot
   * @constructor
   * @param {string} selectedEntityId Entity id of the selected entity
   */
  function RevokeSharedActivityOperation(id) {
    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    var _nonOTOperation = null;

    this.getId = function () {
      return id;
    };

    /**
     * Set corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     */
    this.setNonOTOperation = function (nonOTOperation) {
      _nonOTOperation = nonOTOperation;
    };

    /**
     * Get corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     */
    this.getNonOTOperation = function () {
      return _nonOTOperation;
    };

    /**
     * Convert operation to NonOTOperation
     * @returns {operations.non_ot.NonOTOperation}
     */
    this.toNonOTOperation = function () {
      if (_nonOTOperation === null) {
        _nonOTOperation = new NonOTOperation(
          RevokeSharedActivityOperation.TYPE,
          JSON.stringify({
            id: id,
          })
        );
      }
      return _nonOTOperation;
    };
  }

  RevokeSharedActivityOperation.prototype.toJSON = function () {
    return { id: this.getId() };
  };

  return RevokeSharedActivityOperation;
});