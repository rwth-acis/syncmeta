import NonOTOperation from "./NonOTOperation";
MoveCanvasOperation.TYPE = "MoveCanvasOperation";
function MoveCanvasOperation(objectId, transition) {
    var _nonOTOperation = null;
    this.getObjectId = function () {
        return objectId;
    };
    this.getTransition = function () {
        return transition;
    };
    this.setNonOTOperation = function (nonOTOperation) {
        _nonOTOperation = nonOTOperation;
    };
    this.getNonOTOperation = function () {
        return _nonOTOperation;
    };
    this.toNonOTOperation = function () {
        if (_nonOTOperation === null) {
            _nonOTOperation = new NonOTOperation(MoveCanvasOperation.TYPE, JSON.stringify({
                objectId: objectId,
                transition: transition,
            }));
        }
        return _nonOTOperation;
    };
}
export default MoveCanvasOperation;
//# sourceMappingURL=MoveCanvasOperation.js.map