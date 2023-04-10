export default ExportImageOperation;
declare function ExportImageOperation(requestingComponent: string, data: string): void;
declare class ExportImageOperation {
    constructor(requestingComponent: string, data: string);
    getRequestingComponent: () => string;
    getData: () => object;
    setData: (data: object) => void;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
}
declare namespace ExportImageOperation {
    const TYPE: string;
}
//# sourceMappingURL=ExportImageOperation.d.ts.map