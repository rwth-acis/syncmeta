import { getWidgetTagName } from "../config";
/**
 * @class
 *
 * iwc is a framework for local and remote interwidget by direct messaging (pub/sub approach might be added back soon).
 * The sending widget publishes a message which is then received at every other widget in the widget container. If the receiving widget
 * matches a specified receiver, it processes the message (TODO: add broadcasting).
 * If remote interwidget communication is configured the message is processed by <a href="http://y-js.org">Y-js</a> and all widgets of
 * the same yjs room can be adressed.
 * <p/>
 * Messages exchanged between widgets follow a definitive structure called an <b>Intent</b>.
 * Read about Intents in the <a href="http://developer.android.com/guide/topics/intents/intents-filters.html">Google Dev Guide</a>
 * <p/>
 * Intent messages (in the following called JSON intent objects) are of the following form:
 * <br/>
 * <b>{</b> <br/>
 * 	<b>component</b>	:	(String) &lt; The name of the desired receiving widget. In the demo this is the widget's title &gt;, <br/>
 * 	<b>sender</b>		:	(String) &lt; The name of the sending widget. In the demo this is the widget's title &gt;, <br/>
 * 	<b>action</b>		:	(String) &lt; the action to be performed by receivers (e.g. "ACTION_INVOKE_SERVICE") &gt;,
 * 	<b>data</b> 		 	(String) &lt; data, currently just strings &gt;, <br/>
 * 	<b>dataType</b>	:		(String) &lt; the data type in MIME notation (e.g. text/html) &gt;, <br/>
 * 	<b>categories</b>	:	(Array) &lt; categories of widgets that shall process the intent (e.g. ["editor","proxy" ]) &gt;, <br/>
 * 	<b>flags</b>		:	(Array) &lt; flags that control how the intent is processed (e.g. ["PUBLISH_GLOBAL"]) &gt;, <br/>
 * 	<b>extras</b>		:	(Object) &lt; auxiliary data that need not to be specified. (e.g. key value pairs: {"examplekey":"examplevalue"}) &gt; <br/>
 * <b>}</b> <br/>
 * <p/>
 * The framework is divided into three classes.
 * <ol>
 *	<li><b>iwc.Proxy</b> is responsible for remote transport of interwidget communication intents</li>
 * 	<li><b>{@link iwc.Client}</b> is responsible for client-side interaction with interwidget communication</li>
 * 	<li><b>{@link iwc.util}</b> provides utility functions used by {@link iwc.Client} and iwc.Proxy</li>
 * </ol>
 * This part of the library only includes iwc.Client and iwc.util. The iwc.Proxy part is integrated with the ROLE Reference Implementation.
 *
 * @author Christian Hocken (hocken@dbis.rwth-aachen.de)
 * @author Dominik Renzel (renzel@dbis.rwth-aachen.de)
 * @author Jonas K├Ânning (koenning@dbis.rwth-aachen.de)
 */



/**
 * Provides messaging functionality.
 * @param {Array} categories - (currently not implemented) categories of widgets that shall process the intent (e.g. ["editor","proxy" ])
 * @param {String} origin - The origin (i.e. the url where your application script lives) is needed for messaging
 * @param {} y - A reference to yjs' Y object for global messaging
 */
export class Client {
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
    this._connected = true;
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

export class Intent {
  sender;
  receiver;
  data;
  dataType = "text/xml";
  action;
  categories = ["", ""];
  extras = {};
  flags;
  constructor(sender, receiver, action, data, global) {
    this.sender = sender;
    this.receiver = receiver;
    this.data = data;
    this.action = action;
    this.flags = [global ? "PUBLISH_GLOBAL" : "PUBLISH_LOCAL"];
  }
}

//======================= IWC.util ==============================

export class util {
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
        "Intent object must possess property 'sender' of type 'String'"
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

// export function validateIntent(intent) {
//   if (typeof intent.sender != "string") {
//     throw new Error(
//       "Intent object must possess property 'component' of type 'String'"
//     );
//   }
//   if (typeof intent.data != "string") {
//     throw new Error(
//       "Intent object must possess property 'data' of type 'String'"
//     );
//   }
//   if (typeof intent.dataType != "string") {
//     throw new Error(
//       "Intent object must possess property 'dataType' of type 'String'"
//     );
//   }
//   return true;
// }
// /**
//  * Used to determine whether global or local messaging should be used.
//  * Local messaging uses HTML5 messaging, global messaging uses yjs.
//  */
// export const FLAGS = {
//   PUBLISH_LOCAL: "PUBLISH_LOCAL",
//   PUBLISH_GLOBAL: "PUBLISH_GLOBAL",
// };

export default { Client, util };
