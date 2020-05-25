import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MachineVisionService } from '../../services/machine-vision.service';
import { DrawerService } from '../../services/drawer.service';
import { StateControllerService } from '../../services/state-controller.service';
import { StateEnum } from '../../static/state.enum';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.css']
})
export class VideoContainerComponent implements AfterViewInit {
  @ViewChild('video') video: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

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
          this.drawerService.canvas = this.canvas.nativeElement;
          this.drawerService.ctx = this.canvas.nativeElement.getContext('2d');
        });
      }).catch((err) => {
        alert(err);
      });
    }
  }
}
