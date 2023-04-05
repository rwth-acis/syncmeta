export default NonOTOperation;
declare function NonOTOperation(type: string, data: string): void;
declare class NonOTOperation {
    constructor(type: string, data: string);
    setSender: (sender: any) => void;
    getSender: () => string;
    getType: () => string;
    getData: () => string;
    getOperationObject: () => {
        type: string;
        data: string;
    };
    constructor: typeof NonOTOperation;
}
//# sourceMappingURL=NonOTOperation.d.ts.map