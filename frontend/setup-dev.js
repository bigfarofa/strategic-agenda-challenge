const fs = require("fs");



const LABEL = "[setup-dev.js]";
if ((fs.existsSync("./env")) === false) {
  fs.copyFileSync("dev.env", ".env");
  console.log(LABEL, "Created .env");
  
}


