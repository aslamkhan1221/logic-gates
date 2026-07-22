import type { NodeType } from '../types/logic';

export interface PracticalAmpParams {
  type: NodeType;
  vcc: number; // VCC Supply Voltage (V), e.g. 12V
  vBias: number; // Transistor Bias Voltage (V), e.g. 0.7V
  rLoad: number; // Load Resistance (Ohms), e.g. 8, 16, 100, 1000
  vinPeak: number; // Input Signal Amplitude Peak (V)
  freqHz: number; // Frequency (Hz)
  gain: number; // Desired Voltage Gain (Av)
  beta: number; // Transistor Beta / hFE (e.g., 100)
}

export interface PracticalAmpMetrics {
  vcc: number;
  rLoad: number;
  vInPeak: number;
  vOutPeak: number;
  vInRms: number;
  vOutRms: number;
  voltageGain: number; // Av
  voltageGainDb: number; // Av (dB)
  powerGainDb: number; // Ap (dB)
  pInMw: number; // Input AC Power (mW)
  pOutMw: number; // Output AC Power (mW)
  pDcMw: number; // DC Power Consumption (mW)
  pDissipationMw: number; // Transistor Heat Dissipation (mW)
  efficiency: number; // Efficiency % (eta)
  thdPercent: number; // Total Harmonic Distortion %
  vCeq: number; // DC Operating Voltage VCEQ (V)
  iCqMa: number; // DC Operating Current ICQ (mA)
  iSatMa: number; // Saturation Current IC(sat) (mA)
  conductionAngleDeg: number; // Conduction Angle (Degrees)
  harmonics: { order: number; freq: number; magnitude: number }[]; // FFT Harmonics
}

export interface WaveformPoint {
  time: number; // ms
  vIn: number; // Input Voltage (V)
  vOut: number; // Output Voltage (V)
  pwmVal?: number; // Class D PWM (V)
  iCollector?: number; // Collector Current (mA)
}

export const AMPLIFIER_LAB_SPECS: Record<string, {
  type: NodeType;
  name: string;
  classLetter: string;
  typicalEfficiency: string;
  conductionAngle: string;
  description: string;
  color: string;
  defaultParams: PracticalAmpParams;
}> = {
  AMP_CLASS_A: {
    type: 'AMP_CLASS_A',
    name: 'Class A Power Amplifier',
    classLetter: 'A',
    typicalEfficiency: '25% (Capacitive) - 50% (Transformer)',
    conductionAngle: '360° (Full Cycle)',
    description: 'Q-point biased at mid-loadline (VCC/2). Transistor conducts continuously for 360°. Maximum signal linearity with zero crossover distortion.',
    color: '#38bdf8', // Cyan
    defaultParams: {
      type: 'AMP_CLASS_A',
      vcc: 12,
      vBias: 0.7,
      rLoad: 16,
      vinPeak: 1.0,
      freqHz: 1000,
      gain: 4.0,
      beta: 100,
    },
  },
  AMP_CLASS_B: {
    type: 'AMP_CLASS_B',
    name: 'Class B Push-Pull Amplifier',
    classLetter: 'B',
    typicalEfficiency: '78.5% (Theoretical Max)',
    conductionAngle: '180° (Half Cycle)',
    description: 'Q-point biased at Cutoff (IB=0). NPN and PNP transistors conduct for 180° each. Shows crossover distortion near 0V due to VBE threshold (0.7V).',
    color: '#f43f5e', // Rose
    defaultParams: {
      type: 'AMP_CLASS_B',
      vcc: 12,
      vBias: 0.0,
      rLoad: 16,
      vinPeak: 2.0,
      freqHz: 1000,
      gain: 4.0,
      beta: 100,
    },
  },
  AMP_CLASS_AB: {
    type: 'AMP_CLASS_AB',
    name: 'Class AB Biased Amplifier',
    classLetter: 'AB',
    typicalEfficiency: '60% - 70%',
    conductionAngle: '200° - 220°',
    description: 'Diodes or small DC bias pre-bias transistors above VBE (0.7V). Eliminates Class B crossover distortion while retaining high efficiency.',
    color: '#10b981', // Emerald
    defaultParams: {
      type: 'AMP_CLASS_AB',
      vcc: 12,
      vBias: 0.7,
      rLoad: 16,
      vinPeak: 2.0,
      freqHz: 1000,
      gain: 4.0,
      beta: 100,
    },
  },
  AMP_CLASS_C: {
    type: 'AMP_CLASS_C',
    name: 'Class C Tuned RF Amplifier',
    classLetter: 'C',
    typicalEfficiency: '80% - 90%',
    conductionAngle: '< 120° (Short Pulses)',
    description: 'Q-point biased deep into Cutoff. Transistor conducts only during peak tips (<120°). Parallel LC resonant tank filter reconstructs sine wave.',
    color: '#f59e0b', // Amber
    defaultParams: {
      type: 'AMP_CLASS_C',
      vcc: 12,
      vBias: -1.0,
      rLoad: 50,
      vinPeak: 3.0,
      freqHz: 1000,
      gain: 5.0,
      beta: 100,
    },
  },
  AMP_CLASS_D: {
    type: 'AMP_CLASS_D',
    name: 'Class D Switching PWM Amp',
    classLetter: 'D',
    typicalEfficiency: '90% - 98%',
    conductionAngle: '360° Digital PWM',
    description: 'Transistors operate as high-frequency digital switches (ON/OFF) using Pulse Width Modulation. LC filter recovers high-efficiency analog audio.',
    color: '#8b5cf6', // Violet
    defaultParams: {
      type: 'AMP_CLASS_D',
      vcc: 12,
      vBias: 0.0,
      rLoad: 8,
      vinPeak: 2.0,
      freqHz: 1000,
      gain: 4.0,
      beta: 100,
    },
  },
};

export const AMPLIFIER_SPECS = AMPLIFIER_LAB_SPECS;

/**
 * Calculates exact practical quantitative lab metrics for a given amplifier setup.
 */
export function calculatePracticalMetrics(params: PracticalAmpParams): PracticalAmpMetrics {
  const { type, vcc, rLoad, vinPeak, gain } = params;

  const vInRms = vinPeak / Math.SQRT2;
  const iSatMa = (vcc / rLoad) * 1000; // mA

  let vOutPeak = 0;
  let thdPercent = 0;
  let vCeq = vcc / 2;
  let iCqMa = iSatMa / 2;
  let efficiency = 0;
  let conductionAngleDeg = 360;

  switch (type) {
    case 'AMP_CLASS_A': {
      vCeq = vcc / 2;
      iCqMa = (vcc / (2 * rLoad)) * 1000;
      conductionAngleDeg = 360;
      const maxPeak = vcc / 2 - 0.5;
      const rawPeak = vinPeak * gain;
      vOutPeak = Math.min(rawPeak, maxPeak);

      thdPercent = rawPeak > maxPeak ? ((rawPeak - maxPeak) / rawPeak) * 25 : 0.05;
      const pOutMw = (vOutPeak * vOutPeak) / (2 * rLoad) * 1000;
      const pDcMw = vcc * iCqMa;
      efficiency = (pOutMw / pDcMw) * 100;
      break;
    }

    case 'AMP_CLASS_B': {
      vCeq = vcc;
      iCqMa = 5;
      conductionAngleDeg = 180;
      const maxPeak = vcc - 1.0;
      const rawPeak = vinPeak * gain;
      vOutPeak = Math.min(rawPeak, maxPeak);

      thdPercent = 4.8;
      const pOutMw = (vOutPeak * vOutPeak) / (2 * rLoad) * 1000;
      const iAvgMa = (vOutPeak / (Math.PI * rLoad)) * 1000;
      const pDcMw = vcc * iAvgMa;
      efficiency = pDcMw > 0 ? (pOutMw / pDcMw) * 100 : 78.5;
      break;
    }

    case 'AMP_CLASS_AB': {
      vCeq = vcc / 2;
      iCqMa = (iSatMa * 0.08);
      conductionAngleDeg = 210;
      const maxPeak = vcc - 0.8;
      const rawPeak = vinPeak * gain;
      vOutPeak = Math.min(rawPeak, maxPeak);

      thdPercent = 0.08;
      const pOutMw = (vOutPeak * vOutPeak) / (2 * rLoad) * 1000;
      const iAvgMa = (vOutPeak / (Math.PI * rLoad)) * 1000 + iCqMa;
      const pDcMw = vcc * iAvgMa;
      efficiency = (pOutMw / pDcMw) * 100;
      break;
    }

    case 'AMP_CLASS_C': {
      vCeq = vcc;
      iCqMa = 0;
      conductionAngleDeg = 110;
      const maxPeak = vcc - 1.5;
      const rawPeak = vinPeak * gain;
      vOutPeak = Math.min(rawPeak, maxPeak);

      thdPercent = 12.5;
      efficiency = 85.0;
      break;
    }

    case 'AMP_CLASS_D': {
      vCeq = 0;
      iCqMa = 2;
      conductionAngleDeg = 360;
      const maxPeak = vcc - 0.3;
      const rawPeak = vinPeak * gain;
      vOutPeak = Math.min(rawPeak, maxPeak);

      thdPercent = 0.15;
      efficiency = 94.2;
      break;
    }
  }

  const vOutRms = vOutPeak / Math.SQRT2;
  const voltageGain = vinPeak > 0 ? vOutPeak / vinPeak : 0;
  const voltageGainDb = 20 * Math.log10(Math.max(1, voltageGain));

  const pInMw = (vInRms * vInRms) / 1000 * 1000 || 1.0;
  const pOutMw = (vOutRms * vOutRms) / rLoad * 1000;
  const pDcMw = (pOutMw / (Math.max(5, efficiency) / 100));
  const pDissipationMw = Math.max(0, pDcMw - pOutMw);
  const powerGainDb = 10 * Math.log10(Math.max(1, (pOutMw / pInMw)));

  const f0 = params.freqHz;
  const harmonics = [
    { order: 1, freq: f0, magnitude: vOutPeak },
    { order: 2, freq: f0 * 2, magnitude: Number((vOutPeak * (thdPercent / 100) * 0.7).toFixed(2)) },
    { order: 3, freq: f0 * 3, magnitude: Number((vOutPeak * (thdPercent / 100) * 0.4).toFixed(2)) },
    { order: 4, freq: f0 * 4, magnitude: Number((vOutPeak * (thdPercent / 100) * 0.2).toFixed(2)) },
    { order: 5, freq: f0 * 5, magnitude: Number((vOutPeak * (thdPercent / 100) * 0.1).toFixed(2)) },
  ];

  return {
    vcc,
    rLoad,
    vInPeak: Number(vinPeak.toFixed(2)),
    vOutPeak: Number(vOutPeak.toFixed(2)),
    vInRms: Number(vInRms.toFixed(2)),
    vOutRms: Number(vOutRms.toFixed(2)),
    voltageGain: Number(voltageGain.toFixed(2)),
    voltageGainDb: Number(voltageGainDb.toFixed(1)),
    powerGainDb: Number(powerGainDb.toFixed(1)),
    pInMw: Number(pInMw.toFixed(1)),
    pOutMw: Number(pOutMw.toFixed(1)),
    pDcMw: Number(pDcMw.toFixed(1)),
    pDissipationMw: Number(pDissipationMw.toFixed(1)),
    efficiency: Number(efficiency.toFixed(1)),
    thdPercent: Number(thdPercent.toFixed(2)),
    vCeq: Number(vCeq.toFixed(1)),
    iCqMa: Number(iCqMa.toFixed(1)),
    iSatMa: Number(iSatMa.toFixed(1)),
    conductionAngleDeg,
    harmonics,
  };
}

/**
 * Generates practical time-series waveforms.
 */
export function generatePracticalWaveformPoints(
  params: PracticalAmpParams,
  numPoints: number = 200,
  timeOffset: number = 0
): WaveformPoint[] {
  const { type, vcc, vinPeak, gain, freqHz } = params;
  const metrics = calculatePracticalMetrics(params);
  const points: WaveformPoint[] = [];

  const periodMs = 1000 / freqHz;

  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * (2 * periodMs) + timeOffset;
    const rad = (2 * Math.PI * (t % periodMs)) / periodMs;

    const vIn = vinPeak * Math.sin(rad);
    let vOut = 0;
    let pwmVal = 0;
    let iCollector = 0;

    switch (type) {
      case 'AMP_CLASS_A':
        vOut = Math.min(vcc / 2, Math.max(-vcc / 2, gain * vIn));
        iCollector = metrics.iCqMa + (vOut / params.rLoad) * 1000;
        break;

      case 'AMP_CLASS_B':
        if (vIn > 0.1) {
          vOut = Math.min(vcc - 1, gain * (vIn - 0.1));
        } else if (vIn < -0.1) {
          vOut = Math.max(-(vcc - 1), gain * (vIn + 0.1));
        } else {
          vOut = 0;
        }
        iCollector = Math.max(0, (vOut / params.rLoad) * 1000);
        break;

      case 'AMP_CLASS_AB':
        vOut = Math.min(vcc - 0.8, Math.max(-(vcc - 0.8), gain * vIn));
        iCollector = metrics.iCqMa + Math.max(0, (vOut / params.rLoad) * 1000);
        break;

      case 'AMP_CLASS_C':
        if (vIn > 0.4 * vinPeak) {
          vOut = Math.min(vcc - 1, gain * (vIn - 0.4 * vinPeak) * 2.2);
          iCollector = (vOut / params.rLoad) * 1000;
        } else {
          vOut = 0;
          iCollector = 0;
        }
        break;

      case 'AMP_CLASS_D': {
        const carrierFreq = 25;
        const carrierRad = (2 * Math.PI * (t % (periodMs / carrierFreq))) / (periodMs / carrierFreq);
        const triangleWave = (Math.asin(Math.sin(carrierRad)) / (Math.PI / 2)) * (vinPeak * 1.1);

        pwmVal = vIn > triangleWave ? vcc : 0;
        vOut = Math.min(vcc - 0.3, Math.max(-(vcc - 0.3), gain * vIn));
        iCollector = (pwmVal / params.rLoad) * 1000;
        break;
      }
    }

    points.push({
      time: Math.round(t),
      vIn: Number(vIn.toFixed(3)),
      vOut: Number(vOut.toFixed(3)),
      pwmVal: Number(pwmVal.toFixed(3)),
      iCollector: Number(Math.max(0, iCollector).toFixed(1)),
    });
  }

  return points;
}

export const generateAmplifierWaveform = (
  ampType: NodeType,
  numPoints: number = 200,
  freqHz: number = 2,
  gain: number = 1.8,
  timeOffset: number = 0
): WaveformPoint[] => {
  const spec = AMPLIFIER_LAB_SPECS[ampType] || AMPLIFIER_LAB_SPECS['AMP_CLASS_A'];
  const testParams: PracticalAmpParams = {
    ...spec.defaultParams,
    freqHz,
    gain,
  };
  return generatePracticalWaveformPoints(testParams, numPoints, timeOffset);
};
