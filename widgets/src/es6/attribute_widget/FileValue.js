import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import { OpenAppProvider } from "../lib/openapp";
const openapp = new OpenAppProvider().openapp;
import { CONFIG } from "../config";
import AbstractValue from "./AbstractValue";
import ValueChangeOperation from "../operations/ot/ValueChangeOperation";
import loadHTML from "../html.template.loader";

const fileValueHtml = await loadHTML(
  "../../templates/attribute_widget/file_value.html",
  import.meta.url
);


/**
 * FileValue
 * @class attribute_widget.FileValue
 * @extends attribute_widget.AbstractValue
 * @memberof attribute_widget
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 * @param {Object} options Selection options
 * @constructor
 */
class FileValue extends AbstractValue{
  constructor(id, name, subjectEntity, rootSubjectEntity, options) {

   super(
      
      id,
      name,
      subjectEntity,
      rootSubjectEntity
    );
    var that = this;


    /**
     * Uri of file
     * @type {string}
     * @private
     */
    var _value = "";

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(fileValueHtml)({ name: name, options: options }));

    /**
     * jQuery object of DOM node representing the file selection node
     * @type {jQuery}
     * @private
     */
    var _$selectFile = _$node.find(".select_file");

    /**
     * jQuery object of DOM node representing the file management node
     * @type {jQuery}
     * @private
     */
    var _$manageFile = _$node.find(".manage_file");

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    /**
     * Apply a Value Change Operation
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var processValueChangeOperation = function (operation) {
      that.setValue(operation.getValue());
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
     * Propagate a Value Change Operation to the remote users and the local widgets
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var propagateValueChangeOperation = function (operation) {
      processValueChangeOperation(operation);
      _iwc.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.MAIN,
        operation.getOTOperation()
      );
    };

    /**
     * Callback for a Value Change Operation
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var valueChangeCallback = function (operation) {
      if (operation instanceof ValueChangeOperation &&
        operation.getEntityId() === that.getEntityId()) {
        processValueChangeOperation(operation);
      }
    };

    var uploadFile = function (name, type, data) {
      var resourceSpace = new openapp.oo.Resource(openapp.param.space());

      resourceSpace.create({
        relation: openapp.ns.role + "data",
        type: "my:ns:file",
        representation: {
          name: name,
          type: type,
          data: data,
        },
        callback: function (d) {
          if (d.uri) {
            propagateValueChange(CONFIG.OPERATION.TYPE.UPDATE, d.uri, 0);
          }
        },
      });
    };

    var init = function () {
      _$selectFile.find("#file_object").change(function () {
        var files = $(this)[0].files, file;

        if (!files || files.length === 0)
          return;
        file = files[0];
        if (file.size > 1048576) {
          alert("Chosen file is too large. Maximum size: 1MB");
        }
      });

      _$selectFile.find("#file_submit").click(function () {
        var fileReader, files = _$selectFile.find("#file_object")[0].files, file;

        if (!files || files.length === 0)
          return;
        file = files[0];

        fileReader = new FileReader();
        fileReader.onload = function (e) {
          uploadFile(file.name, file.type, e.target.result);
        };
        fileReader.readAsDataURL(file);
      });

      _$manageFile.find("#file_delete").click(function () {
        //openapp.resource.del(_value);
        propagateValueChange(CONFIG.OPERATION.TYPE.UPDATE, "", 0);
      });

      _$selectFile.show();
      _$manageFile.hide();
    };

    /**
     * Set value
     * @param {string} value
     */
    this.setValue = function (value) {
      var $fileObject = _$selectFile.find("#file_object"), $fileName = _$manageFile.find("#file_name"), $downloadLink = _$manageFile.find("#file_download"), $previewLink = _$manageFile.find("#file_preview");

      _value = value;

      if (_value === "") {
        $fileObject.replaceWith($fileObject.clone(true));

        _$selectFile.show();
        _$manageFile.hide();
      } else {
        $.get(_value + "/:representation").done(function (data) {
          $downloadLink[0].download = data.name;
          $downloadLink[0].href = data.data;

          $previewLink.click(function (e) {
            e.preventDefault();
            window.open(data.data, "_blank");
          });

          $fileName.text(
            data.name.length > 15
              ? data.name.substr(0, 5) + ".." + data.name.substr(-10)
              : data.name
          );

          _$selectFile.hide();
          _$manageFile.show();
        });
      }
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
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwc.registerOnDataReceivedCallback(valueChangeCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwc.unregisterOnDataReceivedCallback(valueChangeCallback);
    };

    this.setValueFromJSON = function (json) {
      this.setValue(json.value);
    };

    init();

    if (_iwc) {
      that.registerCallbacks();
    }
  }
}

export default FileValue;
