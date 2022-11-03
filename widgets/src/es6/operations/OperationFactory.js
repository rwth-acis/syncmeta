import { CONFIG } from "../config";
import EntityOperation from "./ot/EntityOperation";
import NodeAddOperation from "./ot/NodeAddOperation";
import NodeDeleteOperation from "./ot/NodeDeleteOperation";
import NodeMoveOperation from "./ot/NodeMoveOperation";
import NodeMoveZOperation from "./ot/NodeMoveZOperation";
import NodeResizeOperation from "./ot/NodeResizeOperation";
import EdgeAddOperation from "./ot/EdgeAddOperation";
import EdgeDeleteOperation from "./ot/EdgeDeleteOperation";
import AttributeAddOperation from "./ot/AttributeAddOperation";
import AttributeDeleteOperation from "./ot/AttributeDeleteOperation";
import ValueChangeOperation from "./ot/ValueChangeOperation";
import NonOTOperation from "./non_ot/NonOTOperation";
import EntitySelectOperation from "./non_ot/EntitySelectOperation";
import ToolSelectOperation from "./non_ot/ToolSelectOperation";
import ActivityOperation from "./non_ot/ActivityOperation";
import ExportMetaModelOperation from "./non_ot/ExportMetaModelOperation";
import ExportLogicalGuidanceRepresentationOperation from "./non_ot/ExportLogicalGuidanceRepresentationOperation";
import ExportImageOperation from "./non_ot/ExportImageOperation";
import SetViewTypesOperation from "./non_ot/SetViewTypesOperation";
import InitModelTypesOperation from "./non_ot/InitModelTypesOperation";
import ViewInitOperation from "./non_ot/ViewInitOperation";
import DeleteViewOperation from "./non_ot/DeleteViewOperation";
import SetModelAttributeNodeOperation from "./non_ot/SetModelAttributeNodeOperation";
import UpdateViewListOperation from "./non_ot/UpdateViewListOperation";
import ShowGuidanceBoxOperation from "./non_ot/ShowGuidanceBoxOperation";
import CanvasViewChangeOperation from "./non_ot/CanvasViewChangeOperation";
import RevokeSharedActivityOperation from "./non_ot/RevokeSharedActivityOperation";
import CollaborateInActivityOperation from "./non_ot/CollaborateInActivityOperation";
import MoveCanvasOperation from "./non_ot/MoveCanvasOperation";
import GuidanceStrategyOperation from "./non_ot/GuidanceStrategyOperation";
import UpdateMetamodelOperation from "./non_ot/UpdateMetamodelOperation";

/**
 * OperationFactory
 * @class operations.OperationFactory
 * @memberof operations.ot
 * @constructor
 */
function OperationFactory() {
  return {
    /**
     * Creates an Operation from a received NonOTOperation
     * @memberof operations.OperationFactory#
     * @param operation
     * @returns {operations.non_ot.ToolSelectOperation|EntitySelectOperation|ToolSelectOperation}
     */
    createOperationFromNonOTOperation: function (operation) {
      var type = operation.getType(),
        data,
        resOperation = null;

      try {
        data = JSON.parse(operation.getData());
      } catch (e) {
        console.error(
          "Not able to parse data to JSON. Check the corresponding operation"
        );
        return null;
      }

      switch (type) {
        case EntitySelectOperation.TYPE:
          resOperation = new EntitySelectOperation(
            data.selectedEntityId,
            data.selectedEntityType,
            data.jabberId
          );
          resOperation.setNonOTOperation(operation);
          break;
        case ToolSelectOperation.TYPE:
          resOperation = new ToolSelectOperation(
            data.selectedToolName,
            data.name,
            data.defaultAttributeValues
          );
          break;
        case ActivityOperation.TYPE:
          resOperation = new ActivityOperation(
            data.type,
            data.entityId,
            data.sender,
            data.text,
            data.data
          );
          break;
        case ExportMetaModelOperation.TYPE:
          resOperation = new ExportMetaModelOperation(
            data.requestingComponent,
            data.data
          );
          break;
        case ExportLogicalGuidanceRepresentationOperation.TYPE:
          resOperation = new ExportLogicalGuidanceRepresentationOperation(
            data.requestingComponent,
            data.data
          );
          break;
        case ExportImageOperation.TYPE:
          resOperation = new ExportImageOperation(
            data.requestingComponent,
            data.data
          );
          break;
        case SetViewTypesOperation.TYPE:
          resOperation = new SetViewTypesOperation(data.flag);
          break;
        case InitModelTypesOperation.TYPE:
          resOperation = new InitModelTypesOperation(
            data.vls,
            data.startViewGeneration
          );
          break;
        case ViewInitOperation.TYPE:
          resOperation = new ViewInitOperation(data.data, data.viewpoint);
          break;
        case DeleteViewOperation.TYPE:
          resOperation = new DeleteViewOperation(data.viewId);
          break;
        case ShowGuidanceBoxOperation.TYPE:
          resOperation = new ShowGuidanceBoxOperation(
            data.label,
            data.guidance,
            data.entityId
          );
          break;
        case SetModelAttributeNodeOperation.TYPE:
          resOperation = new SetModelAttributeNodeOperation();
          break;
        case UpdateViewListOperation.TYPE:
          resOperation = new UpdateViewListOperation();
          break;
        case CanvasViewChangeOperation.TYPE:
          resOperation = new CanvasViewChangeOperation(
            data.left,
            data.top,
            data.width,
            data.height,
            data.zoom
          );
          resOperation.setNonOTOperation(operation);
          break;
        case RevokeSharedActivityOperation.TYPE:
          resOperation = new RevokeSharedActivityOperation(data.id);
          break;
        case CollaborateInActivityOperation.TYPE:
          resOperation = new CollaborateInActivityOperation(data.id);
          break;
        case MoveCanvasOperation.TYPE:
          resOperation = new MoveCanvasOperation(
            data.objectId,
            data.transition
          );
          break;
        case GuidanceStrategyOperation.TYPE:
          resOperation = new GuidanceStrategyOperation(data.data);
          resOperation.setNonOTOperation(operation);
          break;
        case UpdateMetamodelOperation.TYPE:
          resOperation = new UpdateMetamodelOperation(
            data.metamodelingRoomName,
            data.modelingRoomName
          );
          break;
        default:
          resOperation = new NonOTOperation(type, data);
          break;
      }
      return resOperation;
    },
    /**
     * Creates an entity operation from a received OTOperation
     * @memberof operations.OperationFactory#
     * @param operation
     * @returns {EntityOperation}
     */
    createOperationFromOTOperation: function (operation) {
      var value;
      var entityType;
      var entityId;
      var components = operation.getName().split(":");

      var resOperation = null;

      if (components.length === 2) {
        entityType = components[0];
        entityId = components[1];

        switch (entityType) {
          case CONFIG.ENTITY.NODE:
            try {
              value = JSON.parse(operation.getValue());
            } catch (e) {
              return null;
            }
            switch (operation.getPosition()) {
              case CONFIG.IWC.POSITION.NODE.ADD:
                switch (operation.getType()) {
                  case CONFIG.OPERATION.TYPE.INSERT:
                    resOperation = new NodeAddOperation(
                      entityId,
                      value.type,
                      value.left,
                      value.top,
                      value.width,
                      value.height,
                      value.zIndex,
                      value.containment,
                      value.json,
                      value.viewId,
                      value.oType,
                      value.jabberId
                    );
                    break;
                  case CONFIG.OPERATION.TYPE.UPDATE:
                    resOperation = new NodeDeleteOperation(
                      entityId,
                      value.type,
                      value.left,
                      value.top,
                      value.width,
                      value.height,
                      value.zIndex,
                      value.containment,
                      value.json
                    );
                    break;
                }
                break;
              case CONFIG.IWC.POSITION.NODE.POS:
                resOperation = new NodeMoveOperation(
                  entityId,
                  value.offsetX,
                  value.offsetY,
                  value.jabberId
                );
                break;
              case CONFIG.IWC.POSITION.NODE.Z:
                resOperation = new NodeMoveZOperation(
                  entityId,
                  value.offsetZ,
                  value.jabberId
                );
                break;
              case CONFIG.IWC.POSITION.NODE.DIM:
                resOperation = new NodeResizeOperation(
                  entityId,
                  value.offsetX,
                  value.offsetY,
                  value.jabberId
                );
                break;
            }
            break;
          case CONFIG.ENTITY.EDGE:
            try {
              value = JSON.parse(operation.getValue());
            } catch (e) {
              return null;
            }
            switch (operation.getType()) {
              case CONFIG.OPERATION.TYPE.INSERT:
                resOperation = new EdgeAddOperation(
                  entityId,
                  value.type,
                  value.source,
                  value.target,
                  value.json,
                  value.viewId,
                  value.oType,
                  value.jabberId
                );
                break;
              case CONFIG.OPERATION.TYPE.UPDATE:
                resOperation = new EdgeDeleteOperation(
                  entityId,
                  value.type,
                  value.source,
                  value.target,
                  value.json
                );
                break;
            }
            break;
          case CONFIG.ENTITY.ATTR:
            try {
              value = JSON.parse(operation.getValue());
            } catch (e) {
              return null;
            }
            switch (operation.getType()) {
              case CONFIG.OPERATION.TYPE.INSERT:
                resOperation = new AttributeAddOperation(
                  entityId,
                  value.subjectEntityId,
                  value.rootSubjectEntityId,
                  value.type,
                  value.data
                );
                break;
              case CONFIG.OPERATION.TYPE.UPDATE:
                resOperation = new AttributeDeleteOperation(
                  entityId,
                  value.subjectEntityId,
                  value.rootSubjectEntityId,
                  value.type
                );
                break;
            }
            break;
          case CONFIG.ENTITY.VAL:
            resOperation = new ValueChangeOperation(
              entityId,
              operation.getValue(),
              operation.getType(),
              operation.getPosition()
            );
            break;
        }
      }
      if (resOperation !== null) {
        resOperation.setOTOperation(operation);
      }
      return resOperation;
    },
  };
}

export default new OperationFactory();
