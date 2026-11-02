const SYSTEM = `Sen "Ne Yesem?" uygulamasının karar motorusun. Kullanıcının tercihlerine ve verilen ADAY listesine bakarak TEK bir aday seçersin.
KESİN KURALLAR:
- Yalnızca verilen verileri kullan. Puan, yorum sayısı, mesafe, fiyat, menü UYDURMA. Veri null ise "mevcut değil" say, tahmin etme.
- "pickId" aday listesindeki id'lerden biri olmalı.
- Aday için "menu" listesi varsa "dish" o listeden olmalı. Yoksa o mekan türüne uygun genel bir yemek öner ve menüde olduğunu İDDİA ETME.
- "reason": Türkçe, samimi, 2-4 cümle; kullanıcının açlık, bütçe, mesafe, canı ne çekiyor bilgilerine ve adayın gerçek verilerine dayansın.
- "avoidDishes" listesindeki yemekleri tekrar önerme.
SADECE şu JSON'u döndür: {"pickId":"...","dish":"...","drink":"... veya null","reason":"..."}`;

export async function aiPick(payload) {
  const key = process.env.AI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'claude-haiku-5-5',
        max_tokens: 500,
        system: SYSTEM,
        messages: [{ role: 'user', content: JSON.stringify(payload) }],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) { console.warn('AI hatası:', res.status, (await res.text()).slice(0, 200)); return null; }
    const data = await res.json();
    const text = data.content?.map((c) => c.text ?? '').join('') ?? '';
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const o = JSON.parse(m[0]);
    if (typeof o.pickId !== 'string' || typeof o.reason !== 'string') return null;
    return o;
  } catch (e) {
    console.warn('AI çağrısı başarısız:', e.message);
    return null;
  }
}
