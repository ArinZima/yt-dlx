import readline from "readline";
import { execSync } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const colors = {
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

rl.question(
  `What operation do you want to perform? (${colors.yellow}clean${colors.reset}/${colors.yellow}build${colors.reset}/${colors.yellow}make${colors.reset}/${colors.yellow}update${colors.reset}/${colors.yellow}remake${colors.reset}/${colors.yellow}setup${colors.reset}/${colors.yellow}test${colors.reset}/${colors.yellow}spec${colors.reset}/${colors.yellow}cli${colors.reset}/${colors.yellow}upload${colors.reset})\n:`,
  (answer) => {
    switch (answer.trim()) {
      case "clean":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing clean operation...${colors.reset}`
        );
        execSync("yarn run clean", { stdio: "inherit" });
        break;
      case "build":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing build operation...${colors.reset}`
        );
        execSync("yarn run build", { stdio: "inherit" });
        break;
      case "make":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing make operation...${colors.reset}`
        );
        execSync("yarn run make", { stdio: "inherit" });
        break;
      case "update":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing update operation...${colors.reset}`
        );
        execSync("yarn run update", { stdio: "inherit" });
        break;
      case "remake":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing remake operation...${colors.reset}`
        );
        execSync("yarn run remake", { stdio: "inherit" });
        break;
      case "setup":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing setup operation...${colors.reset}`
        );
        execSync("yarn run setup", { stdio: "inherit" });
        break;
      case "test":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing test operation...${colors.reset}`
        );
        execSync("yarn run test", { stdio: "inherit" });
        break;
      case "spec":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing spec operation...${colors.reset}`
        );
        execSync("yarn run spec", { stdio: "inherit" });
        break;
      case "cli":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing cli operation...${colors.reset}`
        );
        execSync("yarn run cli", { stdio: "inherit" });
        break;
      case "upload":
        console.clear();
        console.log(
          `${colors.cyan}INFO: Performing upload operation...${colors.reset}`
        );
        execSync("yarn run upload", { stdio: "inherit" });
        break;
      default:
        console.clear();
        console.log(
          `${colors.red}ERROR: Invalid operation selected.${colors.reset}`
        );
    }

    rl.close();
  }
);
