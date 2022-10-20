/*
 * Copyright (c) 2015 Advanced Community Information Systems (ACIS) Group, Chair
 * of Computer Science 5 (Databases & Information Systems), RWTH Aachen
 * University, Germany All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name of the ACIS Group nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
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
 * @author Jonas Könning (koenning@dbis.rwth-aachen.de)
 */
define(function (window) {
	'use strict';
	function define_IWC() {
		var IWC = {};
		
		IWC.Intent = function (sender, receiver, action, data, global) {
			this.sender = sender;
			this.receiver = receiver;
			this.data = data;
			this.dataType = "text/xml";
			this.action = action;
			this.categories = ["", ""];
			this.flags = [global ? "PUBLISH_GLOBAL" : "PUBLISH_LOCAL"];
			this.extras = {};
		};

		/**
		 * Provides messaging functionality.
		 * @param {Array} categories - (currently not implemented) categories of widgets that shall process the intent (e.g. ["editor","proxy" ])
		 * @param {String} origin - The origin (i.e. the url where your application script lives) is needed for messaging
		 * @param {Y} y - A reference to yjs' Y object for global messaging
		 */
		IWC.Client = function (categories, origin, y) {

			//console.log(y);
			this._y = y;
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
			}

			//private variables
			this._connected = false;
			this._categories = categories;
			this._callback = null;

			// Needed for HTML5 messaging
			this._origin = origin;
		};

		/**
		 * Connect widget to messaging. This sets up the callback function and creates
		 * an event listener for HTML5 messaging and a yjs observer for global messaging.
		 * If yjs is not available only local messaging is set up.
		 * @param {function} callback - The callback function used for receiving messages.
		 */
		IWC.Client.prototype.connect = function (callback) {
			this._callback = callback;
			var handler = receiveMessage.bind(this);
			window.addEventListener('message', handler, false);

			if (!(this._y === null || this._y === undefined )) {
				// If yjs is available also connect a global listener
				if (this._y.share.intents !== undefined)
					this._y.share.intents.observe(handler);
			}
		};

		/**
		 * Disconnect the widget from messaging. This removes the event listener
		 * and the callback for both local and global messaging. If yjs is not available,
		 * only local messaging will be available.
		 */
		IWC.Client.prototype.disconnect = function () {
			window.removeEventListener('message', receiveMessage, false);
			this._callback = null;

			if (!(this._y === null || this._y === undefined)) {
				this._y.share.intents.unobserve(receiveMessage);
			}
		};

		/**
		 * Publishes an intent, 
		 * @param {intent} - The intent about to be published, this object contains all information.
		 */
		IWC.Client.prototype.publish = function (intent) {
			if (IWC.util.validateIntent(intent)) {
				if (intent.flags[0] === IWC.util.FLAGS.PUBLISH_GLOBAL) {
					publishGlobal(intent, this._y);
				} else if (intent.flags[0] === IWC.util.FLAGS.PUBLISH_LOCAL) {
					publishLocal(intent, this._origin);
				}
			}
		};

		var publishLocal = function (intent, origin) {
			//Find iframe and post message
			var caeFrames = parent.caeFrames;
			if (caeFrames) {
				caeFrames.forEach(function(currVal, currIndex, listObj) {
					if (currVal.contentWindow.frameElement.id === intent.receiver) {
						currVal.contentWindow.postMessage(intent, origin);
					}
				});
			} else {
				var frames = $(".widget", parent.document).find("iframe");
				frames.each(function () {
					if ($('.widget-title-bar', this.offsetParent).find('span').text() === intent.receiver) {
						this.contentWindow.postMessage(intent, origin);
					}
				});
			}
		};

		var publishGlobal = function (intent, y) {
			//y.share.intents.push(intent);
			y.share.intents.set(intent.receiver, intent);
		};

		/**
		 * Unpack events and pre process them. This unwraps HTML5 messages and manages the yjs map
		 * used for global messaging.
		 * @param {Event} event - The event that activated the callback
		 */
		var receiveMessage = function (event) {
			// Local messaging events
			if (event.type === "message") {
				//Unpack message events
				if (event instanceof MessageEvent) {
					this._callback(event.data);
				}
			} else if (event.type === "add" || event.type == "update") {
				//Unpack yjs event and remove from map
				var intent = event.object.get(event.name);
				event.object.delete(event.name);
				console.log(intent);
				this._callback(intent);
			}
		};

		//======================= IWC.util ==============================
		IWC.util = function () {
		};

		/**
		 * Used to determine whether global or local messaging should be used.
		 * Local messaging uses HTML5 messaging, global messaging uses yjs.
		 */
		IWC.util.FLAGS = {
			PUBLISH_LOCAL: "PUBLISH_LOCAL",
			PUBLISH_GLOBAL: "PUBLISH_GLOBAL"
		};

		/**
		 * Check intent for correctness.
		 */
		IWC.util.validateIntent = function (intent) {
			if (typeof intent.sender != "string") {
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
		 * Contains the title of the widget
		 */
		if (frameElement) {
			IWC.util.Self = $('.widget-title-bar', frameElement.offsetParent).find('span').text();
		}

		return IWC;
	}

	//define globally if it doesn't already exist
	if (typeof (IWC) === 'undefined') {
		window.IWC = define_IWC();
	}
	else {
		console.log("IWC already defined.");
	}
})(window);