export interface PracticeProblemItem {
  id: string;
  categoryId: string;
  categoryName: string;
  chapterId: string;
  chapterName: string;
  problem: string;
  expectedAnswer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solutionSteps: string[];
}

export const CONVERSION_CATEGORIES = [
  { id: 'dec-bin', name: 'Decimal → Binary', count: 10, icon: '🔢' },
  { id: 'bin-dec', name: 'Binary → Decimal', count: 10, icon: '🔢' },
  { id: 'dec-oct', name: 'Decimal → Octal', count: 10, icon: '🎱' },
  { id: 'oct-dec', name: 'Octal → Decimal', count: 10, icon: '🎱' },
  { id: 'dec-hex', name: 'Decimal → Hexadecimal', count: 10, icon: '🔠' },
  { id: 'hex-dec', name: 'Hexadecimal → Decimal', count: 10, icon: '🔠' },
  { id: 'bin-oct', name: 'Binary → Octal', count: 10, icon: '⚙️' },
  { id: 'bin-hex', name: 'Binary → Hexadecimal', count: 10, icon: '⚙️' },
  { id: 'dec-bcd', name: 'Decimal → BCD (8421)', count: 10, icon: '📟' },
  { id: 'dec-xs3', name: 'Decimal → Excess-3', count: 10, icon: '✨' },
  { id: 'bin-gray', name: 'Binary → Gray Code', count: 10, icon: '🔄' },
  { id: 'gray-bin', name: 'Gray Code → Binary', count: 10, icon: '🔄' },
];

export const PRACTICE_PROBLEMS_BANK: PracticeProblemItem[] = [
  // ── 1. Decimal → Binary (10 Examples) ─────────────────────────────────────
  {
    id: 'db-1', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (13)₁₀ to Binary', expectedAnswer: '1101', difficulty: 'Easy',
    solutionSteps: ['13 ÷ 2 = 6 (rem 1)', '6 ÷ 2 = 3 (rem 0)', '3 ÷ 2 = 1 (rem 1)', '1 ÷ 2 = 0 (rem 1)', 'Read remainders bottom-up (MSB to LSB): 1101₂'],
  },
  {
    id: 'db-2', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (25)₁₀ to Binary', expectedAnswer: '11001', difficulty: 'Easy',
    solutionSteps: ['25 ÷ 2 = 12 (rem 1)', '12 ÷ 2 = 6 (rem 0)', '6 ÷ 2 = 3 (rem 0)', '3 ÷ 2 = 1 (rem 1)', '1 ÷ 2 = 0 (rem 1)', 'Read remainders upward: 11001₂'],
  },
  {
    id: 'db-3', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (45)₁₀ to Binary', expectedAnswer: '101101', difficulty: 'Medium',
    solutionSteps: ['45 ÷ 2 = 22 (rem 1)', '22 ÷ 2 = 11 (rem 0)', '11 ÷ 2 = 5 (rem 1)', '5 ÷ 2 = 2 (rem 1)', '2 ÷ 2 = 1 (rem 0)', '1 ÷ 2 = 0 (rem 1)', 'Read remainders upward: 101101₂'],
  },
  {
    id: 'db-4', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (68)₁₀ to Binary', expectedAnswer: '1000100', difficulty: 'Medium',
    solutionSteps: ['68 ÷ 2 = 34 (rem 0)', '34 ÷ 2 = 17 (rem 0)', '17 ÷ 2 = 8 (rem 1)', '8 ÷ 2 = 4 (rem 0)', '4 ÷ 2 = 2 (rem 0)', '2 ÷ 2 = 1 (rem 0)', '1 ÷ 2 = 0 (rem 1)', 'Result: 1000100₂'],
  },
  {
    id: 'db-5', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (99)₁₀ to Binary', expectedAnswer: '1100011', difficulty: 'Medium',
    solutionSteps: ['99 = 64 + 32 + 2 + 1 = 2⁶ + 2⁵ + 2¹ + 2⁰', 'Binary representation: 1100011₂'],
  },
  {
    id: 'db-6', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (128)₁₀ to Binary', expectedAnswer: '10000000', difficulty: 'Easy',
    solutionSteps: ['128 is 2⁷', 'Setting 7th bit position to 1: 10000000₂'],
  },
  {
    id: 'db-7', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (150)₁₀ to Binary', expectedAnswer: '10010110', difficulty: 'Hard',
    solutionSteps: ['150 ÷ 2 = 75 (rem 0)', '75 ÷ 2 = 37 (rem 1)', '37 ÷ 2 = 18 (rem 1)', '18 ÷ 2 = 9 (rem 0)', '9 ÷ 2 = 4 (rem 1)', '4 ÷ 2 = 2 (rem 0)', '2 ÷ 2 = 1 (rem 0)', '1 ÷ 2 = 0 (rem 1)', 'Result: 10010110₂'],
  },
  {
    id: 'db-8', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (200)₁₀ to Binary', expectedAnswer: '11001000', difficulty: 'Hard',
    solutionSteps: ['200 = 128 + 64 + 8', '2⁷ + 2⁶ + 2³ = 11001000₂'],
  },
  {
    id: 'db-9', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (255)₁₀ to Binary', expectedAnswer: '11111111', difficulty: 'Easy',
    solutionSteps: ['255 = 2⁸ - 1', 'All 8 bits are 1: 11111111₂'],
  },
  {
    id: 'db-10', categoryId: 'dec-bin', categoryName: 'Decimal → Binary',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert (512)₁₀ to Binary', expectedAnswer: '1000000000', difficulty: 'Hard',
    solutionSteps: ['512 = 2⁹', '1 followed by 9 zeros: 1000000000₂'],
  },

  // ── 2. Binary → Decimal (10 Examples) ─────────────────────────────────────
  {
    id: 'bd-1', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 1010₂ to Decimal', expectedAnswer: '10', difficulty: 'Easy',
    solutionSteps: ['(1×2³) + (0×2²) + (1×2¹) + (0×2⁰)', '8 + 0 + 2 + 0 = 10₁₀'],
  },
  {
    id: 'bd-2', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 1111₂ to Decimal', expectedAnswer: '15', difficulty: 'Easy',
    solutionSteps: ['8 + 4 + 2 + 1 = 15₁₀'],
  },
  {
    id: 'bd-3', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 10101₂ to Decimal', expectedAnswer: '21', difficulty: 'Easy',
    solutionSteps: ['16 + 0 + 4 + 0 + 1 = 21₁₀'],
  },
  {
    id: 'bd-4', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 11011₂ to Decimal', expectedAnswer: '27', difficulty: 'Medium',
    solutionSteps: ['16 + 8 + 0 + 2 + 1 = 27₁₀'],
  },
  {
    id: 'bd-5', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 100000₂ to Decimal', expectedAnswer: '32', difficulty: 'Easy',
    solutionSteps: ['2⁵ = 32₁₀'],
  },
  {
    id: 'bd-6', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 101100₂ to Decimal', expectedAnswer: '44', difficulty: 'Medium',
    solutionSteps: ['32 + 8 + 4 = 44₁₀'],
  },
  {
    id: 'bd-7', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 1111000₂ to Decimal', expectedAnswer: '120', difficulty: 'Hard',
    solutionSteps: ['64 + 32 + 16 + 8 = 120₁₀'],
  },
  {
    id: 'bd-8', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 1001011₂ to Decimal', expectedAnswer: '75', difficulty: 'Hard',
    solutionSteps: ['64 + 8 + 2 + 1 = 75₁₀'],
  },
  {
    id: 'bd-9', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 11001100₂ to Decimal', expectedAnswer: '204', difficulty: 'Hard',
    solutionSteps: ['128 + 64 + 8 + 4 = 204₁₀'],
  },
  {
    id: 'bd-10', categoryId: 'bin-dec', categoryName: 'Binary → Decimal',
    chapterId: 'dt-chap-1-1', chapterName: 'Chapter 1.1: Number Systems',
    problem: 'Convert 11111111₂ to Decimal', expectedAnswer: '255', difficulty: 'Easy',
    solutionSteps: ['128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255₁₀'],
  },

  // ── 3. Decimal → BCD (10 Examples) ───────────────────────────────────────
  {
    id: 'bcd-1', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 25 to BCD', expectedAnswer: '0010 0101', difficulty: 'Easy',
    solutionSteps: ['2 → 0010_BCD', '5 → 0101_BCD', 'Result: 0010 0101₂_BCD'],
  },
  {
    id: 'bcd-2', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 49 to BCD', expectedAnswer: '0100 1001', difficulty: 'Easy',
    solutionSteps: ['4 → 0100', '9 → 1001', 'Result: 0100 1001_BCD'],
  },
  {
    id: 'bcd-3', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 73 to BCD', expectedAnswer: '0111 0011', difficulty: 'Easy',
    solutionSteps: ['7 → 0111', '3 → 0011', 'Result: 0111 0011_BCD'],
  },
  {
    id: 'bcd-4', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 86 to BCD', expectedAnswer: '1000 0110', difficulty: 'Medium',
    solutionSteps: ['8 → 1000', '6 → 0110', 'Result: 1000 0110_BCD'],
  },
  {
    id: 'bcd-5', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 105 to BCD', expectedAnswer: '0001 0000 0101', difficulty: 'Medium',
    solutionSteps: ['1 → 0001', '0 → 0000', '5 → 0101', 'Result: 0001 0000 0101_BCD'],
  },
  {
    id: 'bcd-6', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 248 to BCD', expectedAnswer: '0010 0100 1000', difficulty: 'Medium',
    solutionSteps: ['2 → 0010', '4 → 0100', '8 → 1000', 'Result: 0010 0100 1000_BCD'],
  },
  {
    id: 'bcd-7', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 395 to BCD', expectedAnswer: '0011 1001 0101', difficulty: 'Hard',
    solutionSteps: ['3 → 0011', '9 → 1001', '5 → 0101', 'Result: 0011 1001 0101_BCD'],
  },
  {
    id: 'bcd-8', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 612 to BCD', expectedAnswer: '0110 0001 0010', difficulty: 'Hard',
    solutionSteps: ['6 → 0110', '1 → 0001', '2 → 0010', 'Result: 0110 0001 0010_BCD'],
  },
  {
    id: 'bcd-9', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 780 to BCD', expectedAnswer: '0111 1000 0000', difficulty: 'Hard',
    solutionSteps: ['7 → 0111', '8 → 1000', '0 → 0000', 'Result: 0111 1000 0000_BCD'],
  },
  {
    id: 'bcd-10', categoryId: 'dec-bcd', categoryName: 'Decimal → BCD (8421)',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 999 to BCD', expectedAnswer: '1001 1001 1001', difficulty: 'Hard',
    solutionSteps: ['9 → 1001', '9 → 1001', '9 → 1001', 'Result: 1001 1001 1001_BCD'],
  },

  // ── 4. Decimal → Excess-3 (10 Examples) ──────────────────────────────────
  {
    id: 'xs-1', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 4 to Excess-3', expectedAnswer: '0111', difficulty: 'Easy',
    solutionSteps: ['4 + 3 = 7', 'Convert 7 to binary: 0111₂_XS3'],
  },
  {
    id: 'xs-2', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 9 to Excess-3', expectedAnswer: '1100', difficulty: 'Easy',
    solutionSteps: ['9 + 3 = 12', 'Convert 12 to binary: 1100₂_XS3'],
  },
  {
    id: 'xs-3', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 25 to Excess-3', expectedAnswer: '0101 1000', difficulty: 'Medium',
    solutionSteps: ['2 + 3 = 5 (0101)', '5 + 3 = 8 (1000)', 'Result: 0101 1000_XS3'],
  },
  {
    id: 'xs-4', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 38 to Excess-3', expectedAnswer: '0110 1011', difficulty: 'Medium',
    solutionSteps: ['3 + 3 = 6 (0110)', '8 + 3 = 11 (1011)', 'Result: 0110 1011_XS3'],
  },
  {
    id: 'xs-5', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 47 to Excess-3', expectedAnswer: '0111 1010', difficulty: 'Medium',
    solutionSteps: ['4 + 3 = 7 (0111)', '7 + 3 = 10 (1010)', 'Result: 0111 1010_XS3'],
  },
  {
    id: 'xs-6', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 61 to Excess-3', expectedAnswer: '1001 0100', difficulty: 'Medium',
    solutionSteps: ['6 + 3 = 9 (1001)', '1 + 3 = 4 (0100)', 'Result: 1001 0100_XS3'],
  },
  {
    id: 'xs-7', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 82 to Excess-3', expectedAnswer: '1011 0101', difficulty: 'Hard',
    solutionSteps: ['8 + 3 = 11 (1011)', '2 + 3 = 5 (0101)', 'Result: 1011 0101_XS3'],
  },
  {
    id: 'xs-8', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 149 to Excess-3', expectedAnswer: '0100 0111 1100', difficulty: 'Hard',
    solutionSteps: ['1 + 3 = 4 (0100)', '4 + 3 = 7 (0111)', '9 + 3 = 12 (1100)', 'Result: 0100 0111 1100_XS3'],
  },
  {
    id: 'xs-9', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 506 to Excess-3', expectedAnswer: '1000 0011 1001', difficulty: 'Hard',
    solutionSteps: ['5 + 3 = 8 (1000)', '0 + 3 = 3 (0011)', '6 + 3 = 9 (1001)', 'Result: 1000 0011 1001_XS3'],
  },
  {
    id: 'xs-10', categoryId: 'dec-xs3', categoryName: 'Decimal → Excess-3',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Decimal 777 to Excess-3', expectedAnswer: '1010 1010 1010', difficulty: 'Hard',
    solutionSteps: ['7 + 3 = 10 (1010)', '7 + 3 = 10 (1010)', '7 + 3 = 10 (1010)', 'Result: 1010 1010 1010_XS3'],
  },

  // ── 5. Binary → Gray Code (10 Examples) ──────────────────────────────────
  {
    id: 'bg-1', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 1010 to Gray Code', expectedAnswer: '1111', difficulty: 'Easy',
    solutionSteps: ['G3 = B3 = 1', 'G2 = B3 ⊕ B2 = 1 ⊕ 0 = 1', 'G1 = B2 ⊕ B1 = 0 ⊕ 1 = 1', 'G0 = B1 ⊕ B0 = 1 ⊕ 0 = 1', 'Result: 1111_Gray'],
  },
  {
    id: 'bg-2', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 1101 to Gray Code', expectedAnswer: '1011', difficulty: 'Easy',
    solutionSteps: ['G3 = 1', 'G2 = 1 ⊕ 1 = 0', 'G1 = 1 ⊕ 0 = 1', 'G0 = 0 ⊕ 1 = 1', 'Result: 1011_Gray'],
  },
  {
    id: 'bg-3', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 1111 to Gray Code', expectedAnswer: '1000', difficulty: 'Easy',
    solutionSteps: ['G3 = 1', 'G2 = 1 ⊕ 1 = 0', 'G1 = 1 ⊕ 1 = 0', 'G0 = 1 ⊕ 1 = 0', 'Result: 1000_Gray'],
  },
  {
    id: 'bg-4', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 1001 to Gray Code', expectedAnswer: '1101', difficulty: 'Medium',
    solutionSteps: ['G3 = 1', 'G2 = 1 ⊕ 0 = 1', 'G1 = 0 ⊕ 0 = 0', 'G0 = 0 ⊕ 1 = 1', 'Result: 1101_Gray'],
  },
  {
    id: 'bg-5', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 0110 to Gray Code', expectedAnswer: '0101', difficulty: 'Medium',
    solutionSteps: ['G3 = 0', 'G2 = 0 ⊕ 1 = 1', 'G1 = 1 ⊕ 1 = 0', 'G0 = 1 ⊕ 0 = 1', 'Result: 0101_Gray'],
  },
  {
    id: 'bg-6', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 10101 to Gray Code', expectedAnswer: '11111', difficulty: 'Medium',
    solutionSteps: ['G4 = 1', 'G3 = 1 ⊕ 0 = 1', 'G2 = 0 ⊕ 1 = 1', 'G1 = 1 ⊕ 0 = 1', 'G0 = 0 ⊕ 1 = 1', 'Result: 11111_Gray'],
  },
  {
    id: 'bg-7', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 11000 to Gray Code', expectedAnswer: '10100', difficulty: 'Hard',
    solutionSteps: ['G4 = 1', 'G3 = 1 ⊕ 1 = 0', 'G2 = 1 ⊕ 0 = 1', 'G1 = 0 ⊕ 0 = 0', 'G0 = 0 ⊕ 0 = 0', 'Result: 10100_Gray'],
  },
  {
    id: 'bg-8', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 10001 to Gray Code', expectedAnswer: '11001', difficulty: 'Hard',
    solutionSteps: ['G4 = 1', 'G3 = 1 ⊕ 0 = 1', 'G2 = 0 ⊕ 0 = 0', 'G1 = 0 ⊕ 0 = 0', 'G0 = 0 ⊕ 1 = 1', 'Result: 11001_Gray'],
  },
  {
    id: 'bg-9', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 11101 to Gray Code', expectedAnswer: '10011', difficulty: 'Hard',
    solutionSteps: ['G4 = 1', 'G3 = 1 ⊕ 1 = 0', 'G2 = 1 ⊕ 1 = 0', 'G1 = 1 ⊕ 0 = 1', 'G0 = 0 ⊕ 1 = 1', 'Result: 10011_Gray'],
  },
  {
    id: 'bg-10', categoryId: 'bin-gray', categoryName: 'Binary → Gray Code',
    chapterId: 'dt-chap-1-4', chapterName: 'Chapter 1.4: Digital Codes',
    problem: 'Convert Binary 101101 to Gray Code', expectedAnswer: '111011', difficulty: 'Hard',
    solutionSteps: ['G5 = 1', 'G4 = 1 ⊕ 0 = 1', 'G3 = 0 ⊕ 1 = 1', 'G2 = 1 ⊕ 1 = 0', 'G1 = 1 ⊕ 0 = 1', 'G0 = 0 ⊕ 1 = 1', 'Result: 111011_Gray'],
  },
];
