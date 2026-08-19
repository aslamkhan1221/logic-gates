import type { Unit } from '../types/examNotes';

export const ANALOG_ELECTRONICS_UNITS: Unit[] = [
  {
    id: 'ae-unit-1',
    subjectId: 'analog-electronics',
    unitNumber: 'Unit I',
    title: 'Power Amplifiers',
    subtitle: 'Class A, B, AB, C, Push-Pull, Transformer-Less, Audio ICs & Heat Sink Thermal Design',
    description: 'Master large signal power amplifier fundamentals, operating classes (A, B, AB, C), efficiency derivations, push-pull circuits, crossover distortion elimination, audio ICs (LM386/TDA2030), and heat sink thermal resistance calculations.',
    icon: '⚡',
    colorGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    topicsCount: 11,
    chapters: [
      {
        id: 'ae-chap-1-1',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-1',
        title: '1.1 Power Amplifier: Concept & Performance Parameters',
        subtitle: 'Concept, Voltage vs Power Amps, Load Line, Gain, Bandwidth, Frequency Band, Efficiency & Distortion',
        topics: [
          {
            id: 'topic-ae-1-1-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-1',
            title: 'Power Amplifier Concept & Voltage vs Power Amplifier Comparison',
            description: 'Understanding large signal operation, DC & AC load line analysis, Q-point placement for max output swing, and core differences between voltage and power amplifiers.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Core Concept ⭐',
            conceptSummary: 'A power amplifier converts DC power supplied by the power source into AC signal power delivered to a low-impedance load (like a speaker or antenna). Unlike small-signal voltage amplifiers which handle millivolt signals to maximize voltage gain, power amplifiers handle large signal swings (tens of volts/amperes) to maximize power conversion efficiency (η = Pac / Pdc) while keeping distortion low.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-class-a',
            diagramSteps: [
              { label: 'Large Signal Drive', description: 'Base input signal drives transistor across large portion of AC load line.', subtext: 'Voltage & current swings use max VCC range' },
              { label: 'Q-Point Placement', description: 'Q-point placed in center of AC load line for symmetrical signal swing.', subtext: 'Prevents clipping saturation or cutoff' },
              { label: 'Power Conversion (η)', description: 'Converts DC supply power (Pdc = VCC × ICQ) into AC output power (Pac).', subtext: 'Pac = Vm × Im / 2 = Vpp × Ipp / 8' },
              { label: 'Thermal Dissipation (PD)', description: 'Unconverted power dissipates as heat at collector junction (PD = Pdc - Pac).', subtext: 'Requires heat sink for heat dissipation' },
            ],
            stepByStepExamples: [
              {
                title: 'Calculation of DC Power Input, AC Output Power, and Efficiency',
                initialValue: 'VCC = 20V, ICQ = 0.5A, Load RL = 16Ω, Peak Output Voltage Vm = 8V',
                steps: [
                  { stepNum: 1, calculation: 'Pdc = VCC × ICQ = 20V × 0.5A', note: 'Pdc = 10 Watts' },
                  { stepNum: 2, calculation: 'Pac = Vm² / (2 × RL) = 8² / (2 × 16) = 64 / 32', note: 'Pac = 2 Watts' },
                  { stepNum: 3, calculation: 'Efficiency η = (Pac / Pdc) × 100% = (2 / 10) × 100%', note: 'η = 20%' },
                  { stepNum: 4, calculation: 'Collector Power Dissipated PD = Pdc - Pac = 10 - 2', note: 'PD = 8 Watts lost as heat' },
                ],
                answer: 'Pac = 2W, Pdc = 10W, Efficiency η = 20%, Dissipated Power PD = 8W',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Power Amp vs Voltage Amp Quick Key',
                content: 'Voltage Amp: Small Signal, High Ri, High Voltage Gain, Low Efficiency.\nPower Amp: Large Signal, Low Ro (Impedance Matching), High Power Output, High Collector Current.',
                mnemonics: ['V-Amp = Max Voltage Gain (mV range)', 'P-Amp = Max Power Efficiency (Watts range)'],
              },
            ],
            realLifeExamples: [
              { title: 'Audio Speaker Driver', description: 'Final stage of home theater receivers driving 4Ω/8Ω speaker coils.', icon: '🔊' },
              { title: 'Public Address (PA) System', description: 'Amplifies microphone voice signals to drive stadium loudspeakers.', icon: '📢' },
            ],
            flashcards: [
              { id: 'fc-pa-1', front: 'What is the primary objective of a Power Amplifier?', back: 'To deliver maximum AC power to a low-impedance load with maximum efficiency and minimum distortion.' },
              { id: 'fc-pa-2', front: 'Formula for AC power delivered to load RL using peak voltage Vm?', back: 'Pac = Vm² / (2 × RL) = Vrms² / RL = (Vpp / 2√2)² / RL.' },
            ],
            importantExamPoints: {
              definitions: [
                'Power Amplifier: An amplifier stage designed to deliver maximum AC power to a load (e.g. loudspeaker) with high efficiency.',
                'Collector Efficiency (η): Ratio of AC output power delivered to load to total DC power supplied by power source: η = (Pac / Pdc) × 100%.',
              ],
              formulas: [
                'DC Power Input: Pdc = VCC × ICQ',
                'AC Output Power: Pac = (Vm × Im) / 2 = Vm² / (2 RL)',
                'Power Efficiency: η = (Pac / Pdc) × 100%',
              ],
              theoremsRules: [
                'Rule 1: For maximum power transfer, output impedance of power amplifier must match load impedance (Ro = RL).',
              ],
              expectedQuestions: [
                'Differentiate between Voltage Amplifier and Power Amplifier. [4 Marks]',
                'Explain DC and AC load lines of a power amplifier. Show Q-point location for max swing. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Assuming Voltage Amps and Power Amps have the same efficiency.',
                correct: 'Voltage amps have near 0% power efficiency because they handle micro-power; Power amps optimize η up to 78.5%.',
                explanation: 'Voltage amps prioritize linear voltage gain, whereas power amps prioritize power conversion efficiency and thermal management.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Power amplifiers convert DC supply power into AC load power. Pac = Vm²/2RL, Pdc = VCC·ICQ, η = Pac/Pdc.',
              bulletPoints: [
                'Large signal transistor operation',
                'Impedance matching via transformers or low Ro',
                'Midpoint Q-point yields maximum symmetrical AC swing',
              ],
            },
            practiceProblems: [
              {
                id: 'p-pa-1',
                problem: 'A Class A amplifier operates with VCC = 18V, ICQ = 400mA, and load RL = 20Ω. Calculate Pdc, max Pac, and max efficiency η.',
                solutionSteps: [
                  'Step 1: Calculate Pdc = VCC × ICQ = 18V × 0.4A = 7.2W.',
                  'Step 2: Max peak voltage Vm = VCC / 2 = 9V.',
                  'Step 3: Max Pac = Vm² / (2 × RL) = 9² / (2 × 20) = 81 / 40 = 2.025W.',
                  'Step 4: Efficiency η = (Pac / Pdc) × 100% = (2.025 / 7.2) × 100% = 28.12%.',
                ],
                finalAnswer: 'Pdc = 7.2W, Pac = 2.025W, η = 28.12%',
              },
            ],
            animatedSummary: {
              concept: 'Power amplifiers convert DC input energy into high-power AC acoustic output.',
              rule: 'Pdc = VCC × ICQ, Pac = Vm² / 2RL, η = (Pac/Pdc) × 100%.',
              example: 'A 20V supply providing 1A DC produces up to 5W AC sound power in Class A (25% η).',
              examTip: 'Always draw the AC and DC load lines intersecting at Q-point for 6-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-pa-1',
                question: 'What is the primary parameter optimized in a Power Amplifier?',
                options: ['Voltage Gain', 'Power Conversion Efficiency (η)', 'Input Resistance', 'Noise Figure'],
                correctAnswer: 1,
                explanation: 'Power amplifiers focus on converting DC supply energy to AC load power efficiently.',
              },
            ],
          },
          {
            id: 'topic-ae-1-1-2',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-1',
            title: 'Performance Parameters: Gain, Bandwidth, Frequency Band, Efficiency and Distortion',
            description: 'In-depth analysis of key performance metrics governing power amplifiers: Power gain, bandwidth range, audio/RF frequency bands, efficiency ratings, and harmonic/crossover distortions.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Key Parameters ⭐',
            conceptSummary: 'Power amplifier performance is evaluated across five critical metrics: 1) Power Gain (Ap in dB), 2) Bandwidth (BW = fH - fL), 3) Frequency Band (Audio 20Hz-20kHz vs RF 30kHz-300MHz), 4) Collector Power Efficiency (η), and 5) Distortions (Harmonic Distortion THD, Amplitude, Frequency, Phase, and Crossover distortion).',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-class-a',
            diagramSteps: [
              { label: 'Power Gain (Ap)', description: 'Ap = Pout / Pin. Expressed in decibels: Ap(dB) = 10 log10 (Pout / Pin).', subtext: 'Ratio of AC power delivered to input drive power' },
              { label: 'Bandwidth (BW)', description: 'BW = fH - fL between -3dB (half-power) cutoff frequency points.', subtext: 'Ensures flat frequency response across audio band' },
              { label: 'Harmonic Distortion (THD)', description: 'Non-linearities produce unwanted harmonic frequencies (2f, 3f, 4f).', subtext: 'THD = √(V2² + V3² + ...) / V1 × 100%' },
              { label: 'Crossover Distortion', description: 'Occurs in Class B push-pull amplifiers near zero-crossing due to VBE cut-in.', subtext: 'Eliminated by biasing into Class AB mode' },
            ],
            stepByStepExamples: [
              {
                title: 'Total Harmonic Distortion (THD) Calculation',
                initialValue: 'Fundamental V1 = 10V, 2nd Harmonic V2 = 0.6V, 3rd Harmonic V3 = 0.3V',
                steps: [
                  { stepNum: 1, calculation: 'Harmonic sum = √(V2² + V3²) = √(0.6² + 0.3²) = √(0.36 + 0.09)', note: '√(0.45) = 0.6708V' },
                  { stepNum: 2, calculation: 'THD = (0.6708 / 10) × 100%', note: 'THD = 6.71%' },
                ],
                answer: 'Total Harmonic Distortion THD = 6.71%',
              },
            ],
            memoryTricks: [
              {
                title: '💡 5 Core Performance Metrics',
                content: 'G = Gain (Ap in dB)\nB = Bandwidth (BW = fH - fL)\nF = Frequency Band (Audio vs RF)\nE = Efficiency (η = Pac/Pdc)\nD = Distortion (THD %)',
                mnemonics: ['GBFED = Gain, Bandwidth, Frequency, Efficiency, Distortion'],
              },
            ],
            realLifeExamples: [
              { title: 'Hi-Fi Audio Amplifiers', description: 'Demands THD < 0.1% across 20Hz-20kHz audio frequency band.', icon: '🎧' },
              { title: 'RF Transmitter Amplifiers', description: 'Operates in MHz/GHz radio frequency bands with efficiency > 80%.', icon: '📡' },
            ],
            flashcards: [
              { id: 'fc-param-1', front: 'What is Total Harmonic Distortion (THD)?', back: 'The ratio of the RMS voltage of all harmonic frequency components to the fundamental frequency RMS voltage.' },
              { id: 'fc-param-2', front: 'What is the audible audio frequency band range?', back: '20 Hz to 20,000 Hz (20 kHz).' },
            ],
            importantExamPoints: {
              definitions: [
                'Bandwidth (BW): The range of frequencies over which the amplifier power gain remains within 3dB of its maximum value: BW = fH - fL.',
                'Total Harmonic Distortion (THD): Percentage metric of non-linear distortion caused by generation of unwanted harmonics.',
              ],
              formulas: [
                'Power Gain in dB: Ap(dB) = 10 log10 (Pout / Pin)',
                'Bandwidth: BW = fH - fL',
                'THD Formula: THD = [√(V2² + V3² + ...) / V1] × 100%',
              ],
              theoremsRules: [
                'Rule 1: Negative feedback reduces THD by factor of (1 + A·β).',
              ],
              expectedQuestions: [
                'Define Power Gain, Bandwidth, Efficiency, and THD for a power amplifier. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Using 20 log10 for Power Gain in dB.',
                correct: 'Power Gain uses 10 log10 (Pout/Pin), while Voltage Gain uses 20 log10 (Vout/Vin).',
                explanation: 'Power is proportional to square of voltage (P ∝ V²), so 10 log10(V²) = 20 log10(V).',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Ap(dB) = 10 log10(Pout/Pin), BW = fH - fL, THD = √(V2²+V3²...)/V1 × 100%, η = Pac/Pdc.',
              bulletPoints: [
                'Audio Band = 20 Hz to 20 kHz',
                'Negative feedback improves bandwidth & reduces THD',
              ],
            },
            practiceProblems: [
              {
                id: 'p-param-1',
                problem: 'An audio power amp receives 50mW input power and outputs 20W to a speaker. Calculate Power Gain in dB.',
                solutionSteps: [
                  'Step 1: Calculate power ratio = Pout / Pin = 20W / 0.050W = 400.',
                  'Step 2: Ap(dB) = 10 log10 (400) = 10 × 2.602 = 26.02 dB.',
                ],
                finalAnswer: 'Power Gain = 26.02 dB',
              },
            ],
            animatedSummary: {
              concept: 'High-quality power amplifiers maximize power gain and efficiency while minimizing THD.',
              rule: 'Ap(dB) = 10 log10(Pout/Pin), THD% = [√(V2²+V3²+...)/V1] × 100.',
              example: 'A 50mW drive yielding 20W output gives 26 dB power gain.',
              examTip: 'Remember: 10 log for Power, 20 log for Voltage!',
            },
            microQuiz: [
              {
                id: 'q-param-1',
                question: 'What is the correct formula for Power Gain in decibels?',
                options: ['20 log10 (Pout / Pin)', '10 log10 (Pout / Pin)', 'log10 (Pout / Pin)', '10 ln (Pout / Pin)'],
                correctAnswer: 1,
                explanation: 'Power Gain in dB is 10 log10 (Pout / Pin).',
              },
            ],
          },
        ],
      },

      {
        id: 'ae-chap-1-2',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-1',
        title: '1.2 Classification of Power Amplifiers & Applications',
        subtitle: 'Classification of Class A, Class B, Class AB, Class C and their specific engineering applications',
        topics: [
          {
            id: 'topic-ae-1-2-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-2',
            title: 'Classification of Power Amplifiers (Class A, Class B, Class AB, Class C) & Applications',
            description: 'Comprehensive comparison of conduction angles (360°, 180°, 180°-360°, <180°), Q-point placement, efficiency ratings, and detailed industrial applications of each class.',
            estimatedTime: '15 mins',
            difficulty: 'Easy',
            badge: 'Syllabus Core ⭐',
            conceptSummary: 'Power amplifiers are classified into four primary classes based on the fraction of the input AC cycle for which the collector current flows (Conduction Angle θ): Class A (θ = 360°, full cycle), Class B (θ = 180°, half cycle), Class AB (180° < θ < 360°, slightly more than half cycle), and Class C (θ < 180°, short pulses). Each class trades off linearity against power conversion efficiency.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-class-a',
            diagramSteps: [
              { label: 'Class A (θ = 360°)', description: 'Conducts for full 360°. Highest linearity, lowest efficiency (25-50%). Used in audio pre-drivers.', subtext: 'Q-point in middle of load line' },
              { label: 'Class B (θ = 180°)', description: 'Conducts for 180°. Higher efficiency (78.5%), exhibits crossover distortion. Used in push-pull output stages.', subtext: 'Q-point at cutoff' },
              { label: 'Class AB (180° < θ < 360°)', description: 'Conducts for >180°. Eliminates crossover distortion with high efficiency (50-78.5%). Used in Hi-Fi audio amps.', subtext: 'Biased slightly above cutoff' },
              { label: 'Class C (θ < 180°)', description: 'Conducts short current pulses (<120°). Highest efficiency (>85%). Used in RF tuned transmitter amplifiers.', subtext: 'LC tank circuit restores sine wave' },
            ],
            memoryTricks: [
              {
                title: '💡 Conduction Angle & Efficiency Mnemonic',
                content: 'Class A: 360° ➔ 25%-50% Efficiency\nClass B: 180° ➔ 78.5% Efficiency\nClass AB: 180°-360° ➔ 50%-78.5% Efficiency\nClass C: <180° ➔ >85% Efficiency',
                mnemonics: ['A = 360°, B = 180°, AB = 180-360°, C = <180°', 'Efficiency: C > B > AB > A'],
              },
            ],
            realLifeExamples: [
              { title: 'Class A: Audiophile Tube Amps', description: 'Prized for zero crossover distortion in high-end audio preamps.', icon: '📻' },
              { title: 'Class B/AB: Home Theater Amps', description: 'Powers surround-sound speakers with high efficiency and zero distortion.', icon: '🔊' },
              { title: 'Class C: FM Broadcast Towers', description: 'Transmits high-power RF signals at 100MHz with >85% efficiency.', icon: '📡' },
            ],
            flashcards: [
              { id: 'fc-cl-1', front: 'Which amplifier class has a conduction angle of 360 degrees?', back: 'Class A Power Amplifier.' },
              { id: 'fc-cl-2', front: 'Which amplifier class is used in RF transmitter power stages?', back: 'Class C Power Amplifier (due to its >85% efficiency).' },
            ],
            importantExamPoints: {
              definitions: [
                'Conduction Angle (θ): The portion of the 360° input AC signal cycle during which the transistor collector current flows.',
                'Class AB Amplifier: An amplifier biased slightly above cutoff so that collector current flows for more than 180° but less than 360°.',
              ],
              formulas: [
                'Class A Max Efficiency: η = 25% (Series) / 50% (Transformer)',
                'Class B Max Efficiency: η = 78.5%',
                'Class C Efficiency: η > 85%',
              ],
              theoremsRules: [
                'Rule 1: Class C can ONLY be used with tuned LC resonant tanks (never for un-tuned audio!).',
              ],
              expectedQuestions: [
                'Classify power amplifiers based on conduction angle. Give circuit efficiency and application of each. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Recommending Class C for audio power amplification.',
                correct: 'Class C distorts non-linearly and is ONLY suitable for RF tuned carrier signals.',
                explanation: 'Audio frequencies span multiple octaves where fixed LC tuning cannot function.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Class A (360°, 25-50%), Class B (180°, 78.5%), Class AB (180-360°, 50-78.5%), Class C (<180°, >85%).',
              bulletPoints: [
                'Class A: Highest fidelity, lowest efficiency',
                'Class B: Crossover distortion present',
                'Class AB: Eliminates crossover distortion',
                'Class C: Highest efficiency for RF transmitters',
              ],
            },
            practiceProblems: [
              {
                id: 'p-cl-app-1',
                problem: 'Which power amplifier class should be selected for a battery-powered RF transmitter operating at 108MHz? Justify your choice.',
                solutionSteps: [
                  'Step 1: Application requires high frequency (108MHz RF) and battery conservation (high efficiency).',
                  'Step 2: Class C amplifier conducts for <180°, yielding efficiency >85%.',
                  'Step 3: An LC tank tuned to 108MHz eliminates pulse distortion via the flywheel effect.',
                  'Step 4: Conclusion: Select Class C tuned power amplifier.',
                ],
                finalAnswer: 'Class C Tuned Power Amplifier (Efficiency >85%, RF carrier application)',
              },
            ],
            animatedSummary: {
              concept: 'Amplifiers are classified by conduction angle θ to optimize efficiency and linearity for specific applications.',
              rule: 'A=360° (pre-amps), B=180° (push-pull), AB=180-360° (Hi-Fi), C<180° (RF towers).',
              example: 'A battery transmitter uses Class C (>85% η) while an audiophile preamp uses Class A (360°).',
              examTip: 'Draw a clear comparison table for 8-mark classification questions!',
            },
            microQuiz: [
              {
                id: 'q-cl-app-1',
                question: 'Which amplifier class provides a conduction angle between 180° and 360°?',
                options: ['Class A', 'Class B', 'Class AB', 'Class C'],
                correctAnswer: 2,
                explanation: 'Class AB conducts for slightly more than 180° but less than 360°.',
              },
            ],
          },
        ],
      },

      {
        id: 'ae-chap-1-3',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-1',
        title: '1.3 Circuit Diagram, Working, Waveforms & Efficiency of Power Amplifiers',
        subtitle: 'Single stage Class A, Class B, Class AB, Class C, Push Pull, Complementary Symmetry, Transformer-Less & Distortions',
        topics: [
          {
            id: 'topic-ae-1-3-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-3',
            title: 'Single-Stage Class A Power Amplifier (Series-Fed & Transformer-Coupled)',
            description: 'Circuit diagram, working principle, input/output waveforms, Q-point location, and mathematical efficiency derivations for Series-Fed (25% max η) and Transformer-Coupled (50% max η) Class A amplifiers.',
            estimatedTime: '20 mins',
            difficulty: 'Hard',
            badge: 'Core Derivation ⭐',
            conceptSummary: 'In Class A power amplifiers, the transistor is biased at the center of the AC load line so it conducts collector current for the entire 360° of the input AC cycle. Series-fed Class A has a maximum theoretical collector efficiency of 25%, whereas Transformer-Coupled Class A uses a step-down transformer to match load impedance, boosting maximum efficiency to 50%.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-class-a',
            diagramSteps: [
              { label: '360° Conduction Angle', description: 'Transistor remains continuously ON in active region for complete 360° AC cycle.', subtext: 'Q-point located at middle of AC load line' },
              { label: 'Series-Fed Class A Circuit', description: 'Collector connected directly to VCC through RC load resistor.', subtext: 'Pdc = VCC × ICQ (constant even with no signal)' },
              { label: 'Transformer-Coupled Class A', description: 'Primary winding connects collector to VCC; secondary drives speaker RL.', subtext: 'Reflected Load RL\' = (N1/N2)² × RL' },
              { label: 'Efficiency Derivation', description: 'Series-Fed ηmax = 25%. Transformer-Coupled ηmax = 50%.', subtext: 'Eliminates DC power dissipation in load resistor' },
            ],
            stepByStepExamples: [
              {
                title: 'Derivation of Maximum Efficiency for Series-Fed Class A Amplifier',
                initialValue: 'Max symmetrical swing: Vm = VCC / 2, Im = ICQ',
                steps: [
                  { stepNum: 1, calculation: 'DC Power Input: Pdc = VCC × ICQ', note: 'Constant DC power draw' },
                  { stepNum: 2, calculation: 'Max AC Power: Pac(max) = (Vm × Im) / 2 = [(VCC/2) × ICQ] / 2 = (VCC × ICQ) / 4', note: 'Pac = Pdc / 4' },
                  { stepNum: 3, calculation: 'Efficiency ηmax = [Pac(max) / Pdc] × 100% = [(Pdc / 4) / Pdc] × 100%', note: 'ηmax = 1/4 × 100% = 25%' },
                ],
                answer: 'Maximum Theoretical Efficiency of Series-Fed Class A = 25%',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Class A Efficiency Quick Memory',
                content: 'Class A Conduction = 360° (Full Cycle)\nSeries-Fed Class A: ηmax = 25%\nTransformer-Coupled Class A: ηmax = 50%\nQ-Point = Center of Load Line',
                mnemonics: ['Series-Fed = 25%', 'Transformer-Coupled = 50%'],
              },
            ],
            realLifeExamples: [
              { title: 'Audiophile Audio Preamps', description: 'Single-ended Class A tube amplifiers prized for zero crossover distortion.', icon: '📻' },
            ],
            flashcards: [
              { id: 'fc-ca-1', front: 'What is the maximum theoretical efficiency of a Transformer-Coupled Class A amp?', back: '50%.' },
            ],
            importantExamPoints: {
              definitions: [
                'Class A Power Amplifier: An amplifier stage where the output transistor conducts for the complete 360° of the input signal cycle.',
              ],
              formulas: [
                'Series-Fed Efficiency: ηmax = 25%',
                'Transformer-Coupled Efficiency: ηmax = 50%',
              ],
              theoremsRules: [
                'Rule 1: In Class A, maximum transistor heating occurs under NO SIGNAL condition.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of a Transformer-Coupled Class A power amplifier and derive its maximum efficiency (50%). [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Thinking Class A transistor gets hottest when outputting maximum AC volume.',
                correct: 'In Class A, maximum heat is dissipated in the transistor when input signal is ZERO (PD = Pdc).',
                explanation: 'When outputting AC power Pac, heat dissipated drops to PD = Pdc - Pac.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Class A = 360° conduction. Series-fed ηmax = 25%, Transformer-coupled ηmax = 50%. Max heat at zero signal!',
              bulletPoints: [
                'Q-point at center of AC load line',
                'Zero crossover distortion',
              ],
            },
            practiceProblems: [
              {
                id: 'p-ca-1',
                problem: 'A transformer-coupled Class A amp drives an 8Ω speaker via a 5:1 step-down transformer. VCC = 12V, ICQ = 0.5A. Calculate reflected load RL\' and max AC power.',
                solutionSteps: [
                  'Step 1: Primary turns ratio N1/N2 = 5.',
                  'Step 2: Reflected load RL\' = (N1/N2)² × RL = (5)² × 8 = 25 × 8 = 200Ω.',
                  'Step 3: Pdc = VCC × ICQ = 12V × 0.5A = 6W.',
                  'Step 4: Max Pac = 50% of Pdc = 0.5 × 6W = 3W.',
                ],
                finalAnswer: 'RL\' = 200Ω, Max Pac = 3W',
              },
            ],
            animatedSummary: {
              concept: 'Class A conducts for 360°. Transformer coupling doubles max efficiency from 25% to 50%.',
              rule: 'Series-Fed ηmax = 25%, Transformer-Coupled ηmax = 50%.',
              example: 'A 5:1 transformer turns an 8Ω speaker into a 200Ω load for maximum power transfer.',
              examTip: 'Show all steps of the 50% efficiency derivation to score full 8 marks in exams!',
            },
            microQuiz: [
              {
                id: 'q-ca-1',
                question: 'What is the maximum efficiency of a Transformer-Coupled Class A amplifier?',
                options: ['25%', '50%', '78.5%', '85%'],
                correctAnswer: 1,
                explanation: 'Transformer-coupled Class A amplifier achieves a maximum theoretical efficiency of 50%.',
              },
            ],
          },
          {
            id: 'topic-ae-1-3-2',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-3',
            title: 'Class B Power Amplifier & Class B Push-Pull Amplifier',
            description: 'Circuit diagram, phase-splitter action, working principle, input/output waveforms, derivation of 78.5% efficiency, cause and waveform of crossover distortion, and remedy.',
            estimatedTime: '20 mins',
            difficulty: 'Hard',
            badge: 'Exam Favorite ⭐',
            conceptSummary: 'In Class B power amplifiers, transistors are biased at cutoff (ICQ = 0), conducting for exactly 180° (half cycle) of the AC input. A Push-Pull circuit uses two transistors operating in complementary half-cycles (Q1 conducts positive half, Q2 conducts negative half). Maximum efficiency is derived as ηmax = π / 4 = 78.5%. However, base-emitter cut-in voltage (VBE ≈ 0.7V) causes Crossover Distortion around zero-voltage crossings.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-push-pull',
            diagramSteps: [
              { label: '180° Conduction per Transistor', description: 'Transistors biased at cutoff (VBE = 0V, ICQ = 0). Each conducts for 180°.', subtext: 'Zero power consumption at standby!' },
              { label: 'Push-Pull Operation', description: 'Center-tapped transformer or phase splitter drives Q1 (positive half) and Q2 (negative half).', subtext: 'Outputs recombine at load transformer' },
              { label: 'Efficiency Derivation (78.5%)', description: 'Pdc = VCC × (2 Im / π), Pac = Vm Im / 2 ⟹ η = (π / 4) × 100% = 78.5%.', subtext: 'Significant power saving over Class A' },
              { label: 'Crossover Distortion', description: 'Flat spot in output waveform when Vin is between -0.7V and +0.7V.', subtext: 'Both transistors remain OFF near zero crossing' },
            ],
            stepByStepExamples: [
              {
                title: 'Derivation of Maximum Theoretical Efficiency (78.5%) for Class B Push-Pull Amplifier',
                initialValue: 'Peak load voltage Vm = VCC, Peak collector current Im',
                steps: [
                  { stepNum: 1, calculation: 'Average DC Current from VCC: Idc = (2 / π) × Im', note: 'Two half-rectified sine pulses per full cycle' },
                  { stepNum: 2, calculation: 'DC Power Input: Pdc = VCC × Idc = VCC × (2 Im / π)', note: 'Pdc = (2 VCC Im) / π' },
                  { stepNum: 3, calculation: 'AC Power Delivered: Pac = (Vm × Im) / 2 = (VCC × Im) / 2', note: 'At max swing Vm = VCC' },
                  { stepNum: 4, calculation: 'Efficiency η = [Pac / Pdc] × 100% = [(VCC Im / 2) / (2 VCC Im / π)] × 100%', note: 'η = (π / 4) × 100% = 78.54%' },
                ],
                answer: 'Maximum Theoretical Efficiency of Class B Push-Pull Amplifier = 78.54%',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Class B & Crossover Distortion Rule',
                content: 'Class B Conduction = 180° (Half Cycle)\nMax Efficiency η = 78.5% (π / 4)\nCrossover Distortion Cause: VBE Cut-in Voltage (~0.7V for Silicon)\nFix: Class AB Diode Biasing!',
                mnemonics: ['Class B = 180° Conduction', 'ηmax = 78.5%'],
              },
            ],
            realLifeExamples: [
              { title: 'Audio Output Power Stages', description: 'Push-pull transistor pairs delivering high power to 4Ω speakers.', icon: '🔊' },
            ],
            flashcards: [
              { id: 'fc-cb-1', front: 'What is the maximum theoretical collector efficiency of Class B?', back: '78.5% (equal to π / 4 × 100%).' },
            ],
            importantExamPoints: {
              definitions: [
                'Class B Power Amplifier: An amplifier where the transistor conducts for exactly 180° (half cycle) of the input AC signal.',
                'Crossover Distortion: Distortion occurring at the zero-crossing of the input signal in Class B push-pull amplifiers due to transistor cut-in voltage VBE.',
              ],
              formulas: [
                'Class B DC Current: Idc = (2 / π) × Im',
                'Max Efficiency: ηmax = (π / 4) × 100% = 78.5%',
              ],
              theoremsRules: [
                'Rule 1: Push-pull configuration cancels even harmonics (2nd, 4th), reducing total distortion.',
              ],
              expectedQuestions: [
                'Draw the circuit of a Class B Push-Pull Amplifier. Derive its maximum efficiency of 78.5%. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Writing Class B efficiency as 50%.',
                correct: 'Class B efficiency is 78.5% (π/4). 50% is for Transformer-Coupled Class A.',
                explanation: 'Class B consumes power only during signal conduction, greatly boosting efficiency.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Class B: 180° conduction, ηmax = 78.5%. Push-pull cancels even harmonics. Cut-in VBE causing crossover distortion fixed in Class AB.',
              bulletPoints: [
                'Q-point at cutoff (ICQ = 0)',
                'Flat spots near zero crossing = Crossover distortion',
              ],
            },
            practiceProblems: [
              {
                id: 'p-cb-1',
                problem: 'A Class B push-pull amplifier operates with VCC = 24V and load RL = 8Ω. Calculate Pdc, Pac, and max power dissipated per transistor.',
                solutionSteps: [
                  'Step 1: Peak current Im = VCC / RL = 24V / 8Ω = 3A.',
                  'Step 2: Pac = (VCC × Im) / 2 = (24 × 3) / 2 = 36W.',
                  'Step 3: Pdc = (2 × VCC × Im) / π = (2 × 24 × 3) / 3.1416 = 144 / 3.1416 = 45.83W.',
                  'Step 4: Efficiency η = (36 / 45.83) × 100% = 78.55%.',
                  'Step 5: Max PD per transistor = VCC² / (π² RL) = 24² / (9.8696 × 8) = 576 / 78.95 = 7.29W.',
                ],
                finalAnswer: 'Pac = 36W, Pdc = 45.83W, η = 78.55%, Max PD per transistor = 7.29W',
              },
            ],
            animatedSummary: {
              concept: 'Class B push-pull amplifiers double efficiency to 78.5% by splitting positive and negative half cycles.',
              rule: 'η = π / 4 = 78.5%, Crossover distortion fixed by Class AB diode biasing.',
              example: 'A 24V supply driving 8Ω load delivers 36W output with 78.5% efficiency.',
              examTip: 'Always draw the crossover distortion "flat spot" waveform in 6-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-cb-1',
                question: 'What is the maximum theoretical efficiency of a Class B power amplifier?',
                options: ['25%', '50%', '78.5%', '90%'],
                correctAnswer: 2,
                explanation: 'Class B power amplifier efficiency maximum is π/4 = 78.5%.',
              },
            ],
          },
          {
            id: 'topic-ae-1-3-3',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-3',
            title: 'Class AB Power Amplifier & Complementary Symmetry Push-Pull Amplifier',
            description: 'Circuit diagram, operation of complementary NPN/PNP pair without transformers, diode trickle biasing to eliminate crossover distortion, and input/output waveforms.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Practical Circuit ⭐',
            conceptSummary: 'Class AB power amplifiers bias transistors slightly above cutoff (180° < θ < 360°) using series diodes (D1, D2) to maintain a small standby bias current. This completely eliminates Crossover Distortion while retaining high efficiency (50% - 78.5%). Complementary Symmetry uses paired NPN (TIP31C) and PNP (TIP32C) transistors, eliminating bulky center-tapped transformers.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-push-pull',
            diagramSteps: [
              { label: 'Conduction Angle (180° < θ < 360°)', description: 'Transistors conduct slightly more than half cycle to eliminate turn-on delay.', subtext: 'Small quiescent trickle current IQ prevents dead zone' },
              { label: 'Complementary Symmetry Pair', description: 'NPN transistor (Q1) handles positive half; PNP transistor (Q2) handles negative half.', subtext: 'No center-tapped transformers required!' },
              { label: 'Diode Trickle Biasing (D1, D2)', description: 'Two series diodes provide 2 × 0.7V = 1.4V bias across bases of Q1 and Q2.', subtext: 'Cancels 2 × VBE cut-in voltages exactly' },
              { label: 'Transformer-Less Output', description: 'Load driven via output capacitor CO (single supply) or dual split supply (±VCC).', subtext: 'Wide frequency bandwidth & compact size' },
            ],
            memoryTricks: [
              {
                title: '💡 Class AB & Complementary Symmetry Benefits',
                content: 'Class AB = Class A (No Crossover Distortion) + Class B (High Efficiency 78.5%)\nComplementary Pair = NPN + PNP matched transistors\nDiodes D1 & D2 = Eliminates 0.7V Cut-in dead zone!',
                mnemonics: ['Class AB = Best of both worlds', 'Diodes = Crossover Killer'],
              },
            ],
            realLifeExamples: [
              { title: 'Hi-Fi Audio Amplifier Output ICs', description: 'TDA2030 and TDA7294 audio power ICs utilize Class AB complementary symmetry stages.', icon: '📻' },
            ],
            flashcards: [
              { id: 'fc-cab-1', front: 'Why are diodes D1 and D2 used in Class AB push-pull amplifiers?', back: 'To provide small forward bias voltage (~1.4V total) to keep both transistors slightly ON, eliminating crossover distortion.' },
            ],
            importantExamPoints: {
              definitions: [
                'Class AB Power Amplifier: An amplifier where transistors conduct for slightly more than 180° but less than 360° of the input AC cycle.',
              ],
              formulas: [
                'Diode Bias Voltage: Vbias = VD1 + VD2 ≈ 1.4V',
              ],
              theoremsRules: [
                'Rule 1: Thermal tracking diodes placed on same heat sink as power transistors prevent thermal runaway.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of a Complementary Symmetry Class AB Push-Pull Amplifier. Explain how crossover distortion is eliminated. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Assuming Class AB requires center-tapped transformers.',
                correct: 'Complementary symmetry Class AB uses matched NPN/PNP pairs and is completely transformer-less!',
                explanation: 'NPN responds to positive input, PNP responds to negative input, removing the need for phase-inverting transformers.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Class AB: 180°<θ<360°, η=50%-78.5%. Diodes D1/D2 eliminate crossover distortion.',
              bulletPoints: [
                'Biased slightly above cutoff',
                'Combines Class A low distortion with Class B efficiency',
              ],
            },
            practiceProblems: [
              {
                id: 'p-cab-1',
                problem: 'Explain the working of diode compensation in Class AB amplifier for a 4-mark exam question.',
                solutionSteps: [
                  'Step 1: In Class B, both transistors turn off for |Vin| < 0.7V, causing crossover distortion.',
                  'Step 2: Diodes D1 and D2 are placed between bases of Q1 (NPN) and Q2 (PNP).',
                  'Step 3: Forward voltage across D1 + D2 = 0.7V + 0.7V = 1.4V.',
                  'Step 4: This holds VBE1 = 0.7V and VBE2 = -0.7V, keeping Q1 and Q2 slightly ON at zero signal, eliminating dead zone.',
                ],
                finalAnswer: 'Diode voltage 1.4V maintains small bias current IQ, eliminating dead zone.',
              },
            ],
            animatedSummary: {
              concept: 'Class AB eliminates crossover distortion by pre-biasing NPN and PNP transistors with series diodes.',
              rule: 'Diodes D1+D2 hold VBE at 0.7V. Efficiency remains high (up to 78.5%).',
              example: 'TIP31C (NPN) and TIP32C (PNP) driven by D1/D2 produce clean 50W audio output.',
              examTip: 'Always highlight that D1 & D2 must thermally track the transistors to avoid thermal runaway!',
            },
            microQuiz: [
              {
                id: 'q-cab-1',
                question: 'Which component is added in Class AB push-pull amplifiers to eliminate crossover distortion?',
                options: ['Zener Diodes', 'Biasing Diodes (D1, D2)', 'Inductive Chokes', 'Coupling Capacitors'],
                correctAnswer: 1,
                explanation: 'Two series diodes provide ~1.4V to pre-bias the transistor bases above cut-in voltage.',
              },
            ],
          },
          {
            id: 'topic-ae-1-3-4',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-3',
            title: 'Transformer-Less Push-Pull Amplifier',
            description: 'Circuit diagram, working principle, single supply vs split supply configurations, output capacitor coupling (CO), and advantages over transformer-coupled stages.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Circuit Topology ⭐',
            conceptSummary: 'A Transformer-Less Push-Pull Amplifier drives the speaker load directly without heavy, expensive center-tapped transformers. It uses complementary matched NPN (e.g. TIP31C) and PNP (e.g. TIP32C) transistors. In single supply mode ($V_{CC}$ and Ground), a large electrolytic output coupling capacitor $C_O$ (1000μF) charges to $V_{CC}/2$ and acts as a virtual DC supply for the negative half cycle. In dual split supply mode ($\pm V_{CC}$), the speaker is connected directly between the output node and ground with zero DC offset.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-transformerless',
            diagramSteps: [
              { label: 'Complementary Matched Transistors', description: 'NPN Q1 pulls output to +VCC during positive half; PNP Q2 pulls output to -VEE during negative half.', subtext: 'Eliminates phase-splitter transformers' },
              { label: 'Single Supply with Coupling Cap CO', description: 'Capacitor CO charges to VCC/2. Supplies load current when PNP Q2 conducts.', subtext: 'Blocks DC current from entering speaker coil' },
              { label: 'Dual Split Power Supply (±VCC)', description: 'Direct DC coupling to speaker load RL without any output capacitor.', subtext: 'Flat frequency response down to 0Hz DC!' },
              { label: 'Advantages Over Transformers', description: 'Smaller size, lighter weight, wider frequency response (no transformer core saturation), lower cost.', subtext: 'Standard architecture in modern audio ICs' },
            ],
            memoryTricks: [
              {
                title: '💡 Transformer-Less Push-Pull Key Points',
                content: 'No Heavy Transformers = Better Low-Frequency Bass Response\nSingle Supply: Needs Output Capacitor CO (charged to VCC/2)\nDual Supply (±VCC): Direct Speaker Connection (Zero DC offset)',
                mnemonics: ['Transformer-Less = Compact, Wide Bandwidth, Cheap', 'CO = Virtual DC Supply for Negative Half'],
              },
            ],
            realLifeExamples: [
              { title: 'Hi-Fi Stereo Receivers', description: 'Uses dual split supply ±35V transformer-less output stages driving 8Ω speakers.', icon: '📻' },
            ],
            flashcards: [
              { id: 'fc-tl-1', front: 'What is the function of the output capacitor CO in a single-supply transformer-less push-pull amplifier?', back: 'It blocks DC voltage (VCC/2) from the speaker coil and acts as a DC supply during the negative half-cycle.' },
            ],
            importantExamPoints: {
              definitions: [
                'Transformer-Less Push-Pull Amplifier: A push-pull output stage utilizing complementary symmetry transistors to drive a load directly without coupling transformers.',
              ],
              formulas: [
                'Output Node Standby Voltage (Single Supply): Vout(DC) = VCC / 2',
                'Capacitor CO Voltage: VCO = VCC / 2',
              ],
              theoremsRules: [
                'Rule 1: Transformer-less design eliminates core saturation frequency limits at low audio frequencies.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of a Transformer-Less Push-Pull Power Amplifier. Explain its working for single and dual supply modes. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Forgetting the output coupling capacitor CO when drawing single-supply transformer-less circuits.',
                correct: 'Without CO, DC voltage (VCC/2) will flow through the speaker coil and burn it out!',
                explanation: 'CO is required to block DC bias from the load.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Transformer-less push-pull uses NPN/PNP pair with single supply (CO) or dual supply (±VCC). Eliminates transformer distortion & weight.',
              bulletPoints: [
                'Single supply: CO holds VCC/2 DC voltage',
                'Dual supply ±VCC: Direct speaker drive',
                'Wide frequency response',
              ],
            },
            practiceProblems: [
              {
                id: 'p-tl-1',
                problem: 'A single-supply transformer-less push-pull amplifier operates with VCC = 30V and RL = 8Ω. What is the DC voltage across the output coupling capacitor CO?',
                solutionSteps: [
                  'Step 1: Output node DC voltage at midpoint = VCC / 2.',
                  'Step 2: VCO = 30V / 2 = 15V.',
                ],
                finalAnswer: 'DC Voltage across CO = 15V',
              },
            ],
            animatedSummary: {
              concept: 'Transformer-less push-pull circuits replace bulky transformers with complementary transistors and coupling capacitors.',
              rule: 'Single supply: CO = VCC/2. Dual supply: ±VCC direct drive.',
              example: 'A 30V supply charges CO to 15V to power the negative half cycle through PNP transistor Q2.',
              examTip: 'Label CO voltage as VCC/2 on single-supply diagrams for full marks!',
            },
            microQuiz: [
              {
                id: 'q-tl-1',
                question: 'What is the DC voltage at the output node of a single-supply transformer-less push-pull amplifier at standby?',
                options: ['0 V', 'VCC / 2', 'VCC', '-VCC'],
                correctAnswer: 1,
                explanation: 'At standby, equal conduction of Q1 and Q2 sets the output node voltage to VCC / 2.',
              },
            ],
          },
          {
            id: 'topic-ae-1-3-5',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-3',
            title: 'Class C Tuned Power Amplifier',
            description: 'Circuit diagram of Class C tuned RF amplifier, narrow pulse conduction (<180°), LC tank resonance, ultra-high efficiency (>80-90%), and RF transmitter applications.',
            estimatedTime: '15 mins',
            difficulty: 'Hard',
            badge: 'RF Application ⭐',
            conceptSummary: 'Class C power amplifiers bias the transistor deep in the cutoff region so it conducts for less than 180° (typically 120° to 150° pulses). A parallel LC tuned tank circuit in the collector acts as a resonant filter (fr = 1 / [2π√(LC)]), converting short current pulses into a pure sinusoidal RF output wave. Efficiency is extremely high (>80% to 90%), making it ideal for RF transmitter power stages.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-class-c',
            diagramSteps: [
              { label: 'Conduction Angle (<180°)', description: 'Transistor biased reverse-biased (-VBB). Conducts short current pulses (<120°).', subtext: 'Transistor OFF for most of the AC cycle' },
              { label: 'Parallel LC Tank Resonator', description: 'Collector load is parallel LC circuit tuned to fundamental frequency fr = 1 / (2π√LC).', subtext: 'Flywheel effect reconstructs pure sine wave' },
              { label: 'Ultra-High Efficiency (>80-90%)', description: 'Minimal overlap between transistor current and collector voltage reduces PD to near zero.', subtext: 'Highest efficiency of all amplifier classes!' },
            ],
            stepByStepExamples: [
              {
                title: 'Calculation of Resonant Frequency for Class C LC Tank Load',
                initialValue: 'Inductance L = 10 μH, Tuning Capacitance C = 100 pF',
                steps: [
                  { stepNum: 1, calculation: 'Formula: fr = 1 / [2π √(L × C)]', note: 'L = 10 × 10⁻⁶ H, C = 100 × 10⁻¹² F' },
                  { stepNum: 2, calculation: 'L × C = (10 × 10⁻⁶) × (100 × 10⁻¹²) = 10⁻15 s²', note: '√(L × C) = √(10⁻¹⁵) = 3.162 × 10⁻8' },
                  { stepNum: 3, calculation: 'fr = 1 / [2 × 3.1416 × 3.162 × 10⁻8] = 1 / (1.9869 × 10⁻7)', note: 'fr = 5.033 × 10⁶ Hz = 5.033 MHz' },
                ],
                answer: 'Resonant Frequency fr = 5.033 MHz (RF Carrier Frequency)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Class C Summary',
                content: 'Conduction = <180° (Short Pulses)\nResonant LC Tank = Flywheel Effect\nEfficiency = >85%\nApplication = RF Transmitter Power Amps',
                mnemonics: ['Class C = Ultra Efficiency (>85%) for RF Transmitters'],
              },
            ],
            realLifeExamples: [
              { title: 'FM/AM Radio Broadcast Transmitters', description: 'Delivers kilowatts of RF power to broadcast towers using Class C tuned stages.', icon: '📻' },
            ],
            flashcards: [
              { id: 'fc-cc-1', front: 'What is the conduction angle of a Class C power amplifier?', back: 'Less than 180 degrees (typically 120 to 150 degrees).' },
            ],
            importantExamPoints: {
              definitions: [
                'Class C Power Amplifier: An amplifier where the collector current flows for less than 180° of the input AC cycle.',
              ],
              formulas: [
                'Resonant Frequency: fr = 1 / (2π √(LC))',
              ],
              theoremsRules: [
                'Rule 1: Class C is strictly used for constant-amplitude RF tuned amplifiers (not audio!).',
              ],
              expectedQuestions: [
                'Explain Class C tuned power amplifier with circuit diagram and waveforms. Why is its efficiency so high? [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Writing that Class C is used in audio power amplifiers.',
                correct: 'Class C creates severe non-linear pulse distortion and CANNOT be used for audio. It is ONLY used in RF tuned circuits.',
                explanation: 'Audio covers multiple octaves (20Hz-20kHz) where fixed LC tuning cannot resonate.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Class C: θ<180°, η>80-90%. Tuned LC load at collector (fr = 1/[2π√LC]) converts pulses to clean RF sine waves.',
              bulletPoints: [
                'Biased deep in cutoff (-VBB)',
                'Flywheel effect of LC tank restores full sine wave',
              ],
            },
            practiceProblems: [
              {
                id: 'p-cc-1',
                problem: 'Calculate the inductance L required for a Class C tuned amplifier to operate at fr = 10 MHz with C = 47 pF.',
                solutionSteps: [
                  'Step 1: Formula fr = 1 / (2π √(LC)) ⟹ fr² = 1 / (4 π² L C).',
                  'Step 2: Rearrange for L: L = 1 / (4 π² fr² C).',
                  'Step 3: L = 1 / (4 × 3.1416² × (10 × 10⁶)² × (47 × 10⁻¹²)).',
                  'Step 4: L = 1 / (39.4784 × 10¹⁴ × 47 × 10⁻¹²) = 1 / (1.855 × 105) = 5.39 × 10⁻⁶ H = 5.39 μH.',
                ],
                finalAnswer: 'Inductance L = 5.39 μH',
              },
            ],
            animatedSummary: {
              concept: 'Class C achieves >80-90% efficiency by pulsing current into an LC tank resonant circuit.',
              rule: 'θ < 180°, η > 80-90%, fr = 1 / (2π√LC). Strictly for RF applications.',
              example: 'A 10MHz transmitter uses 5.39μH and 47pF LC tank to generate 100W RF power.',
              examTip: 'Include the summary comparison table (Class A, B, AB, C) for guaranteed full marks in 6-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-cc-1',
                question: 'Which class of power amplifier exhibits the highest collector efficiency (>85%)?',
                options: ['Class A', 'Class B', 'Class AB', 'Class C'],
                correctAnswer: 3,
                explanation: 'Class C power amplifiers achieve efficiency > 80-90% due to narrow pulse conduction.',
              },
            ],
          },
          {
            id: 'topic-ae-1-3-6',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-3',
            title: 'Distortions in Power Amplifiers (Harmonic, Amplitude, Frequency, Phase & Crossover)',
            description: 'In-depth analysis of five major types of signal distortions in power amplifiers: Harmonic distortion (THD), Amplitude non-linearity, Frequency distortion, Phase shift distortion, and Crossover distortion.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Core Theory ⭐',
            conceptSummary: 'Distortion is any unwanted alteration in the output waveform relative to the input signal. In power amplifiers, five primary distortions occur: 1) Harmonic Distortion (THD): Non-linear V-I curves produce integer multiples of fundamental frequency (2f, 3f), 2) Amplitude (Non-linear) Distortion: Non-uniform gain across large signal swings, 3) Frequency Distortion: Unequal amplification across different audio frequencies, 4) Phase Distortion: Unequal time delay/phase shift across frequency spectrum, and 5) Crossover Distortion: Dead zone in Class B push-pull amplifiers.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-class-a',
            diagramSteps: [
              { label: 'Harmonic Distortion (THD)', description: 'THD = [√(V2² + V3² + ...) / V1] × 100%. Generates unwanted higher frequencies.', subtext: 'Reduced by negative feedback' },
              { label: 'Amplitude Distortion', description: 'Occurs when transistor input-output transfer curve is non-linear (clipping at VCC or Ground).', subtext: 'Flattening of positive or negative wave peaks' },
              { label: 'Frequency Distortion', description: 'Occurs when amplifier gain varies with signal frequency (insufficient bandwidth).', subtext: 'Bass or treble attenuation' },
              { label: 'Phase Distortion', description: 'Occurs when phase shift varies non-linearly with frequency, scrambling complex audio waveforms.', subtext: 'Critical in digital communication' },
            ],
            memoryTricks: [
              {
                title: '💡 5 Types of Distortion',
                content: '1. Harmonic (THD - Generates 2f, 3f)\n2. Amplitude (Peak Clipping / Non-linear Gain)\n3. Frequency (Unequal Gain across Frequencies)\n4. Phase (Unequal Phase Shift across Frequencies)\n5. Crossover (Class B 0.7V Cut-in Dead Zone)',
                mnemonics: ['HAFPC = Harmonic, Amplitude, Frequency, Phase, Crossover'],
              },
            ],
            realLifeExamples: [
              { title: 'Audio Amplifier Guitar Overdrive', description: 'Intentional soft-clipping amplitude distortion used in electric guitar distortion pedals.', icon: '🎸' },
            ],
            flashcards: [
              { id: 'fc-dist-1', front: 'What is Harmonic Distortion?', back: 'Distortion caused by non-linearities generating harmonic frequencies (2nd, 3rd, 4th harmonics) of the fundamental input signal.' },
            ],
            importantExamPoints: {
              definitions: [
                'Distortion: Any change in the wave shape of an amplified signal relative to the original input signal.',
                'Frequency Distortion: Distortion occurring when different frequency components of a complex signal are amplified by different gain factors.',
              ],
              formulas: [
                'THD Formula: THD = [√(V2² + V3² + ...) / V1] × 100%',
                'Distortion Reduction via Feedback: D_feedback = D / (1 + A·β)',
              ],
              theoremsRules: [
                'Rule 1: Negative feedback reduces all non-linear distortions by factor of (1 + A·β).',
              ],
              expectedQuestions: [
                'Explain various types of distortions in power amplifiers. How does negative feedback reduce THD? [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Confusing Frequency Distortion with Harmonic Distortion.',
                correct: 'Frequency distortion alters existing frequency amplitudes; Harmonic distortion CREATES NEW harmonic frequencies (2f, 3f).',
                explanation: 'Harmonic distortion introduces new frequencies not present in original signal.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Distortions: Harmonic (new harmonics), Amplitude (clipping), Frequency (unequal gain), Phase (phase delay), Crossover (VBE dead zone).',
              bulletPoints: [
                'THD = √(V2²+V3²...)/V1 × 100%',
                'Negative feedback reduces distortion by (1+Aβ)',
              ],
            },
            practiceProblems: [
              {
                id: 'p-dist-1',
                problem: 'An amplifier has 10% THD without feedback. Calculate THD when negative feedback with β = 0.09 and open-loop gain A = 100 is applied.',
                solutionSteps: [
                  'Step 1: Feedback factor 1 + A·β = 1 + (100 × 0.09) = 1 + 9 = 10.',
                  'Step 2: Distorted with feedback D_fb = D / (1 + A·β) = 10% / 10 = 1.0%.',
                ],
                finalAnswer: 'THD with feedback = 1.0%',
              },
            ],
            animatedSummary: {
              concept: 'Distortions degrade audio fidelity; negative feedback suppresses THD by factor (1+Aβ).',
              rule: 'THD% = [√(V2²+V3²+...)/V1] × 100. D_fb = D / (1+Aβ).',
              example: '10% THD drops to 1% when 20dB negative feedback is applied.',
              examTip: 'List all 5 distortion types clearly for full marks in 6-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-dist-1',
                question: 'By what factor does negative feedback reduce non-linear harmonic distortion in an amplifier?',
                options: ['A', 'β', '1 + A·β', '1 / (A·β)'],
                correctAnswer: 2,
                explanation: 'Negative feedback reduces distortion by the desensitivity factor (1 + A·β).',
              },
            ],
          },
        ],
      },

      {
        id: 'ae-chap-1-4',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-1',
        title: '1.4 Generalised Features of Audio Power Amplifier ICs & Heat Sink Design',
        subtitle: 'Features of LM386/TDA2030, Thermal Resistance (θJC, θCS, θSA) & Heat Sink Sizing',
        topics: [
          {
            id: 'topic-ae-1-4-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-4',
            title: 'Generalised Features of Audio Power Amplifier ICs',
            description: 'Architectural features of monolithic audio power ICs (LM386, TDA2030, LA4440): Internal gain control, thermal shutdown protection, short-circuit protection, low THD, and typical pin application circuits.',
            estimatedTime: '15 mins',
            difficulty: 'Easy',
            badge: 'Practical ICs ⭐',
            conceptSummary: 'Modern audio amplifiers use integrated circuit (IC) power amplifiers such as LM386 (low voltage, 1W output), TDA2030 (14W Hi-Fi), LA4440 (6W dual channel), and TDA7294 (100W DMOS). These ICs integrate driver stages, complementary push-pull output transistors, internal frequency compensation, thermal overload shutdown, and output short-circuit protection into a single silicon chip.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'power-amp-class-a',
            diagramSteps: [
              { label: 'High Power Gain', description: 'Internal voltage gain preset to 20 (26dB) or adjustable up to 200 (46dB) with external capacitor.', subtext: 'Eliminates complex multi-stage discrete design' },
              { label: 'Low Distortion & Wide Bandwidth', description: 'Internal negative feedback keeps THD < 0.1% across 20Hz to 20kHz.', subtext: 'Hi-Fi audio fidelity' },
              { label: 'Thermal Shutdown Protection', description: 'Internal thermal sensor automatically shuts down output stage if TJ exceeds 150°C.', subtext: 'Prevents chip burnout' },
              { label: 'Short-Circuit Protection', description: 'Current limiting circuitry protects IC if speaker terminals are accidentally shorted.', subtext: 'Failsafe operation' },
            ],
            memoryTricks: [
              {
                title: '💡 4 Essential Features of Audio Power ICs',
                content: '1. Internal Thermal Shutdown (Protects at 150°C)\n2. Output Short-Circuit Protection\n3. Adjustable Gain (20 to 200 via external C)\n4. Low THD (<0.1%) & Minimal External Components',
                mnemonics: ['LM386 = 1W Low Voltage Audio IC', 'TDA2030 = 14W Hi-Fi Audio IC'],
              },
            ],
            realLifeExamples: [
              { title: 'Portable Bluetooth Speakers', description: 'LM386 IC powering battery-operated mini audio speakers.', icon: '📻' },
            ],
            flashcards: [
              { id: 'fc-ic-1', front: 'How is the gain of LM386 audio amplifier IC increased from 20 to 200?', back: 'By connecting a 10μF capacitor between Pin 1 and Pin 8.' },
            ],
            importantExamPoints: {
              definitions: [
                'Audio Power Amplifier IC: An integrated circuit designed to deliver high power AC audio signals directly to speakers with built-in protection.',
              ],
              formulas: [
                'LM386 Default Gain: Av = 20 (26 dB)',
                'LM386 Max Gain (with 10μF across Pin 1-8): Av = 200 (46 dB)',
              ],
              theoremsRules: [
                'Rule 1: Always connect a 0.1μF decoupling capacitor close to IC power supply pins to prevent high-frequency oscillations.',
              ],
              expectedQuestions: [
                'State generalized features of Audio Power Amplifier ICs. Draw application circuit of LM386 IC. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Forgetting to include supply decoupling capacitors in audio IC schematics.',
                correct: 'Power ICs oscillate at high frequencies without supply bypass capacitors (0.1μF + 100μF).',
                explanation: 'Long power leads present inductance that causes self-oscillation without local decoupling.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Audio ICs (LM386/TDA2030) feature internal thermal shutdown, short-circuit protection, low THD, and gain control.',
              bulletPoints: [
                'LM386: 1W output, Pin 1-8 gain control (20-200)',
                'TDA2030: 14W Hi-Fi amplifier with thermal protection',
              ],
            },
            practiceProblems: [
              {
                id: 'p-ic-1',
                problem: 'List four major features of IC LM386 audio amplifier for a 4-mark question.',
                solutionSteps: [
                  '1. Operates on wide battery voltage range (4V to 12V).',
                  '2. Low standby current drain (~4mA).',
                  '3. Voltage gain internally set to 20, expandable to 200 with external resistor/capacitor.',
                  '4. Built-in output short-circuit and thermal protection.',
                ],
                finalAnswer: 'Wide VCC (4-12V), Low standby current, Gain 20-200, Built-in thermal protection.',
              },
            ],
            animatedSummary: {
              concept: 'Audio power ICs simplify amplifier design by integrating power transistors and protection circuits on one chip.',
              rule: 'Gain set to 20 by default; pin 1-8 capacitor increases gain to 200. Built-in thermal shutdown at 150°C.',
              example: 'LM386 powers portable speakers with 1W output from a 9V battery.',
              examTip: 'Draw the 8-pin LM386 circuit showing Pin 1-8 capacitor for 6-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-ic-1',
                question: 'Which pin pair on IC LM386 is used to control voltage gain between 20 and 200?',
                options: ['Pin 2 and Pin 3', 'Pin 1 and Pin 8', 'Pin 4 and Pin 7', 'Pin 5 and Pin 6'],
                correctAnswer: 1,
                explanation: 'Connecting a capacitor across Pin 1 and Pin 8 boosts LM386 gain to 200.',
              },
            ],
          },
          {
            id: 'topic-ae-1-4-2',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-1',
            chapterId: 'ae-chap-1-4',
            title: 'Heat Sink Design & Thermal Analysis (θJC, θCS, θSA)',
            description: 'Concept of heat dissipation, thermal resistance equivalent circuit, Thermal Ohm’s Law equation: TJ - TA = PD × (θJC + θCS + θSA), and calculation of required heat sink sizing.',
            estimatedTime: '20 mins',
            difficulty: 'Hard',
            badge: 'Thermal Design ⭐',
            conceptSummary: 'When power transistors dissipate electric power (PD = Pdc - Pac), heat is generated at the silicon collector junction. If junction temperature TJ exceeds TJ,max (typically 150°C), the transistor suffers thermal runaway and permanent destruction. Heat sinks increase surface area for thermal conduction/convection. Thermal flow is modeled using Thermal Ohm’s Law: TJ - TA = PD × (θJC + θCS + θSA), where θ represents thermal resistance in °C/W.',
            conceptAnimationType: 'power-amp',
            analogDiagramType: 'heat-sink-thermal',
            diagramSteps: [
              { label: 'Thermal Resistance Analogy', description: 'Temperature difference (TJ - TA) = Voltage, Power Dissipated (PD) = Current, Thermal Resistance (θ) = Electrical Resistance.', subtext: 'Ohm’s Law: ΔT = PD × Total θ' },
              { label: 'Junction-to-Case (θJC)', description: 'Thermal resistance between silicon chip junction (J) and metal package case (C).', subtext: 'Fixed by manufacturer datasheet' },
              { label: 'Case-to-Heat Sink (θCS)', description: 'Thermal resistance between transistor case (C) and heat sink (S).', subtext: 'Reduced by mica washer & thermal grease' },
              { label: 'Heat Sink-to-Ambient (θSA)', description: 'Thermal resistance between finned aluminum heat sink (S) and room air (A).', subtext: 'Determines physical heat sink size!' },
            ],
            stepByStepExamples: [
              {
                title: 'Calculation of Maximum Required Heat Sink Thermal Resistance (θSA)',
                initialValue: 'PD = 15W, TJ,max = 150°C, TA = 30°C, θJC = 1.5°C/W, θCS = 0.5°C/W',
                steps: [
                  { stepNum: 1, calculation: 'Total allowable thermal resistance θtotal = (TJ,max - TA) / PD', note: 'θtotal = (150 - 30) / 15 = 120 / 15 = 8 °C/W' },
                  { stepNum: 2, calculation: 'Formula: θtotal = θJC + θCS + θSA', note: '8 = 1.5 + 0.5 + θSA' },
                  { stepNum: 3, calculation: 'θSA = θtotal - (θJC + θCS) = 8 - 2.0', note: 'θSA = 6.0 °C/W' },
                ],
                answer: 'Maximum Heat Sink Thermal Resistance θSA = 6.0 °C/W (Select heat sink with θSA ≤ 6.0 °C/W)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Thermal Ohm’s Law Formula',
                content: 'TJ - TA = PD × (θJC + θCS + θSA)\nTJ = Junction Temp (°C)\nTA = Ambient Temp (°C)\nPD = Dissipated Power (Watts)\nθJC = Junction to Case (°C/W)\nθCS = Case to Heat Sink (°C/W)\nθSA = Heat Sink to Ambient (°C/W)',
                mnemonics: ['ΔT = PD × Total θ', 'Lower θSA = Larger Heat Sink!'],
              },
            ],
            realLifeExamples: [
              { title: 'Power Transistors (TO-220 Package)', description: 'Bolted to finned aluminum heat sinks with mica insulator and thermal paste in audio amplifiers.', icon: '📦' },
            ],
            flashcards: [
              { id: 'fc-hs-1', front: 'State Thermal Ohm’s Law equation for heat sink calculations.', back: 'TJ - TA = PD × (θJC + θCS + θSA).' },
            ],
            importantExamPoints: {
              definitions: [
                'Thermal Resistance (θ): The opposition to heat flow between two surfaces, expressed in °C/Watt.',
                'Thermal Runaway: Destructive self-reinforcing process where increased temperature increases collector current, further raising temperature until destruction.',
              ],
              formulas: [
                'Thermal Equation: TJ - TA = PD × (θJC + θCS + θSA)',
                'Max Heat Sink Resistance: θSA = [(TJ,max - TA) / PD] - (θJC + θCS)',
              ],
              theoremsRules: [
                'Rule 1: Always use a heat sink with θSA LESS than or EQUAL to the calculated maximum value.',
              ],
              expectedQuestions: [
                'State Thermal Ohm’s Law. A power transistor dissipates 20W. TJ,max = 160°C, TA = 40°C, θJC = 1.2°C/W, θCS = 0.8°C/W. Calculate required θSA. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Choosing a heat sink with higher θSA value thinking it provides better cooling.',
                correct: 'LOWER θSA means LOWER thermal resistance and BETTER cooling!',
                explanation: 'A smaller θSA value allows heat to flow out more easily to the atmosphere.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'TJ - TA = PD × (θJC + θCS + θSA). Heat sinks prevent thermal runaway. Lower θSA = Better cooling performance.',
              bulletPoints: [
                'TJ: Junction Temp, TA: Ambient Temp, PD: Power Dissipated',
                'θJC (Junction-Case), θCS (Case-Sink), θSA (Sink-Ambient)',
              ],
            },
            practiceProblems: [
              {
                id: 'p-hs-1',
                problem: 'A BJT power amplifier dissipates 25W. Given TJ,max = 175°C, ambient room temp TA = 25°C, θJC = 1.0°C/W, and θCS = 0.6°C/W. Find the maximum allowable θSA.',
                solutionSteps: [
                  'Step 1: Temp difference ΔT = TJ,max - TA = 175 - 25 = 150°C.',
                  'Step 2: Total allowable thermal resistance θtotal = ΔT / PD = 150°C / 25W = 6.0°C/W.',
                  'Step 3: θSA = θtotal - (θJC + θCS) = 6.0 - (1.0 + 0.6) = 6.0 - 1.6 = 4.4°C/W.',
                ],
                finalAnswer: 'Maximum Allowable Heat Sink Thermal Resistance θSA = 4.4 °C/W',
              },
            ],
            animatedSummary: {
              concept: 'Heat sinks prevent thermal runaway by lowering total thermal resistance between junction and air.',
              rule: 'TJ - TA = PD × (θJC + θCS + θSA). Always select θSA ≤ calculated limit.',
              example: 'For 25W dissipation, a heat sink with θSA = 4.4°C/W keeps junction temp safely below 175°C.',
              examTip: 'Draw the thermal equivalent circuit (resistors in series) for 8-mark numerical problems!',
            },
            microQuiz: [
              {
                id: 'q-hs-1',
                question: 'In thermal analysis, what is the unit of Thermal Resistance (θ)?',
                options: ['Watts / °C', '°C / Watt', 'Joules / °C', 'Volts / Watt'],
                correctAnswer: 1,
                explanation: 'Thermal resistance is expressed in °C per Watt (°C/W).',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'ae-unit-2',
    subjectId: 'analog-electronics',
    unitId: 'ae-unit-2',
    title: 'Op-Amp and its Applications',
    subtitle: 'IC-741 Architecture, Parameters, Closed-Loop Amps, Math Applications, Converters & Comparators',
    description: 'Master Operational Amplifiers (Op-Amps), internal block diagram, IC-741 pinout, electrical parameters (CMRR, Slew Rate, Offsets), Inverting/Non-Inverting amps, Adders, Subtractors, Integrators, Differentiators, Sample & Hold circuits, I-V/V-I converters, Zero Crossing Detectors, Schmitt Triggers, Window Detectors, and Peak Detectors.',
    icon: '⚙️',
    colorGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    topicsCount: 18,
    chapters: [
      {
        id: 'ae-chap-2-1',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-2',
        title: '2.1 Op-Amp: Block Diagram, Symbol, Characteristics, Open/Closed Loop, Virtual Ground & IC-741 Pinout',
        subtitle: 'Architecture, Symbol, Ideal vs Practical Characteristics, Open/Closed Loop, Virtual Ground & Pin Configuration',
        topics: [
          {
            id: 'topic-ae-2-1-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-1',
            title: 'Op-Amp Architecture, Block Diagram & Symbol',
            description: 'Understanding the four internal stages of an operational amplifier (Input Diff Amp, Intermediate Gain Stage, Level Translator, Push-Pull Output) and schematic symbol.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Core Foundation ⭐',
            conceptSummary: 'An Operational Amplifier (Op-Amp) is a high-gain DC-coupled direct-coupled differential voltage amplifier. Its internal architecture consists of 4 cascade stages: 1) Input Stage (Dual-input balanced-output differential amplifier), 2) Intermediate Stage (Dual-input unbalanced-output gain stage), 3) Level Translator Stage (Emitter follower with constant current source to shift DC level to 0V), and 4) Output Stage (Complementary push-pull power stage).',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Stage 1: Input Differential Amp', description: 'Dual-input balanced-output stage providing high input impedance Rin and high CMRR.', subtext: 'Provides most of op-amp CMRR' },
              { label: 'Stage 2: Intermediate Gain Stage', description: 'Dual-input unbalanced-output stage providing high voltage gain AVD.', subtext: 'Drives overall open-loop voltage gain' },
              { label: 'Stage 3: Level Translator Stage', description: 'Emitter follower circuit with current source shifting quiescent DC voltage to 0V.', subtext: 'Ensures 0V DC output when Vin = 0V' },
              { label: 'Stage 4: Output Push-Pull Stage', description: 'Complementary push-pull driver stage supplying large output current with low Ro.', subtext: 'Low output impedance (~75Ω)' },
            ],
            stepByStepExamples: [
              {
                title: 'Op-Amp 4-Stage Architecture Summary',
                initialValue: 'Stage Functions',
                steps: [
                  { stepNum: 1, calculation: 'Input Stage: Differential Amp (High Rin & CMRR)', note: 'Dual-input balanced-output' },
                  { stepNum: 2, calculation: 'Gain Stage: Unbalanced Diff Amp (High Voltage Gain)', note: 'Drives open loop gain AVD' },
                  { stepNum: 3, calculation: 'Level Translator: Emitter Follower (DC Level Shift to 0V)', note: 'Eliminates DC offset buildup' },
                  { stepNum: 4, calculation: 'Output Stage: Complementary Push-Pull (Low Rout ~75Ω)', note: 'Provides output current drive' },
                ],
                answer: '4 Cascade Stages: Input Diff Amp ➔ Intermediate Gain ➔ Level Translator ➔ Push-Pull Output.',
              },
            ],
            memoryTricks: [
              {
                title: '💡 4 Internal Stages of Op-Amp',
                content: '1. Input Stage = Diff Amp (High Rin & CMRR)\n2. Intermediate Stage = High Voltage Gain\n3. Level Translator = Shifts DC Level to 0V\n4. Output Stage = Push-Pull (Low Rout)',
                mnemonics: ['I-I-L-O = Input, Intermediate, Level Translator, Output'],
              },
            ],
            realLifeExamples: [
              { title: 'Analog Signal Conditioning', description: 'Amplifying weak microvolt sensor signals in biomedical ECG monitors.', icon: '🩺' },
            ],
            flashcards: [
              { id: 'fc-oa-1', front: 'What are the 4 internal stages of an Op-Amp block diagram?', back: '1) Input Differential Amp, 2) Intermediate Gain Stage, 3) Level Translator Stage, 4) Complementary Push-Pull Output Stage.' },
            ],
            importantExamPoints: {
              definitions: [
                'Operational Amplifier (Op-Amp): A direct-coupled high-gain differential voltage amplifier designed to perform mathematical operations using external feedback.',
                'Level Translator: A circuit stage in an op-amp that eliminates unwanted DC offset voltage accumulating from direct-coupled gain stages.',
              ],
              formulas: [
                'Differential Input Voltage: Vd = V1 - V2 = V+ - V-',
              ],
              theoremsRules: [
                'Rule 1: Ideal op-amp draws zero current into both input terminals (I+ = I- = 0).',
              ],
              expectedQuestions: [
                'Draw the internal block diagram of an Op-Amp. Explain the function of each stage. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Confusing the inverting (-) and non-inverting (+) terminal polarities.',
                correct: 'Inverting input (-) produces 180° phase shifted output; Non-inverting input (+) produces in-phase (0°) output.',
                explanation: 'Signal applied to (-) terminal comes out flipped upside down.',
              },
            ],
            quickRevision: {
              keyTakeaway: '4 stages: Input Diff Amp → Gain Stage → Level Translator → Push-Pull Output.',
              bulletPoints: [
                'Diff amp gives high CMRR',
                'Level translator homes DC level to 0V',
              ],
            },
            practiceProblems: [
              {
                id: 'p-oa-1',
                problem: 'Explain why direct-coupled differential gain stages require a Level Translator stage.',
                solutionSteps: [
                  'Step 1: Direct-coupled transistor stages amplify DC bias voltages along with AC signals.',
                  'Step 2: Without level shifting, the output DC voltage would rise close to +VCC.',
                  'Step 3: The level translator shifts the quiescent DC output down to exactly 0V.',
                ],
                finalAnswer: 'Ensures 0V DC output when input Vin = 0V.',
              },
            ],
            animatedSummary: {
              concept: 'Op-Amps amplify differential input signals Vd = V+ - V- with massive open-loop gain AVD.',
              rule: '4 internal stages: Diff Amp → Gain → Level Shift → Push-Pull Output.',
              example: 'A 1mV difference drives the open-loop op-amp straight into +Vsat saturation.',
              examTip: 'Draw the 4 block boxes clearly with labelled signals to score full 8 marks in block diagram questions!',
            },
            microQuiz: [
              {
                id: 'q-oa-1',
                question: 'Which internal stage of an Op-Amp is responsible for shifting the quiescent DC voltage to 0V?',
                options: ['Input Differential Amp', 'Intermediate Gain Stage', 'Level Translator Stage', 'Push-Pull Output Stage'],
                correctAnswer: 2,
                explanation: 'The Level Translator stage adjusts DC level to 0V at the output.',
              },
            ],
          },
          {
            id: 'topic-ae-2-1-2',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-1',
            title: 'Op-Amp Characteristics (Ideal vs Practical Values)',
            description: 'In-depth comparison of ideal op-amp parameters against practical IC-741 values (Gain, Rin, Rout, BW, CMRR, Slew Rate, Offsets).',
            estimatedTime: '15 mins',
            difficulty: 'Easy',
            badge: 'Key Parameters ⭐',
            conceptSummary: 'An ideal op-amp is a theoretical perfect amplifier with infinite open-loop gain (AVD = ∞), infinite input impedance (Rin = ∞), zero output impedance (Rout = 0), infinite bandwidth (BW = ∞), infinite CMRR (CMRR = ∞), infinite slew rate (SR = ∞), and zero offsets (Vio = 0V, Iib = 0A). Practical op-amps like IC-741 approximate these characteristics with finite values (AVD = 2×10⁵, Rin = 2MΩ, Rout = 75Ω, CMRR = 90dB, SR = 0.5V/μs).',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Open Loop Gain (AVD)', description: 'Ideal = ∞. Practical IC-741 = 2 × 10⁵ (106 dB). Drives high closed-loop accuracy.', subtext: 'Extremely high open loop voltage gain' },
              { label: 'Input Impedance (Rin)', description: 'Ideal = ∞. Practical IC-741 = 2 MΩ (FET op-amps achieve 10¹² Ω).', subtext: 'Draws near-zero current from signal sources' },
              { label: 'Output Impedance (Rout)', description: 'Ideal = 0 Ω. Practical IC-741 = 75 Ω.', subtext: 'Low output impedance acts as ideal voltage source' },
              { label: 'CMRR & Slew Rate', description: 'Ideal CMRR=∞, SR=∞. Practical IC-741: CMRR = 90 dB, Slew Rate = 0.5 V/μs.', subtext: 'Limits high frequency full-power voltage swing' },
            ],
            stepByStepExamples: [
              {
                title: 'Ideal vs Practical IC-741 Parameters Comparison Table',
                initialValue: 'Parameter Values Comparison',
                steps: [
                  { stepNum: 1, calculation: 'Open Loop Voltage Gain (AVD): Ideal = ∞, IC-741 = 2 × 10⁵ (106 dB)', note: 'High gain' },
                  { stepNum: 2, calculation: 'Input Impedance (Rin): Ideal = ∞, IC-741 = 2 MΩ', note: 'Near zero loading' },
                  { stepNum: 3, calculation: 'Output Impedance (Rout): Ideal = 0 Ω, IC-741 = 75 Ω', note: 'Low output source Z' },
                  { stepNum: 4, calculation: 'CMRR: Ideal = ∞, IC-741 = 90 dB; Slew Rate: Ideal = ∞, IC-741 = 0.5 V/μs', note: 'BW = 1 MHz' },
                ],
                answer: 'Ideal: AVD=∞, Rin=∞, Rout=0, CMRR=∞, SR=∞. Practical IC-741: AVD=2×10⁵, Rin=2MΩ, Rout=75Ω, CMRR=90dB, SR=0.5V/μs.',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Ideal Op-Amp Memory Rules',
                content: 'Rin = INFINITY (No input current loading!)\nRout = ZERO (Acts as ideal voltage source!)\nGain AVD = INFINITY (Virtual Short V+ = V-!)\nCMRR = INFINITY (Rejects all common noise!)',
                mnemonics: ['Rin=∞, Rout=0, AVD=∞, CMRR=∞, SR=∞'],
              },
            ],
            realLifeExamples: [
              { title: 'Sensor Buffer Stages', description: 'High Rin prevents loading fragile glass pH sensors or piezoelectric crystals.', icon: '🧪' },
            ],
            flashcards: [
              { id: 'fc-oac-1', front: 'What is the ideal input impedance and output impedance of an Op-Amp?', back: 'Ideal Input Impedance Rin = ∞; Ideal Output Impedance Rout = 0 Ω.' },
            ],
            importantExamPoints: {
              definitions: [
                'Ideal Op-Amp: A theoretical amplifier model characterized by infinite gain, infinite input impedance, zero output impedance, infinite bandwidth, and zero noise/offsets.',
              ],
              formulas: [
                'Vout (Open Loop) = AVD × (V+ - V-)',
              ],
              theoremsRules: [
                'Rule 1: Ideal op-amp terminal currents I+ = I- = 0A.',
              ],
              expectedQuestions: [
                'State 6 ideal characteristics of an Op-Amp and compare them with practical IC-741 values. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Writing ideal Rout as infinity.',
                correct: 'Ideal Input Impedance Rin is INFINITY; Ideal Output Impedance Rout is ZERO!',
                explanation: 'Zero output impedance allows the op-amp to drive any load without voltage drop.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Ideal: Rin=∞, Rout=0, AVD=∞, CMRR=∞, SR=∞. Practical IC-741: AVD=2×10⁵, Rin=2MΩ, Rout=75Ω, SR=0.5V/μs.',
              bulletPoints: [
                'Rin=∞ means zero input current',
                'Rout=0 means ideal output source',
              ],
            },
            practiceProblems: [
              {
                id: 'p-oac-1',
                problem: 'List four practical non-idealities of IC-741 op-amp that affect low-frequency measurement circuits.',
                solutionSteps: [
                  '1. Finite input offset voltage Vio (1-6mV).',
                  '2. Input bias current Iib (~80nA).',
                  '3. Finite open-loop voltage gain AVD (2×10⁵ instead of infinity).',
                  '4. Finite Common Mode Rejection Ratio CMRR (~90dB instead of infinity).',
                ],
                finalAnswer: 'Vio, Iib, finite AVD, finite CMRR.',
              },
            ],
            animatedSummary: {
              concept: 'Ideal op-amps simplify circuit analysis (Rin=∞, Rout=0, AVD=∞); practical IC-741 parameters provide realistic bounds.',
              rule: 'Ideal: Rin=∞, Rout=0, AVD=∞. IC-741: Rin=2MΩ, Rout=75Ω, AVD=2×10⁵.',
              example: 'Rin=∞ means zero input current flows into terminals V+ and V-.',
              examTip: 'Always construct a 2-column table (Ideal vs IC-741) for 6-mark characteristics questions!',
            },
            microQuiz: [
              {
                id: 'q-oac-1',
                question: 'What is the ideal output impedance (Rout) of an Operational Amplifier?',
                options: ['0 Ω', '75 Ω', '2 MΩ', 'Infinity (∞)'],
                correctAnswer: 0,
                explanation: 'An ideal op-amp has an output impedance Rout of 0 Ω.',
              },
            ],
          },
          {
            id: 'topic-ae-2-1-3',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-1',
            title: 'Open Loop Amplifier vs Closed Loop Amplifier Configuration',
            description: 'Operation, gain formulas, transfer characteristics, stability, and applications of Open Loop (Comparator mode) vs Closed Loop (Negative feedback amplifier mode).',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Circuit Topology ⭐',
            conceptSummary: '1) Open Loop Configuration: Operates without external feedback. Voltage gain equals massive open-loop gain AVD (2×10⁵). Because gain is huge, any small differential voltage Vd > 0.1mV drives Vout into saturation (±Vsat). Used exclusively in Comparators and Switching circuits. 2) Closed Loop Configuration: Uses negative feedback (connecting Vout back to V- via Rf). Reduces voltage gain to a stable, precise closed-loop gain (ACL = -Rf/Rin or 1+Rf/R1), increases bandwidth, reduces distortion, and stabilizes gain against component variations.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-open-closed-loop',
            diagramSteps: [
              { label: 'Open Loop Configuration', description: 'No feedback path. Vout = AVD × (V+ - V-). Saturates at +Vsat or -Vsat for Vd > 0.1mV.', subtext: 'Non-linear switching mode (Comparators)' },
              { label: 'Negative Feedback Path', description: 'Feedback network (Rf) returns fraction β of output to inverting (-) input terminal.', subtext: 'V- tracks V+ via Virtual Short principle' },
              { label: 'Closed Loop Gain Stability', description: 'ACL = AVD / (1 + AVD β) ≈ 1 / β. Independent of op-amp internal AVD fluctuations!', subtext: 'Linear amplifier mode (Audio/Instrumentation)' },
              { label: 'Bandwidth Expansion', description: 'Negative feedback trades raw gain for wider bandwidth: fH(cl) = fH(ol) × (1 + AVD β).', subtext: 'GBW product remains constant' },
            ],
            memoryTricks: [
              {
                title: '💡 Open Loop vs Closed Loop Quick Rule',
                content: 'Open Loop = NO Feedback ➔ High Gain (200,000) ➔ Output Saturates (±Vsat) ➔ COMPARATOR!\nClosed Loop = NEGATIVE Feedback ➔ Controlled Stable Gain (ACL) ➔ Linear Signal AMPLIFIER!',
                mnemonics: ['Open Loop = Comparator (Switching)', 'Closed Loop = Amplifier (Linear)'],
              },
            ],
            realLifeExamples: [
              { title: 'Open Loop: Voltage Threshold Alarm', description: 'Triggering an indicator LED when battery voltage drops below reference Vref.', icon: '🚨' },
              { title: 'Closed Loop: Audio Preamp', description: 'Amplifying microphone audio with stable gain of 20 without clipping.', icon: '🎙️' },
            ],
            flashcards: [
              { id: 'fc-ol-1', front: 'Why is Open Loop op-amp configuration unsuitable for linear voltage amplification?', back: 'Because the open loop gain AVD is so massive (~200,000) that any input signal greater than a few microvolts drives the output into saturation (±Vsat).' },
            ],
            importantExamPoints: {
              definitions: [
                'Open Loop Configuration: An op-amp circuit operating without external feedback components between output and input terminals.',
                'Closed Loop Configuration: An op-amp circuit operating with a feedback path connecting output to input to control gain and bandwidth.',
              ],
              formulas: [
                'Open Loop Output: Vout = AVD × (V+ - V-)',
                'Closed Loop Gain (General): ACL = AVD / (1 + AVD β) ≈ 1 / β',
              ],
              theoremsRules: [
                'Rule 1: Negative feedback improves linearity, increases bandwidth, and lowers output impedance.',
              ],
              expectedQuestions: [
                'Compare Open Loop and Closed Loop op-amp configurations with circuit diagrams and transfer characteristics. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Assuming positive feedback creates linear closed-loop amplifiers.',
                correct: 'NEGATIVE feedback creates stable linear amplifiers! POSITIVE feedback creates bistable Schmitt triggers or oscillators!',
                explanation: 'Negative feedback subtracts error signal to stabilize the circuit.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Open Loop: No feedback, gain=AVD, outputs ±Vsat (Comparator). Closed Loop: Negative feedback, gain=1/β, linear amplifier.',
              bulletPoints: [
                'Negative feedback expands bandwidth & reduces THD',
                'Virtual short V+=V- applies ONLY in closed loop mode',
              ],
            },
            practiceProblems: [
              {
                id: 'p-ol-1',
                problem: 'An op-amp has AVD = 100,000 and Vsat = ±14V. What differential input voltage Vd will cause output saturation in open loop mode?',
                solutionSteps: [
                  'Step 1: Formula Vout = AVD × Vd.',
                  'Step 2: Saturation occurs when Vout = Vsat = 14V.',
                  'Step 3: Vd(sat) = Vsat / AVD = 14V / 100,000 = 0.00014V = 140 μV.',
                ],
                finalAnswer: 'Differential input Vd ≥ 140 μV causes saturation',
              },
            ],
            animatedSummary: {
              concept: 'Open loop operates as a non-linear comparator (±Vsat); closed loop negative feedback creates stable linear amplifiers.',
              rule: 'Open loop: Vout = AVD·Vd (Saturates). Closed loop: ACL ≈ 1/β (Linear).',
              example: 'Vd > 140μV drives open-loop op-amp into +14V saturation.',
              examTip: 'Draw both open-loop saturation curve and closed-loop linear transfer line for 6-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-ol-1',
                question: 'Which configuration is used to design precise linear voltage amplifiers?',
                options: ['Open Loop', 'Negative Closed Loop', 'Positive Closed Loop', 'Unbiased Mode'],
                correctAnswer: 1,
                explanation: 'Negative closed loop feedback provides stable, precise linear voltage gain.',
              },
            ],
          },
          {
            id: 'topic-ae-2-1-4',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-1',
            title: 'Virtual Ground Concept & Virtual Short Principle',
            description: 'Mathematical foundation of the Virtual Ground and Virtual Short concept under negative feedback, and node current balance derivations.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Core Theory ⭐',
            conceptSummary: 'When an op-amp operates in closed-loop negative feedback mode, the massive open-loop gain AVD forces the differential input voltage Vd = V+ - V- to near zero: Vd = Vout / AVD ≈ Vout / ∞ = 0 ⟹ V+ = V-. This is the Virtual Short principle. If the non-inverting input V+ is grounded (0V), the inverting input V- is virtually at 0V (Virtual Ground) without having a physical ground connection, and no current flows into the terminals due to Rin = ∞.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Virtual Short Principle', description: 'Vd = V+ - V- = Vout / AVD. As AVD ➔ ∞, Vd ➔ 0 ⟹ V+ = V-.', subtext: 'Both input terminals remain at identical potential' },
              { label: 'Virtual Ground Definition', description: 'When V+ = 0V (ground), V- is automatically held at 0V (Virtual Ground).', subtext: 'Acts as ground point but draws ZERO current!' },
              { label: 'Node Current Balance', description: 'Because Rin = ∞, current into terminal is 0A. All input current Iin passes into feedback path Rf.', subtext: 'Iin = If ⟹ Vin / Rin = - Vout / Rf' },
            ],
            memoryTricks: [
              {
                title: '💡 Virtual Ground Quick Rule',
                content: 'Virtual Short: V+ = V- (Voltage at both inputs is EQUAL under negative feedback!)\nVirtual Ground: If V+ = 0V ➔ V- = 0V (Inverting node held at 0V without physical wire!)',
                mnemonics: ['V+ = V- (Virtual Short)', 'V- = 0V if V+ = 0V (Virtual Ground)'],
              },
            ],
            realLifeExamples: [
              { title: 'Inverting Amplifier Summing Node', description: 'Virtual ground node allows multiple signal sources to mix without crosstalk.', icon: '🎛️' },
            ],
            flashcards: [
              { id: 'fc-vg-1', front: 'What is the Virtual Ground concept in Op-Amps?', back: 'A node (inverting input V-) that is virtually held at 0V potential because V+ is grounded, without being physically connected to ground.' },
            ],
            importantExamPoints: {
              definitions: [
                'Virtual Ground: A point in a circuit that is maintained at a steady zero voltage potential without being physically connected to the ground rail.',
                'Virtual Short: The condition where the voltage difference between inverting and non-inverting terminals is zero (V+ = V-) due to high negative feedback gain.',
              ],
              formulas: [
                'Virtual Short Equation: V+ = V-',
              ],
              theoremsRules: [
                'Rule 1: Virtual Ground ONLY exists when negative feedback is present!',
                'Rule 2: Never ground a virtual ground node with a physical wire!',
              ],
              expectedQuestions: [
                'Explain the Virtual Ground concept with diagram and mathematical justification. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Assuming Virtual Ground applies in open-loop comparator mode.',
                correct: 'Virtual Ground ONLY exists in closed-loop negative feedback mode when AVD is extremely high!',
                explanation: 'Without negative feedback, V+ and V- are not held equal.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Vd = Vout/AVD ≈ 0 ⟹ V+ = V-. If V+=0V, V- is Virtual Ground (0V). Zero current enters terminal (Rin=∞).',
              bulletPoints: [
                'Zero current enters virtual ground (Rin=∞)',
                'Enables precise mathematical summing & integration',
              ],
            },
            practiceProblems: [
              {
                id: 'p-vg-1',
                problem: 'Explain why current does not flow to ground through the virtual ground node of an inverting amplifier.',
                solutionSteps: [
                  'Step 1: Virtual ground exists at the inverting input terminal V-.',
                  'Step 2: The op-amp input impedance Rin is ideal infinity (2 MΩ for IC-741).',
                  'Step 3: By Ohm’s Law, current into the terminal is I = Vd / Rin = 0 / ∞ = 0A.',
                  'Step 4: All input current Iin is forced to flow through the feedback resistor Rf to the output node.',
                ],
                finalAnswer: 'Infinite input impedance Rin prevents current from entering the op-amp terminal.',
              },
            ],
            animatedSummary: {
              concept: 'Virtual ground holds V- at 0V without physical ground wire, directing all input current through feedback Rf.',
              rule: 'V+ = V- under negative feedback.',
              example: 'Inverting input V- stays at 0.000V while 1mA input current bypasses directly into feedback resistor.',
              examTip: 'State both mathematical condition (Vd=0) and terminal current condition (I=0) for full 6 marks!',
            },
            microQuiz: [
              {
                id: 'q-vg-1',
                question: 'What is the voltage potential at the inverting terminal of an op-amp if the non-inverting terminal is connected to +2V under negative feedback?',
                options: ['0 V', '+2 V', '-2 V', '+15 V'],
                correctAnswer: 1,
                explanation: 'By the Virtual Short principle (V+ = V-), if V+ = +2V, then V- is also held at +2V.',
              },
            ],
          },
          {
            id: 'topic-ae-2-1-5',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-1',
            title: 'IC-741 Pin Configuration & 8-Pin DIP Layout Details',
            description: 'Detailed pinout diagram, pin-by-pin function description, offset nulling potentiometer circuit on pins 1 & 5, and power supply wiring for IC-741.',
            estimatedTime: '15 mins',
            difficulty: 'Easy',
            badge: 'Pinout Diagram ⭐',
            conceptSummary: 'IC-741 is an industry-standard 8-pin Dual In-Line Package (DIP) operational amplifier IC. Pinout assignments: Pin 1: Offset Null 1, Pin 2: Inverting Input (V-), Pin 3: Non-Inverting Input (V+), Pin 4: Negative Supply (-VEE, typically -15V), Pin 5: Offset Null 2, Pin 6: Output (Vout), Pin 7: Positive Supply (+VCC, typically +15V), Pin 8: No Connection (NC). Offset nulling uses a 10kΩ potentiometer connected between Pins 1 & 5 with wiper tied to Pin 4.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Pin 1 & Pin 5 (Offset Null)', description: 'Connected across a 10kΩ potentiometer with wiper to Pin 4 (-VEE) to adjust DC output offset to 0V.', subtext: 'Nulls input offset voltage Vio' },
              { label: 'Pin 2 (V-) & Pin 3 (V+)', description: 'Pin 2 is Inverting input (-); Pin 3 is Non-Inverting input (+).', subtext: 'Differential input signal terminals' },
              { label: 'Pin 4 (-VEE) & Pin 7 (+VCC)', description: 'Pin 4 connects to negative supply rail (-15V); Pin 7 connects to positive supply rail (+15V).', subtext: 'Dual split DC power supply rails' },
              { label: 'Pin 6 (Output) & Pin 8 (NC)', description: 'Pin 6 is the main output terminal Vout; Pin 8 is No Connection (unused).', subtext: 'Output voltage swing bounds: ±Vsat ≈ ±14V' },
            ],
            memoryTricks: [
              {
                title: '💡 IC-741 Pinout Mnemonic (Clockwise from Notch)',
                content: 'Pin 1: Offset Null 1\nPin 2: Inverting Input (V-)\nPin 3: Non-Inverting Input (V+)\nPin 4: Negative Supply (-VEE)\nPin 5: Offset Null 2\nPin 6: Output (Vout)\nPin 7: Positive Supply (+VCC)\nPin 8: No Connection (NC)',
                mnemonics: ['2 is Inverting (-)', '3 is Non-Inverting (+)', '4 is -VEE, 7 is +VCC', '6 is Output'],
              },
            ],
            realLifeExamples: [
              { title: 'Breadboard Prototyping', description: 'Standard 8-pin DIP package fits breadboard IC sockets for analog lab experiments.', icon: '🔌' },
            ],
            flashcards: [
              { id: 'fc-pin-1', front: 'Which pin of IC-741 is the Output pin?', back: 'Pin 6.' },
              { id: 'fc-pin-2', front: 'Which pins are used for Offset Null in IC-741?', back: 'Pin 1 and Pin 5.' },
            ],
            importantExamPoints: {
              definitions: [
                'Dual In-Line Package (DIP): A standard integrated circuit package with two parallel rows of electrical connecting pins.',
              ],
              formulas: [
                'Offset Null Potentiometer: 10 kΩ pot between Pin 1 and Pin 5 with wiper to Pin 4 (-VEE)',
              ],
              theoremsRules: [
                'Rule 1: Always connect supply bypass capacitors (0.1μF) close to Pin 7 and Pin 4.',
              ],
              expectedQuestions: [
                'Draw the pin configuration of IC-741 Op-Amp and state the function of each pin. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Swapping Pin 4 (-VEE) and Pin 7 (+VCC) supply polarities.',
                correct: 'Pin 7 is POSITIVE (+VCC) and Pin 4 is NEGATIVE (-VEE)! Swapping polarities destroys the IC chip.',
                explanation: 'Reversing supply voltage causes catastrophic internal substrate diode latch-up.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'IC-741 8-pin DIP: 1&5 Offset Null, 2: V-, 3: V+, 4: -VEE, 6: Vout, 7: +VCC, 8: NC.',
              bulletPoints: [
                'Offset null pot connected across pins 1 & 5',
                'Dual supply ±15V connected to pins 7 (+VCC) and 4 (-VEE)',
              ],
            },
            practiceProblems: [
              {
                id: 'p-pin-1',
                problem: 'Draw the circuit connections required to null the offset voltage of IC-741 op-amp.',
                solutionSteps: [
                  'Step 1: Connect a 10 kΩ potentiometer between Pin 1 (Offset Null 1) and Pin 5 (Offset Null 2).',
                  'Step 2: Connect the wiper terminal of the potentiometer to Pin 4 (-VEE).',
                  'Step 3: Ground both input terminals (Pin 2 and Pin 3 = 0V).',
                  'Step 4: Measure output voltage at Pin 6 and adjust pot until Vout = 0.000 V.',
                ],
                finalAnswer: '10kΩ pot between Pin 1 & 5 with wiper to Pin 4.',
              },
            ],
            animatedSummary: {
              concept: 'IC-741 pinout provides standard 8-pin layout for power, inputs, output, and DC offset nulling.',
              rule: '2: V-, 3: V+, 4: -VEE, 6: Vout, 7: +VCC, 1&5: Offset Null.',
              example: 'A 10k pot across pins 1 and 5 nulls out 2mV input offset voltage.',
              examTip: 'Draw IC-741 DIP top view showing notch and pin numbering 1 to 8 counter-clockwise for 6-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-pin-1',
                question: 'Which pin of IC-741 corresponds to the Positive Supply (+VCC)?',
                options: ['Pin 4', 'Pin 6', 'Pin 7', 'Pin 8'],
                correctAnswer: 2,
                explanation: 'Pin 7 is +VCC, while Pin 4 is -VEE.',
              },
            ],
          },
        ],
      },

      {
        id: 'ae-chap-2-2',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-2',
        title: '2.2 Op-Amp Parameters & Thermal Drift',
        subtitle: 'Input/Output Offset Voltages, Bias/Offset Currents, CMRR, PSRR, Slew Rate, Impedances, Bandwidth, GBW & Drift',
        topics: [
          {
            id: 'topic-ae-2-2-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-2',
            title: 'Input Offset Voltage & Output Offset Voltage',
            description: 'Definitions, origins, mathematical equations (Voo = ACL × Vio), and offset nulling compensation circuits for Input Offset Voltage Vio and Output Offset Voltage Voo.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'DC Parameters ⭐',
            conceptSummary: 'Due to slight internal transistor mismatches in the input differential stage, practical op-amps exhibit DC offset errors. Input Offset Voltage (Vio) is defined as the small DC voltage that must be applied between the input terminals to force the output voltage to zero when Vin = 0V (IC-741 Vio = 1mV to 6mV). Output Offset Voltage (Voo) is the resulting error voltage at the output: Voo = ACL × Vio, where ACL is closed-loop non-inverting gain.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Input Offset Voltage (Vio)', description: 'DC voltage applied between inputs to make Vout = 0V when Vin = 0V.', subtext: 'Typical IC-741 Vio = 1mV to 6mV' },
              { label: 'Output Offset Voltage (Voo)', description: 'Resulting error voltage appearing at output node: Voo = ACL × Vio.', subtext: 'Amplified by closed loop non-inverting gain' },
              { label: 'Offset Nulling Compensation', description: '10kΩ potentiometer between Pins 1 & 5 with wiper to Pin 4 (-VEE) nulls Vio.', subtext: 'Forces Vout = 0.000V at DC' },
            ],
            stepByStepExamples: [
              {
                title: 'Calculation of Output Offset Voltage (Voo)',
                initialValue: 'Inverting Amp with Rin = 10kΩ, Rf = 100kΩ, Vio = 3mV',
                steps: [
                  { stepNum: 1, calculation: 'Closed Loop Gain for Offset Voltage: ACL = 1 + (Rf / Rin) = 1 + (100k / 10k) = 11', note: 'Non-inverting gain applies to offset' },
                  { stepNum: 2, calculation: 'Output Offset Voltage: Voo = ACL × Vio = 11 × 3mV = 33 mV', note: 'Voo = 33 mV' },
                ],
                answer: 'Output Offset Voltage Voo = 33 mV',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Offset Voltage Formulas',
                content: 'Vio = Input Offset Voltage (1-6mV for 741)\nVoo = ACL × Vio = [1 + (Rf / Rin)] × Vio\nNulling: 10k pot across pins 1 & 5',
                mnemonics: ['Voo = (1 + Rf/Rin) × Vio'],
              },
            ],
            realLifeExamples: [
              { title: 'High-Gain DC Instrumentation Amps', description: 'Requires offset nulling to prevent DC offsets from saturating amplifier outputs.', icon: '🔬' },
            ],
            flashcards: [
              { id: 'fc-vio-1', front: 'Define Input Offset Voltage (Vio).', back: 'The DC voltage that must be applied between input terminals to force the output voltage to zero.' },
              { id: 'fc-vio-2', front: 'Formula for Output Offset Voltage Voo in terms of Vio?', back: 'Voo = ACL × Vio = [1 + (Rf / Rin)] × Vio.' },
            ],
            importantExamPoints: {
              definitions: [
                'Input Offset Voltage (Vio): Differential DC voltage required between input terminals to yield zero output voltage.',
                'Output Offset Voltage (Voo): Unwanted DC error voltage appearing at the output terminal when both inputs are grounded.',
              ],
              formulas: [
                'Output Offset Voltage: Voo = (1 + Rf/Rin) × Vio',
              ],
              theoremsRules: [
                'Rule 1: Closed-loop gain for input offset voltage is ALWAYS non-inverting gain ACL = 1 + Rf/Rin.',
              ],
              expectedQuestions: [
                'Define Vio and Voo. Derive the formula Voo = (1 + Rf/Rin) Vio. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Using inverting gain (-Rf/Rin) to calculate Voo from Vio in an inverting amplifier.',
                correct: 'Offset voltage is modeled in series with the non-inverting terminal, so non-inverting gain (1 + Rf/Rin) MUST be used!',
                explanation: 'Vio sees non-inverting closed-loop gain regardless of amplifier configuration.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Vio forces Vout=0V (1-6mV). Output offset Voo = (1 + Rf/Rin) Vio. Null via 10k pot on pins 1 & 5.',
              bulletPoints: [
                'Vio caused by input diff amp transistor mismatch',
                'Voo amplified by non-inverting gain (1 + Rf/Rin)',
              ],
            },
            practiceProblems: [
              {
                id: 'p-vio-1',
                problem: 'An inverting amplifier has Rin = 1kΩ and Rf = 49kΩ. If Vio = 2mV, find Voo.',
                solutionSteps: [
                  'Step 1: Non-inverting gain ACL = 1 + (Rf / Rin) = 1 + (49k / 1k) = 50.',
                  'Step 2: Voo = ACL × Vio = 50 × 2mV = 100 mV = 0.1 V.',
                ],
                finalAnswer: 'Voo = 100 mV (0.1V offset at output)',
              },
            ],
            animatedSummary: {
              concept: 'Input offset voltage Vio multiplies by non-inverting gain to produce output offset voltage Voo.',
              rule: 'Voo = (1 + Rf/Rin) × Vio.',
              example: 'Vio = 2mV with gain of 50 yields Voo = 100mV error voltage.',
              examTip: 'Always use ACL = 1 + Rf/Rin when calculating Voo!',
            },
            microQuiz: [
              {
                id: 'q-vio-1',
                question: 'What is the formula for Output Offset Voltage Voo due to Input Offset Voltage Vio?',
                options: ['Voo = (Rf / Rin) × Vio', 'Voo = (1 + Rf / Rin) × Vio', 'Voo = Vio / Rf', 'Voo = Vio × Rin'],
                correctAnswer: 1,
                explanation: 'Voo = ACL × Vio = (1 + Rf / Rin) × Vio.',
              },
            ],
          },
          {
            id: 'topic-ae-2-2-2',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-2',
            title: 'Input Bias Current & Input Offset Current (with Bias Compensation Rcomp)',
            description: 'Definitions, origins, mathematical equations (Iib = [Ib1+Ib2]/2, Iio = |Ib1-Ib2|), and design of bias compensation resistor Rcomp = Rin || Rf.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'DC Parameters ⭐',
            conceptSummary: 'Input Bias Current (Iib) is the average DC base current flowing into the input terminals when Vout = 0V: Iib = (Ib1 + Ib2) / 2 (typical IC-741 Iib = 80nA). Input Offset Current (Iio) is the absolute difference between the two input currents: Iio = |Ib1 - Ib2| (typical IC-741 Iio = 20nA). Bias currents produce DC voltage drops across input resistors. Placing a compensation resistor Rcomp = Rin || Rf in series with the non-inverting terminal balances base impedances and eliminates Iib offset error.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Input Bias Current (Iib)', description: 'Average of DC base currents flowing into input terminals: Iib = (Ib1 + Ib2) / 2.', subtext: 'Creates DC voltage drop across input resistors' },
              { label: 'Input Offset Current (Iio)', description: 'Difference between two input bias currents: Iio = |Ib1 - Ib2|.', subtext: 'Unbalance between matched differential transistors' },
              { label: 'Bias Current Compensation (Rcomp)', description: 'Resistor Rcomp = Rin || Rf placed in non-inverting terminal cancels bias current error.', subtext: 'Reduces net DC output error to Voo = Rf × Iio' },
            ],
            stepByStepExamples: [
              {
                title: 'Calculation of Bias Compensation Resistor Rcomp',
                initialValue: 'Inverting Amp with Rin = 10kΩ and Rf = 100kΩ',
                steps: [
                  { stepNum: 1, calculation: 'Formula: Rcomp = Rin || Rf = (Rin × Rf) / (Rin + Rf)', note: 'Parallel combination' },
                  { stepNum: 2, calculation: 'Rcomp = (10k × 100k) / (10k + 100k) = 1000k / 110k = 9.09 kΩ', note: 'Standard value 9.1 kΩ' },
                ],
                answer: 'Rcomp = 9.09 kΩ (Connect in series with V+ terminal)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Bias & Offset Current Quick Rules',
                content: 'Bias Current Iib = AVERAGE (Ib1 + Ib2) / 2\nOffset Current Iio = DIFFERENCE |Ib1 - Ib2|\nCompensation Resistor Rcomp = Rin || Rf',
                mnemonics: ['Iib = Average, Iio = Difference', 'Rcomp = Rin || Rf'],
              },
            ],
            realLifeExamples: [
              { title: 'High Resistance Sensor Interfaces', description: 'Requires FET op-amps (TL081) with picoamp bias currents to prevent loading.', icon: '🧪' },
            ],
            flashcards: [
              { id: 'fc-iib-1', front: 'Formula for Input Bias Current (Iib)?', back: 'Iib = (Ib1 + Ib2) / 2.' },
              { id: 'fc-iib-2', front: 'Formula for Input Offset Current (Iio)?', back: 'Iio = |Ib1 - Ib2|.' },
              { id: 'fc-iib-3', front: 'Formula for bias compensation resistor Rcomp in inverting amplifier?', back: 'Rcomp = Rin || Rf = (Rin × Rf) / (Rin + Rf).' },
            ],
            importantExamPoints: {
              definitions: [
                'Input Bias Current (Iib): Average value of DC base currents flowing into the two input terminals when Vout = 0V.',
                'Input Offset Current (Iio): Absolute difference between the two input base bias currents.',
              ],
              formulas: [
                'Input Bias Current: Iib = (Ib1 + Ib2) / 2',
                'Input Offset Current: Iio = |Ib1 - Ib2|',
                'Compensation Resistor: Rcomp = Rin || Rf',
                'Output Offset Voltage (with Rcomp): Voo = Rf × Iio',
              ],
              theoremsRules: [
                'Rule 1: Always add Rcomp = Rin || Rf in non-inverting terminal to eliminate bias current errors.',
              ],
              expectedQuestions: [
                'Define Iib and Iio. Show how Rcomp = Rin || Rf minimizes bias current offset. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Confusing Input Bias Current (Iib) with Input Offset Current (Iio).',
                correct: 'Iib is the AVERAGE of the two input currents; Iio is the DIFFERENCE between them.',
                explanation: 'Iib = (Ib1 + Ib2)/2, whereas Iio = |Ib1 - Ib2|.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Iib=(Ib1+Ib2)/2, Iio=|Ib1-Ib2|. Rcomp = Rin||Rf eliminates Iib error, leaving small Voo = Rf·Iio error.',
              bulletPoints: [
                'Iib typical IC-741 = 80 nA',
                'Iio typical IC-741 = 20 nA',
              ],
            },
            practiceProblems: [
              {
                id: 'p-iib-1',
                problem: 'Calculate Rcomp required for an inverting amplifier with Rin = 4.7kΩ and Rf = 47kΩ.',
                solutionSteps: [
                  'Step 1: Formula Rcomp = Rin || Rf = (Rin × Rf) / (Rin + Rf).',
                  'Step 2: Rcomp = (4.7k × 47k) / (4.7k + 47k) = 220.9k / 51.7k = 4.27 kΩ.',
                ],
                finalAnswer: 'Rcomp = 4.27 kΩ (Standard 4.3 kΩ resistor)',
              },
            ],
            animatedSummary: {
              concept: 'Rcomp = Rin||Rf balances DC base impedances to cancel input bias current error.',
              rule: 'Iib = (Ib1+Ib2)/2, Iio = |Ib1-Ib2|, Rcomp = Rin||Rf.',
              example: 'Rin=10k and Rf=100k requires 9.09kΩ Rcomp at non-inverting terminal.',
              examTip: 'Draw Rcomp connected between non-inverting terminal V+ and Ground for 6-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-iib-1',
                question: 'Which resistor value should be connected to the non-inverting terminal to compensate for Input Bias Current in an inverting amplifier?',
                options: ['Rf', 'Rin', 'Rin + Rf', 'Rin || Rf'],
                correctAnswer: 3,
                explanation: 'Rcomp = Rin || Rf balances base impedances and cancels Iib offset.',
              },
            ],
          },
          {
            id: 'topic-ae-2-2-3',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-2',
            title: 'Common Mode Rejection Ratio (CMRR) & Power Supply Rejection Ratio (PSRR)',
            description: 'Definitions, decibel formulas (CMRR = 20 log10 |Ad/Ac|, PSRR = ΔVio/ΔVS), importance in noise rejection, and typical IC-741 values.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Noise Rejection ⭐',
            conceptSummary: '1) Common Mode Rejection Ratio (CMRR): The ability of an op-amp to amplify differential signals Ad while rejecting common-mode noise Ac (e.g. 50Hz mains hum): CMRR = |Ad / Ac| ⟹ CMRR(dB) = 20 log10 |Ad / Ac| (typical IC-741 CMRR = 90dB). 2) Power Supply Rejection Ratio (PSRR): The ratio of change in input offset voltage to the change in supply voltage: PSRR = ΔVio / ΔVS ⟹ PSRR(dB) = 20 log10 (ΔVS / ΔVio) (typical IC-741 PSRR = 30μV/V or 90dB).',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Differential Gain (Ad)', description: 'Gain for differential signal Vd = V1 - V2. Vout = Ad × Vd.', subtext: 'Extremely high gain (~200,000)' },
              { label: 'Common Mode Gain (Ac)', description: 'Gain for common signal Vc = (V1 + V2) / 2. Vout = Ac × Vc.', subtext: 'Ideally zero (Practical ~0.006)' },
              { label: 'CMRR Decibel Equation', description: 'CMRR(dB) = 20 log10 (Ad / Ac). Higher CMRR ⟹ Cleaner output.', subtext: 'IC-741 CMRR = 90 dB (31,622 ratio)' },
              { label: 'Power Supply Rejection (PSRR)', description: 'PSRR = ΔVio / ΔVS. Rejects power supply ripple and noise spikes.', subtext: 'IC-741 PSRR = 30 μV/V' },
            ],
            stepByStepExamples: [
              {
                title: 'CMRR Calculation Example',
                initialValue: 'Differential Gain Ad = 100,000, Common Mode Gain Ac = 0.5',
                steps: [
                  { stepNum: 1, calculation: 'CMRR ratio = Ad / Ac = 100,000 / 0.5 = 200,000', note: 'Linear ratio' },
                  { stepNum: 2, calculation: 'CMRR(dB) = 20 log10 (200,000) = 20 × 5.301 = 106.02 dB', note: 'Decibel value' },
                ],
                answer: 'CMRR = 200,000 (106.02 dB)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 CMRR & PSRR Decibel Formulas',
                content: 'CMRR = |Ad / Ac| ➔ CMRR(dB) = 20 log10 |Ad / Ac|\nPSRR = ΔVio / ΔVS ➔ PSRR(dB) = 20 log10 (ΔVS / ΔVio)\nIC-741 CMRR = 90 dB, PSRR = 90 dB',
                mnemonics: ['CMRR = 20 log (Ad / Ac)', 'Higher CMRR = Better Noise Rejection!'],
              },
            ],
            realLifeExamples: [
              { title: 'Biomedical ECG Heart Monitors', description: 'High CMRR (>110dB) rejects 50Hz power grid hum while picking up microvolt heart signals.', icon: '🩺' },
            ],
            flashcards: [
              { id: 'fc-cmrr-1', front: 'Define Common Mode Rejection Ratio (CMRR).', back: 'The ratio of differential voltage gain Ad to common-mode voltage gain Ac: CMRR = |Ad / Ac|.' },
              { id: 'fc-cmrr-2', front: 'What is the CMRR of a standard IC-741 Op-Amp in dB?', back: 'Approximately 90 dB.' },
            ],
            importantExamPoints: {
              definitions: [
                'Common Mode Rejection Ratio (CMRR): Measure of op-amp ability to reject signals common to both inputs: CMRR(dB) = 20 log10 |Ad/Ac|.',
                'Power Supply Rejection Ratio (PSRR): Measure of op-amp ability to maintain constant Vio despite variations in supply voltage VS.',
              ],
              formulas: [
                'CMRR Ratio: CMRR = |Ad / Ac|',
                'CMRR in dB: CMRR(dB) = 20 log10 |Ad / Ac|',
                'PSRR: PSRR = ΔVio / ΔVS',
              ],
              theoremsRules: [
                'Rule 1: Higher CMRR ensures common-mode noise (mains hum) is suppressed at output.',
              ],
              expectedQuestions: [
                'Define CMRR and PSRR. Express CMRR in dB. Calculate CMRR in dB if Ad = 200,000 and Ac = 2. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Using 10 log10 for CMRR in dB.',
                correct: 'CMRR is a VOLTAGE gain ratio, so 20 log10 (Ad/Ac) MUST be used!',
                explanation: 'Voltage ratios use 20 log10; power ratios use 10 log10.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'CMRR(dB) = 20 log10(Ad/Ac), PSRR = ΔVio/ΔVS. Rejects 50Hz mains noise and supply ripple.',
              bulletPoints: [
                'IC-741 CMRR = 90 dB',
                'High CMRR essential for biomedical ECG amplifiers',
              ],
            },
            practiceProblems: [
              {
                id: 'p-cmrr-1',
                problem: 'An op-amp has Ad = 150,000 and Ac = 1.5. Calculate CMRR in dB.',
                solutionSteps: [
                  'Step 1: Ratio CMRR = Ad / Ac = 150,000 / 1.5 = 100,000.',
                  'Step 2: CMRR(dB) = 20 log10 (100,000) = 20 × 5 = 100 dB.',
                ],
                finalAnswer: 'CMRR = 100 dB',
              },
            ],
            animatedSummary: {
              concept: 'CMRR measures differential gain vs common-mode noise gain; PSRR measures immunity to supply ripple.',
              rule: 'CMRR(dB) = 20 log10(Ad/Ac). Higher is better!',
              example: 'Ad = 150,000 and Ac = 1.5 yields 100dB noise rejection.',
              examTip: 'Remember to use 20 log10 for voltage gain ratios in CMRR exam problems!',
            },
            microQuiz: [
              {
                id: 'q-cmrr-1',
                question: 'What is the value of CMRR in dB if Ad = 100,000 and Ac = 1.0?',
                options: ['50 dB', '80 dB', '100 dB', '120 dB'],
                correctAnswer: 2,
                explanation: 'CMRR(dB) = 20 log10 (100,000 / 1) = 20 × 5 = 100 dB.',
              },
            ],
          },
          {
            id: 'topic-ae-2-2-4',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-2',
            title: 'Slew Rate (SR) & Full-Power Bandwidth (fmax)',
            description: 'Definition of Slew Rate (SR = [dVout/dt]max in V/μs), derivation of full-power bandwidth fmax = SR / (2π Vm), causes, and slew-rate limiting distortion.',
            estimatedTime: '15 mins',
            difficulty: 'Hard',
            badge: 'Speed Metric ⭐',
            conceptSummary: 'Slew Rate (SR) is defined as the maximum rate of change of output voltage with respect to time: SR = |dVout / dt|max, expressed in V/μs (IC-741 SR = 0.5V/μs). It is caused by the internal charging current limit of the frequency compensation capacitor. Slew rate limits the maximum distortion-free frequency for a peak output voltage Vm: fmax = SR / (2π Vm). If input frequency exceeds fmax, output distorts into a triangular wave.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Slew Rate Definition', description: 'SR = (dVout / dt)max in V/μs. Measures how fast output voltage can switch.', subtext: 'IC-741 Slew Rate = 0.5 V/μs' },
              { label: 'Internal Cause', description: 'Internal compensation capacitor CC charged by limited current Imax: SR = Imax / CC.', subtext: 'Physical silicon speed limit' },
              { label: 'Full-Power Frequency (fmax)', description: 'fmax = SR / (2π Vm). Max frequency for distortion-free sine output amplitude Vm.', subtext: 'Higher output voltage ⟹ Lower fmax' },
              { label: 'Slew-Rate Limiting Distortion', description: 'When f > fmax, output cannot keep up with sine slope, morphing into a triangular wave.', subtext: 'Amplitude attenuates and phase lags' },
            ],
            stepByStepExamples: [
              {
                title: 'Slew Rate Limiting Frequency Calculation',
                initialValue: 'Op-Amp Slew Rate SR = 0.5 V/μs = 500,000 V/s, Output Peak Voltage Vm = 10V',
                steps: [
                  { stepNum: 1, calculation: 'Formula: fmax = SR / (2π Vm)', note: 'Convert SR to V/second: 0.5 × 10⁶ V/s' },
                  { stepNum: 2, calculation: 'fmax = 500,000 / (2 × 3.1416 × 10) = 500,000 / 62.832', note: 'fmax = 7957.7 Hz = 7.96 kHz' },
                ],
                answer: 'Maximum Distortion-Free Frequency fmax = 7.96 kHz',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Slew Rate Formulas',
                content: 'SR = (dVout / dt)max = 2π f Vm (V/μs)\nfmax = SR / (2π Vm)\nIC-741 SR = 0.5 V/μs',
                mnemonics: ['fmax = SR / (2π Vm)', 'Multiply SR by 10⁶ to convert V/μs to V/s!'],
              },
            ],
            realLifeExamples: [
              { title: 'High Frequency Digital Pulse Amps', description: 'High Slew Rate op-amps (LM318 SR = 50V/μs) preserve square wave clock edges.', icon: '⚡' },
            ],
            flashcards: [
              { id: 'fc-sr-1', front: 'Define Slew Rate (SR) of an Op-Amp.', back: 'The maximum rate of change of output voltage with respect to time: SR = (dVout / dt)max, expressed in V/μs.' },
              { id: 'fc-sr-2', front: 'Formula for maximum distortion-free frequency fmax based on Slew Rate?', back: 'fmax = SR / (2π Vm).' },
            ],
            importantExamPoints: {
              definitions: [
                'Slew Rate (SR): Maximum rate of change of op-amp output voltage: SR = (dVout/dt)max.',
                'Full-Power Bandwidth (fmax): Maximum frequency at which an op-amp can deliver an un-distorted sinusoidal output of peak amplitude Vm.',
              ],
              formulas: [
                'Slew Rate Equation: SR = 2π f Vm (V/s)',
                'Max Frequency: fmax = SR / (2π Vm)',
              ],
              theoremsRules: [
                'Rule 1: If input frequency exceeds fmax, output undergoes slew-rate limiting distortion into a triangular wave.',
              ],
              expectedQuestions: [
                'Define Slew Rate. Derive fmax = SR / (2π Vm). Calculate fmax for SR = 0.5V/μs and Vm = 8V. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Forgetting to convert Slew Rate from V/μs to V/s when using fmax = SR / (2π Vm).',
                correct: '0.5 V/μs MUST be multiplied by 10⁶ to become 500,000 V/s before dividing!',
                explanation: '1 μs = 10⁻⁶ seconds.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'SR = (dV/dt)max = 2π f Vm. fmax = SR / (2π Vm). IC-741 SR = 0.5 V/μs limits high-frequency swing.',
              bulletPoints: [
                'Higher Vm reduces max frequency fmax',
                'Exceeding fmax distorts sine wave into triangle',
              ],
            },
            practiceProblems: [
              {
                id: 'p-sr-1',
                problem: 'An op-amp has Slew Rate SR = 2 V/μs. Find maximum peak output voltage Vm at frequency f = 40 kHz without distortion.',
                solutionSteps: [
                  'Step 1: Formula SR = 2π f Vm ⟹ Vm = SR / (2π f).',
                  'Step 2: SR = 2 × 10⁶ V/s, f = 40,000 Hz.',
                  'Step 3: Vm = (2 × 10⁶) / (2 × 3.1416 × 40,000) = 2,000,000 / 251,327 = 7.96 V.',
                ],
                finalAnswer: 'Maximum Peak Output Voltage Vm = 7.96 V',
              },
            ],
            animatedSummary: {
              concept: 'Slew rate limits maximum output switching speed; exceeding fmax distorts sine waves into triangular waves.',
              rule: 'fmax = SR / (2π Vm). Multiply SR by 10⁶ for V/s.',
              example: 'SR = 0.5V/μs with 10V amplitude limits distortion-free frequency to 7.96kHz.',
              examTip: 'Remember to multiply Slew Rate by 10⁶ to convert V/μs to V/s in exam calculations!',
            },
            microQuiz: [
              {
                id: 'q-sr-1',
                question: 'What is the Slew Rate of a standard IC-741 Op-Amp?',
                options: ['0.1 V/μs', '0.5 V/μs', '10 V/μs', '100 V/μs'],
                correctAnswer: 1,
                explanation: 'IC-741 has a typical Slew Rate of 0.5 V/μs.',
              },
            ],
          },
          {
            id: 'topic-ae-2-2-5',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-2',
            title: 'Input Impedance, Output Impedance, Bandwidth & Gain-Bandwidth Product (GBW)',
            description: 'Definitions, formulas, closed-loop impact on Rin and Rout, frequency response curve, and constant Gain-Bandwidth Product relation (GBW = ACL × fH = 1MHz).',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Frequency Response ⭐',
            conceptSummary: 'Op-amp frequency response exhibits a constant Gain-Bandwidth Product (GBW): GBW = ACL × fH = 1 MHz (for IC-741). Increasing closed-loop gain reduces upper cutoff frequency fH proportionally: fH = GBW / ACL. Input Impedance Rin in closed-loop inverting mode equals Rin; in non-inverting mode Rin(cl) ≈ ∞. Output Impedance Rout in closed-loop mode drops dramatically: Rout(cl) = Rout / (1 + AVD β).',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Gain-Bandwidth Product (GBW)', description: 'GBW = ACL × fH = Constant (1 MHz for IC-741). Trade-off between Gain and Bandwidth.', subtext: 'Higher Gain ⟹ Lower Cutoff Frequency fH' },
              { label: 'Closed Loop Input Impedance', description: 'Inverting Amp: Zin = Rin. Non-Inverting Amp: Zin = Rin × (1 + AVD β) ≈ ∞.', subtext: 'Non-inverting provides ultra-high input impedance' },
              { label: 'Closed Loop Output Impedance', description: 'Zout(cl) = Rout / (1 + AVD β). Negative feedback reduces Rout to near 0Ω.', subtext: 'Acts as ideal voltage source driver' },
            ],
            stepByStepExamples: [
              {
                title: 'Bandwidth Calculation using GBW',
                initialValue: 'GBW = 1 MHz (1,000,000 Hz), Closed Loop Gain ACL = 50',
                steps: [
                  { stepNum: 1, calculation: 'Formula: GBW = ACL × fH ⟹ fH = GBW / ACL', note: 'Constant GBW product' },
                  { stepNum: 2, calculation: 'fH = 1,000,000 Hz / 50 = 20,000 Hz = 20 kHz', note: 'Covers audio spectrum' },
                ],
                answer: 'Upper Cutoff Frequency fH = 20 kHz',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Gain-Bandwidth Product Formula',
                content: 'GBW = ACL × fH = 1 MHz (for IC-741)\nfH = GBW / ACL\nZout(cl) = Rout / (1 + AVD β)',
                mnemonics: ['GBW = Gain × Bandwidth = 1 MHz'],
              },
            ],
            realLifeExamples: [
              { title: 'Audio Amplifier Design', description: 'Setting gain to 50 ensures flat frequency response up to 20kHz audio limit.', icon: '🎧' },
            ],
            flashcards: [
              { id: 'fc-gbw-1', front: 'What is the Gain-Bandwidth Product (GBW) of IC-741?', back: '1 MHz (1,000,000 Hz).' },
            ],
            importantExamPoints: {
              definitions: [
                'Gain-Bandwidth Product (GBW): The product of open/closed-loop voltage gain and 3dB bandwidth, which remains constant across frequency.',
              ],
              formulas: [
                'Gain-Bandwidth Relation: GBW = ACL × fH',
                'Closed Loop Output Z: Zout(cl) = Rout / (1 + AVD β)',
              ],
              theoremsRules: [
                'Rule 1: Closed-loop bandwidth is inversely proportional to closed-loop gain.',
              ],
              expectedQuestions: [
                'Define GBW. Calculate fH for an op-amp with GBW = 1MHz when ACL = 100. [4 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Assuming closed-loop bandwidth remains 1 MHz regardless of gain.',
                correct: '1 MHz is the product of Gain × Bandwidth! If Gain = 100, Bandwidth drops to 10 kHz.',
                explanation: 'GBW = 100 × 10kHz = 1,000kHz = 1MHz.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'GBW = ACL × fH = 1MHz. Higher gain reduces bandwidth. Zout(cl) = Rout/(1+AVDβ).',
              bulletPoints: [
                'Gain of 100 gives 10kHz bandwidth',
                'Gain of 10 gives 100kHz bandwidth',
              ],
            },
            practiceProblems: [
              {
                id: 'p-gbw-1',
                problem: 'Find the maximum closed-loop gain ACL that allows a bandwidth of fH = 50 kHz for an op-amp with GBW = 1 MHz.',
                solutionSteps: [
                  'Step 1: Formula GBW = ACL × fH ⟹ ACL = GBW / fH.',
                  'Step 2: ACL = 1,000,000 Hz / 50,000 Hz = 20.',
                ],
                finalAnswer: 'Maximum Closed-Loop Gain ACL = 20',
              },
            ],
            animatedSummary: {
              concept: 'GBW is a constant trade-off between voltage gain and operating bandwidth.',
              rule: 'GBW = ACL × fH = 1MHz.',
              example: 'Setting gain to 20 allows a bandwidth up to 50kHz.',
              examTip: 'Use GBW = Gain × Bandwidth formula for instant 4-mark numerical answers!',
            },
            microQuiz: [
              {
                id: 'q-gbw-1',
                question: 'If an op-amp has closed-loop gain of 100 and GBW of 1 MHz, what is its upper cutoff frequency fH?',
                options: ['1 kHz', '10 kHz', '100 kHz', '1 MHz'],
                correctAnswer: 1,
                explanation: 'fH = GBW / Gain = 1,000,000 / 100 = 10,000 Hz = 10 kHz.',
              },
            ],
          },
          {
            id: 'topic-ae-2-2-6',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-2',
            title: 'Thermal Drift Parameters (ΔVio/ΔT, ΔIio/ΔT)',
            description: 'Definitions of thermal drift of Input Offset Voltage (ΔVio/ΔT in μV/°C) and Input Offset Current (ΔIio/ΔT in nA/°C), and thermal stability techniques.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Thermal Stability ⭐',
            conceptSummary: 'Thermal Drift parameters measure how op-amp DC offset parameters change with temperature variations: 1) Thermal Drift of Input Offset Voltage (ΔVio / ΔT, typical IC-741 = 10 μV/°C), and 2) Thermal Drift of Input Offset Current (ΔIio / ΔT, typical IC-741 = 20 pA/°C). Thermal drift causes DC output voltage to wander over temperature changes, requiring temperature-compensated chopper-stabilized or auto-zero op-amps in precision sensors.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-block-pinout',
            diagramSteps: [
              { label: 'Thermal Drift Definition', description: 'Rate of change of offset parameter per degree Celsius change in temperature (ΔVio/ΔT).', subtext: 'Measures temperature sensitivity' },
              { label: 'Impact on DC Output Error', description: 'ΔVoo = ACL × (ΔVio / ΔT) × ΔT. Temperature rise increases output DC error voltage.', subtext: 'Critical in outdoor industrial environments' },
              { label: 'Mitigation Techniques', description: 'Use precision low-drift op-amps (OP07 ΔVio/ΔT = 0.6 μV/°C) or chopper-stabilized auto-zero op-amps.', subtext: 'Maintains microvolt precision over temperature' },
            ],
            memoryTricks: [
              {
                title: '💡 Thermal Drift Formulas',
                content: 'ΔVio / ΔT = Voltage Offset Drift (μV/°C)\nΔIio / ΔT = Current Offset Drift (pA/°C)\nOP07 = Low Drift Precision Op-Amp (0.6 μV/°C)',
                mnemonics: ['Drift = Change per °C', 'OP07 = Low Drift Winner'],
              },
            ],
            realLifeExamples: [
              { title: 'Outdoor Weather Station Sensors', description: 'Requires low drift OP07 op-amps to prevent 40°C temperature shifts from distorting measurements.', icon: '🌡️' },
            ],
            flashcards: [
              { id: 'fc-td-1', front: 'What is Thermal Drift of Input Offset Voltage (ΔVio/ΔT)?', back: 'The change in input offset voltage per degree Celsius change in temperature, expressed in μV/°C.' },
            ],
            importantExamPoints: {
              definitions: [
                'Thermal Drift: The variation of op-amp offset parameters (Vio, Iio) with changes in ambient temperature.',
              ],
              formulas: [
                'Offset Voltage Change: ΔVio = (ΔVio / ΔT) × ΔT',
                'Output Drift Voltage: ΔVoo = (1 + Rf/Rin) × (ΔVio / ΔT) × ΔT',
              ],
              theoremsRules: [
                'Rule 1: Chopper-stabilized op-amps eliminate thermal drift errors near 0 Hz DC.',
              ],
              expectedQuestions: [
                'Define thermal drift of Vio and Iio. Calculate ΔVoo for a 30°C temperature rise if ΔVio/ΔT = 10μV/°C and ACL = 100. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Assuming offset nulling at room temperature (25°C) eliminates thermal drift at 50°C.',
                correct: 'Potentiometer offset nulling ONLY corrects offset at ONE specific temperature! Thermal drift causes offsets to wander as temp changes.',
                explanation: 'Drift is temperature-dependent slope ΔVio/ΔT.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Thermal drift (ΔVio/ΔT) causes offset wandering over temperature. Precision OP07 reduces drift to 0.6 μV/°C.',
              bulletPoints: [
                'IC-741 ΔVio/ΔT = 10 μV/°C',
                'ΔVoo = ACL × (ΔVio/ΔT) × ΔT',
              ],
            },
            practiceProblems: [
              {
                id: 'p-td-1',
                problem: 'An inverting amplifier has gain ACL = 100. If temperature rises by ΔT = 25°C and ΔVio/ΔT = 10 μV/°C, find the output drift voltage ΔVoo.',
                solutionSteps: [
                  'Step 1: Calculate input offset drift ΔVio = (ΔVio / ΔT) × ΔT = 10 μV/°C × 25°C = 250 μV = 0.25 mV.',
                  'Step 2: Calculate output drift ΔVoo = ACL × ΔVio = 100 × 0.25 mV = 25 mV.',
                ],
                finalAnswer: 'Output Offset Drift Voltage ΔVoo = 25 mV',
              },
            ],
            animatedSummary: {
              concept: 'Thermal drift quantifies offset changes per °C; precision OP07 op-amps minimize drift in outdoor sensors.',
              rule: 'ΔVoo = ACL × (ΔVio/ΔT) × ΔT.',
              example: 'A 25°C temperature rise with gain 100 creates a 25mV output drift.',
              examTip: 'State units as μV/°C for voltage drift and pA/°C for current drift!',
            },
            microQuiz: [
              {
                id: 'q-td-1',
                question: 'What is the unit of Thermal Drift of Input Offset Voltage (ΔVio/ΔT)?',
                options: ['mV / Volt', 'μV / °C', 'nA / °C', 'V / μs'],
                correctAnswer: 1,
                explanation: 'Thermal drift of input offset voltage is measured in microvolts per degree Celsius (μV/°C).',
              },
            ],
          },
        ],
      },

      {
        id: 'ae-chap-2-3',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-2',
        title: '2.3 Closed Loop Amplifier Configurations',
        subtitle: 'Inverting Amplifier, Non-Inverting Amplifier & Voltage Follower (Buffer)',
        topics: [
          {
            id: 'topic-ae-2-3-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-3',
            title: 'Inverting Closed Loop Amplifier Configuration',
            description: 'Circuit diagram, Virtual Ground derivation of Av = -Rf/Rin, input impedance Zin = Rin, 180° phase inversion, and design procedure.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Core Circuit ⭐',
            conceptSummary: 'In an Inverting Amplifier, input Vin is connected to the inverting (-) terminal via Rin, feedback Rf connects Vout to V-, and non-inverting terminal V+ is grounded. Virtual ground forces V- = 0V. By KCL at node V-: Iin = (Vin - 0)/Rin, If = (0 - Vout)/Rf. Equating Iin = If yields Vout = - (Rf / Rin) Vin. The negative sign denotes 180° phase inversion. Input impedance Zin = Rin.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-inverting-noninverting',
            diagramSteps: [
              { label: 'Virtual Ground Node V-', description: 'V+ = 0V ⟹ V- = 0V via Virtual Short principle.', subtext: 'Inverting terminal held at 0V potential' },
              { label: 'Input Current (Iin)', description: 'Iin = (Vin - 0) / Rin = Vin / Rin.', subtext: 'Ohm’s law across input resistor' },
              { label: 'Feedback Current (If)', description: 'If = (0 - Vout) / Rf = - Vout / Rf.', subtext: 'Ohm’s law across feedback resistor' },
              { label: 'KCL Node Balance', description: 'Iin = If ⟹ Vin / Rin = - Vout / Rf ⟹ Vout = - (Rf / Rin) Vin.', subtext: 'Gain Av = - Rf / Rin with 180° phase shift' },
            ],
            stepByStepExamples: [
              {
                title: 'Inverting Gain Derivation',
                initialValue: 'Inverting circuit with Rin, Rf, V+ = 0V',
                steps: [
                  { stepNum: 1, calculation: 'Virtual Ground: V- = V+ = 0V', note: 'Virtual short' },
                  { stepNum: 2, calculation: 'Iin = (Vin - 0) / Rin = Vin / Rin', note: 'Input branch current' },
                  { stepNum: 3, calculation: 'If = (0 - Vout) / Rf = - Vout / Rf', note: 'Feedback branch current' },
                  { stepNum: 4, calculation: 'Iin = If ⟹ Vin / Rin = - Vout / Rf ⟹ Vout = - (Rf / Rin) Vin', note: 'Equating currents' },
                ],
                answer: 'Av = Vout / Vin = - Rf / Rin (180° Phase Shift)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Inverting Amp Formulas',
                content: 'Voltage Gain Av = - Rf / Rin\nPhase Shift = 180° (Inverted Output)\nInput Impedance Zin = Rin',
                mnemonics: ['Inverting = MINUS Rf / Rin'],
              },
            ],
            realLifeExamples: [
              { title: 'Audio Pre-Amplifier Gain Stage', description: 'Inverting amplifier stage boosting microphone signals with precise gain.', icon: '🎙️' },
            ],
            flashcards: [
              { id: 'fc-inv-1', front: 'Formula for voltage gain of an Inverting Amplifier?', back: 'Av = - Rf / Rin.' },
            ],
            importantExamPoints: {
              definitions: [
                'Inverting Amplifier: A closed-loop op-amp configuration where the input signal is applied to the inverting terminal, producing an amplified output with 180° phase inversion.',
              ],
              formulas: [
                'Inverting Gain: Av = - Rf / Rin',
                'Input Impedance: Zin = Rin',
              ],
              theoremsRules: [
                'Rule 1: Input impedance equals Rin, so Rin should not be chosen too small to avoid loading the source.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of an Inverting Amplifier. Derive the expression for its voltage gain Av = -Rf/Rin using virtual ground. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Writing input impedance as infinity for an inverting amplifier.',
                correct: 'Inverting amplifier input impedance is Zin = Rin (not infinity)!',
                explanation: 'Input current flows into Rin toward the virtual ground node.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Inverting Amp: Av = -Rf/Rin (180° shift). Zin = Rin. Derived via virtual ground V-=0V.',
              bulletPoints: [
                'Virtual ground node at V-',
                'Negative sign indicates 180° phase flip',
              ],
            },
            practiceProblems: [
              {
                id: 'p-inv-1',
                problem: 'Design an Inverting Amplifier with a voltage gain of -10 and input resistance Rin = 10 kΩ. Find Rf.',
                solutionSteps: [
                  'Step 1: Formula Av = - Rf / Rin.',
                  'Step 2: Substitute values: -10 = - Rf / 10 kΩ.',
                  'Step 3: Rf = 10 × 10 kΩ = 100 kΩ.',
                ],
                finalAnswer: 'Feedback Resistor Rf = 100 kΩ',
              },
            ],
            animatedSummary: {
              concept: 'Inverting amp uses virtual ground to set Av = -Rf/Rin with 180° phase flip.',
              rule: 'Av = -Rf/Rin, Zin = Rin.',
              example: 'Rin = 10kΩ and Rf = 100kΩ yields Av = -10.',
              examTip: 'Show all KCL derivation steps for 8-mark gain derivation questions!',
            },
            microQuiz: [
              {
                id: 'q-inv-1',
                question: 'What is the voltage gain of an Inverting Amplifier with Rin = 2 kΩ and Rf = 20 kΩ?',
                options: ['+10', '-10', '+11', '-11'],
                correctAnswer: 1,
                explanation: 'Av = - Rf / Rin = - 20 kΩ / 2 kΩ = -10.',
              },
            ],
          },
          {
            id: 'topic-ae-2-3-2',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-3',
            title: 'Non-Inverting Closed Loop Amplifier Configuration & Voltage Follower (Buffer)',
            description: 'Circuit diagrams, voltage divider derivation of Av = 1 + Rf/R1, 0° phase shift, near-infinite input impedance, and Voltage Follower unity-gain buffer (Av = 1).',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Core Circuit ⭐',
            conceptSummary: '1) Non-Inverting Amplifier: Input Vin applied directly to non-inverting (+) terminal. Feedback divider (Rf, R1) connected to inverting (-) terminal. By Virtual Short principle: V- = V+ = Vin. Voltage divider at node V-: V- = Vout × [R1 / (R1 + Rf)]. Equating V- = Vin yields Vout = (1 + Rf/R1) Vin (0° phase shift, Zin ≈ ∞). 2) Voltage Follower: Short circuit feedback (Rf = 0, R1 = ∞) ⟹ Vout = Vin (Av = 1, high Rin, low Rout).',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-inverting-noninverting',
            diagramSteps: [
              { label: 'Virtual Short V- = Vin', description: 'Input Vin applied to V+ ⟹ V- held at Vin via Virtual Short principle.', subtext: 'Zero current enters V+ terminal (Zin ≈ ∞)' },
              { label: 'Feedback Voltage Divider', description: 'V- = Vout × [R1 / (R1 + Rf)].', subtext: 'Potential divider at inverting node' },
              { label: 'Gain Derivation', description: 'Vin = Vout × [R1 / (R1 + Rf)] ⟹ Vout = [ (R1 + Rf) / R1 ] Vin = (1 + Rf/R1) Vin.', subtext: 'Av = 1 + Rf / R1 (0° Phase Shift)' },
              { label: 'Voltage Follower (Unity Buffer)', description: 'Rf = 0Ω, R1 = ∞ ⟹ Vout = Vin. Av = 1. Used for impedance buffering.', subtext: 'High Rin, Low Rout' },
            ],
            stepByStepExamples: [
              {
                title: 'Non-Inverting Gain Derivation',
                initialValue: 'Non-Inverting circuit with Vin at V+, divider R1 & Rf at V-',
                steps: [
                  { stepNum: 1, calculation: 'Virtual Short: V- = V+ = Vin', note: 'Potential at inverting node' },
                  { stepNum: 2, calculation: 'Voltage divider: V- = Vout × [R1 / (R1 + Rf)]', note: 'Potential divider' },
                  { stepNum: 3, calculation: 'Vin = Vout × [R1 / (R1 + Rf)]', note: 'Equating voltages' },
                  { stepNum: 4, calculation: 'Vout = Vin × [(R1 + Rf) / R1] = Vin × [1 + (Rf / R1)]', note: 'Final equation' },
                ],
                answer: 'Av = 1 + (Rf / R1)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Non-Inverting & Buffer Formulas',
                content: 'Non-Inverting Gain: Av = 1 + (Rf / R1) (0° Phase Shift, Zin ≈ ∞)\nVoltage Follower: Av = 1 (Buffer, Rf = 0, R1 = ∞)',
                mnemonics: ['Non-Inverting = 1 PLUS Rf / R1', 'Voltage Follower = Unity Gain (1)'],
              },
            ],
            realLifeExamples: [
              { title: 'High-Impedance Sensor Interface', description: 'Non-inverting amplifier or voltage follower buffering glass pH electrode sensors.', icon: '🧪' },
            ],
            flashcards: [
              { id: 'fc-non-1', front: 'Formula for voltage gain of a Non-Inverting Amplifier?', back: 'Av = 1 + (Rf / R1).' },
              { id: 'fc-non-2', front: 'What is the voltage gain and phase shift of a Voltage Follower?', back: 'Voltage Gain Av = 1 (Unity), Phase Shift = 0 degrees.' },
            ],
            importantExamPoints: {
              definitions: [
                'Non-Inverting Amplifier: A closed-loop configuration where input is applied to the non-inverting terminal, yielding an amplified in-phase output.',
                'Voltage Follower: A unity-gain non-inverting buffer circuit (Av = 1) providing high input impedance and low output impedance.',
              ],
              formulas: [
                'Non-Inverting Gain: Av = 1 + (Rf / R1)',
                'Voltage Follower Gain: Av = 1',
              ],
              theoremsRules: [
                'Rule 1: Non-inverting gain is ALWAYS greater than or equal to 1.',
              ],
              expectedQuestions: [
                'Draw a Non-Inverting Amplifier circuit and derive Av = 1 + Rf/R1. What is a Voltage Follower? [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Forgetting the "+1" term in the Non-Inverting Gain formula.',
                correct: 'Non-inverting gain is 1 + (Rf/R1), NOT Rf/R1!',
                explanation: 'The voltage divider relation adds unity to the feedback ratio.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Non-Inverting: Av = 1+Rf/R1 (0° shift, Zin ≈ ∞). Voltage Follower: Av = 1 buffer.',
              bulletPoints: [
                'Input connected directly to V+ terminal',
                'Near infinite input impedance',
              ],
            },
            practiceProblems: [
              {
                id: 'p-non-1',
                problem: 'Design a Non-Inverting Amplifier with a gain of +11 using R1 = 5 kΩ. Find Rf.',
                solutionSteps: [
                  'Step 1: Formula Av = 1 + (Rf / R1).',
                  'Step 2: 11 = 1 + (Rf / 5 kΩ) ⟹ Rf / 5 kΩ = 10.',
                  'Step 3: Rf = 10 × 5 kΩ = 50 kΩ.',
                ],
                finalAnswer: 'Feedback Resistor Rf = 50 kΩ',
              },
            ],
            animatedSummary: {
              concept: 'Non-inverting configuration yields in-phase gain Av = 1+Rf/R1 with near-infinite input impedance.',
              rule: 'Av = 1 + Rf/R1. Buffer Av = 1.',
              example: 'R1 = 5kΩ and Rf = 50kΩ gives Av = +11.',
              examTip: 'Draw voltage follower as direct short from Vout to V- for 4-mark buffer questions!',
            },
            microQuiz: [
              {
                id: 'q-non-1',
                question: 'What is the voltage gain of a Non-Inverting Amplifier with R1 = 2 kΩ and Rf = 20 kΩ?',
                options: ['+10', '-10', '+11', '-11'],
                correctAnswer: 2,
                explanation: 'Av = 1 + (Rf / R1) = 1 + (20 kΩ / 2 kΩ) = 1 + 10 = +11.',
              },
            ],
          },
        ],
      },

      {
        id: 'ae-chap-2-4',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-2',
        title: '2.4 Basic Mathematical Applications',
        subtitle: 'Adder (Summing Amp), Subtractor (Difference Amp), Integrator & Differentiator Circuits',
        topics: [
          {
            id: 'topic-ae-2-4-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-4',
            title: 'Op-Amp Adder (Summing Amplifier) & Averaging Circuit',
            description: 'Circuit diagram, KCL node derivation, scaling adder, and design of Averaging Circuit (Rf = R/N).',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Math Circuits ⭐',
            conceptSummary: 'An Inverting Summing Amplifier (Adder) connects multiple inputs (V1, V2, V3) through resistors (R1, R2, R3) to virtual ground node V-. By KCL: I1 + I2 + I3 = If ⟹ Vout = - Rf [(V1/R1) + (V2/R2) + (V3/R3)]. If R1=R2=R3=R, Vout = -(Rf/R)(V1+V2+V3). If Rf = R/N, it acts as an Averaging Circuit computing the exact arithmetic mean.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-adder-subtractor',
            diagramSteps: [
              { label: 'Virtual Ground Node V-', description: 'Inputs V1, V2, V3 connect to V- node. Virtual ground keeps inputs isolated from each other.', subtext: 'Vout = - Rf [ (V1/R1) + (V2/R2) + (V3/R3) ]' },
              { label: 'Summing Amplifier (R1=R2=R3=R)', description: 'Vout = - (Rf / R) × (V1 + V2 + V3). Scales sum of input voltages.', subtext: 'Equal weighting sum' },
              { label: 'Averaging Circuit (Rf = R / N)', description: 'For N inputs, setting Rf = R / N gives Vout = - (V1 + V2 + ... + VN) / N.', subtext: 'Computes exact arithmetic mean' },
            ],
            stepByStepExamples: [
              {
                title: 'Derivation of Inverting Summing Amplifier Output Voltage Equation',
                initialValue: 'Three inputs V1, V2, V3 with input resistors R1, R2, R3 and feedback Rf',
                steps: [
                  { stepNum: 1, calculation: 'By Virtual Ground concept, V- = 0V.', note: 'Inverting terminal at 0V' },
                  { stepNum: 2, calculation: 'Input currents: I1 = V1 / R1, I2 = V2 / R2, I3 = V3 / R3.', note: 'Currents in input branches' },
                  { stepNum: 3, calculation: 'Total input current: Iin = I1 + I2 + I3 = (V1/R1) + (V2/R2) + (V3/R3).', note: 'KCL at node V-' },
                  { stepNum: 4, calculation: 'Feedback current: If = (0 - Vout) / Rf = - Vout / Rf.', note: 'Current through feedback Rf' },
                  { stepNum: 5, calculation: 'Equating Iin = If: (V1/R1) + (V2/R2) + (V3/R3) = - Vout / Rf.', note: 'Equating input & feedback currents' },
                  { stepNum: 6, calculation: 'Vout = - Rf [ (V1/R1) + (V2/R2) + (V3/R3) ].', note: 'Final Adder Equation' },
                ],
                answer: 'Vout = - Rf [ (V1 / R1) + (V2 / R2) + (V3 / R3) ]',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Adder & Averager Formulas',
                content: 'Inverting Adder: Vout = - Rf [ (V1/R1) + (V2/R2) + (V3/R3) ]\nSumming (R1=R2=R3=R): Vout = - (Rf/R) (V1 + V2 + V3)\nAverager (Rf = R/N): Vout = - (V1 + V2 + V3) / 3',
                mnemonics: ['Adder = Sum of (Vi / Ri) × (-Rf)'],
              },
            ],
            realLifeExamples: [
              { title: 'Audio Sound Console Mixer', description: 'Summing amplifier combining multi-channel microphone signals into a single audio master output.', icon: '🎛️' },
            ],
            flashcards: [
              { id: 'fc-add-1', front: 'Formula for output voltage of a 3-input Inverting Summing Amplifier?', back: 'Vout = - Rf [ (V1/R1) + (V2/R2) + (V3/R3) ].' },
            ],
            importantExamPoints: {
              definitions: [
                'Summing Amplifier (Adder): An op-amp circuit whose output voltage is proportional to the algebraic sum of two or more input voltages.',
              ],
              formulas: [
                'Adder: Vout = - Rf [ (V1/R1) + (V2/R2) + (V3/R3) ]',
                'Averager: Vout = - (V1 + V2 + ... + VN) / N',
              ],
              theoremsRules: [
                'Rule 1: Virtual ground prevents interaction (crosstalk) between input voltage channels in an adder.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of an Inverting Summing Amplifier with 3 inputs and derive its output voltage equation. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Forgetting the negative sign in the Inverting Adder equation.',
                correct: 'Inverting adder output MUST have a leading negative sign: Vout = - Rf [...].',
                explanation: 'Signals enter the inverting (-) terminal.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Adder: Vout = -Rf ∑(Vi/Ri). Averager: Rf = R/N.',
              bulletPoints: [
                'Virtual ground node isolates input channels',
                'Used extensively in audio mixers',
              ],
            },
            practiceProblems: [
              {
                id: 'p-add-1',
                problem: 'An inverting adder has R1 = 10kΩ, R2 = 20kΩ, R3 = 50kΩ, and Rf = 100kΩ. If V1 = +1V, V2 = -2V, V3 = +0.5V, find Vout.',
                solutionSteps: [
                  'Step 1: Formula Vout = - Rf [ (V1/R1) + (V2/R2) + (V3/R3) ].',
                  'Step 2: V1/R1 = 1V/10k = 0.1mA.',
                  'Step 3: V2/R2 = -2V/20k = -0.1mA.',
                  'Step 4: V3/R3 = 0.5V/50k = 0.01mA.',
                  'Step 5: Total sum = 0.1 - 0.1 + 0.01 = 0.01mA.',
                  'Step 6: Vout = - 100kΩ × (0.01mA) = - 1.0V.',
                ],
                finalAnswer: 'Vout = - 1.0 V',
              },
            ],
            animatedSummary: {
              concept: 'Summing amplifiers combine inputs using virtual ground KCL.',
              rule: 'Adder: Vout = -Rf ∑(Vi/Ri).',
              example: 'V1=+1V, V2=-2V, V3=+0.5V into 100k feedback adder gives Vout = -1.0V.',
              examTip: 'Show all KCL current node equations clearly for 8-mark derivation questions!',
            },
            microQuiz: [
              {
                id: 'q-add-1',
                question: 'If R1 = R2 = R3 = 30 kΩ and Rf = 10 kΩ in an inverting adder, what is the output Vout for inputs V1, V2, V3?',
                options: ['- (V1 + V2 + V3)', '- 3 (V1 + V2 + V3)', '- (V1 + V2 + V3) / 3', '+ (V1 + V2 + V3) / 3'],
                correctAnswer: 2,
                explanation: 'Vout = - (10k / 30k) (V1 + V2 + V3) = - (V1 + V2 + V3) / 3 (Averaging circuit).',
              },
            ],
          },
          {
            id: 'topic-ae-2-4-2',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-4',
            title: 'Op-Amp Subtractor (Difference Amplifier)',
            description: 'Circuit diagram, balanced resistor bridge derivation (Vout = [Rf/R1] [V2 - V1]), common-mode rejection, and design procedure.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Math Circuits ⭐',
            conceptSummary: 'A Subtractor (Difference Amplifier) amplifies the difference between two input voltages (V2 - V1). V1 is connected to the inverting input via R1; V2 is connected to the non-inverting input via R2 with potential divider R3-R4 to Ground. When resistor ratios are balanced ($\frac{R_f}{R_1} = \frac{R_4}{R_2}$), the output equation simplifies to: $V_{out} = \left(\frac{R_f}{R_1}\right) (V_2 - V_1)$.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-adder-subtractor',
            diagramSteps: [
              { label: 'Inverting Input Path (V1)', description: 'V1 connects to V- via R1. Feedback Rf connects Vout to V-.', subtext: 'Inverting gain contribution = - (Rf / R1) V1' },
              { label: 'Non-Inverting Input Path (V2)', description: 'V2 connects to V+ via potential divider R2-R4. V+ = V2 × [R4 / (R2 + R4)].', subtext: 'Non-inverting contribution = V+ × (1 + Rf/R1)' },
              { label: 'Matched Bridge Derivation', description: 'When R1=R2 and R3=R4=Rf: Vout = (Rf / R1) × (V2 - V1).', subtext: 'Rejects common mode DC voltage' },
            ],
            stepByStepExamples: [
              {
                title: 'Subtractor Design Example',
                initialValue: 'Design Subtractor with Vout = 5 (V2 - V1) using R1 = 10 kΩ',
                steps: [
                  { stepNum: 1, calculation: 'Formula: Vout = (Rf / R1) × (V2 - V1)', note: 'Differential gain = 5' },
                  { stepNum: 2, calculation: 'Rf / R1 = 5 ⟹ Rf = 5 × 10 kΩ = 50 kΩ', note: 'Feedback resistor' },
                  { stepNum: 3, calculation: 'Set R2 = R1 = 10 kΩ, and R4 = Rf = 50 kΩ', note: 'Balanced bridge' },
                ],
                answer: 'R1 = R2 = 10 kΩ, Rf = R4 = 50 kΩ',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Subtractor Formula',
                content: 'Vout = (Rf / R1) × (V2 - V1)\nCondition for balance: R1 = R2 and R4 = Rf',
                mnemonics: ['Subtractor = Gain × (V2 - V1)'],
              },
            ],
            realLifeExamples: [
              { title: 'Bridge Sensor Measurement', description: 'Difference amplifier extracting strain gauge bridge signals.', icon: '⚖️' },
            ],
            flashcards: [
              { id: 'fc-sub-1', front: 'Formula for output voltage of a Subtractor circuit when R1=R2 and R4=Rf?', back: 'Vout = (Rf / R1) × (V2 - V1).' },
            ],
            importantExamPoints: {
              definitions: [
                'Difference Amplifier (Subtractor): An op-amp circuit that amplifies the difference between two input voltages while rejecting common-mode signals.',
              ],
              formulas: [
                'Subtractor: Vout = (Rf / R1) (V2 - V1)',
              ],
              theoremsRules: [
                'Rule 1: Equal resistor ratios (R1=R2 and R4=Rf) ensure maximum Common Mode Rejection.',
              ],
              expectedQuestions: [
                'Design a Subtractor circuit to give Vout = 3 (V2 - V1). Show resistor values. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Reversing input polarities V1 and V2 in the subtractor formula.',
                correct: 'V2 is at NON-INVERTING (+) terminal; V1 is at INVERTING (-) terminal: Vout = (Rf/R1)(V2 - V1).',
                explanation: 'Non-inverting input V2 gives positive contribution; inverting V1 gives negative contribution.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Subtractor: Vout = (Rf/R1)(V2 - V1). Requires balanced bridge R1=R2, R4=Rf.',
              bulletPoints: [
                'V2 connects to +, V1 connects to -',
                'Used in bridge sensor amplification',
              ],
            },
            practiceProblems: [
              {
                id: 'p-sub-1',
                problem: 'A subtractor has R1 = R2 = 10kΩ and Rf = R4 = 100kΩ. If V1 = 2.0V and V2 = 2.5V, find Vout.',
                solutionSteps: [
                  'Step 1: Formula Vout = (Rf / R1) × (V2 - V1).',
                  'Step 2: Vout = (100k / 10k) × (2.5V - 2.0V) = 10 × 0.5V = 5.0 V.',
                ],
                finalAnswer: 'Vout = 5.0 V',
              },
            ],
            animatedSummary: {
              concept: 'Subtractors amplify input voltage differences V2 - V1.',
              rule: 'Vout = (Rf/R1)(V2 - V1).',
              example: 'V1=2.0V, V2=2.5V with gain 10 yields Vout = 5.0V.',
              examTip: 'Specify balanced resistor values R1=R2 and R4=Rf in design questions!',
            },
            microQuiz: [
              {
                id: 'q-sub-1',
                question: 'In a Subtractor circuit with gain of 5, if V1 = 3V and V2 = 4V, what is Vout?',
                options: ['-5 V', '+5 V', '+1V', '+35 V'],
                correctAnswer: 1,
                explanation: 'Vout = 5 × (4V - 3V) = 5 × 1V = +5 V.',
              },
            ],
          },
          {
            id: 'topic-ae-2-4-3',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-4',
            title: 'Op-Amp Integrator Circuit (Lossy Integrator, Waveforms)',
            description: 'Circuit diagram, calculus derivation of vout = -1/(R1Cf) ∫ vin dt, practical Lossy Integrator resistor Rf, and waveform conversions (Square to Triangular).',
            estimatedTime: '20 mins',
            difficulty: 'Hard',
            badge: 'Core Derivation ⭐',
            conceptSummary: 'An Op-Amp Integrator uses a feedback capacitor Cf and an input resistor R1. Output is proportional to the time integral of input voltage: vout(t) = - 1/(R1 Cf) ∫ vin(t) dt. Pure integrators saturate at DC (frequency = 0); therefore, a high-value resistor Rf is connected in parallel across Cf to limit DC gain (Lossy Integrator). Converted Waveforms: Square Wave In ➔ Triangular Wave Out; Step In ➔ Ramp Out.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-integrator-differentiator',
            diagramSteps: [
              { label: 'Op-Amp Integrator Circuit', description: 'Input resistor R1, feedback capacitor Cf across op-amp. iin = vin / R1, if = - Cf (dvout/dt).', subtext: 'vout(t) = - 1/(R1 Cf) ∫ vin(τ) dτ' },
              { label: 'Lossy Integrator (Parallel Rf)', description: 'Resistor Rf in parallel with Cf limits DC gain to -Rf/R1, preventing DC saturation.', subtext: 'Operates as integrator for f > fa = 1/(2π Rf Cf)' },
              { label: 'Waveform Conversion', description: 'Square Wave input produces a symmetrical Triangular wave output! Step input produces a linear Ramp.', subtext: '90° phase lag for sine wave input' },
            ],
            stepByStepExamples: [
              {
                title: 'Derivation of Op-Amp Integrator Output Voltage Equation',
                initialValue: 'Inverting integrator with input R1, feedback capacitor Cf, V+ = 0V',
                steps: [
                  { stepNum: 1, calculation: 'By Virtual Ground concept, V- = 0V.', note: 'Virtual ground node' },
                  { stepNum: 2, calculation: 'Input current: iin(t) = vin(t) / R1.', note: 'Current through input resistor' },
                  { stepNum: 3, calculation: 'Capacitor charge equation: q(t) = Cf × [V- - vout(t)] = - Cf vout(t).', note: 'Capacitor charge' },
                  { stepNum: 4, calculation: 'Feedback current: if(t) = dq/dt = - Cf (dvout(t) / dt).', note: 'Capacitor current' },
                  { stepNum: 5, calculation: 'By KCL: iin(t) = if(t) ⟹ vin(t) / R1 = - Cf (dvout(t) / dt).', note: 'Equating currents' },
                  { stepNum: 6, calculation: 'dvout(t) = - [1 / (R1 Cf)] vin(t) dt.', note: 'Differential equation' },
                  { stepNum: 7, calculation: 'Integrating both sides: vout(t) = - [1 / (R1 Cf)] ∫₀ᵗ vin(τ) dτ + vout(0).', note: 'Final Integrator Equation' },
                ],
                answer: 'vout(t) = - [1 / (R1 Cf)] ∫₀ᵗ vin(τ) dτ + vout(0)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Integrator Summary',
                content: 'Capacitor Cf in FEEDBACK\nSquare Wave In ➔ Triangular Wave Out\nStep Input In ➔ Ramp Output\nLossy Integrator: Add parallel Rf across Cf to stop DC saturation!',
                mnemonics: ['C in Feedback = Integrator', 'Square ➔ Triangle'],
              },
            ],
            realLifeExamples: [
              { title: 'Analog Function Generators', description: 'Generating triangular and sawtooth timing ramps in oscilloscope sweep circuits.', icon: '📈' },
            ],
            flashcards: [
              { id: 'fc-int-1', front: 'Formula for output voltage of an Op-Amp Integrator?', back: 'vout(t) = - [1 / (R1 Cf)] ∫ vin(t) dt + vout(0).' },
              { id: 'fc-int-2', front: 'Why is a high-value resistor Rf added in parallel with Cf in a practical Integrator?', back: 'To limit DC voltage gain (Rf/R1) and prevent low-frequency/offset drift from saturating the op-amp.' },
            ],
            importantExamPoints: {
              definitions: [
                'Op-Amp Integrator: A circuit whose output voltage is proportional to the time integral of its input voltage.',
                'Lossy Integrator: A practical integrator circuit with a parallel feedback resistor Rf to limit DC gain.',
              ],
              formulas: [
                'Integrator Output: vout(t) = - [1 / (R1 Cf)] ∫ vin(t) dt',
                'Cutoff Frequency: fa = 1 / (2π Rf Cf)',
              ],
              theoremsRules: [
                'Rule 1: Pure integrators saturate at DC because 1/(jωC) ➔ ∞ as frequency ➔ 0.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of an Op-Amp Integrator. Derive its output voltage equation. Sketch input square wave and output triangular wave. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Omitting parallel resistor Rf in practical integrator schematics.',
                correct: 'Without Rf, input offset voltage Vio accumulates on Cf and drives output into saturation!',
                explanation: 'Rf limits DC gain to -Rf/R1.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Integrator: C in feedback, vout = -1/(R1Cf)∫vin dt (Square ➔ Triangle). Parallel Rf stops DC saturation.',
              bulletPoints: [
                'Lossy integrator uses Rf parallel to Cf',
                '90° phase lag for sine wave input',
              ],
            },
            practiceProblems: [
              {
                id: 'p-int-1',
                problem: 'An integrator has R1 = 100 kΩ and Cf = 0.1 μF. A step voltage of vin = +2V is applied at t = 0. Calculate vout at t = 10 ms.',
                solutionSteps: [
                  'Step 1: Time constant τ = R1 × Cf = 100kΩ × 0.1μF = 105 × 10⁻7 = 0.01 s = 10 ms.',
                  'Step 2: Formula vout(t) = - [1 / τ] ∫₀ᵗ vin dt = - [1 / 0.01] × vin × t.',
                  'Step 3: At t = 10 ms = 0.01 s: vout = - (1 / 0.01) × (2V) × (0.01s) = - 2.0 V.',
                ],
                finalAnswer: 'vout at t=10ms is - 2.0 V (Ramp voltage)',
              },
            ],
            animatedSummary: {
              concept: 'Integrators produce time-accumulated outputs (Square ➔ Triangle).',
              rule: 'vout = -1/(R1Cf)∫vin dt.',
              example: 'A 2V step into 100kΩ/0.1μF integrator ramps down linearly to -2V in 10ms.',
              examTip: 'Draw both circuit schematic and input/output waveform pairs for 8-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-int-1',
                question: 'Where is the capacitor located in an Op-Amp Integrator circuit?',
                options: ['In the input branch', 'In the feedback branch', 'Across the power supply', 'In series with non-inverting input'],
                correctAnswer: 1,
                explanation: 'An integrator has the capacitor in the feedback path across the op-amp.',
              },
            ],
          },
          {
            id: 'topic-ae-2-4-4',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-4',
            title: 'Op-Amp Differentiator Circuit (Noise Filter, Waveforms)',
            description: 'Circuit diagram, calculus derivation of vout = -RfC1 (dvin/dt), practical Noise Compensation resistor R1, and waveform conversions (Triangular to Square).',
            estimatedTime: '20 mins',
            difficulty: 'Hard',
            badge: 'Core Derivation ⭐',
            conceptSummary: 'An Op-Amp Differentiator uses an input capacitor C1 and a feedback resistor Rf. Output is proportional to the rate of change (derivative) of input voltage: vout(t) = - Rf C1 (dvin/dt). Pure differentiators amplify high-frequency noise because capacitive reactance decreases with frequency (ZC = 1/jωC). A series resistor R1 is added in input path to limit high-frequency noise gain (Practical Differentiator). Converted Waveforms: Triangular Wave In ➔ Square Wave Out.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'opamp-integrator-differentiator',
            diagramSteps: [
              { label: 'Op-Amp Differentiator Circuit', description: 'Input capacitor C1, feedback resistor Rf across op-amp. iin = C1 (dvin/dt), if = - vout / Rf.', subtext: 'vout(t) = - Rf C1 (dvin/dt)' },
              { label: 'Noise Filter (Series R1)', description: 'Resistor R1 in series with C1 limits high-frequency noise gain to -Rf/R1.', subtext: 'Prevents high frequency noise instability' },
              { label: 'Waveform Conversion', description: 'Triangular wave input produces a Square wave output! Ramp input produces constant DC level.', subtext: '90° phase lead for sine wave input' },
            ],
            stepByStepExamples: [
              {
                title: 'Derivation of Op-Amp Differentiator Output Voltage Equation',
                initialValue: 'Inverting differentiator with input C1, feedback resistor Rf, V+ = 0V',
                steps: [
                  { stepNum: 1, calculation: 'By Virtual Ground concept, V- = 0V.', note: 'Virtual ground node' },
                  { stepNum: 2, calculation: 'Input current: iin(t) = C1 (dvin(t) / dt).', note: 'Capacitor input current' },
                  { stepNum: 3, calculation: 'Feedback current: if(t) = (0 - vout(t)) / Rf = - vout(t) / Rf.', note: 'Resistor feedback current' },
                  { stepNum: 4, calculation: 'By KCL: iin(t) = if(t) ⟹ C1 (dvin(t) / dt) = - vout(t) / Rf.', note: 'Equating currents' },
                  { stepNum: 5, calculation: 'vout(t) = - Rf C1 (dvin(t) / dt).', note: 'Final Differentiator Equation' },
                ],
                answer: 'vout(t) = - Rf C1 (dvin(t) / dt)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Differentiator Summary',
                content: 'Capacitor C1 in INPUT\nTriangular Wave In ➔ Square Wave Out\nRamp Input In ➔ Constant DC Output\nNoise Filter: Add series R1 with C1 to suppress high-frequency noise!',
                mnemonics: ['C in Input = Differentiator', 'Triangle ➔ Square'],
              },
            ],
            realLifeExamples: [
              { title: 'Rate-of-Rise Detectors', description: 'Detecting sudden slope changes in seismic vibration sensors.', icon: '📉' },
            ],
            flashcards: [
              { id: 'fc-diff-1', front: 'Formula for output voltage of an Op-Amp Differentiator?', back: 'vout(t) = - Rf C1 (dvin(t) / dt).' },
              { id: 'fc-diff-2', front: 'What is the output waveform of a Differentiator when a Triangular wave is applied?', back: 'A Square wave.' },
            ],
            importantExamPoints: {
              definitions: [
                'Op-Amp Differentiator: A circuit whose output voltage is proportional to the rate of change (derivative) of its input voltage.',
              ],
              formulas: [
                'Differentiator Output: vout(t) = - Rf C1 (dvin / dt)',
              ],
              theoremsRules: [
                'Rule 1: Pure differentiators amplify high-frequency noise because jωC ➔ ∞ as frequency ➔ ∞.',
              ],
              expectedQuestions: [
                'Draw an Op-Amp Differentiator circuit. Derive its output equation. Why is a series resistor R1 added in practice? [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Confusing Integrator and Differentiator capacitor locations.',
                correct: 'Capacitor in FEEDBACK = Integrator; Capacitor in INPUT = Differentiator.',
                explanation: 'Feedback C integrates current; Input C differentiates voltage.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Differentiator: C in input, vout = -RfC1(dvin/dt) (Triangle ➔ Square). Series R1 suppresses noise.',
              bulletPoints: [
                'C in input branch',
                'Practical differentiator uses R1 series with C1',
              ],
            },
            practiceProblems: [
              {
                id: 'p-diff-1',
                problem: 'A differentiator has Rf = 10 kΩ and C1 = 0.01 μF. If vin is a ramp voltage rising at 500 V/s, find vout.',
                solutionSteps: [
                  'Step 1: Formula vout = - Rf C1 (dvin / dt).',
                  'Step 2: dvin / dt = 500 V/s.',
                  'Step 3: vout = - (10,000 Ω) × (0.01 × 10⁻⁶ F) × (500 V/s) = - 104 × 10⁻8 × 500 = - 0.05 V = - 50 mV.',
                ],
                finalAnswer: 'vout = - 50 mV (Constant DC level)',
              },
            ],
            animatedSummary: {
              concept: 'Differentiators produce rate-of-change outputs (Triangle ➔ Square).',
              rule: 'vout = -RfC1(dvin/dt).',
              example: 'A 500V/s ramp into 10kΩ/0.01μF differentiator yields a constant -50mV output.',
              examTip: 'Draw both circuit schematic and input/output waveform pairs for 8-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-diff-1',
                question: 'When a triangular wave is applied to an Op-Amp Differentiator, the output waveform is a:',
                options: ['Sine wave', 'Cosine wave', 'Square wave', 'Sawtooth wave'],
                correctAnswer: 2,
                explanation: 'A differentiator converts constant-slope triangular ramps into constant step levels, producing a square wave.',
              },
            ],
          },
        ],
      },

      {
        id: 'ae-chap-2-5',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-2',
        title: '2.5 Special Purpose Converter Circuits',
        subtitle: 'Sample and Hold Circuit, Current-to-Voltage (I-V) & Voltage-to-Current (V-I) Converters',
        topics: [
          {
            id: 'topic-ae-2-5-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-5',
            title: 'Sample and Hold (S/H) Circuit',
            description: 'Circuit diagram (Input buffer A1, MOSFET switch S1, hold capacitor CH, output buffer A2), working operation in Sample vs Hold modes, and staircase output waveform.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Data Converter ⭐',
            conceptSummary: 'A Sample & Hold (S/H) Circuit captures the instantaneous voltage of a rapidly changing analog signal and holds its value constant while an Analog-to-Digital Converter (ADC) processes it. It consists of an input voltage follower buffer A1, a MOSFET electronic switch S1 driven by a sampling clock VG, a hold capacitor CH, and a FET-input high impedance output buffer A2. In Sample mode (VG HIGH), S1 closes and CH charges to Vin. In Hold mode (VG LOW), S1 opens and CH retains constant voltage.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'sample-and-hold',
            diagramSteps: [
              { label: 'Input Buffer A1', description: 'Voltage follower buffer presenting high input impedance to signal source Vin.', subtext: 'Prevents loading the input sensor' },
              { label: 'MOSFET Electronic Switch (S1)', description: 'Controlled by digital sampling clock pulse VG. Closes during Sample; opens during Hold.', subtext: 'Fast switching speed (<10ns)' },
              { label: 'Hold Capacitor (CH)', description: 'Stores sampled voltage during Hold mode: Q = CH × Vin.', subtext: 'Low dielectric absorption polypropylene capacitor' },
              { label: 'Output Buffer A2', description: 'FET-input voltage follower buffer presenting near-infinite input impedance (>10¹² Ω).', subtext: 'Prevents CH capacitor discharge droop' },
            ],
            memoryTricks: [
              {
                title: '💡 Sample & Hold Summary',
                content: 'Sample Mode (VG HIGH) ➔ Switch S1 CLOSED ➔ CH charges to Vin\nHold Mode (VG LOW) ➔ Switch S1 OPEN ➔ CH stores Vin constant for ADC\nOutput Buffer A2 = FET Op-Amp (Prevents capacitor discharge droop!)',
                mnemonics: ['S/H = Freeze Vin for ADC'],
              },
            ],
            realLifeExamples: [
              { title: 'ADC Microcontroller Front-End', description: 'Sample and hold circuit stabilizing rapidly changing sensor signals during analog-to-digital conversion.', icon: '💻' },
            ],
            flashcards: [
              { id: 'fc-sh-1', front: 'What is the purpose of a Sample and Hold circuit in data acquisition systems?', back: 'To sample a rapidly changing analog input voltage and hold it constant while an Analog-to-Digital Converter (ADC) processes it.' },
            ],
            importantExamPoints: {
              definitions: [
                'Sample and Hold Circuit: An electronic circuit that captures the voltage of an analog signal and holds its value at a constant level for a specified period.',
              ],
              formulas: [
                'Hold Capacitor Charge: Q = CH × Vin',
              ],
              theoremsRules: [
                'Rule 1: High input impedance buffer A2 prevents hold capacitor CH from discharging during Hold mode.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of a Sample and Hold circuit. Explain its operation in Sample and Hold modes with waveforms. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Using a low input impedance buffer as output buffer A2 in Sample and Hold circuit.',
                correct: 'Output buffer A2 MUST be a FET-input op-amp with near-infinite input impedance to avoid discharging CH!',
                explanation: 'Current drain discharges CH, creating droop error during hold mode.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'S/H freezes Vin on CH for ADC. Sample mode (S1 closed), Hold mode (S1 open). Output buffer A2 prevents droop.',
              bulletPoints: [
                'S/H uses MOSFET switch and high-impedance buffers',
                'Staircase output waveform',
              ],
            },
            practiceProblems: [
              {
                id: 'p-sh-1',
                problem: 'Explain the effect of capacitor droop rate in a Sample and Hold circuit for a 4-mark question.',
                solutionSteps: [
                  'Step 1: During Hold mode, small leakage current Ileak flows out of capacitor CH.',
                  'Step 2: Droop rate is given by dV/dt = Ileak / CH.',
                  'Step 3: High-impedance FET buffer A2 keeps Ileak picoamps small, maintaining constant voltage.',
                ],
                finalAnswer: 'Droop rate dV/dt = Ileak / CH (Minimized by FET buffer A2).',
              },
            ],
            animatedSummary: {
              concept: 'S/H circuits freeze rapidly changing analog signals on capacitor CH so ADCs can digitize accurately.',
              rule: 'Sample (switch ON) / Hold (switch OFF).',
              example: 'A 3.5V signal is captured in Sample mode and held at 3.500V constant during Hold mode.',
              examTip: 'Draw both S/H MOS switch schematic and staircase output waveform for 8-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-sh-1',
                question: 'In a Sample and Hold circuit, which mode occurs when the electronic MOSFET switch is closed?',
                options: ['Hold Mode', 'Sample Mode', 'Cutoff Mode', 'Reset Mode'],
                correctAnswer: 1,
                explanation: 'When the switch is closed, the circuit is in Sample Mode tracking input voltage Vin.',
              },
            ],
          },
          {
            id: 'topic-ae-2-5-2',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-5',
            title: 'Current-to-Voltage (I-V) Converter (Transimpedance Amplifier)',
            description: 'Circuit diagram, virtual ground derivation of Vout = -Iin Rf, transimpedance gain, and photodiode readout application.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Transimpedance ⭐',
            conceptSummary: 'A Current-to-Voltage (I-V) Converter (Transimpedance Amplifier) converts an input current signal Iin into a proportional output voltage Vout. Input current Iin is fed directly into the virtual ground node V- (V- = 0V). Because op-amp input impedance is infinite, all input current flows through feedback resistor Rf: Vout = - Iin × Rf. Transimpedance Gain is equal to -Rf (expressed in Volts/Ampere or Ohms).',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'iv-vi-converters',
            diagramSteps: [
              { label: 'Virtual Ground Node V-', description: 'Input current Iin fed into virtual ground node V- (V- = 0V). Holds sensor terminal at constant 0V.', subtext: 'Prevents photodiode voltage loading' },
              { label: 'Feedback Current Path', description: 'Because Rin = ∞, input current Iin cannot enter op-amp, bypassing entirely into feedback Rf.', subtext: 'If = Iin' },
              { label: 'Transimpedance Equation', description: 'Vout = - Iin × Rf. Transimpedance gain = -Rf (V/A).', subtext: 'Linear current to voltage conversion' },
            ],
            stepByStepExamples: [
              {
                title: 'Calculation of I-V Converter Output Voltage',
                initialValue: 'Photodiode current Iin = 50 μA, Feedback resistor Rf = 100 kΩ',
                steps: [
                  { stepNum: 1, calculation: 'Formula: Vout = - Iin × Rf', note: 'Virtual ground node holds V- = 0V' },
                  { stepNum: 2, calculation: 'Vout = - (50 × 10⁻⁶ A) × (100 × 10³ Ω) = - 5.0 V', note: 'Transimpedance conversion' },
                ],
                answer: 'Vout = - 5.0 V (Converted from 50μA sensor current)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 I-V Converter Formula',
                content: 'Vout = - Iin × Rf\nTransimpedance Gain = -Rf (V/A)\nApplication: Photodiode Light Meter',
                mnemonics: ['I-V = Current to Voltage (Vout = -Iin Rf)'],
              },
            ],
            realLifeExamples: [
              { title: 'Optical Pulse Oximeter Sensor', description: 'I-V converter converting photodiode light current into measurable voltage.', icon: '🩺' },
            ],
            flashcards: [
              { id: 'fc-iv-1', front: 'Formula for output voltage of a Current-to-Voltage (I-V) converter?', back: 'Vout = - Iin × Rf.' },
            ],
            importantExamPoints: {
              definitions: [
                'Current-to-Voltage Converter (Transimpedance Amplifier): An op-amp circuit that converts input current into proportional output voltage.',
              ],
              formulas: [
                'I-V Converter: Vout = - Iin × Rf',
              ],
              theoremsRules: [
                'Rule 1: Virtual ground holds photodiode at 0V bias, maximizing linearity and speed.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of an I-V converter. Derive Vout = -Iin Rf. Calculate Vout for Iin = 20μA and Rf = 50kΩ. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Forgetting the negative sign in the I-V converter formula.',
                correct: 'I-V converter output is inverting: Vout = - Iin × Rf.',
                explanation: 'Current flows into the inverting (-) terminal.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'I-V converter: Vout = -Iin Rf. Virtual ground holds input at 0V. Used for photodiodes.',
              bulletPoints: [
                'Transimpedance gain = -Rf',
                'Input impedance seen by sensor = 0Ω (Virtual ground)',
              ],
            },
            practiceProblems: [
              {
                id: 'p-iv-1',
                problem: 'A photodiode produces 20 μA current. What feedback resistor Rf is needed to produce an output voltage of - 2.0 V?',
                solutionSteps: [
                  'Step 1: Formula Vout = - Iin × Rf.',
                  'Step 2: -2.0 V = - (20 × 10⁻⁶ A) × Rf.',
                  'Step 3: Rf = 2.0 / (20 × 10⁻⁶) = 100,000 Ω = 100 kΩ.',
                ],
                finalAnswer: 'Feedback Resistor Rf = 100 kΩ',
              },
            ],
            animatedSummary: {
              concept: 'I-V converters convert sensor microamp currents into measurable volts via virtual ground.',
              rule: 'Vout = - Iin × Rf.',
              example: 'A 20μA photodiode current into 100kΩ feedback resistor gives -2.0V output.',
              examTip: 'State transimpedance gain unit as Ohms or Volts/Ampere for extra marks!',
            },
            microQuiz: [
              {
                id: 'q-iv-1',
                question: 'What is the output voltage of an I-V converter if Iin = 10 μA and Rf = 200 kΩ?',
                options: ['+2 V', '-2 V', '-20 V', '+0.2 V'],
                correctAnswer: 1,
                explanation: 'Vout = - Iin × Rf = - (10 × 10⁻⁶) × (200 × 10³) = - 2.0 V.',
              },
            ],
          },
          {
            id: 'topic-ae-2-5-3',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-5',
            title: 'Voltage-to-Current (V-I) Converter (Transconductance Amplifier)',
            description: 'Circuit diagrams for Floating Load and Grounded Load (Howland Current Pump) V-I converters, derivation of IL = Vin/R1, and 4-20mA industrial current loop application.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Transconductance ⭐',
            conceptSummary: 'A Voltage-to-Current (V-I) Converter (Transconductance Amplifier) produces a load current IL proportional to an input voltage Vin, independent of load resistance RL: IL = Vin / R1. In Floating Load V-I converters, load RL is placed in the feedback path. In Grounded Load V-I converters (Howland Current Pump), positive and negative feedback networks allow one terminal of load RL to be connected directly to Ground.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'iv-vi-converters',
            diagramSteps: [
              { label: 'Floating Load V-I Converter', description: 'Load RL placed in feedback path across V- and Vout. IL = Vin / R1.', subtext: 'Load cannot be grounded' },
              { label: 'Grounded Load V-I Converter', description: 'Howland current pump configuration using differential feedback to drive grounded load RL.', subtext: 'IL = Vin / R1 independent of RL' },
              { label: '4-20mA Industrial Loop Application', description: 'Converts 0-5V sensor voltage into 4-20mA current loop for long-distance noise-immune industrial transmission.', subtext: 'Current signals do not drop over long wire resistance' },
            ],
            stepByStepExamples: [
              {
                title: 'V-I Converter Calculation Example',
                initialValue: 'V-I converter designed with R1 = 250 Ω, Vin = 2V, Load RL = 100 Ω',
                steps: [
                  { stepNum: 1, calculation: 'Formula: IL = Vin / R1', note: 'Independent of RL!' },
                  { stepNum: 2, calculation: 'IL = 2 V / 250 Ω = 0.008 A = 8 mA', note: 'Load current' },
                ],
                answer: 'Load Current IL = 8 mA (Constant current regardless of load RL)',
              },
            ],
            memoryTricks: [
              {
                title: '💡 V-I Converter Formula',
                content: 'Load Current IL = Vin / R1 (Independent of load RL!)\nTransconductance Gain = 1 / R1 (A/V)\nApplication: 4-20mA Industrial Transmitter',
                mnemonics: ['V-I = Voltage to Current (IL = Vin / R1)'],
              },
            ],
            realLifeExamples: [
              { title: '4-20mA Industrial Transmitter', description: 'Transmitting sensor signals over 1km factory cables without voltage drop errors.', icon: '🏭' },
            ],
            flashcards: [
              { id: 'fc-vi-1', front: 'Formula for load current of a Floating-Load Voltage-to-Current (V-I) converter?', back: 'IL = Vin / R1.' },
            ],
            importantExamPoints: {
              definitions: [
                'Voltage-to-Current Converter: An op-amp circuit that produces a load current proportional to an input voltage, independent of load resistance.',
                'Howland Current Pump: A grounded-load voltage-to-current converter circuit using positive and negative feedback.',
              ],
              formulas: [
                'V-I Converter Load Current: IL = Vin / R1',
              ],
              theoremsRules: [
                'Rule 1: Current loop signals (4-20mA) are immune to long wire resistance drops.',
              ],
              expectedQuestions: [
                'Explain V-I converter with circuit diagram and expression for floating and grounded loads. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Assuming load current IL changes when load resistance RL changes.',
                correct: 'IL depends ONLY on Vin and R1! It is completely INDEPENDENT of load resistance RL.',
                explanation: 'Op-amp adjusts Vout to force constant current IL through RL.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'V-I converter: IL = Vin/R1 (Independent of RL). Used for 4-20mA industrial sensor transmission.',
              bulletPoints: [
                'Floating load vs Grounded load (Howland current pump)',
                'Immune to cable resistance drops',
              ],
            },
            practiceProblems: [
              {
                id: 'p-vi-1',
                problem: 'Design a 4-20mA V-I transmitter where Vin = 0V to 5V maps to IL = 0 to 20mA. Find R1.',
                solutionSteps: [
                  'Step 1: Formula IL = Vin / R1 ⟹ R1 = Vin / IL.',
                  'Step 2: At max input Vin = 5V, IL = 20mA = 0.020A.',
                  'Step 3: R1 = 5V / 0.020A = 250 Ω.',
                ],
                finalAnswer: 'Resistor R1 = 250 Ω',
              },
            ],
            animatedSummary: {
              concept: 'V-I converters generate constant current IL = Vin/R1 for industrial 4-20mA loops.',
              rule: 'IL = Vin / R1 (Independent of RL).',
              example: 'Vin = 5V with R1 = 250Ω drives exactly 20mA through any cable load.',
              examTip: 'Emphasize that IL is independent of load RL for full exam credit!',
            },
            microQuiz: [
              {
                id: 'q-vi-1',
                question: 'What is the load current IL generated by a V-I converter with R1 = 500 Ω when Vin = 2.5 V?',
                options: ['2.5 mA', '5.0 mA', '10 mA', '20 mA'],
                correctAnswer: 1,
                explanation: 'IL = Vin / R1 = 2.5 V / 500 Ω = 0.005 A = 5.0 mA.',
              },
            ],
          },
        ],
      },

      {
        id: 'ae-chap-2-6',
        subjectId: 'analog-electronics',
        unitId: 'ae-unit-2',
        title: '2.6 Comparators & Non-Linear Signal Processing',
        subtitle: 'Basic Comparator, Zero Crossing Detector (Inverting & Non-Inverting), Schmitt Trigger, Window Detector & Peak Detector',
        topics: [
          {
            id: 'topic-ae-2-6-1',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-6',
            title: 'Op-Amp Comparator (Basic Open-Loop Inverting & Non-Inverting)',
            description: 'Operation of open-loop op-amp comparator, voltage transfer characteristics (Vout = ±Vsat), and non-inverting vs inverting comparator threshold switching.',
            estimatedTime: '15 mins',
            difficulty: 'Easy',
            badge: 'Core Comparator ⭐',
            conceptSummary: 'An Op-Amp Comparator compares an input signal Vin with a reference voltage Vref in open-loop mode without feedback. Because open-loop gain AVD is huge, the output saturates at +Vsat (+14V) when V+ > V-, and at -Vsat (-14V) when V+ < V-. Non-Inverting Comparator: Vin at V+, Vref at V- ⟹ Vout = +Vsat if Vin > Vref. Inverting Comparator: Vin at V-, Vref at V+ ⟹ Vout = -Vsat if Vin > Vref.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'comparator-zcd',
            diagramSteps: [
              { label: 'Open-Loop Comparator Principle', description: 'No feedback. Vout = +Vsat if V+ > V-; Vout = -Vsat if V+ < V-.', subtext: 'Extreme gain acts as 1-bit digital decision maker' },
              { label: 'Non-Inverting Comparator', description: 'Vin at V+, Vref at V-. If Vin > Vref ⟹ Vout = +Vsat; If Vin < Vref ⟹ Vout = -Vsat.', subtext: 'In-phase square wave output' },
              { label: 'Inverting Comparator', description: 'Vin at V-, Vref at V+. If Vin > Vref ⟹ Vout = -Vsat; If Vin < Vref ⟹ Vout = +Vsat.', subtext: 'Inverted output switching' },
            ],
            memoryTricks: [
              {
                title: '💡 Comparator Rule',
                content: 'Non-Inverting Comparator: Vin > Vref ⟹ Vout = +Vsat\nInverting Comparator: Vin > Vref ⟹ Vout = -Vsat',
                mnemonics: ['Non-Inverting = Vin > Vref ⟹ +Vsat', 'Inverting = Vin > Vref ⟹ -Vsat'],
              },
            ],
            realLifeExamples: [
              { title: 'Light Level Alarm', description: 'LDR voltage compared against reference threshold to turn ON night lights.', icon: '💡' },
            ],
            flashcards: [
              { id: 'fc-comp-1', front: 'What are the two output voltage levels of an open-loop op-amp comparator?', back: '+Vsat (typically +14V) and -Vsat (typically -14V).' },
            ],
            importantExamPoints: {
              definitions: [
                'Comparator: An open-loop op-amp circuit that compares two input voltages and outputs a binary HIGH (+Vsat) or LOW (-Vsat) state.',
              ],
              formulas: [
                'Non-Inverting Comparator: Vout = +Vsat (if Vin > Vref), -Vsat (if Vin < Vref)',
                'Inverting Comparator: Vout = -Vsat (if Vin > Vref), +Vsat (if Vin < Vref)',
              ],
              theoremsRules: [
                'Rule 1: Open loop comparators are sensitive to input noise around Vref, which can cause output chatter.',
              ],
              expectedQuestions: [
                'Explain open loop inverting and non-inverting comparators with circuit diagrams and transfer characteristics. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Assuming comparator output varies linearly with input voltage.',
                correct: 'A comparator is NON-LINEAR! Output ONLY flips between binary saturation limits +Vsat and -Vsat.',
                explanation: 'Open-loop gain is so high that output saturates instantly.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Comparator outputs ±Vsat based on V+ vs V-. Non-inverting: Vin > Vref ⟹ +Vsat.',
              bulletPoints: [
                'Non-Inverting: Vin > Vref ⟹ +Vsat',
                'Inverting: Vin > Vref ⟹ -Vsat',
              ],
            },
            practiceProblems: [
              {
                id: 'p-comp-1',
                problem: 'A non-inverting comparator has Vref = +2V and Vsat = ±14V. Find Vout for Vin = +1.5V and Vin = +2.5V.',
                solutionSteps: [
                  'Step 1: When Vin = +1.5V (< Vref = +2V): V+ < V- ⟹ Vout = -Vsat = -14V.',
                  'Step 2: When Vin = +2.5V (> Vref = +2V): V+ > V- ⟹ Vout = +Vsat = +14V.',
                ],
                finalAnswer: 'Vin=1.5V ⟹ Vout=-14V; Vin=2.5V ⟹ Vout=+14V.',
              },
            ],
            animatedSummary: {
              concept: 'Comparators output binary saturation levels (+Vsat or -Vsat) based on terminal voltage comparison.',
              rule: 'Vout = +Vsat (if V+ > V-) else -Vsat.',
              example: 'Vin = 2.5V vs Vref = 2.0V drives non-inverting output to +14V.',
              examTip: 'Draw vertical transfer characteristic line at Vref for 6-mark comparator questions!',
            },
            microQuiz: [
              {
                id: 'q-comp-1',
                question: 'What is the output voltage of a non-inverting comparator when Vin = 3V and Vref = 1V with Vsat = ±15V?',
                options: ['+15 V', '-15 V', '+2 V', '0 V'],
                correctAnswer: 0,
                explanation: 'Since Vin (3V) > Vref (1V), V+ > V-, so Vout = +Vsat = +15 V.',
              },
            ],
          },
          {
            id: 'topic-ae-2-6-2',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-6',
            title: 'Zero Crossing Detector - Inverting Type & Non-Inverting Type',
            description: 'Circuit diagrams, operation, and waveforms for Inverting ZCD and Non-Inverting ZCD converting sine waves into square waves at 0V crossings.',
            estimatedTime: '15 mins',
            difficulty: 'Easy',
            badge: 'Wave Shaping ⭐',
            conceptSummary: 'A Zero Crossing Detector (ZCD) is a comparator with reference voltage Vref = 0V (ground). 1) Inverting ZCD: Vin connected to inverting (-) input, V+ grounded (0V). When Vin > 0V ⟹ Vout = -Vsat; When Vin < 0V ⟹ Vout = +Vsat. Outputs an inverted square wave. 2) Non-Inverting ZCD: Vin connected to non-inverting (+) input, V- grounded (0V). When Vin > 0V ⟹ Vout = +Vsat; When Vin < 0V ⟹ Vout = -Vsat. Outputs an in-phase square wave.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'comparator-zcd',
            diagramSteps: [
              { label: 'ZCD Definition (Vref = 0V)', description: 'Special comparator where reference voltage Vref is set to 0V ground level.', subtext: 'Detects exact 0V AC crossings' },
              { label: 'Inverting ZCD Operation', description: 'Vin at V-, V+ tied to 0V. Positive half cycle (Vin > 0V) ⟹ Vout = -Vsat; Negative half cycle (Vin < 0V) ⟹ Vout = +Vsat.', subtext: 'Inverted square wave output' },
              { label: 'Non-Inverting ZCD Operation', description: 'Vin at V+, V- tied to 0V. Positive half cycle (Vin > 0V) ⟹ Vout = +Vsat; Negative half cycle (Vin < 0V) ⟹ Vout = -Vsat.', subtext: 'In-phase square wave output' },
              { label: 'Sine-to-Square Wave Conversion', description: 'Used in frequency meters, phase detectors, and digital clock shaping circuits.', subtext: 'Converts analog waves to digital pulses' },
            ],
            memoryTricks: [
              {
                title: '💡 ZCD Waveform Rules',
                content: 'ZCD = Comparator with Vref = 0V\nInverting ZCD: Positive half ➔ -Vsat, Negative half ➔ +Vsat\nNon-Inverting ZCD: Positive half ➔ +Vsat, Negative half ➔ -Vsat\nFunction: Converts Sine Wave to Square Wave!',
                mnemonics: ['ZCD = Sine to Square Converter at 0V'],
              },
            ],
            realLifeExamples: [
              { title: 'Digital Frequency Counter', description: 'ZCD converting input AC mains sine wave into square pulses for microcontrollers to count frequency.', icon: '⏱️' },
            ],
            flashcards: [
              { id: 'fc-zcd-1', front: 'What is a Zero Crossing Detector (ZCD)?', back: 'A comparator circuit with reference voltage Vref = 0V that switches output state whenever the input signal crosses zero volts.' },
              { id: 'fc-zcd-2', front: 'What output waveform does a ZCD produce when fed with a sinusoidal input?', back: 'A Square wave.' },
            ],
            importantExamPoints: {
              definitions: [
                'Zero Crossing Detector (ZCD): A comparator configured to detect when an AC signal crosses 0V ground level.',
              ],
              formulas: [
                'Inverting ZCD: Vout = -Vsat (if Vin > 0V), +Vsat (if Vin < 0V)',
                'Non-Inverting ZCD: Vout = +Vsat (if Vin > 0V), -Vsat (if Vin < 0V)',
              ],
              theoremsRules: [
                'Rule 1: ZCD outputs switch states at the exact zero-crossings of the AC input signal.',
              ],
              expectedQuestions: [
                'Explain Inverting and Non-Inverting Zero Crossing Detectors with circuit diagrams and waveforms. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Drawing the output of an Inverting ZCD as positive during positive half-cycle.',
                correct: 'Inverting ZCD output goes NEGATIVE (-Vsat) during positive half-cycle!',
                explanation: 'Input Vin is at the inverting (-) terminal.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'ZCD sets Vref=0V. Inverting ZCD: Vin>0V ⟹ -Vsat. Non-Inverting ZCD: Vin>0V ⟹ +Vsat. Converts sine to square wave.',
              bulletPoints: [
                'Reference voltage Vref = 0V',
                'Outputs square wave at fundamental frequency',
              ],
            },
            practiceProblems: [
              {
                id: 'p-zcd-1',
                problem: 'Draw the output waveform of an Inverting ZCD supplied with VCC = ±15V when a 5V peak sine wave is applied.',
                solutionSteps: [
                  'Step 1: Inverting ZCD has V+ = 0V, Vin connected to V-.',
                  'Step 2: During positive half cycle (Vin > 0V), V- > V+ ⟹ Vout = -Vsat = -14V.',
                  'Step 3: During negative half cycle (Vin < 0V), V- < V+ ⟹ Vout = +Vsat = +14V.',
                  'Step 4: Output is a 28V peak-to-peak (+14V to -14V) square wave in opposite phase to input sine wave.',
                ],
                finalAnswer: 'Square wave flipping between +14V and -14V at 0V crossings.',
              },
            ],
            animatedSummary: {
              concept: 'ZCDs set Vref=0V to transform sine waves into square waves.',
              rule: 'Inverting ZCD: Vin>0 ⟹ -Vsat. Non-inverting ZCD: Vin>0 ⟹ +Vsat.',
              example: 'A 5V 50Hz sine wave into inverting ZCD produces a 50Hz ±14V square wave.',
              examTip: 'Draw aligned input sine wave and output square wave graphs for 6-mark ZCD questions!',
            },
            microQuiz: [
              {
                id: 'q-zcd-1',
                question: 'What is the reference voltage Vref in a Zero Crossing Detector?',
                options: ['+5 V', '-5 V', '0 V (Ground)', '+VCC'],
                correctAnswer: 2,
                explanation: 'A Zero Crossing Detector sets Vref = 0V (ground).',
              },
            ],
          },
          {
            id: 'topic-ae-2-6-3',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-6',
            title: 'Schmitt Trigger (Hysteresis, Thresholds VUT, VLT, Hysteresis VH)',
            description: 'Circuit diagram of Inverting Schmitt Trigger with positive feedback, calculation of Upper (VUT) and Lower (VLT) threshold voltages, Hysteresis loop (VH = VUT - VLT), and noise immunity.',
            estimatedTime: '20 mins',
            difficulty: 'Hard',
            badge: 'Exam Favorite ⭐',
            conceptSummary: 'A Schmitt Trigger is a regenerative comparator using positive feedback (R1, R2 connected to V+) to eliminate output chatter caused by noisy input signals. It creates two distinct threshold voltages: Upper Threshold Voltage VUT = [R1 / (R1+R2)] (+Vsat), and Lower Threshold Voltage VLT = [R1 / (R1+R2)] (-Vsat). The difference VH = VUT - VLT is Hysteresis Voltage, providing total noise immunity.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'schmitt-trigger',
            diagramSteps: [
              { label: 'Positive Feedback Network', description: 'Resistor R2 feedback to non-inverting terminal V+ establishes threshold voltage.', subtext: 'V+ = [R1 / (R1 + R2)] × Vout' },
              { label: 'Upper Threshold Voltage (VUT)', description: 'When Vout = +Vsat, threshold is VUT = [R1 / (R1 + R2)] × (+Vsat).', subtext: 'Input Vin must rise above VUT to switch output LOW' },
              { label: 'Lower Threshold Voltage (VLT)', description: 'When Vout = -Vsat, threshold is VLT = [R1 / (R1 + R2)] × (-Vsat).', subtext: 'Input Vin must fall below VLT to switch output HIGH' },
              { label: 'Hysteresis Loop (VH = VUT - VLT)', description: 'Noise smaller than VH cannot cause false switching!', subtext: 'Provides total noise immunity' },
            ],
            stepByStepExamples: [
              {
                title: 'Calculation of VUT, VLT, and Hysteresis Voltage VH for Schmitt Trigger',
                initialValue: 'R1 = 10 kΩ, R2 = 90 kΩ, Supply VCC = ±15V (Vsat = ±14V)',
                steps: [
                  { stepNum: 1, calculation: 'Feedback fraction: β = R1 / (R1 + R2) = 10k / (10k + 90k) = 10 / 100 = 0.1', note: 'Positive feedback fraction' },
                  { stepNum: 2, calculation: 'VUT = β × (+Vsat) = 0.1 × (+14V) = + 1.4 V', note: 'Upper Threshold Voltage' },
                  { stepNum: 3, calculation: 'VLT = β × (-Vsat) = 0.1 × (-14V) = - 1.4 V', note: 'Lower Threshold Voltage' },
                  { stepNum: 4, calculation: 'Hysteresis Voltage VH = VUT - VLT = +1.4V - (-1.4V) = 2.8 V', note: 'Total Noise Immunity Width' },
                ],
                answer: 'VUT = +1.4V, VLT = -1.4V, Hysteresis Voltage VH = 2.8V',
              },
            ],
            memoryTricks: [
              {
                title: '💡 Schmitt Trigger Hysteresis Formula',
                content: 'β = R1 / (R1 + R2)\nVUT = β × (+Vsat)\nVLT = β × (-Vsat)\nHysteresis Voltage VH = VUT - VLT = 2 β Vsat',
                mnemonics: ['VUT = Positive Threshold', 'VLT = Negative Threshold', 'VH = VUT - VLT'],
              },
            ],
            realLifeExamples: [
              { title: 'Clean Digital Square Wave Generator', description: 'Cleans up noisy mechanical switch bounce or noisy sensor inputs in microcontrollers.', icon: '🧹' },
            ],
            flashcards: [
              { id: 'fc-st-1', front: 'What is a Schmitt Trigger?', back: 'A regenerative comparator circuit with positive feedback that exhibits hysteresis to eliminate output chatter from noisy inputs.' },
              { id: 'fc-st-2', front: 'Formulas for VUT and VLT of an inverting Schmitt Trigger?', back: 'VUT = [R1 / (R1+R2)] (+Vsat) and VLT = [R1 / (R1+R2)] (-Vsat).' },
            ],
            importantExamPoints: {
              definitions: [
                'Schmitt Trigger: A bi-stable comparator circuit utilizing positive feedback to create hysteresis for noise-immune switching.',
                'Hysteresis: The property where the input threshold voltage depends on whether the output is currently HIGH or LOW.',
              ],
              formulas: [
                'Feedback Ratio: β = R1 / (R1 + R2)',
                'Upper Threshold: VUT = β (+Vsat)',
                'Lower Threshold: VLT = β (-Vsat)',
                'Hysteresis Voltage: VH = VUT - VLT = 2 β Vsat',
              ],
              theoremsRules: [
                'Rule 1: Positive feedback MUST be connected to the non-inverting (+) terminal to create Schmitt Trigger hysteresis.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of an Inverting Schmitt Trigger. Derive expressions for VUT, VLT, and VH. Draw the hysteresis loop. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Connecting feedback resistor R2 to the inverting (-) terminal for a Schmitt Trigger.',
                correct: 'Negative feedback creates linear amplifiers! Positive feedback to (+) terminal creates Schmitt Trigger hysteresis!',
                explanation: 'Positive feedback provides the regenerative gain needed for bi-stable hysteresis.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Schmitt Trigger: Positive feedback, VUT=β(+Vsat), VLT=β(-Vsat), VH=VUT-VLT noise immunity.',
              bulletPoints: [
                'β = R1 / (R1 + R2)',
                'Eliminates output chatter from noisy inputs',
              ],
            },
            practiceProblems: [
              {
                id: 'p-st-1',
                problem: 'Design an inverting Schmitt Trigger with VUT = +2V and VLT = -2V using Vsat = ±10V and R1 = 10 kΩ. Find R2.',
                solutionSteps: [
                  'Step 1: Formula VUT = [R1 / (R1 + R2)] × Vsat.',
                  'Step 2: 2V = [10k / (10k + R2)] × 10V ⟹ 2 / 10 = 0.2 = 10k / (10k + R2).',
                  'Step 3: 10k + R2 = 10k / 0.2 = 50 kΩ.',
                  'Step 4: R2 = 50k - 10k = 40 kΩ.',
                ],
                finalAnswer: 'Feedback Resistor R2 = 40 kΩ',
              },
            ],
            animatedSummary: {
              concept: 'Schmitt Triggers add positive feedback hysteresis to turn noisy inputs into clean square waves.',
              rule: 'VUT = β(+Vsat), VLT = β(-Vsat), VH = VUT - VLT. β = R1/(R1+R2).',
              example: 'R1=10k, R2=40k with ±10V Vsat gives VUT=+2V, VLT=-2V, and VH=4V noise immunity.',
              examTip: 'Draw the rectangular Hysteresis Loop graph (Vout vs Vin) with arrows for 8-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-st-1',
                question: 'In a Schmitt Trigger with Vsat = ±12V, R1 = 1 kΩ, and R2 = 11 kΩ, what is the Upper Threshold Voltage VUT?',
                options: ['+1.0 V', '+2.0 V', '+6.0 V', '+12.0 V'],
                correctAnswer: 0,
                explanation: 'β = 1k / (1k + 11k) = 1/12. VUT = (1/12) × (+12V) = +1.0 V.',
              },
            ],
          },
          {
            id: 'topic-ae-2-6-4',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-6',
            title: 'Window Detector Circuit',
            description: 'Circuit diagram of Window Detector (Dual comparators A1 & A2, threshold reference voltages VUT & VLT, NOR gate output logic), working, and voltage window characteristics.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Dual Threshold ⭐',
            conceptSummary: 'A Window Detector (Dual Level Detector) determines whether an input voltage Vin falls inside or outside a specified voltage window bounded by an upper reference voltage VUT and a lower reference voltage VLT. It consists of two op-amp comparators: Comparator A1 (detects Vin > VUT) and Comparator A2 (detects Vin < VLT), connected to a NOR gate / wired-AND output stage. Output Vout is HIGH only when VLT < Vin < VUT.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'window-peak-detector',
            diagramSteps: [
              { label: 'Upper Comparator A1', description: 'Vin connected to V+, VUT connected to V-. Output A1 is HIGH if Vin > VUT.', subtext: 'Over-voltage detection' },
              { label: 'Lower Comparator A2', description: 'VLT connected to V+, Vin connected to V-. Output A2 is HIGH if Vin < VLT.', subtext: 'Under-voltage detection' },
              { label: 'Output Logic Stage (NOR Gate)', description: 'Outputs of A1 and A2 combined via NOR gate. Vout = HIGH only when both A1 and A2 are LOW.', subtext: 'Vout = HIGH if VLT < Vin < VUT' },
            ],
            memoryTricks: [
              {
                title: '💡 Window Detector Logic',
                content: 'Vin > VUT ➔ Over-voltage ➔ Output LOW\nVin < VLT ➔ Under-voltage ➔ Output LOW\nVLT < Vin < VUT ➔ Inside Window ➔ Output HIGH!',
                mnemonics: ['Window Detector = HIGH only INSIDE window (VLT < Vin < VUT)'],
              },
            ],
            realLifeExamples: [
              { title: 'Lithium Battery Safety Monitor', description: 'Window detector signaling safe voltage between 3.0V (VLT) and 4.2V (VUT).', icon: '🔋' },
            ],
            flashcards: [
              { id: 'fc-win-1', front: 'How does a Window Detector operate?', back: 'It uses two comparators to indicate when an input voltage falls within a specified voltage range (VLT < Vin < VUT).' },
            ],
            importantExamPoints: {
              definitions: [
                'Window Detector: A circuit containing two comparators that outputs HIGH only when the input voltage lies between two preset threshold levels.',
              ],
              formulas: [
                'Window Condition: Vout = HIGH if VLT < Vin < VUT',
              ],
              theoremsRules: [
                'Rule 1: Output is LOW if Vin > VUT (over-voltage) or Vin < VLT (under-voltage).',
              ],
              expectedQuestions: [
                'Explain Window Detector circuit with schematic diagram and transfer characteristics. [6 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Thinking Window Detector outputs HIGH when Vin is outside the threshold range.',
                correct: 'Window detector output is HIGH ONLY inside the window (VLT < Vin < VUT)!',
                explanation: 'NOR gate output turns HIGH when neither comparator trips.',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Window Detector uses dual comparators and NOR gate. Vout = HIGH only when VLT < Vin < VUT.',
              bulletPoints: [
                'A1 checks VUT over-voltage',
                'A2 checks VLT under-voltage',
              ],
            },
            practiceProblems: [
              {
                id: 'p-win-1',
                problem: 'A window detector has VUT = 4.2V and VLT = 3.0V. State Vout (HIGH or LOW) for Vin = 2.5V, Vin = 3.7V, and Vin = 4.5V.',
                solutionSteps: [
                  'Step 1: Vin = 2.5V (< VLT = 3.0V) ➔ Outside window ⟹ Vout = LOW.',
                  'Step 2: Vin = 3.7V (3.0V < 3.7V < 4.2V) ➔ Inside window ⟹ Vout = HIGH.',
                  'Step 3: Vin = 4.5V (> VUT = 4.2V) ➔ Outside window ⟹ Vout = LOW.',
                ],
                finalAnswer: '2.5V ⟹ LOW, 3.7V ⟹ HIGH, 4.5V ⟹ LOW.',
              },
            ],
            animatedSummary: {
              concept: 'Window detectors output HIGH only when Vin is bounded inside VLT and VUT thresholds.',
              rule: 'Vout = HIGH if VLT < Vin < VUT.',
              example: 'Vin = 3.7V with thresholds 3.0V and 4.2V outputs HIGH.',
              examTip: 'Draw the dual comparator circuit with NOR gate output for 6-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-win-1',
                question: 'In a Window Detector with VUT = 5V and VLT = 2V, what is the output state for Vin = 3.5V?',
                options: ['HIGH', 'LOW', '0 V DC', 'Saturated Oscillations'],
                correctAnswer: 0,
                explanation: 'Since 2V < 3.5V < 5V (inside window), the output is HIGH.',
              },
            ],
          },
          {
            id: 'topic-ae-2-6-5',
            subjectId: 'analog-electronics',
            unitId: 'ae-unit-2',
            chapterId: 'ae-chap-2-6',
            title: 'Peak Detector Circuit',
            description: 'Circuit diagram of Op-Amp Peak Detector (Op-Amp A1, rectifier diode D1, storage capacitor CC, MOSFET reset switch S1, output buffer A2), working operation, and holding peak voltage waveform.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'Specialized Circuit ⭐',
            conceptSummary: 'A Peak Detector circuit captures and holds the maximum peak voltage value reached by an AC input signal. It consists of an input op-amp A1 driving a rectifier diode D1, a storage capacitor CC, a MOSFET reset switch S1, and a high input impedance output buffer A2. When Vin > VC, D1 conducts, charging CC to the peak input voltage Vpeak. When Vin falls below Vpeak, D1 turns OFF, and CC retains Vpeak until reset.',
            conceptAnimationType: 'opamp-flow',
            analogDiagramType: 'sample-and-hold',
            diagramSteps: [
              { label: 'Charging Phase (Vin > VC)', description: 'When Vin exceeds capacitor voltage VC, op-amp output goes positive, forward biasing diode D1.', subtext: 'Capacitor CC charges rapidly to peak input voltage Vpeak' },
              { label: 'Peak Hold Phase (Vin < VC)', description: 'When Vin drops below Vpeak, diode D1 becomes reverse biased (OFF), isolating capacitor CC.', subtext: 'Capacitor CC retains maximum peak voltage' },
              { label: 'High-Impedance Output Buffer (A2)', description: 'Voltage follower buffer A2 presents near-infinite input impedance, preventing CC discharge.', subtext: 'Output Vout = Vpeak constant' },
              { label: 'Reset Operation (Switch S1)', description: 'Closing MOSFET reset switch S1 discharges capacitor CC to 0V for next measurement cycle.', subtext: 'Resets peak memory' },
            ],
            memoryTricks: [
              {
                title: '💡 Peak Detector Working Summary',
                content: 'Vin > Vpeak ➔ Diode D1 ON ➔ Capacitor CC Charges to new Peak\nVin < Vpeak ➔ Diode D1 OFF ➔ Capacitor CC Holds Peak Voltage\nReset Switch S1 ➔ Discharges CC to 0V for new cycle',
                mnemonics: ['Peak Detector = Rectifier Diode + Memory Capacitor + Buffer'],
              },
            ],
            realLifeExamples: [
              { title: 'Audio Volume VU Meter', description: 'Captures and displays peak audio volume spikes on LED bar meters.', icon: '🎚️' },
            ],
            flashcards: [
              { id: 'fc-pd-1', front: 'What is the function of a Peak Detector circuit?', back: 'To track an input voltage signal and store its maximum peak voltage value on a capacitor.' },
            ],
            importantExamPoints: {
              definitions: [
                'Peak Detector: An op-amp circuit that follows an AC input signal and stores its highest positive peak voltage on a holding capacitor.',
              ],
              formulas: [
                'Stored Peak Voltage: Vout = Vpeak(max)',
              ],
              theoremsRules: [
                'Rule 1: Diode D1 inside op-amp feedback loop eliminates diode cut-in voltage drop (0.7V) error.',
              ],
              expectedQuestions: [
                'Draw the circuit diagram of an Op-Amp Peak Detector. Explain its operation during charging, holding, and reset modes with waveforms. [8 Marks]',
              ],
            },
            commonMistakes: [
              {
                wrong: 'Placing the diode outside the op-amp feedback loop in a Peak Detector.',
                correct: 'Diode D1 MUST be inside the feedback loop so the op-amp compensates for the 0.7V diode drop!',
                explanation: 'Inside the loop, effective diode drop becomes 0.7V / AVD ≈ 0V (Precision Rectification).',
              },
            ],
            quickRevision: {
              keyTakeaway: 'Peak Detector tracks max Vin on CC via diode D1. Buffer A2 maintains Vpeak. Reset switch S1 clears memory.',
              bulletPoints: [
                'Diode inside feedback loop eliminates 0.7V diode error',
                'FET output buffer prevents capacitor discharge droop',
              ],
            },
            practiceProblems: [
              {
                id: 'p-pd-1',
                problem: 'Explain how placing diode D1 inside the op-amp feedback loop creates a precision peak detector for a 4-mark question.',
                solutionSteps: [
                  'Step 1: A standard passive diode has a 0.7V cut-in voltage drop, causing error for signals < 0.7V.',
                  'Step 2: Placing D1 inside the op-amp negative feedback loop divides diode drop by open loop gain AVD.',
                  'Step 3: Effective diode turn-on drop becomes VD / AVD = 0.7V / 100,000 = 7 μV.',
                  'Step 4: This allows the circuit to accurately detect microvolt peak signals without diode loss.',
                ],
                finalAnswer: 'Feedback loop reduces effective diode drop to microvolts (Precision Peak Detector).',
              },
            ],
            animatedSummary: {
              concept: 'Peak detector uses a feedback diode and capacitor to hold maximum voltage spikes indefinitely.',
              rule: 'Vin > VC ➔ Diode ON (Charge). Vin < VC ➔ Diode OFF (Hold Vpeak). S1 ➔ Reset to 0V.',
              example: 'A 4.5V audio pulse charges CC to 4.5V; output buffer maintains 4.5V output until S1 resets it.',
              examTip: 'Draw the op-amp feedback loop enclosing diode D1 for 8-mark questions!',
            },
            microQuiz: [
              {
                id: 'q-pd-1',
                question: 'In an Op-Amp Peak Detector, what happens to the diode D1 when the input signal Vin falls below the stored capacitor voltage VC?',
                options: ['Diode becomes Forward Biased (ON)', 'Diode becomes Reverse Biased (OFF)', 'Diode burns out', 'Diode short-circuits'],
                correctAnswer: 1,
                explanation: 'When Vin < VC, the diode is reverse biased (OFF), isolating CC to hold the peak voltage.',
              },
            ],
          },
        ],
      },
    ],
  },
];
