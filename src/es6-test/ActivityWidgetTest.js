import "jquery";
import chai from "chai";
import WebConsoleReporter from "./WebConsole";
import "mocha";
export default function () {
  $("body").append($('<div id="mocha" style="display: none"></div>'));

  mocha.setup("bdd");
  mocha.reporter(WebConsoleReporter);
  //mocha.timeout(5000);

  var expect = chai.expect;
  describe("Activity GUI Test", function () {
    it("ACTIVITY - user list should exists", function () {
      expect($("#user_list").length).to.be.equal(1);
    });
    it("ACTIVITY - acitivity list should exists", function () {
      expect($("#activity_list").length).to.be.equal(1);
    });
  });
  mocha.run();
}
