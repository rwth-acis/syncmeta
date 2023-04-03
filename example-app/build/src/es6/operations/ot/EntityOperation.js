import { CONFIG } from "../../config";
import OTOperation from "./OTOperation";
export class EntityOperation {
    constructor(operationType, entityId, entityType) {
        this.triggeredBy = window.y.clientID;
        var _operationType = operationType;
        var _otOperation = null;
        var _entityId = entityId;
        var _entityType = entityType;
        this.getOperationType = function () {
            return _operationType;
        };
        this.setOTOperation = function (otOperation) {
            _otOperation = otOperation;
        };
        this._getOTOperation = function () {
            return _otOperation;
        };
        this.getEntityId = function () {
            return _entityId;
        };
        this.getEntityType = function () {
            return _entityType;
        };
        this.adjust = function (EntityManager, operation) {
            return operation;
        };
        this.inverse = function () {
            return this;
        };
    }
    static { this.TYPES = {
        AttributeAddOperation: "AttributeAddOperation",
        AttributeDeleteOperation: "AttributeDeleteOperation",
        EdgeAddOperation: "EdgeAddOperation",
        EdgeDeleteOperation: "EdgeDeleteOperation",
        NodeAddOperation: "NodeAddOperation",
        NodeDeleteOperation: "NodeDeleteOperation",
        NodeMoveOperation: "NodeMoveOperation",
        NodeMoveZOperation: "NodeMoveZOperation",
        NodeResizeOperation: "NodeResizeOperation",
        ValueChangeOperation: "ValueChangeOperation",
    }; }
    getOTOperation() {
        return this._getOTOperation();
    }
}
export class NodeDeleteOperation extends EntityOperation {
    constructor(entityId, type, left, top, width, height, zIndex, containment, json) {
        super(EntityOperation.TYPES.NodeDeleteOperation, entityId, CONFIG.ENTITY.NODE);
        this.toJSON = function () {
            return {
                id: this.getEntityId(),
                type: this.getType(),
                left: this.getLeft(),
                top: this.getTop(),
                width: this.getWidth(),
                height: this.getHeight(),
                zIndex: this.getZIndex(),
                containment: this.getContainment(),
                json: this.getJSON(),
            };
        };
        var that = this;
        var _type = type;
        var _left = left;
        var _top = top;
        var _width = width;
        var _height = height;
        var _zIndex = zIndex;
        var _containment = containment;
        var _json = json;
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.NODE + ":" + that.getEntityId(), JSON.stringify({
                type: _type,
                left: _left,
                top: _top,
                width: _width,
                height: _height,
                zIndex: _zIndex,
                containment: _containment,
                json: _json,
            }), CONFIG.OPERATION.TYPE.UPDATE, CONFIG.IWC.POSITION.NODE.DEL);
        };
        this.getType = function () {
            return _type;
        };
        this.getLeft = function () {
            return _left;
        };
        this.getTop = function () {
            return _top;
        };
        this.getWidth = function () {
            return _width;
        };
        this.getHeight = function () {
            return _height;
        };
        this.getZIndex = function () {
            return _zIndex;
        };
        this.getContainment = function () {
            return _containment;
        };
        this.getJSON = function () {
            return _json;
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
            var edge;
            switch (operation.getOperationType()) {
                case EntityOperation.TYPES.AttributeAddOperation:
                case EntityOperation.TYPES.AttributeDeleteOperation:
                    edge = EntityManager.findEdge(operation.getRootSubjectEntityId());
                    if (edge &&
                        (edge.getSource().getEntityId() === this.getEntityId() ||
                            edge.getTarget().getEntityId() === this.getEntityId())) {
                        return null;
                    }
                    if (this.getEntityId() === operation.getRootSubjectEntityId()) {
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.EdgeAddOperation:
                case EntityOperation.TYPES.EdgeDeleteOperation:
                    edge = EntityManager.findEdge(operation.getEntityId());
                    if (edge &&
                        (edge.getSource().getEntityId() === this.getEntityId() ||
                            edge.getTarget().getEntityId() === this.getEntityId())) {
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.NodeAddOperation:
                case EntityOperation.TYPES.NodeDeleteOperation:
                case EntityOperation.TYPES.NodeMoveOperation:
                case EntityOperation.TYPES.NodeResizeOperation:
                    if (this.getEntityId() === operation.getEntityId()) {
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.ValueChangeOperation:
                    edge = EntityManager.findEdge(operation.getRootSubjectEntityId());
                    if (edge &&
                        (edge.getSource().getEntityId() === this.getEntityId() ||
                            edge.getTarget().getEntityId() === this.getEntityId())) {
                        return null;
                    }
                    if (operation.getRootSubjectEntityId() === this.getEntityId()) {
                        return null;
                    }
                    break;
            }
            return operation;
        };
        this.inverse = function () {
            return new NodeAddOperation(this.getEntityId(), this.getType(), this.getLeft(), this.getTop(), this.getWidth(), this.getHeight(), this.getZIndex(), this.getContainment(), this.getContainment(), json);
        };
    }
    static { this.TYPE = "NodeDeleteOperation"; }
    static getOperationDescription(nodeType, nodeLabel, viewId) {
        if (!nodeLabel && !viewId) {
            return "..deleted " + nodeType;
        }
        else if (!viewId) {
            return "..deleted " + nodeType + " " + nodeLabel;
        }
        else
            return "..deleted " + nodeType + " " + nodeLabel + " in View " + viewId;
    }
}
export class NodeAddOperation extends EntityOperation {
    constructor(entityId, type, left, top, width, height, zIndex, containment, json = null, viewId = null, oType = null, jabberId = null, defaultLabel = null, defaultAttributeValues = null) {
        super(EntityOperation.TYPES.NodeAddOperation, entityId, CONFIG.ENTITY.NODE);
        var that = this;
        var _viewId = viewId;
        var _jabberId = jabberId;
        var _oType = oType;
        var _type = type;
        var _left = left;
        var _top = top;
        var _width = width;
        var _height = height;
        var _zIndex = zIndex;
        var _containment = containment;
        var _json = json;
        var _defaultLabel = defaultLabel;
        var _defaultAttributeValues = defaultAttributeValues;
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.NODE + ":" + that.getEntityId(), JSON.stringify({
                type: _type,
                left: _left,
                top: _top,
                width: _width,
                height: _height,
                zIndex: _zIndex,
                containment: _containment,
                json: _json,
                viewId: _viewId,
                oType: _oType,
                jabberId: _jabberId,
            }), CONFIG.OPERATION.TYPE.INSERT, CONFIG.IWC.POSITION.NODE.ADD);
        };
        this.getType = function () {
            return _type;
        };
        this.getOriginType = function () {
            return _oType;
        };
        this.getLeft = function () {
            return _left;
        };
        this.getTop = function () {
            return _top;
        };
        this.getWidth = function () {
            return _width;
        };
        this.getHeight = function () {
            return _height;
        };
        this.getZIndex = function () {
            return _zIndex;
        };
        this.getContainment = function () {
            return _containment;
        };
        this.getJSON = function () {
            return _json;
        };
        this.getViewId = function () {
            return _viewId;
        };
        this.getJabberId = function () {
            return _jabberId;
        };
        this.getDefaultLabel = function () {
            return _defaultLabel;
        };
        this.getDefaultAttributeValues = function () {
            return _defaultAttributeValues;
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
            return new NodeDeleteOperation(this.getEntityId(), this.getType(), this.getLeft(), this.getTop(), this.getWidth(), this.getHeight(), this.getZIndex(), this.getContainment(), json);
        };
        this.toJSON = function () {
            return {
                id: this.getEntityId(),
                type: this.getType(),
                left: this.getLeft(),
                top: this.getTop(),
                width: this.getWidth(),
                height: this.getHeight(),
                zIndex: this.getZIndex(),
                containment: this.getContainment(),
                json: this.getJSON(),
                viewId: this.getViewId(),
                oType: this.getOriginType(),
                jabberId: this.getJabberId(),
                defaultLabel: this.getDefaultLabel(),
                defaultAttributeValues: this.getDefaultAttributeValues(),
                triggeredBy: this.triggeredBy,
            };
        };
    }
    static { this.TYPE = "NodeAddOperation"; }
    static getOperationDescription(nodeType, nodeLabel, viewId) {
        if (!nodeLabel && !viewId) {
            return "..created a new " + nodeType;
        }
        else if (!viewId) {
            return "..created " + nodeType + " " + nodeLabel;
        }
        else
            return ".. created " + nodeType + " " + nodeLabel + " in View " + viewId;
    }
}
export class EdgeDeleteOperation extends EntityOperation {
    constructor(entityId, type, source, target, json = null) {
        super(EntityOperation.TYPES.EdgeDeleteOperation, entityId, CONFIG.ENTITY.EDGE);
        this.toJSON = function () {
            return {
                id: this.getEntityId(),
                type: this.getType(),
                source: this.getSource(),
                target: this.getTarget(),
                json: this.getJSON(),
            };
        };
        var that = this;
        var _type = type;
        var _source = source;
        var _target = target;
        var _json = json;
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.EDGE + ":" + that.getEntityId(), JSON.stringify({
                type: _type,
                source: _source,
                target: _target,
                json: _json,
            }), CONFIG.OPERATION.TYPE.UPDATE, CONFIG.IWC.POSITION.EDGE.DEL);
        };
        this.getType = function () {
            return _type;
        };
        this.getSource = function () {
            return _source;
        };
        this.getTarget = function () {
            return _target;
        };
        this.getJSON = function () {
            return _json;
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
                case EntityOperation.TYPES.AttributeAddOperation:
                case EntityOperation.TYPES.AttributeDeleteOperation:
                    if (this.getEntityId() === operation.getRootSubjectEntityId()) {
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.EdgeAddOperation:
                case EntityOperation.TYPES.EdgeDeleteOperation:
                    if (this.getEntityId() === operation.getEntityId()) {
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.ValueChangeOperation:
                    if (this.getEntityId() === operation.getRootSubjectEntityId()) {
                        return null;
                    }
                    break;
            }
            return operation;
        };
        this.inverse = function () {
            return new EdgeAddOperation(this.getEntityId(), this.getType(), this.getSource(), this.getTarget());
        };
    }
    static { this.TYPE = "EdgeDeleteOperation"; }
    static getOperationDescription(edgeType, edgeLabel, viewId) {
        if (!edgeLabel && !viewId) {
            return "..deleted " + edgeType;
        }
        else if (!viewId) {
            return "..deleted " + edgeType + " " + edgeLabel;
        }
        else {
            return "..deleted " + edgeType + " " + edgeLabel + "in View " + viewId;
        }
    }
}
export class EdgeAddOperation extends EntityOperation {
    constructor(entityId, type, source, target, json = null, viewId = null, oType = null, jabberId = null) {
        super(EntityOperation.TYPES.EdgeAddOperation, entityId, CONFIG.ENTITY.EDGE);
        this.toJSON = function () {
            return {
                id: this.getEntityId(),
                type: this.getType(),
                source: this.getSource(),
                target: this.getTarget(),
                json: this.getJSON(),
                viewId: this.getViewId(),
                oType: this.getOriginType(),
                jabberId: this.getJabberId(),
            };
        };
        var that = this;
        var _oType = oType;
        var _jabberId = jabberId;
        this.getOriginType = function () {
            return _oType;
        };
        var _viewId = viewId;
        var _type = type;
        var _source = source;
        var _target = target;
        var _json = json;
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.EDGE + ":" + that.getEntityId(), JSON.stringify({
                type: _type,
                source: _source,
                target: _target,
                json: _json,
                viewId: _viewId,
                oType: _oType,
                jabberId: _jabberId,
            }), CONFIG.OPERATION.TYPE.INSERT, CONFIG.IWC.POSITION.EDGE.ADD);
        };
        this.getType = function () {
            return _type;
        };
        this.getSource = function () {
            return _source;
        };
        this.getTarget = function () {
            return _target;
        };
        this.getViewId = function () {
            return _viewId;
        };
        this.getJabberId = function () {
            return _jabberId;
        };
        this.getJSON = function () {
            return _json;
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
            return new EdgeDeleteOperation(this.getEntityId(), this.getType(), this.getSource(), this.getTarget());
        };
    }
    static { this.TYPE = "EdgeAddOperation"; }
    static getOperationDescription(edgeType, edgeLabel, sourceNodeType, sourceNodeLabel, targetNodeType, targetNodeLabel, viewId) {
        if (!edgeLabel && !viewId) {
            return ("..created a new " +
                edgeType +
                " between " +
                sourceNodeType +
                " " +
                sourceNodeLabel +
                " and " +
                targetNodeType +
                " " +
                targetNodeLabel);
        }
        else if (!viewId) {
            return ("..created " +
                edgeType +
                " " +
                edgeLabel +
                " between " +
                sourceNodeType +
                " " +
                sourceNodeLabel +
                " and " +
                targetNodeType +
                " " +
                targetNodeLabel);
        }
        else {
            return ("..created " +
                edgeType +
                " " +
                edgeLabel +
                " between " +
                sourceNodeType +
                " " +
                sourceNodeLabel +
                " and " +
                targetNodeType +
                " " +
                targetNodeLabel +
                " in View " +
                viewId);
        }
    }
}
export class AttributeAddOperation extends EntityOperation {
    constructor(entityId, subjectEntityId, rootSubjectEntityId, type, data = null) {
        super(EntityOperation.TYPES.AttributeAddOperation, entityId, CONFIG.ENTITY.ATTR);
        var that = this;
        var _subjectEntityId = subjectEntityId;
        var _rootSubjectEntityId = rootSubjectEntityId;
        var _type = type;
        var _data = data;
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.ATTR + ":" + that.getEntityId(), JSON.stringify({
                type: _type,
                subjectEntityId: _subjectEntityId,
                rootSubjectEntityId: _rootSubjectEntityId,
                data: _data,
            }), CONFIG.OPERATION.TYPE.INSERT, CONFIG.IWC.POSITION.ATTR.ADD);
        };
        this.getSubjectEntityId = function () {
            return _subjectEntityId;
        };
        this.getRootSubjectEntityId = function () {
            return _rootSubjectEntityId;
        };
        this.getType = function () {
            return _type;
        };
        this.getOTOperation = function () {
            var otOperation = EntityOperation.prototype.getOTOperation.call(this);
            if (otOperation === null) {
                otOperation = createOTOperation();
                that.setOTOperation(otOperation);
            }
            return otOperation;
        };
        this.getData = function () {
            return _data;
        };
        this.adjust = function (EntityManager, operation) {
            return operation;
        };
        this.inverse = function () {
            return new AttributeDeleteOperation(that.getEntityId(), that.getSubjectEntityId(), that.getRootSubjectEntityId(), that.getType());
        };
        this.toJSON = function () {
            return {
                entityId: this.getEntityId(),
                type: this.getType(),
                subjectEntityId: this.getSubjectEntityId(),
                rootSubjectEntityId: this.getRootSubjectEntityId(),
                data: this.getData(),
            };
        };
    }
    static { this.TYPE = "AttributeAddOperation"; }
}
export class AttributeDeleteOperation extends EntityOperation {
    constructor(entityId, subjectEntityId, rootSubjectEntityId, type) {
        super(EntityOperation.TYPES.AttributeDeleteOperation, entityId, CONFIG.ENTITY.ATTR);
        var that = this;
        var _subjectEntityId = subjectEntityId;
        var _rootSubjectEntityId = rootSubjectEntityId;
        var _type = type;
        var createOTOperation = function () {
            return new OTOperation(CONFIG.ENTITY.ATTR + ":" + that.getEntityId(), JSON.stringify({
                type: _type,
                subjectEntityId: _subjectEntityId,
                rootSubjectEntityId: _rootSubjectEntityId,
            }), CONFIG.OPERATION.TYPE.UPDATE, CONFIG.IWC.POSITION.ATTR.DEL);
        };
        this.getSubjectEntityId = function () {
            return _subjectEntityId;
        };
        this.getRootSubjectEntityId = function () {
            return _rootSubjectEntityId;
        };
        this.getType = function () {
            return _type;
        };
        this.getOTOperation = function () {
            var otOperation = EntityOperation.prototype.getOTOperation.call(this);
            if (otOperation === null) {
                otOperation = createOTOperation();
                that.setOTOperation(otOperation);
            }
            return otOperation;
        };
        this.adjust = function (EntityManager, operation) {
            switch (operation.getOperationType()) {
                case EntityOperation.TYPES.AttributeAddOperation:
                case EntityOperation.TYPES.AttributeDeleteOperation:
                    if (that.getRootSubjectEntityId() === operation.getRootSubjectEntityId()) {
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.ValueChangeOperation:
                    if (operation.getEntityIdChain().indexOf(this.getEntityId()) !== -1) {
                        return null;
                    }
                    break;
            }
            return operation;
        };
        this.inverse = function () {
            return new AttributeAddOperation(this.getEntityId(), this.getSubjectEntityId(), this.getRootSubjectEntityId(), this.getType());
        };
        this.toJSON = function () {
            return {
                entityId: this.getEntityId(),
                type: this.getType(),
                subjectEntityId: this.getSubjectEntityId(),
                rootSubjectEntityId: this.getRootSubjectEntityId(),
            };
        };
    }
    static { this.TYPE = "AttributeDeleteOperation"; }
}
export default EntityOperation;
//# sourceMappingURL=EntityOperation.js.map