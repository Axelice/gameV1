console.log('######1');
import express from 'express';
import path from 'path';
import { SERVER_PORT } from './config';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import * as config from './config';

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);
console.log(`*******************************************`);


console.log(`NODE_ENV: ${process.env}`);
debugger;

const app = express();
app.set('view engine', 'ejs');

///
/// facebook
///
import { facebookRouter } from './routes/facebook-router';
app.use(facebookRouter());

///
/// script handling
///
import { scriptRouter } from './routes/script-router';
app.use(scriptRouter());

app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use(staticsRouter());
app.use(pagesRouter());

app.listen(SERVER_PORT, () => {
  console.log(`App listening 1 on port ${SERVER_PORT}!`);
});
