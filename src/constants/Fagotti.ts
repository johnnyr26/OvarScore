type FagottiType = {
  responses: {[title: string]: string};
  showTable: boolean;
  firstSectionRecommendation: string;
  tableRecommendation: string;
  score: number;
};

const firstSection = [
  'Diffuse superficial carcinomatosis on small/large bowel serosa',
  'Diffuse superficial carcinomatosis on small or large bowel mesenteric junction',
  'Mesenteric root retraction at superior mesenteric artery',
  'Limited movement of several segments of small bowel',
];

const table = {
  header: [
    'Tumour Site Distribution',
    'Laparoscopic predictive index score = 2',
    'Laparoscopic predictive index score = 0',
  ],
  categories: {
    'Diaphragmatic disease': [
      'Widespread infiltrating carcinomatosis or confluent nodules to most of the bilateral diaphragmatic surface',
      'Isolated diaphragmatic disease or NOT accessible',
    ],
    'Liver metastasis': [
      'Any superficial nodules >2 cm',
      'No superficial nodules ≥2 cm or NOT accessible',
    ],
    'Stomach infiltration': [
      'Obvious neoplastic involvement of the stomach, and/or lesser omentum, and/or spleen',
      'No obvious neoplastic involvement of the stomach, and/or lesser omentum, and/or spleen or NOT accessible',
    ],
    'Omental disease': [
      'Tumour diffusion up to the large curvature of the stomach',
      'Isolated omental disease or NOT accessible',
    ],
    'Mesenteric disease': [
      'Large superficial (not infiltrating) nodules on the mesentery of various intestinal segments',
      'Small nodules potentially treatable with argon-beam coagulation or NOT accessible',
    ],
    'Bowel infiltration': [
      'Possible large/small bowel resection (excluding rectosigmoid resection) assumed to be required',
      'No bowel resection required (except rectosigmoid resection) or NOT accessible',
    ],
    'Peritoneal carcinomatosis': [
      'Unresectable massive peritoneal involvement plus miliary pattern of distribution',
      'Carcinomatosis involving a limited area surgically removable by peritonectomy or NOT accessible',
    ],
  },
};
export type {FagottiType};
export {firstSection, table};
