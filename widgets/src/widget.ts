import { LitElement, css } from "lit";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import createReloadHandler from "./js/shared";

type Constructor<T = {}> = new (...args: any[]) => T;

export const SyncMetaWidget = <T extends Constructor<LitElement>>(
  superClass: T
) => {
  // cannot use arrow function here, see https://lit.dev/docs/composition/mixins/#applying-decorators-in-mixins
  class SyncMetaWidgetElement extends superClass {
    createRenderRoot() {
      return this;
    }
    // @property({ type: String }) widgetName = "SyncMetaWidget";

    // this is actually not working if we render into the light dom, see https://lit.dev/docs/components/shadow-dom/#implementing-createrenderroot
    static styles = css`
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

    connectedCallback() {
      super.connectedCallback();
      createReloadHandler();
      window.Y = Y;
      window.WebsocketProvider = WebsocketProvider;
    }

    disconnectedCallback() {
      super.disconnectedCallback();
    }
  }
  return SyncMetaWidgetElement as T;
};
