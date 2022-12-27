import _ from "lodash-es";
import Activity from "./Activity";

/**
 * Activity representing the addition of a new edge
 * @class activity_widget.EdgeAddActivity
 * @memberof activity_widget
 * @extends activity_widget.Activity
 * @constructor
 * @param {string} entityId Entity id of the entity this activity works on
 * @param {string} sender JabberId of the user who issued this activity
 * @param {string} text Text of this activity which is displayed in the activity widget
 * @param {string} edgeType Type of the created edge
 * @param {string} sourceNodeLabel Label of the source node
 * @param {string} sourceNodeId Entity id of the source node
 * @param {string} sourceNodeType Type of the source node
 * @param {string} targetNodeLabel Label of the target node
 * @param {string} targetNodeId Entity id of the target node
 * @param {string} targetNodeType Type of the tarhet node
 */
class EdgeAddActivity extends Activity {
  static TYPE = "EdgeAddActivity";

  constructor(
    entityId,
    sender,
    text,
    timestamp,
    edgeType,
    sourceNodeLabel,
    sourceNodeId,
    sourceNodeType,
    targetNodeLabel,
    targetNodeId,
    targetNodeType
  ) {
    super(entityId, sender, text, timestamp);
    var that = this;
    /**
     * Type of created edge
     * @type {string}
     * @private
     */
    var _edgeType = edgeType;

    /**
     * Label of source node
     * @type {string}
     * @private
     */
    var _sourceNodeLabel = sourceNodeLabel;

    /**
     * Entity id of source node
     * @type {string}
     * @private
     */
    var _sourceNodeId = sourceNodeId;

    /**
     * Type of source node
     * @type {string}
     * @private
     */
    var _sourceNodeType = sourceNodeType;

    /**
     * Label of target node
     * @type {string}
     * @private
     */
    var _targetNodeLabel = targetNodeLabel;

    /**
     * Entity id of target node
     * @type {string}
     * @private
     */
    var _targetNodeId = targetNodeId;

    /**
     * Type of target node
     * @type {string}
     * @private
     */
    var _targetNodeType = targetNodeType;

    /**
     * Label of the created edge
     * @type {string}
     * @private
     */
    var _edgeLabel = "";

    /**
     * activity to json
     */
    this.toJSON = function () {
      var json = Activity.prototype.toJSON.call(this);
      json.type = EdgeAddActivity.TYPE;
      json.edgeType = _edgeType;
      json.edgeLabel = _edgeLabel;
      json.sourceNodeLabel = _sourceNodeLabel;
      json.sourceNodeId = _sourceNodeId;
      json.sourceNodeType = _sourceNodeType;
      json.targetNodeLabel = _targetNodeLabel;
      json.targetNodeId = _targetNodeId;
      json.targetNodeType = _targetNodeType;
      return json;
    };
  }
}
export default EdgeAddActivity;
