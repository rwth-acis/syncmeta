import NonOTOperation from "./NonOTOperation";
SetModelAttributeNodeOperation.TYPE = "SetModelAttributeNodeOperation";
function SetModelAttributeNodeOperation() {
    var nonOTOperation = null;
    this.toNonOTOperation = function () {
        if (nonOTOperation === null) {
            nonOTOperation = new NonOTOperation(SetModelAttributeNodeOperation.TYPE, JSON.stringify({ empty: "empty" }));
        }
        return nonOTOperation;
    };
}
export default SetModelAttributeNodeOperation;
//# sourceMappingURL=SetModelAttributeNodeOperation.js.map