export class Common {
  static setSpace(syncmetaSpace: string) {
    parent.syncmetaRoom = this.createYjsRoomNameWithSpace(syncmetaSpace);
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
