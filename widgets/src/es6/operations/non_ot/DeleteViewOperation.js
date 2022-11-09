import NonOTOperation from "./NonOTOperation";

DeleteViewOperation.TYPE = "DeleteViewOperation";

/**
 * DeleteViewOperation
 * @class operations.non_ot.DeleteViewOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} viewId identifier of the view
 */
function DeleteViewOperation(viewId) {
  /**
   * Name of selected tool
   * @type {string}
   */
  var _viewId = viewId;

  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var nonOTOperation = null;

  /**
   * Get the list with node ids to delete
   * @returns {string}
   */
  this.getViewId = function () {
    return _viewId;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (nonOTOperation === null) {
      nonOTOperation = new NonOTOperation(
        DeleteViewOperation.TYPE,
        JSON.stringify({ viewId: _viewId })
      );
    }
    return nonOTOperation;
  };
}

export default DeleteViewOperation;
