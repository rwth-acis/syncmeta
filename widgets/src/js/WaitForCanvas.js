define(['jquery','iwcw','operations/non_ot/NonOTOperation'], function($,IWCW,NonOTOperation){
    function WaitForCanvas(widgetName,attempts, frequency){
        var deferred = $.Deferred();
        var iwc = IWCW.getInstance(widgetName);
        var counter = 0, _frequency = 3000;

        if(frequency)
            _frequency = frequency;

        var gotResponseFromCanvas = false;

        var operation = new NonOTOperation('WaitForCanvasOperation', JSON.stringify({widget:widgetName}));
        iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation);

        iwc.registerOnDataReceivedCallback(function(operation){
            if(operation.hasOwnProperty('getType')) {
                if (operation.getType() === 'WaitForCanvasOperation') {
                    gotResponseFromCanvas = true;
                    deferred.resolve(operation.getData());
                }
            }
        });

        var waitForIt = function() {
            setTimeout(function () {
                if (gotResponseFromCanvas) {
                    console.info(widgetName+':Got message from canvas');
                }
                else if(counter < attempts) {
                    console.info(widgetName+':No response from canvas. Send message again.');
                    var operation = new NonOTOperation('WaitForCanvasOperation', JSON.stringify({widget:widgetName}));
                    iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation);
                    counter++;
                    waitForIt();
                }
                else if(counter == attempts){
                    console.info(widgetName+':Attempts execceded');
                    deferred.reject();
                }
            }, _frequency);
        };
        waitForIt();
        return deferred.promise();
    }
    return WaitForCanvas;
});