import NonOTOperation from "./NonOTOperation";
class InitModelTypesOperation {
    constructor(vls, startViewGeneration) {
        this.nonOTOperation = null;
        this.getVLS = function () {
            return this._vls;
        };
        this.getViewGenerationFlag = function () {
            return this._startViewGeneration;
        };
        this.toNonOTOperation = function () {
            if (this.nonOTOperation === null) {
                this.nonOTOperation = new NonOTOperation(InitModelTypesOperation.TYPE, JSON.stringify({
                    vls: this._vls,
                    startViewGeneration: this._startViewGeneration,
                }));
            }
            return this.nonOTOperation;
        };
        this._vls = vls;
        this._startViewGeneration = startViewGeneration;
    }
    static { this.TYPE = "InitModelTypesOperation"; }
}
export default InitModelTypesOperation;
//# sourceMappingURL=InitModelTypesOperation.js.map