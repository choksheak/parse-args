// ISC License (Internet Software Consortium)
// Copyright (c) 2020 ChokSheak Lau

// Command-line arguments parsing.
// Don't use arrow functions and backticks as uglify cannot parse them.

const outPrefix = "[parse-args] ";

const booleanMap = { true: true, 1: true, false: false, 0: false };

const Types = { str: "string", num: "number", int: "integer", boo: "boolean" };

const validTypes = new Set(Object.values(Types));

// Unspecified options will default to boolean type.
const defaultType = Types.boo;

// User options.
const optionHelp = "help";

// API options.
const apiThrowOnErrors = "_throwOnErrors";
const apiReturnErrors = "_returnErrors";
const apiVerbose = "_verbose";
const apiKeepAll = "_keepAll";
const apiFlagUnknowns = "_flagUnknowns";
const apiIgnoreUnknowns = "_ignoreUnknowns";
const apiHelp = "_help";
const apiHelpTemplate = "_helpTemplate";

// User option config.
const configType = "type";
const configAlias = "alias";
const configRequired = "required";
const configDefaultValue = "defaultValue";
const configDescription = "description";
const configIsValid = "isValid";
const configValidationError = "validationError";
const configAllowedValues = "allowedValues";

// Return value property names.
const nonOptionsName = "nonOptions";
const errorsName = "errors";

const reservedOptionNames = new Set([nonOptionsName, errorsName]);

const helpTemplatePlaceholder = "{OPTIONS}";

function raise(s) {
  throw new Error(outPrefix + s);
}

let log = console.log;

function setOutputPrinter(fn) {
  log = fn;
}

function logErr(s) {
  log(outPrefix + s);
}

function isNil(v) {
  return v === undefined || v === null;
}

function isValidNumber(n) {
  return !isNaN(n) && typeof n === "number";
}

function isValidBoolean(b) {
  return typeof b === "boolean" || b in booleanMap;
}

function toBoolean(b) {
  return typeof b === "boolean" ? b : booleanMap[b];
}

function isArray(a) {
  return Array.isArray(a);
}

function isObject(o) {
  return o !== null && typeof o === "object" && !isArray(o);
}

function isString(v) {
  return typeof v === "string";
}

function nilOr(a, b) {
  return isNil(a) ? b : a;
}

function stringify(o) {
  return JSON.stringify(o);
}

function checkPrimitiveType(optionName, type, value, onErr) {
  function err(s) {
    onErr(
      'In option "' +
        optionName +
        '" with value "' +
        value +
        '": Value is not ' +
        s +
        "."
    );
  }

  switch (type || defaultType) {
    case Types.str:
      if (!isString(value)) {
        err("a string");
      }
      return value;
    case Types.num: {
      const n = isString(value) ? parseFloat(value) : value;
      if (!isValidNumber(n)) {
        err("a number");
      }
      return n;
    }
    case Types.int: {
      const n = isString(value) ? parseInt(value) : value;
      if (!isValidNumber(n) || n.toString().includes(".")) {
        err("an integer");
      }
      return n;
    }
    case Types.boo:
      if (!isValidBoolean(value)) {
        err("a boolean");
      }
      return toBoolean(value);
    default:
      onErr(
        'In option "' +
          optionName +
          '" with value "' +
          value +
          '": Unrecognized data type "' +
          v[configType] +
          '"'
      );
  }
}

function validateApiOption(options, k, v) {
  switch (k) {
    case apiThrowOnErrors:
    case apiReturnErrors:
    case apiVerbose:
    case apiKeepAll:
    case apiFlagUnknowns:
    case apiIgnoreUnknowns:
    case apiHelp:
      if (!isValidBoolean(v)) {
        raise(
          'In API option "' +
            k +
            '": Invalid boolean value "' +
            v +
            '". Allowed values are ' +
            stringify(Object.keys(booleanMap)) +
            "."
        );
      }
      options[k] = toBoolean(v);
      break;
    case apiHelpTemplate:
      if (!isString(v)) {
        raise('In API option "' + k + '": Value "' + v + '" is not a string.');
      }
      break;
    default:
      raise('Unrecognized API option "' + k + '".');
  }

  // Auto-add the help option.
  if (k === apiHelp && options[k]) {
    if (isNil(options[optionHelp])) {
      options[optionHelp] = {
        [configType]: Types.boo,
        [configAlias]: "?",
        [configDescription]: "Show the help text.",
      };
    }
  }
}

function validateUserOption(options, k, v) {
  const errorPrefix = 'In user option "' + k + '": ';
  if (k.startsWith("-")) {
    raise(errorPrefix + 'Option names cannot begin with "-".');
  }

  if (reservedOptionNames.has(k)) {
    raise(
      errorPrefix +
        'Option name "' +
        k +
        '" is reserved for use in the return value.'
    );
  }

  // Allow option keys to exist but not specified.
  if (isNil(v)) {
    options[k] = {};
    return;
  }

  if (!isObject(v)) {
    raise(errorPrefix + "Value is not an object.");
  }

  const seenAliases = new Set();

  const entries = Object.entries(v);
  for (let idx = 0; idx < entries.length; idx++) {
    const [k2, v2] = entries[idx];

    if (k2.startsWith("-") || k2.startsWith("_")) {
      raise('User option "' + k + "." + k2 + '" cannot begin with "-" or "_".');
    }

    // Allow option keys to exist but not specified.
    if (isNil(v2)) continue;

    function err(s) {
      raise(
        'In user option "' +
          k +
          "." +
          k2 +
          '" of value ' +
          stringify(v2) +
          ": " +
          s
      );
    }

    switch (k2) {
      case configType:
        if (!validTypes.has(v2)) {
          err('Unrecognized data type "' + v2 + '".');
        }
        break;
      case configAlias:
        if (!isString(v2)) {
          err("Value must be a string.");
        }
        if (v2.length !== 1) {
          err("Value must be one character only.");
        }
        if (v2 === "-" || v2 === "_") {
          err('Option name cannot be "-" or "_".');
        }
        if (seenAliases.has(v2)) {
          err("Duplicate option alias.");
        }
        seenAliases.add(v2);
        break;
      case configRequired:
        if (!isValidBoolean(v2)) {
          err('Invalid boolean value "' + v2 + '".');
        }
        v[k2] = toBoolean(v2);
        break;
      case configDefaultValue: {
        if (!isNil(v[configRequired])) {
          err(
            '"' + configRequired + '" cannot be set when "' + k2 + '" is set.'
          );
        }
        v[k2] = checkPrimitiveType(k + "." + k2, v[configType], v2, raise);
        break;
      }
      case configDescription:
        if (!isString(v2)) {
          err("Value must be a string.");
        }
        break;
      case configIsValid:
        if (!(v2 instanceof Function)) {
          err("Value must be a function.");
        }
        break;
      case configValidationError:
        if (!isString(v2) && !(v2 instanceof Function)) {
          err("Value must be a string or a function.");
        }
        break;
      case configAllowedValues:
        if (!isArray(v2) || v2.length === 0) {
          err("Value must be a non-empty array.");
        }
        for (let i = 0; i < v2.length; i++) {
          v2[i] = checkPrimitiveType(
            k + "." + k2 + "[" + i + "]",
            v[configType],
            v2[i],
            raise
          );
        }
        break;
      default:
        err('Unrecognized user option "' + k2 + '".');
    }
  }
}

function validateOptions(options) {
  if (!isObject(options)) {
    raise("Invalid options given: " + stringify(options));
  }

  const entries = Object.entries(options);
  for (let i = 0; i < entries.length; i++) {
    const [k, v] = entries[i];
    if (k.startsWith("_")) {
      validateApiOption(options, k, v);
    } else {
      validateUserOption(options, k, v);
    }
  }
}

function getDefaultValue(type) {
  // Default is true because this is the value returned when
  // the option is specified by the user.
  switch (type || defaultType) {
    case Types.str:
      return "true";
    case Types.num:
    case Types.int:
      return 0;
    case Types.boo:
      return true;
    default:
      raise('Unrecognized option type "' + type + '".');
  }
}

function handleUnknownOption(options, parsed, onErr, dashName, name, value) {
  if (options[apiFlagUnknowns]) {
    onErr('Unrecognized option "' + dashName + '".');
  }
  if (!options[apiIgnoreUnknowns]) {
    parsed[name] = value;
  }
}

const descriptionIndent = 20;
const helpMaxColumn = 80;
const descriptionWidth = helpMaxColumn - descriptionIndent;

function extractWords(s, len) {
  if (s.length <= len) return [s, ""];
  for (let i = len - 1; i >= 0; i--) {
    if (s[i] === " ") {
      return [s.slice(0, i), s.slice(i + 1)];
    }
  }
  return [s.slice(0, len), s.slice(len)];
}

function getOptionHelpString(name, config) {
  let t =
    "  " +
    (config[configAlias] ? "-" + config[configAlias] + ", " : "") +
    "--" +
    name +
    (config[configRequired] ? "=..." : "");
  let desc = config[configDescription];
  if (!desc) return t;

  if (t.length >= descriptionIndent - 1) {
    t += "\n" + " ".repeat(descriptionIndent);
  } else {
    t += " ".repeat(descriptionIndent - t.length);
  }

  const b = extractWords(desc, descriptionWidth);
  t += b[0];
  desc = b[1];

  while (desc.length > 0) {
    const a = extractWords(desc, descriptionWidth);
    t += "\n" + " ".repeat(descriptionIndent) + a[0];
    desc = a[1];
  }

  return t;
}

function getHelpTextNoTemplate(options) {
  return Object.entries(options)
    .filter(function ([k]) {
      return !k.startsWith("_");
    })
    .map(function ([k, v]) {
      return getOptionHelpString(k, v);
    })
    .join("\n");
}

function getHelpText(options) {
  options = nilOr(options, {});
  const template = nilOr(options[apiHelpTemplate], "\nOptions:\n\n");
  const help = getHelpTextNoTemplate(options);

  return template.includes(helpTemplatePlaceholder)
    ? template.replace(helpTemplatePlaceholder, help)
    : template + help;
}

function printHelp(options) {
  log(getHelpText(options));
}

function checkAndSetOption(options, parsed, onErr, dashName, name, value) {
  // Handle help option.
  if (options[apiHelp] && name === optionHelp) {
    printHelp(options);
  }

  // Handle unknown options.
  if (!(name in options)) {
    // This default value is a tricky case. For unknown options, should they
    // default to string or boolean? It actually doesn't matter since they don't have
    // a specified type, but using boolean here seems to be a bit more intuitive.
    handleUnknownOption(
      options,
      parsed,
      onErr,
      dashName,
      name,
      nilOr(value, true)
    );
    return;
  }

  function err(s) {
    onErr('In option "' + dashName + '": ' + s);
  }

  // Value required.
  const config = options[name];
  if (config[configRequired] && !nilOr(value, "")) {
    err(
      'Required option value must be non-empty, i.e. "' +
        dashName +
        '=<value>".'
    );
    return;
  }

  // Set default value or check data type.
  const ty = config[configType];
  value = isNil(value)
    ? getDefaultValue(ty)
    : checkPrimitiveType(dashName, ty, value, onErr);

  // User validation.
  const iv = config[configIsValid];
  if (iv && !iv(value)) {
    const ve = config[configValidationError];
    let e = ve ? (isString(ve) ? ve : ve(value)) : "";
    e = e ? (isString(e) ? e : stringify(e)) : "";
    e ? onErr(e) : err('Failed user data validation for "' + value + '".');
  }

  // Allowed list.
  const av = config[configAllowedValues];
  if (av && !av.includes(value)) {
    err(
      'Invalid value "' + value + '". Allowed values are ' + stringify(av) + "."
    );
  }

  // Set option value in return value.
  parsed[name] = value;
}

function parseArgs(argv, options) {
  // Check arguments.
  // Supports parseArgs(), parseArgs(options) and parseArgs(argv, options).
  if (isNil(argv) && isNil(options)) {
  } else if (isObject(argv) && isNil(options)) {
  } else if (
    (isNil(argv) || isArray(argv)) &&
    (isNil(options) || isObject(options))
  ) {
  } else {
    raise(
      "Invalid arguments [" +
        stringify(argv) +
        "] and [" +
        stringify(options) +
        "]."
    );
  }

  // Transform arguments.
  if (isObject(argv)) {
    options = argv;
    argv = process.argv;
  } else {
    argv = nilOr(argv, process.argv);
    options = nilOr(options, {});
  }

  // Validate input options structure.
  // This is to catch user errors with using this module.
  validateOptions(options);

  // Remove node executable and script name.
  if (argv.length >= 2 && !options[apiKeepAll]) {
    argv = argv.slice(2);
  }

  // Get user options only.
  const userOptions = Object.entries(options).filter(function ([k]) {
    return !k.startsWith("_");
  });

  // Map aliases to actual option name.
  const aliasToName = {};
  userOptions.forEach(function ([k, v]) {
    return v[configAlias] && (aliasToName[v[configAlias]] = k);
  });

  const parsed = {};
  const errors = [];
  const nonOptions = [];

  function onErr(message) {
    if (options[apiThrowOnErrors]) {
      raise(message);
    }
    if (options[apiReturnErrors]) {
      errors.push(message);
    }
    if (options[apiVerbose]) {
      logErr(message);
    }
  }

  function onCheckAndSet(dashName, name, value) {
    checkAndSetOption(options, parsed, onErr, dashName, name, value);
  }

  let i = 0;
  for (; i < argv.length; i++) {
    const arg = argv[i];

    // User-specified end of options.
    if (arg === "--") {
      argv.slice(i + 1).forEach(function (a) {
        nonOptions.push(a);
      });
      break;
    }

    // Non-option argument.
    if (!arg.startsWith("-")) {
      nonOptions.push(arg);
      continue;
    }

    // Extract value if any.
    const eq = arg.indexOf("=");
    const prefix = eq > 0 ? arg.slice(0, eq) : arg;
    let value = eq > 0 ? arg.slice(eq + 1) : undefined;

    // Handle long options.
    if (arg.startsWith("--")) {
      const name = prefix.slice(2);

      // Name must be valid.
      if (name.startsWith("_") || name.startsWith("-")) {
        onErr(
          'In option "' + arg + '": Option names cannot start with "_" or "-".'
        );
        continue;
      }

      onCheckAndSet(prefix, name, value);
      continue;
    }

    // Handle short options.
    const optionLetters = prefix.slice(1);

    // Only allow specifying value for standalone short options.
    if (value !== undefined && optionLetters.length > 1) {
      onErr(
        'In option "' +
          arg +
          '": Cannot share one value for multiple short options.'
      );
      continue;
    }

    for (let j = 0; j < optionLetters.length; j++) {
      const letter = optionLetters[j];
      const name = nilOr(aliasToName[letter], letter);
      onCheckAndSet("-" + letter, name, value);
    }
  }

  const undefs = userOptions.filter(function ([k]) {
    return parsed[k] === undefined;
  });

  // Check required values.
  undefs
    .filter(function ([_, v]) {
      return v[configRequired];
    })
    .forEach(function ([k]) {
      onErr('Missing required option "--' + k + '".');
    });

  // Set default values.
  undefs
    .filter(function ([_, v]) {
      return !isNil(v[configDefaultValue]);
    })
    .forEach(function ([k, v]) {
      parsed[k] = v[configDefaultValue];
    });

  // Set non-option args if any.
  if (nonOptions.length > 0) {
    parsed[nonOptionsName] = nonOptions;
  }

  // Set errors if any.
  if (errors.length > 0) {
    parsed[errorsName] = errors;
  }

  return parsed;
}

// Use this pseudo-class if you are using OOO.
//
//   const argsParser = ArgsParser(options); // no "new" keyword
//   const argsParser = new ArgsParser(options); // works same as above
//
// Not using the "class" keyword here as it is not supported by uglify.
function ArgsParser(options) {
  // Check arguments.
  if (!isNil(options) && !isObject(options)) {
    raise('Invalid "options" argument [' + stringify(options) + "].");
  }

  return {
    parse: function (argv) {
      parseArgs(argv, options);
    },
    getHelpText: function () {
      return getHelpText(options);
    },
    printHelp: function () {
      printHelp(options);
    },
  };
}

module.exports = {
  setOutputPrinter,
  getHelpText,
  printHelp,
  parseArgs,
  ArgsParser,
};
