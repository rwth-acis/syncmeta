import NonOTOperation from "./NonOTOperation";
ViewInitOperation.TYPE = "ViewInitOperation";
function ViewInitOperation(data, viewpoint) {
    var _data = data;
    var _viewpoint = viewpoint;
    var nonOTOperation = null;
    this.getData = function () {
        return _data;
    };
    this.getViewpoint = function () {
        return _viewpoint;
    };
    this.toNonOTOperation = function () {
        if (nonOTOperation === null) {
            nonOTOperation = new NonOTOperation(ViewInitOperation.TYPE, JSON.stringify({ data: _data, viewpoint: _viewpoint }));
        }
        return nonOTOperation;
    };
}
export default ViewInitOperation;
//# sourceMappingURL=ViewInitOperation.js.map