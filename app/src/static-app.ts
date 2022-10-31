import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { router } from "./router";

import "las2peer-frontend-statusbar/las2peer-frontend-statusbar.js";
import "@polymer/paper-button/paper-button.js";

import { Common } from "./common";
import Static from "./static";
import { IWC } from "../../widgets/src/es6/lib/iwc.js";

// // Syncmeta Widgets
import "../../widgets/build/widgets/partials/main.widget";
import "../../widgets/build/widgets/partials/attribute.widget";
import "../../widgets/build/widgets/partials/debug.widget";
import "../../widgets/build/widgets/partials/palette.widget";
import "../../widgets/build/widgets/partials/activity.widget";

@customElement("static-app")
class StaticApp extends LitElement {
  constructor() {
    super();
  }

  @property({ type: Object }) location = router.location;

  private _page: string = "meta-modeling-space";

  iwcClient: IWC.Client;

  @property({ type: String })
  prop1: string = "static-app";

  // workaround for implementing observer behavior from polymer, see https://www.thisdot.co/blog/how-to-observe-property-changes-with-litelement-and-typescript
  @property({ type: String }) set page(newPage: string) {
    const oldPage = this._page;
    if (newPage && oldPage !== newPage) {
      this.requestUpdate("page", oldPage);
      this._pageChanged(newPage, oldPage);
    }
  }

  get page() {
    return this._page;
  }

  render() {
    return html`
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

      <ul>
        <li><a href="/meta-modeling-space">Meta Modeling</a></li>
        <li><a href="/modeling-space">Modeling</a></li>
      </ul>
      <p id="outlet">${this.page}</p>
      <div class="maincontainer">
        <div class="innercontainer">
          <main-widget></main-widget>
        </div>
        <div class="innercontainer">
          <attribute-widget></attribute-widget>
          <debug-widget></debug-widget>
        </div>
        <div class="innercontainer">
          <palette-widget> </palette-widget>
        </div>
        <div class="innercontainer">
          <activity-widget></activity-widget>
        </div>
      </div>
    `;
  }
  static styles = css`
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
  `;

  _routerChanged(page: string) {
    this.page = page || "meta-modeling-space";
  }

  /**
   * Called when the page property changes.
   */
  _pageChanged(currentPage: string, oldPage: string) {
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

  connectedCallback() {
    super.connectedCallback();
    window.Y = Y;
    window.WebsocketProvider = WebsocketProvider;
  }

  firstUpdated() {
    parent.caeFrames = this.shadowRoot.querySelectorAll("iframe");
    const statusBar = this.shadowRoot.querySelector("#statusBar");
    statusBar.addEventListener("signed-in", this.handleLogin);
    statusBar.addEventListener("signed-out", this.handleLogout);
    this.iwcClient = new IWC.Client(null, null, null);
    this.displayCurrentRoomName();
  }

  _onChangeButtonClicked() {
    var roomName = this.shadowRoot.getElementById("roomNameInput").nodeValue;
    Common.setYjsRoomName(roomName);
    this.changeVisibility("#roomEnterLoader", true);
    location.reload();
  }

  _onGenerateMetamodelClicked() {
    this.publishUpdateMetamodelOperation();
    this.changeVisibility("#generateModelLoader", true);

    this.initY((y: Y.Doc) => {
      const metaModelStatus = y.getMap("metaModelStatus");
      metaModelStatus.observe((event: Y.YMapEvent<any>) => {
        let message;
        if (event.keysChanged.has("uploaded"))
          if (metaModelStatus.get("uploaded") === true) {
            message =
              "Metamodel is generated and uploaded to modeling space successfully!";
          } else {
            message = "Error while uploading metamodel";
          }
        this.changeVisibility("#generateModelLoader", false);
        this.changeVisibility("#generateModelMessage", true);
        this.shadowRoot.querySelector("#generateModelMessage").innerHTML =
          message;
        setTimeout(
          () => this.changeVisibility("#generateModelMessage", false),
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

  /**
   * Initialize Yjs and connect to the Yjs room.
   * @param callback callback function that is called when the connection is established. returns the shared document
   * @returns
   */
  initY(callback: (doc: Y.Doc) => void) {
    if (parent.syncmetaRoom) {
      const doc = new Y.Doc();
      const provider = new WebsocketProvider(
        "{YJS_ADDRESS}",
        parent.syncmetaRoom,
        doc
      );
      callback(doc);
    }
  }

  reloadFrames() {
    if (parent.caeFrames) {
      parent.caeFrames.forEach((f) => f.contentWindow.location.reload());
    }
  }

  handleLogin(event: any) {
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

  changeVisibility(htmlQuery: string, show: boolean) {
    var item = this.shadowRoot.querySelector(htmlQuery) as HTMLElement;
    if (show) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  }
}
