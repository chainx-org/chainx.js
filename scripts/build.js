import path from 'path';
import glob from 'glob';
import execa from 'execa';
import chalk from 'chalk';
import { argv } from 'yargs';

const watch = argv['watch'];
const pkgNames = argv['_'];

function getPackages() {
  return new Promise(resolve => {
    glob('./packages/*', (err, files) => {
      files = files.map(f => path.basename(f)).filter(f => !['e2e-test'].includes(f));
      if (pkgNames.length) {
        resolve(
          files.filter(file => {
            return pkgNames.some(pkgName => {
              return file.includes(pkgName);
            });
          })
        );
      } else {
        resolve(files);
      }
    });
  });
}

async function buildPackage(pkgName) {
  let babelArgs = [
    `packages/${pkgName}/src`,
    '--out-dir',
    `packages/${pkgName}/lib`,
    '--ignore',
    ['**/__tests__/**', '**/__mocks__/**'].join(','),
  ];
  if (watch) {
    console.log(chalk.yellow(`${pkgName} watching... `));
    babelArgs = [...babelArgs, '--watch', '--verbose'];
  }

  try {
    const stream = execa('babel', babelArgs, {
      cwd: path.join(__dirname, '..'),
    }).stdout;
    process.stdout.setMaxListeners(20);
    stream.pipe(process.stdout);
    if (!watch) {
      console.log(chalk.blue(`done ${pkgName}`));
    }
  } catch (err) {
    console.log(chalk.red(err));
  }
}

async function run() {
  const pkgs = await getPackages();
  Promise.all(pkgs.map(buildPackage));
}

run();
