import { ElementRef, Injectable } from '@angular/core';
import { HandTrackerService } from './hand-tracker.service';
import { MachineVisionService } from './machine-vision.service';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  public canvas: ElementRef;
  public ctx: CanvasRenderingContext2D;
  public lastCoordinates: number[][];
  private radius = 5;

  constructor( ) { }

  clear() {
    this.ctx.clearRect(0, 0, 640, 480);
  }

  clearCoordinates() {
    if (this.lastCoordinates) {
      this.lastCoordinates.forEach(item => {
        this.ctx.clearRect(item[0] - this.radius - 1, item[1] - this.radius - 1, this.radius * 2 + 2, this.radius * 2 + 2);
      });
    }
  }

  drawCoordinates(x: number, y: number, color = `#ff2626`) {
    this.ctx.fillStyle = color;

    this.ctx.beginPath();
    this.ctx.arc(Math.round(x), Math.round(y), this.radius, 0, Math.PI * 2, true);
    this.ctx.fill();
  }
}
