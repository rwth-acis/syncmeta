export default ViewInitOperation;
declare function ViewInitOperation(data: object, viewpoint: object): void;
declare class ViewInitOperation {
    constructor(data: object, viewpoint: object);
    getData: () => string;
    getViewpoint: () => any;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
}
declare namespace ViewInitOperation {
    const TYPE: string;
}
//# sourceMappingURL=ViewInitOperation.d.ts.map