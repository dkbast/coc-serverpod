"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(src_exports);
var import_coc = require("coc.nvim");
async function activate(context) {
  const config = import_coc.workspace.getConfiguration("coc-serverpod");
  const isEnable = config.get("enable", true);
  if (!isEnable) {
    return;
  }
  const serverOptions = {
    command: "serverpod",
    args: ["-q", "language-server"],
    options: {
      env: process.env,
      shell: true
    },
    transport: import_coc.TransportKind.stdio
  };
  const clientOptions = {
    revealOutputChannelOn: RevealOutputChannelOn.Info,
    documentSelector: [
      { scheme: "file", language: "yaml", pattern: "**/protocol/**/*.yaml" },
      { scheme: "file", language: "yaml", pattern: "**/models/**/*.yaml" },
      { scheme: "file", pattern: "**/*.spy.yaml" },
      { scheme: "file", pattern: "**/*.spy.yml" },
      { scheme: "file", pattern: "**/*.spy" }
    ]
  };
  const client = new import_coc.LanguageClient(
    "coc-serverpod",
    // the id
    "coc-serverpod",
    // the name of the language server
    serverOptions,
    clientOptions
  );
  context.subscriptions.push(import_coc.services.registLanguageClient(client));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
