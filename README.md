# greenwood-plugin-font-awesome

[![GitHub release](https://img.shields.io/github/tag/AnalogStudiosRI/greenwood-plugin-font-awesome.svg)](https://github.com/AnalogStudiosRI/greenwood-plugin-font-awesome/tags)
![GitHub Actions status](https://github.com/AnalogStudiosRI/greenwood-plugin-font-awesome/workflows/Main%20Integration/badge.svg)
[![GitHub issues](https://img.shields.io/github/issues-pr-raw/AnalogStudiosRI/greenwood-plugin-font-awesome.svg)](https://github.com/AnalogStudiosRI/greenwood-plugin-font-awesome/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/AnalogStudiosRI/greenwood-plugin-font-awesome/master/LICENSE.md)

## Overview
A [**Greenwood**](https://www.greenwoodjs.io) plugin for managing [**Font Awesome**](https://fontawesome.com) related dependencies and assets for building and development.

----

This plugin is useful because Font Awesome references its [font files relatively](https://unpkg.com/browse/font-awesome@4.7.0/css/font-awesome.css).
```css
@font-face {
  font-family: 'FontAwesome';
  src: url('../fonts/fontawesome-webfont.eot?v=4.7.0');
  src: url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');
  font-weight: normal;
  font-style: normal;
}
```

This means that these paths need to be resolved specifically to the right location in _node_modules_ where the Font Awesome package is located.  Additionally, this plugin ensures the font files are copied as part of the build process.

## Installation

> This plugin defines the following `peerDependencies`, so please make sure you already have them installed first
>   - `@greenwood/cli@^0.20.0`
>   - `font-awesome@^4.6.3`

Install the plugin using your preferred package manager
```sh
# npm
$ npm install @analogstudiosri/greenwood-plugin-font-awesome --save-dev

# yarn
$ yarn add @analogstudiosri/greenwood-plugin-font-awesome --dev
```

## Usage

Simply add this to the plugins array of your _greenwood.config.js_

```js
import { greenwoodPluginFontAwesome } from 'greenwood-plugin-font-awesome';

export default {
  plugins: [
    ...greenwoodPluginFontAwesome() // notice the spread ... !
  ]
}
```