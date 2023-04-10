export default MoveCanvasOperation;
declare function MoveCanvasOperation(objectId: any, transition: any): void;
declare class MoveCanvasOperation {
    constructor(objectId: any, transition: any);
    getObjectId: () => any;
    getTransition: () => any;
    setNonOTOperation: operations.non_ot.NonOTOperation;
    getNonOTOperation: operations.non_ot.NonOTOperation;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
}
declare namespace MoveCanvasOperation {
    const TYPE: string;
}
//# sourceMappingURL=MoveCanvasOperation.d.ts.map