/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'jqueryui',
    'lodash',
    'require',
    'iwcw',
    'lib/yjs-sync',
    'operations/non_ot/EntitySelectOperation',
    'operations/non_ot/GuidanceStrategyOperation',
    'operations/ot/NodeAddOperation',
    'operations/ot/EdgeAddOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/ot/EdgeDeleteOperation',
    'operations/ot/ValueChangeOperation',
    'operations/ot/NodeMoveOperation',
    'operations/ot/NodeMoveZOperation',
    'operations/ot/NodeResizeOperation',
    'guidance_widget/NoStrategy',
    'guidance_widget/AvoidConflictsStrategy',
    'guidance_widget/CollaborationStrategy',
    'promise!Space',
    'bootstrap'
], function($, _, require, IWCW, yjsSync, EntitySelectOperation, GuidanceStrategyOperation, NodeAddOperation, EdgeAddOperation, NodeDeleteOperation, EdgeDeleteOperation, ValueChangeOperation, NodeMoveOperation, NodeMoveZOperation, NodeResizeOperation, NoStrategy, AvoidConflictsStrategy, CollaborationStrategy, Space) {
    yjsSync().done(function(y, spaceTitle) {
        window.y = y;
        console.info(
          "GUIDANCE: Yjs Initialized successfully in room " +
            spaceTitle +
            " with y-user-id: " +
            y.clientID
        );
        initGuidanceWidget();
    });

    function initGuidanceWidget() {
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
        var strategies = [
            NoStrategy,
            AvoidConflictsStrategy,
            CollaborationStrategy
        ];
        const dataMap = y.getMap("data");
        var selectedStrategy = new strategies[0](
          dataMap.get("guidancemodel"),
          Space
        );
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

        var registerCallbacks = function() {
            iwc.registerOnDataReceivedCallback(operationCallback);
        };

        registerCallbacks();
    }
});