import readline from "readline";
import { execSync } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "What operation do you want to perform? (clean/build/make/update/remake/setup/test/spec/cli/upload)\n",
  (answer) => {
    switch (answer.trim()) {
      case "clean":
        console.clear();
        console.log("INFO: Performing clean operation...");
        execSync("yarn run clean", { stdio: "inherit" });
        break;
      case "build":
        console.clear();
        console.log("INFO: Performing build operation...");
        execSync("yarn run build", { stdio: "inherit" });
        break;
      case "make":
        console.clear();
        console.log("INFO: Performing make operation...");
        execSync("yarn run make", { stdio: "inherit" });
        break;
      case "update":
        console.clear();
        console.log("INFO: Performing update operation...");
        execSync("yarn run update", { stdio: "inherit" });
        break;
      case "remake":
        console.clear();
        console.log("INFO: Performing remake operation...");
        execSync("yarn run remake", { stdio: "inherit" });
        break;
      case "setup":
        console.clear();
        console.log("INFO: Performing setup operation...");
        execSync("yarn run setup", { stdio: "inherit" });
        break;
      case "test":
        console.clear();
        console.log("INFO: Performing test operation...");
        execSync("yarn run test", { stdio: "inherit" });
        break;
      case "spec":
        console.clear();
        console.log("INFO: Performing spec operation...");
        execSync("yarn run spec", { stdio: "inherit" });
        break;
      case "cli":
        console.clear();
        console.log("INFO: Performing cli operation...");
        execSync("yarn run cli", { stdio: "inherit" });
        break;
      case "upload":
        console.clear();
        console.log("INFO: Performing upload operation...");
        execSync("yarn run upload", { stdio: "inherit" });
        break;
      default:
        console.clear();
        console.log("ERROR: Invalid operation selected.");
    }

    rl.close();
  }
);
