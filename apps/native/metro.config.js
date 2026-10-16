// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// @horon/app and @horon/tokens are workspace packages whose source is bundled
// directly. Bun installs each workspace's dependencies into its own
// node_modules, so without this a file inside packages/app would resolve
// react-native from packages/app/node_modules (a different copy than the app's).
// Force every react / react-native / react-dom require to resolve from the app,
// so a single copy of each is bundled.
const singletons = ["react", "react-native", "react-dom"];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = singletons.some((name) => moduleName === name || moduleName.startsWith(`${name}/`));

  if (isSingleton) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(projectRoot, "index.js") },
      moduleName,
      platform,
    );
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
