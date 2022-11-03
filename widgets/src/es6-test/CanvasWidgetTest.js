import { CONFIG } from "../config";
import $ from "jquery";
import chai from "chai";
import WebConsoleReporter from "WebConsoleReporter";
import EntityManager from "canvas_widget/EntityManager";
import MetamodelingTester from "./../test/canvas_widget/MetamodelingTester";
import ModelingTester from "./../test/canvas_widget/ModelingTester";
import JSONtoGraphTester from "./../test/canvas_widget/JSONtoGraphTester";
import ViewpointModelingTest from "./../test/canvas_widget/ViewpointModelingTest";
import Guidancemodel from "promise!Guidancemodel";
import "mocha";
function CanvasWidgetTestMain(canvas) {
  $("body").append($('<div id="mocha" style="display: none"></div>'));

  mocha.setup("bdd");
  mocha.reporter(WebConsoleReporter);
  mocha.timeout(10000);

  var expect = chai.expect;
  describe("Canvas GUI Test", function () {
    it("CANVAS - canvas drawing panel should exists", function () {
      expect($("#canvas").length).to.be.equal(1);
    });

    if (
      EntityManager.getLayer() === CONFIG.LAYER.META &&
      !Guidancemodel.isGuidanceEditor()
    ) {
      //JSONtoGraphTester(canvas);
      MetamodelingTester(canvas);
      //ViewpointModelingTest();
    } else if (Guidancemodel.isGuidanceEditor()) {
      describe("Check node types and edge types in EntityManager", function () {
        it("Depending on the metamodel check initialized node types", function () {
          expect(EntityManager.getNodeType("Initial node")).to.be.not.null;
          expect(EntityManager.getNodeType("Activity final node")).to.be.not
            .null;
          expect(EntityManager.getNodeType("Decision node")).to.be.not.null;
          expect(EntityManager.getNodeType("Fork node")).to.be.not.null;
          expect(EntityManager.getNodeType("Call activity node")).to.be.not
            .null;
          //TODO
        });
        it("Should have Action flow edge, Data flow edge and Association edge", function () {
          expect(EntityManager.getEdgeType("Action flow edge")).to.be.not.null;
          expect(EntityManager.getEdgeType("Data flow edge")).to.be.not.null;
          expect(EntityManager.getEdgeType("Association edge")).to.be.not.null;
        });
      });
    } else {
      ModelingTester(canvas);
    }
  });
  mocha.run();
}
export default CanvasWidgetTestMain;
