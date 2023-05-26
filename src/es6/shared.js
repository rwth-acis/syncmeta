
  var tryCounter = 0;
  var createReloadHandler = function () {
    var iwcClient = window._iwc_instance_;
    var intent_listener = [];
    if (iwcClient && iwcClient.onIntent != null) {
      var previous_iwc_onIntent = iwcClient.onIntent;
      iwcClient.onIntent = function (message) {
        if (message.action === "RELOAD") {
          window.location.reload();
        } else {
          for (var i = 0; i < intent_listener.length; i++) {
            intent_listener[i].apply(this, arguments);
          }
        }
        previous_iwc_onIntent.apply(this, arguments);
      };
      window._addIwcIntentListener = function (f) {
        intent_listener.push(f);
      };
      window._reloadPage = function () {
        var message = {
          action: "RELOAD",
          component: "",
          data: "",
          dataType: "",
          flags: ["PUBLISH_GLOBAL"],
          extras: {
            reload: true,
          },
          sender: "syncmeta",
        };
        iwcClient.publishGlobal(message);
      };
    } else {
      setTimeout(createReloadHandler, 5000);
    }
  };
  setTimeout(createReloadHandler, 10000);

  export function createReloadHandler() {
    var iwcClient = window._iwc_instance_;
    var intent_listener = [];
    if (iwcClient) {
      var previous_iwc_onIntent = iwcClient.onIntent;
      iwcClient.onIntent = function (message) {
        if (message.action === "RELOAD") {
          window.location.reload();
        } else {
          for (var i = 0; i < intent_listener.length; i++) {
            intent_listener[i].apply(this, arguments);
          }
        }
        previous_iwc_onIntent.apply(this, arguments);
      };
      window._addIwcIntentListener = function (f) {
        intent_listener.push(f);
      };
      window._reloadPage = function () {
        var message = {
          action: "RELOAD",
          component: "syncmeta",
          data: "",
          dataType: "",
          flags: ["PUBLISH_GLOBAL"],
          extras: {
            reload: true,
          },
          sender: "syncmeta",
        };
        iwcClient.publishGlobal(message);
      };
    } else {
      setTimeout(createReloadHandler, 5000);
    }
  }
