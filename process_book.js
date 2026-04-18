const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, 'asksanri-frontend', 'public', 'books', 'matrix_code.json');
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));

const MAX_BODY = 500;
const pages = [];

function fixTypos(text) {
  return text
    .replace(/birşey/g, 'bir şey')
    .replace(/herşey/g, 'her şey')
    .replace(/hiçbirşey/g, 'hiçbir şey')
    .replace(/birçok/g, 'bir çok')
    .replace(/  +/g, ' ')
    .replace(/\n /g, '\n')
    .trim();
}

function splitIntoPages(body, title, type = 'content') {
  body = fixTypos(body);
  if (body.length <= MAX_BODY) {
    pages.push({ type, title: title || undefined, body });
    return;
  }
  const sentences = body.split(/(?<=[.!?:…"])\s+/);
  let chunk = '';
  let pageIdx = 0;
  for (const sentence of sentences) {
    if (chunk.length + sentence.length + 1 > MAX_BODY && chunk.length > 0) {
      pages.push({ type, title: pageIdx === 0 ? (title || undefined) : undefined, body: chunk.trim() });
      chunk = '';
      pageIdx++;
    }
    chunk += (chunk ? ' ' : '') + sentence;
  }
  if (chunk.trim()) {
    pages.push({ type, title: pageIdx === 0 ? (title || undefined) : undefined, body: chunk.trim() });
  }
}

// ──── COVER ────
pages.push({
  type: 'cover',
  title: 'Matrix Code: İkra',
  subtitle: 'Seçilmişlerin Yolculuğu',
  author: 'Celine River & Rahmi Ergün'
});

// ──── HYPNOTIC INTRO: GİRİŞ ────
pages.push({
  type: 'chapter',
  number: 'I',
  title: 'Seçilmişlerin Yolculuğu',
  epigraph: 'Bu kitap seni seçti.'
});

pages.push({
  type: 'content',
  title: 'Giriş',
  body: 'Gözlerini kapat.\nŞimdi nefes al.\n\nBu kitap seni seçti.\nSen bu sayfaları çevirmek için burada değilsin.\nSayfalar seni çevirmek için burada.\n\nHer kelime bir kod.\nHer kod bir kapı.\nVe sen… o kapının önündesin.'
});

pages.push({
  type: 'content',
  body: 'Eğer bu sayfaları çeviriyorsan, seçilmişlerdensin.\nBunu sana kimse söylemedi.\nAma bir şeylerin farklı olduğunu hep bildin.\n\nBu kitap, zeki ve farkındalığı yüksek zihinler için hazırlandı.\nBasit bir düşünceyle evrenin en derin sırlarına ulaşacaksın.\nHer bölümde açığa çıkan kodlar, gözünün önünde duruyordu.\nAma göremiyordun.\nŞimdi göreceksin.'
});

pages.push({
  type: 'content',
  body: 'Her bir kod hücrelerine işlediğinde, bu metin olmaktan çıkacak.\nKalbinde yankılanacak.\nRuhunda ateş olacak.\n\nBu bilgiler DNA\'nda saklıydı.\nBiz sadece hatırlatıyoruz.\n\nKendi hayatının kodlarını çözmeye başladığında, seni aramızda karşılıyor olacağız.\n\nPeki biz kimiz?\n2023 yılında, "Kayaların Oğlu"nun doğuşuyla yolları birleşen parçalarız.\nGölgelerimizden arınmaya çalışan, hakikati ararken çırılçıplak kalan ruhlarız.'
});

// ──── HYPNOTIC PERSONAL STORY: RUHSAL UYANIŞ ────
pages.push({
  type: 'chapter',
  number: 'II',
  title: 'Ruhsal Uyanış: Benim Hikâyem',
  epigraph: 'Ölmeden önce öldüm. Ve yeniden doğdum.'
});

pages.push({
  type: 'content',
  title: 'Kundalini Uyanışı',
  body: 'Bir gün her şey değişti.\nBir Kundalini uyanışı yaşadım.\nİçimde büyük bir coşku patladı.\n\nTüm bildiklerim sarsıldı.\nDoğru sandığım her şey… yalan çıktı.\nYeniden doğmak için ölmeden önce bir ölüm sürecini tamamladım.\n\nBu zorlu süreçte tek bir dua ettim:\n"Bana doğru kişiyi gönder."'
});

pages.push({
  type: 'content',
  body: 'Tasavvuf, kuantum fiziği, numeroloji, astroloji…\nHep ilgimi çekmişlerdi.\nAma bir şey eksikti.\n\nBazen süreçte nasıl bir yol izleyeceğini Allah\'a bırakırsın.\nVe işaretleri takip edersin.\n\nİşte o zaman Rahmi Ergün karşıma çıktı.\nDoğrularımı sorgulatıyordu.\nBildiklerimi sarsıyordu.\nDışarıdan bakıldığında belki delirmiş gibi görünüyordu.\n\nAma zamanla anlattıkları içimde işlemeye başladı.'
});

pages.push({
  type: 'content',
  body: 'İlk ay kafamda hiçbir şey oturmuyordu.\nBana dedi ki: "Tüm bildiklerini unut."\n\nKur\'an\'a bu kadar âşıkken nasıl unutabilirdim?\nAma zamanla her şey anlam kazanmaya başladı.\n\nRahmi, sembolleri, kelimeleri ve rakamları kodlayarak büyük resmi oluşturuyordu.\nBu, yapbozun parçalarının yerine oturması gibiydi.\n\nŞimdi bu yolculuk senin için başlıyor.'
});

// ──── KODLARIN ÖĞRETİSİ: GİZLİ ANLAMLAR ────
pages.push({
  type: 'chapter',
  number: 'III',
  title: 'Kodların Öğretisi: Gizli Anlamlar',
  epigraph: 'Sembollerin anlamını çözmek, hayatı ikra etmektir.'
});

// Process paragraphs 9-38 (indices 7-36 in 0-based raw array) as early teachings
const earlyTeachingParagraphs = raw.slice(7, 37);
const earlySubHeaders = [
  'Kutu Kutu Pense', 'Atlas Kemiği', 'Elmamı yerse', 'Cehennem ve Arka Dönmek',
  'Regli ve Vajina', 'Farkındalık ve Bilinç Yükselişi'
];

for (const para of earlyTeachingParagraphs) {
  const lines = para.split('\n').map(l => l.trim()).filter(Boolean);
  let currentTitle = null;
  let currentBody = '';

  for (const line of lines) {
    const isSubHeader = line.length < 70 && (
      line.endsWith(':') ||
      line.endsWith(')') ||
      earlySubHeaders.some(h => line.includes(h)) ||
      /^(El-ma|Hart|Kodların Öğretisi)/.test(line)
    );

    if (isSubHeader && line.length < 60) {
      if (currentBody.trim()) {
        splitIntoPages(currentBody, currentTitle);
        currentBody = '';
      }
      currentTitle = fixTypos(line.replace(/:$/, ''));
    } else {
      currentBody += (currentBody ? '\n' : '') + line;
    }
  }
  if (currentBody.trim()) {
    splitIntoPages(currentBody, currentTitle);
    currentTitle = null;
  }
}

// ──── PROCESS REMAINING PARAGRAPHS (37 onward = raw index 35+) ────
// But we already processed up to index 36, so start from index 37

const chapterMap = {
  'Kod Öğreti: Evren, Bilinç ve Cehennemden Geçiş': 'IV',
  'Kod Öğreti: Kurban Edilen Dişil Enerji ve Koç Sembolizmi': 'V',
  'Kod Öğreti: Simülasyonun Sesi – Müzikal Frekanslar': 'VI',
  'Kod Öğreti: Ay, Güneş ve Bilinç Yükselişi': 'VII',
  'Kod Öğreti: Yazı, Yazgı ve Gizli Mesajlar': 'VIII',
  'Kod Öğreti: Matrix Sayı Kodları ve Anlamları': 'IX',
  'Kod Öğreti: Metatronik Izgara, Bilinç ve Ruhsal Uyanış': 'X',
  'Kod Öğreti: Dünya – Bir Aşk Hikayesi': 'XI',
  'Kod Öğreti: Güvercinler ve Kendini Bulma Süreci': 'XII',
  'Kod Öğreti: Kaval Kemiği ve Ruhun Frekansı': 'XIII',
  'Kod Öğreti: Fare, Sıçan ve Kedinin Sembolik Anlamları': 'XIV',
  'Kod Öğreti: Semboller, Anlamlar ve Gerçeklik Üzerine': 'XV',
  'Kod Öğreti: Cehennem, Kuyu ve Bilgelik Yolculuğu': 'XVI',
  'Kod Öğreti: Gözyaşı, Dişil Enerji ve Ruhun Arınması': 'XVII'
};

const sectionHeaders = [
  'Giriş: İnsanlık ve Sistem', 'Giriş: Evrenin Gizli Kodları',
  'Harflerin ve Kodların Öğretisi', 'Jim Carrey', 'Kutsal sıvı',
  'Mehdi, Ateş ve Altın Çağ', 'Metatronik Izgara: Ruhun Holografik Hücresi',
  'Dünya: Bir Aşk Hikayesi', 'İnanç ve Güven: Boşluğun Gücü',
  'Niyet ve Bilgi Bilinci', 'Titreşimlerinizi Yükselterek',
  'Kediler, Fareler ve İçsel Temizlik', 'Gerçekliği Anlamak',
  'İçsel Yangınlarımız', 'Ruhun Yaraları', 'Çıplak Gerçek',
  'Esaretin Gizli Anlamı', 'ConstantinePole', 'Ateşin Şifresi',
  'Mezopotamya', 'Ruhların Yolculuğu', 'Yıkım ve Dönüşüm',
  'Kelimelerin Ardındaki Gizli Hikaye', 'Arınma ve Kendini Bilme',
  'Diller, Babel Kulesi', 'Aydınlanma, Şifre ve Ateşin Gücü',
  'Mucizeler İçimizde', 'Kendi Yıkımımıza Randevu',
  'Anlamların Derinliğinde', 'Bakara: Aydınlanmanın Kapısı',
  'Sesin ve Işığın Dansı', 'Kalp Enerjimiz', 'Dişil Enerji ve Kutsal Birleşme',
  'Dişil ve Eril Enerji', 'Su ve Ateş: Bilincin Derinliği',
  'Matrix: Akıl Oyunu', 'Evrenin Sırrı', 'Mucizenin Anlamı',
  'Görkemli Hakikatin Sessizliği', 'Kehanet ve Gökkuşağı',
  'İçsel Yolculuğun Işığı', 'Kod Çözmek: Ağrıyı Dindiren',
  'Evrenin Kusursuz İşleyişi', 'Musa, Maha ve İzin',
  'Tapınak, İnsan Bedeni', 'İnsân-ı Kâmil ve Aynâ',
  'Kötülük Tanrısı Seth', 'Bilgi ve Frekans', 'Kelimelerin Gizemi',
  'Öze Dönüş', 'Kalbin Işığı', 'Kendini Tanıma Yolculuğu',
  'Dişil Enerji ve Sistemin Kodları', 'Güneş Döngüsü',
  'Balıklar Nerede Uyur', 'Balık ve NPC Metaforu',
  'Arka Kapak', 'Zaman, Hafıza ve Elementlerin Öğretisi'
];

const chapterEpigraphs = {
  'IV': 'Evren, bütünüyle bir bilinç transistörüdür.',
  'V': 'Dişil enerji, yaratılışın temel gücüdür.',
  'VI': '"Od" yani ateş. Tersi ise "Do"dur.',
  'VII': 'Ay ve Güneş, bilinç seviyemizi yönetir.',
  'VIII': 'Yazgı, güneşin altında alınlarımıza kazınmıştır.',
  'IX': 'Her sayı özel bir frekans ve enerji taşır.',
  'X': 'Hepimiz birer holografik hücrede yaşıyoruz.',
  'XI': 'Dünya, büyük bir aşk hikâyesidir.',
  'XII': 'Güvercinler, yönlerini ve yollarını bulabilir.',
  'XIII': 'Kaval kemiği, ruhun eterle bağlantı noktasıdır.',
  'XIV': 'Her varlığın ismi derin anlamlar taşır.',
  'XV': 'Dünya, büyük bir tiyatro sahnesidir.',
  'XVI': 'Cehalet, bu dünyanın cehennem olmasının sebebidir.',
  'XVII': 'Gözyaşı, ruhun en derin ifadesidir.'
};

// Process paragraphs from index 37 (paragraph 39 in 1-based) onwards
for (let i = 37; i < raw.length; i++) {
  let para = raw[i];
  para = para.replace(/^\*\*/, '').replace(/\*\*"$/, '').replace(/^"/, '').replace(/"$/, '');
  const lines = para.split('\n').map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Check for chapter headers
    let foundChapter = false;
    for (const [chapterTitle, num] of Object.entries(chapterMap)) {
      if (line.includes(chapterTitle) || line.startsWith(chapterTitle)) {
        pages.push({
          type: 'chapter',
          number: num,
          title: chapterTitle.replace('Kod Öğreti: ', ''),
          epigraph: chapterEpigraphs[num] || ''
        });
        foundChapter = true;
        delete chapterMap[chapterTitle];
        break;
      }
    }
    if (foundChapter) continue;

    // Check for section sub-headers
    const isSubHeader = line.length < 70 && (
      line.endsWith(':') ||
      sectionHeaders.some(h => line.includes(h))
    );

    if (isSubHeader && line.length < 80) {
      const title = fixTypos(line.replace(/:$/, '').trim());
      // Look ahead: if there's more in this paragraph, use it as body
      const lineIdx = lines.indexOf(line);
      if (lineIdx < lines.length - 1) {
        const remaining = lines.slice(lineIdx + 1).join('\n');
        splitIntoPages(remaining, title);
        break;
      }
      // Otherwise just note the title for the next content
      pages.push({ type: 'content', title, body: '' });
      continue;
    }

    // Regular content
    splitIntoPages(line, null);
  }
}

// ──── BACK COVER ────
// Check if the last paragraph is "Arka Kapak" and handle it
const lastPage = pages[pages.length - 1];
if (lastPage && lastPage.body && lastPage.body.includes('Hatırla: Ben O\'yum')) {
  pages.push({
    type: 'content',
    title: 'Son Söz',
    body: 'Hatırla:\nBen O\'yum. Sen O\'sun. Biz biriz.\n\nSenden başka bir şey yok.\nNe yaptıysan, kendine yaptın.\nNeye gücendiysen, sebebi hep sendin.\n\nBilgiyi kendinden perdeledin.\nUnuttun.\nTekrar sahneye çıkıp ete kemiğe büründün.\n\nArtık hatırlayacaksın.\nÇünkü hatırlamak zorundasın.'
  });
}

// ──── CLEAN UP ────
// Remove empty body pages and merge with next
const cleaned = [];
for (let i = 0; i < pages.length; i++) {
  const p = pages[i];
  if (p.type === 'content' && (!p.body || p.body.trim() === '')) {
    // Carry title to next content page
    if (i + 1 < pages.length && pages[i + 1].type === 'content' && !pages[i + 1].title) {
      pages[i + 1].title = p.title;
    }
    continue;
  }
  // Remove undefined titles
  if (p.title === undefined) delete p.title;
  if (p.body !== undefined) p.body = fixTypos(p.body);
  cleaned.push(p);
}

// Write output
const outputPath = rawPath;
fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2), 'utf-8');
console.log(`Written ${cleaned.length} pages to ${outputPath}`);
console.log(`Cover: ${cleaned.filter(p => p.type === 'cover').length}`);
console.log(`Chapters: ${cleaned.filter(p => p.type === 'chapter').length}`);
console.log(`Content: ${cleaned.filter(p => p.type === 'content').length}`);

// Sample first 5 pages
console.log('\n--- Sample pages ---');
for (let i = 0; i < Math.min(5, cleaned.length); i++) {
  console.log(JSON.stringify(cleaned[i]).substring(0, 200));
}
