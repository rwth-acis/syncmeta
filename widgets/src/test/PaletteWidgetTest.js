require.config({
  baseUrl: "<%= grunt.config('baseUrl') %>/js",
  paths: {
    chai: "lib/vendor/test/chai",
    mocha: "lib/vendor/test/mocha",
    WebConsoleReporter: "./../test/WebConsole",
  },
});
require(["jquery", "chai", "WebConsoleReporter", "mocha"], function (
  $,
  chai,
  WebConsoleReporter
) {
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
});
