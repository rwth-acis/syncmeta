import jQuery from "jquery";
import { CONFIG } from "./config";
import { OpenAppProvider } from "./lib/openapp";
const openapp = new OpenAppProvider().openapp;
/**
 * Util
 * @class Util
 * @name Util
 * @constructor
 */
export default {
  /**
   * Generate random hex string
   * @param {number} [length] Length of string (Default=24)
   * @returns {string}
   */
  generateRandomId: function (length) {
    var chars = "1234567890abcdef";
    var numOfChars = chars.length;
    var i, rand;
    var res = "";

    if (typeof length === "undefined") length = 24;

    for (i = 0; i < length; i++) {
      rand = Math.floor(Math.random() * numOfChars);
      res += chars[rand];
    }
    return res;
  },

  /**
   * Wait for delay milliseconds then return
   * @param delay
   * @returns {promise}
   */
  delay: function (delay) {
    var deferred = jQuery.Deferred();
    setTimeout(function () {
      deferred.resolve();
    }, delay);
    return deferred.promise();
  },

  /**
   * Union the two passed objects into a new object (on a duplicate key, the first object has priority)
   * @param {object} obj1
   * @param {object} obj2
   * @returns {object}
   */
  union: function (obj1, obj2) {
    var res = {},
      i;
    for (i in obj1) {
      if (obj1.hasOwnProperty(i)) {
        res[i] = obj1[i];
      }
    }
    for (i in obj2) {
      if (obj2.hasOwnProperty(i) && !obj1.hasOwnProperty(i)) {
        res[i] = obj2[i];
      }
    }
    return res;
  },

  /**
   * Merge the elements of the second object into the first (on a duplicate key, the first object has priority)
   * @param {object} obj1
   * @param {object} obj2
   * @returns {object}
   */
  merge: function (obj1, obj2) {
    var i;
    for (i in obj2) {
      if (obj2.hasOwnProperty(i) && !obj1.hasOwnProperty(i)) {
        obj1[i] = obj2[i];
      }
    }
    return obj1;
  },

  /**
   * Converts an async function that expects a callback as last parameter into a promise
   * @param func
   * @returns {promise}
   */
  toPromise: function (func) {
    return function () {
      //noinspection JSAccessibilityCheck
      var args = Array.prototype.slice.call(arguments);
      var deferred = jQuery.Deferred();
      args.push(function () {
        deferred.resolve.apply(this, arguments);
      });
      func.apply(this, args);
      return deferred.promise();
    };
  },

  COLORS: [
    "#8AFFC8", //türkis
    "#8A9FFF", //light blue
    "#FF8A8A", //Rot
    "#FFC08A", //Orange
    "#FF8AD2", //Pink
    "#8AEBFF", //Blue
    "#C68AFF", //Lila
    "#8EFF8A", //green
  ],

  /**
   * Map an integer to one of ten colors
   * @param id
   * @returns {string}
   */
  getColor: function (id) {
    return this.COLORS[id % this.COLORS.length];
  },

  /*function hashCode(s){
     return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
     };*/
  /**
   * Returns the id of the given user (will be its index in the user list)
   * @param {*} user
   * @param {*} y the shared yjs document
   * @returns
   */
  getGlobalId: function (user, y) {
    var mbox = user.user[CONFIG.NS.PERSON.MBOX]; // mailbox of the user
    const userMap = y.getMap("users");
    var users = Array.from(userMap.values()); // get all users
    var id = users.indexOf(mbox);
    if (id === -1) {
      id = users.length;
      userMap.set(y.clientID, mbox);
    }
    return id;
  },

  /**
   * Get the current state of the primary document store
   * @returns {*}
   * @constructor
   */
  GetCurrentBaseModel: function () {
    var resourceSpace = new openapp.oo.Resource(openapp.param.space());
    var deferred = jQuery.Deferred();
    resourceSpace.getSubResources({
      relation: openapp.ns.role + "data",
      type: CONFIG.NS.MY.MODEL,
      onAll: function (data) {
        if (data === null || data.length === 0) {
          deferred.resolve([]);
        } else {
          data[0].getRepresentation("rdfjson", function (representation) {
            if (!representation) {
              deferred.resolve([]);
            } else {
              deferred.resolve(representation);
            }
          });
        }
      },
    });
    return deferred.promise();
  },

  getSpaceTitle: function (url) {
    return url
      .substring(url.lastIndexOf("spaces/"))
      .replace(/spaces|#\S*|\?\S*|\//g, "");
  },
};
