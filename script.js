const SCRIPT_VERSION = '17.3'; // Versión final corregida

const ICONS = {
    consolidado: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M3 13h6V3H3v10zm0 8h6v-6H3v6zm8 0h10V11H11v10zm0-18v6h10V3H11z"/></svg>`,
    website: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-1c-.9 0-1.64.58-1.9 1.39-.53 1.54.42 3.23 1.9 3.51v.43c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-.43c1.48-.28 2.43-1.97 1.9-3.51z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25 1.09-.83 1.82-1.88 2.06-.41.09-1.13.17-2.17.23-.96.06-2.03.1-3.28.1-2.34 0-4.3-.05-5.92-.15-1.03-.06-1.76-.14-2.17-.23-1.05-.24-1.63-.97-1.88-2.06C3.16 15.8 3 14.19 3 12s.16-3.8.44-4.83c.25-1.09.83-1.82-1.88-2.06.41-.09-1.13-.17-2.17-.23.96-.06-2.03.1-3.28.1-2.34 0-4.3-.05-5.92-.15-1.03-.06-1.76-.14-2.17-.23-1.05-.24-1.63-.97-1.88-2.06.28-1.03.44-2.64.44-4.83l.01-1.17c0-.59.03-1.29.1-2.09.06-.8.15-1.43.28-1.9.12-.47.22-.72.25-.72s.13.25.25.72c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.01-1.58-.01-3.2-.01-4.82-1.64-.1-3.29-.01-4.92.27-.01 2.21-.01 4.43-.01 6.64 0 2.9-.83 5.6-2.64 7.82-1.81 2.22-4.27 3.46-6.93 3.46-2.65 0-5.1-1.25-6.91-3.48-1.8-2.22-2.65-4.91-2.65-7.82 0-2.91.84-5.61 2.65-7.83 1.8-2.22 4.26-3.47 6.91-3.47.33 0 .66.02.99.04v4.03c-1.39-.1-2.79-.01-4.17.29-.1 2.21-.01 4.43.01 6.62H12.5V.02z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    threads: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M10.96 3.63A1.5 1.5 0 0 1 12 5.1v13.8a1.5 1.5 0 0 1-3 0V5.1a1.5 1.5 0 0 1 1.96-1.47M15.5 8.16a1.5 1.5 0 0 1 1.04.42 1.5 1.5 0 0 1 0 2.12 1.5 1.5 0 0 1-2.56.22 3.51 3.51 0 0 0-4.95 0 1.5 1.5 0 0 1-2.56-.22 1.5 1.5 0 0 1 0-2.12 1.5 1.5 0 0 1 1.04-.42 3.51 3.51 0 0 0 4.95 0m-1.54 8.23c.8-.8.8-2.07 0-2.87a3.51 3.51 0 0 0-4.95 0c-.8.8-.8 2.07 0 2.87a3.51 3.51 0 0 0 4.95 0M4.14 17.5A9.51 9.51 0 0 1 3 12a9.51 9.51 0 0 1 1.14-4.5 1.5 1.5 0 1 1 2.6 1.5A6.5 6.5 0 0 0 6 12a6.5 6.5 0 0 0 .74 3 1.5 1.5 0 0 1-2.6 1.5m15.72 0a1.5 1.5 0 0 1-2.6-1.5 6.5 6.5 0 0 0 .74-3 6.5 6.5 0 0 0-.74-3 1.5 1.5 0 1 1 2.6-1.5A9.51 9.51 0 0 1 21 12a9.51 9.51 0 0 1-1.14 4.5z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m-1.39 9.94v-8.37H8.27v8.37H5.49z"/></svg>`,
    spotify: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m4.14 14.28c-.23.36-.7.47-1.05.23-2.9-1.77-6.52-2.17-10.89-1.2a.66.66 0 0 1-.72-.64.66.66 0 0 1 .64-.72c4.73-1.04 8.74-.6 11.93 1.32.35.23.46.7.25 1.01M17.5 12.3c-.27.43-.84.57-1.27.3-3.2-1.95-8.04-2.52-12.2-1.37a.78.78 0 0 1-.87-.77c0-.43.37-.78.8-.86C8.8 8.6 14 9.23 17.58 11.4c.43.27.57.84.32 1.27m.1-3.66c-3.76-2.27-9.94-2.48-13.84-1.37a.95.95 0 0 1-1.04-.92.95.95 0 0 1 .92-1.04c4.3-.92 10.9-1.13 15.15 1.4.5.3.66.93.36 1.43c-.3.5-.93.66-1.43.36z"/></svg>`,
    reactions: { like: `...`, love: `...`, comment: `...` }
}

const NAV_ITEMS = [
    { id: 'consolidado', label: 'Consolidado', icon: ICONS.consolidado },
    { id: 'website', label: 'Sitio Web', icon: ICONS.website },
    { id: 'instagram', label: 'Instagram', icon: ICONS.instagram },
    { id: 'youtube', label: 'YouTube', icon: ICONS.youtube },
    { id: 'tiktok', label: 'TikTok', icon: ICONS.tiktok },
    { id: 'x', label: 'X', icon: ICONS.x },
    { id: 'linkedin', label: 'LinkedIn', icon: ICONS.linkedin },
    { id: 'threads', label: 'Threads', icon: ICONS.threads },
    { id: 'spotify', label: 'Spotify', icon: ICONS.spotify },
];

const STATE = { data: null, view: 'consolidado', dates: {} };
const $ = (selector) => document.querySelector(selector);
const quickSelect = $('#rangeQuick');
const compareWrap = $('#compareWrap');
const [dateStartA, dateEndA, dateStartB, dateEndB] = [$('#dateStartA'), $('#dateEndA'), $('#dateStartB'), $('#dateEndB')];
const subtitle = $('#subtitle');
const API_BASE_URL = 'https://observauto-dashboard.vercel.app/api';

async function fetchData(startDate, endDate, compareStartDate = null, compareEndDate = null) {
    const params = new URLSearchParams({ startDate, endDate });
    if (compareStartDate && compareEndDate) {
        params.append('compareStartDate', compareStartDate);
        params.append('compareEndDate', compareEndDate);
    }
    const url = `${API_BASE_URL}/data?${params.toString()}`;
    console.log(`Fetching data from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falló la obtención de datos:", error);
        throw error;
    }
}

function createNav() {
    const nav = $('#sidebar-nav');
    nav.innerHTML = NAV_ITEMS.map(item => `
        <a href="#" id="nav-${item.id}" class="nav-item ${item.id === STATE.view ? 'active' : ''}" title="${item.label}">
            ${item.icon} <span class="label">${item.label}</span>
        </a>
    `).join('');
}

function bindNav() { /* ... no changes here ... */ }
const fmt = (n) => n ? n.toLocaleString('es-ES') : '0';
const fmtd = (d) => new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
const getWindows = (mode, dates) => { /* ... no changes here ... */ };

function handleDateChange() {
    const isCompare = quickSelect.value === 'compare';
    compareWrap.style.display = isCompare ? 'grid' : 'none';
    if (!isCompare) {
        const windows = getWindows(quickSelect.value, {});
        STATE.dates.startA = windows.periodA.start;
        STATE.dates.endA = windows.periodA.end;
        dateStartA.value = STATE.dates.startA;
        dateEndA.value = STATE.dates.endA;
    }
    render();
};

function createCard({ label, value, delta, periodA, periodB, deltaType = 'percentage' }) { /* ... no changes here ... */ }
function createChart(containerId, { type, labels, datasets }) { /* ... no changes here ... */ }
function createTopContentTable(title, data, isWebsite = false) { /* ... no changes here ... */ }

async function render() {
    console.log(`Renderizando vista: ${STATE.view}`);
    document.body.style.cursor = 'wait';
    subtitle.textContent = 'Cargando datos...';
    
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    $(`#nav-${STATE.view}`).classList.add('active');

    const isCompare = quickSelect.value === 'compare';
    if(isCompare) {
        STATE.dates.startA = dateStartA.value;
        STATE.dates.endA = dateEndA.value;
        STATE.dates.startB = dateStartB.value;
        STATE.dates.endB = dateEndB.value;
    }
    
    const windows = getWindows(quickSelect.value, STATE.dates);
    
    try {
        const data = await fetchData(windows.periodA.start, windows.periodA.end, windows.periodB.start, windows.periodB.end);
        STATE.data = data;

        if (!STATE.data) throw new Error("No se recibieron datos.");

        const currentView = $(`#view-${STATE.view}`);
        currentView.style.display = 'grid';
        currentView.innerHTML = '';
    
        switch (STATE.view) {
            case 'consolidado': renderConsolidado(); break;
            case 'website': renderWebsite(); break;
        }
    
        const subtitleText = isCompare
            ? `Comparando ${fmtd(windows.periodA.start)}-${fmtd(windows.periodA.end)} (A) con ${fmtd(windows.periodB.start)}-${fmtd(windows.periodB.end)} (B)`
            : `Mostrando datos de ${fmtd(windows.periodA.start)} a ${fmtd(windows.periodA.end)}`;
        subtitle.textContent = subtitleText;

    } catch (error) {
        console.error("Error al renderizar:", error);
        subtitle.textContent = 'Error al cargar los datos. Intenta de nuevo.';
        $(`#view-${STATE.view}`).innerHTML = `<div class="card"><p style="color:var(--red); text-align:center;">${error.message}</p></div>`;
    } finally {
        document.body.style.cursor = 'default';
    }
}

function renderConsolidado() { /* ... no changes here ... */ }
function renderWebsite() { /* ... no changes here ... */ }

function load() {
    console.log(`Dashboard Observauto v${SCRIPT_VERSION}`);
    createNav();
    bindNav();
    handleDateChange();
}

document.addEventListener('DOMContentLoaded', load);
