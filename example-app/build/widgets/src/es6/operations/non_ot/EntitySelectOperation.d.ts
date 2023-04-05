export default EntitySelectOperation;
declare function EntitySelectOperation(selectedEntityId: string, selectedEntityType: string, jabberId: string): void;
declare class EntitySelectOperation {
    constructor(selectedEntityId: string, selectedEntityType: string, jabberId: string);
    getSelectedEntityId: () => string;
    getSelectedEntityType: () => string;
    getJabberId: () => string;
    setNonOTOperation: operations.non_ot.NonOTOperation;
    getNonOTOperation: operations.non_ot.NonOTOperation;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
    toJSON(): {
        selectedEntityId: string;
        selectedEntityType: string;
        jabberId: string;
    };
}
declare namespace EntitySelectOperation {
    const TYPE: string;
}
//# sourceMappingURL=EntitySelectOperation.d.ts.map