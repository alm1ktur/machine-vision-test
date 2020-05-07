import { Injectable } from '@angular/core';
import { StateEnum } from '../static/state.enum';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateControllerService {
  private $state: BehaviorSubject<StateEnum> = new BehaviorSubject<StateEnum>(0);
  private $timer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get state(): StateEnum {
    return this.$state.getValue();
  }

  set state(newState: StateEnum) {
    this.$state.next(newState);
  }

  get stateSubject(): Observable<StateEnum> {
    return this.$state.asObservable();
  }

  get timer(): boolean {
    return this.$timer.getValue();
  }

  set timer(tmp: boolean) {
    this.$timer.next(tmp);
  }

  get timerSubject(): Observable<boolean> {
    return this.$timer.asObservable();
  }
}
