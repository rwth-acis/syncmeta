define([
    'operations/ot/OTOperation',
    'operations/ot/EntityOperation',
    'operations/ot/NodeAddOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/ot/NodeMoveOperation',
    'operations/ot/NodeResizeOperation',
    'operations/ot/EdgeAddOperation',
    'operations/ot/EdgeDeleteOperation',
    'operations/ot/AttributeAddOperation',
    'operations/ot/AttributeDeleteOperation',
    'operations/ot/ValueChangeOperation',
    'operations/non_ot/EntitySelectOperation',
    'operations/non_ot/ToolSelectOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/ExportDataOperation',
    'operations/non_ot/ExportMetaModelOperation',
    'operations/non_ot/ExportImageOperation',
    'operations/non_ot/JoinOperation',
    'operations/non_ot/SetViewTypesOperation',
    'operations/non_ot/InitModelTypesOperation',
    'operations/non_ot/ViewInitOperation',
    'operations/non_ot/PerformCvgOperation',
    'operations/non_ot/DeleteCvgOperation',
    'operations/non_ot/DeleteViewOperation',
    'operations/non_ot/SetModelAttributeNodeOperation',
    'operations/non_ot/UpdateViewListOperation'

],/** @lends OperationFactory */function(OTOperation,EntityOperation,NodeAddOperation,NodeDeleteOperation,NodeMoveOperation,NodeResizeOperation,EdgeAddOperation,EdgeDeleteOperation,AttributeAddOperation,AttributeDeleteOperation,ValueChangeOperation,EntitySelectOperation,ToolSelectOperation,ActivityOperation,ExportDataOperation,ExportMetaModelOperation,ExportImageOperation,JoinOperation,SetViewTypesOperation,InitModelTypesOperation,ViewInitOperation,PerformCvgOperation,DeleteCvgOperation,DeleteViewOperation,SetModelAttributeNodeOperation,UpdateViewListOperation) {

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
             * @returns {ActivityOperation|EntitySelectOperation|ToolSelectOperation|ExportDataOperation}
             */
            createOperationFromNonOTOperation: function(operation){
                var type = operation.getType(),
                    data,
                    resOperation = null;

                try {
                    data = JSON.parse(operation.getData());
                } catch (e){
                    return null;
                }

                switch(type){
                    case EntitySelectOperation.TYPE:
                        resOperation = new EntitySelectOperation(data.selectedEntityId, data.destination);
                        resOperation.setNonOTOperation(operation);
                        break;
                    case ToolSelectOperation.TYPE:
                        resOperation = new ToolSelectOperation(data.selectedToolName);
                        break;
                    case ActivityOperation.TYPE:
                        resOperation = new ActivityOperation(data.type,data.entityId,data.sender,data.text,data.data);
                        break;
                    case ExportDataOperation.TYPE:
                        resOperation = new ExportDataOperation(data.requestingComponent,data.data);
                        break;
                    case ExportMetaModelOperation.TYPE:
                        resOperation = new ExportMetaModelOperation(data.requestingComponent,data.data);
                        break;
                    case ExportImageOperation.TYPE:
                        resOperation = new ExportImageOperation(data.requestingComponent,data.data);
                        break;
                    case JoinOperation.TYPE:
                        resOperation = new JoinOperation(data.user,data.done,data.sender,data.data,data.component);
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
                    case PerformCvgOperation.TYPE:
                        resOperation = new PerformCvgOperation(data.json, data.map);
                        break;
                    case DeleteCvgOperation.TYPE:
                        resOperation = new DeleteCvgOperation(data.deleteList);
                        break;
                    case DeleteViewOperation.TYPE:
                        resOperation = new DeleteViewOperation(data.viewId);
                        break;
                    case SetModelAttributeNodeOperation.TYPE:
                        resOperation = new SetModelAttributeNodeOperation();
                        break;
                    case UpdateViewListOperation.TYPE:
                        resOperation = new UpdateViewListOperation();
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
                                                value.oType
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
                                                value.json
                                            );
                                            break;
                                    }
                                    break;
                                case CONFIG.IWC.POSITION.NODE.POS:
                                    resOperation = new NodeMoveOperation(
                                        entityId,
                                        value.offsetX,
                                        value.offsetY
                                    );
                                    break;
                                case CONFIG.IWC.POSITION.NODE.Z:
                                    resOperation = new NodeMoveOperation(
                                        entityId,
                                        value.offsetZ
                                    );
                                    break;
                                case CONFIG.IWC.POSITION.NODE.DIM:
                                    resOperation = new NodeResizeOperation(
                                        entityId,
                                        value.offsetX,
                                        value.offsetY
                                    );
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
                                        value.oType
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
                            } catch (e){
                                return null;
                            }
                            switch(operation.getType()){
                                case CONFIG.OPERATION.TYPE.INSERT:
                                    resOperation = new AttributeAddOperation(
                                        entityId,
                                        value.subjectEntityId,
                                        value.rootSubjectEntityId,
                                        value.type
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
                                operation.getPosition(),
                                operation.getFromView()
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