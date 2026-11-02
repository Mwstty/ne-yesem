import { useState } from 'react';
import type { Recommendation } from '../types';
import { directionsUrl, formatDistance, menuUrl } from '../utils/helpers';

interface Props {
  rec: Recommendation;
  saved: boolean;
  onToggleSave: () => void;
  onAnother: () => void;
  onRestart: () => void;
}

const NA = 'Bu bilgi mevcut değil';

export default function ResultCard({ rec, saved, onToggleSave, onAnother, onRestart }: Props) {
  const { restaurant: r, dish } = rec;
  const [menuOpen, setMenuOpen] = useState(false);
  const status = r.openNow === true ? ['🟢', 'Şu anda açık'] : r.openNow === false ? ['🔴', 'Şu anda kapalı'] : ['⚪', `Açık/kapalı: ${NA}`];

  return (
    <article className="result">
      <div className="hero-img">
        {r.photo ? <img src={`/api/photo?name=${encodeURIComponent(r.photo)}`} alt={r.name ?? ''} /> : <div className="emoji-art">{r.emoji ?? '🍽️'}</div>}
        {r.isDemo && <span className="badge demo">DEMO VERİSİ</span>}
        <span className="fire">🔥 BUGÜN BUNU YE</span>
      </div>

      <div className="result-body">
        <h2 className="dish">{dish.name}{dish.drink ? ` + ${dish.drink}` : ''}</h2>
        {!dish.verified && <p className="note">Menü bilgisi mevcut değil. Bu yemek, mekân türüne göre genel bir öneridir; menüde olduğu doğrulanmadı.</p>}
        <p className="rname">{r.name ?? NA}{r.type ? <span className="muted"> · {r.type}</span> : null}</p>

        <ul className="stats">
          <li>⭐ {r.rating ?? NA}</li>
          <li>💬 {r.reviewCount !== null ? r.reviewCount.toLocaleString('tr-TR') + ' yorum' : `Yorum: ${NA}`}</li>
          <li>📍 {formatDistance(r.distanceM)}</li>
          <li>💰 {r.price ? r.price.text : `Fiyat: ${NA}`}{r.price?.source === 'google-level' ? ' (tahmini seviye)' : ''}</li>
          <li>{status[0]} {status[1]}</li>
          <li>🏠 {r.address ?? `Adres: ${NA}`}</li>
          <li>📞 {r.phone ?? `Telefon: ${NA}`}</li>
        </ul>

        <section className="why">
          <h3>Neden bunu seçtim?</h3>
          <p>{rec.reason}</p>
          <small className="muted">{rec.aiUsed ? 'AI tarafından seçildi.' : 'AI anahtarı olmadığı için kural tabanlı seçildi.'}</small>
        </section>

        {menuOpen && (
          <div className="menu-box">
            {r.isDemo ? (
              <p>Demo mekân: gerçek menü yok. Önerilen: {dish.name}{dish.price ? ` (${dish.price} TL, demo fiyat)` : ''}.</p>
            ) : (
              <p>Menü bilgisi mevcut değil. Google Haritalar'da menü ve fotoğraflara bakabilirsin.</p>
            )}
            {!r.isDemo && <a href={menuUrl(r)} target="_blank" rel="noreferrer">Google Haritalar'da aç ↗</a>}
          </div>
        )}

        <div className="actions">
          <a className="btn primary" href={directionsUrl(r)} target="_blank" rel="noreferrer">📍 Yol Tarifi</a>
          <button className="btn" onClick={() => setMenuOpen((v) => !v)}>📋 Menüyü Gör</button>
          {r.phone ? <a className="btn" href={`tel:${r.phone.replace(/\s/g, '')}`}>📞 Ara</a> : <button className="btn" disabled title={NA}>📞 Ara</button>}
          <button className="btn" onClick={onAnother}>🔄 Başka Bir Şey Seç</button>
          <button className={`btn${saved ? ' on' : ''}`} onClick={onToggleSave}>{saved ? '💖 Kaydedildi' : '❤️ Kaydet'}</button>
        </div>
        <button className="link" onClick={onRestart}>Baştan başla</button>
      </div>
    </article>
  );
}
