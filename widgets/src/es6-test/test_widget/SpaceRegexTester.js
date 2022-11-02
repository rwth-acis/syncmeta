import $ from "jquery-ui";
import chai from "lib/vendor/test/chai";
import Util from "Util";
  function SpaceRegexTester() {
    var expect = chai.expect;

    describe("Space Regex test", function () {
      it("Should cut till last / correctly (simplest case)", function () {
        var result = Util.getSpaceTitle(
          "http://127.0.0.1:8073/spaces/my-test-space8"
        );
        expect(result).to.be.equal("my-test-space8");
      });

      it("Should cut / correctly", function () {
        var result = Util.getSpaceTitle(
          "http://127.0.0.1:8073/spaces/my-test-space8/"
        );
        expect(result).to.be.equal("my-test-space8");
      });

      it("Should cut ///////////////// correctly. LoL", function () {
        var result = Util.getSpaceTitle(
          "http://127.0.0.1:8073/spaces/my-test-space8/////////////////"
        );
        expect(result).to.be.equal("my-test-space8");
      });
      it("Should cut ? correctly", function () {
        var result = Util.getSpaceTitle(
          "http://127.0.0.1:8073/spaces/my-test-space8?"
        );
        expect(result).to.be.equal("my-test-space8");
      });
      it("Should cut # correctly", function () {
        var result = Util.getSpaceTitle(
          "http://127.0.0.1:8073/spaces/my-test-space8#"
        );
        expect(result).to.be.equal("my-test-space8");
      });
      it("Should cut ?S* correctly", function () {
        var result = Util.getSpaceTitle(
          "http://127.0.0.1:8073/spaces/my-test-space8?sdkjfsdjfklsjkl"
        );
        expect(result).to.be.equal("my-test-space8");
      });

      it("Should cut #S* correctly", function () {
        var result = Util.getSpaceTitle(
          "http://127.0.0.1:8073/spaces/my-test-space8#ksjfklsjsdlfk"
        );
        expect(result).to.be.equal("my-test-space8");
      });

      it("Should cut /#S* correctly", function () {
        var result = Util.getSpaceTitle(
          "http://127.0.0.1:8073/spaces/my-test-space8/#ksjfklsjsdlfk"
        );
        expect(result).to.be.equal("my-test-space8");
      });

      it("Should cut /?S* correctly", function () {
        var result = Util.getSpaceTitle(
          "http://127.0.0.1:8073/spaces/my-test-space8/?ksjfklsjsdlfk"
        );
        expect(result).to.be.equal("my-test-space8");
      });
    });
  }
  export default SpaceRegexTester;

