requirejs.config({
    baseUrl:"<%= grunt.config('baseUrl') %>/js",
    paths: {
        chai : "lib/vendor/test/chai",
        mocha:'lib/vendor/test/mocha',
        WebConsoleReporter:'./../test/WebConsole'
    }
});
define(['jquery','chai','WebConsoleReporter',
        'canvas_widget/EntityManager',
        './../test/canvas_widget/CreateNodeTester',
        './../test/canvas_widget/CreateEdgeTester',
        './../test/canvas_widget/NodeDeleteTester',
        './../test/canvas_widget/EdgeDeleteTester',
        'mocha'],
    function($,chai, WebConsoleReporter,EntityManager,CreateNodeTester,CreateEdgeTester,NodeDeleteTester,EdgeDeleteTester){

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

                    var objectClassTester = new CreateNodeTester('META - Create Object node', canvas);
                    objectClassTester.test_createNode('Object',4200,4400,100,200,1000,null,'1234567890', function(nodeId){

                        describe('CANVAS - Edit label of Object node', function(){
                            var node = null;
                            before(function(done){
                                node = EntityManager.find(nodeId);
                                this.timeout(1000);
                                node.getLabel().getValue().setValue('Test Label');
                                done();
                            });

                            it('Object node should have a label in model and DOM', function(){
                                expect(node.getLabel().getValue().getValue()).to.be.equal('Test Label');
                            });

                            it('Object node should have a label in ytext', function(){
                                var ytext = node.getLabel().getValue().getYText();
                                expect(ytext).to.be.not.null;
                                expect(ytext.toString()).to.be.equal('Test Label');
                            });

                        });

                        var abstractClassTester = new CreateNodeTester('Meta - Create Abstract node', canvas);
                        abstractClassTester.test_createNode('Abstract Class', 4200, 4100, 200,100, 1000, null, null, function(nodeId2){
                            var bi_dir_assoTester = new CreateEdgeTester('META - Create Generalisation edge',canvas);
                            bi_dir_assoTester.test_createEdge('Generalisation',nodeId,nodeId2,null,null, function(edgeId){
                                EdgeDeleteTester('META - Delete Generalisation from object to abstract class', edgeId);

                                NodeDeleteTester('META - Delete abstract class node', nodeId2);
                            });


                        });

                        var relationshipClassTester = new CreateNodeTester('Meta - Relationship node', canvas);
                        relationshipClassTester.test_createNode('Relationship',4400,4400,100,200,1000,null, null, function(nodeId2){
                            var bi_dir_assoTester = new CreateEdgeTester('META - Create Bi-Dir-Association edge',canvas);
                            bi_dir_assoTester.test_createEdge('Bi-Dir-Association',nodeId,nodeId2,null,null, function(edgeId){

                                NodeDeleteTester('META - Delete object node', nodeId);

                                EdgeDeleteTester('META - Delete Bi-Dir-Assocation from object to relationship', edgeId, true);

                                NodeDeleteTester('META - Delete relationship node', nodeId2);

                            });
                        });
                    });
                }
            });
            mocha.run();
        }
        return CanvasWidgetTestMain;
    });