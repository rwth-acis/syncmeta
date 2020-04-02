define([
    'operations/ot/OTOperation',
    'operations/ot/EntityOperation',
    'operations/ot/NodeAddOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/ot/NodeMoveOperation',
    'operations/ot/NodeMoveZOperation',
    'operations/ot/NodeResizeOperation',
    'operations/ot/EdgeAddOperation',
    'operations/ot/EdgeDeleteOperation',
    'operations/ot/AttributeAddOperation',
    'operations/ot/AttributeDeleteOperation',
    'operations/ot/ValueChangeOperation',
    'operations/non_ot/NonOTOperation',
    'operations/non_ot/EntitySelectOperation',
    'operations/non_ot/ToolSelectOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/ExportMetaModelOperation',
    'operations/non_ot/ExportLogicalGuidanceRepresentationOperation',
    'operations/non_ot/ExportImageOperation',
    'operations/non_ot/SetViewTypesOperation',
    'operations/non_ot/InitModelTypesOperation',
    'operations/non_ot/ViewInitOperation',
    'operations/non_ot/DeleteViewOperation',
    'operations/non_ot/SetModelAttributeNodeOperation',
    'operations/non_ot/UpdateViewListOperation',
    'operations/non_ot/ShowGuidanceBoxOperation',
    'operations/non_ot/CanvasViewChangeOperation',
    'operations/non_ot/RevokeSharedActivityOperation',
    'operations/non_ot/CollaborateInActivityOperation',
    'operations/non_ot/MoveCanvasOperation',
    'operations/non_ot/GuidanceStrategyOperation',
    'operations/non_ot/UpdateMetamodelOperation'
],/** @lends OperationFactory */function(OTOperation,EntityOperation,NodeAddOperation,NodeDeleteOperation,NodeMoveOperation,NodeMoveZOperation,NodeResizeOperation,EdgeAddOperation,EdgeDeleteOperation,AttributeAddOperation,AttributeDeleteOperation,ValueChangeOperation,NonOTOperation,EntitySelectOperation,ToolSelectOperation,ActivityOperation,ExportMetaModelOperation,ExportLogicalGuidanceRepresentationOperation,ExportImageOperation,SetViewTypesOperation,InitModelTypesOperation,ViewInitOperation,DeleteViewOperation,SetModelAttributeNodeOperation,UpdateViewListOperation,ShowGuidanceBoxOperation, CanvasViewChangeOperation, RevokeSharedActivityOperation,CollaborateInActivityOperation, MoveCanvasOperation, GuidanceStrategyOperation, UpdateMetamodelOperation) {

    /**
     * OperationFactory
     * @class operations.OperationFactory
     * @memberof operations.ot
     * @constructor
     */
    function OperationFactory(){
        return {
            /**
             * Creates an Operation from a received NonOTOperation
             * @memberof operations.OperationFactory#
             * @param operation
             * @returns {ActivityOperation|EntitySelectOperation|ToolSelectOperation}
             */
            createOperationFromNonOTOperation: function(operation){
                var type = operation.getType(),
                    data,
                    resOperation = null;

                try {
                    data = JSON.parse(operation.getData());
                } catch (e){
                    console.error('Not able to parse data to JSON. Check the corresponding operation');
                    return null;
                }

                switch(type){
                    case EntitySelectOperation.TYPE:
                        resOperation = new EntitySelectOperation(data.selectedEntityId, data.selectedEntityType, data.jabberId);
                        resOperation.setNonOTOperation(operation);
                        break;
                    case ToolSelectOperation.TYPE:
                        resOperation = new ToolSelectOperation(data.selectedToolName, data.name);
                        break;
                    case ActivityOperation.TYPE:
                        resOperation = new ActivityOperation(data.type,data.entityId,data.sender,data.text,data.data);
                        break;
                    case ExportMetaModelOperation.TYPE:
                        resOperation = new ExportMetaModelOperation(data.requestingComponent,data.data);
                        break;
                    case ExportLogicalGuidanceRepresentationOperation.TYPE:
                        resOperation = new ExportLogicalGuidanceRepresentationOperation(data.requestingComponent,data.data);
                        break;
                    case ExportImageOperation.TYPE:
                        resOperation = new ExportImageOperation(data.requestingComponent,data.data);
                        break;
                    case SetViewTypesOperation.TYPE:
                        resOperation = new SetViewTypesOperation(data.flag);
                        break;
                    case InitModelTypesOperation.TYPE:
                        resOperation = new InitModelTypesOperation(data.vls, data.startViewGeneration);
                        break;
                    case ViewInitOperation.TYPE:
                        resOperation = new ViewInitOperation(data.data, data.viewpoint);
                        break;
                    case DeleteViewOperation.TYPE:
                        resOperation = new DeleteViewOperation(data.viewId);
                        break;
                    case ShowGuidanceBoxOperation.TYPE:
                        resOperation = new ShowGuidanceBoxOperation(data.label, data.guidance, data.entityId);
                        break;
                    case SetModelAttributeNodeOperation.TYPE:
                        resOperation = new SetModelAttributeNodeOperation();
                        break;
                    case UpdateViewListOperation.TYPE:
                        resOperation = new UpdateViewListOperation();
                        break;
                    case CanvasViewChangeOperation.TYPE:
                        resOperation = new CanvasViewChangeOperation(data.left, data.top, data.width, data.height, data.zoom);
                        resOperation.setNonOTOperation(operation);
                        break;
                    case RevokeSharedActivityOperation.TYPE:
                        resOperation = new RevokeSharedActivityOperation(data.id);
                        break;
                    case CollaborateInActivityOperation.TYPE:
                        resOperation = new CollaborateInActivityOperation(data.id);
                        break;
                    case MoveCanvasOperation.TYPE:
                        resOperation = new MoveCanvasOperation(data.objectId, data.transition);
                        break;
                    case GuidanceStrategyOperation.TYPE:
                        resOperation = new GuidanceStrategyOperation(data.data);
                        resOperation.setNonOTOperation(operation);
                        break;
                    case UpdateMetamodelOperation.TYPE:
                        resOperation = new UpdateMetamodelOperation(data.metamodelingRoomName, data.modelingRoomName);
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
            createOperationFromOTOperation: function(operation){
                var value;
                var entityType;
                var entityId;
                var components = operation.getName().split(":");

                var resOperation = null;

                if(components.length === 2){
                    entityType = components[0];
                    entityId = components[1];

                    switch(entityType){
                        case CONFIG.ENTITY.NODE:
                            try {
                                value = JSON.parse(operation.getValue());
                            } catch (e){
                                return null;
                            }
                            switch(operation.getPosition()){
                                case CONFIG.IWC.POSITION.NODE.ADD:
                                    switch(operation.getType()){
                                        case CONFIG.OPERATION.TYPE.INSERT:
                                            resOperation = new NodeAddOperation(
                                                entityId,
                                                value.type,
                                                value.left,
                                                value.top,
                                                value.width,
                                                value.height,
                                                value.zIndex,
                                                value.json,
                                                value.viewId,
                                                value.oType,
                                                value.jabberId);
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
                                        value.jabberId);
                                    break;
                                case CONFIG.IWC.POSITION.NODE.Z:
                                    resOperation = new NodeMoveZOperation(
                                        entityId,
                                        value.offsetZ,
                                        value.jabberId);
                                    break;
                                case CONFIG.IWC.POSITION.NODE.DIM:
                                    resOperation = new NodeResizeOperation(
                                        entityId,
                                        value.offsetX,
                                        value.offsetY,
                                        value.jabberId);
                                    break;
                            }
                            break;
                        case CONFIG.ENTITY.EDGE:
                            try {
                                value = JSON.parse(operation.getValue());
                            } catch (e){
                                return null;
                            }
                            switch(operation.getType()){
                                case CONFIG.OPERATION.TYPE.INSERT:
                                    resOperation = new EdgeAddOperation(
                                        entityId,
                                        value.type,
                                        value.source,
                                        value.target,
                                        value.json,
                                        value.viewId,
                                        value.oType,
                                        value.jabberId);
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
                            } catch (e){
                                return null;
                            }
                            switch(operation.getType()){
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
                if(resOperation !== null){
                    resOperation.setOTOperation(operation);
                }
                return resOperation;
            }
        };
    }

    return new OperationFactory();

});