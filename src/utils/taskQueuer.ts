type Task = () => Promise<any>;
export class TaskQueuer {
  protected _tasks: Task[] = [];
  protected _currentTask: Task | null = null;
  protected next: (result: IteratorResult<Task>) => void = (_) => {};
  protected reject: () => void = () => {};
  protected promise: Promise<IteratorResult<Task>> = new Promise(() => {});

  protected setPromise() {
    this.promise = new Promise<IteratorResult<Task>>((resolve, reject) => {
      this.next = resolve;
      this.reject = reject;
    }).then((result) => {
      if (result.done) {
        return result;
      }
      this._currentTask = result.value;
      this.setPromise();
      return result;
    });
  }

  protected dispatchNextTask() {
    if (!this._currentTask && this._tasks.length > 0) {
      const task: Task = this._tasks.shift() as Task;
      this.next({ done: false, value: task });
    }
  }

  public get currentTask(): Task | null {
    return this._currentTask;
  }

  public get tasks(): AsyncIterable<Task> {
    const queue = this;
    return {
      [Symbol.asyncIterator]: () => ({
        next: async () => queue.promise,
      }),
    };
  }

  public start() {
    this.setPromise();
    (async () => {
      for await (const task of this.tasks) {
        await task();
        this._currentTask = null;
        this.dispatchNextTask();
      }
    })();
  }

  public queue(task: Task) {
    this._tasks.push(task);
    this.dispatchNextTask();
  }
}
