import { Injectable } from '@angular/core';
import { DrawerService } from './drawer.service';

@Injectable({
  providedIn: 'root'
})
export class HandTrackerService {
  public Points: number[][] = [];
  public shift = 50;
  public inRange: boolean[] = [false];
  public boundingBox: number[][] = [[], []];

  constructor(
    private drawerService: DrawerService
  ) { }

  get points(): number[][] {
    return this.Points;
  }

  setPoints(points: number[][]) {
    this.Points = points;
  }

  checkInRange() {
    this.Points.forEach((item, index) => {
      this.inRange[index] = false;
      this.boundingBox.forEach(bb => {
        this.inRange[index] = this.inRange[index] || (bb[0] <= item[0]
          && item[0] <= bb[2]
          && bb[1] <= item[1]
          && item[1] <= bb[3]);
      });
    });
  }
}
