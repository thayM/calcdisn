import { useState, useEffect } from 'react';
import NormalDistributionChart from './NormalDistributionChart';
import { calculateZScore, calculateProbability } from '../utils/normalDistribution';
import style from '../App.module.css'

type ProbabilityType = 'less' | 'greater' | 'between';

export default function NormalDistributionCalculator() {
  const [mean, setMean] = useState<number>(0);
  const [stdDev, setStdDev] = useState<number>(1);
  const [xValue, setXValue] = useState<number>(0);
  const [xValue2, setXValue2] = useState<number>(0);
  const [probabilityType, setProbabilityType] = useState<ProbabilityType>('less');
  const [result, setResult] = useState<{
    zScore?: number;
    zScore2?: number;
    tableValue?: number;
    tableValue2?: number;
    operation?: string;
    finalResult?: number;
  }>({});
  const [showHighlight, setShowHighlight] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    setShowHighlight(false);
  }, [mean, stdDev, xValue, xValue2, probabilityType]);

  const handleCalculate = () => {
    try {
      const zScore = calculateZScore(xValue, mean, stdDev);
      let zScore2 = 0;
      if (probabilityType === 'between') {
        zScore2 = calculateZScore(xValue2, mean, stdDev);
      }

      const tableValue = calculateProbability(Math.abs(zScore));
      let tableValue2 = 0;
      if (probabilityType === 'between') {
        tableValue2 = calculateProbability(Math.abs(zScore2));
      }

      let finalResult = 0;
      let operationDescription = '';

      switch (probabilityType) {
        case 'less':
          if (zScore < 0) {
            finalResult = 1 - tableValue;
            operationDescription = '1 - valor da tabela (subtrair)';
          } else {
            finalResult = tableValue;
            operationDescription = 'Valor direto da tabela';
          }
          break;
        
        case 'greater':
          if (zScore > 0) {
            finalResult = 1 - tableValue;
            operationDescription = '1 - valor da tabela (subtrair)';
          } else {
            finalResult = tableValue;
            operationDescription = 'Valor direto da tabela';
          }
          break;
        
        case 'between':
          const [z1, z2] = [Math.min(zScore, zScore2), Math.max(zScore, zScore2)];
          const p1 = calculateProbability(Math.abs(z1));
          const p2 = calculateProbability(Math.abs(z2));
          
          if (z1 < 0 && z2 > 0) {
            finalResult = p1 + p2 - 1;
            operationDescription = 'P(Z1) + P(Z2) - 1';
          } else {
            finalResult = Math.abs(p2 - p1);
            operationDescription = '|P(Z2) - P(Z1)|';
          }
          break;
      }

      setResult({
        zScore,
        zScore2: probabilityType === 'between' ? zScore2 : undefined,
        tableValue,
        tableValue2: probabilityType === 'between' ? tableValue2 : undefined,
        operation: operationDescription,
        finalResult
      });
      setShowHighlight(true);
      setShowChart(true);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className={style.container__wrapper}>
      
      <div className={style.container__dados}>
        <div className={style.dados__conta}>
          <div className={style.dados__esquerda}>

            <div className={style.dados__tipo}>
              <h2>Tipo de conta</h2>

              <div className={style.tipo__conta}>
              <p>Informe o tipo da conta:</p>
            <select
              value={probabilityType}
              onChange={(e) => setProbabilityType(e.target.value as ProbabilityType)}
            >
              <option value="less">P(X ≤ x)</option>
              <option value="greater">P(X ≥ x)</option>
              <option value="between">P(x₁ ≤ X ≤ x₂)</option>
            </select>
            </div>

            <div>
              <label>Limite X {probabilityType === 'between' ? '1' : ''}:</label>
              <input
                type="number"
                value={xValue}
                onChange={(e) => setXValue(parseFloat(e.target.value))}
              />
            </div>

            {probabilityType === 'between' && (
              <div>
                <label>Limite X 2:</label>
                <input
                  type="number"
                  value={xValue2}
                  onChange={(e) => setXValue2(parseFloat(e.target.value))}
                />
              </div>
            )}
        </div>

            <div className={style.dados__parametros}>
              <h2>Parâmetros da Distribuição Normal</h2>
        
              <div>
                <label>Média (μ):</label>
                <input 
                  type="number" 
                  value={mean} 
                  onChange={(e) => setMean(parseFloat(e.target.value))} 
                />
                <label>Desvio Padrão (σ):</label>
                <input 
                  type="number" 
                  min="0.1" 
                  value={stdDev} 
                  onChange={(e) => setStdDev(parseFloat(e.target.value))} 
                />
              </div>
            </div>

            <button onClick={handleCalculate}>Calcular</button>
          </div>

        <hr />
          <div className={style.dados__direita}>
            <h2>Resultados</h2>
            {result.zScore !== undefined && (
              <div>
                <p>Valor da Tabela: {result.tableValue?.toFixed(4)}</p>
                {probabilityType === 'between' && result.tableValue2 !== undefined && (
                  <p>Valor da Tabela 2: {result.tableValue2?.toFixed(4)}</p>
                )}
                <p>Operação: {result.operation}</p>
                <p>Resultado Final: {result.finalResult?.toFixed(4)} ({(result.finalResult ? result.finalResult * 100 : 0).toFixed(2)}%)</p>
              </div>
            )}
          </div>


      </div>



        </div>
        <div className={style.dados__grafico}>
          <div className={style.container__grafico}>
          <h2>Gráfico da Distribuição</h2>
          {showChart && (
              <NormalDistributionChart
                mean={mean}
                stdDev={stdDev}
                xValue={xValue}
                probabilityType={probabilityType}
                xValue2={probabilityType === 'between' ? xValue2 : undefined}
                showHighlight={showHighlight}
              />
            )}
            </div>

    </div>
    </div>
  );
}