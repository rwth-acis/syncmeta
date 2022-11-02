import $ from "jquery-ui";
import Util from "Util";
var deferred = $.Deferred();
var url = localStorage.userinfo_endpoint;
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
    console.info("User promise by " + frameElement.name, space);
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
    console.info("User promise by " + frameElement.name, space);
    deferred.resolve(space);
  },
});

export default deferred.promise();
