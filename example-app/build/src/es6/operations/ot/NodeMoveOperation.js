import { CONFIG } from "../../config";
import EntityOperation from "./EntityOperation";
import OTOperation from "./OTOperation";
class NodeMoveOperation extends EntityOperation {
    constructor(entityId, offsetX, offsetY, jabberId) {
        super(EntityOperation.TYPES.NodeMoveOperation, entityId, CONFIG.ENTITY.NODE);
        this.toJSON = function () {
            return {
                id: this.getEntityId(),
                offsetX: this.getOffsetX(),
                offsetY: this.getOffsetY(),
                jabberId: this.getJabberId(),
                triggeredBy: this.triggeredBy,
            };
        };
        var that = this;
        var _offsetX = offsetX;
        var _offsetY = offsetY;
        var _jabberId = jabberId;
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.NODE + ":" + that.getEntityId(), JSON.stringify({
                offsetX: _offsetX,
                offsetY: _offsetY,
                jabberId: _jabberId,
            }), CONFIG.OPERATION.TYPE.UPDATE, CONFIG.IWC.POSITION.NODE.POS);
        };
        this.getOffsetX = function () {
            return _offsetX;
        };
        this.getOffsetY = function () {
            return _offsetY;
        };
        this.getJabberId = function () {
            return _jabberId;
        };
        this.setJabberId = function (jabberId) {
            _jabberId = jabberId;
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
            return operation;
        };
        this.inverse = function () {
            return new NodeMoveOperation(this.getEntityId(), -this.getOffsetX(), -this.getOffsetY(), this.getJabberId());
        };
    }
    static { this.TYPE = "NodeMoveOperation"; }
    static getOperationDescription(nodeType, nodeLabel, viewId) {
        if (!nodeLabel && !viewId) {
            return "..moved " + nodeType;
        }
        else if (!viewId) {
            return "..moved " + nodeType + " " + nodeLabel;
        }
        else {
            return "..moved " + nodeType + " " + nodeLabel + " in View " + viewId;
        }
    }
}
export default NodeMoveOperation;
//# sourceMappingURL=NodeMoveOperation.js.map