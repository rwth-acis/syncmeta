import NonOTOperation from "./NonOTOperation";
export class DeleteViewOperation {
    constructor(viewId) {
        var _viewId = viewId;
        var nonOTOperation = null;
        this.getViewId = function () {
            return _viewId;
        };
        this.toNonOTOperation = function () {
            if (nonOTOperation === null) {
                nonOTOperation = new NonOTOperation(DeleteViewOperation.TYPE, JSON.stringify({ viewId: _viewId }));
            }
            return nonOTOperation;
        };
    }
    static { this.TYPE = "DeleteViewOperation"; }
}
export default DeleteViewOperation;
//# sourceMappingURL=DeleteViewOperation.js.map