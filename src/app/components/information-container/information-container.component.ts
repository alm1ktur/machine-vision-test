import { Component, OnInit } from '@angular/core';
import { StateControllerService } from '../../services/state-controller.service';
import { StateEnum, StateToMessage } from '../../static/state.enum';

@Component({
  selector: 'app-information-container',
  templateUrl: './information-container.component.html',
  styleUrls: ['./information-container.component.css']
})
export class InformationContainerComponent implements OnInit {

  public state: StateEnum;

  constructor(private stateController: StateControllerService) {
    this.stateController.stateSubject.subscribe(state => {
      this.state = state;
    });
  }

  ngOnInit(): void {
  }

  get messageFromState(): string {
    return StateToMessage[this.state];
  }
}
