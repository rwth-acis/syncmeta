import NonOTOperation from "./NonOTOperation";
UpdateMetamodelOperation.TYPE = "UpdateMetamodelOperation";
function UpdateMetamodelOperation(metaModelingRoomName, modelingRoomName) {
    var _metaModelingRoomName = metaModelingRoomName;
    var _modelingRoomName = modelingRoomName;
    var _nonOTOperation = null;
    this.getMetaModelingRoomName = function () {
        return _metaModelingRoomName;
    };
    this.getModelingRoomName = function () {
        return _modelingRoomName;
    };
    this.toNonOTOperation = function () {
        if (_nonOTOperation === null) {
            _nonOTOperation = new NonOTOperation(UpdateMetamodelOperation.TYPE, JSON.stringify({ empty: "empty" }));
        }
        return _nonOTOperation;
    };
}
UpdateMetamodelOperation.prototype.toJSON = function () {
    return {};
};
export default UpdateMetamodelOperation;
//# sourceMappingURL=UpdateMetamodelOperation.js.map