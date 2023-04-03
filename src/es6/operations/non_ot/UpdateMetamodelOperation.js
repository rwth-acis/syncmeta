import NonOTOperation from "./NonOTOperation";

UpdateMetamodelOperation.TYPE = "UpdateMetamodelOperation";

/**
 * UpdateMetamodelOperation
 * @class operations.non_ot.UpdateMetamodelOperation
 * @memberof operations.non_ot
 * @constructor
 */
function UpdateMetamodelOperation(metaModelingRoomName, modelingRoomName) {
  /**
   * Room name of metamodel is created
   * @type {string}
   */
  var _metaModelingRoomName = metaModelingRoomName;

  /**
   * Room name to upload created metamodel
   * @type {string}
   */
  var _modelingRoomName = modelingRoomName;

  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  /**
   * Get metamodeling room name
   * @returns {string}
   */
  this.getMetaModelingRoomName = function () {
    return _metaModelingRoomName;
  };

  /**
   * Get modeling room name
   * @returns {string}
   */
  this.getModelingRoomName = function () {
    return _modelingRoomName;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        UpdateMetamodelOperation.TYPE,
        JSON.stringify({ empty: "empty" })
      );
    }
    return _nonOTOperation;
  };
}
UpdateMetamodelOperation.prototype.toJSON = function () {
  return {};
};
export default UpdateMetamodelOperation;
