'use strict';

import chalk from 'chalk';

const colored = fn => () => {
  const enabled = chalk.enabled;
  chalk.enabled = true;
  fn.apply(this, arguments);
  chalk.enabled = enabled;
};

export default knex =>
  async(ctx, next) => {
    const queries = [];

    const captureQueries = builder => {
      const startTime = process.hrtime();
      const group = [];

      builder.on('query', query => {
        group.push(query);
        queries.push(query);
      });

      builder.on('end', () => {
        // all queries are completed at this point.
        // in the future, it'd be good to separate out each individual query,
        // but for now, this isn't something that knex supports. see the
        // discussion here for details:
        // https://github.com/tgriesser/knex/pull/335#issuecomment-46787879
        const diff = process.hrtime(startTime);
        const ms = diff[0] * 1e3 + diff[1] * 1e-6;
        group.forEach(query => {
          query.duration = ms.toFixed(3);
        });
      });
    };

    const logQueries = colored(() => {
      queries.forEach(query =>
        console.log('%s%s%s %s',
          chalk.yellow.bold('  knex:query '),
          chalk.cyan(query.sql),
          chalk.gray('{' + query.bindings.join(', ') + '}'),
          chalk.magenta(query.duration + 'ms')
      ));
    });

    knex.client.on('start', captureQueries);
    await next();
    knex.client.removeListener('start', captureQueries);
    logQueries();
  };
