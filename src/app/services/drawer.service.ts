import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  public canvas: ElementRef;

  constructor() { }

  clear() {
    this.canvas.nativeElement.getContext('2d').clearRect(0, 0, 640, 480);
  }

  drawCoordinates(x: number, y: number, color = `#ff2626`) {
    const ctx = this.canvas.nativeElement.getContext('2d');

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, true);
    ctx.fill();
  }
}
