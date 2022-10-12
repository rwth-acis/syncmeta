import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'las2peer-frontend-statusbar/las2peer-frontend-statusbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-button/paper-button.js';
import Common from './common.js';
import Static from './static.js';
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

/**
 * @customElement
 * @polymer
 */
class StaticApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        paper-input {
          max-width: 300px;
        }
        paper-button {
          color: rgb(240, 248, 255);
          background: rgb(30, 144, 255);
          max-height: 30px;
        }
        paper-button:hover {
          color: rgb(240, 248, 255);
          background: rgb(65, 105, 225);
        }
        #yjsroomcontainer,
        #generateModelContainer {
          display: flex;
          margin: 5px;
          flex: 1;
          align-items: center;
        }
        .loader {
          border: 5px solid #f3f3f3; /* Light grey */
          border-top: 5px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 2s linear infinite;
          display: none;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        iframe {
          width: 100%;
          height: 100%;
        }
        .maincontainer {
          display: flex;
          height: 600px;
          flex-flow: row wrap;
        }
        .innercontainer {
          padding: 5px;
          margin: 5px;
          flex: 1;
        }
        .innercontainer:nth-of-type(1) {
          flex: 4;
          display: flex;
          flex-flow: column;
        }

        .innercontainer:nth-of-type(2) {
          flex: 2;
          display: flex;
          flex-flow: column;
        }
      </style>

      <las2peer-frontend-statusbar
        id="statusBar"
        service="Syncmeta"
        oidcpopupsigninurl="/callbacks/popup-signin-callback.html"
        oidcpopupsignouturl="/callbacks/popup-signout-callback.html"
        oidcsilentsigninturl="/callbacks/silent-callback.html"
        oidcclientid="{OIDC_CLIENT_ID}"
        autoAppendWidget="true"
      ></las2peer-frontend-statusbar>

      <p id="currentRoom">Current Space: Test</p>
      <div id="yjsroomcontainer">
        <paper-input
          always-float-label
          label="Space"
          id="roomNameInput"
        ></paper-input>
        <paper-button on-click="_onChangeButtonClicked">Enter</paper-button>
        <div class="loader" id="roomEnterLoader"></div>
      </div>

      <div id="generateModelContainer">
        <paper-button
          id="generateModelButton"
          on-click="_onGenerateMetamodelClicked"
          >Generate Metamodel</paper-button
        >
        <div class="loader" id="generateModelLoader"></div>
        <p id="generateModelMessage"></p>
      </div>

      <app-location route="{{route}}"></app-location>
      <app-route
        route="{{route}}"
        pattern="/:page"
        data="{{routeData}}"
        tail="{{subroute}}"
      ></app-route>
      <ul>
        <li><a href="/meta-modeling-space">Meta Modeling</a></li>
        <li><a href="/modeling-space">Modeling</a></li>
      </ul>
      <p>[[page]]</p>
      <div class="maincontainer">
        <div class="innercontainer">
          <iframe id="Canvas" src="{WEBHOST}/widgets/widget.html"> </iframe>
        </div>
        <div class="innercontainer">
          <iframe id="Property Browser" src="{WEBHOST}/widgets/attribute.html">
          </iframe>
          <iframe id="Import Tool" src="{WEBHOST}/widgets/debug.html"> </iframe>
        </div>
        <div class="innercontainer">
          <iframe id="Palette" src="{WEBHOST}/widgets/palette.html"> </iframe>
        </div>
        <div class="innercontainer">
          <iframe id="User Activity" src="{WEBHOST}/widgets/activity.html">
          </iframe>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      prop1: {
        type: String,
        value: "static-app",
      },
      page: {
        type: String,
        value: "meta-modeling-space",
        observer: "_pageChanged",
      },
    };
  }

  static get observers() {
    return ["_routerChanged(routeData.page)"];
  }

  _routerChanged(page) {
    this.page = page || "meta-modeling-space";
  }

  /* this pagechanged triggers for simple onserver written in page properties written above */
  _pageChanged(currentPage, oldPage) {
    switch (currentPage) {
      case "meta-modeling-space":
        Common.setSpace(Static.MetaModelingSpaceId);
        this.changeVisibility("#generateModelButton", true);
        this.reloadFrames();
        break;
      case "modeling-space":
        this.changeVisibility("#generateModelButton", false);
        Common.setSpace(Static.ModelingSpaceId);
        this.reloadFrames();
        break;
      default:
        this.page = "meta-modeling-space";
    }
  }

  ready() {
    super.ready();
    window.Y = Y;
    window.WebsocketProvider = WebsocketProvider;
    parent.caeFrames = this.shadowRoot.querySelectorAll("iframe");
    const statusBar = this.shadowRoot.querySelector("#statusBar");
    statusBar.addEventListener("signed-in", this.handleLogin);
    statusBar.addEventListener("signed-out", this.handleLogout);
    this.displayCurrentRoomName();
    this.iwcClient = new IWC.Client(null, null, null);
  }

  _onChangeButtonClicked() {
    var roomName = this.shadowRoot.querySelector("#roomNameInput").value;
    Common.setYjsRoomName(roomName);
    this.changeVisibility("#roomEnterLoader", true);
    location.reload();
  }

  _onGenerateMetamodelClicked() {
    this.publishUpdateMetamodelOperation();
    this.changeVisibility("#generateModelLoader", true);
    this.initY((y) => {
      const metaModelStatus = y.getMap("metaModelStatus");
      metaModelStatus.observe((event) => {
        var message;
        if (event.name == "uploaded") {
          message =
            "Metamodel is generated and uploaded to modeling space successfully!";
        } else if (event.name == "error") {
          message = "Error while uploading metamodel";
        }
        this.changeVisibility("#generateModelLoader", false);
        this.changeVisibility("#generateModelMessage", true);
        this.shadowRoot.querySelector("#generateModelMessage").innerHTML =
          message;
        setTimeout(
          (_) => this.changeVisibility("#generateModelMessage", false),
          8000
        );
      });
    });
  }

  publishUpdateMetamodelOperation() {
    var time = new Date().getTime();
    var data = JSON.stringify({
      metamodelingRoomName: parent.syncmetaRoom,
      modelingRoomName: Common.createYjsRoomNameWithSpace(
        Static.ModelingSpaceId
      ),
    });
    var intent = new IWC.Intent(
      "Syncmeta_App",
      "Canvas",
      "ACTION_DATA",
      data,
      false
    );
    intent.extras = {
      payload: {
        data: { data: data, type: "UpdateMetamodelOperation" },
        sender: null,
        type: "NonOTOperation",
      },
      time: time,
    };
    this.iwcClient.publish(intent);
  }

  initY(callback) {
    if (parent.syncmetaRoom) {
      Y({
        db: {
          name: "memory", // store the shared data in memory
        },
        connector: {
          name: "websockets-client", // use the websockets connector
          room: parent.syncmetaRoom,
          options: { resource: "{YJS_RESOURCE_PATH}" },
          url: "{YJS_ADDRESS}",
        },
        share: {
          // specify the shared content
          metamodelStatus: "Map",
        },
        type: ["Text", "Map"],
        sourceDir: "/node_modules",
      }).then(callback);
    }
  }

  reloadFrames() {
    if (parent.caeFrames) {
      parent.caeFrames.forEach((f) => f.contentWindow.location.reload());
    }
  }

  handleLogin(event) {
    var cached_access_token = localStorage.getItem("access_token");
    localStorage.setItem(
      "userinfo_endpoint",
      "https://auth.las2peer.org/auth/realms/main/protocol/openid-connect/userinfo"
    );
    if (!event.detail.access_token || event.detail.expired === true) {
      alert("Login failed. Please try again.");
    }
    if (event.detail.access_token === cached_access_token) {
      return; // already logged in
    }
    localStorage.setItem("access_token", event.detail.access_token);
    if (parent.caeFrames) {
      parent.caeFrames.forEach((f) => f.contentWindow.location.reload());
    }
  }

  // refreshIframes() {
  //   console.info("refreshing iframes");
  //   const iframes = document.querySelectorAll("iframe");
  //   iframes.forEach((iframe) => {
  //     iframe.contentWindow.location.reload();
  //   });
  // }

  handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userinfo_endpoint");
  }

  displayCurrentRoomName() {
    var spaceHTML = "";
    if (Common.getYjsRoomName()) {
      spaceHTML = `<span style="font-weight: bold;">Current Space:</span> ${Common.getYjsRoomName()}`;
    } else {
      spaceHTML = "Please enter a space!";
    }
    this.shadowRoot.querySelector("#currentRoom").innerHTML = spaceHTML;
  }

  changeVisibility(htmlQuery, show) {
    var item = this.shadowRoot.querySelector(htmlQuery);
    if (show) {
      $(item).show();
    } else {
      $(item).hide();
    }
  }
}

window.customElements.define('static-app', StaticApp);
