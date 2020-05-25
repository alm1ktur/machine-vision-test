import { defaultPatient, PersonI } from './person.static';

export const defaultMachineVision: PersonI = {
  patient: defaultPatient,
  nose: null,
  eyes: null,
  ears: null,
  shoulders: null,
  elbows: null,
  wrists: null,
  hips: null,
  knees: null,
  ankles: null,
  heart_points: null,
  lung_points: null,
  abdomen_points: null,
  palpation_points: null,
  sternum: null,
  navel: null,
  chin: null,
  distance_to_center: null,
  triangle_area: null,
  shoulder_length: null,
  teleportation_factor: null,
  num_roi_points: null,
  activity_check: null,
  score: 0,
  normalized_scores: [],
  weighted_scores: [],
  targets: [],
  alt_heart_points: null,
  combo_lung_points: null
};

export const convertImageToKey = [
  'nose',
  'eyes',
  'eyes',
  'ears',
  'ears',
  'shoulders',
  'shoulders',
  'elbows',
  'elbows',
  'wrists',
  'wrists',
  'hips',
  'hips',
  'knees',
  'knees',
  'ankles',
  'ankles',
];

export type NameProjectOrgans = 'Navel' | 'LungPoints' | 'AbdomenPoints' | 'Chin' | 'Sternum' | 'HeartPoints';

export enum NameToFieldOrgans {
  'Navel' = 'navel',
  'LungPoints' = 'lung_points',
  'AbdomenPoints' = 'abdomen_points',
  'Chin' = 'chin',
  'Sternum' = 'sternum',
  'HeartPoints' = 'heart_points'
}
