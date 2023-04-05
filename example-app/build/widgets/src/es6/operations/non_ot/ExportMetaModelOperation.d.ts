export default ExportMetaModelOperation;
declare function ExportMetaModelOperation(requestingComponent: string, data: string): void;
declare class ExportMetaModelOperation {
    constructor(requestingComponent: string, data: string);
    getRequestingComponent: () => string;
    getData: () => object;
    setData: (data: object) => void;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
}
declare namespace ExportMetaModelOperation {
    const TYPE: string;
}
//# sourceMappingURL=ExportMetaModelOperation.d.ts.map