// Data types.
export enum OptionTypes {
  string = "string",
  number = "number",
  integer = "integer",
  boolean = "boolean",
}

// API options.
export type ParseArgsApiOptions = {
  _throwOnErrors?: boolean;
  _returnErrors?: boolean;
  _verbose?: boolean;
  _keepAll?: boolean;
  _flagUnknowns?: boolean;
  _ignoreUnknowns?: boolean;
  _help?: boolean;
  _helpTemplate?: string;
};

// User option config.
declare type GenericConfig<T> = {
  defaultValue?: T;
  isValid?: (value: T) => boolean;
  validationError?: (value: T) => string;
  allowedValues?: T[];
};

declare type UntypedConfig = GenericConfig<boolean>;
declare type BooleanConfig = { type: "boolean" } & GenericConfig<boolean>;
declare type StringConfig = { type: "string" } & GenericConfig<string>;
declare type NumberConfig = { type: "number" } & GenericConfig<number>;
declare type IntegerConfig = { type: "integer" } & GenericConfig<number>;

export type ParseArgsOptionConfig = {
  alias?: string;
  required?: boolean;
  defaultValue?: any;
  description?: string;
} & (
  | UntypedConfig
  | BooleanConfig
  | StringConfig
  | NumberConfig
  | IntegerConfig
);

// Merged options.
export type ParseArgsOptions = {
  [optionName: string]: ParseArgsOptionConfig;
} & ParseArgsApiOptions;

// Return value.
export type ParseArgsResult = {
  [optionName: string]: unknown;
  nonOptions?: string[];
  errors?: string[];
};

// Placeholder text for use in the "_helpTemplate" API option to
// find and replace for the options help text.
export declare const helpTemplatePlaceholder = "{OPTIONS}";

// API methods.
export declare function setOutputPrinter(printer: (s: string) => void): void;

export declare function getHelpText(options: ParseArgsOptions): string;

export declare function printHelp(options: ParseArgsOptions): void;

export declare function parseArgs(options?: ParseArgsOptions): ParseArgsResult;
export declare function parseArgs(
  argv?: string[],
  options?: ParseArgsOptions
): ParseArgsResult;

// Class interface.
export declare class ArgsParser {
  constructor(options?: ParseArgsOptions);

  parse(argv?: string[]): ParseArgsResult;

  getHelpText(): string;

  printHelp(): void;
}
