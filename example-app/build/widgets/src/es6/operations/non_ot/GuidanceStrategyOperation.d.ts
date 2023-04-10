export default GuidanceStrategyOperation;
declare class GuidanceStrategyOperation {
    static TYPE: string;
    constructor(data: any);
    getData: () => any;
    setNonOTOperation: operations.non_ot.NonOTOperation;
    getNonOTOperation: operations.non_ot.NonOTOperation;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
    toJSON(): {
        data: any;
    };
}
//# sourceMappingURL=GuidanceStrategyOperation.d.ts.map