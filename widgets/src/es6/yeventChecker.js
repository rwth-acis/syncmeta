/**
 * Function to check if the event was triggered by the current user
 * @param {Y.Event} yEvent Y.Event
 * @returns  {boolean} true if the event was triggered by the current user
 */
export function eventWasTriggeredByMe(yEvent) {
  const array = Array.from(yEvent.changes.keys.keys());
  if (!array) return false;
  const modifiedByKey = array.find((key) => key === "modifiedBy");
  if (
    modifiedByKey &&
    yEvent.currentTarget.get(modifiedByKey) === window.y.clientID
  )
    // modified by us
    return true;
  return false;
}
