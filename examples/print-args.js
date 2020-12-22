// Print out the passed in command line arguments.
// Run with `node print-args.js <pass-in-any-args> ...`.
const { parseArgs } = require("parse-args");

const args = parseArgs();
console.log("args = " + JSON.stringify(args));

/*
 * Example:
 *
 * > node print-args.js --long -a -bcd --format=%s file1 file2
 * {"long":true,"a":true,"b":true,"c":true,"d":true,"format":"%s","nonOptions":["file1","file2"]}
 *
 */
