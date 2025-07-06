import NormalDistributionCalculator from './components/NormalDistributionCalculator';
import style from './App.module.css';

function App() {
  return (
    <div className={style.appContainer}>
      <div className={style.menu}>
        <h1 className={style.menuTitle}>CalcDisN</h1>
      </div>

      <div className={style.content}>
        <NormalDistributionCalculator />
      </div>
    </div>
  );
}

export default App;