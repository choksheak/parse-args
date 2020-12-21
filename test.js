const { deepStrictEqual } = require("assert");
const { setOutputPrinter, parseArgs } = require("./index");
const {
  setOutputPrinter: setOutputPrinter2,
  parseArgs: parseArgs2,
} = require("./publish/index");

const U = undefined;
const T = true;

const toStr = (v) => (typeof v === "string" ? v : JSON.stringify(v));

const cmp = (actual, expected) =>
  `Actual: ${toStr(actual)}\nExpect: ${toStr(expected)}`;

const split = (s) => (typeof s === "string" ? s.split(" ") : s);

const json = (s) =>
  typeof s === "string"
    ? JSON.parse(
        s.replace(/([{,])(\w+)(:)/g, '$1"$2"$3').replace(/\bT\b/g, "true")
      )
    : s;

const equal = (testName, actual, expected) =>
  deepStrictEqual(
    actual,
    expected,
    `Failed: ${testName}\n${cmp(actual, expected)}`
  );

// Usage: node test.js <test-name-substr>
const args = parseArgs();
const testNameMatch = (args.args && args.args.join(" ")) || "";

const run = (suiteName, setOutputPrinter, parseArgs) => {
  console.log(`\nRunning test suite "${suiteName}"\n`);

  let numPassed = 0;
  let numFailed = 0;
  let numSkipped = 0;

  const passed = (testName) => {
    console.log(`Passed: ${testName}`);
    numPassed++;
  };

  const fail = (testName, message) => {
    throw new Error(`Failed: ${testName}\n${message}`);
  };

  let loggedText = "";
  const saveLog = (s) => (loggedText = s);

  setOutputPrinter(saveLog);

  const testWrapper = (testName, fn) => {
    if (testNameMatch && !testName.includes(testNameMatch)) {
      numSkipped++;
      return;
    }
    loggedText = "";
    try {
      fn();
    } catch (e) {
      console.error(e);
      numFailed++;
    }
  };

  const ok = (testName, argv, options, expected, fn) =>
    testWrapper(testName, () => {
      const a = [...process.argv.slice(0, 2), ...split(argv)];
      const parsed = parseArgs(a, options);
      equal(testName, parsed, json(expected));
      if (fn) fn(testName);
      passed(testName);
    });

  const bad = (testName, argv, options, expectedError) =>
    testWrapper(testName, () => {
      try {
        parseArgs(split(argv), options);
      } catch (e) {
        if (e.message.includes(expectedError)) return passed(testName);
        fail(testName, cmp(e.message, `".*${expectedError}.*"`));
      }
      fail(
        testName,
        cmp("No exception thrown", `Throws ".*${expectedError}.*"`)
      );
    });

  // No options.

  ok("Empty", [], U, {});

  bad("Bad config option name", U, { _x: {} }, "Unrecognized API option");

  ok("Short 1", "-s", U, "{s:T}");

  ok("Short 2", "-a -b -c", U, "{a:T,b:T,c:T}");

  ok("Short 3", "-abc -d=123", U, `{a:T,b:T,c:T,d:"123"}`);

  ok("Long 1", "--hi --sir -s a b", U, `{hi:T,sir:T,s:T,nonOptions:["a","b"]}`);

  ok("Long 2", "--ab=Y -b=q d -c --", U, `{ab:"Y",b:"q",c:T,nonOptions:["d"]}`);

  ok("Break 1", "--", U, {});

  ok("Break 2", "-- a b", U, `{nonOptions:["a","b"]}`);

  ok("Break 3", "-a -- b", U, `{a:T,nonOptions:["b"]}`);

  // Check options.
  ok(
    "Check options",
    [],
    {
      str: {
        type: "string",
        alias: "s",
        required: T,
        description: "STR",
        isValid: () => T,
        validationError: "VE1",
        allowedValues: ["a", "b", "c"],
      },
      num: {
        type: "number",
        alias: "n",
        defaultValue: 12,
        description: "NUM",
        isValid: () => T,
        validationError: "VE2",
        allowedValues: [1.5, 2.5, 3.5],
      },
      int: {
        type: "integer",
        alias: "i",
        required: T,
        description: "INT",
        isValid: () => T,
        validationError: (s) => "VE3:" + s,
        allowedValues: [1, 2, 3],
      },
      boo: {
        type: "boolean",
        alias: "b",
        defaultValue: false,
        description: "BOO",
        isValid: () => T,
        validationError: (s) => "VE4:" + s,
        allowedValues: [true, false],
      },
      help: {},
      _help: true,
      _throwOnErrors: false,
      _returnErrors: false,
      _verbose: false,
      _keepAll: false,
      _flagUnknowns: true,
      _ignoreUnknowns: true,
    },
    { num: 12, boo: false }
  );

  // Parse with options.
  const options = {
    req: {
      type: "string",
      alias: "r",
      required: T,
      description: "REQ",
    },
    opt: {
      type: "string",
      alias: "o",
      description: "OPT",
    },
    _returnErrors: true,
  };

  ok("Parse with options - basic 1", "--req=a", options, `{req:"a"}`);

  ok("Parse with options - basic 2", "-r=a -o=b", options, `{req:"a",opt:"b"}`);

  ok(
    "Parse with options - empty",
    [],
    options,
    `{errors:["Missing required option \\"--req\\"."]}`
  );

  // Help.
  ok("Help", "--help", { _help: true }, `{help:true}`, (t) => {
    equal(
      t,
      loggedText,
      "\nOptions:\n\n  -?, --help        Show the help text."
    );
  });

  ok("No help", "--help", {}, `{help:true}`, (t) => {
    equal(t, loggedText, "");
  });

  ok(
    "Help ls",
    "-?",
    {
      all: { alias: "a", description: "do not ignore entries starting with ." },
      ctime: {
        alias: "c",
        description:
          "with -lt: sort by, and show, ctime (time of last modification of file status information) with -l: show ctime and sort by name otherwise: sort by ctime",
      },
      format: {
        type: "string",
        description:
          "across -x, commas -m, horizontal -x, long -l, single-column -1, verbose -l, vertical -C",
        required: T,
      },
      _help: true,
    },
    `{help:true}`,
    (testName) => {
      equal(
        testName,
        loggedText,
        `\nOptions:\n\n` +
          `  -a, --all         do not ignore entries starting with .\n` +
          `  -c, --ctime       with -lt: sort by, and show, ctime (time of last\n` +
          `                    modification of file status information) with -l: show\n` +
          `                    ctime and sort by name otherwise: sort by ctime\n` +
          `  --format=...      across -x, commas -m, horizontal -x, long -l, single-column\n` +
          `                    -1, verbose -l, vertical -C\n` +
          `  -?, --help        Show the help text.`
      );
    }
  );

  console.log(
    `\n${suiteName} test results: numPassed=${numPassed}, numFailed=${numFailed}, numSkipped=${numSkipped}`
  );

  return numFailed;
};

if (run("Current", setOutputPrinter, parseArgs) === 0) {
  run("Publish", setOutputPrinter2, parseArgs2);
}
