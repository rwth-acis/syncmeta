import CollaborationStrategy from "./CollaborationStrategy";

class AvoidConflictsStrategy extends CollaborationStrategy {
  static NAME = "Avoid Conflicts Strategy";
  static ICON = "user";
  constructor() {}
  onGuidanceOperation(data) {
    //Do not accept any collaboration guidance
  }
}

export default AvoidConflictsStrategy;
