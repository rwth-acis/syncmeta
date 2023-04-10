export default DeleteViewOperation;
declare function DeleteViewOperation(viewId: string): void;
declare class DeleteViewOperation {
    constructor(viewId: string);
    getViewId: () => string;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
}
declare namespace DeleteViewOperation {
    const TYPE: string;
}
//# sourceMappingURL=DeleteViewOperation.d.ts.map