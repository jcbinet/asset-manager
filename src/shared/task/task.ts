import { TaskTypes } from '@/shared/task/enums/task-types';
import { BaseError } from '@/errors/base.error';
import { v4 as uuid } from 'uuid';

/**
 * Task interface
 */
export interface Task {
  uuid: string;
  message: string;
  type: TaskTypes;
  promise: Promise<any>;
  onResolve?: Function;
  complete: boolean;
  error?: BaseError;
  displaySnackbar: boolean;
}

export const newTask = (
  message: string,
  type: TaskTypes,
  promise: Promise<any>,
  onResolve?: Function
) => {
  return {
    uuid: uuid(),
    message: message,
    type: type,
    promise: promise,
    onResolve: onResolve,
    complete: false,
    error: undefined,
    displaySnackbar: true
  };
};
