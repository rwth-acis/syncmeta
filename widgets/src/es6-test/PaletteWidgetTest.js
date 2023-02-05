import "jquery";
import chai from "chai";
import WebConsoleReporter from "../es6-test/WebConsole";
import "mocha";

export default function () {
  $("body").append($('<div id="mocha" style="display: none"></div>'));

  mocha.setup("bdd");
  mocha.reporter(WebConsoleReporter);
  //mocha.timeout(5000);

  var expect = chai.expect;
  describe("Palette GUI Test", function () {
    it("PALETTE - palette container should exists", function () {
      expect($("#palette").length).to.be.equal(1);
    });
  });
  mocha.run();
}
