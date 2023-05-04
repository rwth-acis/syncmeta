import { CONFIG } from "../../config";
import EntityOperation from "./EntityOperation";
import OTOperation from "./OTOperation";
class NodeResizeOperation extends EntityOperation {
    constructor(entityId, offsetX, offsetY, jabberId) {
        super(EntityOperation.TYPES.NodeResizeOperation, entityId, CONFIG.ENTITY.NODE);
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
        var _jabberId = jabberId;
        var _offsetX = offsetX;
        var _offsetY = offsetY;
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.NODE + ":" + that.getEntityId(), JSON.stringify({
                offsetX: _offsetX,
                offsetY: _offsetY,
                jabberId: _jabberId,
            }), CONFIG.OPERATION.TYPE.UPDATE, CONFIG.IWC.POSITION.NODE.DIM);
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
            return new NodeResizeOperation(this.getEntityId(), -this.getOffsetX(), -this.getOffsetY(), this.getJabberId());
        };
    }
    static { this.TYPE = "NodeResizeOperation"; }
    static getOperationDescription(nodeType, nodeLabel, viewId) {
        if (!nodeLabel && !viewId) {
            return "..resized " + nodeType;
        }
        else if (!viewId) {
            return "..resized " + nodeType + " " + nodeLabel;
        }
        else {
            return "..resized " + nodeType + " " + nodeLabel + " in View " + viewId;
        }
    }
}
export default NodeResizeOperation;
//# sourceMappingURL=NodeResizeOperation.js.map