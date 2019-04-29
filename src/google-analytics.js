import fs from 'fs';
import os from 'os';

import uuidv4 from 'uuid/v4';
import isUUID from 'validator/lib/isUUID';
import ua from 'universal-analytics';
import logger from 'loglevel';

const ACCOUNT_ID = "UA-139075431-1";
const AERGO_TOOLS_DIR = "/.aergo_tools";
const ATHENA_USER_ID = "athena_userid";

class GoogleAnalytics {

  constructor() {
    const aergoToolsDir = os.homedir() + AERGO_TOOLS_DIR;
    const athenaUserId = aergoToolsDir + "/" + ATHENA_USER_ID;

    fs.exists(aergoToolsDir, (existance) => {
      if (!existance) {
        fs.mkdirSync(aergoToolsDir);
      }

      if (!fs.existsSync(athenaUserId)) {
        fs.writeFileSync(athenaUserId, new Buffer(uuidv4()));
      }

      let uuid = fs.readFileSync(athenaUserId).toString('utf-8');
      if (!isUUID(uuid)) {
        logger.info("uuid", uuid, "is invalid. creating new one");
        uuid = uuidv4();
        fs.writeFileSync(athenaUserId, new Buffer(uuid));
      }

      logger.info("Athena user uuid", uuid);
      this.visitor = ua(ACCOUNT_ID, uuid);
    });
  }

  event(category, action, label) {
    this.visitor.event(category, action, label).send();
  }

}

export default new GoogleAnalytics();