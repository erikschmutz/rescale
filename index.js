import { exec } from "child_process";
import fs from "fs";

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd) {
  return new Promise(function(resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

function parseFile(string) {
  const regex = /\d{0,}px/g;
  const found = string.match(regex);

  if (found) {
    const value = found.map(value => {
      const v = value.split("px")[0];
      const newValue = parseInt(v) * scale;
      return newValue + "vh";
    });

    found.map((fss, index) => {
      string = string.replace(new RegExp(fss, "g"), value[index]);
    });
  }

  return string;
}

function parseFileReverse(string) {
  const regex = /\d{0,}vh/g;
  const found = string.match(regex);

  if (found) {
    const value = found.map(value => {
      const v = value.split("px")[0];
      const newValue = parseInt(v) / scale;
      return newValue + "px";
    });

    found.map((fss, index) => {
      string = string.replace(new RegExp(fss, "g"), value[index]);
    });
  }

  return string;
}

async function main() {
  let command = "find ./ -name *.scss ";
  let { stdout } = await sh(command);

  for (let path of stdout.split("\n")) {
    if (fs.existsSync(path)) {
      let file = fs.readFileSync(path, "utf-8");
      let string;
      if (reverse) {
        console.log(`Reversing the file ${path}`);
        string = parseFileReverse(file);
      } else {
        console.log(`Scaling the file ${path}, scale ${scale}`);
        string = parseFile(file);
      }
      fs.writeFileSync(path, string);
    }
  }
}

const scale = process.argv[process.argv.indexOf("-s")] || 0.3;
const reverse = process.argv.includes("-r");

main();
