import { CocoPart } from './coco-part.enum';

export interface PatientI {
  sex: 'm' | 'f' | 't';
  bmi_flag: boolean;
  height: number;
  weight: number;
  bmi: number;
}

export interface PersonI {
  patient: PatientI;
  nose: number[];
  eyes: number[][];
  ears: number[][];
  shoulders: number[][];
  chin: number[][];
  elbows: number[][];
  wrists: number[][];
  hips: number[][];
  knees: number[][];
  ankles: number[][];
  heart_points: number[][];
  alt_heart_points: number[][];
  lung_points: number[][];
  combo_lung_points: number[][];
  abdomen_points: number[][];
  palpation_points: number[][];
  sternum: number[];
  navel: number[][];
  // ??????
  distance_to_center: number;
  triangle_area: number;
  shoulder_length: number;
  teleportation_factor: number;
  num_roi_points: number;
  activity_check: number;
  score: number;
  normalized_scores: number[];
  weighted_scores: number[];
  targets: number[];
}

export interface PersonDictionary {
  nose: number[];
  eyes: number[][];
  ears: number[][];
  shoulders: number[][];
  elbows: number[][];
  wrists: number[][];
  hips: number[][];
  knees: number[][];
  ankles: number[][];
}

export const defaultDictionary: PersonDictionary = {
  nose: [],
  eyes: [[]],
  ears: [[]],
  shoulders: [[]],
  elbows: [[]],
  wrists: [[]],
  hips: [[]],
  knees: [[]],
  ankles: [[]]
};

export const defaultPatient: PatientI = {
  sex: 'm',
  bmi_flag: false,
  height: null,
  weight: null,
  bmi: 0
};
