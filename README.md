<p align="center">
<img src="https://raw.githubusercontent.com/cncolder/vscode-source-map-visualization/main/res/icon.png" height="150">
</p>

<h1 align="center">Source Map Visualization <sup>VS Code</sup></h1>

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=colder.source-map-visualization" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/colder.source-map-visualization.svg?label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
</p>

<p align="center">
This is a visualization of JavaScript/CSS source map data, which is useful for debugging problems with generated source maps. It's designed to be high-performance so it doesn't fall over with huge source maps.
</p>

## Usage

Right clicks on the minify code. Select `Source Map Visualization` in the context menu.

Or press `⌘` `⇧` `P` in the vscode and type `Source Map Visualization`.

Supported source map:

1. Inline base64 source map. `//# sourceMappingURL=data:application/json;base64,`
2. External source map url. `//# sourceMappingURL=index.js.map`
3. Sibling code and source map. `index.js` and `index.js.map`.
4. Guess possible source map. `index.js` and `index.map`.

![Demo](https://raw.githubusercontent.com/cncolder/vscode-source-map-visualization/main/docs/demo.gif)

### Tips

You can select partial code in the editor. This is useful when you want to visualize the source map of a specific `<script>` tag in html.

You can copy and paste the code to the existed `Source Map Visualization` panel.

## Features

- 🚀 Excellent performance.
- 💞 Beauty block highlight and connection animation.
- 🗞 Parse inline source map url.
- 🔗 Load external source map file.
- 🪄 Allow code partial selection. e.g. `<script>` tag in html.
- 🎯 Goto line and column.

## Development

[![CI](https://github.com/cncolder/vscode-source-map-visualization/actions/workflows/ci.yml/badge.svg)](https://github.com/cncolder/vscode-source-map-visualization/actions/workflows/ci.yml)
[![Release](https://github.com/cncolder/vscode-source-map-visualization/actions/workflows/release.yml/badge.svg)](https://github.com/cncolder/vscode-source-map-visualization/actions/workflows/release.yml)

```sh
pnpm i
```

Open VS Code `Run and Debug` panel, select `Extension` to start debugging.

## Release

```sh
pnpm release
```

This script will bump the version, build the extension, and publish it to the vs code marketplace. And then draft a new release on github.

## Thanks

[evanw/source-map-visualization](https://github.com/evanw/source-map-visualization)

## License

[MIT](./LICENSE) License © 2022 [Colder](https://github.com/cncolder)
