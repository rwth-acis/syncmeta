export default ExportLogicalGuidanceRepresentationOperation;
declare function ExportLogicalGuidanceRepresentationOperation(requestingComponent: string, data: string): void;
declare class ExportLogicalGuidanceRepresentationOperation {
    constructor(requestingComponent: string, data: string);
    getRequestingComponent: () => string;
    getData: () => object;
    setData: (data: object) => void;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
}
declare namespace ExportLogicalGuidanceRepresentationOperation {
    const TYPE: string;
}
//# sourceMappingURL=ExportLogicalGuidanceRepresentationOperation.d.ts.map