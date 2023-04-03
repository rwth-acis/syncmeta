import NonOTOperation from "./NonOTOperation";
CanvasViewChangeOperation.TYPE = "CanvasViewChangeOperation";
function CanvasViewChangeOperation(left, top, width, height, zoom) {
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
    this.setNonOTOperation = function (nonOTOperation) {
        _nonOTOperation = nonOTOperation;
    };
    this.getNonOTOperation = function () {
        return _nonOTOperation;
    };
    this.toNonOTOperation = function () {
        if (_nonOTOperation === null) {
            _nonOTOperation = new NonOTOperation(CanvasViewChangeOperation.TYPE, JSON.stringify({
                left: left,
                top: top,
                width: width,
                height: height,
                zoom: zoom,
            }));
        }
        return _nonOTOperation;
    };
}
export default CanvasViewChangeOperation;
//# sourceMappingURL=CanvasViewChangeOperation.js.map