import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import { html, LitElement, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";
import _ from "lodash-es";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import AvoidConflictsStrategy from "../../es6/guidance_widget/AvoidConflictsStrategy";
import CollaborationStrategy from "../../es6/guidance_widget/CollaborationStrategy";
import NoStrategy from "../../es6/guidance_widget/NoStrategy";
import IWCW from "../../es6/lib/IWCWrapper";
import { getInstance } from "../../es6/lib/yjs-sync";
import EntitySelectOperation from "../../es6/operations/non_ot/EntitySelectOperation";
import GuidanceStrategyOperation from "../../es6/operations/non_ot/GuidanceStrategyOperation";
import {
  EdgeAddOperation,
  EdgeDeleteOperation,
  NodeAddOperation,
  NodeDeleteOperation,
} from "../../es6/operations/ot/EntityOperation";
import NodeMoveOperation from "../../es6/operations/ot/NodeMoveOperation";
import NodeMoveZOperation from "../../es6/operations/ot/NodeMoveZOperation";
import NodeResizeOperation from "../../es6/operations/ot/NodeResizeOperation";
import ValueChangeOperation from "../../es6/operations/ot/ValueChangeOperation";
import Space from "../../es6/Space"; // not sure how to transform !promise/Space
import init from "../../es6/shared";
import { SyncMetaWidget } from "../../widget";

// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.GUIDANCE))
export class GuidanceWidget extends SyncMetaWidget(
  LitElement,
  getWidgetTagName(CONFIG.WIDGET.NAME.GUIDANCE)
) {
  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    const instance = getInstance({});
    instance
      .connect()
      .then((y) => {
        window.y = y;
        console.info(
          "GUIDANCE: Yjs Initialized successfully in room " +
            window.spaceTitle +
            " with y-user-id: " +
            y.clientID
        );
        initGuidanceWidget(y);
      })
      .catch((err) => {
        console.error("GUIDANCE: Yjs Initialization failed: " + err);
      });
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/bootstrap.min.prefixed.css"
      />
      <!-- <link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/font-awesome/css/font-awesome.min.css"> -->
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"
      />
      <div id="guidance">
        <div class="bs-btn-group">
          <div class="bs-form-group">
            <label for="strategyButton">Guidance Strategy</label>
            <button
              id="strategyButton"
              type="button"
              class="bs-btn bs-btn-default bs-dropdown-toggle bs-form-control"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Select a strategy<span class="bs-caret"></span>
            </button>
            <ul class="bs-dropdown-menu" id="guidanceSelect"></ul>
          </div>
        </div>
      </div>
      <div id="guidance-strategy-ui" style="height:320px; overflow:auto;">
        <div></div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}

function initGuidanceWidget(y) {
  var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE, y);
  var strategies = [NoStrategy, AvoidConflictsStrategy, CollaborationStrategy];
  const dataMap = y.getMap("data");
  var selectedStrategy = new strategies[0](dataMap.get("guidancemodel"), Space);
  selectedStrategy.buildUi();

  var $strategies = $("#guidanceSelect");

  for (var i = 0; i < strategies.length; i++) {
    var strategy = strategies[i];
    var $strategy = $(
      _.template(
        "<li><a href='javascript:;'><i class='fa fa-${icon}' style='margin-right:5px;'></i>${name}</a></li>"
      )({ name: strategy.NAME, icon: strategy.ICON })
    );
    $strategy.find("a").val(i);
    $strategies.append($strategy);
  }
  $strategies.find("a").click(function () {
    var index = $(this).val();
    initStrategy(index);
  });
  var getOriginType = function (operation) {
    if (operation.getViewId()) return operation.getOriginType();
    else return operation.getType();
  };

  var operationCallback = function (operation) {
    if (operation instanceof EntitySelectOperation) {
      selectedStrategy.onEntitySelect(
        operation.getSelectedEntityId(),
        operation.getSelectedEntityType()
      );
    } else if (operation instanceof NodeAddOperation) {
      selectedStrategy.onNodeAdd(
        operation.getEntityId(),
        getOriginType(operation)
      );
    } else if (operation instanceof EdgeAddOperation) {
      selectedStrategy.onEdgeAdd(
        operation.getEntityId(),
        getOriginType(operation)
      );
    } else if (operation instanceof NodeDeleteOperation) {
      selectedStrategy.onNodeDelete(
        operation.getEntityId(),
        operation.getType()
      );
    } else if (operation instanceof EdgeDeleteOperation) {
      selectedStrategy.onEdgeDelete(
        operation.getEntityId(),
        operation.getType()
      );
    } else if (operation instanceof ValueChangeOperation) {
      selectedStrategy.onValueChange(
        operation.getEntityId(),
        operation.getValue(),
        operation.getType(),
        operation.getPosition()
      );
    } else if (operation instanceof NodeMoveOperation) {
      selectedStrategy.onNodeMove(
        operation.getEntityId(),
        operation.getOffsetX(),
        operation.getOffsetY()
      );
    } else if (operation instanceof NodeMoveZOperation) {
      selectedStrategy.onNodeMoveZ(
        operation.getEntityId(),
        operation.getOffsetZ()
      );
    } else if (operation instanceof NodeResizeOperation) {
      selectedStrategy.onNodeResize(
        operation.getEntityId(),
        operation.getOffsetX(),
        operation.getOffsetY()
      );
    } else if (operation instanceof GuidanceStrategyOperation) {
      selectedStrategy.onGuidanceOperation(operation.getData());
    }
  };

  var sendGuidanceStrategyOperation = function (data) {
    var operation = new GuidanceStrategyOperation(data);
    iwc.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.MAIN,
      operation.toNonOTOperation()
    );
  };

  var initStrategy = function (index) {
    const dataMap = y.getMap("data");
    selectedStrategy = new strategies[index](
      dataMap.get("guidancemodel"),
      Space
    );
    selectedStrategy.sendGuidanceStrategyOperation =
      sendGuidanceStrategyOperation;
    var $guidanceStrategyUi = $("#guidance-strategy-ui");
    $guidanceStrategyUi.empty();
    $guidanceStrategyUi.append(selectedStrategy.buildUi());
    $("#strategyButton").text(strategies[index].NAME);
  };

  var registerCallbacks = function () {
    iwc.registerOnDataReceivedCallback(operationCallback);
  };

  registerCallbacks();
}
