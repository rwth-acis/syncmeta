import { css, html, LitElement } from 'lit';
import 'https://unpkg.com/jquery@3.6.0/dist/jquery.js';
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return {kind:t,elements:s,finisher(n){customElements.define(e,n);}}})(e,n);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

function init () {
    var createReloadHandler = function () {
        var iwcClient = window._iwc_instance_;
        var intent_listener = [];
        if (iwcClient && iwcClient.onIntent != null) {
            var previous_iwc_onIntent = iwcClient.onIntent;
            iwcClient.onIntent = function (message) {
                if (message.action === "RELOAD") {
                    console.log(" K!!!!!!!!!!!!!!!!!!!!!!!!!!!! RELOAD!!!!!!!!!!!!!!!!!!!!!");
                    window.location.reload();
                }
                else {
                    for (var i = 0; i < intent_listener.length; i++) {
                        intent_listener[i].apply(this, arguments);
                    }
                }
                previous_iwc_onIntent.apply(this, arguments);
            };
            window._addIwcIntentListener = function (f) {
                intent_listener.push(f);
            };
            window._reloadThisFuckingInstance = function () {
                console.log("Reloading Everything");
                var message = {
                    action: "RELOAD",
                    component: "",
                    data: "",
                    dataType: "",
                    flags: ["PUBLISH_GLOBAL"],
                    extras: {
                        reload: true,
                    },
                };
                iwcClient.publish(message);
            };
        }
        else {
            setTimeout(createReloadHandler, 5000);
        }
    };
    setTimeout(createReloadHandler, 10000);
}

const CONFIG = {
  TEST: {
    USER: "Luigi Test",
    EMAIL: "luigi.test05@gmail.com",
    CANVAS: false,
    ATTRIBUTE: false,
    PALETTE: false,
    ACTIVITY: false,
  },
  LAYER: {
    META: "META",
    MODEL: "MODEL",
  },
  WIDGET: {
    NAME: {
      MAIN: "Canvas",
      PALETTE: "Palette",
      ATTRIBUTE: "Property Browser",
      ACTIVITY: "User Activity",
      GUIDANCE: "Guidance",
      HEATMAP: "Heatmap",
      METADATA: "METADATA",
      OPENAPI: "Metadata Widget",
      DEBUG: "Debug",
      IMSLD_EXPORT: "IMSLD Export",
      JSON_EXPORT: "JSON Export",
      VIEWCONTROL: "View Control",
    },
  },
  ENTITY: {
    NODE: "node",
    EDGE: "edge",
    ATTR: "attr",
    VAL: "val",
  },
  IWC: {
    FLAG: {
      PUBLISH_GLOBAL: "PUBLISH_GLOBAL",
      PUBLISH_LOCAL: "PUBLISH_LOCAL",
    },
    ACTION: {
      SYNC: "ACTION_SYNC",
      DATA: "ACTION_DATA",
      DATA_ARRAY: "ACTION_DATA_ARRAY",
    },
    POSITION: {
      NODE: {
        ADD: 0,
        DEL: 0,
        POS: 1,
        Z: 2,
        DIM: 3,
      },
      EDGE: {
        ADD: 0,
        DEL: 0,
        MOV: 1,
      },
      ATTR: {
        ADD: 0,
        DEL: 0,
      },
    },
  },
  OPERATION: {
    TYPE: {
      INSERT: "insert",
      UPDATE: "update",
      DELETE: "delete",
    },
  },
  ACTIVITY: {
    TYPE: {
      NODEADD: 0,
      EDGEADD: 1,
      NODEDEL: 2,
      EDGEDEL: 3,
      NODEATTRCHANGE: 4,
    },
  },
  DATA: {
    RELATION: {
      GLOBAL: {
        MAIN: {
          MAIN: {
            OPERATION: "MAIN2MAIN4OPERATION",
          },
        },
      },
      LOCAL: {
        PALETTE: {
          MAIN: {
            TOOLSELECTION: "PALETTE2MAIN4TOOLSELECTION",
          },
        },
        MAIN: {
          ATTRIBUTE: {
            NODESELECTION: "MAIN2ATTRIBUTE4NODESELECTION",
            NODEADDITION: "MAIN2ATTRIBUTE4NODEADDITION",
            ATTRIBUTECHANGE: "MAIN2ATTRIBUTE4ATTRIBUTECHANGE",
          },
          ACTIVITY: {
            NEWACTIVITY: "MAIN2ACTIVITY4NEWACTIVITY",
          },
          PALETTE: {
            TOOLSELECTION: "MAIN2PALETTE4TOOLSELECTION",
          },
        },
        ATTRIBUTE: {
          MAIN: {
            ATTRIBUTECHANGE: "ATTRIBUTE2MAIN4ATTRIBUTECHANGE",
          },
        },
      },
    },
  },
  NS: {
    PERSON: {
      TITLE: "http://purl.org/dc/terms/title",
      JABBERID: "http://xmlns.com/foaf/0.1/jabberID",
      MBOX: "http://xmlns.com/foaf/0.1/mbox",
    },
    MY: {
      MODEL: "my:ns:model",
      METAMODEL: "my:ns:metamodel",
      INSTANCE: "my:ns:instance",
      VIEWPOINT: "my:ns:viewpoint",
      VIEW: "my:ns:view",
      COPY: "my:ns:copy",
      GUIDANCEMODEL: "my:ns:guidancemodel",
      METAMODELPREVIEW: "my:ns:metamodelpreview",
      GUIDANCEMETAMODEL: "my:ns:guidancemetamodel",
      LOGICALGUIDANCEREPRESENTATION: "my:ns:logicalguidancerepresentation",
    },
  },
};

 /**
  * Gets the html tag name of a widget. 
  * Use this function to get the tag name of a or your own widget.
  * @example getWidgetTagName("My Widget") // returns "my-widget-widget"
  * @param {*} name name of the widget
  * @returns  {string} tag name of the widget
  */
function getWidgetTagName(name) {
  if (!name) return;
  if (
    !Object.values(CONFIG.WIDGET.NAME).some(
      (n) => n.toLocaleLowerCase() === name.toLocaleLowerCase()
    )
  ) {
    console.warn(
      `Widget name ${name} is not defined in config.js. Add it to the CONFIG.WIDGET.NAME object.`
    );
  }
  let widgetName = name;
  widgetName = widgetName.replace(/\s+/g, "-");
  return `${widgetName}-widget`.toLowerCase();
}

class OpenAppProvider {
  openapp;
  gadgets;
  constructor() {
    var openapp = {};
    this.openapp = openapp;
    openapp["event"] = {};
    var gadgets = "undefined" !== typeof this.gadgets ? this.gadgets : {};
    this.gadgets = gadgets;
    gadgets.openapp = gadgets.openapp || {};
    var usePostMessage =
        "undefined" !== typeof window &&
        "undefined" !== typeof window.parent &&
        "undefined" !== typeof window.postMessage &&
        "undefined" !== typeof JSON &&
        "undefined" !== typeof JSON.parse &&
        "undefined" !== typeof JSON.stringify,
      usePubSub =
        !usePostMessage &&
        "undefined" !== typeof gadgets &&
        "undefined" !== typeof gadgets.pubsub &&
        "undefined" !== typeof gadgets.pubsub.subscribe &&
        "undefined" !== typeof gadgets.pubsub.unsubscribe &&
        "undefined" !== typeof gadgets.pubsub.publish,
      init = { postParentOnly: true },
      ownData,
      doCallback,
      onMessage;
    usePostMessage
      ? ((onMessage = function (a) {
          if (
            "string" === typeof a.data &&
            '{"OpenApplicationEvent":{' === a.data.slice(0, 25)
          ) {
            var b = JSON.parse(a.data).OpenApplicationEvent;
            if (
              "openapp" === b.event &&
              !0 === b.welcome &&
              a.source === window.parent
            ) {
              for (var d in b.message) {
                b.message.hasOwnProperty(d) && (init[d] = b.message[d]);
              }
            } else {
              (b.source = a.source),
                (b.origin = a.origin),
                (b.toJSON = function () {
                  var a = {},
                    b;
                  for (b in this) {
                    this.hasOwnProperty(b) &&
                      "function" !== typeof this[b] &&
                      "source" !== b &&
                      "origin" !== b &&
                      (a[b] = this[b]);
                  }
                  return a;
                }),
                "function" === typeof doCallback &&
                  // @ts-ignore
                  !0 === doCallback(b, b.message) &&
                  window.parent.postMessage(
                    JSON.stringify({
                      OpenApplicationEvent: { event: "openapp", receipt: !0 },
                    }),
                    "*"
                  );
            }
          }
        }),
        // @ts-ignore
        "undefined" !== typeof window.attachEvent
          ? // @ts-ignore
            window.attachEvent("onmessage", onMessage)
          : window.addEventListener("message", onMessage, !1),
        "undefined" !== typeof window.parent &&
          window.parent.postMessage(
            JSON.stringify({
              OpenApplicationEvent: { event: "openapp", hello: !0 },
            }),
            "*"
          ))
      : usePubSub &&
        (onMessage = function (a, b) {
          b.source = void 0;
          b.origin = void 0;
          b.sender = a;
          "function" === typeof doCallback &&
            // @ts-ignore
            !0 === doCallback(b, b.message) &&
            gadgets.pubsub.publish("openapp-recieve", !0);
        });
    gadgets.openapp.RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    gadgets.openapp.connect = function (a) {
      doCallback = a;
      usePubSub && gadgets.pubsub.subscribe("openapp", onMessage);
    };
    gadgets.openapp.disconnect = function () {
      usePubSub && gadgets.pubsub.unsubscribe("openapp");
      doCallback = null;
    };
    gadgets.openapp.publish = function (a, b) {
      a.event = a.event || "select";
      a.type = a.type || "namespaced-properties";
      a.sharing = a.sharing || "public";
      a.date = a.date || new Date();
      a.message = b || a.message;
      if (usePostMessage) {
        if (!1 === init.postParentOnly && null === ownData) {
          // @ts-ignore
          ownData = { sender: "unknown", viewer: "unknown" };
          if (
            "undefined" !== typeof window.location &&
            "string" === typeof window.location.search &&
            "function" === typeof window.unescape
          ) {
            var d = window.location.search.substring(1).split("&"),
              c,
              e = {};
            if (!(1 == d.length && "" === d[0])) {
              for (var f = 0; f < d.length; f++) {
                (c = d[f].split("=")),
                  2 == c.length && (e[c[0]] = window.unescape(c[1]));
              }
            }
            // @ts-ignore
            "string" === typeof e.url && (ownData.sender = e.url);
          }
          if (
            // @ts-ignore
            "undefined" !== typeof opensocial &&
            // @ts-ignore
            "function" === typeof opensocial.newDataRequest
          ) {
            // @ts-ignore
            d = opensocial.newDataRequest();
            // @ts-ignore
            d.add(
              // @ts-ignore
              d.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER),
              "viewer"
            );
            var g = this;
            // @ts-ignore
            d.send(function (c) {
              c = c.get("viewer").getData();
              "object" === typeof c &&
                null !== c &&
                "function" === typeof c.getId &&
                ((c = c.getId()),
                // @ts-ignore
                "string" === typeof c && (ownData.viewer = c));
              g.publish(a, b);
            });
            return;
          }
        }
        null !== ownData &&
          // @ts-ignore
          ("string" === typeof ownData.sender && (a.sender = ownData.sender),
          // @ts-ignore
          "string" === typeof ownData.viewer && (a.viewer = ownData.viewer));
        // @ts-ignore
        d = JSON.stringify({ OpenApplicationEvent: a });
        // @ts-ignore
        if ("undefined" !== window.parent) {
          if ((window.parent.postMessage(d, "*"), !init.postParentOnly)) {
            c = window.parent.frames;
            // @ts-ignore
            for (e = 0; e < c.length; e++) {
              // @ts-ignore
              c[e].postMessage(d, "*");
            }
          }
        } else {
          window.postMessage(d, "*");
        }
      } else {
        usePubSub && gadgets.pubsub.publish("openapp", a);
      }
    };
    openapp["io"] = {};
    openapp["io"].createXMLHttpRequest = function () {
      if ("undefined" !== typeof XMLHttpRequest) {
        return new XMLHttpRequest();
      }
      // @ts-ignore
      if ("undefined" !== typeof ActiveXObject) {
        // @ts-ignore
        return new ActiveXObject("Microsoft.XMLHTTP");
      }
      throw {
        name: "XMLHttpRequestError",
        message: "XMLHttpRequest not supported",
      };
    };
    openapp["io"].makeRequest = function (a, b, d) {
      gadgets.io.makeRequest(
        a,
        function (c) {
          var e, f, g, h, j, k, l, p;
          if (null === document.getElementById("oauthPersonalize")) {
            e = document.createElement("div");
            f = document.createElement("input");
            g = document.createElement("input");
            h = document.createElement("div");
            j = document.createElement("input");
            k = document.createElement("div");
            l = document.createElement("span");
            p = document.createElement("input");
            e.id = "oauthPersonalize";
            f.id = "oauthPersonalizeButton";
            g.id = "oauthPersonalizeDenyButton";
            h.id = "oauthPersonalizeDone";
            j.id = "oauthPersonalizeDoneButton";
            k.id = "oauthPersonalizeComplete";
            l.id = "oauthPersonalizeMessage";
            p.id = "oauthPersonalizeHideButton";
            f.id = "oauthPersonalizeButton";
            e.style.display = "none";
            h.style.display = "none";
            k.style.display = "none";
            f.type = "button";
            g.type = "button";
            j.type = "button";
            p.type = "button";
            f.value = "Continue";
            g.value = "Ignore";
            j.value = "Done";
            p.value = "Hide";
            e.appendChild(
              document.createTextNode(
                "In order to provide the full functionality of this tool, access to your personal data is being requested."
              )
            );
            h.appendChild(
              document.createTextNode(
                "If you have provided authorization and are still reading this, click the Done button."
              )
            );
            var m = document.getElementById("openappDialog");
            null == m &&
              ((m = document.createElement("div")),
              null != document.body.firstChild
                ? document.body.insertBefore(m, document.body.firstChild)
                : document.body.appendChild(m));
            m.appendChild(e);
            m.appendChild(h);
            m.appendChild(k);
            e.appendChild(f);
            e.appendChild(g);
            h.appendChild(j);
            k.appendChild(l);
            k.appendChild(p);
            g.onclick = function () {
              e.style.display = "none";
            };
            p.onclick = function () {
              k.style.display = "none";
            };
          }
          if (c.oauthApprovalUrl) {
            var r = function () {
                q && (window.clearInterval(q), (q = null));
                // @ts-ignore
                n && (n.close(), (n = null));
                // @ts-ignore
                document.getElementById("oauthPersonalizeDone").style.display =
                  "none";
                // @ts-ignore
                document.getElementById(
                  "oauthPersonalizeComplete"
                ).style.display = "block";
                openapp["io"].makeRequest(a, b, d);
                return !1;
              },
              s = function () {
                // @ts-ignore
                if (!n || n.closed) {
                  (n = null), r();
                }
              },
              t = c.oauthApprovalUrl,
              n = null,
              q = null;
            c = {
              createOpenerOnClick: function () {
                return function () {
                  // @ts-ignore
                  if ((n = window.open(t, "_blank", "width=450,height=500"))) {
                    // @ts-ignore
                    (q = window.setInterval(s, 100)),
                      // @ts-ignore
                      (document.getElementById(
                        "oauthPersonalize"
                      ).style.display = "none"),
                      // @ts-ignore
                      (document.getElementById(
                        "oauthPersonalizeDone"
                      ).style.display = "block");
                  }
                  return !1;
                };
              },
              createApprovedOnClick: function () {
                return r;
              },
            };
            // @ts-ignore
            document.getElementById("oauthPersonalizeButton").onclick =
              c.createOpenerOnClick();
            // @ts-ignore
            document.getElementById("oauthPersonalizeDoneButton").onclick =
              c.createApprovedOnClick();
            f = "Please wait.";
            document.all
              ? // @ts-ignore
                (document.getElementById("oauthPersonalizeMessage").innerText =
                  f)
              : // @ts-ignore
                (document.getElementById(
                  "oauthPersonalizeMessage"
                ).textContent = f);
            // @ts-ignore
            document.getElementById("oauthPersonalize").style.display = "block";
          } else {
            c.oauthError
              ? ((f =
                  "The authorization was not completed successfully. (" +
                  c.oauthError +
                  ")"),
                document.all
                  ? // @ts-ignore
                    (document.getElementById(
                      "oauthPersonalizeMessage"
                    ).innerText = f)
                  : // @ts-ignore
                    (document.getElementById(
                      "oauthPersonalizeMessage"
                    ).textContent = f),
                // @ts-ignore
                (document.getElementById(
                  "oauthPersonalizeComplete"
                ).style.display = "block"))
              : ((f =
                  "You have now granted authorization. To revoke authorization, go to your Privacy settings."),
                document.all
                  ? // @ts-ignore
                    (document.getElementById(
                      "oauthPersonalizeMessage"
                    ).innerText = f)
                  : // @ts-ignore
                    (document.getElementById(
                      "oauthPersonalizeMessage"
                    ).textContent = f),
                b(c));
          }
        },
        d
      );
    };
    openapp["ns"] = {};
    openapp["ns"].rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    openapp["ns"].rdfs = "http://www.w3.org/2000/01/rdf-schema#";
    openapp["ns"].dcterms = "http://purl.org/dc/terms/";
    openapp["ns"].foaf = "http://xmlns.com/foaf/0.1/";
    openapp["ns"].rest = "http://purl.org/openapp/";
    openapp["ns"].conserve = "http://purl.org/openapp/";
    openapp["ns"].openapp = "http://purl.org/openapp/";
    openapp["ns"].role = "http://purl.org/role/terms/";
    openapp["ns"].widget = "http://purl.org/role/widget/";
    openapp["resource"] = {};
    var linkexp =
        /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|\$)/g,
      paramexp =
        /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;
    function unquote(a) {
      return '"' === a.charAt(0) && '"' === a.charAt(a.length - 1)
        ? a.substring(1, a.length - 1)
        : a;
    }
    function parseLinkHeader(a) {
      var b = (a + ",").match(linkexp);
      a = {};
      var d = {},
        c = {},
        e,
        f,
        g,
        h,
        j,
        k;
      for (e = 0; e < b.length; e++) {
        f = b[e].split(">");
        g = f[0].substring(1);
        h = f[1];
        f = {};
        f.href = g;
        g = h.match(paramexp);
        for (h = 0; h < g.length; h++) {
          (j = g[h]), (j = j.split("=")), (k = j[0]), (f[k] = unquote(j[1]));
        }
        void 0 !== f.rel && "undefined" === typeof f.anchor && (a[f.rel] = f);
        void 0 !== f.title &&
          "undefined" === typeof f.anchor &&
          (d[f.title] = f);
        g = c[f.anchor || ""] || {};
        h = g[f.rel || "http://purl.org/dc/terms/relation"] || [];
        h.push({ type: "uri", value: f.href });
        g[f.rel || "http://purl.org/dc/terms/relation"] = h;
        c[f.anchor || ""] = g;
      }
      // @ts-ignore
      b = {};
      // @ts-ignore
      b.rels = a;
      // @ts-ignore
      b.titles = d;
      // @ts-ignore
      b.rdf = c;
      return b;
    }
    var isStringValue = function (a) {
      return "" !== a && "string" === typeof a;
    };
    openapp["resource"].makeRequest = function (a, b, d, c, e, f) {
      var g = openapp["io"].createXMLHttpRequest(),
        h,
        j = 0;
      if ("undefined" !== typeof c) {
        for (h in c) {
          c.hasOwnProperty(h) && j++;
        }
        if (0 < j) {
          // @ts-ignore
          j = "";
          -1 !== b?.indexOf("?") &&
            ((j = b?.substring(b.indexOf("?"))),
            // @ts-ignore
            (b = b?.substring(0, b.length - j.length)));
          switch (b?.substring(b.length - 1)) {
            case "/":
              b += ":";
              break;
            case ":":
              break;
            default:
              b += "/:";
          }
          for (h in c) {
            c.hasOwnProperty(h) &&
              (b =
                h === openapp["ns"].rdf + "predicate"
                  ? b + (";predicate=" + encodeURIComponent(c[h]))
                  : b +
                    (";" +
                      encodeURIComponent(h) +
                      "=" +
                      encodeURIComponent(c[h])));
          }
          b += j;
        }
      }
      g.open(a, b, !0);
      g.setRequestHeader("Accept", "application/json");
      e = e || "";
      if (0 < e.length || "POST" === a || "PUT" === a) {
        g.setRequestHeader(
          "Content-Type",
          "undefined" !== typeof f ? f : "application/json"
        );
      }
      d = d || function () {};
      g.onreadystatechange = function () {
        if (4 === g.readyState) {
          var a = {
            data: g.responseText,
            link: isStringValue(g.getResponseHeader("link"))
              ? parseLinkHeader(g.getResponseHeader("link"))
              : {},
          };
          isStringValue(g.getResponseHeader("location"))
            ? (a["uri"] = g.getResponseHeader("location"))
            : isStringValue(g.getResponseHeader("content-base"))
            ? (a["uri"] = g.getResponseHeader("content-base"))
            : a["link"].hasOwnProperty("http://purl.org/dc/terms/subject") &&
              (a["uri"] = a["link"]["http://purl.org/dc/terms/subject"].href);
          isStringValue(g.getResponseHeader("content-location")) &&
            (a["contentUri"] = g.getResponseHeader("content-location"));
          isStringValue(g.getResponseHeader("content-type")) &&
            "application/json" ===
              g.getResponseHeader("content-type").split(";")[0] &&
            (a.data = JSON.parse(a.data));
          a["subject"] =
            "undefined" !== typeof g.responseText
              ? a.data.hasOwnProperty("")
                ? a.data[""]
                : a.data[a["uri"]] || {}
              : {};
          d(a);
        }
      };
      g.send(e);
    };
    // @ts-ignore
    "undefined" === typeof openapp_forceXhr &&
      "undefined" !== typeof gadgets &&
      "undefined" !== typeof gadgets.io &&
      "undefined" !== typeof gadgets.io.makeRequest &&
      (openapp["resource"].makeRequest = function (a, b, d, c, e, f) {
        var g = {},
          h,
          j = 0;
        if ("undefined" !== typeof c) {
          for (h in c) {
            c.hasOwnProperty(h) && j++;
          }
          if (0 < j) {
            // @ts-ignore
            j = "";
            -1 !== b.indexOf("?") &&
              ((j = b.substring(b.indexOf("?"))),
              // @ts-ignore
              (b = b.substring(0, b.length - j.length)));
            switch (b.substring(b.length - 1)) {
              case "/":
                b += ":";
                break;
              case ":":
                break;
              default:
                b += "/:";
            }
            for (h in c) {
              c.hasOwnProperty(h) &&
                (b =
                  h === openapp["ns"].rdf + "predicate"
                    ? b + (";predicate=" + encodeURIComponent(c[h]))
                    : b +
                      (";" +
                        encodeURIComponent(h) +
                        "=" +
                        encodeURIComponent(c[h])));
            }
            b += j;
          }
        }
        g[gadgets.io.RequestParameters.GET_FULL_HEADERS] = !0;
        g[gadgets.io.RequestParameters.CONTENT_TYPE] =
          gadgets.io.ContentType.TEXT;
        g[gadgets.io.RequestParameters.AUTHORIZATION] =
          gadgets.io.AuthorizationType.OAUTH;
        g[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = "openapp";
        g[gadgets.io.RequestParameters.OAUTH_USE_TOKEN] = "always";
        g[gadgets.io.RequestParameters.METHOD] = a;
        g[gadgets.io.RequestParameters.HEADERS] =
          g[gadgets.io.RequestParameters.HEADERS] || {};
        "undefined" !== typeof e &&
          null !== e &&
          ((g[gadgets.io.RequestParameters.HEADERS]["Content-Type"] =
            "undefined" !== typeof f ? f : "application/json"),
          (g[gadgets.io.RequestParameters.POST_DATA] = e));
        g[gadgets.io.RequestParameters.HEADERS].Accept = "application/json";
        d = d || function () {};
        openapp["io"].makeRequest(
          b,
          function (a) {
            var b = {
              data: a.data,
              link:
                "undefined" !== typeof a.headers.link
                  ? parseLinkHeader(a.headers.link[0])
                  : {},
            };
            a.headers.hasOwnProperty("location")
              ? (b["uri"] = a.headers.location[0])
              : a.headers.hasOwnProperty("content-base")
              ? (b["uri"] = a.headers["content-base"][0])
              : // @ts-ignore
                b["link"].hasOwnProperty("http://purl.org/dc/terms/subject") &&
                // @ts-ignore
                (b["uri"] = b["link"]["http://purl.org/dc/terms/subject"].href);
            a.headers.hasOwnProperty("content-location") &&
                (b["contentUri"] = a.headers["content-location"][0]);
                a.headers.hasOwnProperty("content-type") &&
                  "application/json" ===
                    a.headers["content-type"][0].split(";")[0] &&
                  (b.data = gadgets.json.parse(b.data));
            b["subject"] =
              "undefined" !== typeof a.data
                ? b.data.hasOwnProperty("")
                  ? b.data[""]
                  : b.data[b["uri"]] || {}
                : {};
            d(b);
          },
          g
        );
      });
    openapp["resource"].get = function (a, b, d) {
      return openapp["resource"].makeRequest(
        "GET",
        a,
        b,
        d || {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate":
            openapp["ns"].conserve + "info",
        }
      );
    };
    openapp["resource"].post = function (a, b, d, c, e) {
      return openapp["resource"].makeRequest("POST", a, b, d, c, e);
    };
    openapp["resource"].put = function (a, b, d, c, e) {
      return openapp["resource"].makeRequest("PUT", a, b, d, c, e);
    };
    openapp["resource"].del = function (a, b, d) {
      return openapp["resource"].makeRequest("DELETE", a, b, d);
    };
    openapp["resource"].context = function (a) {
      return {
        sub: function (b) {
          var d = {};
          return {
            control: function (a, b) {
              d[a] = b;
              return this;
            },
            type: function (a) {
              return this.control(openapp["ns"].rdf + "type", a);
            },
            seeAlso: function (a) {
              return this.control(openapp["ns"].rdfs + "seeAlso", a);
            },
            list: function () {
              var c = [],
                e = a["subject"][b],
                f,
                g,
                h,
                j,
                k,
                l;
              if ("undefined" === typeof e) {
                return c;
              }
              h = 0;
              a: for (; h < e.length; h++) {
                f = e[h];
                g = a.data[f.value];
                for (j in d) {
                  if (d.hasOwnProperty(j)) {
                    if (!g.hasOwnProperty(j)) {
                      continue a;
                    }
                    l = !1;
                    for (k = 0; k < g[j].length; k++) {
                      if (g[j][k].value === d[j]) {
                        l = !0;
                        break;
                      }
                    }
                    if (!l) {
                      continue a;
                    }
                  }
                }
                // @ts-ignore
                c.push({ data: a.data, link: {}, uri: f.value, subject: g });
              }
              return c;
            },
            create: function (c) {
              if (!a["link"].rdf.hasOwnProperty(b)) {
                throw (
                  "The context does not support the requested relation: " + b
                );
              }
              var e = a["uri"];
              d[openapp["ns"].rdf + "predicate"] = b;
              openapp["resource"].post(
                e,
                function (a) {
                  c(a);
                },
                d
              );
            },
          };
        },
        metadata: function () {
          return openapp["resource"]
            .context(a)
            .content(openapp["ns"].rest + "metadata");
        },
        representation: function () {
          return openapp["resource"]
            .context(a)
            .content(openapp["ns"].rest + "representation");
        },
        content: function (b) {
          return {
            get: function (d) {
              openapp["resource"].get(
                a["uri"],
                function (a) {
                  d(a);
                },
                { "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate": b }
              );
            },
            mediaType: function (d) {
              var c = null;
              return {
                string: function (a) {
                  c = a;
                  return this;
                },
                json: function (a) {
                  c = JSON.stringify(a);
                  return this;
                },
                put: function (e) {
                  openapp["resource"].put(
                    a["uri"],
                    function (a) {
                      "function" === typeof e && e(a);
                    },
                    {
                      "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate": b,
                    },
                    c,
                    d
                  );
                },
              };
            },
            string: function (a) {
              return this.mediaType("text/plain").string(a);
            },
            json: function (a) {
              return this.mediaType("application/json").json(a);
            },
            graph: function () {
              var d = {},
                c = "";
              return {
                subject: function (a) {
                  c = a;
                  return this;
                },
                resource: function (a, b) {
                  d[c] = d[c] || {};
                  d[c][a] = d[c][a] || [];
                  d[c][a].push({ value: b, type: "uri" });
                  return this;
                },
                literal: function (a, b, g, h) {
                  d[c] = d[c] || {};
                  d[c][a] = d[c][a] || [];
                  d[c][a].push({
                    value: b,
                    type: "literal",
                    lang: g,
                    datatype: h,
                  });
                  return this;
                },
                put: function (c) {
                  openapp["resource"].put(
                    a["uri"],
                    function (a) {
                      "function" === typeof c && c(a);
                    },
                    {
                      "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate": b,
                    },
                    JSON.stringify(d)
                  );
                },
              };
            },
          };
        },
        properties: function () {
          var b = {},
            d;
          for (d in a["subject"]) {
            a["subject"].hasOwnProperty(d) && (b[d] = a["subject"][d][0].value);
          }
          return b;
        },
        string: function () {
          return "string" === typeof a.data
            ? a.data
            : gadgets.json.stringify(a.data);
        },
        json: function () {
          return "string" === typeof a.data ? null : a.data;
        },
        followSeeAlso: function () {
          var b = a["subject"][openapp["ns"].rdfs + "seeAlso"],
            d = 0,
            c,
            e;
          if ("undefined" !== typeof b) {
            b = b[0].value;
            for (
              e = 0;
              e < b.length &&
              e < a["uri"].length &&
              b.charAt(e) === a["uri"].charAt(e);
              e++
            ) {
              "/" === b.charAt(e) && d++;
            }
            for (c = d; e < b.length; e++) {
              "/" === b.charAt(e) && c++;
            }
            return 3 > d || 4 < c
              ? this
              : openapp["resource"].context({
                  data: a.data,
                  link: {},
                  uri: b,
                  subject: a.data[b],
                });
          }
          return this;
        },
      };
    };
    openapp["resource"].content = function (a) {
      return {
        properties: function () {
          return openapp["resource"].context(a).properties();
        },
        string: function () {
          return openapp["resource"].context(a).string();
        },
        json: function () {
          return openapp["resource"].context(a).json();
        },
      };
    };
    openapp["oo"] = {};
    openapp["oo"].Resource = function (a, b, d) {
      this.uri = a;
      this.context = b;
      this.info = d;
    };
    var OARP = openapp["oo"].Resource.prototype;
    OARP.getURI = function () {
      return this.uri;
    };
    OARP._call = function (a) {
      var b = this;
      null == this.context
        ? null == this._deferred
          ? ((this._deferred = [a]),
            openapp["resource"].get(this.uri, function (a) {
              b.context = a;
              a = b._deferred;
              delete b._deferred;
              for (var c = 0; c < a.length; c++) {
                a[c].call(b);
              }
            }))
          : this._deferred.push(a)
        : a.call(b);
    };
    OARP.refresh = function (a) {
      delete this.context;
      delete this.info;
      a &&
        this._call(function () {
          a();
        });
    };
    OARP.getSubResources = function (a) {
      this._call(function () {
        for (
          var b =
              null != a.type
                ? openapp["resource"]
                    .context(this.context)
                    .sub(a.relation)
                    .type(a.type)
                    .list()
                : openapp["resource"]
                    .context(this.context)
                    .sub(a.relation)
                    .list(),
            d = [],
            c = 0;
          c < b.length;
          c++
        ) {
          var e = b[c].uri;
          if (a.followReference) {
            var f =
              this.context.data[e]["http://www.w3.org/2002/07/owl#sameAs"];
            null != f && 0 < f.length && (e = f[0].value);
          }
          f = new openapp["oo"].Resource(e, null, b[c]);
          null == a.followReference &&
            ((f._referenceLoaded = !0),
            (e = this.context.data[e]["http://www.w3.org/2002/07/owl#sameAs"]),
            null != e && 0 < e.length && (f._reference = e[0].value));
          if (a.onEach) {
            a.onEach(f);
          }
          a.onAll && d.push(f);
        }
        if (a.onAll) {
          a.onAll(d);
        }
      });
    };
    OARP.followReference = function (a) {
      this._referenceLoaded
        ? a(
            null != this._reference
              ? new openapp["oo"].Resource(this._reference)
              : this
          )
        : this._call(function () {
            var b =
              this.context.data[this.uri][
                "http://www.w3.org/2002/07/owl#sameAs"
              ];
            null != b && 0 < b.length
              ? a(new openapp["oo"].Resource(b[0].value))
              : a(this);
          });
    };
    OARP.getReference = function (a) {
      this._referenceLoaded
        ? a(this._reference)
        : this._call(function () {
            var b = this.context.subject[openapp["ns"].rdfs + "seeAlso"];
            null != b && 0 < b.length
              ? a(this.context.subject[openapp["ns"].rdfs + "seeAlso"][0].value)
              : a();
          });
    };
    OARP.getMetadata = function (a, b) {
      this._call(function () {
        openapp["resource"]
          .context(this.context)
          .metadata()
          .get(function (d) {
            switch (a || "properties") {
              case "properties":
                b(openapp["resource"].context(d).properties());
                break;
              case "graph":
                b(openapp["resource"].content(d).graph());
                break;
              case "rdfjson":
                b(openapp["resource"].content(d).json());
            }
          });
      });
    };
    OARP.getInfo = function (a) {
      if (a) {
        this.context || this.info
          ? a(
              openapp["resource"]
                .context(this.context || this.info)
                .properties()
            )
          : this._call(function () {
              a(
                openapp["resource"]
                  .context(this.context || this.info)
                  .properties()
              );
            });
      } else {
        if (this.context || this.info) {
          return openapp["resource"]
            .context(this.context || this.info)
            .properties();
        }
      }
    };
    OARP.getRepresentation = function (a, b) {
      this._call(function () {
        openapp["resource"]
          .context(this.context)
          .representation()
          .get(function (d) {
            switch (a || "text/html") {
              case "properties":
                b(openapp["resource"].context(d).properties());
                break;
              case "graph":
                b(openapp["resource"].content(d).graph());
                break;
              case "rdfjson":
                b(openapp["resource"].content(d).json());
                break;
              case "text/html":
                b(openapp["resource"].content(d).string());
            }
          });
      });
    };
    OARP.setMetadata = function (a, b, d) {
      var c = {};
      switch (b || "properties") {
        case "properties":
          b = {};
          for (var e in a) {
            b[e] = [{ type: "literal", value: a[e] }];
          }
          c[this.context.uri] = b;
          break;
        case "rdfjson":
          c = a;
          break;
        case "graph":
          // @ts-ignore
          graph.put(d);
          return;
      }
      openapp["resource"].put(
        this.context.uri,
        d,
        {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate":
            openapp["ns"].rest + "metadata",
        },
        JSON.stringify(c)
      );
    };
    OARP.setRepresentation = function (a, b, d) {
      this._call(function () {
        var c = openapp["resource"]
          .context(this.context)
          .representation()
          .mediaType(b);
        "string" === typeof a ? c.string(a).put(d) : c.json(a).put(d);
      });
    };
    OARP.create = function (a) {
      this._call(function () {
        var b = openapp["resource"]
          .context(this.context)
          .sub(a.relation || openapp["ns"].role + "data");
        null != a.referenceTo && (b = b.seeAlso(a.referenceTo));
        null != a.type && (b = b.type(a.type));
        b.create(function (b) {
          var c = new openapp["oo"].Resource(b["uri"], b);
          a.metadata
            ? c.setMetadata(a.metadata, a.format, function () {
                a.representation
                  ? c.setRepresentation(
                      a.representation,
                      a.medieType || "application/json",
                      function () {
                        a.callback(c);
                      }
                    )
                  : a.callback(c);
              })
            : a.representation
            ? c.setRepresentation(
                a.representation,
                a.medieType || "application/json",
                function () {
                  a.callback(c);
                }
              )
            : a.callback(c);
        });
      });
    };
    OARP.del = function (a) {
      openapp["resource"].del(this.uri, a);
    };
    openapp["param"] = {};
    var parseQueryParams = function (a) {
        var b,
          d,
          c = {};
        if (0 > a.indexOf("?")) {
          return {};
        }
        a = a.substr(a.indexOf("?") + 1).split("&");
        if (!(1 == a.length && "" === a[0])) {
          for (d = 0; d < a.length; d++) {
            (b = a[d].split("=")),
              2 == b.length && (c[b[0]] = window.unescape(b[1]));
          }
        }
        return c;
      },
      parseOpenAppParams = function (a) {
        var b = {},
          d = {},
          c,
          e;
        for (c in a) {
          a.hasOwnProperty(c) &&
            "openapp['ns']." === c.substring(0, 11) &&
            (b[c.substr(11)] = a[c]);
        }
        for (c in a) {
          a.hasOwnProperty(c) &&
            ((e = c.split(".")),
            3 === e.length &&
              "openapp" === e[0] &&
              b.hasOwnProperty(e[1]) &&
              (d[b[e[1]] + e[2]] = a[c]));
        }
        return d;
      },
      _openAppParams = parseOpenAppParams(
        parseQueryParams(parseQueryParams(window.location.href)["url"] || "")
      );
    openapp["param"].get = function (a) {
      return _openAppParams[a];
    };
    openapp["param"].space = function () {
      return openapp["param"].get("http://purl.org/role/terms/space");
    };
    openapp["param"].user = function () {
      return openapp["param"].get("http://purl.org/role/terms/user");
    };
  }
}

const openapp = new OpenAppProvider().openapp;
/**
 * Util
 * @class Util
 * @name Util
 * @constructor
 */
var Util = {
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

async function yjsSync(
  spaceTitle,
  yjsServer = "localhost:1234",
  yjsProtocol = "ws"
) {
  let title;

  if (!spaceTitle) {
    if (window.caeRoom) {
      title = window.caeRoom;
    } else if (localStorage.getItem("syncmetaSpace")) {
      title = localStorage.getItem("syncmetaSpace");
    } else {
      title = Util.getSpaceTitle(location.href);
    }
  }

  if (window.y && title === spaceTitle) {
    // yjs is already initialized and we are using the same spaceTitle
    return new Promise((resolve) => resolve(window.y));
  }

  const doc = new Doc();

  // Sync clients with the y-websocket provider
  const websocketProvider = new WebsocketProvider(
    `${yjsProtocol}://${yjsServer}`,
    title,
    doc
  );

  await new Promise((resolve, reject) => {
    websocketProvider.on("status", (event) => {
      // console.log(event.status); // logs "connected" or "disconnected"

      if (event.status == "connected") {
        if (!window.y) {
          window.y = doc;
        }
        resolve(title);
      }
    });
    setTimeout(() => {
      reject("YJS connection timed out. This means syncmeta widgets wont work");
    }, 5000);
  });
  if (window.y) {
    // it could be that another yjsSync call was made before this one resolved
    return window.y;
  }
  return doc;
}

const SyncMetaWidget = (superClass, widgetName) => {
    if (!widgetName) {
        throw new Error("widgetName cannot be empty");
    }
    class SyncMetaWidgetElement extends superClass {
        constructor() {
            super(...arguments);
            this.widgetName = widgetName;
        }
        createRenderRoot() {
            return this;
        }
        render() {
            return html ` <error-alert></error-alert> `;
        }
        firstUpdated() {
            this.hideErrorAlert();
        }
        connectedCallback() {
            super.connectedCallback();
            init();
            if (!window.hasOwnProperty("y")) {
                yjsSync().then((y) => {
                    if (!window.hasOwnProperty("y"))
                        window.y = y;
                });
            }
        }
        disconnectedCallback() {
            super.disconnectedCallback();
        }
        hideErrorAlert() {
            $(this.widgetName).find("#alert-message").text("");
            $(this.widgetName).find("error-alert").hide();
        }
        showErrorAlert(message) {
            $(this.widgetName).find("#alert-message").text(message);
            $(this.widgetName).find("error-alert").hide();
        }
    }
    SyncMetaWidgetElement.styles = css `
      .loading {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        /*noinspection CssUnknownTarget*/
        background: white url("/img/loading.gif") no-repeat center center;
        z-index: 32032;
        opacity: 0.75;
      }

      #oauthPersonalize,
      #oauthPersonalizeDone,
      #oauthPersonalizeComplete {
        position: relative;
        z-index: 32033;
      }

      #q {
        position: absolute;
        width: 100%;
        height: 3px;
        bottom: 0;
        left: 0;
        cursor: s-resize;
      }
    `;
    return SyncMetaWidgetElement;
};

let IMSLDExportWidget = class IMSLDExportWidget extends SyncMetaWidget(LitElement, getWidgetTagName(CONFIG.WIDGET.NAME.IMSLD_EXPORT)) {
    render() {
        return html `
      <div class="seperating_box">
        <h5>Download IMSLD</h5>
        <button id="imsld">Download ZIP</button>
      </div>
      <div style="font-size:3pt">&nbsp;</div>
      <div class="seperating_box">
        <h5>Integrated Learning Design Environment (ILDE)</h5>
        <form id="ilde_login_form" class="hide">
          <div>
            Please provide your ILDE credentials to use this feature. There are
            different installations of ILDE. Please provide the URL of
            installation that you want to use.
          </div>
          <table>
            <tr>
              <td>Installation:</td>
              <td>
                <input
                  id="ildeResource"
                  name="resource"
                  type="text"
                  size="29"
                  value="http://ilde.upf.edu/"
                />
              </td>
            </tr>
            <tr>
              <td>Username:</td>
              <td><input name="username" type="text" size="29" /></td>
            </tr>
            <tr>
              <td>Password:</td>
              <td><input name="password" type="password" size="29" /></td>
            </tr>
          </table>
          <input type="submit" value="Login" />
          <span class="error_notification hide" style="color:red"> </span>
        </form>
        <div id="ilde_upload_form">
          <div id="createIldeDiv" class="">
            <div>
              This learning design can be synchronized with ILDE. If you want to
              synchronize it with an existing ILDE design, please provide the
              URL below. Otherwise just click 'Start ILDE Sync!'
            </div>
            <br />
            <div>
              URL of existing design (optional):
              <input id="existingIldeUrl" type="text" value="" size="40" />
            </div>
            <br />
            <input
              id="createIldeButton"
              type="submit"
              value="Start ILDE Sync!"
            />
          </div>
          <div id="syncIldeDiv" class="hide">
            <div>
              This design is now available also on ILDE:
              <a id="ildeLink" href="" target="_blank"></a>
            </div>
            <br />
            <div>Click to push your changes:</div>
            <input id="syncIldeButton" type="submit" value="Push to ILDE" />
            <input
              id="removeIldeButton"
              type="submit"
              value="Unlink from ILDE"
            />
            <span id="success_notification" class="hide" style="color:green">
              Success!
            </span>
          </div>
          <span class="error_notification hide" style="color:red"> </span>
        </div>
      </div>
    `;
    }
    connectedCallback() {
        super.connectedCallback();
        init();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
};
IMSLDExportWidget.styles = css `
    .loading_button {
      background-image: url('<%= grunt.config("baseUrl") %>/img/loading_small.gif');
      background-repeat: no-repeat;
      background-position: right center;
      padding-right: 20px;
    }
    .hide {
      display: none;
    }

    #ilde_login_form * {
      font-size: 12px;
    }
    #ilde_upload_form * {
      font-size: 12px;
    }
    .seperating_box {
      border: 1px solid;
      border-radius: 7px;
      margin: 18px 20px 7px 7px;
      padding: 7px 20px 7px 7px;
      position: relative;
    }
    .seperating_box > h5 {
      font-weight: normal;
      font-style: italic;
      position: absolute;
      top: -40px;
      left: 4px;
    }
  `;
IMSLDExportWidget = __decorate([
    e(getWidgetTagName(CONFIG.WIDGET.NAME.IMSLD_EXPORT))
], IMSLDExportWidget);

export { IMSLDExportWidget };
//# sourceMappingURL=imsld.export.widget.js.map
