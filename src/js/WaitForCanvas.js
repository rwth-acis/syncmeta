define(['jquery','iwcw','operations/non_ot/NonOTOperation'], function($,IWCW,NonOTOperation){
    function WaitForCanvas(){
        var deferred = $.Deferred();
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ACTIVITY);

        var gotResponseFromCanvas = false;

        var operation = new NonOTOperation('WaitForCanvasOperation', true);
        iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation);

        iwc.registerOnDataReceivedCallback(function(operation){
            if(operation) {
                if (operation.getType() === 'WaitForCanvasOperation') {
                    gotResponseFromCanvas = true;
                    deferred.resolve(operation.getData());
                }
            }
        });

        var waitForIt = function() {
            setTimeout(function () {
                if (gotResponseFromCanvas) {
                    console.info('Got message from canvas');
                }
                else {
                    console.info('No response from canvas. Send message again.')
                    var operation = new NonOTOperation('WaitForCanvasOperation', true);
                    iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation);
                    waitForIt();
                }
            }, 3000);
        };
        //waitForIt();
        return deferred.promise();
    }
    return WaitForCanvas;
});