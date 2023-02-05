import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import IWCW from "./lib/IWCWrapper";
import NonOTOperation from "./operations/non_ot/NonOTOperation";
import { CONFIG } from "./config";

export async function WaitForCanvas(
  widgetName,
  doc,
  maxAttempts = 10,
  interval = 300
) {
  const iwc = IWCW.getInstance(widgetName, doc);
  var gotResponseFromCanvas = false;
  var canvasResponse = null;

  iwc.registerOnDataReceivedCallback((operation) => {
    // wait for canvas to respond
    if (operation.hasOwnProperty("getType")) {
      if (operation.getType() === "WaitForCanvasOperation") {
        gotResponseFromCanvas = true;
        canvasResponse = operation.getData();
      }
    }
  });
  try {
    await poll({
      interval,
      maxAttempts,
      validate: () => gotResponseFromCanvas, // we are done when we get a response from canvas
      action: () => {
        // send a message to canvas
        const operation = new NonOTOperation(
          "WaitForCanvasOperation",
          JSON.stringify({ widget: widgetName })
        );
        iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation);
      },
    });

    return canvasResponse;
  } catch (error) {
    throw error;
  }
}

async function poll({ action, validate, interval, maxAttempts }) {
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    const result = await action();
    attempts++;
    if (validate(result)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error("Exceeded max attempts"));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
}
