export class EntityOperation {
    static TYPES: {
        AttributeAddOperation: string;
        AttributeDeleteOperation: string;
        EdgeAddOperation: string;
        EdgeDeleteOperation: string;
        NodeAddOperation: string;
        NodeDeleteOperation: string;
        NodeMoveOperation: string;
        NodeMoveZOperation: string;
        NodeResizeOperation: string;
        ValueChangeOperation: string;
    };
    constructor(operationType: any, entityId: any, entityType: any);
    getOperationType: () => string;
    setOTOperation: (otOperation: operations.ot.OTOperation) => void;
    _getOTOperation: () => operations.ot.OTOperation;
    getEntityId: () => string;
    getEntityType: () => string;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: EntityOperation) => EntityOperation;
    inverse: () => operations.ot.EntityOperation;
    toJSON: any;
    triggeredBy: any;
    getOTOperation(): operations.ot.OTOperation;
}
export class NodeDeleteOperation {
    static TYPE: string;
    static getOperationDescription(nodeType: any, nodeLabel: any, viewId: any): string;
    constructor(entityId: any, type: any, left: any, top: any, width: any, height: any, zIndex: any, containment: any, json: any);
    getType: () => string;
    getLeft: () => number;
    getTop: () => number;
    getWidth: () => number;
    getHeight: () => number;
    getZIndex: () => number;
    getContainment: () => boolean;
    getJSON: () => any;
    private getOTOperation;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: EntityOperation) => EntityOperation;
    inverse: () => operations.ot.NodeAddOperation;
    toJSON: () => {
        id: any;
        type: any;
        left: any;
        top: any;
        width: any;
        height: any;
        zIndex: any;
        containment: any;
        json: any;
    };
}
export class NodeAddOperation extends EntityOperation {
    static TYPE: string;
    static getOperationDescription(nodeType: any, nodeLabel: any, viewId: any): string;
    constructor(entityId: any, type: any, left: any, top: any, width: any, height: any, zIndex: any, containment: any, json?: any, viewId?: any, oType?: any, jabberId?: any, defaultLabel?: any, defaultAttributeValues?: any);
    getType: () => string;
    getOriginType: () => any;
    getLeft: () => number;
    getTop: () => number;
    getWidth: () => number;
    getHeight: () => number;
    getZIndex: () => number;
    getContainment: () => boolean;
    getJSON: () => any;
    getViewId: () => string;
    getJabberId: () => string;
    getDefaultLabel: () => string;
    getDefaultAttributeValues: () => any;
    toJSON: () => {
        id: string;
        type: string;
        left: number;
        top: number;
        width: number;
        height: number;
        zIndex: number;
        containment: boolean;
        json: any;
        viewId: string;
        oType: any;
        jabberId: string;
        defaultLabel: string;
        defaultAttributeValues: any;
        triggeredBy: any;
    };
    inverse: () => NodeDeleteOperation;
}
export class EdgeDeleteOperation {
    static TYPE: string;
    static getOperationDescription(edgeType: any, edgeLabel: any, viewId: any): string;
    constructor(entityId: any, type: any, source: any, target: any, json?: any);
    getType: () => string;
    getSource: () => string;
    getTarget: () => string;
    getJSON: () => any;
    private getOTOperation;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: EntityOperation) => EntityOperation;
    inverse: () => EdgeAddOperation;
    toJSON: () => {
        id: any;
        type: any;
        source: any;
        target: any;
        json: any;
    };
}
export class EdgeAddOperation {
    static TYPE: string;
    static getOperationDescription(edgeType: any, edgeLabel: any, sourceNodeType: any, sourceNodeLabel: any, targetNodeType: any, targetNodeLabel: any, viewId: any): string;
    constructor(entityId: any, type: any, source: any, target: any, json?: any, viewId?: any, oType?: any, jabberId?: any);
    getOriginType: () => any;
    getType: () => string;
    getSource: () => string;
    getTarget: () => string;
    getViewId: () => string;
    getJabberId: () => string;
    getJSON: () => any;
    private getOTOperation;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: EntityOperation) => EntityOperation;
    inverse: () => EdgeDeleteOperation;
    toJSON: () => {
        id: any;
        type: any;
        source: any;
        target: any;
        json: any;
        viewId: any;
        oType: any;
        jabberId: any;
    };
}
export class AttributeAddOperation {
    static TYPE: string;
    constructor(entityId: any, subjectEntityId: any, rootSubjectEntityId: any, type: any, data?: any);
    getSubjectEntityId: () => any;
    getRootSubjectEntityId: () => any;
    getType: () => any;
    getData: () => any;
    toJSON: () => {
        entityId: any;
        type: any;
        subjectEntityId: any;
        rootSubjectEntityId: any;
        data: any;
    };
    private getOTOperation;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: EntityOperation) => EntityOperation;
    inverse: () => AttributeDeleteOperation;
}
export class AttributeDeleteOperation {
    static TYPE: string;
    constructor(entityId: any, subjectEntityId: any, rootSubjectEntityId: any, type: any);
    getSubjectEntityId: () => any;
    getRootSubjectEntityId: () => any;
    getType: () => any;
    toJSON: () => {
        entityId: any;
        type: any;
        subjectEntityId: any;
        rootSubjectEntityId: any;
    };
    private getOTOperation;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: operations.ot.EntityOperation) => operations.ot.EntityOperation;
    inverse: () => operations.ot.AttributeAddOperation;
}
export default EntityOperation;
//# sourceMappingURL=EntityOperation.d.ts.map