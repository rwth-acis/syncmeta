import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import Util from "./Util";
import { CONFIG } from "./config";

var url = localStorage.userinfo_endpoint;

export async function getUserInfo() {
  url =
    localStorage.getItem("userinfo_endpoint") ||
    "https://auth.las2peer.org/auth/realms/main/protocol/openid-connect/userinfo";
  const response = await fetch(url, {
    headers: { Authorization: "Bearer " + localStorage.access_token },
  }).catch((error) => {
    console.log("Error: " + error);
  });
  try {
    if (response && response.ok) {
      const data = await response.json();
      const space = { user: {} };
      space.user[CONFIG.NS.PERSON.TITLE] = data.name;
      space.user[CONFIG.NS.PERSON.JABBERID] = data.sub;
      space.user[CONFIG.NS.PERSON.MBOX] = data.email;
      space.user.globalId = -1;
      console.info("User promise by " + undefined, space);
      return space;
    } else {
      console.log("Error: " + response.status);
    }
  } catch (error) {
    console.error(error);
  }
  const space = { user: {} };
  var id = Util.generateRandomId();
  space.user[CONFIG.NS.PERSON.TITLE] = "Anonymous";
  space.user[CONFIG.NS.PERSON.JABBERID] = id;
  space.user[CONFIG.NS.PERSON.MBOX] = id + "@anonym.com";
  space.user.globalId = -1;
  return space;
}
