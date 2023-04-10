export default NodeMoveOperation;
declare class NodeMoveOperation {
    static TYPE: string;
    static getOperationDescription(nodeType: any, nodeLabel: any, viewId: any): string;
    constructor(entityId: any, offsetX: any, offsetY: any, jabberId: any);
    getOffsetX: () => number;
    getOffsetY: () => number;
    getJabberId: () => string;
    setJabberId: (jabberId: string) => void;
    private getOTOperation;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: EntityOperation) => EntityOperation;
    inverse: () => NodeMoveOperation;
    toJSON: () => {
        id: any;
        offsetX: any;
        offsetY: any;
        jabberId: any;
    };
}
import EntityOperation from "./EntityOperation";
//# sourceMappingURL=NodeMoveOperation.d.ts.map