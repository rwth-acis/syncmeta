import NonOTOperation from "./NonOTOperation";
CollaborateInActivityOperation.TYPE = "CollaborateInActivityOperation";
function CollaborateInActivityOperation(id) {
    var _nonOTOperation = null;
    this.getId = function () {
        return id;
    };
    this.setNonOTOperation = function (nonOTOperation) {
        _nonOTOperation = nonOTOperation;
    };
    this.getNonOTOperation = function () {
        return _nonOTOperation;
    };
    this.toNonOTOperation = function () {
        if (_nonOTOperation === null) {
            _nonOTOperation = new NonOTOperation(CollaborateInActivityOperation.TYPE, JSON.stringify({
                id: id,
            }));
        }
        return _nonOTOperation;
    };
}
export default CollaborateInActivityOperation;
//# sourceMappingURL=CollaborateInActivityOperation.js.map