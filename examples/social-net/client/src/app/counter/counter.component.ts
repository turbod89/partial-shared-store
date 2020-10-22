import { v4 as uuidv4 } from 'uuid';
import { Component, Input, OnInit } from '@angular/core';
import { CounterModel } from 'counter-store/models';
import { PartiallySharedStoreService } from '../psstore.service';
import { ActionRequestTypes } from 'counter-store/action-requests';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styles: [],
})
export class CounterComponent implements OnInit {
  @Input('counter') counter: CounterModel;

  constructor(private psStore: PartiallySharedStoreService) {}

  ngOnInit(): void {}

  isMine(): boolean {
    return this.psStore.identity.uuid == this.counter.owner.uuid;
  }

  increment() {
    this.psStore.dispatch({
      uuid: uuidv4(),
      type: ActionRequestTypes.Increment,
      author: this.psStore.identity,
      counter: this.counter,
    });
  }
  decrement() {
    this.psStore.dispatch({
      uuid: uuidv4(),
      type: ActionRequestTypes.Decrement,
      author: this.psStore.identity,
      counter: this.counter,
    });
  }
  publish() {
    this.psStore.dispatch({
      uuid: uuidv4(),
      type: ActionRequestTypes.Publish,
      author: this.psStore.identity,
      counter: this.counter,
    });
  }
  unpublish() {
    this.psStore.dispatch({
      uuid: uuidv4(),
      type: ActionRequestTypes.Unpublish,
      author: this.psStore.identity,
      counter: this.counter,
    });
  }
  remove() {
    this.psStore.dispatch({
      uuid: uuidv4(),
      type: ActionRequestTypes.Remove,
      author: this.psStore.identity,
      counter: this.counter,
    });
  }
}
