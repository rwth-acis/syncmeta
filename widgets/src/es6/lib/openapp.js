export class OpenAppProvider {
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
