/**
 * courses.js — course catalogue for the evaluation form.
 *
 * Every student sees the courses for the department they signed up with,
 * plus the university-wide GST courses everyone takes. Departments without a
 * curated list get a sensible generated set so the form is never empty.
 */

const LECTURERS = [
  'Dr. Adebayo', 'Prof. Okonkwo', 'Dr. Eze', 'Mrs. Akinola', 'Dr. Ibrahim',
  'Prof. Balogun', 'Dr. Nwosu', 'Dr. Adeyemi', 'Prof. Umeh', 'Dr. Salami',
  'Dr. Oyelaran', 'Prof. Danjuma', 'Dr. Chukwu', 'Mrs. Bello', 'Dr. Fernandes',
]

/** lecturer for course i — deterministic so a course always shows the same name */
const lecturerFor = (i) => LECTURERS[i % LECTURERS.length]

/** c(code, name, level, semester) → course object */
const c = (code, name, level, semester) => ({ code, name, level, semester })

const GST = [
  c('GST 111', 'Use of English', '100 Level', 'First'),
  c('GST 112', 'Logic, Philosophy & Human Existence', '100 Level', 'Second'),
  c('GST 201', 'Peace and Conflict Resolution', '200 Level', 'First'),
  c('GST 301', 'Entrepreneurship and Innovation', '300 Level', 'First'),
]

const CATALOGUE = {
  'Computer Science': [
    c('CSC 301', 'Data Structures and Algorithms', '300 Level', 'First'),
    c('CSC 302', 'Operating Systems I', '300 Level', 'First'),
    c('CSC 305', 'Software Engineering I', '300 Level', 'Second'),
    c('CSC 401', 'Artificial Intelligence', '400 Level', 'First'),
    c('MTH 201', 'Linear Algebra', '200 Level', 'Second'),
  ],
  'Mass Communication': [
    c('MAC 301', 'Broadcast Journalism', '300 Level', 'First'),
    c('MAC 302', 'Print Journalism', '300 Level', 'First'),
    c('MAC 305', 'Media Law and Ethics', '300 Level', 'Second'),
    c('MAC 318', 'Public Relations Practice', '300 Level', 'Second'),
  ],
  Accounting: [
    c('ACC 301', 'Financial Accounting III', '300 Level', 'First'),
    c('ACC 302', 'Cost Accounting', '300 Level', 'First'),
    c('ACC 305', 'Taxation', '300 Level', 'Second'),
    c('ACC 401', 'Auditing and Assurance', '400 Level', 'First'),
  ],
  'Actuarial Science & Insurance': [
    c('ACT 301', 'Life Contingencies', '300 Level', 'First'),
    c('ACT 302', 'Risk Theory', '300 Level', 'First'),
    c('ACT 305', 'Insurance Law and Claims', '300 Level', 'Second'),
    c('ACT 401', 'Pension Mathematics', '400 Level', 'First'),
  ],
  'Business Administration': [
    c('BUS 301', 'Principles of Management', '300 Level', 'First'),
    c('BUS 302', 'Business Law', '300 Level', 'First'),
    c('BUS 305', 'Human Resource Management', '300 Level', 'Second'),
    c('MKT 201', 'Principles of Marketing', '200 Level', 'Second'),
  ],
  Finance: [
    c('FIN 301', 'Corporate Finance', '300 Level', 'First'),
    c('FIN 302', 'Investment Analysis', '300 Level', 'First'),
    c('FIN 305', 'Financial Modelling', '300 Level', 'Second'),
    c('FIN 401', 'International Finance', '400 Level', 'First'),
  ],
  Economics: [
    c('ECO 301', 'Microeconomic Theory III', '300 Level', 'First'),
    c('ECO 302', 'Macroeconomic Theory III', '300 Level', 'First'),
    c('ECO 305', 'Statistics for Economists', '300 Level', 'Second'),
    c('ECO 401', 'Development Economics', '400 Level', 'First'),
  ],
  'Political Science': [
    c('POL 301', 'Political Theory', '300 Level', 'First'),
    c('POL 302', 'Nigerian Government and Politics', '300 Level', 'First'),
    c('POL 305', 'International Relations', '300 Level', 'Second'),
    c('POL 401', 'Public Administration', '400 Level', 'First'),
  ],
  Psychology: [
    c('PSY 301', 'Cognitive Psychology', '300 Level', 'First'),
    c('PSY 302', 'Social Psychology', '300 Level', 'First'),
    c('PSY 305', 'Developmental Psychology', '300 Level', 'Second'),
    c('PSY 401', 'Psychopathology', '400 Level', 'First'),
  ],
  Sociology: [
    c('SOC 301', 'Sociological Theory', '300 Level', 'First'),
    c('SOC 302', 'Research Methods', '300 Level', 'First'),
    c('SOC 305', 'Criminology', '300 Level', 'Second'),
    c('SOC 401', 'Sociology of Development', '400 Level', 'First'),
  ],
  Geography: [
    c('GEO 301', 'Geomorphology', '300 Level', 'First'),
    c('GEO 302', 'Climatology', '300 Level', 'First'),
    c('GEO 305', 'Cartography and GIS', '300 Level', 'Second'),
    c('GEO 401', 'Urban and Regional Planning', '400 Level', 'First'),
  ],
  English: [
    c('ENG 301', 'African Literature', '300 Level', 'First'),
    c('ENG 302', 'Phonetics and Phonology', '300 Level', 'First'),
    c('ENG 305', 'Literary Theory and Criticism', '300 Level', 'Second'),
    c('ENG 401', 'Creative Writing', '400 Level', 'First'),
  ],
  'History & Strategic Studies': [
    c('HIS 301', 'Nigerian History since 1800', '300 Level', 'First'),
    c('HIS 302', 'Historiography', '300 Level', 'First'),
    c('HIS 305', 'Strategic Studies', '300 Level', 'Second'),
    c('HIS 401', 'Africa and the Atlantic World', '400 Level', 'First'),
  ],
  Philosophy: [
    c('PHI 301', 'Epistemology', '300 Level', 'First'),
    c('PHI 302', 'Formal Logic II', '300 Level', 'First'),
    c('PHI 305', 'Ethics', '300 Level', 'Second'),
    c('PHI 401', 'African Philosophy', '400 Level', 'First'),
  ],
  'Chemical Engineering': [
    c('CHE 301', 'Chemical Engineering Thermodynamics', '300 Level', 'First'),
    c('CHE 302', 'Fluid Mechanics', '300 Level', 'First'),
    c('CHE 305', 'Chemical Reaction Kinetics', '300 Level', 'Second'),
    c('CHE 401', 'Process Design and Economics', '400 Level', 'First'),
  ],
  'Civil Engineering': [
    c('CVE 301', 'Structural Analysis I', '300 Level', 'First'),
    c('CVE 302', 'Soil Mechanics', '300 Level', 'First'),
    c('CVE 305', 'Fluid Mechanics', '300 Level', 'Second'),
    c('CVE 401', 'Highway Engineering', '400 Level', 'First'),
  ],
  'Electrical & Electronics Engineering': [
    c('EEE 301', 'Circuit Theory II', '300 Level', 'First'),
    c('EEE 302', 'Electromagnetic Fields and Waves', '300 Level', 'First'),
    c('EEE 305', 'Control Systems I', '300 Level', 'Second'),
    c('EEE 401', 'Power Systems Analysis', '400 Level', 'First'),
  ],
  'Mechanical Engineering': [
    c('MEE 301', 'Thermodynamics I', '300 Level', 'First'),
    c('MEE 302', 'Strength of Materials', '300 Level', 'First'),
    c('MEE 305', 'Machine Design I', '300 Level', 'Second'),
    c('MEE 401', 'Heat Transfer', '400 Level', 'First'),
  ],
  Architecture: [
    c('ARC 301', 'Architectural Design III', '300 Level', 'First'),
    c('ARC 302', 'Building Construction and Materials', '300 Level', 'First'),
    c('ARC 305', 'History of Architecture', '300 Level', 'Second'),
    c('ARC 401', 'Urban Design and Planning', '400 Level', 'First'),
  ],
  Biochemistry: [
    c('BCH 301', 'Enzymology', '300 Level', 'First'),
    c('BCH 302', 'Intermediate Metabolism', '300 Level', 'First'),
    c('BCH 305', 'Molecular Biology', '300 Level', 'Second'),
    c('BCH 401', 'Biochemical Techniques', '400 Level', 'First'),
  ],
  'Cell Biology & Genetics': [
    c('CBG 301', 'Principles of Genetics', '300 Level', 'First'),
    c('CBG 302', 'Cell Biology', '300 Level', 'First'),
    c('CBG 305', 'Molecular Genetics', '300 Level', 'Second'),
    c('CBG 401', 'Biotechnology', '400 Level', 'First'),
  ],
  Chemistry: [
    c('CHM 301', 'Physical Chemistry III', '300 Level', 'First'),
    c('CHM 302', 'Organic Chemistry III', '300 Level', 'First'),
    c('CHM 305', 'Analytical Chemistry', '300 Level', 'Second'),
    c('CHM 401', 'Instrumental Methods of Analysis', '400 Level', 'First'),
  ],
  Geology: [
    c('GLY 301', 'Mineralogy and Crystallography', '300 Level', 'First'),
    c('GLY 302', 'Sedimentology', '300 Level', 'First'),
    c('GLY 305', 'Structural Geology', '300 Level', 'Second'),
    c('GLY 401', 'Petroleum Geology', '400 Level', 'First'),
  ],
  Mathematics: [
    c('MTH 301', 'Real Analysis I', '300 Level', 'First'),
    c('MTH 302', 'Abstract Algebra', '300 Level', 'First'),
    c('MTH 305', 'Ordinary Differential Equations', '300 Level', 'Second'),
    c('MTH 401', 'Numerical Analysis', '400 Level', 'First'),
  ],
  Microbiology: [
    c('MCB 301', 'Bacteriology', '300 Level', 'First'),
    c('MCB 302', 'Virology', '300 Level', 'First'),
    c('MCB 305', 'Mycology', '300 Level', 'Second'),
    c('MCB 401', 'Immunology', '400 Level', 'First'),
  ],
  Physics: [
    c('PHY 301', 'Quantum Mechanics I', '300 Level', 'First'),
    c('PHY 302', 'Electromagnetism', '300 Level', 'First'),
    c('PHY 305', 'Statistical Physics', '300 Level', 'Second'),
    c('PHY 401', 'Solid State Physics', '400 Level', 'First'),
  ],
  Zoology: [
    c('ZLY 301', 'Invertebrate Zoology', '300 Level', 'First'),
    c('ZLY 302', 'Entomology', '300 Level', 'First'),
    c('ZLY 305', 'Animal Physiology', '300 Level', 'Second'),
    c('ZLY 401', 'Fisheries and Aquatic Biology', '400 Level', 'First'),
  ],
  'Medicine & Surgery': [
    c('MED 301', 'General Pathology', '300 Level', 'First'),
    c('MED 302', 'Pharmacology', '300 Level', 'First'),
    c('MED 305', 'Community Medicine', '300 Level', 'Second'),
    c('MED 401', 'Obstetrics and Gynaecology', '400 Level', 'First'),
  ],
  Pharmacy: [
    c('PCP 301', 'Pharmacology III', '300 Level', 'First'),
    c('PHA 302', 'Pharmaceutics III', '300 Level', 'First'),
    c('PHC 305', 'Pharmaceutical Chemistry', '300 Level', 'Second'),
    c('PCG 401', 'Pharmacognosy', '400 Level', 'First'),
  ],
  Law: [
    c('LAW 301', 'Law of Contract II', '300 Level', 'First'),
    c('LAW 302', 'Criminal Law', '300 Level', 'First'),
    c('LAW 305', 'Law of Torts II', '300 Level', 'Second'),
    c('LAW 401', 'Land Law', '400 Level', 'First'),
  ],
  Education: [
    c('EDU 301', 'Educational Psychology', '300 Level', 'First'),
    c('EDU 302', 'Curriculum Studies', '300 Level', 'First'),
    c('EDU 305', 'Philosophy of Education', '300 Level', 'Second'),
    c('EDU 401', 'Educational Research Methods', '400 Level', 'First'),
  ],
  'Quality Assurance': [
    c('QA 301', 'Quality Management Systems', '300 Level', 'First'),
    c('QA 302', 'Statistical Process Control', '300 Level', 'First'),
    c('QA 305', 'Service Quality and SERVICOM', '300 Level', 'Second'),
    c('QA 401', 'Auditing and Compliance', '400 Level', 'First'),
  ],
}

/** Generic set for departments outside the curated catalogue. */
function generatedFor(department) {
  const prefix = department
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3) || 'GEN'
  return [
    c(`${prefix} 301`, `Foundations of ${department}`, '300 Level', 'First'),
    c(`${prefix} 302`, `Applied ${department}`, '300 Level', 'First'),
    c(`${prefix} 305`, `${department} Research Methods`, '300 Level', 'Second'),
    c(`${prefix} 401`, `Seminar in ${department}`, '400 Level', 'First'),
  ]
}

/**
 * The courses a student should evaluate: their department's courses plus the
 * GST courses everyone takes. Lecturers are attached deterministically.
 */
export function getCoursesForDepartment(department) {
  const core = CATALOGUE[department] || generatedFor(department || 'General Studies')
  return [...core, ...GST].map((course, i) => ({
    ...course,
    id: `${course.code}-${i}`,
    lecturer: lecturerFor(i),
    department,
  }))
}
