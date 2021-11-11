/*
 * Use Case
 * Run Greenwood develop command with no config and plugin installed.
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
const expect = require('chai').expect;
const glob = require('glob-promise');
const path = require('path');
const request = require('request');
const Runner = require('gallinago').Runner;

// TODO figure out why direct access breaks
// TODO figure out how to test relative reference, which is the standard use case
xdescribe('Develop Greenwood With: ', function() {
  // const LABEL = 'Default Greenwood Configuration and Workspace';
  const cliPath = path.join(process.cwd(), 'node_modules/@greenwood/cli/src/index.js');
  const outputPath = __dirname;
  const hostname = 'http://localhost';
  const port = 1984;
  let fontFiles;
  let runner;

  before(async function() {
    runner = new Runner();

    fontFiles = (await glob(path.join(process.cwd(), 'node_modules/font-awesome/fonts/**')))
      .filter(file => path.extname(file) !== '')
      .map((file) => {
        return {
          source: file,
          destination: path.join(outputPath, 'node_modules/font-awesome/fonts', path.basename(file))
        };
      });

    await runner.setup(outputPath, fontFiles);

    return new Promise(async (resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);

      await runner.runCommand(cliPath, 'develop');
    });
  });

  describe('Develop command with resolution behavior for font awesome fonts (.svg)', function() {
    let response = {};

    before(async function() {
      return new Promise((resolve, reject) => {
        request.get(`${hostname}:${port}/node_modules/font-awesome/fonts/fontawesome-webfont.svg`, (err, res, body) => {
          if (err) {
            reject();
          }

          response = res;
          response.body = body;

          resolve();
        });
      });
    });

    it('should return a 200 status', function(done) {
      expect(response.statusCode).to.equal(200);
      done();
    });

    it('should return the correct content type', function(done) {
      expect(response.headers['content-type']).to.equal('image/svg+xml');
      done();
    });

    it('should return the correct response body', function(done) {
      expect(response.body).to.contain(`<font id="fontawesomeregular" horiz-adv-x="1536" >`); // eslint-disable-line quotes
      done();
    });
  });

  after(function() {
    runner.stopCommand();
    runner.teardown();
  });

});