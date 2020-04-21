
export default class Common {

    static setSpace(syncmetaSpace) {
        parent.syncmetaRoom = this.createYjsRoomNameWithSpace(syncmetaSpace);
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

