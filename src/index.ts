import {
  ExtensionContext,
  services,
  workspace,
  LanguageClient,
  window,
  TransportKind,
} from "coc.nvim";

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
    if (!config.get<boolean>("startupMessage", true)) {
      return;
    }
    const executable = serverOptions.command;
    const args = serverOptions.args;
    const cmd =
      args.length === 0 ? executable : `${executable} ${args.join(" ")}`;
    window.showMessage(`coc-serverpod: running "${cmd}"`);
  });
}
