import { Injectable } from '@angular/core';
import { defaultDictionary, PersonDictionary } from '../static/person.static';
import { Pose } from '@tensorflow-models/posenet';
import { convertImageToKey } from '../static/machine-vision-default-value.static';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MachineVisionService {
  private $posenetCoords: BehaviorSubject<PersonDictionary> = new BehaviorSubject<PersonDictionary>(null);
  constructor() { }

  get posenetCoords(): PersonDictionary {
    return this.$posenetCoords.getValue();
  }

  set posenetCoords(coords: PersonDictionary) {
    this.$posenetCoords.next(coords);
  }

  posenetSubject(): Observable<PersonDictionary> {
    return this.$posenetCoords.asObservable();
  }

  convertPoseToDictionary(pose: Pose): PersonDictionary {
    if (!pose) { return null; }
    const dict: PersonDictionary = defaultDictionary;
    pose.keypoints.forEach((item, index) => {
      if (index === 0) {
        dict[convertImageToKey[index]] = [item.position.x, item.position.y];
      } else {
        dict[convertImageToKey[index]][(index - 1) % 2] = [item.position.x, item.position.y];
      }
    });

    return dict;
  }
}
