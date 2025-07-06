export function calculateZScore(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) throw new Error('O desvio padrão deve ser maior que zero');
  return (x - mean) / stdDev;
}

export function calculateProbability(z: number): number {
  function erf(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

export function generateNormalData(mean: number, stdDev: number): {x: number, y: number}[] {
  const data = [];
  const min = Math.floor(mean - 4 * stdDev);
  const max = Math.ceil(mean + 4 * stdDev);
  
  // Pontos inteiros
  for (let x = min; x <= max; x++) {
    const y = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) / (stdDev * Math.sqrt(2 * Math.PI));
    data.push({x, y});
  }
  
  // Pontos intermediários para curva suave
  for (let x = min; x < max; x += 0.1) {
    const y = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) / (stdDev * Math.sqrt(2 * Math.PI));
    data.push({x, y});
  }

  return data.sort((a, b) => a.x - b.x);
}