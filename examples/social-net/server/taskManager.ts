type Task = () => Promise<any>;
export class TaskManager {
  private _tasks: Task[] = [];
  private _currentTask: Task | null = null;
  private next: (result: IteratorResult<Task>) => void = (_) => {};
  private reject: () => void = () => {};
  private promise: Promise<IteratorResult<Task>> = new Promise(() => {});

  private setPromise() {
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

  private dispatchNextTask() {
    if (this._tasks.length > 0) {
      const task: Task = this._tasks.shift() as Task;
      this.next({ done: false, value: task });
    }
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
        this.dispatchNextTask();
      }
    })();
  }

  public queue(task: Task) {
    this._tasks.push(task);
    this.dispatchNextTask();
  }
}
