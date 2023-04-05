export default NodeResizeOperation;
declare class NodeResizeOperation {
    static TYPE: string;
    static getOperationDescription(nodeType: any, nodeLabel: any, viewId: any): string;
    constructor(entityId: any, offsetX: any, offsetY: any, jabberId: any);
    getOffsetX: () => number;
    getOffsetY: () => number;
    getJabberId: () => any;
    setJabberId: (jabberId: any) => void;
    private getOTOperation;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: EntityOperation) => EntityOperation;
    inverse: () => NodeResizeOperation;
    toJSON: () => {
        id: any;
        offsetX: any;
        offsetY: any;
        jabberId: any;
    };
}
import EntityOperation from "./EntityOperation";
//# sourceMappingURL=NodeResizeOperation.d.ts.map