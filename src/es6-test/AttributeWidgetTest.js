import "jquery";
import chai from "chai";
import WebConsoleReporter from "WebConsoleReporter";
import "mocha";
$("body").append($('<div id="mocha" style="display: none"></div>'));

mocha.setup("bdd");
mocha.reporter(WebConsoleReporter);
//mocha.timeout(5000);

var expect = chai.expect;
describe("ATTRIBUTE GUI Test", function () {
  it("ATTRIBUTE - wrapper should exists", function () {
    expect($("#wrapper").length).to.be.equal(1);
  });
});
mocha.run();
