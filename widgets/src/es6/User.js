import "jquery";
import "jquery-ui";
import Util from "./Util";
import { CONFIG } from "./config";
var deferred = $.Deferred();
var url = localStorage.userinfo_endpoint;

export async function getUserInfo() {
  url =
    localStorage.getItem("userinfo_endpoint") ||
    "https://auth.las2peer.org/auth/realms/main/userinfo";
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

$.ajax({
  type: "GET",
  headers: {
    Authorization: "Bearer " + localStorage.access_token,
  },
  url: url,
  success: function (data) {
    var space = { user: {} };
    space.user[CONFIG.NS.PERSON.TITLE] = data.name;
    space.user[CONFIG.NS.PERSON.JABBERID] = data.sub;
    space.user[CONFIG.NS.PERSON.MBOX] = data.email;
    space.user.globalId = -1;
    console.info("User promise by " + undefined, space);
    deferred.resolve(space);
  },
  error: function (error) {
    var space = { user: {} };
    var id = Util.generateRandomId();
    space.user[CONFIG.NS.PERSON.TITLE] = "Anonymous";
    space.user[CONFIG.NS.PERSON.JABBERID] = id;
    space.user[CONFIG.NS.PERSON.MBOX] = id + "@anonym.com";
    space.user.globalId = -1;
    $(".widget-title-bar", frameElement.offsetParent)
      .find("span")
      .text("Canvas[NOT LOGGED IN]");
    console.info("User promise by " + undefined, space);
    deferred.resolve(space);
  },
});

export default deferred.promise();
