const fs = require('fs');

const INPUT = 'c:/sanri/asksanri-frontend/public/books/oku.json';
const raw = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
const pages = [];
let chapCount = 0;

const MAX_BODY = 800;

function clean(text) {
  return text
    .replace(/\s{2,}/g, ' ')
    .replace(/\bbirşey/g, 'bir şey')
    .replace(/\bherşey/g, 'her şey')
    .trim();
}

function insertBreaks(text) {
  let t = text;
  t = t.replace(/ (Sembolik Yorum\s*:)/g, '\n\n$1');
  t = t.replace(/ (\d+\.\s*Ayet\s*[\(:])/g, '\n\n$1');
  t = t.replace(/ (\d+\.\s+")/g, '\n$1');
  t = t.replace(/ (Bölüm Özeti\s*:)/g, '\n\n$1');
  t = t.replace(/ (Ve son fısıltı\s*:)/g, '\n\n$1');
  t = t.replace(/ (Ve sistem (?:şöyle|burada|sana|der))/g, '\n$1');
  t = t.replace(/ (Çünkü sistem )/g, '\n$1');
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.replace(/^\n+/, '').trim();
}

function splitBody(text, maxLen) {
  maxLen = maxLen || MAX_BODY;
  if (text.length <= maxLen) return [text];
  const parts = [];
  let rem = text;
  while (rem.length > maxLen) {
    let idx = -1;
    let pos = rem.lastIndexOf('\n\n', maxLen);
    if (pos > maxLen * 0.3) idx = pos + 2;
    if (idx < 0) {
      pos = rem.lastIndexOf('\n', maxLen);
      if (pos > maxLen * 0.3) idx = pos + 1;
    }
    if (idx < 0) {
      pos = rem.lastIndexOf('." ', maxLen);
      if (pos > maxLen * 0.3) idx = pos + 3;
    }
    if (idx < 0) {
      pos = rem.lastIndexOf('. ', maxLen);
      if (pos > maxLen * 0.3) idx = pos + 2;
    }
    if (idx < 0) {
      pos = rem.lastIndexOf(' ', maxLen);
      if (pos > 0) idx = pos + 1;
      else idx = maxLen;
    }
    parts.push(rem.substring(0, idx).trim());
    rem = rem.substring(idx).trim();
  }
  if (rem) parts.push(rem);
  return parts;
}

function toRoman(n) {
  const v = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const s = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let r = '';
  for (let i = 0; i < v.length; i++) {
    while (n >= v[i]) { r += s[i]; n -= v[i]; }
  }
  return r;
}

function extractTitle(text, max) {
  max = max || 70;
  const nl = text.indexOf('\n');
  if (nl > 0 && nl <= max) return text.substring(0, nl).trim();
  const dot = text.indexOf('. ');
  if (dot > 5 && dot < max) return text.substring(0, dot + 1).trim();
  const sp = text.lastIndexOf(' ', max);
  if (sp > 20) return text.substring(0, sp).trim() + '\u2026';
  return text.substring(0, max).trim() + '\u2026';
}

function extractBolumTitle(text) {
  let m;
  m = text.match(/B\u00f6l\u00fcm\s*:\s*\u201C(.+?)\u201D/);
  if (m) return m[1].trim();
  m = text.match(/B\u00f6l\u00fcm\s*:\s*"(.+?)"/);
  if (m) return m[1].trim();
  m = text.match(/B\u00f6l\u00fcm\s*:\s*[""'\u201C\u2018]\s*(.+?)\s*[""'\u201D\u2019]/);
  if (m) return m[1].trim();
  m = text.match(/B\u00f6l\u00fcm\s*:\s*(.+?)(?:\s+\d+\.\s*Ayet|\.\s|$)/);
  if (m && m[1].length < 120) return m[1].trim();
  return '';
}

function addChapter(title, epigraph) {
  chapCount++;
  const p = { type: 'chapter', number: toRoman(chapCount), title: title };
  if (epigraph) p.epigraph = epigraph;
  pages.push(p);
}

function addContent(title, body) {
  const parts = splitBody(body);
  for (let i = 0; i < parts.length; i++) {
    pages.push({
      type: 'content',
      title: i === 0 ? title : title + ' \u2026devam\u0131',
      body: parts[i]
    });
  }
}

function addClosing(title, body) {
  const parts = splitBody(body);
  for (let i = 0; i < parts.length; i++) {
    pages.push({
      type: i === 0 ? 'closing' : 'content',
      title: i === 0 ? title : title + ' \u2026devam\u0131',
      body: parts[i]
    });
  }
}

// ===== COVER =====
pages.push({
  type: 'cover',
  title: 'OKU',
  subtitle: 'Bakara Suresi \u2014 Bilincin Aynas\u0131',
  author: 'Celine River & Rahmi Erg\u00fcn'
});

// ===== PROCESS ENTRIES =====
for (let i = 0; i < raw.length; i++) {
  const text = clean(raw[i]);
  const body = insertBreaks(text);

  if (i === 0) {
    pages.push({ type: 'dedication', title: 'Oku', body: body });
    continue;
  }

  if (i === 1) {
    addChapter('\u0130kra \u2013 Hat\u0131rlama', '\u201COku\u201D demek de\u011fil, \u201CHat\u0131rla\u201D demek');
    addContent('\u0130kra \u2013 Oku Demek De\u011fil, Hat\u0131rla Demek', body);
    continue;
  }

  if (i >= 2 && i <= 4) {
    const dashIdx = text.indexOf('\u2013');
    const dashIdx2 = dashIdx < 0 ? text.indexOf('-') : dashIdx;
    let title;
    if (dashIdx2 > 0 && dashIdx2 < 50) {
      let end = text.indexOf('"', dashIdx2 + 1);
      if (end < 0 || end > 80) end = 80;
      title = text.substring(0, Math.min(end, 80)).trim();
    } else {
      title = extractTitle(text);
    }
    addContent(title, body);
    continue;
  }

  if (i === 5) {
    addChapter('Bismillah', 'Yarat\u0131m\u0131n Frekans\u0131');
    const stripped = body.replace(/^B\u00f6l\u00fcm\s+\d+\s*:\s*Bismillah\s*[\u2013-]\s*Yarat\u0131m\u0131n\s+Frekans\u0131\s*/, '').trim();
    addContent('Bismillah \u2013 Yarat\u0131m\u0131n Frekans\u0131', stripped || body);
    continue;
  }

  if (i >= 6 && i <= 7) {
    const dashIdx = text.indexOf('\u2013');
    let title;
    if (dashIdx > 0 && dashIdx < 40) {
      let end = dashIdx + 1;
      while (end < text.length && end < dashIdx + 40 && text[end] !== '"' && text[end] !== '\u201C') end++;
      title = text.substring(0, Math.min(end, 70)).trim();
    } else {
      title = extractTitle(text);
    }
    addContent(title, body);
    continue;
  }

  if (i === 8) {
    addChapter('F\u00e2tiha', 'Bilincin Kap\u0131s\u0131n\u0131 A\u00e7an Dua');
    addContent('F\u00e2tiha \u2013 Bilincin Kap\u0131s\u0131', body);
    continue;
  }

  if (i >= 9 && i <= 10) {
    addContent(extractTitle(text), body);
    continue;
  }

  if (i === 11) {
    pages.push({ type: 'quote', body: body, source: 'F\u00e2tiha' });
    continue;
  }

  if (i === 12) {
    addChapter('Bakara Suresi', 'Benli\u011fin \u0130nekle \u0130mtihan\u0131');
    addContent('Bakara Suresi \u2013 Giri\u015f', body);
    continue;
  }

  // "Bakara Suresi | Ayet X" or "Bakara Suresi | Ayet X–Y"
  const pipeAyetMatch = text.match(/^Bakara Suresi \| Ayet (\d+(?:[–-]\d+)?)/);
  if (pipeAyetMatch) {
    const range = pipeAyetMatch[1];
    const bt = extractBolumTitle(text);
    addChapter('Ayet ' + range, bt);
    addContent('Ayet ' + range, body);
    continue;
  }

  // "Bakara Suresi'nin X–Y. ayetlerine"
  const rangeNin = text.match(/^Bakara Suresi'nin (\d+)[–-](\d+)\.\s*ayet/);
  if (rangeNin) {
    const range = rangeNin[1] + '\u2013' + rangeNin[2];
    const bt = extractBolumTitle(text);
    addChapter('Ayet ' + range, bt);
    addContent('Ayet ' + range, body);
    continue;
  }

  // "Bakara Suresi X–Y. ayetlere"
  const rangeNoNin = text.match(/^Bakara Suresi (\d+)[–-](\d+)\.\s*ayet/);
  if (rangeNoNin) {
    const range = rangeNoNin[1] + '\u2013' + rangeNoNin[2];
    const bt = extractBolumTitle(text);
    addChapter('Ayet ' + range, bt);
    addContent('Ayet ' + range, body);
    continue;
  }

  // "Bölüm Özeti:" at start
  if (/^B\u00f6l\u00fcm \u00d6zeti/.test(text)) {
    const transIdx = text.indexOf('Bakara Suresi', 15);
    if (transIdx > 0) {
      const summaryRaw = clean(text.substring(0, transIdx));
      const summaryBody = insertBreaks(summaryRaw);
      const nextRaw = clean(text.substring(transIdx));
      const nextBody = insertBreaks(nextRaw);
      addClosing('B\u00f6l\u00fcm \u00d6zeti', summaryBody.replace(/^B\u00f6l\u00fcm \u00d6zeti\s*:\s*/, ''));
      const verseMatch = nextRaw.match(/Bakara Suresi(?:'nin)?\s+(\d+)/);
      if (verseMatch) {
        const innerBolum = nextRaw.match(/Bakara Suresi \d+ B\u00f6l\u00fcm\s*:/);
        if (innerBolum) {
          const bt = extractBolumTitle(nextRaw);
          addChapter('Ayet ' + verseMatch[1], bt);
        }
        addContent('Ayet ' + verseMatch[1], nextBody);
      } else {
        addContent(extractTitle(nextRaw), nextBody);
      }
    } else {
      addClosing('B\u00f6l\u00fcm \u00d6zeti', body.replace(/^B\u00f6l\u00fcm \u00d6zeti\s*:\s*/, ''));
    }
    continue;
  }

  // "Bakara Suresi X. ayete" (single verse transition)
  const singleVerseTrans = text.match(/^Bakara Suresi(?:'nin)?\s+(\d+)\.\s*ayet/);
  if (singleVerseTrans) {
    const vn = singleVerseTrans[1];
    const hasBolum = text.match(/Bakara Suresi \d+ B\u00f6l\u00fcm\s*:/);
    if (hasBolum) {
      addChapter('Ayet ' + vn, extractBolumTitle(text));
    }
    addContent('Ayet ' + vn, body);
    continue;
  }

  // "Bakara Suresi X Bölüm:" at start
  const verseBolumStart = text.match(/^Bakara Suresi (\d+) B\u00f6l\u00fcm\s*:/);
  if (verseBolumStart) {
    const vn = verseBolumStart[1];
    addChapter('Ayet ' + vn, extractBolumTitle(text));
    addContent('Ayet ' + vn, body);
    continue;
  }

  // "Geldik Bakara" (final section)
  if (/^Geldik Bakara/.test(text)) {
    addChapter('Ayet 284\u2013286', 'Bakara Suresi\'nin Kapan\u0131\u015f Duas\u0131');
    addContent('Kapan\u0131\u015f', body);
    continue;
  }

  // "X. Ayet" at start
  const verseStart = text.match(/^(\d+)\.\s*Ayet/);
  if (verseStart) {
    addContent(verseStart[1] + '. Ayet', body);
    continue;
  }

  // Check for internal "Bakara Suresi X Bölüm:" in non-matched entries
  const intBolum = text.match(/Bakara Suresi (\d+) B\u00f6l\u00fcm\s*:/);
  if (intBolum) {
    const vn = intBolum[1];
    const bt = extractBolumTitle(text);
    const bolumPos = text.indexOf(intBolum[0]);
    if (bolumPos > 30) {
      const beforeRaw = clean(text.substring(0, bolumPos));
      const beforeBody = insertBreaks(beforeRaw);
      addContent(extractTitle(beforeRaw), beforeBody);
      const afterRaw = clean(text.substring(bolumPos));
      const afterBody = insertBreaks(afterRaw);
      addChapter('Ayet ' + vn, bt);
      addContent('Ayet ' + vn, afterBody);
    } else {
      addChapter('Ayet ' + vn, bt);
      addContent('Ayet ' + vn, body);
    }
    continue;
  }

  // Fallback: generic content
  addContent(extractTitle(text), body);
}

// ===== OUTPUT STATS =====
const counts = {};
pages.forEach(p => { counts[p.type] = (counts[p.type] || 0) + 1; });
console.log('Total pages:', pages.length);
console.log('By type:', JSON.stringify(counts, null, 2));
console.log('Chapters:', chapCount);

// ===== WRITE =====
fs.writeFileSync(INPUT, JSON.stringify(pages, null, 2), 'utf-8');
console.log('Written to', INPUT);
