import "../../es6/lib/openapp";
import { CONFIG } from "../config";
import $ from "jquery-ui";
function PromiseTest() {
  var resourceSpace = new openapp.oo.Resource(openapp.param.space());

  describe("Promise Test", function () {
    before(function (done) {
      //TODO Add a model and metamodel to the space with the openapp API. See old version of debug widget

      var model = { attributes: {}, nodes: {}, edges: {} };
      var insertModelToSpace = function (type, model) {
        var deferred = $.Deferred();
        resourceSpace.create({
          relation: openapp.ns.role + "data",
          type: type,
          representation: JSON.stringify(model),
          callback: function () {
            deferred.resolve();
          },
        });
        return deferred.promise();
      };

      $.when(
        insertModelToSpace(CONFIG.NS.MY.METAMODEL, model),
        insertModelToSpace(CONFIG.NS.MY.MODEL, model)
      ).done(function () {
        done();
      });
    });

    describe("Native promise Test", function () {
      var spaceP, modelP, metamodelP, guidanceP;
      var expect;
      before(function (done) {
        var d = done;
        requirejs(
          [
            "lib/vendor/test/chai",
            "Space",
            "Model",
            "Metamodel",
            "Guidancemodel",
          ],
          function (chai, Space, Model, Metamodel, Guidancemodel) {
            spaceP = Space;
            modelP = Model;
            metamodelP = Metamodel;
            guidanceP = Guidancemodel;
            expect = chai.expect;
            d();
          }
        );
      });

      describe("Promise Space Test", function () {
        var space;
        before(function (d) {
          spaceP.done(function (s) {
            space = s;
            d();
          });
        });
        it("Check if space title exists", function (done) {
          var spaceTitle = frameElement.baseURI.substring(
            frameElement.baseURI.lastIndexOf("/") + 1
          );
          if (spaceTitle.indexOf("#") != -1 || spaceTitle.indexOf("?") != -1) {
            spaceTitle = spaceTitle.replace(/[#|\\?]\S*/g, "");
          }
          expect(spaceTitle).to.be.equal(space.title);
          done();
        });
        it("Should have a user", function () {
          expect(space.hasOwnProperty("user")).to.be.true;
        });
        it("Should have members", function () {
          expect(space.hasOwnProperty("members")).to.be.true;
        });
      });

      describe("Promise Metamodel Test", function () {
        var metamodel;
        before(function (d) {
          metamodelP.done(function (m) {
            metamodel = m;
            d();
          });
        });
        it("Should have attributes", function (done) {
          expect(metamodel.hasOwnProperty("attributes")).to.be.true;
          done();
        });
      });

      describe("Promise Model Test", function () {
        var model;
        before(function (d) {
          modelP.done(function (m) {
            model = m;
            d();
          });
        });

        it("Should have attributes", function (done) {
          expect(model.hasOwnProperty("attributes")).to.be.true;
          done();
        });
      });

      describe("Promise Guidacemodel Test", function () {
        var guidance;
        before(function (d) {
          guidanceP.done(function (g) {
            guidance = g;
            d();
          });
        });

        it("Should have initial node", function (done) {
          expect(guidance.hasOwnProperty("INITIAL_NODE_LABEL")).to.be.true;
          done();
        });
      });
    });

    describe("Requirejs-promise Test", function () {
      var space, model, metamodel, guidance;
      var expect;
      before(function (done) {
        requirejs(
          [
            "lib/vendor/test/chai",
            "promise!Space",
            "promise!Model",
            "promise!Metamodel",
            "promise!Guidancemodel",
          ],
          function (chai, Space, Model, Metamodel, Guidancemodel) {
            space = Space;
            model = Model;
            metamodel = Metamodel;
            guidance = Guidancemodel;
            expect = chai.expect;
            done();
          }
        );
      });

      describe("Promise Space Test", function () {
        it("Check if space title exists", function () {
          var spaceTitle = frameElement.baseURI.substring(
            frameElement.baseURI.lastIndexOf("/") + 1
          );
          if (spaceTitle.indexOf("#") != -1 || spaceTitle.indexOf("?") != -1) {
            spaceTitle = spaceTitle.replace(/[#|\\?]\S*/g, "");
          }
          expect(spaceTitle).to.be.equal(space.title);
        });
        it("Should have a user", function () {
          expect(space.hasOwnProperty("user")).to.be.true;
        });
        it("Should have members", function () {
          expect(space.hasOwnProperty("members")).to.be.true;
        });
      });
      describe("Promise Metamodel Test", function () {
        it("Should have attributes", function () {
          expect(metamodel.hasOwnProperty("attributes")).to.be.true;
        });
      });

      describe("Promise Model Test", function () {
        it("Should have attributes", function () {
          expect(model.hasOwnProperty("attributes")).to.be.true;
        });
      });

      describe("Promise Guidacemodel Test", function () {
        it("Should have initial node", function () {
          expect(guidance.hasOwnProperty("INITIAL_NODE_LABEL")).to.be.true;
        });
      });
    });

    after(function (done) {
      var cleanSpace = function (type) {
        var deferred = $.Deferred();
        resourceSpace.getSubResources({
          relation: openapp.ns.role + "data",
          type: type,
          onAll: function (contexts) {
            for (let i = 0; i < contexts.length; i++) {
              openapp.resource.del(contexts[i].uri);
            }
            deferred.resolve();
          },
        });
        return deferred.promise();
      };
      $.when(
        cleanSpace(CONFIG.NS.MY.METAMODEL),
        cleanSpace(CONFIG.NS.MY.MODEL)
      ).done(function () {
        done();
      });
    });
  });
}
export default PromiseTest;
