import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DrawerService } from '../../services/drawer.service';
import { MachineVisionService } from '../../services/machine-vision.service';
import { HandTrackerService } from '../../services/hand-tracker.service';
import * as handTrack from 'handtrackjs';

@Component({
  selector: 'app-posenet-qualifier',
  templateUrl: './posenet-qualifier.component.html',
  styleUrls: ['./posenet-qualifier.component.css']
})
export class PosenetQualifierComponent implements OnInit, AfterViewInit {
  @Input() video: HTMLVideoElement;
  @Input() canvas: HTMLCanvasElement;
  @Input() timer: BehaviorSubject<boolean>;

  private net;
  public developerMode = false;
  public model;

  constructor(
    private machineVisionService: MachineVisionService,
    private drawerService: DrawerService,
    private handTracker: HandTrackerService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.video.onloadeddata = () => this.init().then();
    handTrack.load({
      flipHorizontal: false,
      imageScaleFactor: 0.5,
      maxNumBoxes: 2,
      iouThreshold: 0.5,
      scoreThreshold: 0.79,
    }).then(model => {
      this.model = model;
    });
  }

  async estimatePoseOnImage() {
    return await this.net.estimateSinglePose(this.video, {
      flipHorizontal: false
    });
  }

  async init() {
    this.net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: {width: 640, height: 480},
      multiplier: 0.75
    });
    const func = () => {
      const pose = this.estimatePoseOnImage();
      this.model.detect(this.video).then(test => {
        if (test.length) {
          test.forEach((item, index) => {
            this.handTracker.boundingBox[index] = [item.bbox[0],
              item.bbox[1],
              item.bbox[0] + item.bbox[2],
              item.bbox[1] + item.bbox[3]];
          });
        } else {
          this.handTracker.boundingBox = [];
        }

        if (this.developerMode) {
          this.model.renderPredictions(test, this.drawerService.canvas, this.drawerService.ctx, this.video);
        }
      });
      pose.then(data => {
        this.machineVisionService.posenetCoords = this.machineVisionService.convertPoseToDictionary(data);
      });
      window.requestAnimationFrame(func);
    };
    window.requestAnimationFrame(func);
  }

  toggleDeveloperMode() {
    this.developerMode = !this.developerMode;
    this.drawerService.clear();
  }
}
