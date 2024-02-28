const { getSetting } = require("../settings");

const info = (message) => {
  console.log(`${new Date().toString()} [EvenBetter] [INFO] ${message}`);
};

const error = (message) => {
  console.error(`${new Date().toString()} [EvenBetter] [ERROR] ${message}`);
};

const debug = (message) => {
  if (getSetting("debugMode") !== "true") return;

  console.log(`${new Date().toString()} [EvenBetter] [DEBUG] ${message}`);
};

export { info, error, debug };
