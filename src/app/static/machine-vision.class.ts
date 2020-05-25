import { PatientI, PersonDictionary, PersonI } from './person.static';
import { CocoPart } from './coco-part.enum';
import { defaultMachineVision, NameProjectOrgans } from './machine-vision-default-value.static';

export class MachineVision {
  public person: PersonI = defaultMachineVision;

  constructor(personDict: PersonDictionary) {
    this.person.nose = personDict.nose;
    this.person.eyes = personDict.eyes;
    this.person.ears = personDict.ears;
    this.person.shoulders = personDict.shoulders;
    this.person.elbows = personDict.elbows;
    this.person.wrists = personDict.wrists;
    this.person.hips = personDict.hips;
    this.person.knees = personDict.knees;
    this.person.ankles = personDict.ankles;
  }

  private LEFT = 0;
  private RIGHT = 1;

  calculateBMI(patient: PatientI): void {
    if (patient.height && patient.weight) {
      patient.bmi = (patient.weight * 704.7) / (patient.height ** 2);
      if (patient.bmi > 28) {
        patient.bmi_flag = true;
      }
    }
  }

  pointMidPoint(x: number[], y: number[]): number[] {
    return [((x[0] + y[0]) / 2), ((x[1] + y[1]) / 2)];
  }

  // ???
  fromCoco(person: number[][]) {
    let personDict: PersonDictionary;
    person.forEach((part, i) => {
      if (part) {
        person[i] = [part[0], part[1]];
        personDict = {
          nose: person[CocoPart.Nose],
          eyes: [person[CocoPart.LEye], person[CocoPart.REye]],
          ears: [person[CocoPart.LEar], person[CocoPart.REar]],
          shoulders: [person[CocoPart.LShoulder], person[CocoPart.RShoulder]],
          elbows: [person[CocoPart.LElbow], person[CocoPart.RElbow]],
          wrists: [person[CocoPart.LWrist], person[CocoPart.RWrist]],
          hips: [person[CocoPart.LHip], person[CocoPart.RHip]],
          knees: [person[CocoPart.LKnee], person[CocoPart.RKnee]],
          ankles: [person[CocoPart.LAnkle], person[CocoPart.RAnkle]],
        };
      }
    });
    return new MachineVision(personDict);
  }

  keyPoints() {
    return {
      [CocoPart.Nose]: this.person.nose,
      [CocoPart.LEye]: this.person.eyes[this.LEFT],
      [CocoPart.REye]: this.person.eyes[this.RIGHT],
      [CocoPart.LEar]: this.person.ears[this.LEFT],
      [CocoPart.REar]: this.person.ears[this.RIGHT],
      [CocoPart.LShoulder]: this.person.shoulders[this.LEFT],
      [CocoPart.RShoulder]: this.person.shoulders[this.RIGHT],
      [CocoPart.LElbow]: this.person.elbows[this.LEFT],
      [CocoPart.RElbow]: this.person.elbows[this.RIGHT],
      [CocoPart.LWrist]: this.person.wrists[this.LEFT],
      [CocoPart.RWrist]: this.person.wrists[this.RIGHT],
      [CocoPart.LHip]: this.person.hips[this.LEFT],
      [CocoPart.RHip]: this.person.hips[this.RIGHT],
      [CocoPart.LAnkle]: this.person.ankles[this.LEFT],
      [CocoPart.RAnkle]: this.person.ankles[this.RIGHT],
    };
  }

  public keyPointsSet(coco: CocoPart, coords) {
    switch (coco) {
      case CocoPart.Nose: {
        this.person.nose = coords;
        break;
      }
      case CocoPart.LEye: {
        this.person.eyes[this.LEFT] = coords;
        break;
      }
      case CocoPart.REye: {
        this.person.eyes[this.RIGHT] = coords;
        break;
      }
      case CocoPart.LEar: {
        this.person.ears[this.LEFT] = coords;
        break;
      }
      case CocoPart.REar: {
        this.person.ears[this.RIGHT] = coords;
        break;
      }
      case CocoPart.LShoulder: {
        this.person.shoulders[this.LEFT] = coords;
        break;
      }
      case CocoPart.RShoulder: {
        this.person.shoulders[this.RIGHT] = coords;
        break;
      }
      case CocoPart.LElbow: {
        this.person.elbows[this.LEFT] = coords;
        break;
      }
      case CocoPart.RElbow: {
        this.person.elbows[this.RIGHT] = coords;
        break;
      }
      case CocoPart.LWrist: {
        this.person.wrists[this.LEFT] = coords;
        break;
      }
      case CocoPart.RWrist: {
        this.person.wrists[this.RIGHT] = coords;
        break;
      }
      case CocoPart.LHip: {
        this.person.hips[this.LEFT] = coords;
        break;
      }
      case CocoPart.RHip: {
        this.person.hips[this.RIGHT] = coords;
        break;
      }
      case CocoPart.LAnkle: {
        this.person.ankles[this.LEFT] = coords;
        break;
      }
      case CocoPart.RAnkle: {
        this.person.ankles[this.RIGHT] = coords;
        break;
      }
      default: {
        return;
      }
    }
  }

  shoulderDist(): number {
    if (this.hasBothShoulders()) {
      const [[x1, y1], [x2, y2]] = this.person.shoulders;
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
  }

  hasBothShoulders(): boolean {
    return this.person.shoulders[this.LEFT] &&
      this.person.shoulders[this.RIGHT] &&
      (this.person.shoulders[this.LEFT] !== this.person.shoulders[this.RIGHT]);
  }

  pointsProximityCheck(p, q, tolerance = 0.2, manhattanDist = false): boolean {
    if (p && q && this.shoulderDist()) {
      return this.distance(p, q, manhattanDist) < tolerance;
    }
    return false;
  }

  // not sure about this function
  coordsFrameToScreen(framePT): number[] {
    const [alphaX, alphaY] = framePT;
    const A: number[][] = [[1 - Math.pow(0.92, Math.abs(alphaX)), 0], [0, 1 - Math.pow(0.92, Math.abs(alphaY))]];
    const coordinateScales = [0.15, 0.15];
    const B: number[] = [];
    A.forEach((part, index) => {
      B[index] = part.reduce((a, b) => a + b, 0);
      B[index] *= coordinateScales[index] * this.shoulderDist() / 0.15;
    });
    let [rX, rY] = B;
    if (alphaX < 0) {
      rX *= -1;
    }
    if (alphaY < 0) {
      rY *= -1;
    }
    this.projectSternum();
    rX += this.person.sternum[0];
    rY += this.person.sternum[1];
    return [rX, rY];
  }

  projectSternum() {
    if (this.hasBothShoulders()) {
      this.person.sternum = [(this.person.shoulders[this.LEFT][0] + this.person.shoulders[this.RIGHT][0]) / 2,
        (this.person.shoulders[this.LEFT][1] + this.person.shoulders[this.RIGHT][1]) / 2];
    }
  }

  // p??? q??
  distance(p, q, manhattanDist = false) {
    if (p && q && this.shoulderDist()) {
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      let dist;
      if (manhattanDist) {
        dist = Math.abs(dx) + Math.abs(dy);
      } else {
        dist = Math.sqrt(dx ** 2 + dy ** 2);
      }
      return dist / this.shoulderDist();
    }
    return null;
  }

  projectNavel() {
    if (this.hasBothShoulders()) {
      const lShoulder = this.person.shoulders[this.LEFT];
      const rShoulder = this.person.shoulders[this.RIGHT];
      const shoulderDx = rShoulder[0] - lShoulder[0];
      const shoulderDy = rShoulder[1] - lShoulder[1];
      const normal = [shoulderDy, -shoulderDx];
      const normalLength = Math.sqrt(normal[0] ** 2 + normal[1] ** 2);
      if (normalLength !== 0) {
        this.person.navel = [[((this.shoulderDist() * normal[0]) / normalLength) + this.person.sternum[0],
          ((this.shoulderDist() * normal[1]) / normalLength) + this.person.sternum[1]]];
      } else {
        this.person.navel = null;
      }
    } else {
      this.person.navel = null;
    }
  }

  projectHeartPoints(patient: PatientI, fifthPoint = false) {
    const heartFrameCoords = [
      [1.5, 8.0],
      [3.5, 3.0],
      [3.5, 10.5],
      [1.5, 5.0]
    ];
    const altHeartFrameCoords = [
      [0.0, 8.0],
      [2.5, 3.0],
      [3.5, 12.5],
      [0.0, 5.0]
    ];
    if (patient.sex === 'f') {
      heartFrameCoords[1] = [3.0, 3.0];
      altHeartFrameCoords[1] = [2.0, 3.0];
    }

    if (patient.bmi_flag) {
      heartFrameCoords[2] = [5.0, 10.0];
      altHeartFrameCoords[2] = [5.0, 12];
    }

    if (fifthPoint) {
      heartFrameCoords.push([-2.0, 2.0]);
      altHeartFrameCoords.push([-3.0, 2.0]);
    }

    this.person.heart_points = [];
    this.person.alt_heart_points = [];

    heartFrameCoords.forEach(pt => {
      this.person.heart_points.push(this.coordsFrameToScreen(pt));
    });

    altHeartFrameCoords.forEach(pt => {
      this.person.alt_heart_points.push(this.coordsFrameToScreen(pt));
    });
  }

  projectAbdomenPoints() {
    const abdomenFrameCoords = [
      [2.0, 29.0],
      [-3.5, 32.0],
      [0.0, 26.0],
      [3.5, 32.0],
      [-2.0, 29.0],
    ];

    this.person.abdomen_points = [];

    abdomenFrameCoords.forEach(pt => {
      this.person.abdomen_points.push(this.coordsFrameToScreen(pt));
    });
  }

  projectLungPoints() {
    const lungFrameCoords = [
      [5.5, 3.0],
      [-5.5, 3.0],
      [5.2, 10.0],
      [-5.3, 11.0],
      [5.2, 18.5],
      [-5.1, 18.5],
    ];

    const comboLungFrameCoords = [
      [5.5, 3.0],
      [-5.5, 3.0],
      [3.5, 1.0],
      [-3.5, 1.0],
      [3.8, 12.5],
      [-3.8, 12.5],
    ];

    this.person.lung_points = [];
    this.person.combo_lung_points = [];
    lungFrameCoords.forEach(pt => {
      this.person.lung_points.push(this.coordsFrameToScreen(pt));
    });
    comboLungFrameCoords.forEach(pt => {
      this.person.combo_lung_points.push(this.coordsFrameToScreen(pt));
    });
  }

  projectPalpationPoints() {
    const palpationFrameCoords = [
      [3.0, 15.0],
      [-3.0, 15.0],
      [0.0, 15.0],
      [3.0, 18.5],
      [-3.0, 18.5],
      [0.0, 18.5],
      [3.0, 22.0],
      [-3.0, 22.0],
      [0.0, 22.0],
    ];
    this.person.palpation_points = [];
    palpationFrameCoords.forEach(pt => {
      this.person.palpation_points.push(this.coordsFrameToScreen(pt));
    });
  }

  projectChin(): void {
    if (this.person.shoulders[this.LEFT] && this.person.shoulders[this.RIGHT]) {
      const shoulderMidX = Number((this.person.shoulders[this.RIGHT][0] + this.person.shoulders[this.LEFT][0]) / 2);
      const shoulderMidY = Number((this.person.shoulders[this.RIGHT][1] + this.person.shoulders[this.LEFT][1]) / 2);
      this.person.chin = [[Number((shoulderMidX + this.person.nose[0]) / 2), Number((shoulderMidY + this.person.nose[1]) / 2)]];
    } else if (this.person.eyes[this.LEFT] && this.person.eyes[this.RIGHT]) {
      const eyeMidX = Number((this.person.eyes[this.LEFT][0] + this.person.eyes[this.RIGHT][0]) / 2);
      const eyeMidY = Number((this.person.eyes[this.LEFT][1] + this.person.eyes[this.RIGHT][1]) / 2);
      const noseToEyesY = 2 * (this.person.nose[1] - eyeMidY);
      this.person.chin = [[eyeMidX, Number(this.person.nose[1] + noseToEyesY)]];
    }
  }

  near(p, q, tolerance = 0.2, manhattanDist = false) {
    if (p && q && this.shoulderDist()) {
      return this.distance(p, q, manhattanDist) < tolerance;
    }
    return null;
  }

  hasBothEyes() {
    return this.person.eyes[this.LEFT] && this.person.eyes[this.RIGHT] && this.person.eyes[this.LEFT] !== this.person.eyes[this.RIGHT];
  }

  hasBothEars() {
    return this.person.ears[this.LEFT] && this.person.ears[this.RIGHT] && this.person.ears[this.LEFT] !== this.person.ears[this.RIGHT];
  }

  hasBothHips() {
    return this.person.hips[this.LEFT] &&  this.person.hips[this.RIGHT];
  }

  hasBothKnees(): boolean {
    return Boolean(this.person.knees[this.LEFT] &&  this.person.knees[this.RIGHT]);
  }

  hasBothAnkles(): boolean {
    return Boolean(this.person.ankles[this.LEFT] &&  this.person.ankles[this.RIGHT]);
  }

  hasBothTorso(): boolean {
    return Boolean(this.hasBothShoulders() && this.hasBothHips());
  }

  hasBothTriangle(): boolean {
    return this.hasBothShoulders() && this.hasBothEyes();
  }

  sternumToCenter(): number {
    if (!this.person.sternum) {
      this.projectSternum();
    }
    return Math.abs(this.person.sternum[0] - 640);
  }

  eyeMidPoint(): number[] {
    return this.pointMidPoint(this.person.eyes[0], this.person.eyes[1]);
  }

  EyesToCenter(): number {
    return Math.abs(this.pointMidPoint(this.person.eyes[0], this.person.eyes[1])[0] - 640);
  }

  triangle(): number[][] {
    if (this.person.eyes[this.RIGHT] && this.person.eyes[this.LEFT]) {
      return [this.person.shoulders[this.RIGHT],
        this.pointMidPoint(this.person.eyes[this.RIGHT], this.person.eyes[this.LEFT]),
        this.person.shoulders[this.LEFT]];
    }
    return null;
  }

  eyeDist() {
    return this.person.eyes[0][0] - this.person.eyes[1][0];
  }

  earDist() {
    return this.person.ears[0][0] - this.person.ears[1][0];
  }

  estimateAssetResizeFactor(previousFixedPixelHeight, additiveConstant) {
    const person = this.person;
    function totalDist(earEyeDist) {
      let dist = person.eyes[0][0] - person.eyes[1][0] - person.eyes[0][0] - person.eyes[1][0] + earEyeDist;
      dist /= 2;
      return dist + additiveConstant;
    }
    if (this.person.eyes.every(item => item) && person.ears.some(item => item === null)) {
      return previousFixedPixelHeight;
    } else {
      if (this.hasBothEyes() && this.hasBothEars()) {
        const idealResizeFactor = (this.eyeDist() + this.earDist()) / 2;
        return idealResizeFactor + additiveConstant;
      } else if (this.person.eyes[0] || this.person.eyes[1]) {
        return previousFixedPixelHeight;
      } else if (this.person.ears[0] && !this.person.ears[1]) {
        return totalDist(this.person.ears[0][0] - this.person.eyes[0][0]);
      } else if (this.person.ears[1] && !this.person.ears[0]) {
        return totalDist(this.person.eyes[1][0] - this.person.ears[1][0]);
      } else {
        return previousFixedPixelHeight;
      }
    }
  }
}
