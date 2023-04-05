export default OTOperation;
declare class OTOperation extends Operation {
    constructor(name: any, value: any, type: any, position: any);
    setSender: (sender: any) => void;
    getSender: () => string;
    getName: () => string;
    getValue: () => string;
    getType: () => string;
    getPosition: () => number;
    getOperationObject: () => {
        type: string;
        data: string;
    };
}
import Operation from "../Operation";
//# sourceMappingURL=OTOperation.d.ts.map