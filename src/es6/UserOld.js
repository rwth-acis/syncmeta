import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import Util from "./Util";
import { CONFIG } from "./config";
import { OpenAppProvider } from "./lib/openapp";
const openapp = new OpenAppProvider().openapp;
var resourceSpace = new openapp.oo.Resource(openapp.param.space());
var resourceGetPromise = Util.toPromise(openapp.resource.get);

function getUserObj() {
  return resourceGetPromise(openapp.param.user()).then(function (userObj) {
    var deferred = $.Deferred();
    if (!userObj.data) {
      //Try again
      return Util.delay(500)
        .then(function () {
          return getUserObj();
        })
        .then(function (u) {
          deferred.resolve(u);
        });
    }
    deferred.resolve(userObj);
    return deferred.promise();
  });
}

/**
 * Space
 * @name Space
 */
function Space() {
  var deferred = $.Deferred();
  getUserObj().done(function (userObj) {
    var person;
    var space = {
      user: {},
    };
    try {
      person = userObj.data[userObj.uri];
      space.user[CONFIG.NS.PERSON.TITLE] =
        person[CONFIG.NS.PERSON.TITLE][0].value;
      space.user[CONFIG.NS.PERSON.JABBERID] = person[
        CONFIG.NS.PERSON.JABBERID
      ][0].value.replace("xmpp:", "");
      space.user[CONFIG.NS.PERSON.MBOX] =
        person[CONFIG.NS.PERSON.MBOX][0].value;
      space.user.globalId = -1;
      console.info("User promise by " + undefined, space);
      deferred.resolve(space);
    } catch (e) {
      console.info("Space promise failed!");
      deferred.reject();
    }
  });
  return deferred.promise();
}

export default Space();
