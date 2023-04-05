import Operation from "../Operation";
NonOTOperation.prototype = new Operation();
NonOTOperation.prototype.constructor = NonOTOperation;
function NonOTOperation(type, data) {
    var _sender = null;
    var _operation = {
        type: type,
        data: data
    };
    this.setSender = function (sender) {
        _sender = sender;
    };
    this.getSender = function () {
        return _sender;
    };
    this.getType = function () {
        return _operation.type;
    };
    this.getData = function () {
        return _operation.data;
    };
    this.getOperationObject = function () {
        return _operation;
    };
}
export default NonOTOperation;
//# sourceMappingURL=NonOTOperation.js.map