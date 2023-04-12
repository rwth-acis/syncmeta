import { css, html, LitElement } from 'lit';
import 'https://unpkg.com/jquery@3.6.0/dist/jquery.js';
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js';

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

/**
 * Namespace for operations
 * @namespace operations
 */

/**
 * Operation
 * @class operations.Operation
 * @memberof operations
 * @constructor
 */
class Operation {
  constructor() {}
}

/**
 * Namespace for ot operations
 * @namespace operations.ot
 */

    /**
     * OTOperation
     * @class operations.ot.OTOperation
     * @memberof operations.ot
     * @constructor
     * @param {string} name Name of operation
     * @param {string} value Value of operation
     * @param {string} type Type of operation
     * @param {number} position Position of operation
     */
    class OTOperation extends Operation {
    constructor(name, value, type, position) {
        super();
        /**
         * JabberId of the user who issued this activity
         * @type {string}
         * @private
         */
        var _sender = null;


        /**
         * Operation details
         * @type {{name: string, value: string, type: string, position: number}}
         * @private
         */
        var _operation = {
            name: name,
            value: value,
            type: type,
            position: position
        };

        /**
         * Set JabberId of the user who issued this activity
         * @param sender
         */
        this.setSender = function (sender) {
            _sender = sender;
        };

        /**
         * Get JabberId of the user who issued this activity
         */
        this.getSender = function () {
            return _sender;
        };

        /**
         * Get name of operation
         * @returns {string}
         */
        this.getName = function () {
            return _operation.name;
        };

        /**
         * Get value of operation
         * @returns {string}
         */
        this.getValue = function () {
            return _operation.value;
        };

        /**
         * Get type of operation
         * @returns {string}
         */
        this.getType = function () {
            return _operation.type;
        };

        /**
         * Get position of operation
         * @returns {number}
         */
        this.getPosition = function () {
            return _operation.position;
        };

        /**
         * Get JSON Representation of operation
         * @returns {{type: string, data: string}}
         */
        this.getOperationObject = function () {
            return _operation;
        };
    }
}

/**
 * Namespace for non ot operations
 * @namespace operations.non_ot
 */

    NonOTOperation.prototype = new Operation();
    NonOTOperation.prototype.constructor = NonOTOperation;
    /**
     * NonOTOperation
     * @class operations.non_ot.NonOTOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} type Type of Operation
     * @param {string} data Additional data for operation
     */
    function NonOTOperation(type,data){
        /**
         * JabberId of the user who issued this activity
         * @type {string}
         * @private
         */
        var _sender = null;

        /**
         * Operation details
         * @type {{type: string, data: string}}
         * @private
         */
        var _operation = {
            type: type,
            data: data
        };

        /**
         * Set JabberId of the user who issued this activity
         * @param sender
         */
        this.setSender = function(sender){
            _sender = sender;
        };

        /**
         * Get JabberId of the user who issued this activity
         * @returns {string}
         */
        this.getSender = function(){
            return _sender;
        };

        /**
         * Get type of Operation
         * @returns {string}
         */
        this.getType = function(){
            //noinspection JSAccessibilityCheck
            return _operation.type;
        };

        /**
         * Get additional data for operation
         * @returns {string}
         */
        this.getData = function(){
            return _operation.data;
        };

        /**
         * Get JSON Representation of operation
         * @returns {{type: string, data: string}}
         */
        this.getOperationObject = function(){
            return _operation;
        };
    }

/**
 * EntityOperation
 * @class operations.ot.EntityOperation
 * @memberof operations.ot
 * @param {string} operationType Type of operation
 * @param {string} entityId Entity id of the entity this activity works on
 * @param {string} entityType Type of the entity this activity works on
 * @constructor
 */
class EntityOperation {
  static TYPES = {
    AttributeAddOperation: "AttributeAddOperation",
    AttributeDeleteOperation: "AttributeDeleteOperation",
    EdgeAddOperation: "EdgeAddOperation",
    EdgeDeleteOperation: "EdgeDeleteOperation",
    NodeAddOperation: "NodeAddOperation",
    NodeDeleteOperation: "NodeDeleteOperation",
    NodeMoveOperation: "NodeMoveOperation",
    NodeMoveZOperation: "NodeMoveZOperation",
    NodeResizeOperation: "NodeResizeOperation",
    ValueChangeOperation: "ValueChangeOperation",
  };
  getOperationType;
  setOTOperation;
  _getOTOperation;
  getEntityId;
  getEntityType;
  adjust;
  inverse;
  toJSON;

  triggeredBy;
  constructor(operationType, entityId, entityType) {
    this.triggeredBy = window.y.clientID;

    /**
     * Type of operation
     * @type {string}
     * @private
     */
    var _operationType = operationType;

    /**
     * Corresponding OtOperation
     * @type {operations.ot.OTOperation}
     * @private
     */
    var _otOperation = null;

    /**
     * Entity id of the entity this activity works on
     * @type {string}
     * @private
     */
    var _entityId = entityId;

    /**
     * Type of the entity this activity works on
     * @type {string}
     * @private
     */
    var _entityType = entityType;

    /**
     * Get type of operation
     * @returns {string}
     */
    this.getOperationType = function () {
      return _operationType;
    };

    /**
     * Set corresponding ot operation
     * @param {operations.ot.OTOperation} otOperation
     */
    this.setOTOperation = function (otOperation) {
      _otOperation = otOperation;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this._getOTOperation = function () {
      return _otOperation;
    };

    /**
     * Get entity id of the entity this activity works onf
     * @returns {string}
     */
    this.getEntityId = function () {
      return _entityId;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get type of the entity this activity works on
     * @returns {string}
     */
    this.getEntityType = function () {
      return _entityType;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {operations.ot.EntityOperation}
     */
    this.inverse = function () {
      return this;
    };
  }
  //noinspection JSAccessibilityCheck
  /**
   * Get corresponding ot operation
   * @returns {operations.ot.OTOperation}
   */
  getOTOperation() {
    return this._getOTOperation();
  }
}

/**
 * NodeDeleteOperation
 * @class operations.ot.NodeDeleteOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {String} type Type of node to delete
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 * @param {boolean} containment containment
 * @param {object} json JSON representation of node
 * @constructor
 */
class NodeDeleteOperation extends EntityOperation {
  static TYPE = "NodeDeleteOperation";
  getType;
  getLeft;
  getTop;
  getWidth;
  getHeight;
  getZIndex;
  getContainment;
  getJSON;
  constructor(
    entityId,
    type,
    left,
    top,
    width,
    height,
    zIndex,
    containment,
    json
  ) {
    super(
      EntityOperation.TYPES.NodeDeleteOperation,
      entityId,
      CONFIG.ENTITY.NODE
    );
    var that = this;

    /**
     * Type of node to add
     * @type {String}
     * @private
     */
    var _type = type;

    /**
     * x-coordinate of node position
     * @type {number}
     * @private
     */
    var _left = left;

    /**
     * y-coordinate of node position
     * @type {number}
     * @private
     */
    var _top = top;

    /**
     * Width of node
     * @type {number}
     * @private
     */
    var _width = width;

    /**
     * Height of node
     * @type {number}
     * @private
     */
    var _height = height;

    /**
     * Position of node on z-axis
     * @type {number}
     * @private
     */
    var _zIndex = zIndex;

    /**
     * is containment type
     * @type {boolean}
     * @private
     */
    var _containment = containment;

    /**
     * JSON representation of node
     * @type {Object}
     * @private
     */
    var _json = json;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.NODE + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          left: _left,
          top: _top,
          width: _width,
          height: _height,
          zIndex: _zIndex,
          containment: _containment,
          json: _json,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.NODE.DEL
      );
    };

    /**
     * Get type of node to add
     * @returns {String}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get x-coordinate of node position
     * @returns {number}
     */
    this.getLeft = function () {
      return _left;
    };

    /**
     * Get y-coordinate of node position
     * @returns {number}
     */
    this.getTop = function () {
      return _top;
    };

    /**
     * Get width of node
     * @returns {number}
     */
    this.getWidth = function () {
      return _width;
    };

    /**
     * Get height of node
     * @returns {number}
     */
    this.getHeight = function () {
      return _height;
    };

    /**
     * Get position of node on z-axis
     * @returns {number}
     */
    this.getZIndex = function () {
      return _zIndex;
    };

    /**
     * is containment type
     * @returns {boolean}
     */
    this.getContainment = function () {
      return _containment;
    };

    /**
     * Get JSON representation of node
     * @return {Object}
     */
    this.getJSON = function () {
      return _json;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        this.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      var edge;
      switch (operation.getOperationType()) {
        case EntityOperation.TYPES.AttributeAddOperation:
        case EntityOperation.TYPES.AttributeDeleteOperation:
          edge = EntityManager.findEdge(operation.getRootSubjectEntityId());
          if (
            edge &&
            (edge.getSource().getEntityId() === this.getEntityId() ||
              edge.getTarget().getEntityId() === this.getEntityId())
          ) {
            return null;
          }
          if (this.getEntityId() === operation.getRootSubjectEntityId()) {
            return null;
          }
          break;
        case EntityOperation.TYPES.EdgeAddOperation:
        case EntityOperation.TYPES.EdgeDeleteOperation:
          edge = EntityManager.findEdge(operation.getEntityId());
          if (
            edge &&
            (edge.getSource().getEntityId() === this.getEntityId() ||
              edge.getTarget().getEntityId() === this.getEntityId())
          ) {
            return null;
          }
          break;
        case EntityOperation.TYPES.NodeAddOperation:
        case EntityOperation.TYPES.NodeDeleteOperation:
        case EntityOperation.TYPES.NodeMoveOperation:
        case EntityOperation.TYPES.NodeResizeOperation:
          if (this.getEntityId() === operation.getEntityId()) {
            return null;
          }
          break;
        case EntityOperation.TYPES.ValueChangeOperation:
          edge = EntityManager.findEdge(operation.getRootSubjectEntityId());
          if (
            edge &&
            (edge.getSource().getEntityId() === this.getEntityId() ||
              edge.getTarget().getEntityId() === this.getEntityId())
          ) {
            return null;
          }
          if (operation.getRootSubjectEntityId() === this.getEntityId()) {
            return null;
          }
          break;
      }

      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {operations.ot.NodeAddOperation}
     */
    this.inverse = function () {
      return new NodeAddOperation(
        this.getEntityId(),
        this.getType(),
        this.getLeft(),
        this.getTop(),
        this.getWidth(),
        this.getHeight(),
        this.getZIndex(),
        this.getContainment(),
        this.getContainment(),
        json
      );
    };
  }
  static getOperationDescription(nodeType, nodeLabel, viewId) {
    if (!nodeLabel && !viewId) {
      return "..deleted " + nodeType;
    } else if (!viewId) {
      return "..deleted " + nodeType + " " + nodeLabel;
    } else
      return "..deleted " + nodeType + " " + nodeLabel + " in View " + viewId;
  }
  toJSON = function () {
    return {
      id: this.getEntityId(),
      type: this.getType(),
      left: this.getLeft(),
      top: this.getTop(),
      width: this.getWidth(),
      height: this.getHeight(),
      zIndex: this.getZIndex(),
      containment: this.getContainment(),
      json: this.getJSON(),
    };
  };
}

class NodeAddOperation extends EntityOperation {
  static TYPE = "NodeAddOperation";
  getType;
  getOriginType;
  getLeft;
  getTop;
  getWidth;
  getHeight;
  getZIndex;
  getContainment;
  getJSON;
  getViewId;
  getJabberId;
  getDefaultLabel;
  getDefaultAttributeValues;
  toJSON;

  constructor(
    entityId,
    type,
    left,
    top,
    width,
    height,
    zIndex,
    containment,
    json = null,
    viewId = null,
    oType = null,
    jabberId = null,
    defaultLabel = null,
    defaultAttributeValues = null
  ) {
    super(EntityOperation.TYPES.NodeAddOperation, entityId, CONFIG.ENTITY.NODE);
    var that = this;

    /**
     * the identifier of the view
     * @type {string}
     * @private
     */
    var _viewId = viewId;

    /**
     * the jabberId of the user
     * @type {string}
     * @private
     */
    var _jabberId = jabberId;

    var _oType = oType;

    /**
     * Type of node to add
     * @type {String}
     * @private
     */
    var _type = type;

    /**
     * x-coordinate of node position
     * @type {number}
     * @private
     */
    var _left = left;

    /**
     * y-coordinate of node position
     * @type {number}
     * @private
     */
    var _top = top;

    /**
     * Width of node
     * @type {number}
     * @private
     */
    var _width = width;

    /**
     * Height of node
     * @type {number}
     * @private
     */
    var _height = height;

    /**
     * Position of node on z-axis
     * @type {number}
     * @private
     */
    var _zIndex = zIndex;

    /**
     * is containment type
     * @type {boolean}
     * @private
     */
    var _containment = containment;

    /**
     * JSON representation of node
     * @type {Object}
     * @private
     */
    var _json = json;

    /**
     * Default label of node
     * @type {String}
     * @private
     */
    var _defaultLabel = defaultLabel;

    /**
     * May be used to set default values for node attributes.
     */
    var _defaultAttributeValues = defaultAttributeValues;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.NODE + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          left: _left,
          top: _top,
          width: _width,
          height: _height,
          zIndex: _zIndex,
          containment: _containment,
          json: _json,
          viewId: _viewId,
          oType: _oType,
          jabberId: _jabberId,
        }),
        CONFIG.OPERATION.TYPE.INSERT,
        CONFIG.IWC.POSITION.NODE.ADD
      );
    };

    /**
     * Get type of node to add
     * @returns {String}
     */
    this.getType = function () {
      return _type;
    };

    this.getOriginType = function () {
      return _oType;
    };

    /**
     * Get x-coordinate of node position
     * @returns {number}
     */
    this.getLeft = function () {
      return _left;
    };

    /**
     * Get y-coordinate of node position
     * @returns {number}
     */
    this.getTop = function () {
      return _top;
    };

    /**
     * Get width of node
     * @returns {number}
     */
    this.getWidth = function () {
      return _width;
    };

    /**
     * Get height of node
     * @returns {number}
     */
    this.getHeight = function () {
      return _height;
    };

    /**
     * Get position of node on z-axis
     * @returns {number}
     */
    this.getZIndex = function () {
      return _zIndex;
    };

    /**
     * Get containment
     * @returns {boolean}
     */
    this.getContainment = function () {
      return _containment;
    };

    /**
     * Get JSON representation of node
     * @return {Object}
     */
    this.getJSON = function () {
      return _json;
    };

    /**
     * the identifier of the view
     * @returns {string}
     */
    this.getViewId = function () {
      return _viewId;
    };

    /**
     * Get the jabberid
     * @returns {string}
     */
    this.getJabberId = function () {
      return _jabberId;
    };

    /**
     * Get default label of node
     * @returns {string}
     */
    this.getDefaultLabel = function () {
      return _defaultLabel;
    };

    /**
     * Get default values for node attributes.
     * @returns {*}
     */
    this.getDefaultAttributeValues = function () {
      return _defaultAttributeValues;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        this.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {NodeDeleteOperation}
     */
    this.inverse = function () {
      return new NodeDeleteOperation(
        this.getEntityId(),
        this.getType(),
        this.getLeft(),
        this.getTop(),
        this.getWidth(),
        this.getHeight(),
        this.getZIndex(),
        this.getContainment(),
        json
      );
    };

    this.toJSON = function () {
      return {
        id: this.getEntityId(),
        type: this.getType(),
        left: this.getLeft(),
        top: this.getTop(),
        width: this.getWidth(),
        height: this.getHeight(),
        zIndex: this.getZIndex(),
        containment: this.getContainment(),
        json: this.getJSON(),
        viewId: this.getViewId(),
        oType: this.getOriginType(),
        jabberId: this.getJabberId(),
        defaultLabel: this.getDefaultLabel(),
        defaultAttributeValues: this.getDefaultAttributeValues(),
        triggeredBy: this.triggeredBy,
      };
    };
  }
  static getOperationDescription(nodeType, nodeLabel, viewId) {
    if (!nodeLabel && !viewId) {
      return "..created a new " + nodeType;
    } else if (!viewId) {
      return "..created " + nodeType + " " + nodeLabel;
    } else
      return ".. created " + nodeType + " " + nodeLabel + " in View " + viewId;
  }
}

/**
 * EdgeDeleteOperation
 * @class operations.ot.EdgeDeleteOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param entityId Entity id of the entity this activity works on
 * @param {String} type Type of edge to delete
 * @param {String} source Entity id of source node
 * @param {String} target Entity id of target node
 * @param {object} json JSON representation of edge
 * @constructor
 */
class EdgeDeleteOperation extends EntityOperation {
  static TYPE = "EdgeDeleteOperation";
  getType;
  getSource;
  getTarget;
  getJSON;
  constructor(entityId, type, source, target, json = null) {
    super(
      EntityOperation.TYPES.EdgeDeleteOperation,
      entityId,
      CONFIG.ENTITY.EDGE
    );
    var that = this;

    /**
     * Type of edge to delte
     * @type {String}
     * @private
     */
    var _type = type;

    /**
     * Entity id of source node
     * @type {String}
     * @private
     */
    var _source = source;

    /**
     * Entity id of target node
     * @type {String}
     * @private
     */
    var _target = target;

    /**
     * JSON representation of node
     * @type {Object}
     * @private
     */
    var _json = json;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.EDGE + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          source: _source,
          target: _target,
          json: _json,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.EDGE.DEL
      );
    };

    /**
     * Get type of edge to delete
     * @returns {String}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get entity id of source node
     * @returns {String}
     */
    this.getSource = function () {
      return _source;
    };

    /**
     * Get entity id of target node
     * @returns {String}
     */
    this.getTarget = function () {
      return _target;
    };

    /**
     * Get JSON representation of edge
     * @return {Object}
     */
    this.getJSON = function () {
      return _json;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        this.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      switch (operation.getOperationType()) {
        case EntityOperation.TYPES.AttributeAddOperation:
        case EntityOperation.TYPES.AttributeDeleteOperation:
          if (this.getEntityId() === operation.getRootSubjectEntityId()) {
            return null;
          }
          break;
        case EntityOperation.TYPES.EdgeAddOperation:
        case EntityOperation.TYPES.EdgeDeleteOperation:
          if (this.getEntityId() === operation.getEntityId()) {
            return null;
          }
          break;
        case EntityOperation.TYPES.ValueChangeOperation:
          if (this.getEntityId() === operation.getRootSubjectEntityId()) {
            return null;
          }
          break;
      }

      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {EdgeAddOperation}
     */
    this.inverse = function () {
      return new EdgeAddOperation(
        this.getEntityId(),
        this.getType(),
        this.getSource(),
        this.getTarget()
      );
    };
  }
  static getOperationDescription(edgeType, edgeLabel, viewId) {
    if (!edgeLabel && !viewId) {
      return "..deleted " + edgeType;
    } else if (!viewId) {
      return "..deleted " + edgeType + " " + edgeLabel;
    } else {
      return "..deleted " + edgeType + " " + edgeLabel + "in View " + viewId;
    }
  }
  toJSON = function () {
    return {
      id: this.getEntityId(),
      type: this.getType(),
      source: this.getSource(),
      target: this.getTarget(),
      json: this.getJSON(),
    };
  };
}

/**
 * EdgeAddOperation
 * @class operations.ot.EdgeAddOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {String} type Type of edge to add
 * @param {String} source Entity id of source node
 * @param {String} target Entity id of target node
 * @param {object} json JSON representation of edge
 * @param {string} viewId the identifier of the view
 * @param {string} oType oType the original Type, only set in views
 * @param {string} jabberId the jabberId of the user
 * @constructor
 */
class EdgeAddOperation extends EntityOperation {
  static TYPE = "EdgeAddOperation";
  getOriginType;
  getType;
  getSource;
  getTarget;
  getViewId;
  getJabberId;
  getJSON;
  constructor(
    entityId,
    type,
    source,
    target,
    json = null,
    viewId = null,
    oType = null,
    jabberId = null
  ) {
    super(EntityOperation.TYPES.EdgeAddOperation, entityId, CONFIG.ENTITY.EDGE);
    var that = this;

    var _oType = oType;

    var _jabberId = jabberId;

    this.getOriginType = function () {
      return _oType;
    };

    /**
     * the identifier of the view
     * @type {string}
     * @private
     */
    var _viewId = viewId;

    /**
     * Type of edge to add
     * @type {String}
     * @private
     */
    var _type = type;

    /**
     * Entity id of source node
     * @type {String}
     * @private
     */
    var _source = source;

    /**
     * Entity id of target node
     * @type {String}
     * @private
     */
    var _target = target;

    /**
     * JSON representation of edge
     * @type {Object}
     * @private
     */
    var _json = json;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.EDGE + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          source: _source,
          target: _target,
          json: _json,
          viewId: _viewId,
          oType: _oType,
          jabberId: _jabberId,
        }),
        CONFIG.OPERATION.TYPE.INSERT,
        CONFIG.IWC.POSITION.EDGE.ADD
      );
    };

    /**
     * Get type of edge to add
     * @returns {String}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get entity id of source node
     * @returns {String}
     */
    this.getSource = function () {
      return _source;
    };

    /**
     * Get entity id of target node
     * @returns {String}
     */
    this.getTarget = function () {
      return _target;
    };

    /**
     * get the identifier of the view
     * @returns {string}
     */
    this.getViewId = function () {
      return _viewId;
    };

    /**
     * Get the jabber id
     * @returns {string}
     */
    this.getJabberId = function () {
      return _jabberId;
    };

    /**
     * Get JSON representation of edge
     * @return {Object}
     */
    this.getJSON = function () {
      return _json;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        this.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {EdgeDeleteOperation}
     */
    this.inverse = function () {
      return new EdgeDeleteOperation(
        this.getEntityId(),
        this.getType(),
        this.getSource(),
        this.getTarget()
      );
    };
  }
  static getOperationDescription(
    edgeType,
    edgeLabel,
    sourceNodeType,
    sourceNodeLabel,
    targetNodeType,
    targetNodeLabel,
    viewId
  ) {
    if (!edgeLabel && !viewId) {
      return (
        "..created a new " +
        edgeType +
        " between " +
        sourceNodeType +
        " " +
        sourceNodeLabel +
        " and " +
        targetNodeType +
        " " +
        targetNodeLabel
      );
    } else if (!viewId) {
      return (
        "..created " +
        edgeType +
        " " +
        edgeLabel +
        " between " +
        sourceNodeType +
        " " +
        sourceNodeLabel +
        " and " +
        targetNodeType +
        " " +
        targetNodeLabel
      );
    } else {
      return (
        "..created " +
        edgeType +
        " " +
        edgeLabel +
        " between " +
        sourceNodeType +
        " " +
        sourceNodeLabel +
        " and " +
        targetNodeType +
        " " +
        targetNodeLabel +
        " in View " +
        viewId
      );
    }
  }
  toJSON = function () {
    return {
      id: this.getEntityId(),
      type: this.getType(),
      source: this.getSource(),
      target: this.getTarget(),
      json: this.getJSON(),
      viewId: this.getViewId(),
      oType: this.getOriginType(),
      jabberId: this.getJabberId(),
    };
  };
}

/**
 * AttributeAddOperation
 * @class operations.ot.AttributeAddOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {String} subjectEntityId Id of the entity the attribute is assigned to
 * @param {String} rootSubjectEntityId Id of topmost entity in the chain of entities the attribute is assigned to
 * @param {String} type Type of attribute to add
 * @constructor
 */
class AttributeAddOperation extends EntityOperation {
  static TYPE = "AttributeAddOperation";
  getSubjectEntityId;
  getRootSubjectEntityId;
  getType;
  getData;
  toJSON;
  constructor(
    entityId,
    subjectEntityId,
    rootSubjectEntityId,
    type,
    data = null
  ) {
    super(
      EntityOperation.TYPES.AttributeAddOperation,
      entityId,
      CONFIG.ENTITY.ATTR
    );
    var that = this;

    /**
     * Id of the entity the attribute is assigned to
     * @type {String}
     * @private
     */
    var _subjectEntityId = subjectEntityId;

    /**
     * Id of topmost entity in the chain of entities the attribute is assigned to
     * @type {String}
     * @private
     */
    var _rootSubjectEntityId = rootSubjectEntityId;

    /**
     * Type of attribute to add
     * @type {String}
     * @private
     */
    var _type = type;

    var _data = data;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.ATTR + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          subjectEntityId: _subjectEntityId,
          rootSubjectEntityId: _rootSubjectEntityId,
          data: _data,
        }),
        CONFIG.OPERATION.TYPE.INSERT,
        CONFIG.IWC.POSITION.ATTR.ADD
      );
    };

    /**
     * Get id of the entity the attribute is assigned to
     * @returns {*}
     */
    this.getSubjectEntityId = function () {
      return _subjectEntityId;
    };

    /**
     * Get id of topmost entity in the chain of entities the attribute is assigned to
     * @returns {*}
     */
    this.getRootSubjectEntityId = function () {
      return _rootSubjectEntityId;
    };

    /**
     * Get type of attribute to add
     * @returns {*}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        that.setOTOperation(otOperation);
      }
      return otOperation;
    };

    this.getData = function () {
      return _data;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {AttributeDeleteOperation}
     */
    this.inverse = function () {
      return new AttributeDeleteOperation(
        that.getEntityId(),
        that.getSubjectEntityId(),
        that.getRootSubjectEntityId(),
        that.getType()
      );
    };

    this.toJSON = function () {
      return {
        entityId: this.getEntityId(),
        type: this.getType(),
        subjectEntityId: this.getSubjectEntityId(),
        rootSubjectEntityId: this.getRootSubjectEntityId(),
        data: this.getData(),
      };
    };
  }
}

/**
 * AttributeDeleteOperation
 * @class operations.ot.AttributeDeleteOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {String} subjectEntityId Id of the entity the attribute is assigned to
 * @param {String} rootSubjectEntityId Id of topmost entity in the chain of entities the attribute is assigned to
 * @param {String} type Type of attribute to delete
 * @constructor
 */
class AttributeDeleteOperation extends EntityOperation {
  static TYPE = "AttributeDeleteOperation";
  getSubjectEntityId;
  getRootSubjectEntityId;
  getType;
  toJSON;
  constructor(entityId, subjectEntityId, rootSubjectEntityId, type) {
    super(
      EntityOperation.TYPES.AttributeDeleteOperation,
      entityId,
      CONFIG.ENTITY.ATTR
    );
    var that = this;

    /**
     * Id of the entity the attribute is assigned to
     * @type {String}
     * @private
     */
    var _subjectEntityId = subjectEntityId;

    /**
     * Id of topmost entity in the chain of entities the attribute is assigned to
     * @type {String}
     * @private
     */
    var _rootSubjectEntityId = rootSubjectEntityId;

    /**
     * Type of attribute to add
     * @type {String}
     * @private
     */
    var _type = type;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.ATTR + ":" + that.getEntityId(),
        JSON.stringify({
          type: _type,
          subjectEntityId: _subjectEntityId,
          rootSubjectEntityId: _rootSubjectEntityId,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.ATTR.DEL
      );
    };

    /**
     * Get id of the entity the attribute is assigned to
     * @returns {*}
     */
    this.getSubjectEntityId = function () {
      return _subjectEntityId;
    };

    /**
     * Get id of topmost entity in the chain of entities the attribute is assigned to
     * @returns {*}
     */
    this.getRootSubjectEntityId = function () {
      return _rootSubjectEntityId;
    };

    /**
     * Get type of attribute to add
     * @returns {*}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        that.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {operations.ot.EntityOperation} operation Remote operation
     * @returns {operations.ot.EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      switch (operation.getOperationType()) {
        case EntityOperation.TYPES.AttributeAddOperation:
        case EntityOperation.TYPES.AttributeDeleteOperation:
          if (
            that.getRootSubjectEntityId() === operation.getRootSubjectEntityId()
          ) {
            return null;
          }
          break;
        case EntityOperation.TYPES.ValueChangeOperation:
          if (operation.getEntityIdChain().indexOf(this.getEntityId()) !== -1) {
            return null;
          }
          break;
      }

      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {operations.ot.AttributeAddOperation}
     */
    this.inverse = function () {
      return new AttributeAddOperation(
        this.getEntityId(),
        this.getSubjectEntityId(),
        this.getRootSubjectEntityId(),
        this.getType()
      );
    };
    this.toJSON = function () {
      return {
        entityId: this.getEntityId(),
        type: this.getType(),
        subjectEntityId: this.getSubjectEntityId(),
        rootSubjectEntityId: this.getRootSubjectEntityId(),
      };
    };
  }
}

/**
 * NodeMoveOperation
 * @class operations.ot.NodeMoveOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {number} offsetX Offset in x-direction
 * @param {number} offsetY Offset in y-direction
 * @param {string} optional: jabberId the jabberId of the user (is automatically set by propagateNodeMoveOperation)
 * @constructor
 */
class NodeMoveOperation extends EntityOperation {
  static TYPE = "NodeMoveOperation";
  getOffsetX;
  getOffsetY;
  getJabberId;
  setJabberId;
  constructor(entityId, offsetX, offsetY, jabberId) {
    super(
      EntityOperation.TYPES.NodeMoveOperation,
      entityId,
      CONFIG.ENTITY.NODE
    );
    var that = this;

    /**
     * Offset in x-direction
     * @type {number}
     * @private
     */
    var _offsetX = offsetX;

    /**
     * Offset in y-direction
     * @type {number}
     * @private
     */
    var _offsetY = offsetY;

    /**
     * jabber id of the user
     * @type {string}
     * @private
     */
    var _jabberId = jabberId;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.NODE + ":" + that.getEntityId(),
        JSON.stringify({
          offsetX: _offsetX,
          offsetY: _offsetY,
          jabberId: _jabberId,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.NODE.POS
      );
    };

    /**
     * Get offset in x-direction
     * @returns {number}
     */
    this.getOffsetX = function () {
      return _offsetX;
    };

    /**
     * Get offset in y-direction
     * @returns {number}
     */
    this.getOffsetY = function () {
      return _offsetY;
    };

    /**
     * Get the JabberId
     * @returns {string}
     */
    this.getJabberId = function () {
      return _jabberId;
    };
    /**
     * Set the JabberId
     * @param {string} jabberId
     */
    this.setJabberId = function (jabberId) {
      _jabberId = jabberId;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        this.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {NodeMoveOperation}
     */
    this.inverse = function () {
      return new NodeMoveOperation(
        this.getEntityId(),
        -this.getOffsetX(),
        -this.getOffsetY(),
        this.getJabberId()
      );
    };
  }
  static getOperationDescription(nodeType, nodeLabel, viewId) {
    if (!nodeLabel && !viewId) {
      return "..moved " + nodeType;
    } else if (!viewId) {
      return "..moved " + nodeType + " " + nodeLabel;
    } else {
      return "..moved " + nodeType + " " + nodeLabel + " in View " + viewId;
    }
  }
  toJSON = function () {
    return {
      id: this.getEntityId(),
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      jabberId: this.getJabberId(),
    };
  };
}

/**
 * NodeMoveZOperation
 * @class operations.ot.NodeMoveZOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {number} offsetZ Offset in z-direction
 * @param {string} optional: jabberId the jabberId of the user (is automatically set by propagateNodeMoveOperation)
 * @constructor
 */
class NodeMoveZOperation extends EntityOperation {
  static TYPE = "NodeMoveZOperation";
  getOffsetZ;
  getJabberId;
  setJabberId;
  constructor(entityId, offsetZ, jabberId) {
    super(
      EntityOperation.TYPES.NodeMoveZOperation,
      entityId,
      CONFIG.ENTITY.NODE
    );
    var that = this;

    /**
     * Offset in y-direction
     * @type {number}
     * @private
     */
    var _offsetZ = offsetZ;

    /**
     * the jabberId
     * @type {string}
     * @private
     */
    var _jabberId = jabberId;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.NODE + ":" + that.getEntityId(),
        JSON.stringify({
          offsetZ: _offsetZ,
          jabberId: _jabberId,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.NODE.Z
      );
    };

    /**
     * Get offset in z-direction
     * @returns {number}
     */
    this.getOffsetZ = function () {
      return _offsetZ;
    };

    this.getJabberId = function () {
      return _jabberId;
    };

    this.setJabberId = function (jabberId) {
      _jabberId = jabberId;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        this.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {NodeMoveZOperation}
     */
    this.inverse = function () {
      return new NodeMoveZOperation(
        this.getEntityId(),
        -this.getOffsetZ(),
        this.getJabberId()
      );
    };
  }
  static getOperationDescription(nodeType, nodeLabel, viewId) {
    if (!nodeLabel && !viewId) {
      return "..moved " + nodeType + " on on Z-Axis";
    } else if (!viewId) {
      return "..moved " + nodeType + " " + nodeLabel + " on Z-Axis";
    } else {
      return (
        "..moved " +
        nodeType +
        " " +
        nodeLabel +
        " in View " +
        viewId +
        " on Z-Axis"
      );
    }
  }
  toJSON = function () {
    return {
      id: this.getEntityId(),
      offsetZ: this.getOffsetZ(),
      jabberId: this.getJabberId(),
    };
  };
}

/**
 * NodeResizeOperation
 * @class operations.ot.NodeResizeOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param {String} entityId Entity id of the entity this activity works on
 * @param {number} offsetX Offset in x-direction
 * @param {number} offsetY Offset in y-direction
 * @param {string} optional: jabberId the jabberId of the user (is automatically set by propagateNodeMoveOperation)
 * @constructor
 */
class NodeResizeOperation extends EntityOperation {
  static TYPE = "NodeResizeOperation";
  getOffsetX
  getOffsetY
  getJabberId
  setJabberId
  constructor(entityId, offsetX, offsetY, jabberId) {
    super(
      EntityOperation.TYPES.NodeResizeOperation,
      entityId,
      CONFIG.ENTITY.NODE
    );
    var that = this;

    var _jabberId = jabberId;

    /**
     * Offset in x-direction
     * @type {number}
     * @private
     */
    var _offsetX = offsetX;

    /**
     * Offset in y-direction
     * @type {number}
     * @private
     */
    var _offsetY = offsetY;

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.NODE + ":" + that.getEntityId(),
        JSON.stringify({
          offsetX: _offsetX,
          offsetY: _offsetY,
          jabberId: _jabberId,
        }),
        CONFIG.OPERATION.TYPE.UPDATE,
        CONFIG.IWC.POSITION.NODE.DIM
      );
    };

    /**
     * Get offset in x-direction
     * @returns {number}
     */
    this.getOffsetX = function () {
      return _offsetX;
    };

    /**
     * Get offset in y-direction
     * @returns {number}
     */
    this.getOffsetY = function () {
      return _offsetY;
    };

    this.getJabberId = function () {
      return _jabberId;
    };

    this.setJabberId = function (jabberId) {
      _jabberId = jabberId;
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        this.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {EntityOperation} operation Remote operation
     * @returns {EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {NodeResizeOperation}
     */
    this.inverse = function () {
      return new NodeResizeOperation(
        this.getEntityId(),
        -this.getOffsetX(),
        -this.getOffsetY(),
        this.getJabberId()
      );
    };
  }
  static getOperationDescription(nodeType, nodeLabel, viewId) {
    if (!nodeLabel && !viewId) {
      return "..resized " + nodeType;
    } else if (!viewId) {
      return "..resized " + nodeType + " " + nodeLabel;
    } else {
      return "..resized " + nodeType + " " + nodeLabel + " in View " + viewId;
    }
  }
  toJSON=function() {
    return {
      id: this.getEntityId(),
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      jabberId: this.getJabberId(),
    };
  }
}

/**
 * ValueChangeOperation
 * @class operations.ot.ValueChangeOperation
 * @memberof operations.ot
 * @extends operations.ot.EntityOperation
 * @param entityId Entity id of the entity this activity works on
 * @param {string} value Char that has been added resp. deleted
 * @param {string} type Type of operation (insertion resp. deletion)
 * @param {number} position Position where the char has been added resp. deleted
 * @constructor
 */
class ValueChangeOperation extends EntityOperation {
  static TYPE = "ValueChangeOperation";
  getJabberId;
  setJabberId;
  getFromView;
  setFromView;
  getValue;
  getType;
  setPosition;
  getPosition;
  setRemote;
  getRemote;
  setEntityIdChain;
  getEntityIdChain;
  getRootSubjectEntityId;
  constructor(
    entityId,
    value,
    type,
    position,
    jabberId = null,
    fromView = null
  ) {
    if (!entityId) throw new Error("Entity id is required");
    super(
      EntityOperation.TYPES.ValueChangeOperation,
      entityId,
      CONFIG.ENTITY.VAL
    );
    var that = this;

    var _fromView = fromView;

    var _jabberId = jabberId;

    /**
     * Char that has been added resp. deleted
     * @type {string}
     * @private
     */
    var _value = value;

    /**
     * Type of operation (insertion resp. deletion)
     * @type {string}
     * @private
     */
    var _type = type;

    /**
     * Position where the char has been added resp. deleted
     * @type {number}
     * @private
     */
    var _position = position;

    /**
     * Is the change issued by a remote user
     * @type {boolean}
     * @private
     */
    var _remote = true;

    /**
     * Chain of entities the value is assigned to
     * @type {string[]}
     * @private
     */
    var _entityIdChain = [];

    /**
     * Create OTOperation for operation
     * @returns {operations.ot.OTOperation}
     */
    var createOTOperation = function () {
      return new OTOperation(
        CONFIG.ENTITY.VAL + ":" + that.getEntityId(),
        _value,
        _type,
        _position,
        _jabberId,
        _fromView
      );
    };

    this.getJabberId = function () {
      return _jabberId;
    };
    this.setJabberId = function (jabberId) {
      _jabberId = jabberId;
    };

    this.getFromView = function () {
      return _fromView;
    };

    this.setFromView = function (fromView) {
      _fromView = fromView;
    };
    /**
     * Get char that has been added resp. deleted
     * @returns {string}
     */
    this.getValue = function () {
      return _value;
    };

    /**
     * Get type of operation (insertion resp. deletion)
     * @returns {string}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Set type of operation (insertion resp. deletion)
     * @param position
     */
    this.setPosition = function (position) {
      _position = position;
    };

    /**
     * Get position where the char has been added resp. deleted
     * @returns {number}
     */
    this.getPosition = function () {
      return _position;
    };

    /**
     * Set if the change is issued by a remote user
     * @param remote
     */
    this.setRemote = function (remote) {
      _remote = remote;
    };

    /**
     * Get if the change is issued by a remote user
     * @returns {boolean}
     */
    this.getRemote = function () {
      return _remote;
    };

    /**
     * Set chain of entities the value is assigned to
     * @param {string[]} entityIdChain
     */
    this.setEntityIdChain = function (entityIdChain) {
      _entityIdChain = entityIdChain;
    };

    /**
     * Get chain of entities the value is assigned to
     * @returns {string[]}
     */
    this.getEntityIdChain = function () {
      return _entityIdChain;
    };

    /**
     * Get topmost entity in the chain of entity the value is assigned to
     * @returns {string}
     */
    this.getRootSubjectEntityId = function () {
      return _entityIdChain[0];
    };

    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     * @private
     */
    this.getOTOperation = function () {
      var otOperation = EntityOperation.prototype.getOTOperation.call(this);
      if (otOperation === null) {
        otOperation = createOTOperation();
        this.setOTOperation(otOperation);
      }
      return otOperation;
    };

    /**
     * Adjust the passed operation in the history of operation
     * when this operation is applied remotely after the passed operation
     * on an graph instance stored in the passed EntityManager
     * @param {canvas_widget.EntityManager} EntityManager
     * @param {operations.ot.EntityOperation} operation Remote operation
     * @returns {operations.ot.EntityOperation}
     */
    this.adjust = function (EntityManager, operation) {
      switch (operation.getOperationType()) {
        case EntityOperation.TYPES.ValueChangeOperation:
          if (this.getEntityId() === operation.getEntityId()) {
            if (
              (this.getPosition() === operation.getPosition &&
                this.getValue() === operation.getValue &&
                this.getType() === CONFIG.OPERATION.TYPE.INSERT &&
                operation.getType() === CONFIG.OPERATION.TYPE.DELETE) ||
              (this.getType() === CONFIG.OPERATION.TYPE.DELETE &&
                operation.getType() === CONFIG.OPERATION.TYPE.INSERT)
            ) {
              return null;
            }
            if (this.getPosition() <= operation.getPosition()) {
              switch (this.getType()) {
                case CONFIG.OPERATION.TYPE.INSERT:
                  operation.setPosition(operation.getPosition() + 1);
                  break;
                case CONFIG.OPERATION.TYPE.DELETE:
                  operation.setPosition(operation.getPosition() - 1);
                  break;
              }
            }
          }
          break;
      }

      return operation;
    };

    /**
     * Compute the inverse of the operation
     * @returns {ValueChangeOperation}
     */
    this.inverse = function () {
      var newType,
        ValueChangeOperation = ValueChangeOperation;

      switch (this.getType()) {
        case CONFIG.OPERATION.TYPE.INSERT:
          newType = CONFIG.OPERATION.TYPE.DELETE;
          break;
        case CONFIG.OPERATION.TYPE.DELETE:
          newType = CONFIG.OPERATION.TYPE.INSERT;
          break;
        case CONFIG.OPERATION.TYPE.UPDATE:
          newType = CONFIG.OPERATION.TYPE.UPDATE;
          break;
      }
      return new ValueChangeOperation(
        this.getEntityId(),
        this.getValue(),
        newType,
        this.getPosition()
      );
    };
    this.toJSON = function () {
      return {
        entityId: this.getEntityId(),
        value: this.getValue(),
        position: this.getPosition(),
        type: this.getType(),
        jabberId: this.getJabberId(),
      };
    };
  }

  static getOperationDescription(valueKey, entityType, entityName, viewId) {
    if (!viewId)
      return (
        ".. changed " +
        valueKey +
        " of " +
        entityType +
        (entityName ? " " : "") +
        entityName
      );
    else
      return (
        ".. changed " +
        valueKey +
        " of " +
        entityType +
        (entityName ? " " : "") +
        entityName +
        " in View " +
        viewId
      );
  }
}

EntitySelectOperation.TYPE = "EntitySelectOperation";

/**
 * Entity Select Operation
 * @class operations.non_ot.EntitySelectOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} selectedEntityId Entity id of the selected entity
 * @param {string} selectedEntityType
 * @param {string} jabberId
 */

function EntitySelectOperation(selectedEntityId, selectedEntityType, jabberId) {
  /**
   * Entity id of the selected entity
   * @type {string}
   * @private
   */
  var _selectedEntityId = selectedEntityId;

  var _jabberId = jabberId;

  var _selectedEntityType = selectedEntityType;

  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  /**
   * Get entity id of the selected entity
   * @returns {string}
   */
  this.getSelectedEntityId = function () {
    return _selectedEntityId;
  };

  this.getSelectedEntityType = function () {
    return _selectedEntityType;
  };

  this.getJabberId = function () {
    return _jabberId;
  };

  /**
   * Set corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.setNonOTOperation = function (nonOTOperation) {
    _nonOTOperation = nonOTOperation;
  };

  /**
   * Get corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.getNonOTOperation = function () {
    return _nonOTOperation;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        EntitySelectOperation.TYPE,
        JSON.stringify({
          selectedEntityId: _selectedEntityId,
          selectedEntityType: _selectedEntityType,
        })
      );
    }
    return _nonOTOperation;
  };
}

EntitySelectOperation.prototype.toJSON = function () {
  return {
    selectedEntityId: this.getSelectedEntityId(),
    selectedEntityType: this.getSelectedEntityType(),
    jabberId: this.getJabberId(),
  };
};

/**
 * ToolSelectOperation
 * @class operations.non_ot.ToolSelectOperation.non_ot.ToolSelectOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} toolName Name of selected tool
 * @param label
 * @param {map} defaultAttributeValues Map containing default values for the attributes of a node.
 */
class ToolSelectOperation {
  static TYPE = "ToolSelectOperation";
  /**
   * Name of selected tool
   * @type {string}
   */
  selectedToolName;

  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  nonOTOperation;

  /**
   * Default label of selected tool
   * @type {string}
   */
  defaultLabel;

  /**
   * May be used to set default values for node attributes.
   * @type {map}
   */
  defaultAttributeValues;

  /**
   * Get name of selected tool
   * @returns {string}
   */
  getSelectedToolName;

  /**
   * Get default label of selected tool
   * @returns {string}
   */
  getDefaultLabel;

  /**
   * Get default values for node attributes.
   * @returns {map}
   */
  getDefaultAttributeValues;
  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  toNonOTOperation;
  constructor(toolName, label, defaultAttributeValues = {}) {
    /**
     * Name of selected tool
     * @type {string}
     */
    var selectedToolName = toolName;

    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    var nonOTOperation = null;

    /**
     * Default label of selected tool
     * @type {string}
     */
    var defaultLabel = label;

    /**
     * May be used to set default values for node attributes.
     * @type {map}
     */
    var defaultAttributeValues = defaultAttributeValues;

    /**
     * Get name of selected tool
     * @returns {string}
     */
    this.getSelectedToolName = function () {
      return selectedToolName;
    };

    /**
     * Get default label of selected tool
     * @returns {string}
     */
    this.getDefaultLabel = function () {
      return defaultLabel;
    };

    /**
     * Get default values for node attributes.
     * @returns {map}
     */
    this.getDefaultAttributeValues = function () {
      return defaultAttributeValues;
    };

    /**
     * Convert operation to NonOTOperation
     * @returns {operations.non_ot.NonOTOperation}
     */
    this.toNonOTOperation = function () {
      if (nonOTOperation === null) {
        nonOTOperation = new NonOTOperation(
          ToolSelectOperation.TYPE,
          JSON.stringify({ selectedToolName: selectedToolName })
        );
      }
      return nonOTOperation;
    };
  }
}

/**
 * ActivityOperation
 * @class operations.non_ot.ActivityOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} type Type of activity
 * @param {string} entityId Entity id of the entity this activity works on
 * @param {string} sender JabberId of the user who issued this activity
 * @param {string} text Text of this activity which is displayed in the activity widget
 * @param {object} data Additional data for the activity
 */
class ActivityOperation {
  static TYPE = "ActivityOperation";
  constructor(type, entityId, sender, text, data) {
    /**
     * Type of activity
     * @type {string}
     * @private
     */
    var _type = type;

    /**
     * Entity id of the entity this activity works on
     * @type {string}
     * @private
     */
    var _entityId = entityId;

    /**
     * JabberId of the user who issued this activity
     * @type {string}
     * @private
     */
    var _sender = sender;

    /**
     * Text of this activity which is displayed in the activity widget
     * @type {string}
     * @private
     */
    var _text = text;

    /**
     * Additional data for the activity
     * @type {Object}
     * @private
     */
    var _data = data;

    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    var _nonOTOperation = null;

    /**
     * Get type of activity
     * @returns {string}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get entity id of the entity this activity works on
     * @returns {string}
     */
    this.getEntityId = function () {
      return _entityId;
    };

    /**
     * Get JabberId of the user who issued this activity
     * @returns {string}
     */
    this.getSender = function () {
      return _sender;
    };

    /**
     * Get text of this activity which is displayed in the activity widget
     * @returns {string}
     */
    this.getText = function () {
      return _text;
    };

    /**
     * Get additional data for the activity
     * @returns {Object}
     */
    this.getData = function () {
      return _data;
    };

    /**
     * Convert operation to NonOTOperation
     * @returns {operations.non_ot.NonOTOperation}
     */
    this.toNonOTOperation = function () {
      if (_nonOTOperation === null) {
        _nonOTOperation = new NonOTOperation(
          ActivityOperation.TYPE,
          JSON.stringify({
            type: _type,
            entityId: _entityId,
            sender: _sender,
            text: _text,
            data: _data,
          })
        );
      }
      return _nonOTOperation;
    };
  }
  toJSON() {
    return {
      type: this.getType(),
      entityId: this.getEntityId(),
      sender: this.getSender(),
      text: this.getText(),
      data: this.getData(),
    };
  }
}

ExportMetaModelOperation.TYPE = "ExportMetaModelOperation";

/**
 * Export Image Operation
 * @class operations.non_ot.ExportMetaModelOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} requestingComponent Name of requesting Component
 * @param {string} data Meta model
 */
function ExportMetaModelOperation(requestingComponent, data) {
  /**
   * Name of requesting Component
   * @type {string}
   * @private
   */
  var _requestingComponent = requestingComponent;
  /**
   * Meta model
   * @type {object}
   * @private
   */
  var _data = data;

  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  /**
   * Get name of requesting Component
   * @returns {string}
   */
  this.getRequestingComponent = function () {
    return _requestingComponent;
  };

  /**
   * Get data URL of image
   * @returns {object}
   */
  this.getData = function () {
    return _data;
  };

  /**
   * Get exported JSON representation of the graph
   * @param {object} data
   */
  this.setData = function (data) {
    _data = data;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        ExportMetaModelOperation.TYPE,
        JSON.stringify({
          requestingComponent: _requestingComponent,
          data: _data,
        })
      );
    }
    return _nonOTOperation;
  };
}

ExportLogicalGuidanceRepresentationOperation.TYPE =
  "ExportLogicalGuidanceRepresentationOperation";

/**
 * Export Image Operation
 * @class operations.non_ot.ExportLogicalGuidanceRepresentationOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} requestingComponent Name of requesting Component
 * @param {string} data Meta model
 */
function ExportLogicalGuidanceRepresentationOperation(
  requestingComponent,
  data
) {
  /**
   * Name of requesting Component
   * @type {string}
   * @private
   */
  var _requestingComponent = requestingComponent;
  /**
   * Guidance rules
   * @type {object}
   * @private
   */
  var _data = data;

  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  /**
   * Get name of requesting Component
   * @returns {string}
   */
  this.getRequestingComponent = function () {
    return _requestingComponent;
  };

  /**
   * Get data URL of image
   * @returns {object}
   */
  this.getData = function () {
    return _data;
  };

  /**
   * Get exported JSON representation of the graph
   * @param {object} data
   */
  this.setData = function (data) {
    _data = data;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        ExportLogicalGuidanceRepresentationOperation.TYPE,
        JSON.stringify({
          requestingComponent: _requestingComponent,
          data: _data,
        })
      );
    }
    return _nonOTOperation;
  };
}

ExportImageOperation.TYPE = "ExportImageOperation";

/**
 * Export Image Operation
 * @class operations.non_ot.ExportImageOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} requestingComponent Name of requesting Component
 * @param {string} data Data URL of image
 */
function ExportImageOperation(requestingComponent, data) {
  /**
   * Name of requesting Component
   * @type {string}
   * @private
   */
  var _requestingComponent = requestingComponent;
  /**
   * Data URL of image
   * @type {object}
   * @private
   */
  var _data = data;

  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  /**
   * Get name of requesting Component
   * @returns {string}
   */
  this.getRequestingComponent = function () {
    return _requestingComponent;
  };

  /**
   * Get data URL of image
   * @returns {object}
   */
  this.getData = function () {
    return _data;
  };

  /**
   * Get exported JSON representation of the graph
   * @param {object} data
   */
  this.setData = function (data) {
    _data = data;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        ExportImageOperation.TYPE,
        JSON.stringify({
          requestingComponent: _requestingComponent,
          data: _data,
        })
      );
    }
    return _nonOTOperation;
  };
}

/**
 * SetViewTypesOperation
 * @class operations.non_ot.WidgetEnterOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {boolean} flag enable (true)/disable(false) the view types of the vml in the palette widget
 */
class SetViewTypesOperation {
  static TYPE = "SetViewTypesOperation";
  _flag;
  nonOTOperation;
  /**
   * Get name of selected tool
   * @returns {string}
   */
  getFlag = function () {
    return this._flag;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  toNonOTOperation = function () {
    if (this.nonOTOperation === null) {
      this.nonOTOperation = new NonOTOperation(
        SetViewTypesOperation.TYPE,
        JSON.stringify({ flag: this._flag })
      );
    }
    return this.nonOTOperation;
  };

  constructor(flag) {
    /**
     * Enable or disable the view types of the vml
     * @type {boolean}
     * @private
     */
    this._flag = flag;

    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    this.nonOTOperation = null;
  }
}

/**
 * InitModelTypesOperation
 * @class operations.non_ot.InitModelTypesOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} vls the visual language specification
 * @param {bool} startViewGeneration
 */
class InitModelTypesOperation {
  static TYPE = "InitModelTypesOperation";
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  nonOTOperation = null;
  _vls;
  _startViewGeneration;
  getVLS = function () {
    return this._vls;
  };

  /**
   * Get name of selected tool
   * @returns {string}
   */
  getViewGenerationFlag = function () {
    return this._startViewGeneration;
  };
  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  toNonOTOperation = function () {
    if (this.nonOTOperation === null) {
      this.nonOTOperation = new NonOTOperation(
        InitModelTypesOperation.TYPE,
        JSON.stringify({
          vls: this._vls,
          startViewGeneration: this._startViewGeneration,
        })
      );
    }
    return this.nonOTOperation;
  };
  constructor(vls, startViewGeneration) {
    /**
     * Name of selected tool
     * @type {string}
     */
    this._vls = vls;

    this._startViewGeneration = startViewGeneration;
  }
}

ViewInitOperation.TYPE = "ViewInitOperation";

/**
 * ViewInitOperation
 * @class operations.non_ot.ViewInitOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {object} data the view as json
 * @param {object} viewpoint the viewpoint vls as json
 */
function ViewInitOperation(data, viewpoint) {
  /**
   * Name of selected tool
   * @type {string}
   */
  var _data = data;

  var _viewpoint = viewpoint;
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var nonOTOperation = null;

  /**
   * Get name of selected tool
   * @returns {string}
   */
  this.getData = function () {
    return _data;
  };

  this.getViewpoint = function () {
    return _viewpoint;
  };
  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (nonOTOperation === null) {
      nonOTOperation = new NonOTOperation(
        ViewInitOperation.TYPE,
        JSON.stringify({ data: _data, viewpoint: _viewpoint })
      );
    }
    return nonOTOperation;
  };
}

/**
 * DeleteViewOperation
 * @class operations.non_ot.DeleteViewOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} viewId identifier of the view
 */
class DeleteViewOperation {
  static TYPE = "DeleteViewOperation";
  constructor(viewId) {
    /**
     * Name of selected tool
     * @type {string}
     */
    var _viewId = viewId;

    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    var nonOTOperation = null;

    /**
     * Get the list with node ids to delete
     * @returns {string}
     */
    this.getViewId = function () {
      return _viewId;
    };

    /**
     * Convert operation to NonOTOperation
     * @returns {operations.non_ot.NonOTOperation}
     */
    this.toNonOTOperation = function () {
      if (nonOTOperation === null) {
        nonOTOperation = new NonOTOperation(
          DeleteViewOperation.TYPE,
          JSON.stringify({ viewId: _viewId })
        );
      }
      return nonOTOperation;
    };
  }
}

SetModelAttributeNodeOperation.TYPE = "SetModelAttributeNodeOperation";

/**
 * SetModelAttributeNodeOperation
 * @class operations.non_ot.SetModelAttributeNodeOperation
 * @memberof operations.non_ot
 * @constructor
 */
function SetModelAttributeNodeOperation() {
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var nonOTOperation = null;

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (nonOTOperation === null) {
      nonOTOperation = new NonOTOperation(
        SetModelAttributeNodeOperation.TYPE,
        JSON.stringify({ empty: "empty" })
      );
    }
    return nonOTOperation;
  };
}

UpdateViewListOperation.TYPE = "UpdateViewListOperation";

/**
 * UpdateViewListOperation
 * @class operations.non_ot.UpdateViewListOperation
 * @memberof operations.non_ot
 * @constructor
 */
function UpdateViewListOperation() {
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var nonOTOperation = null;

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (nonOTOperation === null) {
      nonOTOperation = new NonOTOperation(
        UpdateViewListOperation.TYPE,
        JSON.stringify({})
      );
    }
    return nonOTOperation;
  };
}

ShowGuidanceBoxOperation.TYPE = "ShowGuidanceBoxOperation";

/**
 * ToolGuidanceOperation
 * @class operations.non_ot.ToolGuidanceOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} toolName Name of selected tool
 */
function ShowGuidanceBoxOperation(label, guidance, entityId) {
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var nonOTOperation = null;
  var _label = label;
  var _guidance = guidance;
  var _entityId = entityId;

  this.getLabel = function () {
    return _label;
  };

  this.getGuidance = function () {
    return _guidance;
  };

  this.getEntityId = function () {
    return _entityId;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (nonOTOperation === null) {
      nonOTOperation = new NonOTOperation(
        ShowGuidanceBoxOperation.TYPE,
        JSON.stringify({
          label: _label,
          guidance: _guidance,
          entityId: _entityId,
        })
      );
    }
    return nonOTOperation;
  };
}

CanvasViewChangeOperation.TYPE = "CanvasViewChangeOperation";

/**
 * Entity Select Operation
 * @class operations.non_ot.EntitySelectOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} selectedEntityId Entity id of the selected entity
 */
function CanvasViewChangeOperation(left, top, width, height, zoom) {
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  this.getLeft = function () {
    return left;
  };

  this.getTop = function () {
    return top;
  };

  this.getWidth = function () {
    return width;
  };

  this.getHeight = function () {
    return height;
  };

  this.getZoom = function () {
    return zoom;
  };

  /**
   * Set corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.setNonOTOperation = function (nonOTOperation) {
    _nonOTOperation = nonOTOperation;
  };

  /**
   * Get corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.getNonOTOperation = function () {
    return _nonOTOperation;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        CanvasViewChangeOperation.TYPE,
        JSON.stringify({
          left: left,
          top: top,
          width: width,
          height: height,
          zoom: zoom,
        })
      );
    }
    return _nonOTOperation;
  };
}

RevokeSharedActivityOperation.TYPE = "RevokeSharedActivityOperation";

/**
 * Entity Select Operation
 * @class operations.non_ot.EntitySelectOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} selectedEntityId Entity id of the selected entity
 */
function RevokeSharedActivityOperation(id) {
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  this.getId = function () {
    return id;
  };

  /**
   * Set corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.setNonOTOperation = function (nonOTOperation) {
    _nonOTOperation = nonOTOperation;
  };

  /**
   * Get corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.getNonOTOperation = function () {
    return _nonOTOperation;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        RevokeSharedActivityOperation.TYPE,
        JSON.stringify({
          id: id,
        })
      );
    }
    return _nonOTOperation;
  };
}

RevokeSharedActivityOperation.prototype.toJSON = function () {
  return { id: this.getId() };
};

CollaborateInActivityOperation.TYPE = "CollaborateInActivityOperation";

/**
 * Entity Select Operation
 * @class operations.non_ot.EntitySelectOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} selectedEntityId Entity id of the selected entity
 */
function CollaborateInActivityOperation(id) {
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  this.getId = function () {
    return id;
  };

  /**
   * Set corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.setNonOTOperation = function (nonOTOperation) {
    _nonOTOperation = nonOTOperation;
  };

  /**
   * Get corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.getNonOTOperation = function () {
    return _nonOTOperation;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        CollaborateInActivityOperation.TYPE,
        JSON.stringify({
          id: id,
        })
      );
    }
    return _nonOTOperation;
  };
}

MoveCanvasOperation.TYPE = "MoveCanvasOperation";

/**
 * Entity Select Operation
 * @class operations.non_ot.EntitySelectOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} selectedEntityId Entity id of the selected entity
 */
function MoveCanvasOperation(objectId, transition) {
  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  this.getObjectId = function () {
    return objectId;
  };

  this.getTransition = function () {
    return transition;
  };

  /**
   * Set corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.setNonOTOperation = function (nonOTOperation) {
    _nonOTOperation = nonOTOperation;
  };

  /**
   * Get corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   */
  this.getNonOTOperation = function () {
    return _nonOTOperation;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        MoveCanvasOperation.TYPE,
        JSON.stringify({
          objectId: objectId,
          transition: transition,
        })
      );
    }
    return _nonOTOperation;
  };
}

/**
 * Entity Select Operation
 * @class operations.non_ot.EntitySelectOperation
 * @memberof operations.non_ot
 * @constructor
 * @param {string} data
 */
class GuidanceStrategyOperation {
  static TYPE = "GuidanceStrategyOperation";
  constructor(data) {
    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    var _nonOTOperation = null;

    this.getData = function () {
      return data;
    };

    /**
     * Set corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     */
    this.setNonOTOperation = function (nonOTOperation) {
      _nonOTOperation = nonOTOperation;
    };

    /**
     * Get corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     */
    this.getNonOTOperation = function () {
      return _nonOTOperation;
    };

    /**
     * Convert operation to NonOTOperation
     * @returns {operations.non_ot.NonOTOperation}
     */
    this.toNonOTOperation = function () {
      if (_nonOTOperation === null) {
        _nonOTOperation = new NonOTOperation(
          GuidanceStrategyOperation.TYPE,
          JSON.stringify({
            data: data,
          })
        );
      }
      return _nonOTOperation;
    };
  }
  toJSON() {
    return { data: this.getData() };
  }
}

UpdateMetamodelOperation.TYPE = "UpdateMetamodelOperation";

/**
 * UpdateMetamodelOperation
 * @class operations.non_ot.UpdateMetamodelOperation
 * @memberof operations.non_ot
 * @constructor
 */
function UpdateMetamodelOperation(metaModelingRoomName, modelingRoomName) {
  /**
   * Room name of metamodel is created
   * @type {string}
   */
  var _metaModelingRoomName = metaModelingRoomName;

  /**
   * Room name to upload created metamodel
   * @type {string}
   */
  var _modelingRoomName = modelingRoomName;

  /**
   * Corresponding NonOtOperation
   * @type {operations.non_ot.NonOTOperation}
   * @private
   */
  var _nonOTOperation = null;

  /**
   * Get metamodeling room name
   * @returns {string}
   */
  this.getMetaModelingRoomName = function () {
    return _metaModelingRoomName;
  };

  /**
   * Get modeling room name
   * @returns {string}
   */
  this.getModelingRoomName = function () {
    return _modelingRoomName;
  };

  /**
   * Convert operation to NonOTOperation
   * @returns {operations.non_ot.NonOTOperation}
   */
  this.toNonOTOperation = function () {
    if (_nonOTOperation === null) {
      _nonOTOperation = new NonOTOperation(
        UpdateMetamodelOperation.TYPE,
        JSON.stringify({ empty: "empty" })
      );
    }
    return _nonOTOperation;
  };
}
UpdateMetamodelOperation.prototype.toJSON = function () {
  return {};
};

/**
 * OperationFactory
 * @class operations.OperationFactory
 * @memberof operations.ot
 * @constructor
 */
function OperationFactory() {
  return {
    /**
     * Creates an Operation from a received NonOTOperation
     * @memberof operations.OperationFactory#
     * @param operation
     * @returns {operations.non_ot.ToolSelectOperation|EntitySelectOperation|ToolSelectOperation}
     */
    createOperationFromNonOTOperation: function (operation) {
      var type = operation.getType(),
        data,
        resOperation;

      try {
        data = JSON.parse(operation.getData());
      } catch (e) {
        console.error(
          "Not able to parse data to JSON. Check the corresponding operation"
        );
        return null;
      }

      switch (type) {
        case EntitySelectOperation.TYPE:
          resOperation = new EntitySelectOperation(
            data.selectedEntityId,
            data.selectedEntityType,
            data.jabberId
          );
          resOperation.setNonOTOperation(operation);
          break;
        case ToolSelectOperation.TYPE:
          resOperation = new ToolSelectOperation(
            data.selectedToolName,
            data.name,
            data.defaultAttributeValues
          );
          break;
        case ActivityOperation.TYPE:
          resOperation = new ActivityOperation(
            data.type,
            data.entityId,
            data.sender,
            data.text,
            data.data
          );
          break;
        case ExportMetaModelOperation.TYPE:
          resOperation = new ExportMetaModelOperation(
            data.requestingComponent,
            data.data
          );
          break;
        case ExportLogicalGuidanceRepresentationOperation.TYPE:
          resOperation = new ExportLogicalGuidanceRepresentationOperation(
            data.requestingComponent,
            data.data
          );
          break;
        case ExportImageOperation.TYPE:
          resOperation = new ExportImageOperation(
            data.requestingComponent,
            data.data
          );
          break;
        case SetViewTypesOperation.TYPE:
          resOperation = new SetViewTypesOperation(data.flag);
          break;
        case InitModelTypesOperation.TYPE:
          resOperation = new InitModelTypesOperation(
            data.vls,
            data.startViewGeneration
          );
          break;
        case ViewInitOperation.TYPE:
          resOperation = new ViewInitOperation(data.data, data.viewpoint);
          break;
        case DeleteViewOperation.TYPE:
          resOperation = new DeleteViewOperation(data.viewId);
          break;
        case ShowGuidanceBoxOperation.TYPE:
          resOperation = new ShowGuidanceBoxOperation(
            data.label,
            data.guidance,
            data.entityId
          );
          break;
        case SetModelAttributeNodeOperation.TYPE:
          resOperation = new SetModelAttributeNodeOperation();
          break;
        case UpdateViewListOperation.TYPE:
          resOperation = new UpdateViewListOperation();
          break;
        case CanvasViewChangeOperation.TYPE:
          resOperation = new CanvasViewChangeOperation(
            data.left,
            data.top,
            data.width,
            data.height,
            data.zoom
          );
          resOperation.setNonOTOperation(operation);
          break;
        case RevokeSharedActivityOperation.TYPE:
          resOperation = new RevokeSharedActivityOperation(data.id);
          break;
        case CollaborateInActivityOperation.TYPE:
          resOperation = new CollaborateInActivityOperation(data.id);
          break;
        case MoveCanvasOperation.TYPE:
          resOperation = new MoveCanvasOperation(
            data.objectId,
            data.transition
          );
          break;
        case GuidanceStrategyOperation.TYPE:
          resOperation = new GuidanceStrategyOperation(data.data);
          resOperation.setNonOTOperation(operation);
          break;
        case UpdateMetamodelOperation.TYPE:
          resOperation = new UpdateMetamodelOperation(
            data.metamodelingRoomName,
            data.modelingRoomName
          );
          break;
        default:
          resOperation = new NonOTOperation(type, data);
          break;
      }
      return resOperation;
    },
    /**
     * Creates an entity operation from a received OTOperation
     * @memberof operations.OperationFactory#
     * @param operation
     * @returns {EntityOperation}
     */
    createOperationFromOTOperation: function (operation) {
      var value;
      var entityType;
      var entityId;
      var components = operation.getName().split(":");

      var resOperation;

      if (components.length === 2) {
        entityType = components[0];
        entityId = components[1];

        switch (entityType) {
          case CONFIG.ENTITY.NODE:
            try {
              value = JSON.parse(operation.getValue());
            } catch (e) {
              return null;
            }
            switch (operation.getPosition()) {
              case CONFIG.IWC.POSITION.NODE.ADD:
                switch (operation.getType()) {
                  case CONFIG.OPERATION.TYPE.INSERT:
                    resOperation = new NodeAddOperation(
                      entityId,
                      value.type,
                      value.left,
                      value.top,
                      value.width,
                      value.height,
                      value.zIndex,
                      value.containment,
                      value.json,
                      value.viewId,
                      value.oType,
                      value.jabberId
                    );
                    break;
                  case CONFIG.OPERATION.TYPE.UPDATE:
                    resOperation = new NodeDeleteOperation(
                      entityId,
                      value.type,
                      value.left,
                      value.top,
                      value.width,
                      value.height,
                      value.zIndex,
                      value.containment,
                      value.json
                    );
                    break;
                }
                break;
              case CONFIG.IWC.POSITION.NODE.POS:
                resOperation = new NodeMoveOperation(
                  entityId,
                  value.offsetX,
                  value.offsetY,
                  value.jabberId
                );
                break;
              case CONFIG.IWC.POSITION.NODE.Z:
                resOperation = new NodeMoveZOperation(
                  entityId,
                  value.offsetZ,
                  value.jabberId
                );
                break;
              case CONFIG.IWC.POSITION.NODE.DIM:
                resOperation = new NodeResizeOperation(
                  entityId,
                  value.offsetX,
                  value.offsetY,
                  value.jabberId
                );
                break;
            }
            break;
          case CONFIG.ENTITY.EDGE:
            try {
              value = JSON.parse(operation.getValue());
            } catch (e) {
              return null;
            }
            switch (operation.getType()) {
              case CONFIG.OPERATION.TYPE.INSERT:
                resOperation = new EdgeAddOperation(
                  entityId,
                  value.type,
                  value.source,
                  value.target,
                  value.json,
                  value.viewId,
                  value.oType,
                  value.jabberId
                );
                break;
              case CONFIG.OPERATION.TYPE.UPDATE:
                resOperation = new EdgeDeleteOperation(
                  entityId,
                  value.type,
                  value.source,
                  value.target,
                  value.json
                );
                break;
            }
            break;
          case CONFIG.ENTITY.ATTR:
            try {
              value = JSON.parse(operation.getValue());
            } catch (e) {
              return null;
            }
            switch (operation.getType()) {
              case CONFIG.OPERATION.TYPE.INSERT:
                resOperation = new AttributeAddOperation(
                  entityId,
                  value.subjectEntityId,
                  value.rootSubjectEntityId,
                  value.type,
                  value.data
                );
                break;
              case CONFIG.OPERATION.TYPE.UPDATE:
                resOperation = new AttributeDeleteOperation(
                  entityId,
                  value.subjectEntityId,
                  value.rootSubjectEntityId,
                  value.type
                );
                break;
            }
            break;
          case CONFIG.ENTITY.VAL:
            resOperation = new ValueChangeOperation(
              entityId,
              operation.getValue(),
              operation.getType(),
              operation.getPosition(),
              null
            );
            break;
        }
      }
      if (resOperation !== null) {
        resOperation.setOTOperation(operation);
      }
      return resOperation;
    },
  };
}

var OperationFactory$1 = OperationFactory();

/**
 * Provides messaging functionality.
 * @param {Array} categories - (currently not implemented) categories of widgets that shall process the intent (e.g. ["editor","proxy" ])
 * @param {String} origin - The origin (i.e. the url where your application script lives) is needed for messaging
 * @param {} y - A reference to yjs' Y object for global messaging
 */
class Client {
  //console.log(y);
  _y;
  _componentName = "unknown";

  //private variables
  _connected = false;
  _categories;
  _callback;

  // Needed for HTML5 messaging
  _origin;

  constructor(componentName, categories, origin, y) {
    //console.log(y);
    this._y = y;

    this._componentName = componentName;
    this._categories = categories;
    // Needed for HTML5 messaging
    this._origin = origin;
  }

  /**
   * Connect widget to messaging. This sets up the callback function and creates
   * an event listener for HTML5 messaging and a yjs observer for global messaging.
   * If yjs is not available only local messaging is set up.
   * @param {function} callback - The callback function used for receiving messages.
   */
  connect(callback) {
    this._callback = callback;
    var handler = this.receiveMessage.bind(this);
    //Todo
    const widgetTageName = getWidgetTagName(this._componentName);
    try {
      const _node = document.querySelector(widgetTageName);

      if (!_node) {
        throw new Error(
          "html tag not found in document. Please make sure that you added the " +
            widgetTageName +
            " to the document. Hint: do not use the shadow dom."
        );
      }
      _node.addEventListener("syncmeta-message", handler);
    } catch (error) {
      console.error(error);
    }
    

    if (this._y) {
      // If yjs is available also connect a global listener
      const intents = this._y.getMap("intents");
      if (intents) intents.observe(handler);
    }
  }

  /**
   * Disconnect the widget from messaging. This removes the event listener
   * and the callback for both local and global messaging. If yjs is not available,
   * only local messaging will be available.
   */
  disconnect() {
    //THISELEMENT.removeEventListener("syncmeta-message", this.receiveMessage, false);
    this._callback = null;

    if (!(this._y === null || this._y === undefined)) {
      this._y.getMap("intents").unobserve(this.receiveMessage);
    }
  }

  /**
   * Publishes an intent,
   * @param {intent} - The intent about to be published, this object contains all information.
   */
  publish(intent) {
    if (util.validateIntent(intent)) {
      if (intent.flags[0] === util.FLAGS.PUBLISH_GLOBAL) {
        this.publishGlobal(intent, this._y);
      } else if (intent.flags[0] === util.FLAGS.PUBLISH_LOCAL) {
        this.publishLocal(intent, this._origin);
      }
    }
  }

  publishLocal(intent, origin) {
    //Find iframe and post message
    const widgets = [];
    for (const el of document.querySelectorAll("*")) {
      if (el.tagName.match(/-widget$/i)) {
        widgets.push(el);
      }
    }

    widgets.forEach(function (widget) {
      const receiverTagName = getWidgetTagName(intent.receiver.toLowerCase());
      if (widget.tagName.toLowerCase() === receiverTagName.toLowerCase()) {
        const event = new CustomEvent("syncmeta-message", {
          detail: {
            intent,
            origin,
          },
        });
        widget.dispatchEvent(event);
      }
    });
  }

  publishGlobal(intent, y) {
    //y.share.intents.push(intent);
    y.getMap("intents").set(intent.receiver, intent);
  }

  /**
   * Unpack events and pre process them. This unwraps HTML5 messages and manages the yjs map
   * used for global messaging.
   * @param {Event} event - The event that activated the callback
   */
  receiveMessage(event) {
    // Local messaging events
    if (event.type === "syncmeta-message") {
      //Unpack message events
      if (event instanceof CustomEvent) {
        this._callback(event.detail.intent);
      }
    } else if (event.type === "add" || event.type == "update") {
      //Unpack yjs event and remove from map
      var intent = event.object.get(event.name);
      event.object.delete(event.name);
      console.log(intent);
      this._callback(intent);
    }
  }
}

//======================= IWC.util ==============================

class util {
  /**
   * Used to determine whether global or local messaging should be used.
   * Local messaging uses HTML5 messaging, global messaging uses yjs.
   */
  static FLAGS = {
    PUBLISH_LOCAL: "PUBLISH_LOCAL",
    PUBLISH_GLOBAL: "PUBLISH_GLOBAL",
  };

  /**
   * Check intent for correctness.
   */
  static validateIntent(intent) {
    if (typeof intent.sender != "string") {
      throw new Error(
        "Intent object must possess property 'component' of type 'String'"
      );
    }
    if (typeof intent.data != "string") {
      throw new Error(
        "Intent object must possess property 'data' of type 'String'"
      );
    }
    if (typeof intent.dataType != "string") {
      throw new Error(
        "Intent object must possess property 'dataType' of type 'String'"
      );
    }
    return true;
  }
}

var PAYLOAD_DATA_TYPE = {
  OT_OPERATION: "OTOperation",
  NON_OT_OPERATION: "NonOTOperation",
};

class IWCWrapper {
  /**
   * Inter-widget communication wrapper
   * @class IWCWrapper
   * @constructor
   * @param componentName Name of component (widget) using the wrapper
   */

  /**
   * Set if local messages should be buffered
   * @type {boolean}
   */
  BUFFER_ENABLED = false;

  /**
   * Interval for sending buffered local messages
   * @type {number}
   */
  INTERVAL_SEND = 25;

  Space = null;

  //noinspection JSMismatchedCollectionQueryUpdate
  /**
   * Buffer for local messages
   * @type {Array}
   * @private
   */
  _messageBuffer = [];

  //noinspection JSMismatchedCollectionQueryUpdate
  /**
   * Set of registered Callbacks for local data receive events
   * @type {Array}
   * @private
   */
  _onDataReceivedCallbacks = [];

  _onDataReceivedCallers = [];

  /**
   * Stores (for each user) the times an inocming messages has been received to drop duplicate (same time) messages
   * @type {object}
   * @private
   */
  _times = {};

  /**
   * Inter widget communication client
   * @type {iwc.Client}
   * @private
   */
  _iwc;
  /**
   * Disconnect the iwc client
   * @memberof IWCWrapper#
   */
  disconnect;
  /**
   * Connect the iwc client
   * @memberof IWCWrapper#
   */
  connect;
  sendLocalMessage;
  sendLocalOTOperation;
  sendLocalNonOTOperation;
  getUserColor;
  registerOnDataReceivedCallback;
  unregisterOnDataReceivedCallback;
  getUser;
  getMembers;
  getSpaceTitle;
  setSpace;
  componentName;

  /**
   * Encapsulates the passed message information into the Android Intent-like format required by the iwc client
   * @param {string} receiver Component name of the receiving component (widget), empty string for remote messages
   * @param {string|string[]} flags Single flag or array of flags to indicate if the messages should be propagate locally or remotely
   * @param {string} action Type of data (DATA, DATA_ARRAY, SYNC)
   * @param {object} payload Message Payload
   * @returns {Object}
   */
  encapsulateMessage(receiver, flags, action, payload) {
    var i, numOfFlags, flag;
    // @ts-ignore
    var validatedFlags = [];

    if (flags instanceof Array) {
      for (i = 0, numOfFlags = flags.length; i < numOfFlags; i++) {
        flag = flags[i];
        if (
          flag === CONFIG.IWC.FLAG.PUBLISH_LOCAL ||
          flag === CONFIG.IWC.FLAG.PUBLISH_GLOBAL
        ) {
          // @ts-ignore
          validatedFlags.push(flag);
        }
      }
    } else if (typeof flags === "string") {
      if (
        flags === CONFIG.IWC.FLAG.PUBLISH_LOCAL ||
        flags === CONFIG.IWC.FLAG.PUBLISH_GLOBAL
      ) {
        // @ts-ignore
        validatedFlags.push(flags);
      }
    } else {
      throw "Parameter flags has wrong type. Array or String expected.";
    }

    if (typeof action !== "string") {
      throw "Parameter action has wrong type. String expected.";
    }

    receiver = receiver || "";

    return {
      receiver: receiver,
      sender: this.componentName,
      data: "",
      dataType: "",
      action: action,
      flags: validatedFlags,
      extras: {
        payload: payload,
        time: new Date().getTime(),
      },
    };
  }

  /**
   * Send all buffered local messages encapsulated in one message
   */
  sendBufferedMessages() {
    var intent;
    var data = null;

    for (var receiver in this._messageBuffer) {
      if (this._messageBuffer.hasOwnProperty(receiver)) {
        data = this._messageBuffer[receiver].splice(
          0,
          this._messageBuffer[receiver].length
        );
        //sendBufferTimer.pause();
        if (data.length == 1) {
          intent = this.encapsulateMessage(
            receiver,
            CONFIG.IWC.FLAG.PUBLISH_LOCAL,
            CONFIG.IWC.ACTION.DATA,
            data[0]
          );
          if (util.validateIntent(intent)) {
            //console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g, "") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
            //console.log(intent);

            this._iwc.publish(intent);
          }
        } else if (data.length > 1) {
          intent = this.encapsulateMessage(
            receiver,
            CONFIG.IWC.FLAG.PUBLISH_LOCAL,
            CONFIG.IWC.ACTION.DATA_ARRAY,
            data
          );
          if (util.validateIntent(intent)) {
            //console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g, "") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
            //console.log(intent);

            this._iwc.publish(intent);
          }
        }
      }
    }
    //sendBufferTimer.resume();
  }

  /**
   * Callback for received local messages
   * @param {object} intent Message content in Android Intent-like format required by the iwc client
   */
  onIntentReceivedCallback(_self, intent) {
    //some CAE widgets still use the old iwc.js library
    //then it happens that intent are not parsed and processes correctly by the new iwc and then
    //the complete message as string is returned
    //this workaround should help for now to make it work with syncmeta
    if (typeof intent === "string") {
      try {
        intent = JSON.parse(intent);
        if (intent.hasOwnProperty("OpenApplicationEvent")) {
          intent = intent["OpenApplicationEvent"];
          if (intent.hasOwnProperty("message")) intent = intent.message;
        }
      } catch (e) {
        return;
      }
    }

    if (
      !intent.hasOwnProperty("extras") ||
      !intent.extras.hasOwnProperty("payload")
    ) {
      return;
    }

    var payload = intent.extras.payload,
      senderTime = intent.extras.time,
      senderTimes = _self._times[intent.sender];

    var i, numOfSenderTimes, numOfMessages;

    function handleMessage(payload) {
      var type, data, sender, operation, resOperation, i, numOfCallbacks;

      if (
        !payload ||
        !payload.hasOwnProperty("type") ||
        !payload.hasOwnProperty("data")
      ) {
        return;
      }
      type = payload.type;
      data = payload.data;
      sender = payload.sender;
      switch (type) {
        case PAYLOAD_DATA_TYPE.OT_OPERATION:
          operation = new OTOperation(
            data.name,
            data.value,
            data.type,
            data.position
          );
          operation.setSender(sender);
          resOperation =
            OperationFactory$1.createOperationFromOTOperation(operation);
          //adjustHistory(remoteOp);
          for (
            i = 0, numOfCallbacks = _self._onDataReceivedCallbacks.length;
            i < numOfCallbacks;
            i++
          ) {
            if (typeof _self._onDataReceivedCallbacks[i] === "function") {
              var caller = _self._onDataReceivedCallers[i] || _self;
              _self._onDataReceivedCallbacks[i].call(caller, resOperation);
            }
          }
          break;
        case PAYLOAD_DATA_TYPE.NON_OT_OPERATION:
          operation = new NonOTOperation(data.type, data.data);
          operation.setSender(sender);
          resOperation =
            OperationFactory$1.createOperationFromNonOTOperation(operation);
          //adjustHistory(remoteOp);
          for (
            i = 0, numOfCallbacks = _self._onDataReceivedCallbacks.length;
            i < numOfCallbacks;
            i++
          ) {
            if (typeof _self._onDataReceivedCallbacks[i] === "function") {
              var caller = _self._onDataReceivedCallers[i] || _self;
              _self._onDataReceivedCallbacks[i].call(caller, resOperation);
            }
          }
          break;
      }
    }

    if (intent.flags.indexOf(CONFIG.IWC.FLAG.PUBLISH_GLOBAL) !== -1) return;

    if (typeof senderTimes === "undefined") {
      senderTimes = _self._times[intent.sender] = [];
    } else {
      for (
        i = 0, numOfSenderTimes = senderTimes.length;
        i < numOfSenderTimes;
        i++
      ) {
        if (senderTime === senderTimes[i]) {
          return;
        }
      }
    }

    senderTimes.push(senderTime);

    //console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT RECEIVED AT COMPONENT " + componentName + " ===");
    //console.log(intent);

    switch (intent.action) {
      case CONFIG.IWC.ACTION.DATA:
        handleMessage(payload);
        break;
      case CONFIG.IWC.ACTION.DATA_ARRAY:
        for (i = 0, numOfMessages = payload.length; i < numOfMessages; i++) {
          handleMessage(payload[i]);
        }
        break;
    }
  }

  constructor(componentName, y) {
    this.componentName = componentName;
    this._iwc = new Client(componentName, "*", null, y);
    window._iwc_instance_ = this._iwc;

    //var sendBufferTimer;
    //if(BUFFER_ENABLED) sendBufferTimer = new IWCWrapper.PausableInterval(sendBufferedMessages, INTERVAL_SEND);
    if (this.BUFFER_ENABLED)
      setInterval(this.sendBufferedMessages, this.INTERVAL_SEND);

    this.connect = () =>
      this._iwc.connect((intent) =>
        this.onIntentReceivedCallback(this, intent)
      );
    this.disconnect = () => this._iwc.disconnect;

    /**
     * Send data locally to an other component
     * @memberof IWCWrapper#
     * @param {string} receiver Component name of receiving component, empty string for broadcast
     * @param {object} data Data to send
     */
    this.sendLocalMessage = function (receiver, data) {
      var intent;

      if (!receiver || receiver === "") return;

      if (this.BUFFER_ENABLED) {
        //sendBufferTimer.pause();
        if (this._messageBuffer.hasOwnProperty(receiver)) {
          this._messageBuffer[receiver].push(data);
        } else {
          this._messageBuffer[receiver] = [data];
        }
        //sendBufferTimer.resume();
      } else {
        intent = this.encapsulateMessage(
          receiver,
          CONFIG.IWC.FLAG.PUBLISH_LOCAL,
          CONFIG.IWC.ACTION.DATA,
          data
        );
        if (util.validateIntent(intent)) {
          //console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
          //console.log(intent);

          this._iwc.publish(intent);
        }
      }
    };
    /**
     * Send OTOperation locally to an other component
     * @memberof IWCWrapper#
     * @param {string} receiver Component name of receiving component, empty string for broadcast
     * @param {operations.ot.OTOperation} operation Operation to send
     */
    this.sendLocalOTOperation = function (receiver, operation) {
      this.sendLocalMessage(receiver, {
        type: PAYLOAD_DATA_TYPE.OT_OPERATION,
        data: operation.getOperationObject(),
        sender: operation.getSender(),
      });
    };
    /**
     * Send NonOTOperation locally to an other component
     * @memberof IWCWrapper#
     * @param {string} receiver Component name of receiving component, empty string for broadcast
     * @param {operations.non_ot.NonOTOperation} operation Operation to send
     */
    this.sendLocalNonOTOperation = function (receiver, operation) {
      this.sendLocalMessage(receiver, {
        type: PAYLOAD_DATA_TYPE.NON_OT_OPERATION,
        data: operation.getOperationObject(),
        sender: operation.getSender(),
      });
    };
    this.getUserColor = function (jabberId) {
      return Util.getColor(this.Space.members[jabberId].globalId);
    };
    /**
     * Register callback for local data receive events
     * @memberof IWCWrapper#
     * @param {function} callback
     */
    this.registerOnDataReceivedCallback = function (callback, caller) {
      if (typeof callback === "function") {
        this.unregisterOnDataReceivedCallback(callback);
        this._onDataReceivedCallbacks.push(callback);
        this._onDataReceivedCallers.push(caller);
      }
    };
    /**
     * Unregister callback for local data receive events
     * @memberof IWCWrapper#
     * @param {function} callback
     */
    this.unregisterOnDataReceivedCallback = function (callback) {
      var i, numOfCallbacks;

      if (typeof callback === "function") {
        for (
          i = 0, numOfCallbacks = this._onDataReceivedCallbacks.length;
          i < numOfCallbacks;
          i++
        ) {
          if (callback === this._onDataReceivedCallbacks[i]) {
            this._onDataReceivedCallbacks.splice(i, 1);
            this._onDataReceivedCallers.splice(i, 1);
          }
        }
      }
    };
    this.getUser = function () {
      if (!this.Space) {
        console.error("Space is null");
        this.Space = { user: {} };
      } else if (!this.Space.user) {
        console.error("User in space is null, generating new anonymous user");
        this.Space.user = Util.generateAnonymousUser();
      }
      return this.Space.user;
    };
    this.getMembers = function () {
      return this.Space.members;
    };
    this.getSpaceTitle = function () {
      return this.Space.title;
    };
    this.setSpace = function (s) {
      this.Space = s;
    };

    return this;
  }
}

/**
 * Inter widget communication and OT client module
 * @exports IWCW
 */
class IWCW {
  static instances = {}; //static variable to store instances of IWCWrapper. One for each widget
  constructor() {}
  /**
   * Instance of IWCWrapper
   * @type {IWCWrapper}
   */

  static hasInstance(componentName) {
    return componentName in IWCW.instances;
  }

  /**
   * Get instance of IWCOTWrapper
   * @param {string} componentName Name of component (widget) using the wrapper
   * @returns {IWCWrapper}
   */
  static getInstance(componentName, y) {
    if (!this.hasInstance(componentName)) {
      y = y || window.y;
      if (!y) {
        console.error(
          "y is null, y is the shared y document that should be passed along when calling getInstance, proceed with caution"
        );
      }
      IWCW.instances[componentName] = new IWCWrapper(componentName, y);
      IWCW.instances[componentName].connect();
    }
    return IWCW.instances[componentName];
  }
}

const heatspotHtml = "<div style=\"position:absolute; border-style:solid; border-width:1px;\">\n\t<div class=\"background\" style=\"opacity:0; width: 100%; height: 100%; background-color: white;\">\n\t</div>\n</div>"; // replaced by importmap.plugin.js

class Heatspot {
  constructor(id, x, y, width, height, scaleFactor, color) {
    this.$node = $(heatspotHtml);
    this.originalX = x;
    this.originalY = y;
    this.originalWidth = width;
    this.originalHeight = height;
    this.scaleFactor = scaleFactor;
    this.draw();

    this.$node.addClass(id);

    if (color) {
      this.setColor(color);
    }

    //var that = this;

    // this.interval = setInterval(function(){
    //     that.opacity -= 0.01;
    //     that.$node.css("opacity", that.opacity);
    //     if(that.opacity <= 0){
    //         clearInterval(that.interval)
    //         that.remove();
    //     }
    // }, 1000)
  }
  get$node() {
    return this.$node;
  }
  remove() {
    this.$node.remove();
  }
  moveX(x) {
    this.originalX += x;
    this.draw();
  }
  moveY(y) {
    this.originalY += y;
    this.draw();
  }
  changeWidth(offsetWidth) {
    this.originalWidth += offsetWidth;
    this.draw();
  }
  changeHeight(offsetHeight) {
    this.originalHeight += offsetHeight;
    this.draw();
  }
  setScaleFactor(scaleFactor) {
    this.scaleFactor = scaleFactor;
    this.draw();
  }
  draw() {
    this.$node.css({
      top: this.originalY * this.scaleFactor,
      left: this.originalX * this.scaleFactor,
      width: this.originalWidth * this.scaleFactor,
      height: this.originalHeight * this.scaleFactor,
    });
  }
  setColor(color) {
    this.$node.find(".background").css({
      opacity: 1,
      "background-color": color,
    });
  }
  resetColor() {
    this.$node.find(".background").css({
      opacity: 0.5,
      "background-color": "white",
    });
  }
}

async function WaitForCanvas(
  widgetName,
  doc,
  maxAttempts = 10,
  interval = 3000
) {
  const iwc = IWCW.getInstance(widgetName, doc);
  var gotResponseFromCanvas = false;
  var canvasResponse = null;

  iwc.registerOnDataReceivedCallback((operation) => {
    // wait for canvas to respond
    if (operation.hasOwnProperty("getType")) {
      if (operation.getType() === "WaitForCanvasOperation") {
        gotResponseFromCanvas = true;
        canvasResponse = operation.getData();
      }
    }
  });
  try {
    await poll({
      interval,
      maxAttempts,
      validate: () => gotResponseFromCanvas, // we are done when we get a response from canvas
      action: () => {
        // send a message to canvas
        const operation = new NonOTOperation(
          "WaitForCanvasOperation",
          JSON.stringify({ widget: widgetName })
        );
        iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation);
      },
    });

    return canvasResponse;
  } catch (error) {
    throw error;
  }
}

async function poll({ action, validate, interval, maxAttempts }) {
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    const result = await action();
    attempts++;
    if (validate(result)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error("Exceeded max attempts"));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
}

let HeatMapWidget = class HeatMapWidget extends SyncMetaWidget(LitElement, CONFIG.WIDGET.NAME.HEATMAP) {
    async firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        try {
            const y = await yjsSync();
            console.info("HEATMAP: Yjs successfully initialized in room " +
                window.spaceTitle +
                " with y-user-id: " +
                y.clientID);
            var model = y.getMap("data").get("model");
            var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.HEATMAP, y);
            const user = await WaitForCanvas(CONFIG.WIDGET.NAME.HEATMAP, y, 7);
            iwc.setSpace(user);
            var $heatmap = $("#heatmap");
            var scaleFactor = $heatmap.width() / 9000;
            var $window = $("<div id='viewpoint' style='position:absolute; z-index:10000; width:50px; height:50px; border-style:groove; border-width: 1px;'></div>");
            $window.hide();
            $heatmap.append($window);
            var previewNodes = {};
            const userMap = y.getMap("users");
            var localUserId = userMap.get(y.clientID);
            var minLeft = 4500;
            var minTop = 4500;
            var maxBottom = 5000;
            var maxRight = 5000;
            var addNodePreview = function (id, x, y, width, height, color) {
                var nodePreview = new Heatspot(id, x, y, width, height, scaleFactor, color);
                previewNodes[id] = nodePreview;
                $heatmap.append(nodePreview.get$node());
                return nodePreview;
            };
            var operationCallback = function (operation) {
                var id, node, senderJabberId;
                if (operation instanceof NodeAddOperation) {
                    senderJabberId = operation.getJabberId();
                    var color = null;
                    const userList = y.getMap("userList");
                    color = Util.getColor(userList.get(senderJabberId).globalId);
                    node = addNodePreview(operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), color);
                    updateBoundingBox(node);
                    updateZoom();
                }
                else if (operation instanceof NodeMoveOperation) {
                    id = operation.getEntityId();
                    if (previewNodes.hasOwnProperty(id)) {
                        node = previewNodes[id];
                        node.moveX(operation.getOffsetX());
                        node.moveY(operation.getOffsetY());
                        senderJabberId = operation.getJabberId();
                        updateColor(node, senderJabberId);
                        updateBoundingBox(node);
                        updateZoom();
                    }
                }
                else if (operation instanceof NodeResizeOperation) {
                    id = operation.getEntityId();
                    if (previewNodes.hasOwnProperty(id)) {
                        node = previewNodes[id];
                        node.changeWidth(operation.getOffsetX());
                        node.changeHeight(operation.getOffsetY());
                        senderJabberId = operation.getJabberId();
                        updateColor(node, senderJabberId);
                        updateBoundingBox(node);
                        updateZoom();
                    }
                }
                else if (operation instanceof NodeDeleteOperation) {
                    id = operation.getEntityId();
                    if (previewNodes.hasOwnProperty(id)) {
                        node = previewNodes[id];
                        node.remove();
                        delete previewNodes[id];
                    }
                }
                else if (operation instanceof CanvasViewChangeOperation) {
                    updateWindow(operation);
                }
            };
            var registerCallbacks = function () {
                iwc.registerOnDataReceivedCallback(operationCallback);
            };
            var updateWindow = function (viewChangeOperation) {
                var top = viewChangeOperation.getTop();
                var left = viewChangeOperation.getLeft();
                var width = viewChangeOperation.getWidth();
                var height = viewChangeOperation.getHeight();
                var zoom = viewChangeOperation.getZoom();
                $window.css({
                    top: (-top * scaleFactor) / zoom,
                    left: (-left * scaleFactor) / zoom,
                    width: (width * scaleFactor) / zoom,
                    height: (height * scaleFactor) / zoom,
                });
                $window.show();
            };
            var updateColor = function (node, userId) {
                if (userId == localUserId) {
                    node.resetColor();
                }
                else {
                    const userList = y.getMap("userList");
                    node.setColor(Util.getColor(userList.get(userId).globalId));
                }
            };
            var updateZoom = function () {
                var width = maxRight - minLeft;
                var height = maxBottom - minTop;
                var bigger = width > height ? width : height;
                var centerX = minLeft + width / 2;
                var centerY = minTop + height / 2;
                var originX = (centerX / 9000) * 100;
                var originY = (centerY / 9000) * 100;
                var translateX = -(centerX - 4500) * scaleFactor;
                var translateY = -(centerY - 4500) * scaleFactor;
                var zoom = (9000 / bigger) * 0.9;
                $heatmap.css({
                    "transform-origin": originX + "%" + " " + originY + "%",
                    transform: "translate(" +
                        translateX +
                        "px, " +
                        translateY +
                        "px) scale(" +
                        zoom +
                        ")",
                });
            };
            var updateBoundingBox = function (node) {
                if (node.originalX < minLeft)
                    minLeft = node.originalX;
                if (node.originalY < minTop)
                    minTop = node.originalY;
                if (node.originalX + node.originalWidth > maxRight)
                    maxRight = node.originalX + node.originalWidth;
                if (node.originalY + node.originalHeight > maxBottom)
                    maxBottom = node.originalY + node.originalHeight;
            };
            registerCallbacks();
            for (var nodeId in model.nodes) {
                if (model.nodes.hasOwnProperty(nodeId)) {
                    var node = model.nodes[nodeId];
                    var nodePreview = addNodePreview(nodeId, node.left, node.top, node.width, node.height, scaleFactor);
                    updateColor(nodePreview, localUserId);
                    updateBoundingBox(nodePreview);
                }
            }
            updateZoom();
        }
        catch (error) {
            console.error(error);
        }
    }
    render() {
        return html `
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/bootstrap.min.prefixed.css"
      />
      <!-- <link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/font-awesome/css/font-awesome.min.css"> -->
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"
      />
      <div
        id="heatmap"
        style="background-color: #f5f5f5; width: 100%;height: 100%;"
      >
        <div></div>
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
HeatMapWidget = __decorate([
    e(getWidgetTagName(CONFIG.WIDGET.NAME.HEATMAP))
], HeatMapWidget);

export { HeatMapWidget };
//# sourceMappingURL=heatmap.widget.js.map
