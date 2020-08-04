import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

class Queue<T> {
  public event: Subject<T> = new Subject<T>();
  constructor(public name: string) {
  }
}

@Injectable()
export class NotificationNgxService {
  private queues: Array<Queue<any>> = [];

  constructor() {
  }

  private create_queue<T>(name: string): Queue<T> {
    const queue = new Queue<T>(name);
    this.queues.push(queue);
    return queue;
  }

  public raise<T>(name: string, event: T): Queue<T> {
    const queue: Queue<T> = (this.queues.find(q => q.name === name) || this.create_queue<T>(name));
    queue.event.next(event);
    return queue;
  }

  public on<T>(name: string): Subject<T> {
    const queue = (this.queues.find(q => q.name === name) || this.create_queue<T>(name));
    return queue.event;
  };


}