import NonOTOperation from "./NonOTOperation";
ShowGuidanceBoxOperation.TYPE = "ShowGuidanceBoxOperation";
function ShowGuidanceBoxOperation(label, guidance, entityId) {
    var nonOTOperation = null;
    var _label = label;
    var _guidance = guidance;
    var _entityId = entityId;
    this.getLabel = function () {
        return _label;
    };
    this.getGuidance = function () {
        return _guidance;
    };
    this.getEntityId = function () {
        return _entityId;
    };
    this.toNonOTOperation = function () {
        if (nonOTOperation === null) {
            nonOTOperation = new NonOTOperation(ShowGuidanceBoxOperation.TYPE, JSON.stringify({
                label: _label,
                guidance: _guidance,
                entityId: _entityId,
            }));
        }
        return nonOTOperation;
    };
}
export default ShowGuidanceBoxOperation;
//# sourceMappingURL=ShowGuidanceBoxOperation.js.map