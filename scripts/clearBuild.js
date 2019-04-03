import rimraf from 'rimraf';
import glob from 'glob';
import chalk from 'chalk';

const rimrafAsync = (...args) => {
  return new Promise((resolve, reject) => {
    rimraf(...args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const run = () => {
  glob('./packages/*/lib', (error, files) => {
    Promise.all(files.map(p => rimrafAsync(p))).then(() => {
      console.log(chalk.blue('🎉 clear lib is done'));
    });
  });
};

run();
