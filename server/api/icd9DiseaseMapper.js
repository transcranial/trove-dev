'use strict';

var icd9ToDiseaseTable = {
"198.5": "Bone metastases",
"512": "Pneumothorax with or without tension",
"515": "Intersitial lung disease",
"516.0": "Intersitial lung disease",
"530.5": "Dysmotility",
"577.1": "Pancreatitis",
"11": "Tuberculosis",
"201": "Lymphoma",
"997.5": "Bladder leak",
"415.12": "Septic emboli",
"753.29": "Hydronephrosis",
"852.4": "Subdural or epidural hematoma",
"754.7": "Clubfoot",
"536.3": "Gastroparesis",
"540": "Acute appendicitis",
"541": "Acute appendicitis",
"542": "Acute appendicitis",
"745.2": "TOF",
"432.1": "Subdural or epidural hematoma",
"434.11": "Cerebral infarction",
"209.62": "Thymoma",
"569.83": "Pneumoperitoneum",
"557": "Small bowel obstruction - closed loop or ischemia",
"558": "Colitis",
"560": "SBO",
"209.24": "Renal mass",
"745.5": "ASD",
"756.9": "Skeletal dysplasias",
"567": "Peritoneal disease",
"996.81": "Transplant kidney pathology",
"572": "Liver lesions",
"415.11": "Pulmonary embolism",
"574": "Gallstone",
"575.0": "Acute cholecystitis",
"212.4": "Benign fibrous tumor of the pleura",
"202.8": "Lymphoma or leukemia",
"789.5": "Ascites or FAST",
"753.23": "Ureterocele",
"584": "Renal dysfunction",
"585": "Renal dysfunction",
"586": "Renal dysfunction",
"742.5": "Tethered cord",
"590": "Pyelonephritis",
"591": "Hydronephrosis",
"592": "Renal stone",
"184": "GU malignancy",
"733.4": "Avascular necrosis",
"185": "GU malignancy",
"553.3": "Hiatal hernia",
"331.4": "Hydrocephalus",
"603": "Hydrocele",
"604": "Orchitis",
"186": "GU malignancy",
"620.1": "Ovarian mass",
"331.3": "Hydrocephalus",
"608.2": "Testicular torsion",
"560.2": "Midgut volvulus",
"171.9": "Rhabdomyosarcoma",
"752.1": "Blocked or absent fallopian tube",
"639.6": "Pulmonary embolism",
"620.0": "Ovarian mass",
"777.5": "Necrotizing enterocolitis",
"186.9": "Testicular neoplasms",
"577.8": "Pancreas lesions",
"755.69": "Developmental dysplasia of the hip",
"819": "Salter-Harris fracture",
"745.6": "Common AV canal",
"750.5": "Hypertrophic pyloric stenosis",
"135": "Sarcoid",
"733.14": "Hip fracture",
"753.1": "Multisystic dysplastic kidney",
"562.93": "Diverticulitis or abscess",
"518.4": "Pulmonary edema ",
"151": "Stomach malignancy",
"530.3": "Esophageal obstruction (partial)",
"155": "Hepatoblastoma",
"157": "Pancreas lesions",
"158": "Peritoneal disease",
"434.91": "Cerebral infarction",
"162": "Lung cancer primary or metastatic",
"163": "Mesothelioma",
"164.0": "Thymoma",
"433.1": "Carotid stenosis",
"755.6": "Developmental dysplasia of the hip",
"170": "Bone tumor ",
"683": "Lymphadenitis",
"200": "Lymphoma",
"745.61": "ASD",
"742.9": "Tethered cord",
"183": "Ovarian mass",
"696.0": "Arthritis",
"802.8": "Orbital fracture or muscle entrapment",
"852.2": "Subdural or epidural hematoma",
"187": "GU malignancy",
"188": "GU malignancy",
"189": "Wilm\'s and other renal tumors",
"193": "Thyroid goiter or cancer",
"194.0": "Neuroblastoma",
"197.0": "Lung cancer primary or metastatic ",
"752.2": "Uterine anomalies",
"711": "Septic arthritis",
"852.5": "Subdural or epidural hematoma",
"998.4": "Foreign body retained",
"714": "Arthritis",
"715": "Arthritis",
"530.4": "Esophageal rupture",
"415.1": "Pulmonary embolism",
"209": "Neuroendocrine tumor",
"751.4": "Malrotation",
"633": "Ectopic pregnancy",
"568.89": "Pneumoperitoneum",
"218": "Fibroids",
"756.72": "Omphalocele Gastroschisis",
"516.4": "Lymphangiomyomatosis",
"223": "Renal mass",
"560.89": "Small bowel obstruction - closed loop or ischemia",
"226": "Thyroid nodules",
"806.0": "Cervical spine fracture",
"745.4": "VSD",
"748.6": "CPAM",
"747": "PDA",
"997.49": "Post-surgical leak GI",
"240": "Thyroid goiter or cancer",
"756.73": "Omphalocele Gastroschisis",
"242.0": "Graves disease",
"289.1": "Lymphadenitis",
"516.8": "Diffuse alveolar hemorrhage",
"245": "Thyroiditis",
"959.9": "Child abuse or Non-accidental trauma",
"620.5": "Ovarian torsion",
"747.41": "TAPVR",
"769": "Respiratory distress syndrome",
"811": "Salter-Harris fracture",
"577.2": "Pancreas lesions",
"733.1": "Pathologic fracture",
"770.12": "Meconium aspiration",
"575.1": "Acute cholecystitis",
"593.2": "Renal mass",
"805.1": "Cervical spine fracture",
"275.0": "Arthritis",
"852.3": "Subdural or epidural hematoma",
"730": "Osteomyelitis",
"562.11": "Diverticulitis or abscess",
"530.81": "Reflux",
"575.8": "Decreased GB EF",
"805.0": "Cervical spine fracture",
"593.7": "Vesicoureteral reflux",
"808": "Pelvic fracture",
"810": "Salter-Harris fracture",
"752.3": "Uterine anomalies",
"812": "Salter-Harris fracture",
"813": "Salter-Harris fracture",
"814": "Salter-Harris fracture",
"815": "Salter-Harris fracture",
"816": "Salter-Harris fracture",
"817": "Salter-Harris fracture",
"818": "Salter-Harris fracture",
"745.1": "Transposition of the great vessels",
"820": "Hip fracture",
"821": "Hip fracture",
"822": "Salter-Harris fracture",
"823": "Salter-Harris fracture",
"824": "Salter-Harris fracture",
"620.8": "Ovarian mass",
"826": "Salter-Harris fracture",
"827": "Salter-Harris fracture",
"828": "Salter-Harris fracture",
"829": "Salter-Harris fracture",
"153": "Colon malignancy",
"331.5": "Hydrocephalus",
"732.1": "Legg-Calve-Perthes disease",
"198": "Metastatic cancer",
"516.34": "Bronchiolitis",
"742.3": "Hydrocephalus",
"806.1": "Cervical spine fracture",
"331.0": "Alzheimer\'s disease",
"753.4": "Duplication of collecting systems",
"825": "Salter-Harris fracture",
"621.3": "Endometrial disease",
"860": "Pneumothorax with or without tension",
"751.5": "Midgut volvulus",
"212.6": "Thymoma",
"770.11": "Meconium aspiration",
"867": "Solid organ injury",
"868": "Solid organ injury",
"869": "Solid organ injury",
"802.7": "Orbital fracture or muscle entrapment",
"208.9": "Lymphoma or leukemia",
"136.3": "PCP",
"750.6": "Hiatal hernia",
"596.6": "Bladder leak",
"862.22": "Esophageal rupture",
"997.32": "Penetration or Aspiration",
"v54": "Postop fracture evaluation",
"562.13": "Diverticulitis or abscess",
"577.9": "Pancreas lesions",
"831": "Shoulder dislocation",
"733.15": "Hip fracture",
"416.2": "Pulmonary embolism",
"620.9": "Ovarian mass",
"198.89": "Metastatic thyroid uptake",
"754.5": "Clubfoot",
"577.0": "Pancreatitis",
"466.1": "Bronchiolitis",
"751.1": "Duodenal atresia",
"222": "Testicular neoplasms",
"750.3": "Esophageal atresia",
"456.4": "Varicocele",
"573.8": "Liver lesions",
"996.2": "VP shunt pseudocyst",
"209.64": "Renal mass",
"560.9": "Small bowel obstruction - closed loop or ischemia",
"930": "Foreign body",
"931": "Foreign body",
"932": "Foreign body",
"933": "Foreign body",
"934": "Aspirated foreign body with air trapping",
"935": "Foreign body",
"936": "Foreign body",
"937": "Foreign body",
"938": "Swallowed foreign body",
"939": "Foreign body",
"996.4": "Hardware complications",
"770.6": "Transient tachypnea of the newborn",
"430": "Subarachnoid hemorrhage with aneurysm",
"431": "Intracranial hemorrhage",
"432.0": "Subdural or epidural hematoma",
"v67": "Postop fracture evaluation",
"753.6": "Posterior urethral valves",
"748.69": "Bronchopulmonary foregut malformations",
"202": "Lymphoma",
"441": "Aortic aneurysm",
"755.63": "Developmental dysplasia of the hip",
"277.89": "LCH",
"453": "DVT",
"620.2": "Ovarian mass",
"433.3": "Carotid stenosis",
"560.1": "Ileus",
"732.2": "SCFE",
"786.6": "Mediastinal masses",
"464": "Croup",
"434.01": "Cerebral infarction",
"751.3": "Hirshprung\'s",
"009": "Colitis",
"779.7": "PVL",
"486": "Pneumonia",
"753.21": "UPJ obstruction",
"562.01": "Diverticulitis or abscess",
"802.6": "Orbital fracture or muscle entrapment",
"495": "Hypersensitivity pneumonitis",
"502": "Silicosis",
"748.5": "Pulmonary sequestration",
"506.0": "Hypersensitivity pneumonitis",
"507": "Aspiration pneumonia",
"682": "Abscess"};

exports.map = function(icd9) {
    return icd9ToDiseaseTable[icd9] || ""; 
};