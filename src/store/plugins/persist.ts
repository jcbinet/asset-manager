import { MutationPayload, Store } from 'vuex';
import path from 'path'
import { app, remote } from 'electron';
import fs from 'fs';

/**
 * Custom persist class since dynamic modules were causing problems
 * with popular persist libraries such as: vuex-persist, vuex-persistedstate
 */
export class Persist<S> {

  /**
   * Path to file where state is stored
   */
  filepath: string;

  /**
   * Object to store persisted state once.
   * Each module will then pull their state once registered
   */
  persistedState: any;

  constructor(public filename: string = 'state.json') {
    this.filepath = path.join((app || remote.app).getPath('userData'), filename);
  }

  /**
   * Returns the state for a specific module
   *
   * @param module
   */
  getPersistedState(module: string): any {
    return this.persistedState[module] || {};
  }

  /**
   * Plugin function to use in Store
   *
   * @param store
   */
  plugin = (store: Store<S>) => {

    // Initialize persisted state file if it does not exists
    if (!fs.existsSync(this.filepath)) {
      fs.writeFileSync(this.filepath, '{}', 'utf8');
    }

    this.persistedState = JSON.parse(fs.readFileSync(this.filepath, 'utf8'));

    // Todo: debounce state save to optimize

    // Subscribe to mutations, saving state to file on each mutations
    store.subscribe((mutation: MutationPayload, state: S) => {
      fs.writeFileSync(this.filepath, JSON.stringify(state), 'utf8');
    });
  }
}
