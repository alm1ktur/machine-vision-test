import { Component, Input } from '@angular/core';
import { defaultPatient, PatientI, PersonI } from '../../static/person.static';
import { CocoPart } from '../../static/coco-part.enum';
import { MachineVision } from '../../static/machine-vision.class';
import { MachineVisionService } from '../../services/machine-vision.service';
import { testDictionary } from '../../services/machine-vision.test';
import { DrawerService } from '../../services/drawer.service';

@Component({
  selector: 'app-machine-vision',
  templateUrl: './machine-vision.component.html',
  styleUrls: ['./machine-vision.component.css']
})
export class MachineVisionComponent {
  @Input() canvas: HTMLCanvasElement;

  public person: PersonI;
  public machineVision: MachineVision;

  constructor(
    private machineVisionService: MachineVisionService,
    private drawerService: DrawerService
  ) {
    this.machineVisionService.posenetSubject().subscribe(pose => {
      if (pose) {
        this.machineVision = new MachineVision(this.machineVisionService.posenetCoords);
        console.log(this.machineVision);
      }
    });
  }

  findHeart(): void {
    this.machineVision.projectHeartPoints(defaultPatient);
    this.drawerService.drawCoordinates(this.machineVision.person.heart_points[1][0],
      this.machineVision.person.heart_points[1][1],
      `#ffffff`);
    console.log(this.machineVision);
  }

  findSternum(): void {
    this.machineVision.projectSternum();
    this.drawerService.drawCoordinates(this.machineVision.person.sternum[0], this.machineVision.person.sternum[1], `#ffffff`);
  }

  findChin(): void {
    this.drawerService.drawCoordinates(this.machineVision.projectChin()[0], this.machineVision.projectChin()[1], `#ffffff`);
  }
}
