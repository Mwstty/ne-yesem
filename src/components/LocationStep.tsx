import { useState } from 'react';
import { CITIES, DISTRICTS } from '../data/options';
import type { Prefs } from '../types';

interface Props {
  onDone: (loc: Prefs['location'], label: string) => void;
}

export default function LocationStep({ onDone }: Props) {
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const useGps = () => {
    if (!navigator.geolocation) { setNote('Tarayıcın konumu desteklemiyor. Şehir seçebilirsin.'); return; }
    setBusy(true);
    setNote('');
    navigator.geolocation.getCurrentPosition(
      (p) => { setBusy(false); onDone({ lat: p.coords.latitude, lng: p.coords.longitude }, 'Konumun'); },
      () => { setBusy(false); setNote('Konum izni verilmedi. Sorun değil, aşağıdan şehir seçebilirsin.'); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  const manual = () => onDone({ city, district: district.trim() }, [district.trim(), city].filter(Boolean).join(', '));

  return (
    <div className="stack">
      <button className="btn primary wide" onClick={useGps} disabled={busy}>
        {busy ? 'Konum alınıyor…' : '📍 Konumumu Kullan'}
      </button>
      {note && <p className="note">{note}</p>}
      <div className="or"><span>veya</span></div>
      <label className="field">
        <span>🏙️ Şehir</span>
        <select value={city} onChange={(e) => { setCity(e.target.value); setDistrict(''); }}>
          <option value="">Şehir seç…</option>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="field">
        <span>📍 İlçe</span>
        <input
          list="districts"
          value={district}
          placeholder={city ? 'İlçe seç veya yaz (isteğe bağlı)' : 'Önce şehir seç'}
          disabled={!city}
          onChange={(e) => setDistrict(e.target.value)}
        />
        <datalist id="districts">{(DISTRICTS[city] ?? []).map((d) => <option key={d} value={d} />)}</datalist>
      </label>
      <button className="btn wide" disabled={!city} onClick={manual}>Devam →</button>
    </div>
  );
}
