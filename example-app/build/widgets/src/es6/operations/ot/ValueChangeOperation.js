import { CONFIG } from "../../config";
import EntityOperation from "./EntityOperation";
import OTOperation from "./OTOperation";
class ValueChangeOperation extends EntityOperation {
    constructor(entityId, value, type, position, jabberId = null, fromView = null) {
        super(EntityOperation.TYPES.ValueChangeOperation, entityId, CONFIG.ENTITY.VAL);
        var that = this;
        var _fromView = fromView;
        var _jabberId = jabberId;
        var _value = value;
        var _type = type;
        var _position = position;
        var _remote = true;
        var _entityIdChain = [];
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.VAL + ":" + that.getEntityId(), _value, _type, _position, _jabberId, _fromView);
        };
        this.getJabberId = function () {
            return _jabberId;
        };
        this.setJabberId = function (jabberId) {
            _jabberId = jabberId;
        };
        this.getFromView = function () {
            return _fromView;
        };
        this.setFromView = function (fromView) {
            _fromView = fromView;
        };
        this.getValue = function () {
            return _value;
        };
        this.getType = function () {
            return _type;
        };
        this.setPosition = function (position) {
            _position = position;
        };
        this.getPosition = function () {
            return _position;
        };
        this.setRemote = function (remote) {
            _remote = remote;
        };
        this.getRemote = function () {
            return _remote;
        };
        this.setEntityIdChain = function (entityIdChain) {
            _entityIdChain = entityIdChain;
        };
        this.getEntityIdChain = function () {
            return _entityIdChain;
        };
        this.getRootSubjectEntityId = function () {
            return _entityIdChain[0];
        };
        this.getOTOperation = function () {
            var otOperation = EntityOperation.prototype.getOTOperation.call(this);
            if (otOperation === null) {
                otOperation = createOTOperation();
                this.setOTOperation(otOperation);
            }
            return otOperation;
        };
        this.adjust = function (EntityManager, operation) {
            switch (operation.getOperationType()) {
                case EntityOperation.TYPES.ValueChangeOperation:
                    if (this.getEntityId() === operation.getEntityId()) {
                        if ((this.getPosition() === operation.getPosition &&
                            this.getValue() === operation.getValue &&
                            this.getType() === CONFIG.OPERATION.TYPE.INSERT &&
                            operation.getType() === CONFIG.OPERATION.TYPE.DELETE) ||
                            (this.getType() === CONFIG.OPERATION.TYPE.DELETE &&
                                operation.getType() === CONFIG.OPERATION.TYPE.INSERT)) {
                            return null;
                        }
                        if (this.getPosition() <= operation.getPosition()) {
                            switch (this.getType()) {
                                case CONFIG.OPERATION.TYPE.INSERT:
                                    operation.setPosition(operation.getPosition() + 1);
                                    break;
                                case CONFIG.OPERATION.TYPE.DELETE:
                                    operation.setPosition(operation.getPosition() - 1);
                                    break;
                            }
                        }
                    }
                    break;
            }
            return operation;
        };
        this.inverse = function () {
            var newType, ValueChangeOperation = ValueChangeOperation;
            switch (this.getType()) {
                case CONFIG.OPERATION.TYPE.INSERT:
                    newType = CONFIG.OPERATION.TYPE.DELETE;
                    break;
                case CONFIG.OPERATION.TYPE.DELETE:
                    newType = CONFIG.OPERATION.TYPE.INSERT;
                    break;
                case CONFIG.OPERATION.TYPE.UPDATE:
                    newType = CONFIG.OPERATION.TYPE.UPDATE;
                    break;
            }
            return new ValueChangeOperation(this.getEntityId(), this.getValue(), newType, this.getPosition());
        };
        this.toJSON = function () {
            return {
                entityId: this.getEntityId(),
                value: this.getValue(),
                position: this.getPosition(),
                type: this.getType(),
                jabberId: this.getJabberId(),
            };
        };
    }
    static { this.TYPE = "ValueChangeOperation"; }
    static getOperationDescription(valueKey, entityType, entityName, viewId) {
        if (!viewId)
            return (".. changed " +
                valueKey +
                " of " +
                entityType +
                (entityName ? " " : "") +
                entityName);
        else
            return (".. changed " +
                valueKey +
                " of " +
                entityType +
                (entityName ? " " : "") +
                entityName +
                " in View " +
                viewId);
    }
}
export default ValueChangeOperation;
//# sourceMappingURL=ValueChangeOperation.js.map