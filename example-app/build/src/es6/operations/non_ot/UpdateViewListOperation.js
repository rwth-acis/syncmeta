import NonOTOperation from "./NonOTOperation";
UpdateViewListOperation.TYPE = "UpdateViewListOperation";
function UpdateViewListOperation() {
    var nonOTOperation = null;
    this.toNonOTOperation = function () {
        if (nonOTOperation === null) {
            nonOTOperation = new NonOTOperation(UpdateViewListOperation.TYPE, JSON.stringify({}));
        }
        return nonOTOperation;
    };
}
export default UpdateViewListOperation;
//# sourceMappingURL=UpdateViewListOperation.js.map