export default ShowGuidanceBoxOperation;
declare function ShowGuidanceBoxOperation(label: any, guidance: any, entityId: any): void;
declare class ShowGuidanceBoxOperation {
    constructor(label: any, guidance: any, entityId: any);
    getLabel: () => any;
    getGuidance: () => any;
    getEntityId: () => any;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
}
declare namespace ShowGuidanceBoxOperation {
    const TYPE: string;
}
//# sourceMappingURL=ShowGuidanceBoxOperation.d.ts.map