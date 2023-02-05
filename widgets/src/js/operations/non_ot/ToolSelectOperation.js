define([
  ".//NonOTOperation",
], /** @lends operations.non_ot.ToolSelectOperation */ function (
  NonOTOperation
) {
  ToolSelectOperation.TYPE = "ToolSelectOperation";

  /**
   * ToolSelectOperation
   * @class operations.non_ot.ToolSelectOperation.non_ot.ToolSelectOperation
   * @memberof operations.non_ot
   * @constructor
   * @param {string} toolName Name of selected tool
   * @param label
   * @param {map} defaultAttributeValues Map containing default values for the attributes of a node.
   */
  function ToolSelectOperation(toolName, label, defaultAttributeValues = {}) {
    /**
     * Name of selected tool
     * @type {string}
     */
    var selectedToolName = toolName;

    /**
     * Corresponding NonOtOperation
     * @type {operations.non_ot.NonOTOperation}
     * @private
     */
    var nonOTOperation = null;

    /**
     * Default label of selected tool
     * @type {string}
     */
    var defaultLabel = label;

    /**
     * May be used to set default values for node attributes.
     * @type {map}
     */
    var defaultAttributeValues = defaultAttributeValues;

    /**
     * Get name of selected tool
     * @returns {string}
     */
    this.getSelectedToolName = function () {
      return selectedToolName;
    };

    /**
     * Get default label of selected tool
     * @returns {string}
     */
    this.getDefaultLabel = function () {
      return defaultLabel;
    };

    /**
     * Get default values for node attributes.
     * @returns {map}
     */
    this.getDefaultAttributeValues = function () {
      return defaultAttributeValues;
    };

    /**
     * Convert operation to NonOTOperation
     * @returns {operations.non_ot.NonOTOperation}
     */
    this.toNonOTOperation = function () {
      if (nonOTOperation === null) {
        nonOTOperation = new NonOTOperation(
          ToolSelectOperation.TYPE,
          JSON.stringify({ selectedToolName: selectedToolName })
        );
      }
      return nonOTOperation;
    };
  }

  return ToolSelectOperation;
});