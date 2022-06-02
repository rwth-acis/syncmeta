define(['lodash', 'lib/vendor/test/chai', 'canvas_widget/EntityManager'], function(_, chai, EntityManager) {
    function EntityManagerTests() {
        var expect = chai.expect;

        describe('EntityManager Test', function() {

            describe('EntityManager meta modeling init test', function() {
                before(function(done) {
                    EntityManager.init();
                    done();
                })

                it('Should be the meta-modeling layer', function() {
                    expect(EntityManager.getLayer()).to.be.equal(CONFIG.LAYER.META);
                })

                it('Should have VML defined', function() {
                    expect(EntityManager.getNodeType('Object')).to.be.not.null;
                    expect(EntityManager.getNodeType('Abstract Class')).to.be.not.null;
                    expect(EntityManager.getNodeType('Relationship')).to.be.not.null;
                    expect(EntityManager.getNodeType('Node Shape')).to.be.not.null;
                    expect(EntityManager.getNodeType('Edge Shape')).to.be.not.null;
                    expect(EntityManager.getNodeType('Relation')).to.be.not.null;
                    expect(EntityManager.getNodeType('Enumeration')).to.be.not.null;

                    expect(EntityManager.getEdgeType('Bi-Dir-Association')).to.be.not.null;
                    expect(EntityManager.getEdgeType('Generalisation')).to.be.not.null;
                    expect(EntityManager.getEdgeType('Uni-Dir-Association')).to.be.not.null;
                })
                describe('Create node & edge test', function() {
                    var id = 'f35d0bc397d18f72991283f5';
                    var json = JSON.parse('{"label":{"id":"f35d0bc397d18f72991283f5[label]","name":"Label","value":{"id":"f35d0bc397d18f72991283f5[label]","name":"Label","value":"enum"}},"left":4047,"top":4427,"width":150,"height":100,"zIndex":16035,"type":"Enumeration","attributes":{"[attributes]":{"id":"[attributes]","name":"Attributes","type":"SingleValueListAttribute","list":{"b4cd54b007d8ea36114d81d4":{"id":"b4cd54b007d8ea36114d81d4","name":"b4cd54b007d8ea36114d81d4","value":{"id":"b4cd54b007d8ea36114d81d4","name":"b4cd54b007d8ea36114d81d4","value":"first"}},"ae14baa2a6dd6f860271a6ed":{"id":"ae14baa2a6dd6f860271a6ed","name":"ae14baa2a6dd6f860271a6ed","value":{"id":"ae14baa2a6dd6f860271a6ed","name":"ae14baa2a6dd6f860271a6ed","value":"second"}},"e4d6d5484715a44b31d574e1":{"id":"e4d6d5484715a44b31d574e1","name":"e4d6d5484715a44b31d574e1","value":{"id":"e4d6d5484715a44b31d574e1","name":"e4d6d5484715a44b31d574e1","value":"thrid"}}}}}}');

                    var objectNode = null, enumNode = null, biDirAsso;
                    before(function(done) {
                        objectNode = EntityManager.createNode('Object', '1234567890', 4000, 4000, 150, 100, 1000, null);

                        enumNode = EntityManager.createNodeFromJSON(json.type, id, json.left, json.top, json.width, json.height, json.zIndex, null, json);

                        biDirAsso = EntityManager.createEdge('Bi-Dir-Association', '1234567891', objectNode, enumNode);

                        done();
                    })

                    it('Create Object node test', function() {
                        expect(objectNode).to.be.not.null;
                        expect(objectNode.getType()).to.be.equal('Object');
                        expect(objectNode.get$node().length).to.be.equal(1);
                        expect(objectNode.get$node().attr('id')).to.be.equal('1234567890');
                        expect(objectNode.get$node().attr('class')).to.be.equal('node object');
                        expect(objectNode.getEntityId()).to.be.equal('1234567890');
                        var appearance = objectNode.getAppearance();
                        expect(appearance.height).to.be.equal(100);
                        expect(appearance.width).to.be.equal(150);
                        expect(appearance.left).to.be.equal(4000);
                        expect(appearance.top).to.be.equal(4000);

                    })

                    it('Create Enum node from JSON test', function() {
                        expect(enumNode).to.be.not.null;
                        expect(enumNode.getType()).to.be.equal(json.type);
                        expect(enumNode.get$node().length).to.be.equal(1);
                        expect(enumNode.get$node().attr('id')).to.be.equal(id);
                        expect(enumNode.get$node().attr('class')).to.be.equal('node class');
                        expect(enumNode.getEntityId()).to.be.equal(id);

                        var appearance = enumNode.getAppearance();
                        expect(appearance.height).to.be.equal(json.height);
                        expect(appearance.width).to.be.equal(json.width);
                        expect(appearance.left).to.be.equal(json.left);
                        expect(appearance.top).to.be.equal(json.top);

                        //Check label
                        expect(enumNode.getLabel().getValue().getValue()).to.be.equal("enum");

                        //Check attributes
                        var attributes = enumNode.getAttribute('[attributes]');
                        expect(attributes).not.to.be.null;
                        expect(attributes.constructor.name).to.be.equal('SingleValueListAttribute');
                        expect(attributes.getName()).to.be.equal(json.attributes['[attributes]'].name);

                        var list = attributes.getAttributes();

                        var attrList = json.attributes['[attributes]'].list;
                        for (var attrKey in attrList) {
                            if (attrList.hasOwnProperty(attrKey)) {
                                expect(list.hasOwnProperty(attrKey)).to.be.true;
                                var attr = list[attrKey];
                                expect(attr.getEntityId()).to.be.equal(attrKey);
                                expect(attr.getValue().getValue()).to.be.equal(attrList[attrKey].value.value);
                            }
                        }
                    })

                    it('Create Bi-Dir-Assocation test', function() {
                        expect(biDirAsso.getType()).to.be.equal('Bi-Dir-Association');
                        expect(biDirAsso.getEntityId()).to.be.equal('1234567891');
                        expect(biDirAsso.getSource()).to.be.equal(objectNode);
                        expect(biDirAsso.getTarget()).to.be.equal(enumNode);

                    })

                    it('Find nodes test', function() {
                        expect(_.keys(EntityManager.getNodes()).length).to.be.equal(2);
                    })

                    it('Find object node test', function() {
                        expect(EntityManager.findNode('1234567890')).to.be.not.null;
                        expect(EntityManager.getNodes().hasOwnProperty('1234567890')).to.be.true;
                        expect(EntityManager.getNodesByType('Object').hasOwnProperty('1234567890')).to.be.true;
                        expect(_.keys(EntityManager.getNodesByType('Object')).length).to.be.equal(1);

                    })

                    it('Find enum node test', function() {
                        expect(EntityManager.findNode(id)).to.be.not.null;
                        expect(EntityManager.getNodes().hasOwnProperty(id)).to.be.true;
                        expect(EntityManager.getNodesByType('Enumeration').hasOwnProperty(id)).to.be.true;
                        expect(_.keys(EntityManager.getNodesByType('Enumeration')).length).to.be.equal(1);
                    })

                    it('Find Bi-Dir edge test', function() {
                        expect(EntityManager.findEdge('1234567891')).to.be.not.null;
                        expect(EntityManager.getEdgesByType('Bi-Dir-Association').hasOwnProperty('1234567891')).to.be.true;
                    })

                    it('Check object node connections and neighbors', function() {
                        expect(objectNode.getOutgoingEdges().hasOwnProperty('1234567891')).to.be.true;
                        expect(objectNode.getIngoingEdges().hasOwnProperty('1234567891')).to.be.false;
                        expect(objectNode.getNeighbors().hasOwnProperty(id)).to.be.true;
                    })

                    it('Check enum node connections and neightbors', function() {
                        expect(enumNode.getOutgoingEdges().hasOwnProperty('1234567891')).to.be.false;
                        expect(enumNode.getIngoingEdges().hasOwnProperty('1234567891')).to.be.true;
                        expect(enumNode.getNeighbors().hasOwnProperty('1234567890')).to.be.true;
                    })

                    describe('Delete node & edges tests', function() {
                        before(function(done) {
                            EntityManager.deleteEdge('1234567891');
                            EntityManager.deleteNode(id);
                            EntityManager.deleteNode('1234567890');
                            done();
                        })

                        it('Bi-Dir-Association edge should no longer be in EntityManager', function() {
                            expect(EntityManager.getEdges().hasOwnProperty('1234567891')).to.be.false;
                            expect(EntityManager.findEdge('1234567891')).to.be.null;
                        })

                        it('object node should no longer be in EntityManager', function() {
                            expect(EntityManager.findNode('1234567890')).to.be.null;
                            expect(EntityManager.getNodes().hasOwnProperty('1234567890')).to.be.false;

                        })

                        it('enum node should no longer be in EntityManager', function() {
                            expect(EntityManager.findNode(id)).to.be.null;
                            expect(EntityManager.getNodes().hasOwnProperty(id)).to.be.false;
                        })
                    })

                })

                describe('Create ModelAttributeNode tests', function() {
                    var modelAttributeNode = null;
                    before(function(done) {
                        modelAttributeNode = EntityManager.createModelAttributesNode();
                        done();
                    })

                    it('Check Properties', function() {
                        expect(modelAttributeNode.getEntityId()).to.be.equal('modelAttributes');

                        var attributes = modelAttributeNode.getAttributes();
                        expect(attributes.hasOwnProperty('modelAttributes[name]')).to.be.true;
                        expect(attributes.hasOwnProperty('modelAttributes[description]')).to.be.true;
                        expect(modelAttributeNode.getLabel().getValue().getValue()).to.be.equal('Model Attributes');
                        expect(modelAttributeNode.get$node().length).to.be.equal(1);
                        expect(modelAttributeNode.get$node().find('.label').text()).to.be.equal('Model Attributes');
                        expect(modelAttributeNode.get$node().is(":visible")).to.be.false;
                    })

                    it('Check double creation', function() {
                        var same = EntityManager.createModelAttributesNode();
                        expect(modelAttributeNode).to.be.equal(same);
                    })

                    describe('Delete ModelAttributesNode test', function() {
                        before(function(done) {
                            EntityManager.deleteModelAttribute();
                            done();
                        })
                        it('Check Deletion', function() {
                            expect(EntityManager.createModelAttributesNode()).to.be.not.equal(modelAttributeNode);

                        })
                    });

                })
            })
        })
    }
    return EntityManagerTests;
})
