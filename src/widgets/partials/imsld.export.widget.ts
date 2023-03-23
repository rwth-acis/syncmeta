import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import init from "../../es6/shared";
import { SyncMetaWidget } from "../../widget";
import { CONFIG, getWidgetTagName } from "../../es6/config";
// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.IMSLD_EXPORT))
export class IMSLDExportWidget extends SyncMetaWidget(
  LitElement,
  getWidgetTagName(CONFIG.WIDGET.NAME.IMSLD_EXPORT)
) {
  render() {
    return html`
      <div class="seperating_box">
        <h5>Download IMSLD</h5>
        <button id="imsld">Download ZIP</button>
      </div>
      <div style="font-size:3pt">&nbsp;</div>
      <div class="seperating_box">
        <h5>Integrated Learning Design Environment (ILDE)</h5>
        <form id="ilde_login_form" class="hide">
          <div>
            Please provide your ILDE credentials to use this feature. There are
            different installations of ILDE. Please provide the URL of
            installation that you want to use.
          </div>
          <table>
            <tr>
              <td>Installation:</td>
              <td>
                <input
                  id="ildeResource"
                  name="resource"
                  type="text"
                  size="29"
                  value="http://ilde.upf.edu/"
                />
              </td>
            </tr>
            <tr>
              <td>Username:</td>
              <td><input name="username" type="text" size="29" /></td>
            </tr>
            <tr>
              <td>Password:</td>
              <td><input name="password" type="password" size="29" /></td>
            </tr>
          </table>
          <input type="submit" value="Login" />
          <span class="error_notification hide" style="color:red"> </span>
        </form>
        <div id="ilde_upload_form">
          <div id="createIldeDiv" class="">
            <div>
              This learning design can be synchronized with ILDE. If you want to
              synchronize it with an existing ILDE design, please provide the
              URL below. Otherwise just click 'Start ILDE Sync!'
            </div>
            <br />
            <div>
              URL of existing design (optional):
              <input id="existingIldeUrl" type="text" value="" size="40" />
            </div>
            <br />
            <input
              id="createIldeButton"
              type="submit"
              value="Start ILDE Sync!"
            />
          </div>
          <div id="syncIldeDiv" class="hide">
            <div>
              This design is now available also on ILDE:
              <a id="ildeLink" href="" target="_blank"></a>
            </div>
            <br />
            <div>Click to push your changes:</div>
            <input id="syncIldeButton" type="submit" value="Push to ILDE" />
            <input
              id="removeIldeButton"
              type="submit"
              value="Unlink from ILDE"
            />
            <span id="success_notification" class="hide" style="color:green">
              Success!
            </span>
          </div>
          <span class="error_notification hide" style="color:red"> </span>
        </div>
      </div>
    `;
  }

  static styles = css`
    .loading_button {
      background-image: url('<%= grunt.config("baseUrl") %>/img/loading_small.gif');
      background-repeat: no-repeat;
      background-position: right center;
      padding-right: 20px;
    }
    .hide {
      display: none;
    }

    #ilde_login_form * {
      font-size: 12px;
    }
    #ilde_upload_form * {
      font-size: 12px;
    }
    .seperating_box {
      border: 1px solid;
      border-radius: 7px;
      margin: 18px 20px 7px 7px;
      padding: 7px 20px 7px 7px;
      position: relative;
    }
    .seperating_box > h5 {
      font-weight: normal;
      font-style: italic;
      position: absolute;
      top: -40px;
      left: 4px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}

/**
 * Scripts missing!
 */
