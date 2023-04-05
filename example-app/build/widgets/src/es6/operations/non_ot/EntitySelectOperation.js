import NonOTOperation from "./NonOTOperation";
EntitySelectOperation.TYPE = "EntitySelectOperation";
function EntitySelectOperation(selectedEntityId, selectedEntityType, jabberId) {
    var _selectedEntityId = selectedEntityId;
    var _jabberId = jabberId;
    var _selectedEntityType = selectedEntityType;
    var _nonOTOperation = null;
    this.getSelectedEntityId = function () {
        return _selectedEntityId;
    };
    this.getSelectedEntityType = function () {
        return _selectedEntityType;
    };
    this.getJabberId = function () {
        return _jabberId;
    };
    this.setNonOTOperation = function (nonOTOperation) {
        _nonOTOperation = nonOTOperation;
    };
    this.getNonOTOperation = function () {
        return _nonOTOperation;
    };
    this.toNonOTOperation = function () {
        if (_nonOTOperation === null) {
            _nonOTOperation = new NonOTOperation(EntitySelectOperation.TYPE, JSON.stringify({
                selectedEntityId: _selectedEntityId,
                selectedEntityType: _selectedEntityType,
            }));
        }
        return _nonOTOperation;
    };
}
EntitySelectOperation.prototype.toJSON = function () {
    return {
        selectedEntityId: this.getSelectedEntityId(),
        selectedEntityType: this.getSelectedEntityType(),
        jabberId: this.getJabberId(),
    };
};
export default EntitySelectOperation;
//# sourceMappingURL=EntitySelectOperation.js.map