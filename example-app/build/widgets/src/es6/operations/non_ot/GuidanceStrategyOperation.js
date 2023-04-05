import NonOTOperation from "./NonOTOperation";
class GuidanceStrategyOperation {
    constructor(data) {
        var _nonOTOperation = null;
        this.getData = function () {
            return data;
        };
        this.setNonOTOperation = function (nonOTOperation) {
            _nonOTOperation = nonOTOperation;
        };
        this.getNonOTOperation = function () {
            return _nonOTOperation;
        };
        this.toNonOTOperation = function () {
            if (_nonOTOperation === null) {
                _nonOTOperation = new NonOTOperation(GuidanceStrategyOperation.TYPE, JSON.stringify({
                    data: data,
                }));
            }
            return _nonOTOperation;
        };
    }
    static { this.TYPE = "GuidanceStrategyOperation"; }
    toJSON() {
        return { data: this.getData() };
    }
}
export default GuidanceStrategyOperation;
//# sourceMappingURL=GuidanceStrategyOperation.js.map