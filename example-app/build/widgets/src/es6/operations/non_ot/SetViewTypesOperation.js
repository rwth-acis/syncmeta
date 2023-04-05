import NonOTOperation from "./NonOTOperation";
class SetViewTypesOperation {
    constructor(flag) {
        this.getFlag = function () {
            return this._flag;
        };
        this.toNonOTOperation = function () {
            if (this.nonOTOperation === null) {
                this.nonOTOperation = new NonOTOperation(SetViewTypesOperation.TYPE, JSON.stringify({ flag: this._flag }));
            }
            return this.nonOTOperation;
        };
        this._flag = flag;
        this.nonOTOperation = null;
    }
    static { this.TYPE = "SetViewTypesOperation"; }
}
export default SetViewTypesOperation;
//# sourceMappingURL=SetViewTypesOperation.js.map