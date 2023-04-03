import NonOTOperation from "./NonOTOperation";
ExportMetaModelOperation.TYPE = "ExportMetaModelOperation";
function ExportMetaModelOperation(requestingComponent, data) {
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
            _nonOTOperation = new NonOTOperation(ExportMetaModelOperation.TYPE, JSON.stringify({
                requestingComponent: _requestingComponent,
                data: _data,
            }));
        }
        return _nonOTOperation;
    };
}
export default ExportMetaModelOperation;
//# sourceMappingURL=ExportMetaModelOperation.js.map