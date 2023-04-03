export class Common {
  static setSpace(syncmetaSpace: string) {
    window.syncmetaRoom = this.createYjsRoomNameWithSpace(syncmetaSpace);
    localStorage.setItem("syncmetaSpace", window.syncmetaRoom);
  }

  static createYjsRoomNameWithSpace(space: string) {
    return space + "-" + this.getYjsRoomName();
  }

  static setYjsRoomName(roomName: string) {
    localStorage.setItem("yjsRoomWithoutSpaceName", roomName);
  }

  static getYjsRoomName() {
    return localStorage.getItem("yjsRoomWithoutSpaceName");
  }
}
