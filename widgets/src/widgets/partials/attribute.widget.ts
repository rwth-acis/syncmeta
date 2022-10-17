import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "../../js/config";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";

// widget body used by all syncmeta widgets
@customElement("attribute-widget")
export class AttributeWidget extends SyncMetaWidget {
  render() {
    return html`
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/style.css"
      />
      <script src="<%= grunt.config('baseUrl') %>/es6/attribute_widget.js"></script>
      <div id="loading" class="loading"></div>
      <div id="wrapper"><h1>Wait For Canvas Widget!</h1></div>
      <div id="q"></div>
    `;
  }

  static styles = css`
    #wrapper {
      max-height: 200px;
      overflow: auto;
      height: 100%;
    }
    .list_attribute ul.list {
      list-style: none;
      padding-left: 10px;
      margin: 5px 0;
    }

    .list_attribute div span.ui-icon {
      margin-left: 10px;
    }

    .key_value_attribute,
    .condition_predicate,
    .renaming_attr {
      overflow: auto;
    }

    .key_value_attribute div,
    .condition_predicate div,
    .renaming_attr div {
      width: 30%;
      float: left;
    }

    .key_value_attribute div input,
    .condition_predicate div input,
    .renaming_attr div input {
      border: 1px solid #aaaaaa;
    }

    .key_value_attribute span.ui-icon,
    .condition_predicate span.ui-icon {
      margin-top: 3px;
    }

    .single_value_attribute {
      overflow: auto;
    }

    .single_quiz_attribute {
      overflow: auto;
    }

    .single_value_attribute div {
      float: left;
      margin-right: 10px;
    }

    .single_quiz_attribute div {
      float: left;
      margin-right: 10px;
    }

    .list .single_value_attribute .name {
      display: none;
    }
    .list .single_quiz_attribute .name {
      display: none;
    }

    .single_value_attribute .name {
      width: 120px;
    }
    .single_quiz_attribute .name {
      width: 120px;
    }

    .single_value_attribute div.value input[type="text"],
    .single_value_attribute div.value input[type="number"],
    .single_value_attribute div.value textarea,
    .single_value_attribute div.value select {
      border: 1px solid #4a4a4a;
      width: 200px;
    }

    .single_quiz_attribute div.value input[type="text"],
    .single_quiz_attribute div.value input[type="number"],
    .single_quiz_attribute div.value textarea,
    .single_quiz_attribute div.value select {
      border: 1px solid #4a4a4a;
      width: 200px;
    }

    .single_value_attribute div.value span.color_preview {
      width: 12px;
      height: 18px;
      background-color: #ffffff;
      display: inline-block;
      border: 1px solid #4a4a4a;
      position: relative;
      top: 5px;
      left: -14px;
    }

    .single_quiz_attribute div.value span.color_preview {
      width: 12px;
      height: 18px;
      background-color: #ffffff;
      display: inline-block;
      border: 1px solid #4a4a4a;
      position: relative;
      top: 5px;
      left: -14px;
    }

    .single_value_attribute div.value textarea {
      width: 400px;
      height: 80px;
    }

    .single_quiz_attribute div.value textarea {
      width: 400px;
      height: 80px;
    }

    #modelAttributes .default_node .label {
      font-weight: bold;
    }

    .label {
      text-transform: capitalize;
    }

    .key_value_attribute input,
    select {
      width: 150px;
    }
    .condition_predicate input,
    select {
      width: 150px;
    }

    .renaming_attr input,
    select {
      width: 150px;
    }

    .type {
      font-weight: bold;
      margin: 0 0 3px;
    }

    .show_hint {
      font-size: 12px;
    }

    .hint {
      font-size: 12px;
      overflow-y: auto;
      max-height: 150px;
    }

    .codeEditorValue {
      position: absolute;
      width: 560px;
      height: 200px;
      overflow-y: auto;
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