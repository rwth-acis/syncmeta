import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import Util from "./Util";
import { CONFIG } from "./config";



export async function getUserInfo() {
  const url =
    localStorage.getItem("userinfo_endpoint") ||
    "https://auth.las2peer.org/auth/realms/main/protocol/openid-connect/userinfo";
  const response = await fetch(url, {
    headers: { Authorization: "Bearer " + localStorage.access_token },
  }).catch((error) => {
    console.log("Error: " + error);
  });

  try {
    if (response && response.ok) {
      console.log(response);
      const data = await response.json();
      console.log(data);
      const space = { user: {} };
      space.user[CONFIG.NS.PERSON.TITLE] = data.preferred_username;
      space.user[CONFIG.NS.PERSON.JABBERID] = data.sub;
      space.user[CONFIG.NS.PERSON.MBOX] = data.email;
      space.user.globalId = -1;
      space.user.self = true;

      return space;
    }
  } catch (error) {
    console.error(error);
  }

  return { user: Util.generateAnonymousUser() };
}

