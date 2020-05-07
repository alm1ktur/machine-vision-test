import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DrawerService } from '../../services/drawer.service';
import { MachineVisionService } from '../../services/machine-vision.service';
import { Pose } from '@tensorflow-models/posenet';
import { StateControllerService } from '../../services/state-controller.service';

@Component({
  selector: 'app-posenet-qualifier',
  templateUrl: './posenet-qualifier.component.html',
  styleUrls: ['./posenet-qualifier.component.css']
})
export class PosenetQualifierComponent implements OnInit{
  @Input() video: HTMLVideoElement;
  @Input() canvas: HTMLCanvasElement;
  @Input() timer: BehaviorSubject<boolean>;


  private timeout;
  private net;
  private pose: Pose = null;

  constructor(
    private machineVisionService: MachineVisionService,
    private drawerService: DrawerService,
    private stateController: StateControllerService
  ) { }

  ngOnInit(): void {
    this.stateController.timerSubject.subscribe(command => {
      if (command) {
        this.startTimeout().then();
      } else {
        this.stopTimeout();
      }
    });
  }

  async estimatePoseOnImage() {
    return await this.net.estimateSinglePose(this.video, {
      flipHorizontal: false
    });
  }

  async makePosenetAction() {
    const pose = this.estimatePoseOnImage();
    await pose.then(data => {
      this.drawerService.clear();
      this.pose = data;
      data.keypoints.forEach((position) => {
        if (position.score > 0.5) {
          this.drawerService.drawCoordinates(position.position.x, position.position.y);
        }
      });
    });
  }

  async startTimeout() {
    this.net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: {width: 640, height: 480},
      multiplier: 0.75
    });
    this.timeout = setInterval(() => {
      this.makePosenetAction().then();
    }, 100);
  }

  stopTimeout() {
    clearTimeout(this.timeout);
    this.machineVisionService.posenetCoords = this.machineVisionService.convertPoseToDictionary(this.pose);
  }
}
