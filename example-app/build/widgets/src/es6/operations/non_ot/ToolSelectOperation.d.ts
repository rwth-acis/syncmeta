export default ToolSelectOperation;
declare class ToolSelectOperation {
    static TYPE: string;
    constructor(toolName: any, label: any, defaultAttributeValues?: {});
    selectedToolName: string;
    private nonOTOperation;
    defaultLabel: string;
    defaultAttributeValues: map;
    getSelectedToolName: () => string;
    getDefaultLabel: () => string;
    getDefaultAttributeValues: () => map;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
}
//# sourceMappingURL=ToolSelectOperation.d.ts.map