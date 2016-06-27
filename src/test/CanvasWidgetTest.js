requirejs.config({
    baseUrl:"<%= grunt.config('baseUrl') %>/js",
    paths: {
        chai : "lib/vendor/test/chai",
        mocha:'lib/vendor/test/mocha',
        WebConsoleReporter:'./../test/WebConsole',
        async:'lib/vendor/async'
    }
});
define(['jquery','chai','async','WebConsoleReporter',
        'canvas_widget/EntityManager',
        './../test/canvas_widget/CreateNodeTester',
        './../test/canvas_widget/CreateEdgeTester',
        './../test/canvas_widget/NodeDeleteTester',
        './../test/canvas_widget/EdgeDeleteTester',
        'mocha'],
    function($,chai,async, WebConsoleReporter,EntityManager,CreateNodeTester,CreateEdgeTester,NodeDeleteTester,EdgeDeleteTester){

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
                    async.parallel({
                            objectNode: async.apply( CreateNodeTester,'META - Create Object node', canvas, ['Object', 4200, 4400, 100, 200, 1000, null, '1234567890']),
                            abstractNode: async.apply(CreateNodeTester,'Meta - Create Abstract node', canvas, ['Abstract Class', 4200, 4100, 200, 100, 1000, null, null]),
                            relationshipNode: async.apply(CreateNodeTester, 'Meta - Relationship node', canvas,['Relationship',4400,4400,100,200,1000,null, null])
                        },
                        function(err, result) {
                            async.parallel({
                                    editLabelTest: function(callback){
                                        describe('CANVAS - Edit label of Object node', function(){
                                            var node = null;
                                            before(function(done){
                                                node = EntityManager.find(result.objectNode);
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
                                            after(function(done){
                                                callback(null, true);
                                                done();
                                            })
                                        });
                                    },
                                    generalisation:async.apply(CreateEdgeTester,'META - Create Generalisation edge',canvas,['Generalisation',result.objectNode,result.abstractNode,null,null]),
                                    biDirAssociation: async.apply(CreateEdgeTester, 'META - Create Bi-Dir-Association edge', canvas, ['Bi-Dir-Association', result.objectNode, result.relationshipNode, null, null])
                                },
                                function(err,edgeList){
                                    async.series([
                                        async.apply(EdgeDeleteTester,'META - Delete Generalisation from object to abstract class', edgeList.generalisation, false),
                                        async.apply(NodeDeleteTester, 'META - Delete abstract class node', result.abstractNode)
                                    ]);

                                    async.series([
                                        async.apply(NodeDeleteTester,'META - Delete object node', result.objectNode),
                                        async.apply(EdgeDeleteTester,'META - Delete Bi-Dir-Assocation from object to relationship', edgeList.biDirAssociation, true),
                                        async.apply(NodeDeleteTester,'META - Delete relationship node', result.relationshipNode)
                                    ])

                                });
                        });
                }
            });
            mocha.run();
        }
        return CanvasWidgetTestMain;
    });