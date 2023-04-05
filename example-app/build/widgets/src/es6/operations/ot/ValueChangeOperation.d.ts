export default ValueChangeOperation;
declare class ValueChangeOperation {
    static TYPE: string;
    static getOperationDescription(valueKey: any, entityType: any, entityName: any, viewId: any): string;
    constructor(entityId: any, value: any, type: any, position: any, jabberId?: any, fromView?: any);
    getJabberId: () => any;
    setJabberId: (jabberId: any) => void;
    getFromView: () => any;
    setFromView: (fromView: any) => void;
    getValue: () => string;
    getType: () => string;
    setPosition: (position: any) => void;
    getPosition: () => number;
    setRemote: (remote: any) => void;
    getRemote: () => boolean;
    setEntityIdChain: (entityIdChain: string[]) => void;
    getEntityIdChain: () => string[];
    getRootSubjectEntityId: () => string;
    private getOTOperation;
    adjust: (EntityManager: canvas_widget.EntityManager, operation: operations.ot.EntityOperation) => operations.ot.EntityOperation;
    inverse: () => ValueChangeOperation;
    toJSON: () => {
        entityId: any;
        value: string;
        position: number;
        type: string;
        jabberId: any;
    };
}
//# sourceMappingURL=ValueChangeOperation.d.ts.map