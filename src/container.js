/* eslint-disable */

import { install } from 'atom-package-deps';
import logger from 'loglevel';

import RootStore from './store';
import { AthenaIdeView, ConsoleView, NotificationView } from './view';
import AutoCompleteProvider from './autocomplete-provider';
import LintProvider from './lint-provider';
import Subscriptions from './subscriptions';
import googleAnalytics from './google-analytics';

const packageVersion = require("../package.json").version;

export default {

  rootStore: null,
  views: null,
  subscriptions: null,

  autoCompleteProvider: new AutoCompleteProvider(),
  lintProvider: new LintProvider(),

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

      this.rootStore = new RootStore();
      this.views = this._buildViews(this.rootStore);
      this.subscriptions = new Subscriptions(this.rootStore, this.views);

      this._setupGoogleAnalytics();

      if (state) {
        atom.deserializers.deserialize(state);
      }
    }).catch(err => {
      logger.error(err);
    });
  },

  _buildViews(rootStore) {
    return {
      athenaIdeView: new AthenaIdeView(rootStore),
      consoleView: new ConsoleView(rootStore),
      notificationView: new NotificationView(rootStore)
    };
  }, 

  _setupGoogleAnalytics() {
    let isEnabled = atom.config.get("athena-ide-atom.enableGoogleAnalytics");
    if (isEnabled) {
      logger.info("Google analytics is enabled");
      logger.info("Package version", packageVersion);
      googleAnalytics.event("Athena IDE Atom", "Open", packageVersion);
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