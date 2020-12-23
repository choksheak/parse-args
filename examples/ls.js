// Advanced example. Run with `node ls.js --help`.
// const { parseArgs } = require("@choksheak/parse-args");
const { parseArgs } = require("../index");

const args = parseArgs({
  long: { alias: "l", description: "use a long listing format" },
  accesstime: {
    alias: "u",
    type: "boolean",
    description:
      "with -lt: sort by, and show, access time; " +
      "with -l: show access time and sort by name; " +
      "otherwise: sort by access time",
  },
  _help: true,
  _ignoreUnknowns: true,
  _helpTemplate:
    "\nUsage: node ls.js <options>\n\n" +
    "  List all your files!\n\n" +
    "Options:\n\n{OPTIONS}\n\n" +
    "Have fun seeing all your files!\n",
});

console.log("args = " + JSON.stringify(args));

/*
 * Example:
 *
 * > node ls.js --help
 *
 * Usage: node ls.js <options>
 *
 *   List all your files!
 *
 * Options:
 *
 *   -l, --long        use a long listing format
 *   -u, --accesstime  with -lt: sort by, and show, access time; with -l: show
 *                     access time and sort by name; otherwise: sort by access time
 *   -?, --help        Show the help text.
 *
 * Have fun seeing all your files!
 *
 * args = {"help":true}
 *
 */
