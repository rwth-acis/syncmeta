import Operation from "../Operation";
class OTOperation extends Operation {
    constructor(name, value, type, position) {
        super();
        var _sender = null;
        var _operation = {
            name: name,
            value: value,
            type: type,
            position: position
        };
        this.setSender = function (sender) {
            _sender = sender;
        };
        this.getSender = function () {
            return _sender;
        };
        this.getName = function () {
            return _operation.name;
        };
        this.getValue = function () {
            return _operation.value;
        };
        this.getType = function () {
            return _operation.type;
        };
        this.getPosition = function () {
            return _operation.position;
        };
        this.getOperationObject = function () {
            return _operation;
        };
    }
}
export default OTOperation;
//# sourceMappingURL=OTOperation.js.map