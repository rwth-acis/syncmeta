export default UpdateMetamodelOperation;
declare function UpdateMetamodelOperation(metaModelingRoomName: any, modelingRoomName: any): void;
declare class UpdateMetamodelOperation {
    constructor(metaModelingRoomName: any, modelingRoomName: any);
    getMetaModelingRoomName: () => string;
    getModelingRoomName: () => string;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
    toJSON(): {};
}
declare namespace UpdateMetamodelOperation {
    const TYPE: string;
}
//# sourceMappingURL=UpdateMetamodelOperation.d.ts.map