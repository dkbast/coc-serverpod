import {
  ExtensionContext,
  services,
  workspace,
  LanguageClient,
  window,
  TransportKind,
} from "coc.nvim";

import { execSync } from "child_process";
import { satisfies, coerce } from "semver";

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration("coc-serverpod");
  const isEnable = config.get<boolean>("enable", true);
  if (!isEnable) {
    return;
  }

  const serverOptions = {
    command: "serverpod",
    args: ["-q", "language-server"],
    options: {
      env: process.env,
      shell: true,
    },
  };
  const clientOptions = {
    documentSelector: [
      { scheme: "file", language: "yaml", pattern: "**/protocol/**/*.yaml" },
      { scheme: "file", language: "yaml", pattern: "**/models/**/*.yaml" },
      { scheme: "file", pattern: "**/*.spy.yaml" },
      { scheme: "file", pattern: "**/*.spy.yml" },
      { scheme: "file", pattern: "**/*.spy" },
    ],
  };
  const client = new LanguageClient(
    "coc-serverpod", // the id
    "coc-serverpod", // the name of the language server
    serverOptions,
    clientOptions
  );
  context.subscriptions.push(services.registLanguageClient(client));
  client.onReady().then(() => {
    let output;
    try {
      output = execSync("serverpod version");
    } catch (e) {
      window.showErrorMessage(
        "Failed to resolve the Serverpod CLI executable. Please ensure the Serverpod CLI is installed and available on the PATH used by VS Code."
      );
      return;
    }

    if (!validVersion(output.toString().trim())) {
      window.showErrorMessage(
        "The Serverpod CLI version is outdated. Please upgrade to the latest version (minimum required version is 1.2)."
      );
      return;
    }
  });
}

function validVersion(versionString: string): boolean {
  console.log(versionString);
  const versionTag = versionString.split(":")[1];
  const versionNumber = coerce(versionTag);
  if (versionNumber === null) {
    // If we can't parse the version number, assume it's valid
    // since the version format is valid for all pre 1.2 versions.
    return true;
  }

  return satisfies(versionNumber, ">=2.2.0");
}
