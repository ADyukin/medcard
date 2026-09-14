import { Reader } from './reader.js?v=10';

const records = [
  { title: '18 февраля 2026 · Терапевт', meta: 'Новикова Е. С. · Городская поликлиника № 17', page: 1, sections: [['Кем направлен', 'Самостоятельно.'], ['Жалобы и анамнез заболевания', 'Повышенная утомляемость, периодическая головная боль в течение двух недель. Сон удовлетворительный.'], ['Объективный статус', 'Общее состояние удовлетворительное. Температура тела 36,7 °C. Кожные покровы обычной окраски.'], ['Рекомендации', 'Наблюдение в динамике. Результаты назначенных исследований — в приложении к записи.']] },
  { title: '2 декабря 2025 · Кардиолог', meta: 'Соколов М. В. · ГКБ им. М. П. Кончаловского', page: 6, sections: [['Кем направлен', 'Участковым терапевтом.'], ['Жалобы и анамнез заболевания', 'Эпизоды учащённого сердцебиения при физической нагрузке. Болевой синдром отрицает.'], ['Объективный статус', 'Артериальное давление и пульс зафиксированы в протоколе осмотра. Отёков нет.'], ['Заключение', 'Рекомендовано продолжить обследование и прийти на повторный приём с результатами ЭКГ.']] },
  { title: '14 октября 2025 · Офтальмолог', meta: 'Брусенцова В. В. · Диагностический центр «Зрение»', page: 11, sections: [['Кем направлен', 'Самостоятельно.'], ['Жалобы', 'Ощущение сухости глаз к концу рабочего дня, эпизодический дискомфорт при работе за монитором.'], ['Осмотр', 'Острота зрения и состояние переднего отрезка глаза описаны в протоколе исследования.'], ['Рекомендации', 'Перерывы при работе за экраном. Контрольный осмотр — по необходимости.']] },
  { title: '20 сентября 2025 · Дерматолог', meta: 'Орлова Н. А. · Клиника кожных заболеваний «Линия»', page: 16, sections: [['Кем направлен', 'Самостоятельно.'], ['Жалобы и анамнез заболевания', 'Сухость кожи кистей, усиливающаяся в холодное время года.'], ['Местный статус', 'Умеренная сухость и мелкопластинчатое шелушение тыльной поверхности кистей.'], ['Диагноз', 'Предварительное заключение внесено врачом в медицинскую запись.']] },
  { title: '3 сентября 2025 · Профилактический приём', meta: 'Кузнецова И. Р. · Медицинский центр «Семейный»', page: 21, sections: [['Цель обращения', 'Профилактический осмотр.'], ['Анамнез', 'Хронические заболевания и постоянная терапия уточнены на приёме.'], ['Результаты', 'Результаты профилактических исследований прикреплены к медицинской карте.'], ['Статус записи', 'Архивная запись.']] },
];

const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const section = (title, body) => `<h2>${title}</h2><p>${body}</p>`;

function tocPage() {
  return `<p class="medical-eyebrow">Медицинская карта · Приёмы</p><h1 class="medical-title">Содержание</h1>
    ${records.map(record => `<div class="medical-entry"><div class="medical-entry-title"><strong>${esc(record.title)}</strong><span class="medical-entry-page">${record.page}</span></div><div class="medical-entry-meta">${esc(record.meta)}</div></div>`).join('')}
    <p class="medical-entry-meta" style="text-align:center">оглавление · 1/1</p>`;
}

function recordPage(record, index) {
  const details = record.sections.map(([title, body]) => section(title, body)).join('');

  return `<article class="medical-record-page" data-record-index="${index}">
    <p class="medical-document-date">${esc(record.title.split(' · ')[0])}</p>
    <p class="medical-document-author">${index === 0 ? 'Пронина А.И' : esc(record.meta.split(' · ')[0])}</p>
    <p class="medical-record-lead">Приём: первичный.</p>
    ${details}
    <div class="medical-page-fade" aria-hidden="true"></div>
  </article>`;
}

const reader = new Reader();
const filters = document.querySelector('.medical-filters');

let activeCategory = 'Приёмы';
let activeMonth = 'Все';

function filteredRecords() {
  if (activeCategory !== 'Приёмы') return [];
  return records.filter(record => activeMonth === 'Все' || record.title.includes(activeMonth));
}

function emptyPage() {
  return '<div class="medical-document"><p class="medical-eyebrow">Медицинская карта</p><h1 class="medical-title">Нет записей</h1><p>Для выбранного раздела пока нет данных.</p></div>';
}

function renderFilteredBook() {
  const visibleRecords = filteredRecords();
  reader.setPages([visibleRecords.length ? tocPage() : emptyPage(), ...visibleRecords.map(recordPage)], false);
}

renderFilteredBook();

document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  activeMonth = 'Все';
  filters.classList.add('month-view');
  document.querySelectorAll('[data-category]').forEach(item => item.classList.toggle('is-active', item === button));
  renderFilteredBook();
}));

document.querySelectorAll('[data-month]').forEach(button => button.addEventListener('click', () => {
  activeMonth = button.dataset.month;
  document.querySelectorAll('[data-month]').forEach(item => item.classList.toggle('is-active', item === button));
  renderFilteredBook();
}));

document.querySelector('[data-filter-back]').addEventListener('click', () => {
  activeMonth = 'Все';
  filters.classList.remove('month-view');
  renderFilteredBook();
});

const overlay = document.createElement('div');
overlay.className = 'record-overlay';
overlay.setAttribute('aria-hidden', 'true');
overlay.innerHTML = '<div class="record-sheet" role="dialog" aria-modal="true"><div class="record-overlay-content"></div><div class="record-overlay-fade" aria-hidden="true"></div></div>';
document.body.append(overlay);

function closeRecord() {
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.querySelector('#book').classList.remove('book--dismissed');
}

function openRecord(index) {
  const source = document.querySelector(`.medical-record-page[data-record-index="${index}"]`);
  if (!source) return;
  overlay.querySelector('.record-overlay-content').innerHTML = source.innerHTML;
  overlay.querySelector('.record-overlay-content .medical-page-fade')?.remove();
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.querySelector('#book').classList.add('book--dismissed');
  overlay.querySelector('.record-sheet').scrollTop = 0;
}

document.querySelector('#book').addEventListener('click', event => {
  const record = event.target.closest('.medical-record-page');
  if (record) openRecord(Number(record.dataset.recordIndex));
});
overlay.addEventListener('click', event => { if (event.target === overlay) closeRecord(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeRecord(); });
