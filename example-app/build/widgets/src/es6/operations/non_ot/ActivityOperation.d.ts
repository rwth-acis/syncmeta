export default ActivityOperation;
declare class ActivityOperation {
    static TYPE: string;
    constructor(type: any, entityId: any, sender: any, text: any, data: any);
    getType: () => string;
    getEntityId: () => string;
    getSender: () => string;
    getText: () => string;
    getData: () => any;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
    toJSON(): {
        type: string;
        entityId: string;
        sender: string;
        text: string;
        data: any;
    };
}
//# sourceMappingURL=ActivityOperation.d.ts.map