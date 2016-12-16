# Knex Logger for Koa2

A koa2 port of [knex-logger](https://github.com/wbyoung/knex-logger)

## Install
This project is unpublished for now.

## Use
```javascript
import koa from 'koa';

import knex from 'knex';
import knexfile from 'path/to/knexfile'
import knexLogger from 'path/to/knexlogger';

const app = koa();
const db = knex(knexfile);

app.use(knexLogger(db));
```

## TODO
- [ ] Publish
- [ ] Add tests
- [ ] Add CI

## License
This project is distributed under the MIT license.