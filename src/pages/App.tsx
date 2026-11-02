import { useEffect, useMemo, useState } from 'react';
import LocationStep from '../components/LocationStep';
import OptionGrid from '../components/OptionGrid';
import ResultCard from '../components/ResultCard';
import { BUDGETS, CRAVINGS, DISTANCES, HUNGER, MEALS } from '../data/options';
import { getConfig, getRecommendation, type AppConfig } from '../services/api';
import type { Budget, EmptyResult, Meal, Prefs, Recommendation } from '../types';
import { defaultMeal, loadSaved, storeSaved } from '../utils/helpers';

type Step = 'hero' | 'location' | 'meal' | 'hunger' | 'cravings' | 'budget' | 'distance' | 'loading' | 'result';
const ORDER: Step[] = ['location', 'meal', 'hunger', 'cravings', 'budget', 'distance'];
const TITLES: Partial<Record<Step, string>> = {
  location: 'Neredesin?', meal: 'Şu an ne öğünü?', hunger: 'Ne kadar açsın?',
  cravings: 'Canın ne istiyor?', budget: 'Bütçe?', distance: 'Maksimum mesafe?',
};
const LOADING = ['Yakındaki yerlere bakıyorum…', 'Kapalı ve uzak olanları eliyorum…', 'Puan ve yorumları tartıyorum…', 'Sana en uygununu seçiyorum…'];

const initial = (): Prefs => ({
  location: null, locationLabel: '', meal: defaultMeal(), hunger: null, cravings: [], budget: null, maxDistance: null,
});

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { const t = localStorage.getItem('neyesem.theme'); if (t === 'light' || t === 'dark') return t; } catch { /* yoksay */ }
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [step, setStep] = useState<Step>('hero');
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [error, setError] = useState('');
  const [emptyMsg, setEmptyMsg] = useState('');
  const [seen, setSeen] = useState<string[]>([]);
  const [seenDishes, setSeenDishes] = useState<string[]>([]);
  const [saved, setSaved] = useState<Recommendation[]>(loadSaved);
  const [showSaved, setShowSaved] = useState(false);
  const [loadMsg, setLoadMsg] = useState(0);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('neyesem.theme', theme); } catch { /* yoksay */ }
  }, [theme]);
  useEffect(() => { getConfig().then(setConfig).catch(() => setError('Sunucuya ulaşılamadı. baslat.bat penceresinin açık olduğundan emin ol.')); }, []);
  useEffect(() => {
    if (step !== 'loading') return;
    setLoadMsg(0);
    const t = setInterval(() => setLoadMsg((m) => Math.min(m + 1, LOADING.length - 1)), 1200);
    return () => clearInterval(t);
  }, [step]);

  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => setPrefs((p) => ({ ...p, [k]: v }));
  const next = (from: Step) => setStep(ORDER[ORDER.indexOf(from as typeof ORDER[number]) + 1] ?? 'loading');
  const back = () => setStep(ORDER[ORDER.indexOf(step) - 1] ?? 'hero');
  const savedIds = useMemo(() => new Set(saved.map((s) => s.restaurant.id)), [saved]);

  const run = async (p: Prefs, exclude: string[], dishes: string[]) => {
    setStep('loading');
    setError('');
    try {
      const res: Recommendation | EmptyResult = await getRecommendation(p, exclude, dishes);
      if (res.empty) { setEmptyMsg(res.message); setRec(null); } else { setEmptyMsg(''); setRec(res); }
      setStep('result');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu.');
      setStep('result');
      setRec(null);
    }
  };

  const start = () => { setSeen([]); setSeenDishes([]); setPrefs(initial()); setRec(null); setStep('location'); };
  const another = () => {
    if (!rec) return;
    const ex = [...seen, rec.restaurant.id], dd = [...seenDishes, rec.dish.name];
    setSeen(ex); setSeenDishes(dd);
    run(prefs, ex, dd);
  };
  const toggleSave = () => {
    if (!rec) return;
    const list = savedIds.has(rec.restaurant.id) ? saved.filter((s) => s.restaurant.id !== rec.restaurant.id) : [rec, ...saved];
    setSaved(list); storeSaved(list);
  };
  const single = <K extends 'hunger' | 'budget' | 'maxDistance'>(k: K, v: Prefs[K], from: Step) => {
    const p = { ...prefs, [k]: v };
    setPrefs(p);
    if (from === 'distance') { setSeen([]); setSeenDishes([]); run(p, [], []); }
    else setTimeout(() => next(from), 180);
  };

  const idx = ORDER.indexOf(step as typeof ORDER[number]);

  return (
    <div className="app">
      <header className="top">
        <button className="logo" onClick={() => setStep('hero')}>🍽️ Ne Yesem?</button>
        <div className="top-r">
          {config?.mode === 'demo' && <span className="badge demo">DEMO MODU</span>}
          <button className="icon" onClick={() => setShowSaved(true)} aria-label="Kaydedilenler">❤️{saved.length > 0 && <b>{saved.length}</b>}</button>
          <button className="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Tema">{theme === 'dark' ? '☀️' : '🌙'}</button>
        </div>
      </header>

      <main className="stage" key={step}>
        {step === 'hero' && (
          <section className="hero">
            <h1>Ne yiyeceğini bilmiyor musun?</h1>
            <p className="sub">Bırak ben seçeyim.</p>
            <button className="btn primary big" onClick={start}>🍽️ BENİMLE SEÇ</button>
            {error && <p className="note err">{error}</p>}
            {config?.mode === 'demo' && <p className="note">API anahtarı eksik: örnek DEMO verisi gösterilecek. Gerçek veri için .env dosyasını doldur.</p>}
          </section>
        )}

        {idx >= 0 && (
          <section className="step">
            <div className="progress">{ORDER.map((s, i) => <i key={s} className={i <= idx ? 'on' : ''} />)}</div>
            <h2>{TITLES[step]}</h2>
            {step === 'location' && <LocationStep onDone={(loc, label) => { setPrefs((p) => ({ ...p, location: loc, locationLabel: label })); next('location'); }} />}
            {step === 'meal' && (<>
              <OptionGrid options={MEALS} selected={[prefs.meal]} onToggle={(id) => set('meal', id as Meal)} />
              <button className="btn primary wide" onClick={() => next('meal')}>Devam →</button>
            </>)}
            {step === 'hunger' && <OptionGrid options={HUNGER} selected={prefs.hunger ? [prefs.hunger] : []} onToggle={(id) => single('hunger', id as Prefs['hunger'], 'hunger')} />}
            {step === 'cravings' && (<>
              <OptionGrid columns={3} options={CRAVINGS} selected={prefs.cravings}
                onToggle={(id) => set('cravings', prefs.cravings.includes(id) ? prefs.cravings.filter((c) => c !== id) : [...prefs.cravings, id])} />
              <p className="note">Birden fazla seçebilirsin. Hiçbirini seçmezsen ben karar veririm 🤷</p>
              <button className="btn primary wide" onClick={() => next('cravings')}>{prefs.cravings.length ? 'Devam →' : '🤷 Hiçbir fikrim yok'}</button>
            </>)}
            {step === 'budget' && <OptionGrid options={BUDGETS} selected={prefs.budget ? [prefs.budget] : []} onToggle={(id) => single('budget', id as Budget, 'budget')} />}
            {step === 'distance' && <OptionGrid options={DISTANCES} selected={prefs.maxDistance === null ? [] : [prefs.maxDistance]} onToggle={(id) => single('maxDistance', id as number, 'distance')} />}
            <button className="link" onClick={back}>← Geri</button>
          </section>
        )}

        {step === 'loading' && (
          <section className="loading">
            <div className="spinner">🍴</div>
            <p>{LOADING[loadMsg]}</p>
          </section>
        )}

        {step === 'result' && (
          <>
            {rec && <ResultCard rec={rec} saved={savedIds.has(rec.restaurant.id)} onToggleSave={toggleSave} onAnother={another} onRestart={start} />}
            {!rec && (
              <section className="hero">
                <h2>{error ? 'Bir sorun çıktı' : 'Başka öneri kalmadı'}</h2>
                <p className="note err">{error || emptyMsg}</p>
                <button className="btn primary" onClick={start}>Baştan başla</button>
                {!error && <button className="btn" onClick={() => setStep('distance')}>Mesafeyi/bütçeyi değiştir</button>}
              </section>
            )}
          </>
        )}
      </main>

      {showSaved && (
        <div className="drawer" onClick={() => setShowSaved(false)}>
          <aside onClick={(e) => e.stopPropagation()}>
            <h3>❤️ Kaydedilenler</h3>
            {saved.length === 0 && <p className="muted">Henüz bir şey kaydetmedin.</p>}
            {saved.map((s) => (
              <div className="saved-item" key={s.restaurant.id}>
                <b>{s.dish.name}</b>
                <span>{s.restaurant.name}{s.restaurant.isDemo ? ' (DEMO)' : ''}</span>
              </div>
            ))}
            <button className="btn wide" onClick={() => setShowSaved(false)}>Kapat</button>
          </aside>
        </div>
      )}
    </div>
  );
}
