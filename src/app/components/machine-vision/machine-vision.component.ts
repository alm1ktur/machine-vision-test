import { Component, Input, NgZone } from '@angular/core';
import { defaultPatient, PersonI } from '../../static/person.static';
import { MachineVision } from '../../static/machine-vision.class';
import { MachineVisionService } from '../../services/machine-vision.service';
import { DrawerService } from '../../services/drawer.service';
import { HandTrackerService } from '../../services/hand-tracker.service';
import { StateControllerService } from '../../services/state-controller.service';
import { StateEnum } from '../../static/state.enum';
import { NameProjectOrgans, NameToFieldOrgans } from '../../static/machine-vision-default-value.static';

@Component({
  selector: 'app-machine-vision',
  templateUrl: './machine-vision.component.html',
  styleUrls: ['./machine-vision.component.css']
})
export class MachineVisionComponent {
  @Input() canvas: HTMLCanvasElement;

  public person: PersonI;
  public machineVision: MachineVision;
  public timeout;

  constructor(
    private machineVisionService: MachineVisionService,
    private drawerService: DrawerService,
    private handTracker: HandTrackerService,
    private stateService: StateControllerService,
    private ngZone: NgZone
  ) {
    this.machineVisionService.posenetSubject().subscribe(pose => {
      if (pose) {
        this.machineVision = new MachineVision(this.machineVisionService.posenetCoords);
      }
    });
  }

  findOrganContainer(organName: NameProjectOrgans): void {
    if (organName !== 'Sternum') {
      const findOrgan = () => {
        this.drawerService.clearCoordinates();
        this.machineVision[`project` + organName](organName === 'HeartPoints' ? defaultPatient : '');
        this.handTracker.setPoints(this.machineVision.person[this.pascalCaseToSnakeCase(organName)]);
        this.handTracker.checkInRange();
        this.machineVision.person[this.pascalCaseToSnakeCase(organName)].forEach((item, index) => {
          this.drawerService.drawCoordinates(item[0],
            item[1],
            this.handTracker.inRange[index] ? `#22ffff` : `#ffffff`);
        });
        this.drawerService.lastCoordinates = this.machineVision.person[this.pascalCaseToSnakeCase(organName)];
        this.stateService.state = StateEnum.tracking;
        window.requestAnimationFrame(findOrgan);
      };
      this.ngZone.runOutsideAngular(() => window.requestAnimationFrame(findOrgan));
    } else {
      const findSternum = () => {
        this.drawerService.clearCoordinates();
        this.machineVision.projectSternum();
        this.handTracker.setPoints([this.machineVision.person.sternum]);
        this.handTracker.checkInRange();
        this.drawerService.drawCoordinates(this.machineVision.person.sternum[0],
          this.machineVision.person.sternum[1],
          this.handTracker.inRange[0] ? `#22ffff` : `#ffffff`);
        this.drawerService.lastCoordinates = [this.machineVision.person.sternum];
        this.stateService.state = StateEnum.tracking;
        window.requestAnimationFrame(findSternum);
      };
      this.ngZone.runOutsideAngular(() => window.requestAnimationFrame(findSternum));
    }
  }

  pascalCaseToSnakeCase(s: string): string {
    return s.replace(/\.?([A-Z]+)/g, (x, y) => '_' + y.toLowerCase()).replace(/^_/, '');
  }
}
