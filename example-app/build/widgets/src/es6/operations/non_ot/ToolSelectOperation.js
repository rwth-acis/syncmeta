import NonOTOperation from "./NonOTOperation";
class ToolSelectOperation {
    constructor(toolName, label, defaultAttributeValues = {}) {
        var selectedToolName = toolName;
        var nonOTOperation = null;
        var defaultLabel = label;
        var defaultAttributeValues = defaultAttributeValues;
        this.getSelectedToolName = function () {
            return selectedToolName;
        };
        this.getDefaultLabel = function () {
            return defaultLabel;
        };
        this.getDefaultAttributeValues = function () {
            return defaultAttributeValues;
        };
        this.toNonOTOperation = function () {
            if (nonOTOperation === null) {
                nonOTOperation = new NonOTOperation(ToolSelectOperation.TYPE, JSON.stringify({ selectedToolName: selectedToolName }));
            }
            return nonOTOperation;
        };
    }
    static { this.TYPE = "ToolSelectOperation"; }
}
export default ToolSelectOperation;
//# sourceMappingURL=ToolSelectOperation.js.map