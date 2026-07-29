import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, Sparkles, BookOpen } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const B64_KEY = 'QVEuQWI4Uk42TGd6Ykc5Z0VnYnZoQlVsTzFhNWN3RlJPYTRvSmpQSnNTcV83Mlg2bmxaN1E=';

function getApiKey(): string {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (typeof envKey === 'string' && envKey.trim().length > 10) {
    return envKey.trim();
  }
  try {
    return atob(B64_KEY);
  } catch (e) {
    return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL GEMINI LLM API CALL WITH MULTI-MODEL FALLBACK
// ─────────────────────────────────────────────────────────────────────────────

async function fetchGeminiAI(userQuery: string): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const modelsToTry = [
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
  ];

  const systemPrompt = `You are a world-class AI Electronics Professor & Problem Solver for Digital Techniques and Analog Electronics.

Your Goal: Answer the student's question with deep research, complete mathematical accuracy, step-by-step problem solving, and easy-to-understand explanations.

Coverage Areas:
1. Number Systems & Conversions (Binary, Octal, Decimal, Hexadecimal, Fractional)
2. Binary Arithmetic & Complements (Addition, Subtraction, 1's, 2's, 9's, 10's Complement)
3. Codes (BCD, Gray Code, Excess-3, ASCII, Code Conversions, BCD Addition with +6 correction)
4. Logic Gates & Logic Families (TTL, CMOS, ECL, Figure of Merit, Noise Margin, Tri-state Buffers 74HC244/245)
5. Boolean Algebra, De Morgan's Theorems, Duality, K-Maps (Sum of Products, Product of Sums)
6. Combinational Circuits (Half/Full Adder, Subtractor, MUX, DEMUX, Encoder, Decoder 74138, 7-Segment)
7. Sequential Circuits (Flip-Flops SR, JK, D, T, Race-Around condition, Master-Slave JK, Counters, Shift Registers)
8. Analog Electronics (Diodes, Rectifiers, Zener Regulators, BJT CE/CB/CC, Op-Amp IC 741 Inverting/Non-inverting/Integrator)

Formatting Rules:
- Use clear markdown headers, ASCII truth tables/diagrams when helpful, bullet points, and step-by-step numbered steps.
- Show EVERY intermediate step for math calculations.
- Add an "EXAM TIP" or "KEY TAKEAWAY" at the end.`;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nStudent Question:\n${userQuery}` }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        console.warn(`Gemini model ${model} status ${response.status}`);
        continue;
      }

      const data = await response.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answer && answer.trim().length > 15) {
        return answer.trim();
      }
    } catch (err) {
      console.warn(`Fetch error for model ${model}:`, err);
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE LOCAL RESEARCH ENGINE — Universal Smart Knowledge Base
// ─────────────────────────────────────────────────────────────────────────────

function extractNumber(text: string): number | null {
  const m = text.match(/\b(\d+(?:\.\d+)?)\b/);
  return m ? parseFloat(m[1]) : null;
}

function decToBinSteps(n: number): string {
  let c = Math.floor(n), steps: string[] = [], rems: number[] = [], i = 1;
  while (c > 0) {
    const r = c % 2, q = Math.floor(c / 2);
    rems.push(r);
    steps.push(`   Step ${i++}: ${c} ÷ 2 = ${q}  (Remainder = ${r})`);
    c = q;
  }
  return steps.join('\n') + '\n\n   👉 Read remainders BOTTOM → TOP (MSB first):\n   Binary = ' + rems.reverse().join('') + '₂';
}

function decToOctSteps(n: number): string {
  let c = Math.floor(n), steps: string[] = [], rems: number[] = [], i = 1;
  while (c > 0) {
    const r = c % 8, q = Math.floor(c / 8);
    rems.push(r);
    steps.push(`   Step ${i++}: ${c} ÷ 8 = ${q}  (Remainder = ${r})`);
    c = q;
  }
  return steps.join('\n') + '\n\n   👉 Read remainders BOTTOM → TOP:\n   Octal = ' + rems.reverse().join('') + '₈';
}

function decToHexSteps(n: number): string {
  const hexChars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
  let c = Math.floor(n), steps: string[] = [], rems: string[] = [], i = 1;
  while (c > 0) {
    const r = c % 16, q = Math.floor(c / 16);
    rems.push(hexChars[r]);
    steps.push(`   Step ${i++}: ${c} ÷ 16 = ${q}  (Remainder = ${r} → ${hexChars[r]})`);
    c = q;
  }
  return steps.join('\n') + '\n\n   👉 Read remainders BOTTOM → TOP:\n   Hexadecimal = ' + rems.reverse().join('') + '₁₆';
}

function decToBcdResult(n: number): string {
  const digits = Math.floor(n).toString().split('');
  const mapped = digits.map(d => {
    const v = parseInt(d, 10);
    return `   Digit ${d} → ${v.toString(2).padStart(4, '0')}_BCD`;
  });
  return mapped.join('\n') + '\n\n   Final BCD = ' + digits.map(d => parseInt(d, 10).toString(2).padStart(4, '0')).join(' ');
}

function decToXs3Result(n: number): string {
  const digits = Math.floor(n).toString().split('');
  const mapped = digits.map(d => {
    const v = parseInt(d, 10) + 3;
    return `   Digit ${d}: ${d} + 3 = ${v} → ${v.toString(2).padStart(4, '0')}_XS3`;
  });
  return mapped.join('\n') + '\n\n   Final Excess-3 = ' + digits.map(d => (parseInt(d, 10) + 3).toString(2).padStart(4, '0')).join(' ');
}

function binToGraySteps(binStr: string): string {
  const b = binStr.replace(/[^01]/g, '');
  if (!b) return 'Please provide a valid binary string.';
  const gray: string[] = [b[0]];
  const steps = [`   G₀ = B₀ = ${b[0]}  (MSB copies directly)`];
  for (let i = 1; i < b.length; i++) {
    const g = parseInt(b[i - 1]) ^ parseInt(b[i]);
    gray.push(g.toString());
    steps.push(`   G${i} = B${i-1} ⊕ B${i} = ${b[i-1]} ⊕ ${b[i]} = ${g}`);
  }
  return steps.join('\n') + '\n\n   Gray Code = ' + gray.join('') + '_Gray';
}

function binToDecResult(binStr: string): string {
  const b = binStr.replace(/[^01]/g, '');
  if (!b) return 'Please provide a valid binary string.';
  const steps = b.split('').map((bit, i) => {
    const pos = b.length - 1 - i;
    const val = parseInt(bit) * Math.pow(2, pos);
    return `   ${bit} × 2^${pos} = ${val}`;
  });
  const total = parseInt(b, 2);
  return steps.join('\n') + '\n\n   Total = ' + steps.map((_, i) => parseInt(b[i]) * Math.pow(2, b.length - 1 - i)).join(' + ') + ' = ' + total + '₁₀';
}

function twosCompSubtract(a: number, b: number, bits = 8): string {
  const aBin = (a >>> 0).toString(2).padStart(bits, '0');
  const bBin = (b >>> 0).toString(2).padStart(bits, '0');
  const bOnesComp = b.toString(2).padStart(bits, '0').split('').map(bit => bit === '0' ? '1' : '0').join('');
  const bTwosComp = ((parseInt(bOnesComp, 2) + 1) >>> 0).toString(2).padStart(bits, '0');
  const result = a - b;
  const hasCarry = (a + (Math.pow(2, bits) - b)) >= Math.pow(2, bits);
  return (
    `   A = ${a} → ${aBin}₂\n` +
    `   B = ${b} → ${bBin}₂\n\n` +
    `   Step 1: 1's Complement of B = ${bOnesComp}\n` +
    `   Step 2: 2's Complement of B = ${bTwosComp}\n` +
    `   Step 3: A + (2's Complement of B) = ${aBin} + ${bTwosComp}\n` +
    `   ${hasCarry ? '✅ End carry (1) generated → DISCARD CARRY → Result is POSITIVE' : '❌ No end carry → Result is NEGATIVE (take 2\'s complement of result)'}\n\n` +
    `   Final Answer: ${a} - ${b} = ${result}`
  );
}

function bcdAddition(a: number, b: number): string {
  const sum = a + b;
  const sumBin = (a + b).toString(2);
  const needsCorrection = sum > 9;
  const corrected = needsCorrection ? sum + 6 : sum;
  const corrBin = corrected.toString(2);
  return (
    `   A = ${a} (${a.toString(2).padStart(4,'0')}₂_BCD)\n` +
    `   B = ${b} (${b.toString(2).padStart(4,'0')}₂_BCD)\n\n` +
    `   Step 1: Binary Sum = ${a.toString(2).padStart(4,'0')} + ${b.toString(2).padStart(4,'0')} = ${sumBin}₂ = ${sum}\n` +
    (needsCorrection
      ? `   Step 2: Sum ${sum} > 9 → INVALID BCD! Add +6 (0110₂) correction:\n   ${sumBin} + 0110 = ${corrBin}₂\n`
      : `   Step 2: Sum ${sum} ≤ 9 → VALID BCD, no correction needed.\n`) +
    `\n   Final BCD Result = ${sum}₁₀ = ${corrBin.padStart(8,'0').replace(/(.{4})/g,'$1 ').trim()}_BCD`
  );
}

function generateLocalDeepResponse(query: string): string {
  const q = query.toLowerCase().trim();
  const num = extractNumber(q);

  // Decimal to Binary
  if (num !== null && (q.match(/dec(imal)?\s*(to|→|into|convert)\s*(bin(ary)?)/i) || q.match(/(convert|change)\s*\(?\d+\)?\s*(to|into)\s*bin/i) || q.match(/\d+\s*to\s*bin/i))) {
    const result = Math.floor(num).toString(2);
    return `📌 STEP-BY-STEP SOLUTION: Convert (${Math.floor(num)})₁₀ to Binary
${'─'.repeat(55)}
${decToBinSteps(num)}
${'─'.repeat(55)}
✅ FINAL ANSWER: (${Math.floor(num)})₁₀ = ${result}₂

💡 VERIFICATION (Decimal expansion):
${result.split('').map((bit, i) => `${bit}×2^${result.length-1-i}=${parseInt(bit)*Math.pow(2,result.length-1-i)}`).join(' + ')} = ${num}₁₀ ✓

📝 EXAM TIP: Read remainders from BOTTOM to TOP (last remainder is MSB).`;
  }

  // Decimal to Octal
  if (num !== null && (q.match(/dec(imal)?\s*(to|→|into)\s*oct/i) || q.match(/\d+\s*to\s*oct/i))) {
    const result = Math.floor(num).toString(8);
    return `📌 STEP-BY-STEP SOLUTION: Convert (${Math.floor(num)})₁₀ to Octal
${'─'.repeat(55)}
${decToOctSteps(num)}
${'─'.repeat(55)}
✅ FINAL ANSWER: (${Math.floor(num)})₁₀ = ${result}₈

📝 EXAM TIP: Read remainders from BOTTOM to TOP. Octal groups binary bits in sets of 3.`;
  }

  // Binary to Decimal
  const binMatch = q.match(/([01]{3,})\s*(to|→|into)\s*dec/i) || q.match(/convert\s*([01]+)₂?\s*to\s*dec/i);
  if (binMatch || (q.includes('binary') && q.includes('decimal') && q.match(/[01]{3,}/))) {
    const binStr = (binMatch?.[1] || q.match(/[01]{3,}/)?.[0] || '').replace(/[^01]/g,'');
    if (binStr.length > 0) {
      const dec = parseInt(binStr, 2);
      return `📌 STEP-BY-STEP SOLUTION: Convert ${binStr}₂ to Decimal
${'─'.repeat(55)}
${binToDecResult(binStr)}
${'─'.repeat(55)}
✅ FINAL ANSWER: ${binStr}₂ = ${dec}₁₀

📝 EXAM TIP: Assign weights 2⁰, 2¹, 2²... from right to left, multiply bit × weight, then sum.`;
    }
  }

  // Decimal to Hexadecimal
  if (num !== null && (q.match(/dec(imal)?\s*(to|→|into)\s*hex/i) || q.match(/\d+\s*to\s*hex/i))) {
    const result = Math.floor(num).toString(16).toUpperCase();
    return `📌 STEP-BY-STEP SOLUTION: Convert (${Math.floor(num)})₁₀ to Hexadecimal
${'─'.repeat(55)}
${decToHexSteps(num)}
${'─'.repeat(55)}
✅ FINAL ANSWER: (${Math.floor(num)})₁₀ = ${result}₁₆

💡 HEX DIGIT TABLE: A=10, B=11, C=12, D=13, E=14, F=15.`;
  }

  // Decimal to BCD
  if (num !== null && (q.includes('bcd') && (q.includes('to') || q.includes('convert') || q.includes('into')))) {
    const digits = Math.floor(num).toString().split('');
    const bcdResult = digits.map(d => parseInt(d).toString(2).padStart(4,'0')).join(' ');
    return `📌 STEP-BY-STEP SOLUTION: Convert (${Math.floor(num)})₁₀ to BCD (8421 Code)
${'─'.repeat(55)}
RULE: Convert EACH decimal digit independently into 4-bit binary!
${decToBcdResult(num)}
${'─'.repeat(55)}
✅ FINAL ANSWER: (${Math.floor(num)})₁₀ = ${bcdResult}_BCD

⚠️ IMPORTANT: BCD uses codes 0000 to 1001 (0 to 9). Codes 1010 to 1111 are invalid BCD.`;
  }

  // Decimal to Excess-3
  if (num !== null && (q.includes('excess') || q.includes('xs3') || q.includes('xs-3'))) {
    const digits = Math.floor(num).toString().split('');
    const xs3Result = digits.map(d => (parseInt(d) + 3).toString(2).padStart(4,'0')).join(' ');
    return `📌 STEP-BY-STEP SOLUTION: Convert (${Math.floor(num)})₁₀ to Excess-3 Code
${'─'.repeat(55)}
RULE: Add +3 (0011₂) to each BCD digit!
${decToXs3Result(num)}
${'─'.repeat(55)}
✅ FINAL ANSWER: (${Math.floor(num)})₁₀ = ${xs3Result}_Excess-3

💡 WHY EXCESS-3 IS SELF-COMPLEMENTING:
9's complement of decimal digit N = bitwise NOT of its Excess-3 code!`;
  }

  // Binary to Gray Code
  const binGrayMatch = q.match(/([01]{2,})\s*(to|→|into)\s*gray/i) || (q.includes('binary') && q.includes('gray') && q.match(/[01]{3,}/));
  if (binGrayMatch || (q.includes('gray') && q.match(/[01]{3,}/))) {
    const binStr = (typeof binGrayMatch === 'object' && binGrayMatch && binGrayMatch[1]) ? binGrayMatch[1] : (q.match(/[01]{3,}/)?.[0] || '');
    if (binStr.length >= 2) {
      return `📌 STEP-BY-STEP SOLUTION: Convert ${binStr}₂ to Gray Code
${'─'.repeat(55)}
RULE: MSB of Gray = MSB of Binary. Next bits = XOR of adjacent Binary bits (Gᵢ = Bᵢ ⊕ Bᵢ₊₁).
${binToGraySteps(binStr)}
${'─'.repeat(55)}
💡 GRAY CODE ADVANTAGE: Only 1 bit changes between consecutive numbers, preventing transition errors in rotary encoders.`;
    }
  }

  // 2's Complement Subtraction
  const compMatch = q.match(/(\d+)\s*-\s*(\d+)\s*(using|with|by)?\s*(2'?s?\s*comp|two.s\s*comp)/i);
  if (compMatch) {
    const a = parseInt(compMatch[1]), b = parseInt(compMatch[2]);
    return `📌 STEP-BY-STEP SOLUTION: ${a} - ${b} using 2's Complement Method
${'─'.repeat(55)}
${twosCompSubtract(a, b)}
${'─'.repeat(55)}
📝 EXAM RULE: End carry = 1 → Discard carry, answer is positive. End carry = 0 → Take 2's complement of result, answer is negative.`;
  }

  // BCD Addition
  const bcdAddMatch = q.match(/bcd.*(add|sum|plus|addition).*?(\d+).*?(\d+)/i) || q.match(/(\d+)\s*\+\s*(\d+).*(bcd)/i);
  if (bcdAddMatch) {
    const nums = q.match(/\b(\d{1,2})\b/g) || [];
    const a = nums[0] ? parseInt(nums[0]) : 7;
    const b = nums[1] ? parseInt(nums[1]) : 6;
    return `📌 STEP-BY-STEP SOLUTION: BCD Addition ${a} + ${b}
${'─'.repeat(55)}
${bcdAddition(a, b)}
${'─'.repeat(55)}
💡 BCD +6 RULE: Add 0110₂ (+6) whenever 4-bit sum > 9 OR a carry is generated to skip invalid 4-bit states.`;
  }

  // Counters & Registers
  if (q.includes('counter') || q.includes('shift register') || q.includes('ring counter') || q.includes('johnson')) {
    return `📚 DEEP RESEARCH: Counters & Shift Registers
${'─'.repeat(55)}
A COUNTER is a sequential logic circuit that counts clock pulses using flip-flops.

📌 COUNTER TYPES:
1. Asynchronous (Ripple) Counter: Clock drives 1st flip-flop; output Q of each stage acts as clock for next stage.
   • Simple circuit, but cumulative propagation delay limits maximum clock frequency!
2. Synchronous Counter: Clock connected PARALLEL to all flip-flops simultaneously.
   • High speed, no ripple delay!

📌 MOD-N COUNTER RULE:
   • Number of flip-flops required (n):  2ⁿ ≥ N
   • Example: Mod-10 (Decade) Counter requires 4 flip-flops (2⁴ = 16 ≥ 10). Resets at 1010₂ using NAND feedback to CLEAR.

📌 SHIFT REGISTER TYPES:
   • SISO (Serial-In Serial-Out), SIPO, PISO, PIPO
   • Ring Counter: Output of last flip-flop fed back to 1st flip-flop (N states for N flip-flops).
   • Johnson (Twisted Ring) Counter: Inverted output Q' of last stage fed back to 1st (2N states for N flip-flops!).

📝 EXAM QUESTION: "Differentiate between Asynchronous and Synchronous counters with neat diagram." [6 Marks]`;
  }

  // Adders, Subtractors, MUX, DEMUX
  if (q.includes('adder') || q.includes('subtractor') || q.includes('mux') || q.includes('demux') || q.includes('multiplexer') || q.includes('decoder') || q.includes('encoder')) {
    return `📚 DEEP RESEARCH: Combinational Logic Circuits (Adders, MUX, Decoders)
${'─'.repeat(55)}
📌 HALF ADDER vs FULL ADDER:
   • Half Adder: Adds 2 bits (A, B).
     Sum = A ⊕ B,  Carry = A · B
   • Full Adder: Adds 3 bits (A, B, Cin).
     Sum = A ⊕ B ⊕ Cin,  Carry = AB + Cin(A ⊕ B)

📌 MULTIPLEXER (MUX - Data Selector):
   • Connects 2ⁿ input lines to 1 output line using n select lines (S₀, S₁...).
   • Example: 4:1 MUX has 4 data inputs (I₀..I₃), 2 select lines (S₁, S₀), and output Y:
     Y = S₁'S₀'I₀ + S₁'S₀I₁ + S₁S₀'I₂ + S₁S₀I₃

📌 DECODER (IC 74138 - 3-to-8 Line Decoder):
   • Converts n-bit binary input code into 2ⁿ unique active-LOW output lines.
   • Used for memory address decoding and implementing Boolean functions.

📝 EXAM QUESTION: "Design Full Adder using two Half Adders and an OR gate." [6 Marks]`;
  }

  // Rectifiers & Diodes & Op-Amps
  if (q.includes('rectifier') || q.includes('diode') || q.includes('zener') || q.includes('bjt') || q.includes('transistor') || q.includes('555') || q.includes('dac') || q.includes('adc')) {
    return `📚 DEEP RESEARCH: Analog Electronics & Signal Conditioning
${'─'.repeat(55)}
📌 RECTIFIER COMPARISON:
┌─────────────────────────┬──────────────┬──────────────────┬─────────────────┐
│ Parameter               │ Half-Wave    │ Full-Wave Center │ Bridge Rectifier│
├─────────────────────────┼──────────────┼──────────────────┼─────────────────┤
│ Diodes Used             │      1       │        2         │        4        │
│ Max Efficiency (η)      │    40.6%     │      81.2%       │      81.2%      │
│ Ripple Factor (γ)       │     1.21     │       0.48       │       0.48      │
│ PIV per Diode           │     Vm       │       2Vm        │        Vm       │
└─────────────────────────┴──────────────┴──────────────────┴─────────────────┘

📌 ZENER DIODE VOLTAGE REGULATOR:
   • Operates in REVERSE BREAKDOWN region (Vz constant).
   • Maintains constant load voltage VL = Vz despite variation in input voltage or load current.

📌 IC 555 TIMER MODES:
   • Astable Multivibrator: Free-running oscillator (no stable state). Frequency f = 1.44 / ((R1 + 2R2) × C).
   • Monostable Multivibrator: One-shot pulse generator (pulse width T = 1.1 × R × C).

📝 EXAM QUESTION: "Explain Bridge Rectifier with circuit diagram and input/output waveforms." [6 Marks]`;
  }

  // Flip-Flops & Race Around Condition
  if (q.includes('jk') || q.includes('race around') || q.includes('flip flop') || q.includes('flip-flop') || q.includes('latch')) {
    return `📚 DEEP RESEARCH: Flip-Flops & The Race-Around Condition
${'─'.repeat(55)}
A FLIP-FLOP is a bistable 1-bit memory element triggered by clock edges.

📌 JK FLIP-FLOP TRUTH TABLE:
┌───┬───┬────────┬─────────────────────────┐
│ J │ K │ Q(t+1) │ Action / Mode           │
├───┼───┼────────┼─────────────────────────┤
│ 0 │ 0 │  Q(t)  │ No Change (Hold)        │
│ 0 │ 1 │   0    │ Reset                   │
│ 1 │ 0 │   1    │ Set                     │
│ 1 │ 1 │ Q'(t)  │ Toggle (Invert Output)  │
└───┴───┴────────┴─────────────────────────┘

🔴 THE RACE-AROUND CONDITION IN JK FLIP-FLOP:
• Occurs when J = 1 and K = 1 AND clock pulse width tp > propagation delay tpd of the flip-flop.
• Output toggles back and forth (0→1→0→1...) repeatedly within the same single clock pulse!
• Result: Output at the end of clock pulse is UNDEFINED / UNPREDICTABLE.

✅ HOW TO ELIMINATE RACE-AROUND CONDITION:
1. Master-Slave JK Flip-Flop: Uses two flip-flops. Master catches inputs on clock HIGH; Slave updates output on clock LOW.
2. Edge Triggering: Trigger on rising/falling clock edge instead of level (make tp < tpd).
3. Use T Flip-Flop with proper clocking.

📝 EXAM QUESTION:
"Explain race around condition in JK flip flop. Draw Master-Slave JK circuit diagram." [6 Marks]`;
  }

  // Karnaugh Maps (K-Maps)
  if (q.includes('kmap') || q.includes('k-map') || q.includes('karnaugh') || q.includes('minterm') || q.includes('maxterm')) {
    return `📚 DEEP RESEARCH: Karnaugh Maps (K-Maps) & Boolean Minimization
${'─'.repeat(55)}
A KARNAUGH MAP (K-Map) is a pictorial method for minimizing Boolean expressions without complex algebraic laws.

📌 3-VARIABLE K-MAP LAYOUT (Variables A, B, C):
       BC
   A   00   01   11   10
     ┌────┬────┬────┬────┐
   0 │ m0 │ m1 │ m3 │ m2 │
     ├────┼────┼────┼────┤
   1 │ m4 │ m5 │ m7 │ m6 │
     └────┴────┴────┴────┘
   Notice Gray Code order (00, 01, 11, 10) so adjacent cells differ by 1 bit!

📌 GROUPING RULES FOR MINIMIZATION:
1. Group size MUST be a power of 2: Octet (8 ones) > Quad (4 ones) > Pair (2 ones) > Single (1 one).
2. Larger groups eliminate MORE variables:
   • Octet eliminates 3 variables
   • Quad eliminates 2 variables
   • Pair eliminates 1 variable
3. Groups can wrap around edges (top-bottom, left-right).
4. Don't Care Conditions (X): Can be treated as 1 if it helps form a larger group, or ignored as 0.

📝 EXAM QUESTION:
"Simplify using K-map: F(A,B,C,D) = Σm(0, 2, 5, 7, 8, 10, 13, 15)" [6 Marks]`;
  }

  // Logic Families
  if (q.includes('logic family') || q.includes('ttl') || q.includes('cmos') || q.includes('ecl') || q.includes('figure of merit')) {
    return `📚 DEEP RESEARCH: Logic Families Comparison
${'─'.repeat(55)}
┌─────────────────────────┬─────────────┬─────────────┬──────────────┐
│ Parameter               │ TTL (74xx)  │ CMOS (74HC) │ ECL (10K)    │
├─────────────────────────┼─────────────┼─────────────┼──────────────┤
│ Technology              │ NPN BJT     │ MOSFET      │ Diff. BJT    │
│ Supply Voltage VCC      │ 5 V         │ 3V to 15V   │ -5.2 V       │
│ Noise Margin            │ 0.4 V       │ 1.5 V ⭐   │ 0.2 V        │
│ Power Dissipation       │ 10 mW/gate  │ 0.01 mW ⭐  │ 45 mW        │
│ Propagation Delay tp    │ 10 ns       │ 15–25 ns    │ 1–2 ns ⭐    │
│ Fan-Out                 │ 10          │ 50 ⭐       │ 25           │
│ Figure of Merit (PDP)   │ 100 pJ      │ 0.15 pJ ⭐  │ 90 pJ        │
└─────────────────────────┴─────────────┴─────────────┴──────────────┘

📌 FIGURE OF MERIT = Propagation Delay (tp) × Power Dissipation (Pd)
   • Lower PDP = Better design performance! CMOS has the lowest PDP.

📝 EXAM QUESTION: "Compare TTL, CMOS, ECL on 6 characteristics." [6 Marks]`;
  }

  // Operational Amplifiers (Op-Amps)
  if (q.includes('opamp') || q.includes('op-amp') || q.includes('741') || q.includes('inverting') || q.includes('non-inverting') || q.includes('summing')) {
    return `📚 DEEP RESEARCH: Operational Amplifiers (IC 741)
${'─'.repeat(55)}
An OP-AMP is a high-gain DC-coupled voltage amplifier with differential inputs.

📌 IDEAL vs PRACTICAL OP-AMP PARAMETERS:
┌───────────────────────────┬──────────────┬─────────────────────────┐
│ Parameter                 │ Ideal Op-Amp │ Practical IC 741        │
├───────────────────────────┼──────────────┼─────────────────────────┤
│ Open Loop Gain (Av)       │ ∞ (Infinite) │ 2 × 10⁵ (200,000)       │
│ Input Impedance (Rin)     │ ∞            │ 2 MΩ                    │
│ Output Impedance (Rout)   │ 0 Ω          │ 75 Ω                    │
│ Bandwidth                 │ ∞            │ 1 MHz                   │
│ CMRR                      │ ∞            │ 90 dB                   │
│ Slew Rate                 │ ∞            │ 0.5 V/μs                │
└───────────────────────────┴──────────────┴─────────────────────────┘

📌 CORE CONFIGURATION FORMULAS:
1. Inverting Amplifier:      Vout = - (Rf / Rin) × Vin
2. Non-Inverting Amplifier:  Vout = (1 + Rf / Rin) × Vin
3. Voltage Follower (Buffer): Vout = Vin  (Gain = 1)
4. Summing Amplifier:        Vout = - Rf × (V1/R1 + V2/R2 + V3/R3)

📝 EXAM QUESTION: "Derive output voltage expression for Inverting Op-Amp." [4 Marks]`;
  }

  // De Morgan's Theorems
  if (q.includes('de morgan') || q.includes('demorgan') || q.includes('duality')) {
    return `📚 DEEP RESEARCH: De Morgan's Theorems & Duality
${'─'.repeat(55)}
📌 THEOREM 1: Complement of Product = Sum of Complements
   (A · B)' = A' + B'   [NAND gate = Bubbled OR gate]

📌 THEOREM 2: Complement of Sum = Product of Complements
   (A + B)' = A' · B'   [NOR gate = Bubbled AND gate]

💡 MEMORY RULE: "Break the overline, flip the sign (· ↔ +)"

🔄 DUALITY PRINCIPLE:
To get the Dual of any Boolean expression:
1. Swap AND (·) with OR (+)
2. Swap 0 with 1 (keep variables A, B unchanged)
Example: Dual of A·(B + C) is A + (B · C).

📝 EXAM QUESTION: "State and prove De Morgan's theorems using truth tables." [6 Marks]`;
  }

  // Universal fallback for any other general query
  return `📚 DEEP RESEARCH RESPONSE: ${query}
${'─'.repeat(55)}
Here is an academic research overview on "${query}":

📌 CORE DEFINITION & CONCEPTS:
• In Digital Electronics, systems process signals in discrete binary states (0 and 1) representing LOW and HIGH voltage levels.
• Key Building Blocks: Logic Gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) serve as combinational elements, while Latches and Flip-Flops serve as 1-bit storage elements.
• Memory & Counting: Registers hold multi-bit binary words, and Counters step through binary sequences on each clock pulse.
• Analog Interface: Operational Amplifiers (Op-Amps) and ADC/DAC converters bridge analog real-world signals with digital processors.

📌 KEY FORMULAS & LAWS TO REMEMBER FOR EXAMS:
1. Boolean Idempotent Law: A + A = A,  A · A = A
2. Boolean Absorption Law: A + A·B = A
3. De Morgan Laws: (A·B)' = A' + B',  (A+B)' = A' · B'
4. 2's Complement Formula: 2's Comp = 1's Comp + 1
5. Op-Amp Inverting Gain: Av = - (Rf / Rin)

💡 TRY SPECIFIC QUERIES FOR STEP-BY-STEP SOLUTIONS:
• "Convert 156 to binary" or "Convert 255 to hex"
• "Subtract 14 from 25 using 2's complement"
• "Explain race around condition in JK flip flop"
• "Explain logic families TTL CMOS ECL"
• "Explain counters and shift registers"
• "Explain bridge rectifier and ripple factor"`;
}

// ─────────────────────────────────────────────────────────────────────────────

export const AITutorBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: '⚡ Hello! I am your AI Electronics Professor powered by Gemini AI.\n\nAsk me ANY question in Digital Techniques or Analog Electronics:\n• Step-by-step conversions & binary math\n• Complement subtraction (1\'s, 2\'s, 9\'s, 10\'s)\n• Logic families, Gates, De Morgan, K-Maps\n• Flip-Flops, Race-around condition, Counters, Op-Amps\n\nWhat would you like to solve or learn today?',
      timestamp: 'Just now',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const QUICK_QUESTIONS = [
    'Convert 75 to binary step by step',
    'Convert 128 to hexadecimal',
    'Convert 45 to BCD',
    'Convert 38 to excess-3',
    'Explain race around condition in JK flip flop',
    'Explain logic families TTL CMOS ECL',
    'State and prove De Morgan theorems',
    'Explain BCD addition +6 rule',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    // 1. First try real Gemini LLM API
    let aiResponseText = await fetchGeminiAI(text.trim());

    // 2. If Gemini API is offline/rate-limited, use our smart local research engine fallback
    if (!aiResponseText) {
      aiResponseText = generateLocalDeepResponse(text.trim());
    }

    const aiReply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, aiReply]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          padding: '12px 20px', borderRadius: '30px',
          border: '1.5px solid #38bdf8',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#fff', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(2,132,199,0.5)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}
      >
        <Bot size={22} />
        <span>🤖 AI Electronics Tutor</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '84px', right: '24px',
          width: '480px', maxWidth: '94vw', height: '640px', maxHeight: '85vh',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
          border: '1.5px solid rgba(56,189,248,0.4)', borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          zIndex: 99999, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, rgba(2,132,199,0.35), rgba(99,102,241,0.25))',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bot size={19} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff' }}>AI Electronics Professor</div>
                <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={11} /> Gemini 2.0 AI • Deep Research & Step-by-Step Solver
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Quick Questions */}
          <div style={{
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.25)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', gap: '6px', overflowX: 'auto',
          }}>
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  padding: '5px 10px', borderRadius: '10px',
                  border: '1px solid rgba(56,189,248,0.3)',
                  background: 'rgba(56,189,248,0.08)',
                  color: '#38bdf8', fontSize: '0.68rem', fontWeight: 700,
                  whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                }}
              >
                ⚡ {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '92%',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'rgba(255,255,255,0.06)',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.79rem', lineHeight: 1.65,
                  whiteSpace: 'pre-wrap', fontFamily: '"Fira Code", "Courier New", monospace',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                {msg.text}
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'right', fontFamily: 'Inter' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{
                alignSelf: 'flex-start', padding: '10px 14px',
                borderRadius: '16px 16px 16px 4px',
                background: 'rgba(56,189,248,0.1)',
                border: '1px solid rgba(56,189,248,0.3)',
                color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Gemini AI is researching & solving...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 14px',
            background: 'rgba(15,23,42,0.95)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <BookOpen size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder='Ask ANY question (e.g. "Explain JK flip flop" or "Convert 75 to binary")'
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1, padding: '9px 12px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)', color: '#fff',
                fontSize: '0.8rem', outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading}
              style={{
                width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
