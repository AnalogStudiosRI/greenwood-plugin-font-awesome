const path = require('path');
const { ResourceInterface } = require('@greenwood/cli/src/lib/resource-interface');
const { getNodeModulesLocationForPackage } = require('@greenwood/cli/src/lib/node-modules-utils');

class FontAwesomeResource extends ResourceInterface {
  async shouldResolve(url) {
    const isFontAweome = url.indexOf('fonts/fontawesome-webfont') > 0;

    return Promise.resolve(isFontAweome);
  }

  async resolve(url) {
    const nodeModulesLocation = getNodeModulesLocationForPackage('font-awesome');
    const barePath = this.getBareUrlPath(url);

    return Promise.resolve(path.join(nodeModulesLocation, barePath));
  }
}

module.exports = (options = {}) => {
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