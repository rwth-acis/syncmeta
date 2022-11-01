import IWCW from 'iwcw';
import Util from 'Util';
import ExportDataOperation from 'operations/non_ot/ExportDataOperation';
import ExportImageOperation from 'operations/non_ot/ExportImageOperation';
import space from 'promise!Space';

    var componentName = "export"+Util.generateRandomId();

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var iwc = IWCW.getInstance(componentName);

    /**
     * Library allowing widgets to export and convert the graph data
     * @exports MFExport
     */
    var MFExport={
        getJSON: function(callback){
            var cb = function(operation){
                if(operation instanceof ExportDataOperation && typeof callback === 'function'){
                    callback(operation.getData(),space.title);
                    iwc.unregisterOnDataReceivedCallback(cb);
                }
            };
            iwc.registerOnDataReceivedCallback(cb);
            var operation = new ExportDataOperation(componentName,null);
            iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
        },
        getImageURL: function(callback){
            var cb = function(operation){
                if(operation instanceof ExportImageOperation && typeof callback === 'function'){
                    callback(operation.getData(),space.title);
                    iwc.unregisterOnDataReceivedCallback(cb);
                }
            };
            iwc.registerOnDataReceivedCallback(cb);
            var operation = new ExportImageOperation(componentName,null);
            iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
        }
    };

    export default MFExport;


