/*
 * Use Case
 * Test Run Greenwood develop command with no config and plugin installed.
 *
 * User Result
 * Should run Greenwood dev server and resolve paths to Font Awesome files in node_modules.
 *
 * User Command
 * greenwood develop
 *
 * User Config
 * None (Greenwood Default + plugin)
 *
 * User Workspace
 * Greenwood default (src/)
 */
import chai from 'chai';
import { greenwoodPluginFontAwesome } from '../../src/index.js';

const expect = chai.expect;

describe('FontAwesomeResource: ', function() {

  describe('should resolve when passed a relative reference to font awesome', function() {
    const fontPathUrl = new URL('./fonts/fontawesome-webfont.svg', 'http://localhost:8080');
    let shouldResolve;
    let resolvedPath;

    before(async function() {
      const fontAwesomeResource = greenwoodPluginFontAwesome().filter(plugin => plugin.type === 'resource')[0].provider();

      shouldResolve = await fontAwesomeResource.shouldResolve(fontPathUrl);
      resolvedPath = await fontAwesomeResource.resolve(fontPathUrl);
    });

    it('should resolve the fontPath', function() {
      expect(shouldResolve).to.equal(true);
    });

    it('should return the correctly resolved path', function() {
      expect(resolvedPath.url).to.contain(`/node_modules/font-awesome${fontPathUrl.pathname}`);
    });
  });

});