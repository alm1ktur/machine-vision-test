import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';
import { Pose } from '@tensorflow-models/posenet';
import { MachineVisionService } from '../../services/machine-vision.service';
import { PersonDictionary } from '../../static/person.static';
import { MachineVision } from '../../static/machine-vision.class';
import { DrawerService } from '../../services/drawer.service';
import { StateControllerService } from '../../services/state-controller.service';
import { StateEnum } from '../../static/state.enum';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.css']
})
export class VideoContainerComponent implements AfterViewInit {
  @ViewChild('video') video: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  public controller: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    private machineVisionService: MachineVisionService,
    private drawerService: DrawerService,
    private stateController: StateControllerService
  ) { }

  ngAfterViewInit() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.nativeElement.srcObject = new MediaStream(stream);
        this.video.nativeElement.play().then(() => {
          this.stateController.state = StateEnum.body;
          // this.controller = of(true);
          this.drawerService.canvas = this.canvas;
        });
      }).catch((err) => {
        alert(err);
      });
    }
  }

  findOrgans() {
    const machineVision = new MachineVision(this.machineVisionService.posenetCoords);
    this.drawerService.drawCoordinates(machineVision.projectAbdomenPoints()[0], machineVision.projectAbdomenPoints()[1],  `#ffffff`);
  }

  async startTimeout() {
    this.stateController.timer = true;
  }

  stopTimeout() {
    this.stateController.timer = false;
  }
}
