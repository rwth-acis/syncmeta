import NonOTOperation from "./NonOTOperation";

InitModelTypesOperation.TYPE = "InitModelTypesOperation";

/**
 * InitModelTypesOperation
 * @class operations.non_ot.InitModelTypesOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} vls the visual language specification
 * @param {bool} startViewGeneration
 */
class InitModelTypesOperation {
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  nonOTOperation = null;
  _vls;
  _startViewGeneration;
  getVLS = function () {
    return this._vls;
  };

  /**
   * Get name of selected tool
   * @returns {string}
   */
  getViewGenerationFlag = function () {
    return this._startViewGeneration;
  };
  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  toNonOTOperation = function () {
    if (this.nonOTOperation === null) {
      this.nonOTOperation = new NonOTOperation(
        InitModelTypesOperation.TYPE,
        JSON.stringify({
          vls: _vls,
          startViewGeneration: _startViewGeneration,
        })
      );
    }
    return this.nonOTOperation;
  };
  constructor(vls, startViewGeneration) {
    /**
     * Name of selected tool
     * @type {string}
     */
    this._vls = vls;

    this._startViewGeneration = startViewGeneration;
  }
}

export default InitModelTypesOperation;
