import type { Subject, Unit } from '../types/examNotes';

export const SUBJECTS: Subject[] = [
  {
    id: 'digital-technique',
    name: 'Digital Technique',
    code: 'DTE-302',
    description: 'Master binary number systems, digital codes, logic gates, Boolean algebra minimization, combinational circuits, and logic families.',
    icon: '💻',
    color: '#0284c7',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    badge: 'Core Curriculum ⭐',
    units: [],
  },
  {
    id: 'analog-electronics',
    name: 'Analog Electronics',
    code: 'ANE-301',
    description: 'Master PN junction diodes, rectifiers, filters, BJT biasing & amplifiers, operational amplifiers (Op-Amps), and regulated power supplies.',
    icon: '⚡',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    badge: 'Core Hardware ⭐',
    units: [],
  },
];

export const DIGITAL_TECHNIQUE_UNITS: Unit[] = [
  {
    id: 'dt-unit-1',
    subjectId: 'digital-technique',
    unitNumber: 'Unit I',
    title: 'Number Systems & Codes',
    subtitle: 'Binary, Conversions, Arithmetic, Complements, BCD & Codes',
    description: 'Master binary representations, radix conversions, signed number representations, codes (BCD, Gray, Excess-3, ASCII), and complement arithmetic.',
    icon: '🔢',
    colorGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    topicsCount: 15,
    chapters: [
      {
        id: 'dt-chap-1-1',
        subjectId: 'digital-technique',
        unitId: 'dt-unit-1',
        title: 'Chapter 1.1: Number Systems & Conversions',
        subtitle: 'Bases (Radix), Binary, Octal, Decimal, Hexadecimal, and Bidirectional Conversions',
        topics: [
          {
            id: 'topic-1-1-1',
            subjectId: 'digital-technique',
            unitId: 'dt-unit-1',
            chapterId: 'dt-chap-1-1',
            title: 'Number Systems & Base Values',
            description: 'Understanding Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16).',
            estimatedTime: '10 mins',
            difficulty: 'Easy',
            badge: 'Core Foundation',
            conceptSummary: 'A number system defines how numerical quantities are represented using positional notation. The radix (base r) determines the number of unique symbols used. Decimal uses 10 symbols (0-9), Binary uses 2 (0,1), Octal uses 8 (0-7), and Hexadecimal uses 16 (0-9, A-F).',
            conceptAnimationType: 'bit-flow',

            diagramSteps: [
              { label: 'Decimal (Base 10)', description: 'Digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9', subtext: 'Human counting radix' },
              { label: 'Binary (Base 2)', description: 'Digits: 0, 1', subtext: 'Digital hardware signals (LOW/HIGH)' },
              { label: 'Octal (Base 8)', description: 'Digits: 0, 1, 2, 3, 4, 5, 6, 7', subtext: 'Group of 3 binary bits' },
              { label: 'Hexadecimal (Base 16)', description: 'Digits: 0-9 & A(10), B(11), C(12), D(13), E(14), F(15)', subtext: 'Group of 4 binary bits' },
            ],

            stepByStepExamples: [
              {
                title: 'Decimal to Binary Conversion (Repeated Division by 2)',
                initialValue: '25 (Decimal)',
                steps: [
                  { stepNum: 1, calculation: '25 ÷ 2 = 12', note: 'Remainder = 1 (LSB)' },
                  { stepNum: 2, calculation: '12 ÷ 2 = 6', note: 'Remainder = 0' },
                  { stepNum: 3, calculation: '6 ÷ 2 = 3', note: 'Remainder = 0' },
                  { stepNum: 4, calculation: '3 ÷ 2 = 1', note: 'Remainder = 1' },
                  { stepNum: 5, calculation: '1 ÷ 2 = 0', note: 'Remainder = 1 (MSB)' },
                ],
                answer: '11001₂ (Read remainders from bottom MSB to top LSB)',
              },
            ],

            memoryTricks: [
              {
                title: '💡 Remember Base Values',
                content: 'Binary = 2 digits (0, 1)\nOctal = 8 digits (0-7)\nDecimal = 10 digits (0-9)\nHexadecimal = 16 digits (0-9 & A-F)',
                mnemonics: ['B=2, O=8, D=10, H=16', 'Hex A=10, B=11, C=12, D=13, E=14, F=15'],
              },
            ],

            realLifeExamples: [
              { title: 'Computer Processors', description: 'Transistors work in binary ON (1) or OFF (0) voltage states.', icon: '💻' },
              { title: 'Hex Color Codes in Web', description: '#FF0000 uses hex pairs (255 Red) to save memory.', icon: '🎨' },
            ],

            flashcards: [
              { id: 'f1', front: 'What is the base (radix) of Hexadecimal?', back: '16 (Uses digits 0-9 and letters A, B, C, D, E, F).' },
              { id: 'f2', front: 'What digit does Hex letter "E" represent?', back: 'E represents Decimal 14.' },
            ],

            importantExamPoints: {
              definitions: [
                'Radix (Base): The total number of unique digits or symbols available in a number system.',
                'Bit: Binary Digit (0 or 1).',
                'Nibble: A group of 4 binary bits.',
                'Byte: A group of 8 binary bits.',
              ],
              formulas: [
                'N₁₀ = ∑ (dᵢ × rⁱ) where dᵢ is digit, r is base, i is position.',
                'Max value with n bits = 2ⁿ - 1.',
              ],
              theoremsRules: [
                'Rule 1: To convert Decimal → Base r, divide integer part by r (take remainders upward).',
                'Rule 2: Group binary bits in sets of 3 for Octal and sets of 4 for Hexadecimal.',
              ],
              expectedQuestions: [
                'State the base value and valid digits for Binary, Octal, Decimal, and Hexadecimal systems. [4 Marks]',
                'Convert (43.625)₁₀ to Binary and Hexadecimal. [4 Marks]',
              ],
            },

            commonMistakes: [
              {
                wrong: 'Writing remainders top-to-bottom: 25₁₀ = 10011₂',
                correct: 'Writing remainders bottom-to-top (MSB to LSB): 25₁₀ = 11001₂',
                explanation: 'The last remainder obtained when quotient reaches 0 is the Most Significant Bit (MSB).',
              },
            ],

            quickRevision: {
              keyTakeaway: 'Binary is Base-2 (0,1). Octal is Base-8 (3 bits/digit). Hex is Base-16 (4 bits/digit, A=10..F=15).',
              bulletPoints: [
                'Decimal to Binary: Divide by 2 repeatedly, read remainders upward.',
                'Binary to Decimal: Multiply bits by powers of 2 (2⁰, 2¹, 2²...).',
              ],
            },

            practiceProblems: [
              {
                id: 'p1',
                problem: 'Convert (53)₁₀ into equivalent Binary and Hexadecimal numbers.',
                solutionSteps: [
                  'Step 1 (Binary): 53 ÷ 2 = 26 (rem 1), 26 ÷ 2 = 13 (rem 0), 13 ÷ 2 = 6 (rem 1), 6 ÷ 2 = 3 (rem 0), 3 ÷ 2 = 1 (rem 1), 1 ÷ 2 = 0 (rem 1). Result: 110101₂',
                  'Step 2 (Hex): Group 110101₂ into 4-bit groups: (0011)(0101) = 3 5 in Hex.',
                ],
                finalAnswer: 'Binary = 110101₂, Hexadecimal = 35₁₆',
              },
            ],

            animatedSummary: {
              concept: 'Base r uses r distinct symbols (0 to r-1).',
              rule: 'Group bits by 3 (Octal) or 4 (Hex). Divide by 2 for Binary conversion.',
              example: '25₁₀ → 11001₂ → 19₁₆',
              examTip: 'Always verify by expanding binary back to decimal: 16+8+1 = 25.',
            },

            microQuiz: [
              {
                id: 'q1',
                question: 'What is the Decimal equivalent of Hexadecimal digit "C"?',
                options: ['10', '11', '12', '13'],
                correctAnswer: 2,
                explanation: 'In Hexadecimal: A=10, B=11, C=12, D=13, E=14, F=15.',
              },
            ],
          },
        ],
      },
      {
        id: 'dt-chap-1-2',
        subjectId: 'digital-technique',
        unitId: 'dt-unit-1',
        title: 'Chapter 1.2: Binary Arithmetic',
        subtitle: 'Addition, Subtraction, Multiplication, and Division of Binary Numbers',
        topics: [
          {
            id: 'topic-1-2-1',
            subjectId: 'digital-technique',
            unitId: 'dt-unit-1',
            chapterId: 'dt-chap-1-2',
            title: 'Binary Arithmetic Operations',
            description: 'Fundamental rules of binary addition, subtraction, multiplication, and division.',
            estimatedTime: '12 mins',
            difficulty: 'Medium',
            badge: 'Essential Computation',
            conceptSummary: 'Binary arithmetic operates under base-2 rules: Addition: 0+0=0, 0+1=1, 1+1=0 (carry 1). Subtraction: 0-0=0, 1-0=1, 1-1=0, 0-1=1 (borrow 1). Multiplication: 0×0=0, 0×1=0, 1×1=1. Division: Repeated shift & subtract algorithm.',
            conceptAnimationType: 'conversion',

            diagramSteps: [
              { label: 'Binary Addition', description: '1 + 1 = 0 (Carry 1 to next left column)', subtext: 'Sum = A ⊕ B, Carry = A · B' },
              { label: 'Binary Subtraction', description: '0 - 1 = 1 (Borrow 1 from higher position)', subtext: 'Difference = A ⊕ B, Borrow = A\' · B' },
              { label: 'Binary Multiplication', description: 'Partial products added row by row', subtext: '1101 × 101 = 1101 + 00000 + 110100' },
              { label: 'Binary Division', description: 'Compare divisor and dividend, subtract if ≥', subtext: 'Quotient & Remainder generation' },
            ],

            memoryTricks: [
              {
                title: '💡 Binary Arithmetic Quick Rules',
                content: '1 + 1 = 10₂ (Sum 0, Carry 1)\n1 + 1 + 1 = 11₂ (Sum 1, Carry 1)\n0 - 1 = 1 (Borrow 1)',
                mnemonics: ['1+1 produces Carry 1 to left', '0-1 requires Borrow 1 from left'],
              },
            ],

            realLifeExamples: [
              { title: 'Arithmetic Logic Unit (ALU)', description: 'ALU circuits perform binary addition, multiplication, and shift operations.', icon: '⚡' },
            ],

            flashcards: [
              { id: 'f2-1', front: 'What is 1 + 1 in Binary?', back: '0 with a Carry of 1 (10₂).' },
              { id: 'f2-2', front: 'What is 1 + 1 + 1 in Binary?', back: '1 with a Carry of 1 (11₂).' },
            ],

            importantExamPoints: {
              definitions: [
                'Half Adder: Logic circuit that adds two 1-bit binary numbers producing Sum and Carry.',
                'Full Adder: Logic circuit that adds three 1-bit binary numbers (A, B, Carry-in).',
              ],
              formulas: ['Sum = A ⊕ B', 'Carry = A · B'],
              theoremsRules: [
                'Rule 1: Always add generated carry to the next column on the left.',
                'Rule 2: When borrowing 0-1, borrowing 1 from higher position gives 2 (10₂) in current position.',
              ],
              expectedQuestions: [
                'Perform Binary Addition: (1011)₂ + (1101)₂. [2 Marks]',
                'Perform Binary Subtraction: (1100)₂ - (1001)₂. [2 Marks]',
                'Perform Binary Multiplication: (1011)₂ × (110)₂. [3 Marks]',
              ],
            },

            commonMistakes: [
              {
                wrong: 'Writing 1 + 1 = 2 in binary',
                correct: '1 + 1 = 0 with carry 1 (which is 10₂)',
                explanation: 'Binary only contains digits 0 and 1; 2 is represented as 10₂.',
              },
            ],

            quickRevision: {
              keyTakeaway: 'Binary addition: 1+1=0 (Carry 1). Binary subtraction: 0-1=1 (Borrow 1).',
              bulletPoints: [
                'Sum bit = A XOR B',
                'Carry bit = A AND B',
              ],
            },

            practiceProblems: [
              {
                id: 'p2-1',
                problem: 'Multiply binary numbers: 1011₂ (11₁₀) × 101₂ (5₁₀).',
                solutionSteps: [
                  'Step 1: 1011 × 1 = 1011',
                  'Step 2: 1011 × 0 = 00000 (shifted 1 bit)',
                  'Step 3: 1011 × 1 = 101100 (shifted 2 bits)',
                  'Step 4: Sum: 1011 + 101100 = 110111₂ (55₁₀)',
                ],
                finalAnswer: '110111₂ (55₁₀)',
              },
            ],

            animatedSummary: {
              concept: 'Binary arithmetic operates column by column with carry/borrow generation.',
              rule: 'Carry goes left. Borrow comes from left.',
              example: '1011₂ + 1110₂ = 11001₂',
              examTip: 'Check answer by converting to Decimal!',
            },

            microQuiz: [
              {
                id: 'q2-1',
                question: 'What is the sum of binary 101₂ and 011₂?',
                options: ['1000₂', '110₂', '111₂', '1001₂'],
                correctAnswer: 0,
                explanation: '101₂ (5) + 011₂ (3) = 1000₂ (8).',
              },
            ],
          },
        ],
      },
      {
        id: 'dt-chap-1-3',
        subjectId: 'digital-technique',
        unitId: 'dt-unit-1',
        title: "Chapter 1.3: Subtraction using 1's & 2's Complement",
        subtitle: 'Signed Binary Numbers & Complement Subtraction Methods',
        topics: [
          {
            id: 'topic-1-3-1',
            subjectId: 'digital-technique',
            unitId: 'dt-unit-1',
            chapterId: 'dt-chap-1-3',
            title: "1's & 2's Complement Subtraction",
            description: "How digital computers perform subtraction A - B using 1's and 2's complement addition.",
            estimatedTime: '15 mins',
            difficulty: 'Hard',
            badge: 'Exam Favorite ⭐',
            conceptSummary: "1's Complement is obtained by inverting every bit (0→1, 1→0). 2's Complement = 1's Complement + 1. For subtraction A - B using 2's complement: Add A + (2's Comp of B). If an end carry occurs, discard it and result is positive. If NO carry occurs, result is negative and in 2's complement form.",
            conceptAnimationType: 'complement',

            stepByStepExamples: [
              {
                title: "Subtraction using 2's Complement: 25₁₀ - 14₁₀ (8-bit)",
                initialValue: 'A = 25 (00011001₂), B = 14 (00001110₂)',
                steps: [
                  { stepNum: 1, calculation: 'Find 1\'s Comp of B', note: '00001110 → 11110001' },
                  { stepNum: 2, calculation: 'Find 2\'s Comp of B (add 1)', note: '11110001 + 1 = 11110010' },
                  { stepNum: 3, calculation: 'Add A + (2\'s Comp of B)', note: '00011001 + 11110010 = (1)00001011' },
                  { stepNum: 4, calculation: 'Discard End-around Carry (1)', note: 'Result is Positive: 00001011₂ = 11₁₀' },
                ],
                answer: 'Result = +11₁₀ (00001011₂)',
              },
            ],

            memoryTricks: [
              {
                title: "💡 Fast 2's Complement Shortcut",
                content: "Copy bits from right to left up to and including the FIRST '1'. Then invert all remaining bits to the left!",
                mnemonics: ["10110 → Keep '10' from right, invert '101' → 01010!", "2's Comp = 1's Comp + 1"],
              },
            ],

            realLifeExamples: [
              { title: 'Computer Microprocessors', description: 'ALUs use 2\'s complement so the exact same Adder circuit handles both Addition and Subtraction.', icon: '💻' },
            ],

            flashcards: [
              { id: 'fc1', front: "How do you find the 1's complement of a binary number?", back: 'Invert every bit (change 0 to 1, and 1 to 0).' },
              { id: 'fc2', front: "What is the formula for 2's complement?", back: "2's Complement = 1's Complement + 1." },
            ],

            importantExamPoints: {
              definitions: [
                "1's Complement: Bitwise inversion of binary digits.",
                "2's Complement: 1's Complement + 1.",
              ],
              formulas: [
                "1's Comp of N = (2ⁿ - 1) - N",
                "2's Comp of N = 2ⁿ - N",
              ],
              theoremsRules: [
                "Rule 1 (Carry Present): Discard carry, answer is POSITIVE.",
                "Rule 2 (No Carry): Answer is NEGATIVE; take 2's complement of result to find magnitude.",
              ],
              expectedQuestions: [
                "Subtract (14)₁₀ from (25)₁₀ using 2's complement method. [4 Marks]",
                "Subtract (25)₁₀ from (14)₁₀ using 2's complement method. [4 Marks]",
              ],
            },

            commonMistakes: [
              {
                wrong: 'Forgetting to pad with leading zeros before taking complement',
                correct: 'Always specify fixed bit length (e.g. 8 bits) before taking complements!',
                explanation: 'Without fixed bit length, the MSB sign bit and carry detection will fail.',
              },
            ],

            quickRevision: {
              keyTakeaway: "2's Complement = Invert bits + 1. Subtraction A-B = A + (2's Comp B). Discard carry = Positive answer.",
              bulletPoints: [
                "MSB = 0 means positive, MSB = 1 means negative.",
              ],
            },

            practiceProblems: [
              {
                id: 'p3-1',
                problem: "Perform 12 - 19 using 8-bit 2's complement subtraction.",
                solutionSteps: [
                  "12 in 8-bit binary = 00001100",
                  "19 in 8-bit binary = 00010011",
                  "2's Comp of 19: Invert (11101100) + 1 = 11101101",
                  "Add: 00001100 + 11101101 = 11111001 (No carry)",
                  "Since no carry, answer is negative. Take 2's comp of 11111001 → -(00000111₂ = -7)",
                ],
                finalAnswer: "-7 (in 2's comp form: 11111001₂)",
              },
            ],

            animatedSummary: {
              concept: "Complement arithmetic converts subtraction into addition.",
              rule: "A - B = A + 2's Comp(B). Discard Carry → Positive. No Carry → Negative.",
              example: "25 - 14 = 25 + 242 = 267 (discard 256) = 11.",
              examTip: "Always write the final decimal verification alongside your binary result!",
            },

            microQuiz: [
              {
                id: 'q3-1',
                question: "What is the 1's complement of binary 10101100₂?",
                options: ['01010011₂', '01010100₂', '11111111₂', '00000000₂'],
                correctAnswer: 0,
                explanation: 'Invert every bit: 1→0 and 0→1 gives 01010011₂.',
              },
            ],
          },
        ],
      },
      {
        id: 'dt-chap-1-4',
        subjectId: 'digital-technique',
        unitId: 'dt-unit-1',
        title: 'Chapter 1.4: Digital Codes & Applications',
        subtitle: 'BCD (8421), Gray Code, Excess-3, ASCII & Code Conversions',
        topics: [
          {
            id: 'topic-1-4-1',
            subjectId: 'digital-technique',
            unitId: 'dt-unit-1',
            chapterId: 'dt-chap-1-4',
            title: 'BCD, Gray, Excess-3 & ASCII Codes',
            description: 'Understanding BCD 8421, unit-distance Gray Code, self-complementing Excess-3 code, and ASCII alphanumeric encoding.',
            estimatedTime: '15 mins',
            difficulty: 'Medium',
            badge: 'High Scoring',
            conceptSummary: 'BCD encodes each decimal digit (0-9) as 4 bits (0000-1001). Gray Code changes only 1 bit between consecutive numbers (unweighted unit-distance code). Excess-3 is formed by adding 3 (0011₂) to each BCD digit and is self-complementing.',
            conceptAnimationType: 'bit-flow',

            memoryTricks: [
              {
                title: '💡 Binary to Gray Code Conversion Rule',
                content: 'MSB of Gray = MSB of Binary.\nSubsequent Gray bits = Binary bit XOR next Binary bit!\n(Gᵢ = Bᵢ ⊕ Bᵢ₊₁)',
                mnemonics: ['Gray code = Single bit change', 'Excess-3 = BCD + 0011₂'],
              },
            ],

            realLifeExamples: [
              { title: 'Digital Displays & 7-Segment Displays', description: 'BCD is directly decoded to display digits on digital clocks and multimeters.', icon: '📟' },
              { title: 'Optical Shaft Encoders', description: 'Gray code prevents erroneous readings during motor shaft rotation.', icon: '⚙️' },
            ],

            flashcards: [
              { id: 'fc-code-1', front: 'Why is Gray code called a unit-distance code?', back: 'Because only ONE bit changes between any two consecutive numbers, avoiding transition errors.' },
              { id: 'fc-code-2', front: 'How do you convert BCD to Excess-3?', back: 'Add 3 (0011₂) to each 4-bit BCD digit.' },
            ],

            importantExamPoints: {
              definitions: [
                'Weighted Code: Each position has a specific weight (e.g. 8421 BCD).',
                'Unweighted Code: Bit positions do not have fixed positional weights (e.g. Gray, Excess-3).',
                'Self-Complementing Code: Code where 9\'s complement of a digit equals 1\'s complement of its codeword (e.g. Excess-3).',
              ],
              formulas: ['G₃ = B₃', 'G₂ = B₃ ⊕ B₂', 'G₁ = B₂ ⊕ B₁', 'G₀ = B₁ ⊕ B₀'],
              theoremsRules: [
                'Rule 1: Invalid BCD states are 1010, 1011, 1100, 1101, 1110, 1111 (10 to 15).',
                'Rule 2: Excess-3 = BCD + 3 (0011₂).',
              ],
              expectedQuestions: [
                'Convert Binary (1101)₂ to Gray Code. [2 Marks]',
                'Convert Gray Code (1011) to Binary. [2 Marks]',
                'Why is Gray Code preferred in shaft encoders? [2 Marks]',
              ],
            },

            commonMistakes: [
              {
                wrong: 'Writing BCD for 25 as 11001₂',
                correct: 'BCD for 25 is (0010 0101)b',
                explanation: 'Binary converts entire number at once, while BCD encodes EACH DECIMAL DIGIT separately into 4 bits.',
              },
            ],

            quickRevision: {
              keyTakeaway: 'BCD = 4 bits per decimal digit (0-9). Gray Code = 1-bit change. Excess-3 = BCD + 3 (Self-complementing).',
              bulletPoints: [
                'BCD uses weights 8-4-2-1.',
                'Gray code eliminates glitch errors in rotary encoders.',
              ],
            },

            practiceProblems: [
              {
                id: 'p-code-1',
                problem: 'Convert Binary 1011₂ to Gray Code.',
                solutionSteps: [
                  'G₃ = B₃ = 1',
                  'G₂ = B₃ ⊕ B₂ = 1 ⊕ 0 = 1',
                  'G₁ = B₂ ⊕ B₁ = 0 ⊕ 1 = 1',
                  'G₀ = B₁ ⊕ B₀ = 1 ⊕ 1 = 0',
                ],
                finalAnswer: 'Gray Code = 1110_Gray',
              },
            ],

            animatedSummary: {
              concept: 'Digital codes format binary data for human display, error reduction, and communication.',
              rule: 'BCD: 4 bits/digit. Gray: XOR adjacent bits. Excess-3: Add 3.',
              example: 'Dec 9 → BCD: 1001 → XS-3: 1100 → Gray: 1101',
              examTip: 'Remember invalid BCD values (10-15); add +6 (0110₂) to correct BCD addition carries!',
            },

            microQuiz: [
              {
                id: 'q-code-1',
                question: 'Which of the following is an unweighted code?',
                options: ['8421 BCD', 'Straight Binary', 'Gray Code', '2421 Code'],
                correctAnswer: 2,
                explanation: 'Gray Code is unweighted because bit positions do not represent powers of 2 or fixed weights.',
              },
            ],
          },
        ],
      },
      {
        id: 'dt-chap-1-5',
        subjectId: 'digital-technique',
        unitId: 'dt-unit-1',
        title: 'Chapter 1.5: BCD Arithmetic & 9\'s/10\'s Complement Subtraction',
        subtitle: 'BCD Addition (+6 Correction Rule), 9\'s & 10\'s Complement Subtraction',
        topics: [
          {
            id: 'topic-1-5-1',
            subjectId: 'digital-technique',
            unitId: 'dt-unit-1',
            chapterId: 'dt-chap-1-5',
            title: 'BCD Addition & +6 Correction Rule',
            description: 'Rules for adding BCD numbers and correcting invalid sums (> 9 or carry) by adding +6 (0110₂).',
            estimatedTime: '15 mins',
            difficulty: 'Hard',
            badge: 'High Exam Priority ⭐',
            conceptSummary: 'In BCD Addition, add corresponding 4-bit nibbles. If any 4-bit sum is invalid (> 9, i.e., 1010 to 1111) OR generates a carry-out, add 6 (0110₂) as a correction factor to skip the 6 invalid 4-bit states (10 to 15).',
            conceptAnimationType: 'conversion',

            diagramSteps: [
              { label: 'Step 1: Standard Binary Addition', description: 'Add corresponding 4-bit BCD nibbles using binary addition', subtext: 'e.g. 7 (0111) + 6 (0110) = 13 (1101₂)' },
              { label: 'Step 2: Check Invalid State', description: 'Is Sum > 9 (1001₂) OR is Carry = 1?', subtext: '1101₂ is 13 (> 9) → INVALID BCD!' },
              { label: 'Step 3: Add +6 (0110₂) Correction', description: 'Add 0110₂ to the invalid nibble', subtext: '1101₂ + 0110₂ = (1)0011₂' },
              { label: 'Step 4: Final BCD Result', description: 'Carry 1 forms Tens digit, 0011₂ forms Units digit', subtext: 'Result = 0001 0011_BCD = 13₁₀' },
            ],

            stepByStepExamples: [
              {
                title: 'BCD Addition: 38₁₀ + 45₁₀',
                initialValue: '38₁₀ (0011 1000_BCD) + 45₁₀ (0100 0101_BCD)',
                steps: [
                  { stepNum: 1, calculation: 'Units nibble: 1000₂ (8) + 0101₂ (5) = 1101₂ (13)', note: '1101₂ > 9 → INVALID! Add +6 (0110₂)' },
                  { stepNum: 2, calculation: 'Correct Units: 1101₂ + 0110₂ = (1)0011₂', note: 'Units = 0011₂ (3), Carry 1 to Tens' },
                  { stepNum: 3, calculation: 'Tens nibble: 0011₂ (3) + 0100₂ (4) + 1 (carry) = 1000₂ (8)', note: '1000₂ ≤ 9 → VALID BCD!' },
                ],
                answer: 'Final BCD Result = 1000 0011_BCD = 83₁₀',
              },
            ],

            memoryTricks: [
              {
                title: '💡 BCD +6 Correction Rule',
                content: 'If Sum > 9 (1001₂) OR Carry = 1:\n👉 Add +6 (0110₂) to correct the nibble!\n(Skips invalid BCD states 10 to 15)',
                mnemonics: ['Invalid BCD sum (> 9 or carry) → Add +6 (0110₂)', 'Valid BCD sum (≤ 9 and no carry) → Leave unchanged'],
              },
            ],

            realLifeExamples: [
              { title: 'Digital Calculators', description: 'Calculators use BCD arithmetic ICs to perform decimal calculations without binary rounding errors.', icon: '🧮' },
            ],

            flashcards: [
              { id: 'fc-bcd-1', front: 'When must +6 (0110₂) be added in BCD addition?', back: 'When a 4-bit nibble sum is greater than 9 (1001₂) OR generates a carry output.' },
              { id: 'fc-bcd-2', front: 'Why is +6 added as a correction factor?', back: 'Because 4 bits can represent 16 values (0-15), but BCD only uses 10 values (0-9). Adding 6 skips the 6 invalid states.' },
            ],

            importantExamPoints: {
              definitions: [
                'BCD Addition: Adding decimal digits represented in 4-bit BCD format.',
                'BCD Correction Factor (+6): 0110₂ added to invalid nibbles (> 9 or carry generated).',
                '9\'s Complement: Subtract each decimal digit from 9.',
                '10\'s Complement: 9\'s Complement + 1.',
              ],
              formulas: [
                '9\'s Comp of N = (999...9) - N',
                '10\'s Comp of N = 9\'s Comp of N + 1',
                'BCD Correction: Add 0110₂ if Sum > 1001₂ OR Carry = 1',
              ],
              theoremsRules: [
                'Rule 1 (10\'s Comp Subtraction): If end carry generated, DISCARD carry and result is positive.',
                'Rule 2 (10\'s Comp Subtraction): If NO end carry, result is negative; take 10\'s complement of result.',
              ],
              expectedQuestions: [
                'Perform BCD Addition: (58)₁₀ + (67)₁₀. Show all correction steps. [4 Marks]',
                'Subtract (34)₁₀ from (72)₁₀ using 9\'s complement and 10\'s complement methods. [6 Marks]',
              ],
            },

            commonMistakes: [
              {
                wrong: 'Forgetting to add +6 when a carry is generated even if nibble sum is ≤ 9',
                correct: 'If a carry-out is generated, YOU MUST ADD +6 to that nibble regardless of nibble sum!',
                explanation: 'A carry-out means 16 was exceeded, so 6 invalid states were traversed.',
              },
            ],

            quickRevision: {
              keyTakeaway: 'BCD Addition: Sum > 9 or Carry=1 → Add +6 (0110₂). 10\'s Comp Subtraction: Discard carry = Positive.',
              bulletPoints: [
                'Invalid BCD nibble states: 1010 to 1111.',
                '10\'s Comp = 9\'s Comp + 1.',
                'Used in calculators and digital decimal readouts.',
              ],
            },

            practiceProblems: [
              {
                id: 'p-bcd-1',
                problem: 'Subtract 42₁₀ from 85₁₀ using 10\'s complement method.',
                solutionSteps: [
                  'Step 1: 9\'s complement of 42 = 99 - 42 = 57',
                  'Step 2: 10\'s complement of 42 = 57 + 1 = 58',
                  'Step 3: Add 85 + 58 = (1)43',
                  'Step 4: End carry (1) generated → Discard carry! Result is Positive: +43₁₀',
                ],
                finalAnswer: 'Result = +43₁₀',
              },
            ],

            animatedSummary: {
              concept: 'BCD arithmetic maintains decimal digit boundaries in digital systems.',
              rule: 'BCD Sum > 9 or Carry → Add 0110₂ (+6). 10\'s Comp Subtraction → Discard Carry.',
              example: '38 + 45 = 83 in BCD: (0011 1000) + (0100 0101) + (0110) = (1000 0011).',
              examTip: 'Always check each 4-bit nibble individually for > 9 or carry!',
            },

            microQuiz: [
              {
                id: 'q-bcd-1',
                question: 'What binary number is added to correct an invalid BCD sum?',
                options: ['0011₂ (+3)', '0100₂ (+4)', '0110₂ (+6)', '1000₂ (+8)'],
                correctAnswer: 2,
                explanation: '0110₂ (+6) is added to skip the 6 unused 4-bit binary states (10 to 15).',
              },
              {
                id: 'q-bcd-2',
                question: 'What is the 9\'s complement of decimal number 37?',
                options: ['62', '63', '73', '64'],
                correctAnswer: 0,
                explanation: '99 - 37 = 62.',
              },
              {
                id: 'q-bcd-3',
                question: 'What is the 10\'s complement of decimal number 37?',
                options: ['62', '63', '64', '73'],
                correctAnswer: 1,
                explanation: '10\'s complement = 9\'s complement + 1 = 62 + 1 = 63.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'dt-unit-2',
    subjectId: 'digital-technique',
    unitNumber: 'Unit II',
    title: 'Logic Gates & Boolean Algebra',
    subtitle: 'Logic Families, Basic/Universal Gates, Buffers & De Morgan Theorems',
    description: 'Master logic family specifications (TTL, CMOS, ECL), basic/universal gates, buffer architectures, Boolean algebraic reduction laws, and De Morgan proofs.',
    icon: '⚡',
    colorGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    topicsCount: 15,
    chapters: [
      {
        id: 'dt-chap-2-1',
        subjectId: 'digital-technique',
        unitId: 'dt-unit-2',
        title: 'Chapter 2.1: Logic Families Specifications',
        subtitle: 'Noise Margin, Power Dissipation, Figure of Merit, Fan-in/Out, Speed & TTL/CMOS/ECL Comparison',
        topics: [
          {
            id: 'topic-2-1-1',
            subjectId: 'digital-technique',
            unitId: 'dt-unit-2',
            chapterId: 'dt-chap-2-1',
            title: 'Logic Families Parameters & Figure of Merit',
            description: 'In-depth breakdown of Noise Margin, Power Dissipation, Figure of Merit (PDP), Fan-in, Fan-out, Propagation Delay, Max Clock Frequency, Supply Voltage, Power Per Gate, and TTL/CMOS/ECL comparative analysis.',
            estimatedTime: '15 mins',
            difficulty: 'Hard',
            badge: 'High Weightage ⭐',
            conceptSummary: 'Digital IC logic families are characterized by speed, power, noise immunity, and load driving capability. Figure of Merit (Power-Delay Product PDP = tp × Pd) measures overall efficiency. CMOS provides lowest power and highest noise margin, while ECL provides maximum speed.',
            conceptAnimationType: 'family-chart',

            logicFamiliesData: [
              {
                name: 'TTL (74 Series)',
                noiseMargin: '0.4 V',
                powerDissipation: '10 mW / gate',
                propagationDelay: '10 ns',
                fanIn: '8',
                fanOut: '10',
                clockFrequency: '35 MHz',
                supplyVoltage: '5 V (±0.25V)',
                powerPerGate: '10 mW',
                advantages: ['Low cost', 'Robust static immunity', 'Wide availability'],
                disadvantages: ['High power consumption', 'Moderate speed'],
                applications: ['General digital circuits', 'Legacy logic controllers'],
              },
              {
                name: 'CMOS (4000 / 74HC)',
                noiseMargin: '1.5 V (High!)',
                powerDissipation: '0.01 mW (Ultra Low!)',
                propagationDelay: '15-25 ns',
                fanIn: '10',
                fanOut: '50 (High!)',
                clockFrequency: '50 MHz',
                supplyVoltage: '3V to 15V',
                powerPerGate: '0.001 mW',
                advantages: ['Extremely low static power', 'High noise margin (45% VCC)', 'High fan-out'],
                disadvantages: ['Sensitive to electrostatic discharge (ESD)'],
                applications: ['Battery powered devices', 'Microprocessors', 'CMOS RAM'],
              },
              {
                name: 'ECL (10K / 100K)',
                noiseMargin: '0.2 V (Low)',
                powerDissipation: '40-50 mW (High!)',
                propagationDelay: '1-2 ns (Fastest!)',
                fanIn: '5',
                fanOut: '25',
                clockFrequency: '500+ MHz',
                supplyVoltage: '-5.2 V',
                powerPerGate: '45 mW',
                advantages: ['Fastest switching speed (no BJT saturation)'],
                disadvantages: ['High power dissipation', 'Low noise margin'],
                applications: ['Supercomputers', 'Ultra high speed instrumentation'],
              },
            ],

            memoryTricks: [
              {
                title: '💡 Figure of Merit & Logic Family Mnemonic',
                content: 'Figure of Merit PDP = tp × Pd (in Picojoules pJ)\nCMOS = Low Power & High Fan-out\nECL = Fastest Speed (Non-saturating BJT)\nTTL = BJT Standard 5V',
                mnemonics: ['Fastest: ECL > TTL > CMOS', 'Lowest Power: CMOS < TTL < ECL', 'Noise Margin: CMOS > TTL > ECL'],
              },
            ],

            realLifeExamples: [
              { title: 'Smartphones & Laptops', description: 'Built using CMOS technology to preserve battery power and generate minimal heat.', icon: '📱' },
            ],

            flashcards: [
              { id: 'fc-fam-1', front: 'What is Figure of Merit (PDP)?', back: 'Power-Delay Product = Propagation Delay (tp) × Power Dissipation (Pd), measured in Joules.' },
              { id: 'fc-fam-2', front: 'Which logic family is the fastest?', back: 'ECL (Emitter-Coupled Logic) due to non-saturating BJT differential amplifiers.' },
            ],

            importantExamPoints: {
              definitions: [
                'Figure of Merit (PDP): Product of propagation delay and power dissipation (PDP = tp × Pd).',
                'Fan-In: Number of inputs connected to a logic gate.',
                'Fan-Out: Maximum number of standard load inputs an output can drive.',
                'Noise Margin: Maximum noise voltage tolerance without output state change.',
              ],
              formulas: [
                'PDP = tp × Pd (Joules)',
                'Noise Margin HIGH V_NH = V_OH(min) - V_IH(min)',
                'Noise Margin LOW V_NL = V_IL(max) - V_OL(max)',
              ],
              theoremsRules: [
                'Rule 1: Unused TTL inputs should be tied to VCC via resistor.',
                'Rule 2: CMOS unused inputs MUST NEVER be left floating (tie to VCC or GND).',
              ],
              expectedQuestions: [
                'Define Figure of Merit, Noise Margin, Fan-In, and Fan-Out. [4 Marks]',
                'Compare TTL, CMOS, and ECL logic families based on Speed, Power, Noise Margin, and Fan-Out. [6 Marks]',
              ],
            },

            commonMistakes: [
              {
                wrong: 'Assuming higher Figure of Merit is better',
                correct: 'LOWER Figure of Merit (PDP) is better!',
                explanation: 'A lower PDP means lower power consumption for a given switching speed.',
              },
            ],

            quickRevision: {
              keyTakeaway: 'Figure of Merit PDP = tp × Pd. CMOS = Lowest Power. ECL = Fastest Speed.',
              bulletPoints: [
                'Fan-Out: CMOS (50) > ECL (25) > TTL (10).',
                'Prop Delay: ECL (1-2ns) < TTL (10ns) < CMOS (15-25ns).',
              ],
            },

            practiceProblems: [
              {
                id: 'p-fam-1',
                problem: 'Calculate Figure of Merit (PDP) for a gate with propagation delay tp = 10 ns and power dissipation Pd = 5 mW.',
                solutionSteps: [
                  'PDP = tp × Pd',
                  'PDP = (10 × 10⁻⁹ s) × (5 × 10⁻³ W) = 50 × 10⁻¹² Joules = 50 pJ',
                ],
                finalAnswer: 'PDP = 50 pJ (Picojoules)',
              },
            ],

            animatedSummary: {
              concept: 'Logic families define speed, power, noise immunity, and fan-out parameters.',
              rule: 'PDP = tp × Pd. Lower PDP is superior.',
              example: 'CMOS PDP = 15ns × 0.01mW = 0.15 pJ.',
              examTip: 'Memorize the 6-parameter comparison table for 6-mark exam questions!',
            },

            microQuiz: [
              {
                id: 'q-fam-1',
                question: 'What is the formula for Figure of Merit (Power-Delay Product)?',
                options: ['tp / Pd', 'tp × Pd', 'tp + Pd', 'VCC × ICC'],
                correctAnswer: 1,
                explanation: 'Figure of Merit PDP = Propagation Delay (tp) × Power Dissipation (Pd).',
              },
            ],
          },
        ],
      },
      {
        id: 'dt-chap-2-2',
        subjectId: 'digital-technique',
        unitId: 'dt-unit-2',
        title: 'Chapter 2.2: Positive/Negative Logic & Logic Gates',
        subtitle: 'Positive vs Negative Logic Systems, Basic, Universal & Special Purpose Gates',
        topics: [
          {
            id: 'topic-2-2-1',
            subjectId: 'digital-technique',
            unitId: 'dt-unit-2',
            chapterId: 'dt-chap-2-2',
            title: 'Positive & Negative Logic & Gate Operations',
            description: 'Introduction to Positive Logic (High=1) & Negative Logic (High=0) systems, symbols, and truth tables for AND, OR, NOT, NAND, NOR, EX-OR, and EX-NOR gates.',
            estimatedTime: '15 mins',
            difficulty: 'Easy',
            badge: 'Interactive Lab ⚡',
            conceptSummary: 'In Positive Logic, the higher voltage level is defined as Logic 1 and lower level as Logic 0. In Negative Logic, higher voltage is Logic 0 and lower voltage is Logic 1. Basic gates: AND, OR, NOT. Universal gates: NAND, NOR. Special purpose gates: EX-OR (odd parity detector) and EX-NOR (equivalence detector).',
            conceptAnimationType: 'gate-flow',

            interactiveGate: 'AND',

            memoryTricks: [
              {
                title: '💡 Positive vs Negative Logic & Gate Quick Rules',
                content: 'Positive Logic: High Voltage = 1, Low Voltage = 0\nNegative Logic: High Voltage = 0, Low Voltage = 1\nPositive Logic AND = Negative Logic OR\nPositive Logic OR = Negative Logic AND',
                mnemonics: ['NAND & NOR are Universal!', 'XOR = Odd ones detector', 'XNOR = Equivalence gate'],
              },
            ],

            realLifeExamples: [
              { title: 'Safety Interlocks in Factories', description: 'AND gates ensure safety shield IS CLOSED and Start Button IS PRESSED before motor turns ON.', icon: '🛡️' },
            ],

            flashcards: [
              { id: 'fc-g-1', front: 'What is Positive Logic System?', back: 'A system where higher voltage represents Logic 1 and lower voltage represents Logic 0.' },
              { id: 'fc-g-2', front: 'What is Negative Logic System?', back: 'A system where higher voltage represents Logic 0 and lower voltage represents Logic 1.' },
            ],

            truthTable: {
              inputs: ['Input A', 'Input B'],
              output: 'AND Output (A·B)',
              rows: [
                { inputs: [0, 0], output: 0, label: '0 AND 0 = 0 (OFF)' },
                { inputs: [0, 1], output: 0, label: '0 AND 1 = 0 (OFF)' },
                { inputs: [1, 0], output: 0, label: '1 AND 0 = 0 (OFF)' },
                { inputs: [1, 1], output: 1, label: '1 AND 1 = 1 (ON ⭐)' },
              ],
            },

            importantExamPoints: {
              definitions: [
                'Positive Logic System: Higher potential level = 1, Lower potential level = 0.',
                'Negative Logic System: Higher potential level = 0, Lower potential level = 1.',
                'Universal Gate: A gate that can implement any Boolean function (NAND & NOR).',
              ],
              formulas: [
                'Y_AND = A · B',
                'Y_OR = A + B',
                'Y_NAND = (A · B)\'',
                'Y_NOR = (A + B)\'',
                'Y_XOR = A ⊕ B = A\'B + AB\'',
                'Y_XNOR = (A ⊕ B)\' = AB + A\'B\'',
              ],
              theoremsRules: [
                'NAND implementation of NOT: Connect both inputs of NAND together (A NAND A = A\').',
                'NOR implementation of NOT: Connect both inputs of NOR together (A NOR A = A\').',
              ],
              expectedQuestions: [
                'Differentiate between Positive Logic and Negative Logic systems with example. [4 Marks]',
                'Draw symbols and truth tables for basic, universal, and special purpose logic gates. [6 Marks]',
              ],
            },

            commonMistakes: [
              {
                wrong: 'Assuming Positive Logic and Negative Logic produce identical gate functions',
                correct: 'A Positive Logic AND gate functions as a Negative Logic OR gate!',
                explanation: 'Swapping 0 and 1 voltage definitions transforms AND operations into OR operations.',
              },
            ],

            quickRevision: {
              keyTakeaway: 'Positive Logic: High=1, Low=0. Negative Logic: High=0, Low=1. NAND/NOR = Universal. XOR = Odd ones. XNOR = Equivalence.',
              bulletPoints: [
                'AND requires ALL inputs HIGH.',
                'OR requires ANY input HIGH.',
              ],
            },

            practiceProblems: [
              {
                id: 'p-g-1',
                problem: 'Show that a Positive Logic AND gate acts as a Negative Logic OR gate.',
                solutionSteps: [
                  'Step 1: Positive Logic AND truth table: (0,0)->0, (0,1)->0, (1,0)->0, (1,1)->1',
                  'Step 2: Convert to Negative Logic by swapping 0 and 1 voltage definitions:',
                  'Voltage Levels: (L,L)->L, (L,H)->L, (H,L)->L, (H,H)->H',
                  'In Negative Logic (H=0, L=1): (1,1)->1, (1,0)->1, (0,1)->1, (0,0)->0',
                  'Step 3: This matches the truth table of an OR gate!',
                ],
                finalAnswer: 'Positive Logic AND ≡ Negative Logic OR',
              },
            ],

            animatedSummary: {
              concept: 'Logic gates process binary signals according to defined voltage logic systems.',
              rule: 'Positive Logic: High=1. Negative Logic: High=0.',
              example: 'A=1, B=0 → AND=0, OR=1, NAND=1, NOR=0, XOR=1, XNOR=0.',
              examTip: 'Practice drawing NAND/NOR conversions using De Morgan laws!',
            },

            microQuiz: [
              {
                id: 'q-g-1',
                question: 'In a Negative Logic System, what logic level is assigned to higher voltage level?',
                options: ['Logic 1', 'Logic 0', 'High Impedance', 'Undefined'],
                correctAnswer: 1,
                explanation: 'In negative logic, higher voltage is defined as Logic 0 and lower voltage as Logic 1.',
              },
            ],
          },
        ],
      },
      {
        id: 'dt-chap-2-3',
        subjectId: 'digital-technique',
        unitId: 'dt-unit-2',
        title: 'Chapter 2.3: Buffers & Tri-State Logic',
        subtitle: 'Tri-State Logic, Unidirectional & Bidirectional Buffer Operations',
        topics: [
          {
            id: 'topic-2-3-1',
            subjectId: 'digital-technique',
            unitId: 'dt-unit-2',
            chapterId: 'dt-chap-2-3',
            title: 'Tri-State Buffers & Bus Transceivers',
            description: 'Understanding Tri-state logic, High Impedance (Hi-Z) state, Unidirectional buffers (e.g. 74HC244), and Bidirectional transceivers (e.g. 74HC245).',
            estimatedTime: '12 mins',
            difficulty: 'Medium',
            badge: 'Bus Architecture',
            conceptSummary: 'A Tri-State Buffer has 3 output states: Logic 0, Logic 1, and High Impedance (Hi-Z). When Enable EN=1, output Y = Input A. When EN=0, output is Hi-Z (disconnected). Unidirectional buffers pass signals in one direction; Bidirectional buffers (bus transceivers) use a Direction pin (DIR) to route data A → B or B → A.',
            conceptAnimationType: 'bit-flow',

            diagramSteps: [
              { label: 'Unidirectional Buffer (74HC244)', description: 'Signal flows in one direction: A → Y when EN=1', subtext: 'Hi-Z when EN=0' },
              { label: 'Bidirectional Transceiver (74HC245)', description: 'DIR=1: Data flows A → B. DIR=0: Data flows B → A.', subtext: 'Controlled by DIR & OE pins' },
              { label: 'Hi-Z Bus Isolation', description: 'Prevents bus contention when multiple ICs share data bus lines', subtext: 'Behaves as open electrical switch' },
            ],

            memoryTricks: [
              {
                title: '💡 Tri-State & Buffer Quick Rules',
                content: 'EN = 1 → Buffer Active (Y = A)\nEN = 0 → Hi-Z (Disconnected Open Switch)\nUnidirectional = 1-way traffic (A → B)\nBidirectional = 2-way traffic (A ↔ B with DIR pin)',
                mnemonics: ['Hi-Z means open electrical switch', '74HC245 = Bidirectional Transceiver'],
              },
            ],

            realLifeExamples: [
              { title: 'Computer Microprocessor Data Bus', description: 'Multiple RAM chips and I/O devices connect to the CPU data bus using tri-state bidirectional transceivers.', icon: '🖥️' },
            ],

            flashcards: [
              { id: 'fc-buf-1', front: 'What is a Bidirectional Buffer (Transceiver)?', back: 'A buffer circuit that can transmit data in either direction (A to B or B to A) depending on a Direction (DIR) control input.' },
              { id: 'fc-buf-2', front: 'What is High Impedance (Hi-Z)?', back: 'An output state where the pin behaves as an open circuit (disconnected from supply and ground).' },
            ],

            importantExamPoints: {
              definitions: [
                'Tri-State Logic: Logic circuitry capable of producing 0, 1, and Hi-Z states.',
                'Unidirectional Buffer: Buffer permitting data transmission in one direction only.',
                'Bidirectional Buffer (Transceiver): Buffer permitting data transmission in both directions under control of a DIR signal.',
              ],
              formulas: [
                'Y = A (when EN = 1)',
                'Y = Hi-Z (when EN = 0)',
                'DIR = 1 → A to B; DIR = 0 → B to A',
              ],
              theoremsRules: [
                'Rule 1: Only ONE tri-state driver connected to a shared bus wire can be active (EN=1) at any instant.',
              ],
              expectedQuestions: [
                'Explain tri-state logic with symbol and truth table. [4 Marks]',
                'Compare Unidirectional and Bidirectional buffers with IC examples (74HC244 vs 74HC245). [4 Marks]',
              ],
            },

            commonMistakes: [
              {
                wrong: 'Confusing Hi-Z state with Logic 0 (0V)',
                correct: 'Hi-Z is HIGH IMPEDANCE (open circuit), NOT 0V ground!',
                explanation: 'Logic 0 actively pulls voltage down to 0V; Hi-Z presents near-infinite resistance.',
              },
            ],

            quickRevision: {
              keyTakeaway: 'Tri-state: 0, 1, Hi-Z. Unidirectional = 1 direction (74HC244). Bidirectional = 2 directions (74HC245).',
              bulletPoints: [
                'EN = 1 → Output active',
                'EN = 0 → Output Hi-Z (Floating)',
                'Prevents bus contention on shared CPU data buses.',
              ],
            },

            practiceProblems: [
              {
                id: 'p-buf-1',
                problem: 'Explain the role of DIR pin in 74HC245 Bidirectional Bus Transceiver IC.',
                solutionSteps: [
                  'Step 1: When Output Enable OE = 0 (active), transceivers are enabled.',
                  'Step 2: If DIR = 1 (HIGH), data flows from A port to B port (CPU → Memory).',
                  'Step 3: If DIR = 0 (LOW), data flows from B port to A port (Memory → CPU).',
                ],
                finalAnswer: 'DIR selects data flow direction A → B or B → A.',
              },
            ],

            animatedSummary: {
              concept: 'Tri-state buffers and transceivers manage data flow and isolate shared bus lines.',
              rule: 'EN=1 → Pass signal. EN=0 → Electrically isolate (Hi-Z). DIR pin controls 2-way direction.',
              example: 'CPU reading RAM: DIR=0 (RAM → CPU). CPU writing RAM: DIR=1 (CPU → RAM).',
              examTip: 'Always draw the DIR pin on bidirectional buffer diagrams!',
            },

            microQuiz: [
              {
                id: 'q-buf-1',
                question: 'Which IC is a popular 8-bit Bidirectional Bus Transceiver?',
                options: ['74HC00', '74HC04', '74HC244', '74HC245'],
                correctAnswer: 3,
                explanation: '74HC245 is an 8-bit bidirectional transceiver IC with DIR and OE controls.',
              },
            ],
          },
        ],
      },
      {
        id: 'dt-chap-2-4',
        subjectId: 'digital-technique',
        unitId: 'dt-unit-2',
        title: "Chapter 2.4: Boolean Algebra, Duality & De-Morgan's Theorems",
        subtitle: 'Boolean Laws, Duality Principle, De-Morgan Theorems & Algebraic Reduction',
        topics: [
          {
            id: 'topic-2-4-1',
            subjectId: 'digital-technique',
            unitId: 'dt-unit-2',
            chapterId: 'dt-chap-2-4',
            title: "Boolean Laws, Duality & De-Morgan Theorems",
            description: "Simplification of complex digital logic expressions using Boolean laws, Duality theorem, and De-Morgan's dual theorems.",
            estimatedTime: '15 mins',
            difficulty: 'Hard',
            badge: 'Core Theory ⭐',
            conceptSummary: "Boolean algebra provides algebraic laws to simplify logic circuits. Key laws: Identity (A+0=A, A·1=A), Null (A+1=1, A·0=0), Idempotent (A+A=A, A·A=A), Complement (A+A'=1, A·A'=0), Absorption (A+AB=A, A+A'B=A+B). Duality Theorem states interchanging (+) with (·) and 0 with 1 yields a valid dual. De-Morgan 1st: (A·B)' = A' + B'. De-Morgan 2nd: (A+B)' = A'·B'.",
            conceptAnimationType: 'boolean-diagram',

            diagramSteps: [
              { label: "De-Morgan's 1st Theorem", description: '(A · B)\' = A\' + B\'', subtext: 'NAND gate is equivalent to Bubbled OR gate!' },
              { label: "De-Morgan's 2nd Theorem", description: '(A + B)\' = A\' · B\'', subtext: 'NOR gate is equivalent to Bubbled AND gate!' },
              { label: 'Duality Principle', description: 'Interchange (+) ↔ (·) and 0 ↔ 1', subtext: 'e.g. Dual of A + 0 = A is A · 1 = A' },
              { label: 'Absorption Law', description: 'A + A · B = A, A + A\' · B = A + B', subtext: 'Eliminates redundant terms' },
            ],

            memoryTricks: [
              {
                title: "💡 De-Morgan & Duality Quick Rules",
                content: '"Break the line, change the sign!"\nOverline over AND (·) becomes OR (+) between inverted variables.\nOverline over OR (+) becomes AND (·) between inverted variables.\nDuality: Replace + with · and 0 with 1 (DO NOT invert variables!).',
                mnemonics: ['NAND = Bubbled OR', 'NOR = Bubbled AND', 'Duality = Swap ops, KEEP variables!'],
              },
            ],

            realLifeExamples: [
              { title: 'Logic Gate Minimization in Microchips', description: 'Boolean algebra reduces gate counts from hundreds to tens, saving silicon die space and power.', icon: '🔬' },
            ],

            flashcards: [
              { id: 'fc-bool-1', front: "State De Morgan's First Theorem.", back: "(A · B)' = A' + B' (The complement of a product equals the sum of individual complements)." },
              { id: 'fc-bool-2', front: "State De Morgan's Second Theorem.", back: "(A + B)' = A' · B' (The complement of a sum equals the product of individual complements)." },
              { id: 'fc-bool-3', front: 'What is the Duality Principle?', back: 'Interchanging AND (·) with OR (+), and 0 with 1, yields another valid Boolean identity.' },
            ],

            importantExamPoints: {
              definitions: [
                'De-Morgan\'s 1st Theorem: (A · B)\' = A\' + B\'',
                'De-Morgan\'s 2nd Theorem: (A + B)\' = A\' · B\'',
                'Duality Principle: Any true Boolean relation remains true if (+) and (·) are interchanged, and 0 and 1 are interchanged.',
              ],
              formulas: [
                'Identity: A + 0 = A, A · 1 = A',
                'Null: A + 1 = 1, A · 0 = 0',
                'Idempotent: A + A = A, A · A = A',
                'Complement: A + A\' = 1, A · A\' = 0',
                'Absorption: A + AB = A, A(A + B) = A, A + A\'B = A + B',
              ],
              theoremsRules: [
                'Rule 1: Always break long overbar complement lines first when simplifying.',
                'Rule 2: Factor common variables to apply A + A\' = 1.',
              ],
              expectedQuestions: [
                'State and prove De-Morgan\'s Theorems using Truth Tables. [6 Marks]',
                'State the Duality Theorem. Write the dual of A + A\'B = A + B. [4 Marks]',
                'Simplify the Boolean expression: Y = A\'B\'C + A\'BC + AB\'C + ABC. [4 Marks]',
              ],
            },

            commonMistakes: [
              {
                wrong: "Inverting variables when finding the Dual of an expression",
                correct: "Duality ONLY swaps operators (+ ↔ ·) and constants (0 ↔ 1); variables are NOT complemented!",
                explanation: "Dual of A + 0 = A is A · 1 = A. Dual of A + A'B = A + B is A · (A' + B) = A · B.",
              },
            ],

            quickRevision: {
              keyTakeaway: 'De-Morgan: (A·B)\'=A\'+B\', (A+B)\'=A\'·B\'. Duality: Swap + and ·. Absorption: A + AB = A.',
              bulletPoints: [
                'A + A\' = 1',
                'A · A\' = 0',
                'Double inversion: (A\')\' = A',
              ],
            },

            practiceProblems: [
              {
                id: 'p-bool-1',
                problem: 'Simplify Y = A + A\'B + A\'B\'',
                solutionSteps: [
                  'Step 1: Group last two terms: A\'B + A\'B\' = A\'(B + B\')',
                  'Step 2: Since B + B\' = 1, this becomes A\'(1) = A\'',
                  'Step 3: Expression simplifies to Y = A + A\'',
                  'Step 4: Since A + A\' = 1, result is 1.',
                ],
                finalAnswer: 'Y = 1',
              },
            ],

            animatedSummary: {
              concept: 'Boolean algebra reduces complex logic equations into minimal gate realizations.',
              rule: 'Break the complement line and flip the operator (AND ↔ OR). Swap + and · for Duality.',
              example: '(A + B · C)\' = A\' · (B · C)\' = A\' · (B\' + C\').',
              examTip: 'Always construct truth table side-by-side to prove algebraic simplifications!',
            },

            microQuiz: [
              {
                id: 'q-bool-1',
                question: "What is (A · B)' equal to according to De Morgan's theorem?",
                options: ["A' · B'", "A' + B'", "(A + B)'", "A + B"],
                correctAnswer: 1,
                explanation: "(A · B)' = A' + B'.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const ANALOG_ELECTRONICS_UNITS: Unit[] = [];

export const ALL_EXAM_NOTES_UNITS: Unit[] = [
  ...DIGITAL_TECHNIQUE_UNITS,
  ...ANALOG_ELECTRONICS_UNITS,
];
