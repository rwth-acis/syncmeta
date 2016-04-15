requirejs.config({
    baseUrl:"<%= grunt.config('baseUrl') %>/js",
    paths: {
        chai : "lib/vendor/test/chai",
        mocha:'lib/vendor/test/mocha',
        WebConsoleReporter:'./../test/WebConsole'
    }
});
define(['jquery','chai','WebConsoleReporter','canvas_widget/EntityManager','mocha'],
    function($,chai, WebConsoleReporter,EntityManager){

        function CanvasWidgetTestMain(canvas){
            $('body').append($('<div id="mocha" style="display: none"></div>'));

            mocha.setup('bdd');
            mocha.reporter(WebConsoleReporter);
            mocha.timeout(5000);

            var expect = chai.expect;
            describe('Canvas GUI Test', function(){
                it('CANVAS - canvas drawing panel should exists', function(){
                    expect($('#canvas').length).to.be.equal(1);
                });
                if(EntityManager.getLayer() === CONFIG.LAYER.META) {
                    it('CANVAS - META - Create Object node ', function(){
                        canvas.createNode('Object',300,300,100,200,1000,null,'1234567890');
                        //TODO very ugly need to think of something better to test this
                        setTimeout(function(){
                            expect($('#1234567890').length).to.be.equal(1);
                            var node = EntityManager.findNode(1234567890);
                            expect(node).to.not.be.null;
                        },1000);
                    })
                }
            });
            mocha.run();
        }
        return CanvasWidgetTestMain;
    });