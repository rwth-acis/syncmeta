export default RevokeSharedActivityOperation;
declare function RevokeSharedActivityOperation(id: any): void;
declare class RevokeSharedActivityOperation {
    constructor(id: any);
    getId: () => any;
    setNonOTOperation: operations.non_ot.NonOTOperation;
    getNonOTOperation: operations.non_ot.NonOTOperation;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
    toJSON(): {
        id: any;
    };
}
declare namespace RevokeSharedActivityOperation {
    const TYPE: string;
}
//# sourceMappingURL=RevokeSharedActivityOperation.d.ts.map