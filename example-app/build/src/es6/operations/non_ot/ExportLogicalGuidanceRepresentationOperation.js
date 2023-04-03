import NonOTOperation from "./NonOTOperation";
ExportLogicalGuidanceRepresentationOperation.TYPE =
    "ExportLogicalGuidanceRepresentationOperation";
function ExportLogicalGuidanceRepresentationOperation(requestingComponent, data) {
    var _requestingComponent = requestingComponent;
    var _data = data;
    var _nonOTOperation = null;
    this.getRequestingComponent = function () {
        return _requestingComponent;
    };
    this.getData = function () {
        return _data;
    };
    this.setData = function (data) {
        _data = data;
    };
    this.toNonOTOperation = function () {
        if (_nonOTOperation === null) {
            _nonOTOperation = new NonOTOperation(ExportLogicalGuidanceRepresentationOperation.TYPE, JSON.stringify({
                requestingComponent: _requestingComponent,
                data: _data,
            }));
        }
        return _nonOTOperation;
    };
}
export default ExportLogicalGuidanceRepresentationOperation;
//# sourceMappingURL=ExportLogicalGuidanceRepresentationOperation.js.map