'use babel';

/* eslint-disable */

import fs from 'fs';
import os from 'os';

import { CompositeDisposable, TextEditor } from 'atom';
import { install } from 'atom-package-deps';
import uuidv4 from 'uuid/v4';
import isUUID from 'validator/lib/isUUID';
import ua from 'universal-analytics';
import logger from 'loglevel';

import RootStore from './store';
import {
  AthenaIdeView, AutoCompleteProvider, ConsoleView, LintProvider, NotificationView, SaveConfirmView
} from './view';
import { editor } from './view';

const ACCOUNT_ID = "UA-139075431-1";
const AERGO_TOOLS_DIR = "/.aergo_tools";
const ATHENA_USER_ID = "athena_userid";

const packageVersion = require("../package.json").version;

export default {

  rootStore: null,
  views: {},
  subscriptions: null,

  autoCompleteProvider: new AutoCompleteProvider(),
  lintProvider: new LintProvider(),

  googleAnalytics: null,

  config: {
    enableGoogleAnalytics: {
      title: "Enable google analytics",
      description: "Send anonymous usage statistics for improvement.",
      type: "boolean",
      default: true,
      order: 1
    }
  },

  activate(state) {
    install('athena-ide-atom').then(() => {
      logger.info("All dependeicies are installed");
    }).catch(err => {
      logger.error(err);
    });

    this.rootStore = new RootStore();
    this.views = this._buildViews(this.rootStore);
    this.subscriptions = this._buildSubscriptions();

    this._setupGoogleAnalytics();

    if (state) {
      atom.deserializers.deserialize(state);
    }
  },

  _buildViews(rootStore) {
    return {
      athenaIdeView: new AthenaIdeView(rootStore),
      consoleView: new ConsoleView(rootStore),
      notificationView: new NotificationView(rootStore)
    };
  },

  _buildSubscriptions() {
    const subscriptions = new CompositeDisposable();
    subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'athena-ide:compile': () => {
          if (editor.isAnyEditorDirty()) {
            new SaveConfirmView(() => this._compile()).show();
          } else {
            this._compile();
          }
      }
      }),
      atom.commands.add('atom-workspace', {
        'athena-ide-view:show': () => {
          this._show();
        }
      }),
      atom.workspace.observeTextEditors(activeEditor => {
        const targetAbsolute = activeEditor.getBuffer().getPath();
        if (this._isContractTarget(targetAbsolute)) {
          const baseDirAndRelative = editor.getBaseDirAndRelativePath(targetAbsolute);
          this.rootStore.deployTargetStore.addTarget(baseDirAndRelative[1], baseDirAndRelative[0]);
          this.rootStore.deployTargetStore.changeTarget(baseDirAndRelative[1]);
        }
      }),
      atom.workspace.onDidChangeActiveTextEditor(activeEditor => {
        if (typeof activeEditor === "undefined") {
          this.rootStore.deployTargetStore.changeTarget("");
          return;
        }

        const targetAbsolute = activeEditor.getBuffer().getPath();
        if (this._isContractTarget(targetAbsolute)) {
          const baseDirAndRelative = editor.getBaseDirAndRelativePath(targetAbsolute);
          this.rootStore.deployTargetStore.addTarget(baseDirAndRelative[1], baseDirAndRelative[0]);
          this.rootStore.deployTargetStore.changeTarget(baseDirAndRelative[1]);
        }
      }),
      atom.workspace.onDidDestroyPaneItem(event => {
        const item = event.item;
        if (item instanceof TextEditor) {
          const targetAbsolute = item.getBuffer().getPath();
          const targetRelative = editor.getRelative(targetAbsolute);
          this.rootStore.deployTargetStore.removeTarget(targetRelative);
        }
      })
    );
    return subscriptions;
  },

  _isContractTarget(path) {
    return /\/\S+\.(lua|ascl)$/.test(path);
  },

  _compile() {
    this._show();
    const baseDir = editor.getProjectRootDir();
    const target = editor.getCurrentByRelative();
    this.rootStore.deployTargetStore.addTarget(target, baseDir);
    this.rootStore.compileStore.compileCurrentTarget();
  },

  _show() {
    this.views.athenaIdeView.show();
    this.views.consoleView.show();
  },

  _setupGoogleAnalytics() {
    let isEnabled = atom.config.get("athena-ide-atom.enableGoogleAnalytics");
    if (isEnabled) {
      logger.info("Google analytics is enabled");
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
        this.googleAnalytics = ua(ACCOUNT_ID, uuid);

        logger.info("Package version", packageVersion);
        this.googleAnalytics.event("Athena IDE Atom", "Open", packageVersion).send();
      });
    }
  },

  deserializeStores(data) {
    logger.info("Deserialize", data);
    this.rootStore.deserialize(data);
  },

  serialize() {
    const data = this.rootStore.serialize();
    return {
      deserializer: "RootStore",
      data: data
    };
  },

  deactivate() {
    Object.keys(this.views).forEach(key => this.views[key].distroy());
    this.views = null;
    this.subscriptions.dispose();
    this.subscriptions = null;
  },

  getProvider () {
    return this.autoCompleteProvider;
  },

  getLinter () {
    return this.lintProvider;
  },

};