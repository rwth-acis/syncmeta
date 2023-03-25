import { LitElement, css, html, TemplateResult } from "lit";
import { Doc as YDoc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import createReloadHandler from "./es6/shared";
import { getWidgetTagName } from "./es6/config";
import { yjsSync } from "./es6/lib/yjs-sync";
type Constructor<T = {}> = new (...args: any[]) => T;

export const SyncMetaWidget = <T extends Constructor<LitElement>>(
  superClass: T,
  widgetName: string
) => {
  if (!widgetName) {
    throw new Error("widgetName cannot be empty");
  }
  // cannot use arrow function here, see https://lit.dev/docs/composition/mixins/#applying-decorators-in-mixins
  class SyncMetaWidgetElement extends superClass {
    widgetName = widgetName;
    createRenderRoot() {
      return this;
    }
    protected render(): TemplateResult<1> {
      return html` <error-alert></error-alert> `;
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

    firstUpdated() {
      this.hideErrorAlert();
    }

    connectedCallback() {
      super.connectedCallback();
      createReloadHandler();
      if (!window.hasOwnProperty("y")) {
        yjsSync().then((y: YDoc) => {
          if (!window.hasOwnProperty("y")) window.y = y;
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
    showErrorAlert(message: string) {
      $(this.widgetName).find("#alert-message").text(message);
      $(this.widgetName).find("error-alert").hide();
    }
  }
  return SyncMetaWidgetElement as T;
};
