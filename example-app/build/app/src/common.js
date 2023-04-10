export class Common {
    static setSpace(syncmetaSpace) {
        window.syncmetaRoom = this.createYjsRoomNameWithSpace(syncmetaSpace);
        localStorage.setItem("syncmetaSpace", window.syncmetaRoom);
    }
    static createYjsRoomNameWithSpace(space) {
        return space + "-" + this.getYjsRoomName();
    }
    static setYjsRoomName(roomName) {
        localStorage.setItem("yjsRoomWithoutSpaceName", roomName);
    }
    static getYjsRoomName() {
        return localStorage.getItem("yjsRoomWithoutSpaceName");
    }
}
//# sourceMappingURL=common.js.map