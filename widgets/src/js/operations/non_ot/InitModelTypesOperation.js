define([".//NonOTOperation"], /** @lends InitModelTypesOperation */ function (
  NonOTOperation
) {
  InitModelTypesOperation.TYPE = "InitModelTypesOperation";

  /**
   * InitModelTypesOperation
   * @class operations.non_ot.InitModelTypesOperation
   * @memberof operations.non_ot
   * @constructor
   * @param {string} vls the visual language specification
   * @param {bool} startViewGeneration
   */
  function InitModelTypesOperation(vls, startViewGeneration) {
    /**
     * Name of selected tool
     * @type {string}
     */
    var _vls = vls;

    var _startViewGeneration = startViewGeneration;

    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    var nonOTOperation = null;

    /**
     * Get name of selected tool
     * @returns {string}
     */
    this.getVLS = function () {
      return vls;
    };

    this.getViewGenerationFlag = function () {
      return _startViewGeneration;
    };

    /**
     * Convert operation to NonOTOperation
     * @returns {operations.non_ot.NonOTOperation}
     */
    this.toNonOTOperation = function () {
      if (nonOTOperation === null) {
        nonOTOperation = new NonOTOperation(
          InitModelTypesOperation.TYPE,
          JSON.stringify({
            vls: _vls,
            startViewGeneration: _startViewGeneration,
          })
        );
      }
      return nonOTOperation;
    };
  }

  return InitModelTypesOperation;
});
