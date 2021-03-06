/*
 * Use Case
 * Run Greenwood build command with no config and plugin installed.
 *
 * User Result
 * Should generate a bare bones Greenwood build with font awesome files in the output directory.
 *
 * User Command
 * greenwood build
 *
 * User Config
 * None (Greenwood Default + plugin)
 *
 * User Workspace
 * Greenwood default (src/)
 */
import chai from 'chai';
import fs from 'fs';
import glob from 'glob-promise';
import path from 'path';
import { Runner } from 'gallinago';
import { fileURLToPath, URL } from 'url';

const expect = chai.expect;

describe('Build Greenwood With: ', function() {
  const LABEL = 'Default Greenwood Configuration and Workspace';
  const cliPath = path.join(process.cwd(), 'node_modules/@greenwood/cli/src/index.js');
  const outputPath = fileURLToPath(new URL('.', import.meta.url));
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
    await runner.runCommand(cliPath, 'build');
  });

  describe(LABEL, function() {
    describe('Copy Font Awesome files to the output directory', function() {
      let files = [];

      before(async function() {
        files = await glob(path.join(process.cwd(), 'node_modules/font-awesome/fonts/*'));
      });

      it('should have a fonts directory in the output path', function() {
        expect(fs.existsSync(path.join(outputPath, 'public/fonts'))).to.be.equal(true);
      });

      it('should have 6 font files in the output path', function() {
        expect(files.length).to.be.equal(6);
      });
    });
  });

  after(function() {
    runner.teardown([
      path.join(outputPath, '.greenwood/'),
      path.join(outputPath, 'node_modules/'),
      path.join(outputPath, 'public/')
    ]);
  });

});