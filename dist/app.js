(() => {
  'use strict';
  const lessons = window.STUDY_LESSONS || [];
  const bank = window.STUDY_BANK || { facts: [], questions: [], labs: [], teacherNotes: [] };
  const core = window.StudyCore;
  const KEY = 'int151-study-v1';
  const topics = {
    overview: { name: 'ภาพรวม', short: 'เริ่มต้น', icon: 'spark', description: 'ขอบเขตสอบและคำเน้นของอาจารย์' },
    dom: { name: 'DOM', short: 'DOM', icon: 'layers', description: 'เลือก เข้าถึง และเปลี่ยนหน้าเว็บให้คล่อง' },
    events: { name: 'DOM & Event', short: 'Event', icon: 'cursor', description: 'ไล่ flow แยก target และเลือก event ให้ถูก' },
    storage: { name: 'Client-side Storage', short: 'Storage', icon: 'database', description: 'Cookie, Web Storage และ JSON ที่ต้องแม่น' },
    javascript: { name: 'Basic JavaScript', short: 'JavaScript', icon: 'code', description: 'พื้นฐานที่ใช้แก้ทุกโจทย์ปฏิบัติ' }
  };
  const names = { dashboard: 'ภาพรวมการติว', reader: 'อ่านบทเรียน', facts: 'จำข้อเท็จจริง', quiz: 'ซ้อมสอบ', labs: 'ฝึกปฏิบัติ' };
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    book: '<path d="M12 6c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1ZM12 6v15"/>',
    cards: '<rect x="7" y="4" width="13" height="17" rx="2"/><path d="M4 17 2 5a2 2 0 0 1 2-2l10-1M11 9h5m-5 4h5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    quiz: '<rect x="4" y="3" width="16" height="19" rx="2"/><path d="m8 9 1 1 2-2m2 1h3m-8 6 1 1 2-2m2 1h3"/>',
    code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>',
    cursor: '<path d="m4 3 7 17 3-7 7-3L4 3Z"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
    layers: '<path d="m12 3 10 6-10 6L2 9l10-6ZM2 15l10 6 10-6M2 12l10 6 10-6"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    moon: '<path d="M20 15a8.5 8.5 0 0 1-11-11A9 9 0 1 0 20 15Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    spark: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"/>',
    flag: '<path d="M5 22V3c6-4 8 5 15 1v11c-7 4-9-5-15-1"/>',
    refresh: '<path d="M20 8a8 8 0 1 0 1 7M20 3v5h-5"/>',
    star: '<path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const inline = text => esc(text).replace(/`([^`]+)`/g, '<code>$1</code>');
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { /* use defaults */ }
  const state = { read: {}, known: {}, starred: {}, wrong: [], attempts: [], labDone: {}, lastLesson: null, theme: 'light', largeText: false, ...saved };
  for (const key of ['read', 'known', 'starred', 'labDone']) if (!state[key] || typeof state[key] !== 'object' || Array.isArray(state[key])) state[key] = {};
  for (const key of ['wrong', 'attempts']) if (!Array.isArray(state[key])) state[key] = [];
  let route = { view: 'dashboard', id: '' };
  let factsTopic = 'all', factsSubtopic = 'all', factsMode = 'all', factsSearch = '';
  const factTopicOrder = ['dom', 'events', 'storage', 'javascript'];
  const factGroups = bank.factGroups || [];
  const factGroupById = new Map(factGroups.map(group => [group.id, group]));
  let quiz = null, quizTimer = null, toastTimer = null;
  let activeLesson = null;
  const main = document.querySelector('#main');
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { toast('เบราว์เซอร์ไม่อนุญาตให้บันทึก ความคืบหน้าจะอยู่เฉพาะหน้านี้'); } }
  function toast(text) { const el = document.querySelector('#toast'); el.textContent = text; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 3000); }
  function setTheme() { document.documentElement.dataset.theme = state.theme; document.documentElement.classList.toggle('large-text', !!state.largeText); document.querySelector('#theme-toggle').innerHTML = icon(state.theme === 'dark' ? 'sun' : 'moon'); }
  const topicPill = topic => `<span class="pill ${topic}">${esc(topics[topic]?.short || topic)}</span>`;
  function sourceLabel(source) { return String(source || '').startsWith('https://developer.mozilla.org/') ? `<a class="source-label" href="${esc(source)}" target="_blank" rel="noopener">ตรวจจาก MDN ↗</a>` : `<span class="source-label">${esc(source || 'แบบฝึกทบทวน INT151')}</span>`; }
  function sidebar() {
    const nav = [['dashboard', 'grid'], ['reader', 'book'], ['facts', 'cards'], ['quiz', 'quiz'], ['labs', 'code']];
    const readCount = lessons.filter(l => state.read[l.id]).length;
    document.querySelector('#sidebar').innerHTML = `<a href="#dashboard" class="brand"><span class="brand-mark">${icon('code')}</span><span class="brand-copy"><strong>INT151</strong><small>STUDY ROOM</small></span></a><div class="sidebar-label">พื้นที่เตรียมสอบ</div><nav>${nav.map(([view, name]) => `<a class="nav-link ${route.view === view ? 'active' : ''}" href="#${view}" ${route.view === view ? 'aria-current="page"' : ''}><span class="nav-icon">${icon(name)}</span><span>${names[view]}</span>${view === 'facts' ? `<span class="nav-count">${bank.facts.length}</span>` : ''}</a>`).join('')}</nav><div class="sidebar-label topic-label">หัวข้อในข้อสอบ</div><nav class="topic-shortcuts">${['dom', 'events', 'storage', 'javascript'].map(t => `<a class="nav-link topic-shortcut" href="#reader/${lessons.find(l => l.topic === t)?.id || ''}"><span class="topic-dot ${t}"></span>${topics[t].name}</a>`).join('')}</nav><div class="sidebar-footer"><div class="exam-mini"><span class="exam-mini-icon">${icon('flag')}</span><div><strong>Exam 02</strong><small>21 ต.ค. 2569 · 09.30 น.</small></div></div><div class="progress-label"><span>อ่านแล้ว</span><strong>${readCount}/${lessons.length} บท</strong></div><div class="progress-track"><div class="progress-fill" style="width:${lessons.length ? readCount / lessons.length * 100 : 0}%"></div></div><p class="local-note">บันทึกความคืบหน้าในเบราว์เซอร์นี้</p></div>`;
  }
  function header(title, eyebrow, description, action = '') { return `<div class="page-head"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lede">${description}</p></div>${action}</div>`; }
  function dashboard() {
    const readCount = lessons.filter(l => state.read[l.id]).length;
    const knownCount = bank.facts.filter(f => state.known[f.id]).length;
    const latest = state.attempts.at(-1);
    const next = lessons.find(l => l.id === state.lastLesson) || lessons.find(l => !state.read[l.id]) || lessons[0];
    const notes = bank.teacherNotes.filter(n => n.kind !== 'extra').slice(0, 3);
    return `<div class="page dashboard-page">${header('วันนี้ มาเข้าใจให้แม่นขึ้น', 'YOUR PERSONAL STUDY ROOM', 'สรุปครบจากสไลด์และคาบเรียน G1 / G2 พร้อมฝึกตอบแบบเลือกถูกครบทุกข้อ', '<span class="exam-badge">Exam 02 · 30 คะแนน</span>')}<section class="hero-grid"><div class="hero-card"><div class="hero-copy"><span class="hero-kicker"><i></i> เตรียมพร้อมทีละเรื่อง</span><h2>อ่านให้เข้าใจ<br>มั่นใจก่อนเข้าห้องสอบ<span>.</span></h2><p>DOM, Event และ Storage เชื่อมกันได้<br>เริ่มจากเรื่องที่ยังไม่แม่น แล้วลองทำด้วยตัวเอง</p><div class="hero-actions"><a class="btn primary" href="#reader/${next?.id || ''}">อ่านต่อจากครั้งล่าสุด ${icon('arrow')}</a><a class="btn ghost" href="#quiz">ลองเช็กความเข้าใจ</a></div></div><div class="hero-art" aria-hidden="true"><div class="code-window"><div class="window-dots"><i></i><i></i><i></i><span>ready-to-learn.js</span></div><div class="hero-code"><span class="code-muted">// one concept at a time</span><br><span class="code-purple">const</span> goal = <span class="code-green">'A'</span><br><br><span class="code-purple">learn</span>(<span class="code-green">'understand'</span>)<br><span class="code-purple">practice</span>(<span class="code-green">'by yourself'</span>)<br><span class="code-purple">review</span>(mistakes)<br><br><span class="code-muted">// you've got a plan.</span></div></div><div class="floating-check">${icon('check')} เข้าใจจริง จำได้แม่น</div></div></div><aside class="goal-card"><span class="pill amber">เป้าหมายของฉัน</span><div class="grade-mark">A<span>+</span></div><h3>ฝึกให้พร้อมกว่าเดิม</h3><p>ทำแบบฝึกได้อย่างน้อย 85%<br>แล้วกลับไปทวนทุกข้อที่พลาด</p><a href="#quiz" class="text-link">เริ่มวัดความพร้อม ${icon('arrow')}</a><small>เป้าหมายฝึก ไม่ใช่การคาดการณ์เกรด</small></aside></section><section class="stats-grid" aria-label="ความคืบหน้าของฉัน">${[
      ['book', 'บทเรียนที่อ่านแล้ว', `${readCount}<span> / ${lessons.length}</span>`, 'ค่อย ๆ เก็บให้ครบทุกเรื่อง'],
      ['cards', 'ข้อเท็จจริงที่จำได้', `${knownCount}<span> / ${bank.facts.length}</span>`, 'แยกคำแนะนำออกจากข้อจำกัด'],
      ['quiz', 'คะแนนฝึกล่าสุด', latest ? `${latest.percent}<span>%</span>` : 'ยังไม่ได้ลอง', latest ? `${latest.correct}/${latest.total} ข้อ · เลือกถูกครบเท่านั้น` : 'พร้อมเมื่อไร เริ่มได้เลย'],
      ['refresh', 'ข้อที่ควรกลับไปทวน', `${state.wrong.length}<span> ข้อ</span>`, 'เปลี่ยนข้อผิดให้เป็นจุดที่แม่น']
    ].map(([i, label, value, detail]) => `<div class="stat-card"><span class="stat-icon">${icon(i)}</span><span class="stat-label">${label}</span><strong class="stat-number">${value}</strong><small class="stat-detail">${detail}</small></div>`).join('')}</section><section><div class="section-heading"><div><p class="eyebrow">THE FOUR ESSENTIALS</p><h2>อ่านทีละบท เชื่อมให้เป็นภาพเดียว</h2></div><a href="#reader" class="text-link">ดูบทเรียนทั้งหมด ${icon('arrow')}</a></div><div class="topic-grid">${['dom', 'events', 'storage', 'javascript'].map((t, index) => { const list = lessons.filter(l => l.topic === t), done = list.filter(l => state.read[l.id]).length; return `<a class="topic-card ${t}" href="#reader/${list[0]?.id || ''}"><div class="topic-meta"><span class="topic-icon">${icon(topics[t].icon)}</span><span class="topic-index">0${index + 1}</span></div><h3 class="topic-title">${topics[t].name}</h3><p class="topic-description">${topics[t].description}</p><div class="topic-footer"><span>${list.length} บทเรียน</span><span>อ่านแล้ว ${done}/${list.length}</span></div><div class="progress-track"><div class="progress-fill" style="width:${list.length ? done / list.length * 100 : 0}%"></div></div></a>`; }).join('')}</div></section><section class="two-column"><div class="panel"><div class="panel-head"><div><p class="eyebrow">A SMALL PLAN, REAL PROGRESS</p><h2>เส้นทางเตรียมสอบของเรา</h2></div>${icon('flag')}</div><ol class="daily-list">${[
      ['เข้าใจพื้นฐาน', 'อ่าน DOM และ JS ให้รู้ว่าเลือกอะไร คืนค่าอะไร', 'reader'],
      ['เก็บจุดที่ชอบสับสน', 'Event flow · target/currentTarget · Cookie domain/path', 'facts'],
      ['ซ้อมเหมือนวันสอบ', 'คำถามอังกฤษ เลือกหลายคำตอบ ผิดตัวเดียวได้ 0', 'quiz'],
      ['ลงมือเขียนให้ได้เอง', 'ผสม DOM + Event + Storage แล้วทดสอบหลายกรณี', 'labs']
    ].map(([title, desc, view], i) => `<li class="daily-item"><span class="step-number">${i + 1}</span><div><strong>${title}</strong><p>${desc}</p></div><a href="#${view}" class="icon-button" aria-label="${title}">${icon('arrow')}</a></li>`).join('')}</ol></div><div class="panel teacher-panel"><div class="panel-head"><div><p class="eyebrow">FROM YOUR LECTURER</p><h2>อาจารย์ย้ำไว้ อย่าข้าม</h2></div><span class="pill amber">อ่านก่อน</span></div>${notes.map((note, i) => `<div class="teacher-note"><span class="note-number">0${i + 1}</span><div><h3>${esc(note.title)}</h3><p>${esc(note.detail)}</p><small>${esc(note.date)}</small></div></div>`).join('')}<a href="#reader/${lessons.find(l => /emphasis|exam/.test(l.id))?.id || lessons[0]?.id || ''}" class="text-link">อ่านคำเน้นและขอบเขตสอบ ${icon('arrow')}</a></div></section><p class="study-note">แบบฝึกในเว็บสร้างขึ้นเพื่อทบทวน ไม่ใช่ข้อสอบจริง · ใช้สรุปนี้เตรียมตัวก่อนสอบ และยึดกติกาทรัพยากรที่อาจารย์อนุญาตในวันสอบ</p></div>`;
  }
  function reader(id) {
    const lesson = lessons.find(l => l.id === id) || lessons.find(l => l.id === state.lastLesson) || lessons[0];
    if (!lesson) return `<div class="page"><p>กำลังเตรียมบทเรียน</p></div>`;
    activeLesson = lesson;
    state.lastLesson = lesson.id;
    persist();
    const index = lessons.indexOf(lesson), next = lessons[index + 1], prev = lessons[index - 1];
    return `<div class="page reader-page">${header('อ่านบทเรียน', 'LEARN THE CONCEPTS', 'อ่านให้เข้าใจทีละเรื่อง แล้วใช้บัตรจำและข้อสอบเช็กตัวเอง')}<div class="reader-layout"><nav class="lesson-nav" aria-label="สารบัญบทเรียน">${Object.entries(topics).map(([t, meta]) => { const group = lessons.filter(l => l.topic === t); return group.length ? `<div class="lesson-group"><div class="sidebar-label">${meta.name}</div>${group.map(l => `<a class="lesson-link ${l.id === lesson.id ? 'active' : ''}" href="#reader/${l.id}" ${l.id === lesson.id ? 'aria-current="page"' : ''}><span class="lesson-status ${state.read[l.id] ? 'done' : ''}">${state.read[l.id] ? '✓' : ''}</span><span>${esc(l.title)}</span></a>`).join('')}</div>` : ''; }).join('')}</nav><article class="lesson-card"><div class="article-meta">${topicPill(lesson.topic)}<span>${icon('clock')} ประมาณ ${lesson.minutes || 8} นาที</span><span>${index + 1} / ${lessons.length}</span></div><h2 class="article-title">${esc(lesson.title)}</h2><p class="article-intro">${esc(lesson.description)}</p>${lesson.keyPoints?.length ? `<aside class="key-points"><strong>อ่านบทนี้แล้วควรตอบได้</strong><ul>${lesson.keyPoints.map(p => `<li>${inline(p)}</li>`).join('')}</ul></aside>` : ''}<div class="article">${lesson.html}</div><div class="article-source">ต้นทาง: ${esc(lesson.source || 'สรุปสไลด์และ transcript INT151')}</div><div class="reader-actions"><button class="btn ${state.read[lesson.id] ? 'secondary' : 'primary'}" type="button" data-action="mark-read" data-id="${lesson.id}">${icon('check')} ${state.read[lesson.id] ? 'อ่านแล้ว · ยกเลิกเครื่องหมาย' : 'อ่านเข้าใจแล้ว ทำเครื่องหมาย'}</button><a class="btn secondary" href="#facts/${lesson.topic}">ทวนข้อเท็จจริง</a></div><nav class="lesson-pagination" aria-label="เปลี่ยนบท">${prev ? `<a href="#reader/${prev.id}"><small>← บทก่อนหน้า</small><strong>${esc(prev.title)}</strong></a>` : '<span></span>'}${next ? `<a href="#reader/${next.id}"><small>บทถัดไป →</small><strong>${esc(next.title)}</strong></a>` : '<a href="#quiz"><small>อ่านครบแล้ว</small><strong>ลองทำแบบทดสอบ →</strong></a>'}</nav></article></div></div>`;
  }
  function factsPage() {
    const categoryOptions = factTopicOrder.filter(t => factsTopic === 'all' || factsTopic === t).map(t => `<optgroup label="${esc(topics[t].name)}">${factGroups.filter(group => group.topic === t).map(group => `<option value="${group.id}" ${factsSubtopic === group.id ? 'selected' : ''}>${esc(group.title)} (${group.factIds.length} ข้อ)</option>`).join('')}</optgroup>`).join('');
    return `<div class="page facts-page">${header('ข้อเท็จจริงจากคาบเรียน', 'FROM YOUR CLASSROOM', 'แบ่งตามหมวดและหัวข้อย่อยจากคาบ G1/G2 อ่านข้อเท็จจริงได้ทันที พร้อมตัวอย่างและคาบอ้างอิงใต้ทุกข้อ')}
      <div class="filter-bar"><div class="filter-tabs" role="group" aria-label="เลือกหมวดหลัก">${[['all', 'ทุกหมวด'], ...factTopicOrder.map(t => [t, topics[t].short])].map(([t, title]) => `<button class="filter-button ${factsTopic === t ? 'active' : ''}" type="button" data-action="fact-topic" data-topic="${t}" aria-pressed="${factsTopic === t}">${title} <span class="fact-filter-count">${bank.facts.filter(f => t === 'all' || f.topic === t).length}</span></button>`).join('')}</div>
      <div class="facts-controls"><label class="sr-only" for="fact-search">ค้นหาข้อเท็จจริงหรือหัวข้อ</label><input class="input" id="fact-search" type="search" placeholder="ค้นหา เช่น submit, Cookie…" value="${esc(factsSearch)}"><label class="sr-only" for="fact-mode">สถานะบัตร</label><select class="select" id="fact-mode"><option value="all">ทุกบัตร</option><option value="unknown" ${factsMode === 'unknown' ? 'selected' : ''}>ยังจำไม่ได้</option><option value="starred" ${factsMode === 'starred' ? 'selected' : ''}>ติดดาวไว้</option><option value="known" ${factsMode === 'known' ? 'selected' : ''}>จำได้แล้ว</option></select></div></div>
      <div class="fact-subtopic-filter"><label for="fact-subtopic">เลือกหัวข้อย่อย</label><select class="select" id="fact-subtopic"><option value="all">ทุกหัวข้อย่อย${factsTopic === 'all' ? '' : `ในหมวด ${topics[factsTopic].short}`}</option>${categoryOptions}</select><p>แต่ละกลุ่มมีชื่อเรื่องกำกับ และทุกข้อมีป้ายบอกหมวดที่อ่านอยู่</p></div>
      <div id="fact-results"></div></div>`;
  }
  function factCard(f, group, number) {
    return `<article class="fact-card ${state.known[f.id] ? 'is-known' : ''}" id="fact-${f.id}" data-topic="${f.topic}" data-subtopic="${f.subtopic}">
      <div class="fact-head"><div class="fact-labels">${topicPill(f.topic)}<span class="fact-subtopic-label">${esc(group.title)}</span>${f.emphasis ? '<span class="pill amber">อาจารย์ย้ำ</span>' : ''}</div><button class="icon-button star-button ${state.starred[f.id] ? 'starred' : ''}" type="button" data-action="star-fact" data-id="${f.id}" aria-label="${state.starred[f.id] ? 'เลิกติดดาว' : 'ติดดาว'}" aria-pressed="${!!state.starred[f.id]}">${icon('star')}</button></div>
      <div class="truth"><span class="truth-label">✓ ข้อเท็จจริงที่ควรจำ</span><h4 class="fact-statement">${inline(f.truth)}</h4></div><p class="fact-explanation">${inline(f.why)}</p>${sourceLabel(f.source)}
      <div class="fact-actions"><button class="btn small ${state.known[f.id] ? 'secondary' : 'ghost'}" type="button" data-action="know-fact" data-id="${f.id}" aria-pressed="${!!state.known[f.id]}">${icon('check')} ${state.known[f.id] ? 'จำได้แล้ว' : 'ทำเครื่องหมายว่าจำได้'}</button><small>#${String(number).padStart(2, '0')}</small></div></article>`;
  }
  function renderFacts() {
    const container = document.querySelector('#fact-results');
    if (!container) return;
    const query = factsSearch.trim().toLocaleLowerCase();
    const visible = bank.facts.filter(f => (factsTopic === 'all' || f.topic === factsTopic) && (factsSubtopic === 'all' || f.subtopic === factsSubtopic) && (factsMode !== 'unknown' || !state.known[f.id]) && (factsMode !== 'known' || state.known[f.id]) && (factsMode !== 'starred' || state.starred[f.id]) && `${f.truth} ${f.why} ${topics[f.topic]?.name} ${factGroupById.get(f.subtopic)?.title}`.toLocaleLowerCase().includes(query));
    let cardNumber = 0;
    const sections = factTopicOrder.map(t => {
      const topicFacts = visible.filter(f => f.topic === t);
      if (!topicFacts.length) return '';
      const groups = factGroups.filter(group => group.topic === t).map(group => {
        const cards = topicFacts.filter(f => f.subtopic === group.id);
        if (!cards.length) return '';
        return `<section class="fact-subtopic-section"><div class="fact-subtopic-heading"><h3>${esc(group.title)}</h3><span>${cards.length} ข้อ</span></div><div class="facts-grid">${cards.map(f => factCard(f, group, ++cardNumber)).join('')}</div></section>`;
      }).join('');
      return `<section class="fact-topic-section"><div class="fact-topic-heading"><span class="topic-icon ${t}">${icon(topics[t].icon)}</span><div><h2>${esc(topics[t].name)}</h2><p>${topicFacts.length} ข้อ · ${new Set(topicFacts.map(f => f.subtopic)).size} หัวข้อย่อย</p></div></div>${groups}</section>`;
    }).join('');
    container.innerHTML = `<div class="results-count">${visible.length} ข้อ <span>· จำได้แล้ว ${bank.facts.filter(f => state.known[f.id]).length}/${bank.facts.length}</span></div>${sections}${!visible.length ? '<div class="empty-state"><h2>ไม่พบข้อเท็จจริงตามตัวกรองนี้</h2><p>ลองเปลี่ยนหมวด หัวข้อย่อย คำค้น หรือสถานะบัตร</p></div>' : ''}`;
  }
  function quizSetup() {
    const weak = [...state.wrong];
    return `<div class="page">${header('ซ้อมให้คุ้น ก่อนสอบจริง', 'PRACTICE MAKES IT STICK', 'เลือกถูกครบและไม่เกินจึงได้ 1 คะแนน เลือกขาดหรือเกินได้ 0 ตามรูปแบบที่นายต้องการฝึก')}<div class="quiz-setup"><section class="setup-card"><span class="pill events">ฝึกทีละข้อ</span><h2>เรียนจากเหตุผลของทุกตัวเลือก</h2><p>ดูเฉลยหลังตอบแต่ละข้อ มีคำแปลไทย และกลับไปอ่านบทที่ยังสับสนได้</p><form id="quiz-config"><div class="setup-fields"><div class="field"><label for="quiz-topic">หัวข้อที่อยากฝึก</label><select class="select" id="quiz-topic"><option value="all">รวมทุกหัวข้อ</option value="events">Event</option><option value="dom">DOM</option><option value="storage">Storage & Cookie</option><option value="javascript">Basic JavaScript</option></select></div><div class="field"><label for="quiz-count">จำนวนข้อ</label><select class="select" id="quiz-count"><option value="10">10 ข้อ</option><option value="20">20 ข้อ</option><option value="30">30 ข้อ</option></select></div></div><button class="btn primary" type="submit">เริ่มฝึกทีละข้อ ${icon('arrow')}</button></form><small>คลังแบบฝึก ${bank.questions.length} ข้อ · เป็นแบบฝึกที่สร้างขึ้นเพื่อทบทวน</small></section><section class="setup-card exam-setup"><span class="pill amber">จำลองเวลา</span><h2>30 ข้อ · 60 นาที</h2><p>คำถามอังกฤษ ซ่อนคำแปลไทยไว้ก่อน ยังไม่เปิดเฉลยระหว่างทำ สรุปคะแนนและจุดพลาดหลังจบ</p><ul class="setup-checks"><li>เลือกได้หลายคำตอบในแต่ละข้อ</li><li>ตรวจแบบถูกครบทุกตัวเลือก</li><li>ตอบข้ามและกลับมาตรวจได้</li></ul><button class="btn primary" type="button" data-action="start-exam">เริ่มซ้อมสอบ ${icon('clock')}</button><small>คะแนนฝึกใช้วัดจุดที่ต้องทวน ไม่รับประกันเกรด</small></section></div><section class="panel wrong-panel"><div><span class="pill storage">สมุดข้อที่พลาด</span><h2>${weak.length ? `มี ${weak.length} ข้อ รอให้เรากลับไปเก็บ` : 'ยังไม่มีข้อที่พลาด'}</h2><p>${weak.length ? 'ฝึกเฉพาะข้อที่เคยตอบผิด ตอบถูกแล้วจะถูกนำออกจากรายการ' : 'เมื่อทำแบบฝึก เว็บจะจำข้อที่ควรทวนไว้ให้ในเบราว์เซอร์นี้'}</p></div><button class="btn secondary" type="button" data-action="start-wrong" ${weak.length ? '' : 'disabled'}>ทวนข้อที่พลาด ${icon('refresh')}</button></section>${state.attempts.length ? `<section><div class="section-heading"><h2>การฝึกที่ผ่านมา</h2></div><div class="attempt-list">${state.attempts.slice(-5).reverse().map(a => `<div class="attempt-row"><span>${a.mode === 'exam' ? 'จำลองสอบ' : 'ฝึกทีละข้อ'}</span><span>${new Date(a.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</span><strong>${a.correct}/${a.total} ข้อ</strong><span class="pill ${a.percent >= 85 ? 'storage' : 'amber'}">${a.percent}%</span></div>`).join('')}</div></section>` : ''}</div>`;
  }
  function shuffle(items) { const array = [...items]; for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }
  function startQuiz(mode, topic = 'all', count = 10) {
    let pool = mode === 'wrong' ? bank.questions.filter(q => state.wrong.includes(q.id)) : bank.questions.filter(q => topic === 'all' || q.topic === topic);
    if (!pool.length) return toast('ยังไม่มีคำถามในหัวข้อนี้');
    pool = shuffle(pool).slice(0, mode === 'wrong' ? pool.length : Math.min(count, pool.length));
    quiz = { mode, questions: pool, index: 0, answers: {}, checked: {}, showThai: mode !== 'exam', finished: false, deadline: mode === 'exam' ? Date.now() + 60 * 60 * 1000 : null, startedAt: Date.now() };
    clearInterval(quizTimer);
    if (mode === 'exam') quizTimer = setInterval(() => { if (quiz && !quiz.finished) { updateTimer(); if (Date.now() >= quiz.deadline) finishQuiz(true); } }, 1000);
    if (route.view !== 'quiz') location.hash = '#quiz'; else renderQuiz();
  }
  function timeText() { if (!quiz?.deadline) return 'ไม่จับเวลา'; const seconds = Math.max(0, Math.ceil((quiz.deadline - Date.now()) / 1000)); return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
  function updateTimer() { document.querySelectorAll('[data-timer]').forEach(e => { e.textContent = timeText(); }); }
  function quizView() {
    if (!quiz) return quizSetup();
    if (quiz.finished) return quizResults();
    const q = quiz.questions[quiz.index], checked = !!quiz.checked[q.id], selected = quiz.answers[q.id] || [];
    const result = checked ? core.gradeSelection(q, selected) : null;
    const answered = quiz.questions.filter(q => quiz.answers[q.id]?.length).length;
    return `<div class="page">${header(quiz.mode === 'exam' ? 'โหมดจำลองสอบ' : quiz.mode === 'wrong' ? 'กลับมาเก็บข้อที่พลาด' : 'ฝึกทีละข้อให้เข้าใจ', 'SELECT ALL CORRECT STATEMENTS', 'ทุกข้ออาจมีคำตอบถูกมากกว่าหนึ่งตัวเลือก', '<span class="timer">' + icon('clock') + '<strong data-timer>' + timeText() + '</strong></span>')}<div class="quiz-layout"><section class="question-panel"><div class="question-top"><span class="question-count">ข้อ ${quiz.index + 1} <small>/ ${quiz.questions.length}</small></span>${topicPill(q.topic)}</div><h2 class="question-stem" lang="en">${esc(q.stem)}</h2><button class="text-link translation-toggle" type="button" data-action="translate" aria-expanded="${quiz.showThai}">${quiz.showThai ? 'ซ่อนคำแปลไทย' : 'ดูคำแปลไทย'}</button>${quiz.showThai ? `<p class="translation">${esc(q.thai)}</p>` : ''}${q.code ? `<pre tabindex="0"><code>${esc(q.code)}</code></pre>` : ''}<fieldset class="question-options"><legend class="sr-only">เลือกทุกตัวเลือกที่ถูกต้อง</legend>${q.options.map((option, index) => { const chosen = selected.includes(index); const status = checked ? option.correct ? (chosen ? 'correct' : 'missed') : chosen ? 'incorrect' : '' : chosen ? 'selected' : ''; return `<label class="option ${status}"><input type="checkbox" name="answer" value="${index}" ${chosen ? 'checked' : ''} ${checked ? 'disabled' : ''}><span class="option-letter">${'ABCD'[index]}</span><span class="option-text"><span lang="en">${esc(option.text)}</span>${checked ? `<small class="option-explanation">${option.correct ? '✓ ข้อความนี้ถูก' : '✕ ข้อความนี้ผิด'} · ${esc(option.why)}</small>` : ''}</span></label>`; }).join('')}</fieldset>${checked ? `<div class="quiz-feedback ${result.correct ? 'success' : 'error'}" role="status"><strong>${result.correct ? '✓ ถูกครบทุกตัวเลือก · ได้ 1 คะแนน' : 'ยังไม่ครบชุดคำตอบที่ถูก · ได้ 0 คะแนน'}</strong><p>คำตอบที่ถูก: ${result.expected.map(i => 'ABCD'[i]).join(', ')}${result.missing.length ? ` · ยังขาด ${result.missing.map(i => 'ABCD'[i]).join(', ')}` : ''}${result.extra.length ? ` · เลือกเกิน ${result.extra.map(i => 'ABCD'[i]).join(', ')}` : ''}</p>${sourceLabel(q.source)}</div>` : ''}<div class="quiz-toolbar"><button class="btn secondary" type="button" data-action="quiz-prev" ${quiz.index === 0 ? 'disabled' : ''}>← ข้อก่อน</button><div>${quiz.mode !== 'exam' && !checked ? '<button class="btn primary" type="button" data-action="check-answer">ตรวจคำตอบ</button>' : ''}${quiz.index < quiz.questions.length - 1 ? '<button class="btn ' + (checked || quiz.mode === 'exam' ? 'primary' : 'ghost') + '" type="button" data-action="quiz-next">ข้อถัดไป →</button>' : '<button class="btn primary" type="button" data-action="finish-quiz">จบและดูผล</button>'}</div></div></section><aside class="quiz-side"><div class="panel"><h3>แผนที่คำถาม</h3><p>ตอบแล้ว ${answered}/${quiz.questions.length} ข้อ</p><div class="question-map">${quiz.questions.map((q, i) => `<button class="question-dot ${i === quiz.index ? 'current' : ''} ${quiz.answers[q.id]?.length ? 'answered' : ''} ${quiz.checked[q.id] && !core.gradeSelection(q, quiz.answers[q.id] || []).correct ? 'wrong' : ''}" type="button" data-action="quiz-jump" data-index="${i}" aria-label="ไปข้อ ${i + 1}" ${i === quiz.index ? 'aria-current="step"' : ''}>${i + 1}</button>`).join('')}</div><div class="scoring-note"><strong>กติกาคะแนน</strong><p>ถูกครบ ไม่ขาด ไม่เกิน = 1<br>ผิดแม้ตัวเลือกเดียว = 0</p></div><button class="btn secondary" type="button" data-action="finish-quiz">จบชุดนี้และดูผล</button></div><a class="text-link" href="#reader/${lessons.find(l => l.topic === q.topic)?.id || ''}">เปิดบทที่เกี่ยวข้อง ${icon('arrow')}</a><p class="small-note">แบบฝึกเพื่อทบทวน ไม่ใช่ข้อสอบจริง</p></aside></div></div>`;
  }
  function renderQuiz() { if (route.view !== 'quiz') return; main.innerHTML = quizView(); updateTimer(); }
  function recordQuestion(q) {
    const correct = core.gradeSelection(q, quiz.answers[q.id] || []).correct;
    state.wrong = correct ? state.wrong.filter(id => id !== q.id) : [...new Set([...state.wrong, q.id])];
  }
  function finishQuiz(timedOut = false) {
    if (!quiz || quiz.finished) return;
    if (quiz.mode !== 'exam') {
      const unchecked = quiz.questions.filter(q => !quiz.checked[q.id]).length;
      if (unchecked && !timedOut && !confirm(`ยังมี ${unchecked} ข้อที่ไม่ได้ตรวจคำตอบ ต้องการจบชุดนี้และดูผลเลยหรือไม่?`)) return;
    } else {
      const unanswered = quiz.questions.filter(q => !quiz.answers[q.id]?.length).length;
      if (unanswered && !timedOut && !confirm(`ยังมี ${unanswered} ข้อที่ไม่ได้ตอบ ข้อเว้นว่างได้ 0 คะแนน ต้องการส่งคำตอบหรือไม่?`)) return;
    }
    quiz.finished = true; clearInterval(quizTimer);
    const result = core.summarize(quiz.questions, quiz.answers);
    quiz.questions.forEach(recordQuestion);
    state.attempts.push({ date: new Date().toISOString(), mode: quiz.mode, correct: result.correct, total: result.total, percent: result.percent });
    state.attempts = state.attempts.slice(-30); persist(); sidebar(); renderQuiz();
    if (timedOut) toast('ครบเวลาแล้ว ตรวจคำตอบทั้งหมดให้เรียบร้อย');
    window.scrollTo({ top: 0 });
  }
  function quizResults() {
    const result = core.summarize(quiz.questions, quiz.answers);
    const wrong = result.rows.filter(r => !r.correct);
    return `<div class="page">${header('รู้แล้วว่าต้องกลับไปเก็บตรงไหน', 'YOUR PRACTICE REVIEW', 'คะแนนเป็นจุดเริ่มต้นของการทวน อ่านเหตุผลให้เข้าใจแล้วลองใหม่ได้เสมอ')}<div class="result-summary panel"><div class="score-ring" style="--score:${result.percent}%"><strong>${result.percent}<small>%</small></strong></div><div><span class="pill ${result.percent >= 85 ? 'storage' : 'amber'}">${result.percent >= 85 ? 'ถึงเป้าหมายฝึก 85%' : 'เก็บจุดที่พลาด แล้วลองอีกครั้ง'}</span><h2>ถูกครบ ${result.correct} จาก ${result.total} ข้อ</h2><p>คะแนนเทียบส่วนทฤษฎี 15 คะแนน: <strong>${(result.correct / result.total * 15).toFixed(1)} / 15</strong><br>เป็นเพียงคะแนนเทียบจากแบบฝึก ไม่ใช่คะแนนหรือเกรดจริง</p><div class="hero-actions"><button class="btn primary" type="button" data-action="new-quiz">เลือกชุดฝึกใหม่ ${icon('arrow')}</button>${wrong.length ? '<button class="btn secondary" type="button" data-action="retry-current">ลองเฉพาะข้อที่ผิด</button>' : ''}</div></div></div><div class="stats-grid topic-results">${Object.entries(result.topics).map(([t, value]) => `<a class="stat-card" href="#reader/${lessons.find(l => l.topic === t)?.id || ''}">${topicPill(t)}<strong class="stat-number">${value.correct}<span>/${value.total}</span></strong><small>กลับไปอ่าน ${topics[t]?.short || t} →</small></a>`).join('')}</div><div class="section-heading"><h2>เฉลยทุกข้อ พร้อมเหตุผล</h2><span>${wrong.length} ข้อถูกเก็บไว้ในสมุดข้อที่พลาด</span></div><div class="review-list">${result.rows.map((row, i) => `<details class="review-card" ${row.correct ? '' : 'open'}><summary><span class="review-status ${row.correct ? 'correct' : 'incorrect'}">${row.correct ? '✓' : '✕'}</span><span><small>ข้อ ${i + 1} · ${topics[row.question.topic]?.short}</small><strong lang="en">${esc(row.question.stem)}</strong></span><span>${row.correct ? '1/1' : '0/1'}</span></summary><div class="review-body"><p class="translation">${esc(row.question.thai)}</p>${row.question.code ? `<pre tabindex="0"><code>${esc(row.question.code)}</code></pre>` : ''}${row.question.options.map((o, j) => `<div class="review-option ${o.correct ? 'correct' : ''}"><strong>${'ABCD'[j]}. ${o.correct ? '✓ ถูก' : '✕ ผิด'} ${quiz.answers[row.question.id]?.includes(j) ? '· คุณเลือกข้อนี้' : ''}</strong><p lang="en">${esc(o.text)}</p><p>${esc(o.why)}</p></div>`).join('')}${sourceLabel(row.question.source)}</div></details>`).join('')}</div></div>`;
  }
  function labsPage() {
    return `<div class="page">${header('เขียนเองให้ได้ แล้วอธิบายให้เป็น', 'PUT IT INTO PRACTICE', 'เตรียมภาคปฏิบัติด้วยโจทย์ที่รวม DOM, Event และ Storage ลองทำก่อนเปิดคำใบ้')}<div class="practice-banner"><span>${icon('code')}</span><div><strong>วิธีฝึกที่ได้ประโยชน์</strong><p>เปิด VSCode สร้าง HTML และ JavaScript ของตัวเอง → ทำตาม requirement → ทดลองกรณีปกติ/ค่าว่าง/refresh → ค่อยเปิดดูแนวทาง</p></div></div><div class="lab-grid">${bank.labs.map((lab, i) => `<article class="lab-card"><div class="lab-meta">${topicPill(lab.topic)}<span>${lab.minutes} นาที</span><span>LAB ${String(i + 1).padStart(2, '0')}</span></div><h2>${esc(lab.title)}</h2><p>${inline(lab.brief)}</p><h3>สิ่งที่ต้องทำให้ได้</h3><ul class="lab-checklist">${lab.requirements.map(r => `<li>${inline(r)}</li>`).join('')}</ul><details><summary>ขอคำใบ้ก่อน <span>＋</span></summary><ol>${lab.hints.map(h => `<li>${inline(h)}</li>`).join('')}</ol></details><details><summary>ดูแนวทาง หลังลองทำแล้ว <span>＋</span></summary><p>ตัวอย่างสำหรับเทียบวิธีคิด ต้องปรับ HTML/selector ให้ตรงงานของตัวเอง</p><pre tabindex="0"><code>${esc(lab.solution)}</code></pre></details><details><summary>ตรวจงานตัวเอง <span>＋</span></summary><ul>${lab.checks.map(c => `<li>${inline(c)}</li>`).join('')}</ul></details><button class="btn ${state.labDone[lab.id] ? 'secondary' : 'primary'}" type="button" data-action="lab-done" data-id="${lab.id}">${icon('check')} ${state.labDone[lab.id] ? 'ฝึกแล้ว · ยกเลิกเครื่องหมาย' : 'ทำเองและตรวจครบแล้ว'}</button></article>`).join('')}</div><p class="study-note">โจทย์ฝึกสร้างจากทักษะในวิชา ไม่ใช่การยืนยันโจทย์ที่จะออกสอบ · การทำเครื่องหมายเป็นการประเมินตนเอง</p></div>`;
  }
  function parseRoute() { const [view, ...parts] = location.hash.slice(1).split('/'); return { view: Object.hasOwn(names, view) ? view : 'dashboard', id: parts.join('/') }; }
  function render() {
    route = parseRoute(); document.body.classList.remove('nav-open'); document.querySelector('.mobile-menu').setAttribute('aria-expanded', 'false');
    document.querySelector('#breadcrumb').innerHTML = `พื้นที่เรียนของฉัน <span>/</span> ${names[route.view]}`;
    if (route.view === 'facts' && factTopicOrder.includes(route.id)) { factsTopic = route.id; factsSubtopic = 'all'; }
    sidebar(); activeLesson = null;
    main.innerHTML = route.view === 'reader' ? reader(route.id) : route.view === 'facts' ? factsPage() : route.view === 'quiz' ? quizView() : route.view === 'labs' ? labsPage() : dashboard();
    document.title = `${names[route.view]} · INT151 ห้องติวพร้อมสอบ`;
    if (route.view === 'facts') renderFacts();
    window.scrollTo({ top: 0 });
  }
  function searchResults(query = '') {
    const target = document.querySelector('#search-results'), value = query.trim().toLocaleLowerCase();
    if (!value) { target.innerHTML = '<p class="search-empty">ค้นหาบทเรียนหรือข้อเท็จจริง เช่น Cookie, target, getItem</p>'; return; }
    const lessonMatches = lessons.filter(l => `${l.title} ${l.text}`.toLocaleLowerCase().includes(value)).slice(0, 7);
    const factMatches = bank.facts.filter(f => `${f.truth} ${f.why}`.toLocaleLowerCase().includes(value)).slice(0, 7);
    target.innerHTML = `${lessonMatches.map(l => `<a class="search-result" href="#reader/${l.id}"><span class="search-result-icon">${icon('book')}</span><span><small>บทเรียน · ${topics[l.topic]?.short}</small><strong>${esc(l.title)}</strong><span>${esc(l.description)}</span></span>${icon('arrow')}</a>`).join('')}${factMatches.map(f => `<button class="search-result" type="button" data-action="search-fact" data-id="${f.id}"><span class="search-result-icon">${icon('cards')}</span><span><small>ข้อเท็จจริง · ${topics[f.topic]?.short}</small><strong>${esc(f.truth)}</strong></span>${icon('arrow')}</button>`).join('')}${!lessonMatches.length && !factMatches.length ? '<p class="search-empty">ไม่พบผล ลองใช้คำสั้นลงหรือชื่อ API ภาษาอังกฤษ</p>' : ''}`;
  }
  function openSearch() { const d = document.querySelector('#search-dialog'); if (!d.open) d.showModal(); document.querySelector('#global-search').value = ''; searchResults(); document.querySelector('#global-search').focus(); }
  document.addEventListener('click', event => {
    const actionButton = event.target.closest('[data-action]');
    if (event.target.closest('#search-results a')) document.querySelector('#search-dialog').close();
    if (event.target.closest('.mobile-menu')) { const open = document.body.classList.toggle('nav-open'); document.querySelector('.mobile-menu').setAttribute('aria-expanded', String(open)); }
    if (event.target.closest('.nav-backdrop')) { document.body.classList.remove('nav-open'); document.querySelector('.mobile-menu').setAttribute('aria-expanded', 'false'); }
    if (!actionButton) return;
    const { action, id, topic, index } = actionButton.dataset;
    if (action === 'search') openSearch();
    if (action === 'close-search') document.querySelector('#search-dialog').close();
    if (action === 'theme') { state.theme = state.theme === 'dark' ? 'light' : 'dark'; setTheme(); persist(); }
    if (action === 'font') { state.largeText = !state.largeText; setTheme(); persist(); toast(state.largeText ? 'ใช้ตัวอักษรขนาดใหญ่' : 'ใช้ตัวอักษรขนาดปกติ'); }
    if (action === 'mark-read') { state.read[id] = !state.read[id]; persist(); sidebar(); const y = window.scrollY; main.innerHTML = reader(id); window.scrollTo({ top: y }); toast(state.read[id] ? 'บันทึกว่าอ่านบทนี้แล้ว' : 'นำเครื่องหมายอ่านแล้วออก'); }
    if (action === 'fact-topic') { factsTopic = topic; factsSubtopic = 'all'; main.innerHTML = factsPage(); renderFacts(); document.querySelector(`[data-action="fact-topic"][data-topic="${topic}"]`).focus({ preventScroll: true }); }
    if (action === 'know-fact' || action === 'star-fact') {
      const map = action === 'know-fact' ? state.known : state.starred; map[id] = !map[id]; persist();
      const y = window.scrollY; renderFacts(); window.scrollTo({ top: y });
    }
    if (action === 'search-fact') { document.querySelector('#search-dialog').close(); const fact = bank.facts.find(f => f.id === id); factsTopic = 'all'; factsSubtopic = 'all'; factsMode = 'all'; factsSearch = fact?.truth || ''; if (route.view === 'facts') { main.innerHTML = factsPage(); renderFacts(); } else location.hash = '#facts'; }
    if (action === 'start-exam') startQuiz('exam', 'all', 30);
    if (action === 'start-wrong') startQuiz('wrong');
    if (action === 'translate' && quiz) { quiz.showThai = !quiz.showThai; renderQuiz(); }
    if (action === 'quiz-prev' && quiz) { quiz.index = Math.max(0, quiz.index - 1); renderQuiz(); }
    if (action === 'quiz-next' && quiz) { quiz.index = Math.min(quiz.questions.length - 1, quiz.index + 1); renderQuiz(); }
    if (action === 'quiz-jump' && quiz) { quiz.index = Number(index); renderQuiz(); }
    if (action === 'check-answer' && quiz) { const q = quiz.questions[quiz.index]; if (!quiz.answers[q.id]?.length) return toast('เลือกคำตอบก่อนตรวจ อย่างน้อยหนึ่งตัวเลือก'); quiz.checked[q.id] = true; recordQuestion(q); persist(); renderQuiz(); }
    if (action === 'finish-quiz') finishQuiz();
    if (action === 'new-quiz') { clearInterval(quizTimer); quiz = null; renderQuiz(); }
    if (action === 'retry-current' && quiz) { const wrongIds = core.summarize(quiz.questions, quiz.answers).rows.filter(r => !r.correct).map(r => r.question.id); const pool = bank.questions.filter(q => wrongIds.includes(q.id)); quiz = { mode: 'practice', questions: shuffle(pool), index: 0, answers: {}, checked: {}, showThai: true, finished: false, deadline: null, startedAt: Date.now() }; renderQuiz(); }
    if (action === 'lab-done') { state.labDone[id] = !state.labDone[id]; persist(); actionButton.innerHTML = `${icon('check')} ${state.labDone[id] ? 'ฝึกแล้ว · ยกเลิกเครื่องหมาย' : 'ทำเองและตรวจครบแล้ว'}`; actionButton.classList.toggle('primary', !state.labDone[id]); actionButton.classList.toggle('secondary', !!state.labDone[id]); }
  });
  document.addEventListener('submit', event => { if (event.target.id !== 'quiz-config') return; event.preventDefault(); startQuiz('practice', document.querySelector('#quiz-topic').value, Number(document.querySelector('#quiz-count').value)); });
  document.addEventListener('change', event => {
    if (event.target.matches('input[name="answer"]') && quiz) { const q = quiz.questions[quiz.index]; if (quiz.checked[q.id]) return; quiz.answers[q.id] = [...document.querySelectorAll('input[name="answer"]:checked')].map(input => Number(input.value)); document.querySelectorAll('.option').forEach(label => label.classList.toggle('selected', label.querySelector('input').checked)); }
    if (event.target.id === 'fact-mode') { factsMode = event.target.value; renderFacts(); }
    if (event.target.id === 'fact-subtopic') { factsSubtopic = event.target.value; renderFacts(); }
  });
  document.addEventListener('input', event => { if (event.target.id === 'global-search') searchResults(event.target.value); if (event.target.id === 'fact-search') { factsSearch = event.target.value; renderFacts(); } });
  document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') { event.preventDefault(); openSearch(); } if (event.key === 'Escape') { const dialog = document.querySelector('#search-dialog'); if (dialog.open) dialog.close(); document.body.classList.remove('nav-open'); document.querySelector('.mobile-menu').setAttribute('aria-expanded', 'false'); } });
  window.addEventListener('hashchange', render);
  window.addEventListener('beforeunload', event => { if (quiz && !quiz.finished) { event.preventDefault(); event.returnValue = ''; } });
  document.querySelector('.mobile-menu').innerHTML = icon('menu');
  window.INT151 = { getState: () => state, getQuiz: () => quiz, core };
  setTheme(); render();
})();
