/**
 * @class
 * 
 * iwc is a framework for local and remote interwidget communication that follows
 * the Publish/Subscribe approach. The sending widget publishs a message which is
 * then received at every other widget in the widget container. If remote interwidget
 * communication is configured the message is sent to a XMPP Publish/Subscribe node
 * that forwards it to remote widget containers that are subscribed to the particular node.
 * <p/>
 * Messages exchanged between widgets follow a definitive structure called an <b>Intent</b>.
 * Read about Intents in the <a href="http://developer.android.com/guide/topics/intents/intents-filters.html">Google Dev Guide</a>
 * <p/>
 * Intent messages (in the following called JSON intent objects) are of the following form:
 * <br/>
 * <b>{</b> <br/>
 * 	<b>component</b>	:	(String) &lt; the component name of the recipient (e.g. http://dbis.rwth-aachen.de/~hocken/da/listener.xml)
 * 							or the empty string to indicate broadcasting &gt;, <br/>
 * 	<b>sender</b>		:	(String) &lt; the component name of the sender (e.g. http://dbis.rwth-aachen.de/~hocken/da/writer.xml).
 * 							A value of the form node@domain.tld/resource?sender=&lt;component name&gt; indicates that the intent
 * 							has been received from a remote environment &gt;, <br/>
 * 	<b>action</b>		:	(String) &lt; the action to be performed by receivers (e.g. "ACTION_INVOKE_SERVICE") &gt;, 
 * 	<b>data</b> 		 	(String) &lt; data in form of an URI (e.g. http://example.org) &gt;, <br/>
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
 */
iwc = function(){
};

//==================================================  definition of iwc.Client ================================================== //

/** 
 * @class
 * 
 * An object of type {@link iwc.Client} handles local interwidget communication.
 * <p/>
 * A client object is instantiated as follows:
 * <ol>
 * 	<li>
 * 		create an object of type {@link iwc.Client}. E.g.var client = new iwc.Client()
 * 	</li>
 * 	<li>
 * 		call {@link iwc.Client#connect} to connect the client to local interwidget communication. Pass a callback function
 * 		that handles received intents. E.g var yourIntentHandler = function(intent){...}; var client = new iwc.Client(yourIntentHandler);
 * 	</li>
 * 	<li>
 * 		publish an intent by means of {@link iwc.Client#publish}. If the intent shall be processed by remote widget containers make
 * 		sure that you set the flag {@link iwc.util.FLAGS}.PUBLISH_GLOBAL in the flag field of the passed intent.
 * 	</li>
 * </ol>
 * 
 * @author Christian Hocken (hocken@dbis.rwth-aachen.de)
 * @author Dominik Renzel (renzel@dbis.rwth-aachen.de)
 * @requires openapp.js
 * @params categories (Array of String) to filter intents of particular types. //TODO
 */
iwc.Client = function(categories) {
	this._componentName = "unknown";
	
	if (typeof window.location !== "undefined" &&
			typeof window.location.search === "string" &&
			typeof window.unescape === "function") {
		var pairs = window.location.search.substring(1).split("&"), pair, query = {};
		if (!(pairs.length == 1 && pairs[0] === "")) {
			for (var p = 0; p < pairs.length; p++) {
				pair = pairs[p].split("=");
				if (pair.length == 2) {
					query[pair[0]] =
						window.unescape(pair[1]);
				}
			}
		}
		if (typeof query.url === "string") {
			this._componentName = query.url;
		}
	};
	
	//private variables
	this._connected = false;	
	this._categories = categories;
	
	//onIntent is called when an intent is received. A JSON intent object is passed to the function
	this.onIntent = function(){};
};

/**
 * connects the client to local interwidget communication
 * @param callback (Function(intent)) is called when a local or remote JSON intent object is received.
 */
iwc.Client.prototype.connect = function(callback) {
	this.onIntent = callback;
	
	//workaround for broken ECMAScript
	var self = this;
	//register callback with 'this' as scope
	gadgets.openapp.connect(function(envelope, message){self.liwcEventHandler(envelope, message);});
	this._connected = true;
};

/**
 * disconnects the client from local interwidget communication
 */
iwc.Client.prototype.disconnect = function() {
	gadgets.openapp.disconnect();
	this._connected = false;
};


/**
 * publishs an intent locally. If the flag {@link iwc.util.FLAGS}.PUBLISH_GLOBAL is set
 * the intent will also be sent to the Publish/Subscribe node if an object of type {@link iwc.Proxy}
 * is present in the widget container
 * @param intent (Object) JSON intent object
 */
iwc.Client.prototype.publish = function(intent) {
	if (intent.sender == null)
		intent.sender = this._componentName;
	if (iwc.util.validateIntent(intent)) {
		var envelope = {"type":"JSON", "event":"publish", "message":intent};
		gadgets.openapp.publish(envelope);
	}
};

/**
 * handler function that handles local interwidget communication.
 * If you do not have good reason, do not overwrite it
 * @param envelope (Object) the OpenApp envelope object
 * @param message (Object) the message wrapped in the envelope object
 */
iwc.Client.prototype.liwcEventHandler = function(envelope, message) {
	//'component' and 'sender' properties must always be available in 'intent' objects
	if (typeof message.component != "undefined" && typeof message.sender != "undefined") {
		if (message.component == this._componentName || message.component == "") {
			//explicit intent
			this.onIntent(message);
		}
	}
};

//==================================================  definition of iwc.util ==================================================//

/**
 * @class 
 * 
 * Class iwc.util provides utility functions used by {@link iwc.Proxy} and {@link iwc.Client}
 * 
 * @author Christian Hocken (hocken@dbis.rwth-aachen.de)
 * @author Dominik Renzel (renzel@dbis.rwth-aachen.de)
 */
iwc.util = function() {
};

/**
 * validates the passed intent
 * @params intent (Object) the JSON intent object to be validated
 * @returns true, if the intent is valid
 */
iwc.util.validateIntent = function(intent) {
	if (typeof intent.component != "string") {
		throw new Error("Intent object must possess property 'component' of type 'String'");
	}
	if (typeof intent.data != "string") {
		throw new Error("Intent object must possess property 'data' of type 'String'");
	}
	if (typeof intent.dataType != "string") {
		throw new Error("Intent object must possess property 'dataType' of type 'String'");
	}
	return true;
};

/**
 * namespaces used in remote interwidget communication
 */
iwc.util.NS = {
		INTENT : "http://dbis.rwth-aachen.de/~hocken/da/xsd/Intent"
};

/**
 * flags that are known to the framework and that are processed if set
 */
iwc.util.FLAGS = {
		PUBLISH_LOCAL : "PUBLISH_LOCAL",
		PUBLISH_GLOBAL : "PUBLISH_GLOBAL"
};

/**
 * actions that are known to the framework and that are processed if set
 */
iwc.util.ACTIONS = {
		INVOKE : "ACTION_INVOKE_SERVICE" //TODO
};
