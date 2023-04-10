export default NodeMoveZOperation;
declare class NodeMoveZOperation {
    static TYPE: string;
    static getOperationDescription(nodeType: any, nodeLabel: any, viewId: any): string;
    constructor(entityId: any, offsetZ: any, jabberId: any);
    getOffsetZ: () => number;
    getJabberId: () => string;
    setJabberId: (jabberId: any) => void;
    private getOTOperation;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: EntityOperation) => EntityOperation;
    inverse: () => NodeMoveZOperation;
    toJSON: () => {
        id: any;
        offsetZ: any;
        jabberId: any;
    };
}
import EntityOperation from "./EntityOperation";
//# sourceMappingURL=NodeMoveZOperation.d.ts.map