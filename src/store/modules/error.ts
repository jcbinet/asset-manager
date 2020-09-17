import { Action, Module, RegisterOptions, VuexModule } from 'vuex-class-modules';
import store from '@/store';
import { v4 as uuid } from 'uuid';
import { BaseError } from '@/errors/base.error';

@Module({ generateMutationSetters: true })
export class ErrorModule extends VuexModule {

  private errorMessage: string = '';
  private errorUuid: string = '';

  constructor(options: RegisterOptions) {
    super(options);
  }

  // Current error message
  get getErrorMessage(): string {
    return this.errorMessage;
  }

  // Current error uuid
  get getErrorUuid(): string {
    return this.errorUuid;
  }

  /**
   * Handle any error in application
   *
   * @param error
   */
  @Action handleError(error: Error) {

    // Error was thrown by our app
    if (error instanceof BaseError) {
      this.errorMessage = error.message;
    }
    else {
      this.errorMessage = 'Unknown error. Get help here: ...';
    }

    // Create a uuid for each error
    this.errorUuid = uuid();
  }

}

export const errorModule = new ErrorModule({ store: store, name: 'error' });
