import { Space } from "./static";
/**
 * This class contains common functions that are used in the example app.
 * It is used to set the space and the yjs room.
 * Each space has two yjs rooms, one for the model and one for the meta-model.
 */
export class Common {
  /**
   * Sets the current yjs room. This is used for synchronization with YJS.
   * @param spaceName  the current space
   */
  static setYjsRoom(spaceName?: string) {
    if (!spaceName) {
      spaceName = Common.getSyncmetaSpaceName();
    }
    const room = Common.getYjsRoomNameForCurrentSpace(spaceName);
    localStorage.setItem("yjs-room", room);
  }
  /**
   *  Returns the current space. This is used for synchronization with YJS.
   * @returns the current space
   */
  static getYjsRoom() {
    return localStorage.getItem("yjs-room");
  }
  /**
   * Returns the Yjs room name for the current space.
   * It prepends the space name to the syncmeta space.
   * @param space  the current space
   * @returns
   */
  static getYjsRoomNameForCurrentSpace(space: string) {
    // check that the space is valid
    if (!Object.values(Space).includes(space as Space)) {
      throw new Error(
        "Invalid space name. only 'meta-modeling-space' or 'modeling-space' are allowed."
      );
    }
    return space + "-" + Common.getSyncmetaSpaceName();
  }

  /**
   * Sets the syncmeta space name. It taken from the user input in the space input.
   * @param name
   */
  static setSyncmetaSpaceName(name: string) {
    localStorage.setItem("syncmeta-space-name", name);
  }
  /**
   * Returns the syncmeta space name
   * @returns the syncmeta space name
   **/
  static getSyncmetaSpaceName() {
    return localStorage.getItem("syncmeta-space-name");
  }
}
