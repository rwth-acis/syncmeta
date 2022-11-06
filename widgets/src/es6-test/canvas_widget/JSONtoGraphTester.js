import { $ } from "jquery";
import _ from "lodash-es";
import chai from "chai";
import EntityManager from "canvas_widget/EntityManager";
import JSONtoGraph from "canvas_widget/JSONtoGraph";
import json from "./../test_data/metamodel";

function JSONtoGraphTester(canvas) {
  var expect = chai.expect;
  var nodeKeys = _.keys(json.nodes);
  var edgeKeys = _.keys(json.edges);

  describe("JSONtoGraph Tester", function () {
    before(function (done) {
      JSONtoGraph(json, canvas);
      done();
    });

    it("Should have nodes", function () {
      var nodes = EntityManager.getNodes();
      for (var key in nodes) {
        if (nodes.hasOwnProperty(key) && json.nodes.hasOwnProperty(key)) {
          const nodesMap = y.getMap("nodes");
          expect(nodes[key]).to.be.not.null;
          expect(nodesMap.get(key)).to.be.not.undefined;
          expect($("#" + key).length).to.be.equal(1);
        }
      }
    });

    it("Should have edges", function () {
      var edges = EntityManager.getEdges();
      for (var key in edges) {
        if (edges.hasOwnProperty(key) && json.edges.hasOwnProperty(key)) {
          const edgeMap = y.getMap("edges");
          expect(edges[key]).to.be.not.null;
          expect(edgeMap.get(key)).to.be.not.undefined;
          expect($("." + key).length).to.be.equal(1);
        }
      }
    });

    it("Check the ModelAttribute node and Attributes");
    it("Check Entity object node and attributes");
    it("Check Relationship object node and attributes");
    it("Check the Association Relationship");

    after(function (done) {
      var nodes = EntityManager.getNodes();
      for (var key in nodes) {
        if (nodes.hasOwnProperty(key) && json.nodes.hasOwnProperty(key)) {
          nodes[key].triggerDeletion();
        }
      }
      done();
      describe("Test Cleanup", function () {
        it("Should no longer have nodes", function () {
          _.each(nodeKeys, function (key) {
            expect(EntityManager.findNode(key)).to.be.null;
            const nodesMap = y.getMap("nodes");
            expect(nodesMap.get(key)).to.be.undefined;
            expect($("#" + key).length).to.be.equal(0);
          });
        });

        it("Should no longer have edges", function () {
          _.each(edgeKeys, function (key) {
            const edgeMap = y.getMap("edges");
            expect(EntityManager.findEdge(key)).to.be.null;
            expect(edgeMap.get(key)).to.be.undefined;
            expect($("." + key).length).to.be.equal(0);
          });
        });
      });
    });
  });
}
export default JSONtoGraphTester;
