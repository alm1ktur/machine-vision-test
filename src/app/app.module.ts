import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VideoContainerComponent } from './components/video-container/video-container.component';
import { InformationContainerComponent } from './components/information-container/information-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PosenetQualifierComponent } from './components/posenet-qualifier/posenet-qualifier.component';
import { WebcamModule } from 'ngx-webcam';
import { MachineVisionComponent } from './components/machine-vision/machine-vision.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoContainerComponent,
    InformationContainerComponent,
    PosenetQualifierComponent,
    MachineVisionComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
