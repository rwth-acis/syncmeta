import NonOTOperation from "./NonOTOperation";

/**
 * SetViewTypesOperation
 * @class operations.non_ot.WidgetEnterOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {boolean} flag enable (true)/disable(false) the view types of the vml in the palette widget
 */
class SetViewTypesOperation {
  static TYPE = "SetViewTypesOperation";
  _flag;
  nonOTOperation;
  /**
   * Get name of selected tool
   * @returns {string}
   */
  getFlag = function () {
    return this._flag;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  toNonOTOperation = function () {
    if (this.nonOTOperation === null) {
      this.nonOTOperation = new NonOTOperation(
        SetViewTypesOperation.TYPE,
        JSON.stringify({ flag: this._flag })
      );
    }
    return this.nonOTOperation;
  };

  constructor(flag) {
    /**
     * Enable or disable the view types of the vml
     * @type {boolean}
     * @private
     */
    this._flag = flag;

    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    this.nonOTOperation = null;
  }
}

export default SetViewTypesOperation;
