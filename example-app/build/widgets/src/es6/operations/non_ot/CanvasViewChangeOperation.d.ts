export default CanvasViewChangeOperation;
declare function CanvasViewChangeOperation(left: any, top: any, width: any, height: any, zoom: any): void;
declare class CanvasViewChangeOperation {
    constructor(left: any, top: any, width: any, height: any, zoom: any);
    getLeft: () => any;
    getTop: () => any;
    getWidth: () => any;
    getHeight: () => any;
    getZoom: () => any;
    setNonOTOperation: operations.non_ot.NonOTOperation;
    getNonOTOperation: operations.non_ot.NonOTOperation;
    toNonOTOperation: () => operations.non_ot.NonOTOperation;
}
declare namespace CanvasViewChangeOperation {
    const TYPE: string;
}
//# sourceMappingURL=CanvasViewChangeOperation.d.ts.map