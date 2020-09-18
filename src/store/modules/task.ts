import { Action, Module, RegisterOptions, VuexModule } from 'vuex-class-modules';
import store from '@/store';
import { Task } from '@/shared/task/task';
import { BaseError } from '@/errors/base.error';
import { errorModule } from '@/store/modules/error';

@Module({ generateMutationSetters: true })
export class TaskModule extends VuexModule {

  private tasks: Task[] = [];

  constructor(options: RegisterOptions) {
    super(options);
  }

  // Get tasks
  get getTasks(): Task[] {
    return this.tasks;
  }

  /**
   * Add a new task
   *
   * @param task
   */
  @Action async addTask(task: Task): Promise<void> {

    this.tasks.push(task);

    try {
      (await task.promise);
      task.complete = true;
    }
    catch (error) {
      if (error instanceof BaseError) {
        task.error = error;
      }
      else {
        errorModule.handleError(error);
      }
    }
    finally {
      setTimeout(() => {
        task.displaySnackbar = false;
      }, 3000);
    }
  }

}

export const taskModule = new TaskModule({ store: store, name: 'task' });
