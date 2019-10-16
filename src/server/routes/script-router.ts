import fs from "fs";
import * as bodyParser from 'body-parser';
import { Router } from 'express';

import * as passportConfig from '../config/passport';

export function scriptRouter() {
  const router = Router();

  router.post('/api/saveScript', passportConfig.isAuthenticated, (req, res, next) => {
    const code = req.body.code;
    const game = req.body.game;
    const user: any = req.user;
    const email: string = user.emails[0].value;
    
    const emailDir = `./tmp/${email}`;
    const file = `${emailDir}/${game}Script.js`;

    if (!fs.existsSync(emailDir)) {
      fs.mkdirSync(emailDir);
    }

    if (!fs.existsSync(file)) {
      fs.openSync(file, "wx");
    }

    fs.writeFileSync(file, code);
  });

  return router;
}
