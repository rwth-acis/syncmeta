import GuidanceStrategy from "./GuidanceStrategy";


class NoStrategy extends GuidanceStrategy {
  static NAME = "No Strategy";
  static ICON = "ban";
  constructor() {}
  init(logicalGuidanceRepresentation, space) {
    this._super(logicalGuidanceRepresentation, space);
    this.showGuidanceBox("", []);
  }
}

export default NoStrategy;
