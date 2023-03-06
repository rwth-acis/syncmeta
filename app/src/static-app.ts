import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Router } from "@vaadin/router";
import "@polymer/paper-input/paper-input.js";
import "las2peer-frontend-statusbar/las2peer-frontend-statusbar.js";
import "@polymer/paper-button/paper-button.js";

import { Common } from "./common";
import Static from "./static";
import * as IWC from "../../widgets/src/es6/lib/iwc";

import "../../widgets";

const routes = [
  {
    path: "/",
    component: "widget-container",
  },
  {
    path: "/meta-modeling-space",
    component: "widget-container",
  },
  {
    path: "/modeling-space",
    component: "widget-container",
  },
];
@customElement("static-app")
class StaticApp extends LitElement {
  createRenderRoot() {
    return this;
  }
  constructor() {
    super();
  }

  @property({ type: Object }) location = undefined;

  private _page: string = "meta-modeling-space";

  iwcClient: IWC.Client;

  @property({ type: String })
  prop1: string = "static-app";

  // workaround for implementing observer behavior from polymer, see https://www.thisdot.co/blog/how-to-observe-property-changes-with-litelement-and-typescript
  @property({ type: String }) set page(newPage: string) {
    const oldPage = this._page;
    if (newPage && oldPage !== newPage) {
      this._pageChanged(newPage, oldPage);
      this.requestUpdate("page", oldPage);
    }
  }

  get page() {
    return this._page;
  }

  render() {
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
        oidcclientid="localtestclient"
        autoAppendWidget="true"
      ></las2peer-frontend-statusbar>
      <div class="main-container">
        <p id="currentRoom">Current Space: Test</p>
        <div id="yjsroomcontainer">
          <paper-input
            always-float-label
            label="Space"
            id="roomNameInput"
          ></paper-input>
          <paper-button @click="${this._onChangeButtonClicked}"
            >Enter</paper-button
          >
          <div class="loader" id="roomEnterLoader"></div>
        </div>

        <div id="generateModelContainer">
          <paper-button
            id="generateModelButton"
            @click="${this._onGenerateMetamodelClicked}"
            >Generate Metamodel</paper-button
          >
          <div class="loader" id="generateModelLoader"></div>
          <p id="generateModelMessage"></p>
        </div>

        <ul>
          <li><a href="/meta-modeling-space">Meta Modeling</a></li>
          <li><a href="/modeling-space">Modeling</a></li>
        </ul>
        <div id="router-outlet"></div>
      </div>
    `;
  }

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
        location.reload();
        break;
      case "modeling-space":
        this.changeVisibility("#generateModelButton", false);
        Common.setSpace(Static.ModelingSpaceId);
        location.reload();
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
    const statusBar = document.querySelector("#statusBar");
    statusBar.addEventListener("signed-in", this.handleLogin);
    statusBar.addEventListener("signed-out", this.handleLogout);
    this.iwcClient = new IWC.Client(null, null, null);
    this.displayCurrentRoomName();
    if (this.location === undefined) {
      // this throws the warning "Element static-app scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled."
      // but it is necessary to set the location here, because the router-outlet is not yet initialized when the constructor is called
      const outlet = document.getElementById("router-outlet");
      const router = new Router(outlet);
      router.setRoutes(routes);
      this.location = router.location;
    }
  }

  _onChangeButtonClicked() {
    var roomName = (document.getElementById("roomNameInput") as any).value;
    Common.setYjsRoomName(roomName);
    Common.setSpace(this.page || "meta-modeling-space");
    this.changeVisibility("#roomEnterLoader", true);
    location.reload();
    setTimeout(() => {
      this.changeVisibility("#roomEnterLoader", false);
      this.displayCurrentRoomName();
    }, 1000);
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
        document.querySelector("#generateModelMessage").innerHTML = message;
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
  }

  handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userinfo_endpoint");
    location.reload();
  }

  displayCurrentRoomName() {
    var spaceHTML = "";
    let yjsRoomName = Common.getYjsRoomName();

    if (yjsRoomName && yjsRoomName !== "null") {
      spaceHTML = `<span style="font-weight: bold;">Current Space:</span> ${yjsRoomName}`;
    } else {
      spaceHTML = "Please enter a space!";
    }
    document.querySelector("#currentRoom").innerHTML = spaceHTML;
  }

  changeVisibility(htmlQuery: string, show: boolean) {
    var item = document.querySelector(htmlQuery) as HTMLElement;
    if (show) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  }
}
