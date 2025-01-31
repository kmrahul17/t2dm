import React, { useState, useEffect, useMemo } from 'react';
import BMIMeter from './BMIMeter';
import BPMeter from './BPMeter';
import FamilyScoreMeter from './FamilyScoreMeter';

import EGFRGauge from './EGFRGauge';
import { generatePrescription } from './generatePrescription';

function NewUser({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    isPregnant: false,
    height: '',
    weight: '',
    waist: '',
    systolic: '',
    diastolic: '',
    fatherDM: null,
    motherDM: null,
    dietHabit: '',
    race: '',
    smoking: null,
    smokingYears: '',
    alcohol: null,
    alcoholYears: '',
    symptoms: {
      nocturia: false,
      polydipsia: false,
      polyuria: false,
      polyphagia: false,
      weightLoss: false,
      blurredVision: false,
      fatigue: false,
      numbness: false,
      
    },
  });
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bpCategory, setBpCategory] = useState('');

  const [investigationReports, setInvestigationReports] = useState({
    fastingPlasmaGlucose: false,
    postPrandialGlucose: false,
    hbA1c: false,
    randomPlasmaGlucose: false,
    serumCreatinine: false,
    fastingLipidProfile: false,
    urineREME: false,
    urineACR: false,
  });

  const [fastingGlucoseValue, setFastingGlucoseValue] = useState('');
  const [classification, setClassification] = useState('');

  const [postPrandialGlucoseValue, setPostPrandialGlucoseValue] = useState('');
  const [postPrandialClassification, setPostPrandialClassification] = useState('');

  const [hbA1cValue, setHbA1cValue] = useState('');
  const [hbA1cClassification, setHbA1cClassification] = useState('');

  const [randomPlasmaGlucoseValue, setRandomPlasmaGlucoseValue] = useState('');
  const [randomPlasmaClassification, setRandomPlasmaClassification] = useState('');

  const [serumCreatinineValue, setSerumCreatinineValue] = useState('');
  const [urineACRValue, setUrineACRValue] = useState('');

  const [totalCholesterol, setTotalCholesterol] = useState('');
  const [ldlCholesterol, setLdlCholesterol] = useState('');
  const [hdlCholesterol, setHdlCholesterol] = useState('');
  const [triglycerides, setTriglycerides] = useState('');

  const [urineGlucose, setUrineGlucose] = useState('absent');
  const [urineProtein, setUrineProtein] = useState('absent');
  const [urineKetones, setUrineKetones] = useState('absent');
  const [leucocyteEsterase, setLeucocyteEsterase] = useState('absent');
  const [pusCells, setPusCells] = useState('');
  const [epithelialCells, setEpithelialCells] = useState('');

  const [eGFRValue, setEGFRValue] = useState(null);
  const [eGFRClassification, setEGFRClassification] = useState('');

  const [prescription, setPrescription] = useState('');

  const segments = useMemo(() => [
    { start: 0, end: 16, color: '#FF0000', label: 'SEVERE THINNESS' },
    { start: 16, end: 17, color: '#FF6347', label: 'MODERATE THINNESS' },
    { start: 17, end: 18.5, color: '#FFA500', label: 'MILD THINNESS' },
    { start: 18.5, end: 24.9, color: '#32CD32', label: 'NORMAL' },
    { start: 24.9, end: 29.9, color: '#FFD700', label: 'OVERWEIGHT' },
    { start: 29.9, end: 34.9, color: '#FF8C00', label: 'OBESITY CLASS I' },
    { start: 34.9, end: 39.9, color: '#FF4500', label: 'OBESITY CLASS II' },
    { start: 39.9, end: 50, color: '#8B0000', label: 'OBESITY CLASS III' }
  ], []);

  const bpSegments = useMemo(() => [
    { start: 0, end: 90, color: '#FF0000', label: 'HYPOTENSION' },
    { start: 90, end: 120, color: '#32CD32', label: 'OPTIMAL' },
    { start: 120, end: 130, color: '#FFD700', label: 'NORMAL' },
    { start: 130, end: 140, color: '#FFA500', label: 'GRADE 1 HYPERTENSION' },
    { start: 140, end: 160, color: '#FF8C00', label: 'GRADE 2 HYPERTENSION' },
    { start: 160, end: 180, color: '#FF4500', label: 'GRADE 3 HYPERTENSION' },
    { start: 180, end: 200, color: '#8B0000', label: 'ISOLATED SYSTOLIC HYPERTENSION' }
  ], []);

  const calculateEGFR = (scr, age, gender) => {
    const K = gender === 'female' ? 0.7 : 0.9;
    const alpha = gender === 'female' ? -0.241 : -0.302;
    const minScrK = Math.min(scr / K, 1);
    const maxScrK = Math.max(scr / K, 1);
    
    const eGFR = 142 * minScrK ** alpha * maxScrK ** -1.200 * 0.9938 ** age;
    return eGFR;
  };

  const classifyEGFR = (value) => {
    if (value >= 90) return 'G1: Normal or high';
    if (value >= 60) return 'G2: Mildly decreased';
    if (value >= 45) return 'G3a: Mildly to moderately decreased';
    if (value >= 30) return 'G3b: Moderately to severely decreased';
    if (value >= 15) return 'G4: Severely decreased';
    return 'G5: Kidney failure';
  };

  const handleSerumCreatinineChange = (e) => {
    const value = parseFloat(e.target.value);
    setSerumCreatinineValue(value);
    if (!isNaN(value)) {
      const calculatedEGFR = calculateEGFR(value, formData.age, formData.gender);
      setEGFRValue(calculatedEGFR);
      setEGFRClassification(classifyEGFR(calculatedEGFR));
    } else {
      setEGFRValue(null);
      setEGFRClassification('');
    }
  };

  useEffect(() => {
    if (serumCreatinineValue && formData.age && formData.gender) {
      const scr = parseFloat(serumCreatinineValue);
      const age = parseInt(formData.age);
      const classificationResult = classifyEGFR(calculateEGFR(scr, age, formData.gender));
      setEGFRValue(calculateEGFR(scr, age, formData.gender));
      setEGFRClassification(classificationResult);
    } else {
      setEGFRValue(null);
      setEGFRClassification('');
    }
  }, [serumCreatinineValue, formData.age, formData.gender]);

  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInM = parseFloat(formData.height);
      const weightInKg = parseFloat(formData.weight);
      
      if (heightInM > 0 && weightInKg > 0) {
        const bmiValue = weightInKg / (heightInM * heightInM);
        setBmi(bmiValue);

        const category = segments.find(segment => bmiValue >= segment.start && bmiValue < segment.end)?.label || '';
        setBmiCategory(category);
      }
    }

    if (formData.systolic) {
      const systolicValue = parseFloat(formData.systolic);
      const category = bpSegments.find(segment => systolicValue >= segment.start && systolicValue < segment.end)?.label || '';
      setBpCategory(category);
    }
  }, [formData.height, formData.weight, formData.systolic, segments, bpSegments]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      symptoms: {
        ...prevData.symptoms,
        [name]: checked,
      },
    }));
  };

  useEffect(() => {
    const selectedSymptoms = Object.entries(formData.symptoms)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    console.log("Selected Symptoms:", selectedSymptoms);
  }, [formData.symptoms]);

  const handleInvestigationChange = (e) => {
    const { name, checked } = e.target;
    setInvestigationReports(prev => ({
      ...prev,
      [name]: checked,
    }));

    if (!checked && name === 'fastingPlasmaGlucose') {
      setFastingGlucoseValue('');
      setClassification('');
    }
  };

  const classifyFastingGlucose = (value) => {
    if (value >= 126) {
      return 'Diabetes';
    } else if (value >= 100) {
      return 'Prediabetes';
    } else {
      return 'Normal';
    }
  };

  useEffect(() => {
    if (investigationReports.fastingPlasmaGlucose && fastingGlucoseValue) {
      const value = parseFloat(fastingGlucoseValue);
      const classificationResult = classifyFastingGlucose(value);
      setClassification(classificationResult);
    }
  }, [fastingGlucoseValue, investigationReports.fastingPlasmaGlucose]);

  const classifyPostPrandialGlucose = (value) => {
    if (value >= 200) {
      return 'Diabetes';
    } else if (value >= 140) {
      return 'Prediabetes';
    } else {
      return 'Normal';
    }
  };

  useEffect(() => {
    if (investigationReports.postPrandialGlucose && postPrandialGlucoseValue) {
      const value = parseFloat(postPrandialGlucoseValue);
      const classificationResult = classifyPostPrandialGlucose(value);
      setPostPrandialClassification(classificationResult);
    }
  }, [postPrandialGlucoseValue, investigationReports.postPrandialGlucose]);

  const classifyHbA1c = (value) => {
    if (value >= 6.5) {
      return 'Diabetes';
    } else if (value >= 5.7) {
      return 'Prediabetes';
    } else if (value < 5.7) {
      return 'Normal';
    } else {
      return '';
    }
  };

  useEffect(() => {
    if (hbA1cValue) {
      const value = parseFloat(hbA1cValue);
      const classificationResult = classifyHbA1c(value);
      setHbA1cClassification(classificationResult);
    }
  }, [hbA1cValue]);

  const classifyRandomPlasmaGlucose = (value) => {
    if (value >= 200) {
      return 'Diabetes';
    } else if (value < 200) {
      return 'Normal';
    } else {
      return '';
    }
  };

  useEffect(() => {
    if (randomPlasmaGlucoseValue) {
      const value = parseFloat(randomPlasmaGlucoseValue);
      const classificationResult = classifyRandomPlasmaGlucose(value);
      setRandomPlasmaClassification(classificationResult);
    }
  }, [randomPlasmaGlucoseValue]);

  const classifyCholesterol = () => {
    const cholesterolLevels = {
      total: totalCholesterol,
      ldl: ldlCholesterol,
      hdl: hdlCholesterol,
      triglycerides: triglycerides,
    };

    const classifications = {
      total: '',
      ldl: '',
      hdl: '',
      triglycerides: '',
    };

    if (cholesterolLevels.total < 200) {
      classifications.total = 'Ideal';
    } else if (cholesterolLevels.total < 240) {
      classifications.total = 'Borderline';
    } else {
      classifications.total = 'Too High';
    }

    if (cholesterolLevels.ldl < 100) {
      classifications.ldl = 'Ideal';
    } else if (cholesterolLevels.ldl < 160) {
      classifications.ldl = 'Borderline';
    } else if (cholesterolLevels.ldl < 190) {
      classifications.ldl = 'High';
    } else {
      classifications.ldl = 'Very High';
    }

    if (cholesterolLevels.hdl > 60) {
      classifications.hdl = 'Ideal';
    } else if (cholesterolLevels.hdl >= 40 && formData.gender === 'female') {
      classifications.hdl = 'Borderline';
    } else if (cholesterolLevels.hdl >= 50 && formData.gender === 'male') {
      classifications.hdl = 'Borderline';
    } else {
      classifications.hdl = 'Low';
    }

    if (cholesterolLevels.triglycerides < 150) {
      classifications.triglycerides = 'Ideal';
    } else if (cholesterolLevels.triglycerides < 200) {
      classifications.triglycerides = 'Borderline';
    } else if (cholesterolLevels.triglycerides < 500) {
      classifications.triglycerides = 'High';
    } else {
      classifications.triglycerides = 'Very High';
    }

    return classifications;
  };

  const renderCholesterolTower = () => {
    const classifications = classifyCholesterol();
    return (
      <div style={{ marginTop: '20px' }}>
        <h4>Cholesterol Level Classification</h4>
        <div>
          <div style={{ color: classifications.total === 'Ideal' ? 'green' : classifications.total === 'Borderline' ? 'orange' : 'red' }}>
            Total Cholesterol: {classifications.total}
          </div>
          <div style={{ color: classifications.ldl === 'Ideal' ? 'green' : classifications.ldl === 'Borderline' ? 'orange' : 'red' }}>
            LDL Cholesterol: {classifications.ldl}
          </div>
          <div style={{ color: classifications.hdl === 'Ideal' ? 'green' : classifications.hdl === 'Borderline' ? 'orange' : 'red' }}>
            HDL Cholesterol: {classifications.hdl}
          </div>
          <div style={{ color: classifications.triglycerides === 'Ideal' ? 'green' : classifications.triglycerides === 'Borderline' ? 'orange' : 'red' }}>
            Triglycerides: {classifications.triglycerides}
          </div>
        </div>
      </div>
    );
  };

  const renderUrineTests = () => {
    return (
      <div style={{ marginTop: '20px' }}>
        <h4>Urine Test Results</h4>
        <div>
          <label>
            Urine Glucose:
            <div>
              <label>
                <input
                  type="radio"
                  value="present"
                  checked={urineGlucose === 'present'}
                  onChange={() => setUrineGlucose('present')}
                />
                Present
              </label>
              <label>
                <input
                  type="radio"
                  value="absent"
                  checked={urineGlucose === 'absent'}
                  onChange={() => setUrineGlucose('absent')}
                />
                Absent
              </label>
            </div>
          </label>

          <label>
            Urine Protein:
            <div>
              <label>
                <input
                  type="radio"
                  value="present"
                  checked={urineProtein === 'present'}
                  onChange={() => setUrineProtein('present')}
                />
                Present
              </label>
              <label>
                <input
                  type="radio"
                  value="absent"
                  checked={urineProtein === 'absent'}
                  onChange={() => setUrineProtein('absent')}
                />
                Absent
              </label>
            </div>
          </label>

          <label>
            Urine Ketones:
            <div>
              <label>
                <input
                  type="radio"
                  value="present"
                  checked={urineKetones === 'present'}
                  onChange={() => setUrineKetones('present')}
                />
                Present
              </label>
              <label>
                <input
                  type="radio"
                  value="absent"
                  checked={urineKetones === 'absent'}
                  onChange={() => setUrineKetones('absent')}
                />
                Absent
              </label>
            </div>
          </label>

          <label>
            Leucocyte Esterase:
            <div>
              <label>
                <input
                  type="radio"
                  value="present"
                  checked={leucocyteEsterase === 'present'}
                  onChange={() => setLeucocyteEsterase('present')}
                />
                Present
              </label>
              <label>
                <input
                  type="radio"
                  value="absent"
                  checked={leucocyteEsterase === 'absent'}
                  onChange={() => setLeucocyteEsterase('absent')}
                />
                Absent
              </label>
            </div>
          </label>

          <label>
            Pus Cells:
            <input
              type="number"
              placeholder="Enter Pus Cells"
              value={pusCells}
              onChange={(e) => setPusCells(e.target.value)}
              className="input-field small-input"
            />
          </label>

          <label>
            Epithelial Cells:
            <input
              type="number"
              placeholder="Enter Epithelial Cells"
              value={epithelialCells}
              onChange={(e) => setEpithelialCells(e.target.value)}
              className="input-field small-input"
            />
          </label>
        </div>
        {renderUrineResults()}
      </div>
    );
  };

  const renderUrineResults = () => {
    const allValuesEntered = pusCells !== '' && epithelialCells !== '' && urineGlucose !== '' && urineProtein !== '' && urineKetones !== '' && leucocyteEsterase !== '';
    
    if (!allValuesEntered) {
      return null;
    }

    return (
      <div style={{ marginTop: '20px' }}>
        <h4>Urine Test Results</h4>
        <div>
          <div style={{ color: urineGlucose === 'present' ? 'red' : 'green' }}>
            Urine Glucose: {urineGlucose === 'present' ? 'Abnormal: Positive' : 'Normal: Negative'}
          </div>
          <div style={{ color: urineProtein === 'present' ? 'red' : 'green' }}>
            Urine Protein: {urineProtein === 'present' ? 'Abnormal: Positive' : 'Normal: Negative or Trace'}
          </div>
          <div style={{ color: urineKetones === 'present' ? 'red' : 'green' }}>
            Urine Ketones: {urineKetones === 'present' ? 'Abnormal: Positive' : 'Normal: Negative'}
          </div>
          <div style={{ color: leucocyteEsterase === 'present' ? 'red' : 'green' }}>
            Leucocyte Esterase: {leucocyteEsterase === 'present' ? 'Abnormal: Positive' : 'Normal: Negative'}
          </div>
          <div style={{ color: pusCells > 5 ? 'red' : 'green' }}>
            Pus Cells: {pusCells > 5 ? 'Abnormal: >5 per HPF' : 'Normal: 0–5 per HPF'}
          </div>
          <div style={{ color: epithelialCells > 5 ? 'red' : 'green' }}>
            Epithelial Cells: {epithelialCells > 5 ? 'Abnormal: >5 per HPF' : 'Normal: 0–5 per HPF'}
          </div>
        </div>
      </div>
    );
  };

  const renderUrineACR = () => {
    return (
      <div style={{ marginTop: '20px' }}>
        <label>
          Urine ACR (mg/g):
          <input
            type="number"
            placeholder="Enter Urine ACR"
            value={urineACRValue}
            onChange={(e) => setUrineACRValue(e.target.value)}
            className="input-field small-input"
          />
        </label>
        {renderACRClassification()}
      </div>
    );
  };

  const renderACRClassification = () => {
    if (urineACRValue === '') return null;

    const acrValue = parseFloat(urineACRValue);
    let classification = '';
    let meterColor = '';

    if (acrValue < 30) {
      classification = 'A1: Normal';
      meterColor = 'green';
    } else if (acrValue >= 30 && acrValue <= 300) {
      classification = 'A2: Moderately Increased';
      meterColor = 'orange';
    } else if (acrValue > 300) {
      classification = 'A3: Severely Increased';
      meterColor = 'red';
    }

    return (
      <div style={{ marginTop: '10px' }}>
        <div style={{ color: meterColor }}>
          ACR Classification: {classification}
        </div>
        <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '5px', marginTop: '5px' }}>
          <div style={{
            width: `${(acrValue > 300 ? 100 : acrValue < 30 ? 0 : (acrValue / 300) * 100)}%`,
            height: '100%',
            backgroundColor: meterColor,
            borderRadius: '5px'
          }} />
        </div>
      </div>
    );
  };

  const handleGeneratePrescription = () => {
    const fpg = investigationReports.fastingPlasmaGlucose ? parseFloat(fastingGlucoseValue) : null;
    const ppPG = investigationReports.postPrandialGlucose ? parseFloat(postPrandialGlucoseValue) : null;
    const rpg = investigationReports.randomPlasmaGlucose ? parseFloat(randomPlasmaGlucoseValue) : null;
    const hbA1cValueParsed = investigationReports.hbA1c ? parseFloat(hbA1cValue) : null;

    const symptomsCount = Object.values(formData.symptoms).filter(Boolean).length;

    const prescription = generatePrescription(fpg, ppPG, rpg, hbA1cValueParsed, symptomsCount);
    setPrescription(prescription);
  };

  return (
    <div className="container">
      <button onClick={onBack} className="button button-back">
        Back
      </button>
      <form className="bmi-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange}
            />
            Male
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange}
            />
            Female
          </label>
        </div>

        {formData.gender === 'female' && (
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="pregnancyStatus"
                value="pregnant"
                onChange={handleChange}
              />
              Pregnant
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="pregnancyStatus"
                value="non-pregnant"
                onChange={handleChange}
              />
              Non-Pregnant
            </label>
          </div>
        )}

        <div className="form-group">
          <input
            type="number"
            name="height"
            placeholder="Height (m)"
            value={formData.height}
            onChange={handleChange}
            className="input-field"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={handleChange}
            className="input-field"
            step="0.1"
          />
        </div>
      </form>

      {bmi && (
        <div className="meter-container">
          <div className="bmi-meter-section">
            <div className="bmi-meter-container">
              <BMIMeter bmi={bmi} category={bmiCategory} />
            </div>
            <div className="bmi-legend">
              {segments.map((segment, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: segment.color }}></span>
                  <span className="legend-label">{segment.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <form className="bp-form">
        <div className="form-group">
          <input
            type="number"
            name="waist"
            placeholder="Waist Circumference (cm)"
            value={formData.waist}
            onChange={handleChange}
            className="input-field"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="systolic"
            placeholder="Systolic BP (mm Hg)"
            value={formData.systolic}
            onChange={handleChange}
            className="input-field"
            step="1"
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="diastolic"
            placeholder="Diastolic BP (mm Hg)"
            value={formData.diastolic}
            onChange={handleChange}
            className="input-field"
            step="1"
          />
        </div>
      </form>

      {formData.systolic && formData.diastolic && (
        <div className="meter-container">
          <div className="bp-meter-section" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="bp-meter-container">
              <BPMeter systolic={formData.systolic} category={bpCategory} />
            </div>
            <div className="bp-legend" style={{ marginLeft: '20px' }}>
              {bpSegments.map((segment, index) => (
                <div key={index} className="legend-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <span className="legend-color" style={{ backgroundColor: segment.color, width: '20px', height: '20px', display: 'inline-block', marginRight: '10px' }}></span>
                  <span className="legend-label" style={{ fontSize: '14px', fontWeight: 'bold', width: '150px', display: 'inline-block' }}>{segment.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '20px' }}>
        <div className="family-history-section" style={{ marginBottom: '20px' }}>
          <h3>Family History of DM</h3>
          <div>
            <div>
              <label>Father: </label>
              <label>
                <input
                  type="radio"
                  name="fatherDM"
                  value="yes"
                  checked={formData.fatherDM === 'yes'}
                  onChange={handleRadioChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="fatherDM"
                  value="no"
                  checked={formData.fatherDM === 'no'}
                  onChange={handleRadioChange}
                />
                No
              </label>
            </div>
            <div>
              <label>Mother: </label>
              <label>
                <input
                  type="radio"
                  name="motherDM"
                  value="yes"
                  checked={formData.motherDM === 'yes'}
                  onChange={handleRadioChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="motherDM"
                  value="no"
                  checked={formData.motherDM === 'no'}
                  onChange={handleRadioChange}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {formData.fatherDM !== null && formData.motherDM !== null && (
          <FamilyScoreMeter score={(formData.fatherDM === 'yes' ? 1 : 0) + (formData.motherDM === 'yes' ? 1 : 0)} />
        )}

        <div className="diet-habit-section" style={{ marginBottom: '20px' }}>
          <h3>Diet Habit</h3>
          <div>
            <label>
              <input
                type="radio"
                name="dietHabit"
                value="veg"
                checked={formData.dietHabit === 'veg'}
                onChange={handleRadioChange}
              />
              Veg
            </label>
            <label>
              <input
                type="radio"
                name="dietHabit"
                value="non-veg"
                checked={formData.dietHabit === 'non-veg'}
                onChange={handleRadioChange}
              />
              Non-Veg
            </label>
            <label>
              <input
                type="radio"
                name="dietHabit"
                value="eggetarian"
                checked={formData.dietHabit === 'eggetarian'}
                onChange={handleRadioChange}
              />
              Eggetarian
            </label>
          </div>
        </div>

        <div className="race-section" style={{ marginBottom: '20px' }}>
          <h3>Race</h3>
          <div>
            <label>
              <input
                type="radio"
                name="race"
                value="non-black"
                checked={formData.race === 'non-black'}
                onChange={handleRadioChange}
              />
              Non-Black
            </label>
            <label>
              <input
                type="radio"
                name="race"
                value="black"
                checked={formData.race === 'black'}
                onChange={handleRadioChange}
              />
              Black
            </label>
          </div>
        </div>

        <div className="smoking-section" style={{ marginBottom: '20px' }}>
          <h3>Smoking</h3>
          <div>
            <label>
              <input
                type="radio"
                name="smoking"
                value="yes"
                checked={formData.smoking === 'yes'}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="smoking"
                value="no"
                checked={formData.smoking === 'no'}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
          {formData.smoking === 'yes' && (
            <div style={{ marginTop: '10px' }}>
              <h4>For how many years?</h4>
              <label>
                <input
                  type="radio"
                  name="smokingYears"
                  value="<5"
                  checked={formData.smokingYears === '<5'}
                  onChange={(e) => setFormData({ ...formData, smokingYears: e.target.value })}
                />
                &lt; 5 years
              </label>
              <label>
                <input
                  type="radio"
                  name="smokingYears"
                  value="5-10"
                  checked={formData.smokingYears === '5-10'}
                  onChange={(e) => setFormData({ ...formData, smokingYears: e.target.value })}
                />
                5-10 years
              </label>
              <label>
                <input
                  type="radio"
                  name="smokingYears"
                  value=">10"
                  checked={formData.smokingYears === '>10'}
                  onChange={(e) => setFormData({ ...formData, smokingYears: e.target.value })}
                />
                &gt; 10 years
              </label>
            </div>
          )}
        </div>

        <div className="alcohol-section" style={{ marginBottom: '20px' }}>
          <h3>Alcohol</h3>
          <div>
            <label>
              <input
                type="radio"
                name="alcohol"
                value="yes"
                checked={formData.alcohol === 'yes'}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="alcohol"
                value="no"
                checked={formData.alcohol === 'no'}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
          {formData.alcohol === 'yes' && (
            <div style={{ marginTop: '10px' }}>
              <h4>For how many years?</h4>
              <label>
                <input
                  type="radio"
                  name="alcoholYears"
                  value="<5"
                  checked={formData.alcoholYears === '<5'}
                  onChange={(e) => setFormData({ ...formData, alcoholYears: e.target.value })}
                />
                &lt; 5 years
              </label>
              <label>
                <input
                  type="radio"
                  name="alcoholYears"
                  value="5-10"
                  checked={formData.alcoholYears === '5-10'}
                  onChange={(e) => setFormData({ ...formData, alcoholYears: e.target.value })}
                />
                5-10 years
              </label>
              <label>
                <input
                  type="radio"
                  name="alcoholYears"
                  value=">10"
                  checked={formData.alcoholYears === '>10'}
                  onChange={(e) => setFormData({ ...formData, alcoholYears: e.target.value })}
                />
                &gt; 10 years
              </label>
            </div>
          )}
        </div>

        <div className="symptoms-section" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h3 style={{ marginBottom: '10px' }}>Symptoms present? (tick all that apply)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.keys(formData.symptoms).map((symptom) => (
              <label key={symptom} style={{ display: 'flex', alignItems: 'center', fontSize: '16px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name={symptom}
                  checked={formData.symptoms[symptom]}
                  onChange={handleCheckboxChange}
                  style={{ marginRight: '8px' }}
                />
                {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="investigation-reports-section" style={{ marginBottom: '20px', textAlign: 'left' }}>
        <h3>Investigation Reports (tick all that apply)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label>
            <input
              type="checkbox"
              name="fastingPlasmaGlucose"
              checked={investigationReports.fastingPlasmaGlucose}
              onChange={handleInvestigationChange}
            />
            Fasting Plasma Glucose
          </label>
          {investigationReports.fastingPlasmaGlucose && (
            <div className="form-group" style={{ marginLeft: '20px' }}>
              <input
                type="number"
                placeholder="Enter Fasting Plasma Glucose"
                value={fastingGlucoseValue}
                onChange={(e) => setFastingGlucoseValue(e.target.value)}
                className="input-field small-input"
              />
              {classification && (
                <p style={{ marginTop: '5px', fontWeight: 'bold' }}>Classification: {classification}</p>
              )}
            </div>
          )}
          <label>
            <input
              type="checkbox"
              name="postPrandialGlucose"
              checked={investigationReports.postPrandialGlucose}
              onChange={handleInvestigationChange}
            />
            2hr Post-prandial Plasma Glucose
          </label>
          {investigationReports.postPrandialGlucose && (
            <div className="form-group" style={{ marginLeft: '20px' }}>
              <input
                type="number"
                placeholder="Enter 2hr Post-prandial Plasma Glucose"
                value={postPrandialGlucoseValue}
                onChange={(e) => setPostPrandialGlucoseValue(e.target.value)}
                className="input-field small-input"
              />
              {postPrandialClassification && (
                <p style={{ marginTop: '5px', fontWeight: 'bold' }}>Classification: {postPrandialClassification}</p>
              )}
            </div>
          )}
          <label>
            <input
              type="checkbox"
              name="hbA1c"
              checked={investigationReports.hbA1c}
              onChange={handleInvestigationChange}
            />
            HbA1c
          </label>
          {investigationReports.hbA1c && (
            <div className="form-group" style={{ marginLeft: '20px' }}>
              <input
                type="number"
                placeholder="Enter HbA1c"
                value={hbA1cValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setHbA1cValue(value);
                  if (value) {
                    const classificationResult = classifyHbA1c(parseFloat(value));
                    setHbA1cClassification(classificationResult);
                  } else {
                    setHbA1cClassification('');
                  }
                }}
                className="input-field small-input"
              />
              {hbA1cClassification && (
                <p style={{ marginTop: '5px', fontWeight: 'bold' }}>Classification: {hbA1cClassification}</p>
              )}
            </div>
          )}
          <label>
            <input
              type="checkbox"
              name="randomPlasmaGlucose"
              checked={investigationReports.randomPlasmaGlucose}
              onChange={handleInvestigationChange}
            />
            Random Plasma Glucose
          </label>
          {investigationReports.randomPlasmaGlucose && (
            <div className="form-group" style={{ marginLeft: '20px' }}>
              <input
                type="number"
                placeholder="Enter Random Plasma Glucose"
                value={randomPlasmaGlucoseValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setRandomPlasmaGlucoseValue(value);
                  if (value) {
                    const classificationResult = classifyRandomPlasmaGlucose(parseFloat(value));
                    setRandomPlasmaClassification(classificationResult);
                  } else {
                    setRandomPlasmaClassification('');
                  }
                }}
                className="input-field small-input"
              />
              {randomPlasmaClassification && (
                <p style={{ marginTop: '5px', fontWeight: 'bold' }}>Classification: {randomPlasmaClassification}</p>
              )}
            </div>
          )}
          <label>
            <input
              type="checkbox"
              name="serumCreatinine"
              checked={investigationReports.serumCreatinine}
              onChange={handleInvestigationChange}
            />
            Serum Creatinine
          </label>
          {investigationReports.serumCreatinine && (
            <div className="form-group" style={{ marginLeft: '20px' }}>
              <input
                type="number"
                placeholder="Enter Serum Creatinine"
                value={serumCreatinineValue}
                onChange={handleSerumCreatinineChange}
                className="input-field small-input"
              />
              {eGFRValue && (
                <div style={{ marginTop: '10px' }}>
                  <EGFRGauge eGFRValue={eGFRValue} />
                </div>
              )}
              {eGFRClassification && (
                <p style={{ marginTop: '5px', fontWeight: 'bold' }}>Classification: {eGFRClassification}</p>
              )}
            </div>
          )}
          <label>
            <input
              type="checkbox"
              name="fastingLipidProfile"
              checked={investigationReports.fastingLipidProfile}
              onChange={handleInvestigationChange}
            />
            Fasting Lipid Profile (g)
          </label>
          {investigationReports.fastingLipidProfile && (
            <div className="form-group" style={{ marginLeft: '20px' }}>
              <input
                type="number"
                placeholder="Enter Total Cholesterol"
                value={totalCholesterol}
                onChange={(e) => setTotalCholesterol(e.target.value)}
                className="input-field small-input"
              />
              <input
                type="number"
                placeholder="Enter LDL Cholesterol"
                value={ldlCholesterol}
                onChange={(e) => setLdlCholesterol(e.target.value)}
                className="input-field small-input"
              />
              <input
                type="number"
                placeholder="Enter HDL Cholesterol"
                value={hdlCholesterol}
                onChange={(e) => setHdlCholesterol(e.target.value)}
                className="input-field small-input"
              />
              <input
                type="number"
                placeholder="Enter Triglycerides"
                value={triglycerides}
                onChange={(e) => setTriglycerides(e.target.value)}
                className="input-field small-input"
              />
              {totalCholesterol && ldlCholesterol && hdlCholesterol && triglycerides && renderCholesterolTower()}
            </div>
          )}
          <label>
            <input
              type="checkbox"
              name="urineREME"
              checked={investigationReports.urineREME}
              onChange={handleInvestigationChange}
            />
            Urine (RE, ME)
          </label>
          {investigationReports.urineREME && renderUrineTests()}
          <label>
            <input
              type="checkbox"
              name="urineACR"
              checked={investigationReports.urineACR}
              onChange={handleInvestigationChange}
            />
            Urine ACR
          </label>
          {investigationReports.urineACR && renderUrineACR()}
          <button onClick={handleGeneratePrescription} style={{ marginTop: '20px' }}>
            Generate Prescription
          </button>
          {prescription && (
            <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '10px' }}>
              <h4>Generated Prescription:</h4>
              {prescription}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewUser;
