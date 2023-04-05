import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import { CONFIG } from "./config";
import { OpenAppProvider } from "./lib/openapp";
const openapp = new OpenAppProvider().openapp;
export default {
    generateRandomId: function (length) {
        var chars = "1234567890abcdef";
        var numOfChars = chars.length;
        var i, rand;
        var res = "";
        if (typeof length === "undefined")
            length = 24;
        for (i = 0; i < length; i++) {
            rand = Math.floor(Math.random() * numOfChars);
            res += chars[rand];
        }
        return res;
    },
    generateAnonymousUser: function () {
        const user = {};
        var id = this.generateRandomId();
        user[CONFIG.NS.PERSON.TITLE] = "Anonymous";
        user[CONFIG.NS.PERSON.JABBERID] = id;
        user[CONFIG.NS.PERSON.MBOX] = id + "@anonym.com";
        user.globalId = -1;
        user.self = true;
        return user;
    },
    delay: function (delay) {
        var deferred = jQuery.Deferred();
        setTimeout(function () {
            deferred.resolve();
        }, delay);
        return deferred.promise();
    },
    union: function (obj1, obj2) {
        var res = {}, i;
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
    merge: function (obj1, obj2) {
        var i;
        for (i in obj2) {
            if (obj2.hasOwnProperty(i) && !obj1.hasOwnProperty(i)) {
                obj1[i] = obj2[i];
            }
        }
        return obj1;
    },
    toPromise: function (func) {
        return function () {
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
        "#8AFFC8",
        "#8A9FFF",
        "#FF8A8A",
        "#FFC08A",
        "#FF8AD2",
        "#8AEBFF",
        "#C68AFF",
        "#8EFF8A",
    ],
    getColor: function (id) {
        return this.COLORS[id % this.COLORS.length];
    },
    getGlobalId: function (user, y) {
        var mbox = user.user[CONFIG.NS.PERSON.MBOX];
        const userMap = y.getMap("users");
        var users = Array.from(userMap.values());
        var id = users.indexOf(mbox);
        if (id === -1) {
            id = users.length;
            userMap.set(y.clientID, mbox);
        }
        return id;
    },
    GetCurrentBaseModel: function () {
        var resourceSpace = new openapp.oo.Resource(openapp.param.space());
        var deferred = jQuery.Deferred();
        resourceSpace.getSubResources({
            relation: openapp.ns.role + "data",
            type: CONFIG.NS.MY.MODEL,
            onAll: function (data) {
                if (data === null || data.length === 0) {
                    deferred.resolve([]);
                }
                else {
                    data[0].getRepresentation("rdfjson", function (representation) {
                        if (!representation) {
                            deferred.resolve([]);
                        }
                        else {
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
//# sourceMappingURL=Util.js.map