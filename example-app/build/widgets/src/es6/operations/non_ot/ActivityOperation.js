import NonOTOperation from "./NonOTOperation";
class ActivityOperation {
    constructor(type, entityId, sender, text, data) {
        var _type = type;
        var _entityId = entityId;
        var _sender = sender;
        var _text = text;
        var _data = data;
        var _nonOTOperation = null;
        this.getType = function () {
            return _type;
        };
        this.getEntityId = function () {
            return _entityId;
        };
        this.getSender = function () {
            return _sender;
        };
        this.getText = function () {
            return _text;
        };
        this.getData = function () {
            return _data;
        };
        this.toNonOTOperation = function () {
            if (_nonOTOperation === null) {
                _nonOTOperation = new NonOTOperation(ActivityOperation.TYPE, JSON.stringify({
                    type: _type,
                    entityId: _entityId,
                    sender: _sender,
                    text: _text,
                    data: _data,
                }));
            }
            return _nonOTOperation;
        };
    }
    static { this.TYPE = "ActivityOperation"; }
    toJSON() {
        return {
            type: this.getType(),
            entityId: this.getEntityId(),
            sender: this.getSender(),
            text: this.getText(),
            data: this.getData(),
        };
    }
}
export default ActivityOperation;
//# sourceMappingURL=ActivityOperation.js.map