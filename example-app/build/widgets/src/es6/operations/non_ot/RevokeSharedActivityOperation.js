import NonOTOperation from "./NonOTOperation";
RevokeSharedActivityOperation.TYPE = "RevokeSharedActivityOperation";
function RevokeSharedActivityOperation(id) {
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
            _nonOTOperation = new NonOTOperation(RevokeSharedActivityOperation.TYPE, JSON.stringify({
                id: id,
            }));
        }
        return _nonOTOperation;
    };
}
RevokeSharedActivityOperation.prototype.toJSON = function () {
    return { id: this.getId() };
};
export default RevokeSharedActivityOperation;
//# sourceMappingURL=RevokeSharedActivityOperation.js.map