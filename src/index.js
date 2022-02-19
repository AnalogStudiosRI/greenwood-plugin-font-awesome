// import fs from 'fs';
import path from 'path';
import { ResourceInterface } from '@greenwood/cli/src/lib/resource-interface.js';
import { getNodeModulesLocationForPackage } from '@greenwood/cli/src/lib/node-modules-utils.js';

class FontAwesomeResource extends ResourceInterface {
  constructor(compilation, options) {
    super(compilation, options);
  }

  async shouldResolve(url) {
    // we only want to resolve relative paths to fontawesome
    // like how it gets referenced in its own CSS
    const isFontAweome = url.indexOf('fonts/fontawesome-webfont') >= 0 && url.indexOf('node_modules') < 0;

    return Promise.resolve(isFontAweome);
  }

  async resolve(url) {
    const nodeModulesLocation = await getNodeModulesLocationForPackage('font-awesome');
    const barePath = this.getBareUrlPath(url);

    console.debug({ nodeModulesLocation });
    console.debug('FontAwesomeResource', url);
    console.debug({ barePath });
    // console.debug({ location });
    console.debug('resolveRelativeUrl', this.resolveRelativeUrl(nodeModulesLocation, barePath));
    return Promise.resolve(path.join(nodeModulesLocation, this.resolveRelativeUrl(nodeModulesLocation, barePath)));
  }
}

const greenwoodPluginFontAwesome = (options = {}) => {
  return [{
    type: 'copy',
    name: 'plugin-font-awesome:copy',
    provider: (compilation) => {
      const { outputDir, projectDirectory } = compilation.context;

      return [{
        from: path.join(projectDirectory, 'node_modules/font-awesome/fonts'),
        to: path.join(outputDir, 'fonts')
      }];
    }
  }, {
    type: 'resource',
    name: 'plugin-font-awesome:resource',
    provider: (compilation) => new FontAwesomeResource(compilation, options)
  }];
};

export {
  greenwoodPluginFontAwesome
};