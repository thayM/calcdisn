import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { generateNormalData } from '../utils/normalDistribution'

interface NormalDistributionChartProps {
  mean: number;
  stdDev: number;
  xValue: number;
  probabilityType: 'less' | 'greater' | 'between';
  xValue2?: number;
  showHighlight: boolean;
}

export default function NormalDistributionChart({
  mean,
  stdDev,
  xValue,
  probabilityType,
  xValue2,
  showHighlight
}: NormalDistributionChartProps) {
  const generateChartData = () => {
    const allData = generateNormalData(mean, stdDev);
    const integerData = allData.filter(point => Number.isInteger(point.x));
    
    const startX = probabilityType === 'between' 
      ? Math.min(xValue, xValue2 || 0) 
      : probabilityType === 'less' 
        ? mean - 4 * stdDev 
        : xValue;
        
    const endX = probabilityType === 'between' 
      ? Math.max(xValue, xValue2 || 0) 
      : probabilityType === 'greater' 
        ? mean + 4 * stdDev 
        : xValue;
    
    return integerData.map(point => ({
      x: point.x,
      y: point.y,
      highlight: showHighlight && (point.x >= startX && point.x <= endX) ? point.y : 0
    }));
  };

  const chartData = generateChartData();
  const maxY = Math.max(...chartData.map(d => d.y), 0);

  return (
    <div style={{ height: '400px',   width: '100%'}}>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="x"
            label={{ value: 'x', position: 'insideBottomRight', offset: -10 }}
            ticks={Array.from(
              {length: Math.floor(mean + 4 * stdDev) - Math.ceil(mean - 4 * stdDev) + 1}, 
              (_, i) => Math.ceil(mean - 4 * stdDev) + i
            )}
          />
          <YAxis 
            label={{ value: 'Probabilidade', angle: -90, position: 'insideLeft' }}
            domain={[0, Math.max(0.4, maxY * 1.1)]}
            ticks={[0.0, 0.1, 0.2, 0.3, 0.4]}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.1}
            name="Distribuição"
          />
          {showHighlight && (
            <Area
              type="monotone"
              dataKey="highlight"
              stroke="#8C1414"
              fill="#A62631"
              fillOpacity={0.5}
              name="Área de Probabilidade"
            />
          )}
          {probabilityType === 'between' && xValue2 && showHighlight && (
            <text
              x={xValue2}
              y={chartData.find(d => d.x === Math.round(xValue2))?.y * 1000 || 0}
              textAnchor="middle"
              fill="#ff7300"
              fontSize={12}
            >
              {Math.round(xValue2)}
            </text>
          )}
          {showHighlight && (
            <text
              x={xValue}
              y={chartData.find(d => d.x === Math.round(xValue))?.y * 1000 || 0}
              textAnchor="middle"
              fill="#ff7300"
              fontSize={12}
            >
              {Math.round(xValue)}
            </text>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}