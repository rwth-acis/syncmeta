import { CONFIG } from "../../config";
import EntityOperation from "./EntityOperation";
import OTOperation from "./OTOperation";
class NodeMoveZOperation extends EntityOperation {
    constructor(entityId, offsetZ, jabberId) {
        super(EntityOperation.TYPES.NodeMoveZOperation, entityId, CONFIG.ENTITY.NODE);
        this.toJSON = function () {
            return {
                id: this.getEntityId(),
                offsetZ: this.getOffsetZ(),
                jabberId: this.getJabberId(),
                triggeredBy: this.triggeredBy,
            };
        };
        var that = this;
        var _offsetZ = offsetZ;
        var _jabberId = jabberId;
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.NODE + ":" + that.getEntityId(), JSON.stringify({
                offsetZ: _offsetZ,
                jabberId: _jabberId,
            }), CONFIG.OPERATION.TYPE.UPDATE, CONFIG.IWC.POSITION.NODE.Z);
        };
        this.getOffsetZ = function () {
            return _offsetZ;
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
            return new NodeMoveZOperation(this.getEntityId(), -this.getOffsetZ(), this.getJabberId());
        };
    }
    static { this.TYPE = "NodeMoveZOperation"; }
    static getOperationDescription(nodeType, nodeLabel, viewId) {
        if (!nodeLabel && !viewId) {
            return "..moved " + nodeType + " on on Z-Axis";
        }
        else if (!viewId) {
            return "..moved " + nodeType + " " + nodeLabel + " on Z-Axis";
        }
        else {
            return ("..moved " +
                nodeType +
                " " +
                nodeLabel +
                " in View " +
                viewId +
                " on Z-Axis");
        }
    }
}
export default NodeMoveZOperation;
//# sourceMappingURL=NodeMoveZOperation.js.map