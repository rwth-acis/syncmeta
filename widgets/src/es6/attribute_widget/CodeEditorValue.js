import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import { CONFIG } from "../config";
import AbstractValue from "./AbstractValue";
import ValueChangeOperation from "../operations/ot/ValueChangeOperation";
import loadHTML from "../html.template.loader";
const codeEditorValueHtml = await loadHTML(
  "../../../html/templates/attribute_widget/code_edtior_value.html",
  import.meta.url
);
// import "ace-builds/src-min/ace";

CodeEditorValue.prototype = new AbstractValue();
CodeEditorValue.prototype.constructor = CodeEditorValue;
/**
 * CodeEditorValue
 * @class attribute_widget.CodeEditorValue
 * @extends attribute_widget.AbstractValue
 * @memberof attribute_widget
 * @constructor
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 */
function CodeEditorValue(id, name, subjectEntity, rootSubjectEntity) {
  var that = this;

  var _ytext = null;

  AbstractValue.prototype.constructor.call(
    this,
    id,
    name,
    subjectEntity,
    rootSubjectEntity
  );

  /**
   * Value
   * @type {string}
   * @private
   */
  var _value = "";

  var editor = null;

  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  var _$node = $(codeEditorValueHtml);

  var bindAceEditor = function (ytext) {
    _ytext = ytext;
    ytext.bindAce(editor);
    initData(ytext, _value);

    _ytext.observe(function (event) {
      _value = event.object.toString();
      propagateValueChange(CONFIG.OPERATION.TYPE.INSERT, _value, 0);
    });
  };

  var createYText = function () {
    const nodesMap = y.getMap("nodes");
    var ymap = nodesMap.get(rootSubjectEntity.getEntityId());
    if (ymap) {
      var ytext = ymap.get(subjectEntity.getEntityId());
      bindAceEditor(ytext);
    }
  };

  _$node.click(function () {
    if (editor) {
      $(editor.container).parent().show();
      $("#wrapper").hide();
    } else {
      $("#loading").show();

      var tpl = $(
        '<div class="ace-container"><button id="undo"><img width="10px" height="10px" src="<%= grunt.config("baseUrl") %>/img/undo.png" /></button><div class="codeEditorValue" id="ace-' +
          rootSubjectEntity.getEntityId() +
          '"></div></div>'
      );

      $("body").append(tpl);
      $("#wrapper").hide();

      tpl.find("button").click(function () {
        $(editor.container).parent().hide();
        $("#wrapper").show();
      });
      editor = ace.edit("ace-" + rootSubjectEntity.getEntityId());
      editor.setTheme("ace/theme/github");
      editor.getSession().setMode("ace/mode/svg");

      createYText();
      $("#loading").hide();
    }
  });

  /**
   * Inter widget communication wrapper
   * @type {Object}
   * @private
   */
  var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

  /**
         * Propagate a Value Change Operation to the remote users and the local widgets
         * @param {operations.ot.ValueChangeOperation} operation

         */
  var propagateValueChangeOperation = function (operation) {
    //processValueChangeOperation(operation);
    iwc.sendLocalOTOperation(
      CONFIG.WIDGET.NAME.MAIN,
      operation.getOTOperation()
    );
  };

  /**
   * Propagate a Value Change to the remote users and the local widgets
   * @param type Type of the update (CONFIG.OPERATION.TYPE.INSERT,DELETE)
   * @param value Char that was inserted or deleted
   * @param position Position the change took place
   */
  var propagateValueChange = function (type, value, position) {
    var operation = new ValueChangeOperation(
      that.getEntityId(),
      value,
      type,
      position
    );
    propagateValueChangeOperation(operation);
  };

  /**
   * Set value
   * @param {string} value
   */
  this.setValue = function (value) {
    _value = value;
    _$node.val(value);
  };

  /**
   * Get value
   * @returns {string}
   */
  this.getValue = function () {
    return _value;
  };

  /**
   * Get jQuery object of DOM node representing the value
   * @returns {jQuery}
   */
  this.get$node = function () {
    return _$node;
  };

  /**
   * Set value by its JSON representation
   * @param json
   */
  this.setValueFromJSON = function (json) {
    this.setValue(json.value);
  };

  var initData = function (ytext, data) {
    if (data) {
      if (data !== ytext.toString()) {
        if (ytext.toString().length > 0)
          ytext.delete(0, ytext.toString().length);
        ytext.insert(0, data);
      }
    } else {
      if (that.getValue() !== ytext.toString()) {
        if (ytext.toString().length > 0)
          ytext.delete(0, ytext.toString().length);
        ytext.insert(0, that.getValue());
      }
    }
  };

  this.getYText = function () {
    return _ytext;
  };

  //init();
}

export default CodeEditorValue;
