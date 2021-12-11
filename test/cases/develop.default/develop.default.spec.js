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
import chai from 'chai';
import glob from 'glob-promise';
import path from 'path';
import request from 'request';
import { Runner } from 'gallinago';
import { fileURLToPath, URL } from 'url';

const expect = chai.expect;

describe('Develop Greenwood With: ', function() {
  const LABEL = 'Default Greenwood Configuration and Workspace';
  const cliPath = path.join(process.cwd(), 'node_modules/@greenwood/cli/src/index.js');
  const outputPath = fileURLToPath(new URL('.', import.meta.url));
  const hostname = 'http://localhost';
  const port = 1984;
  let fontFiles;
  let runner;

  describe(LABEL, function() {
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

    describe('Develop command with node modules resolution behavior for font awesome fonts (.svg) should work as expected', function() {
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
        expect(response.body).to.contain(`<font id="FontAwesome" horiz-adv-x="1536" >`); // eslint-disable-line quotes
        done();
      });
    });
  });

  after(function() {
    runner.stopCommand();
    runner.teardown([
      path.join(outputPath, '.greenwood/'),
      path.join(outputPath, 'node_modules/')
    ]);
  });

});