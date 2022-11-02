import NonOTOperation from ".//NonOTOperation";

CanvasViewChangeOperation.TYPE = "CanvasViewChangeOperation";

/**
 * Entity Select Operation
 * @class operations.non_ot.EntitySelectOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} selectedEntityId Entity id of the selected entity
 */
function CanvasViewChangeOperation(left, top, width, height, zoom) {
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  this.getLeft = function () {
    return left;
  };

  this.getTop = function () {
    return top;
  };

  this.getWidth = function () {
    return width;
  };

  this.getHeight = function () {
    return height;
  };

  this.getZoom = function () {
    return zoom;
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
        CanvasViewChangeOperation.TYPE,
        JSON.stringify({
          left: left,
          top: top,
          width: width,
          height: height,
          zoom: zoom,
        })
      );
    }
    return _nonOTOperation;
  };
}

export default CanvasViewChangeOperation;
