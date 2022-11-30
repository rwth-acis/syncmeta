import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import Util from "./Util";
import { CONFIG } from "./config";
import { OpenAppProvider } from "./lib/openapp";
const openapp = new OpenAppProvider().openapp;
var resourceSpace = new openapp.oo.Resource(openapp.param.space());
var resourceGetPromise = Util.toPromise(openapp.resource.get);

function getSpaceObj() {
  return resourceGetPromise(openapp.param.space()).then(function (spaceObj) {
    var deferred = $.Deferred();
    if (!spaceObj.data) {
      //Try again
      return Util.delay(500)
        .then(function () {
          return getSpaceObj();
        })
        .then(function (s) {
          deferred.resolve(s);
        });
    }
    deferred.resolve(spaceObj);
    return deferred.promise();
  });
}

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
  return $.when(getSpaceObj(), getUserObj()).then(function (spaceObj, userObj) {
    var promiseArray;
    var deferred;
    var person;
    var space = {
      user: {},
      members: {},
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
      console.info("Space object promise by " + undefined);
      console.info(spaceObj);

      space.title = spaceObj.subject[CONFIG.NS.PERSON.TITLE][0].value;
    } catch (e) {
      console.info("Space promise failed!");
      return;
    }
    deferred = $.Deferred();

    promiseArray = [];
    resourceSpace.getSubResources({
      relation: "http://xmlns.com/foaf/0.1/member",
      onAll: function (membersObj) {
        var promise;

        for (
          var i = 0, numOfMembers = membersObj.length;
          i < numOfMembers;
          i++
        ) {
          promise = resourceGetPromise(
            membersObj[i].info.subject[
              "http://www.w3.org/2002/07/owl#sameAs"
            ][0].value
          );
          promiseArray.push(promise);
        }
        $.when.apply($, promiseArray).done(function () {
          var personData;
          var person;

          for (
            var i = 0, numOfMembers = arguments.length;
            i < numOfMembers;
            i++
          ) {
            if (arguments[i].data) {
              person = arguments[i].data[arguments[i].uri];
              personData = {};
              personData[CONFIG.NS.PERSON.TITLE] =
                person[CONFIG.NS.PERSON.TITLE][0].value;
              personData[CONFIG.NS.PERSON.JABBERID] = person[
                CONFIG.NS.PERSON.JABBERID
              ][0].value.replace("xmpp:", "");
              personData[CONFIG.NS.PERSON.MBOX] =
                person[CONFIG.NS.PERSON.MBOX][0].value;
              personData.globalId = i;

              if (
                personData[CONFIG.NS.PERSON.JABBERID] ===
                space.user[CONFIG.NS.PERSON.JABBERID]
              ) {
                space.user.globalId = i;
              }

              space.members[personData[CONFIG.NS.PERSON.JABBERID]] = personData;
            }
          }
          deferred.resolve(space);
        });
      },
    });

    return deferred.promise();
  });
}

export default Space();
