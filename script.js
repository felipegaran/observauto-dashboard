// INICIO DE MODIFICACIÓN: Incrementamos la versión del script
const SCRIPT_VERSION = '15.0';
// FIN DE MODIFICACIÓN

function adjustMainPadding() {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    if (header && main) {
        const headerHeight = header.offsetHeight;
        main.style.paddingTop = `${headerHeight + 20}px`;
    }
}

const ICONS = {
    consolidado: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M3 13h6V3H3v10zm0 8h6v-6H3v6zm8 0h10V11H11v10zm0-18v6h10V3H11z"/></svg>`,
    website: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    instagram: `<i class="fa-brands fa-instagram" style="font-size:20px;"></i>`,
    youtube: `<i class="fa-brands fa-youtube" style="font-size:22px;"></i>`,
    tiktok: `<i class="fa-brands fa-tiktok" style="font-size:20px;"></i>`,
    x: `<i class="fa-brands fa-x-twitter" style="font-size:20px;"></i>`,
    linkedin: `<i class="fa-brands fa-linkedin" style="font-size:20px;"></i>`,
    threads: `<i class="fa-brands fa-threads" style="font-size:20px;"></i>`,
    spotify: `<i class="fa-brands fa-spotify" style="font-size:20px;"></i>`,
    reactions: { like: `👍`, love: `❤️`, comment: `💬`, share: `↪️` }
};

const SOCIAL_URLS = {
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
    tiktok: 'https://tiktok.com/',
    x: 'https://x.com/',
    linkedin: 'https://linkedin.com/company/',
    threads: 'https://threads.net/',
    spotify: 'https://open.spotify.com/show/'
};

const $ = s => document.querySelector(s);
let DATA = null,
    charts = [];
const quickSelect = $('#rangeQuick'),
    compareWrap = $('#compareWrap');
const dateStartA = $('#dateStartA'),
    dateEndA = $('#dateEndA');
const dateStartB = $('#dateStartB'),
    dateEndB = $('#dateEndB');
const dataUrl = `data.json?ts=${Date.now()}`;
const chartColors = {
    A: { blue: '#1D4ED8', red: '#B91C1C', green: '#14532D', purple: '#6B21A8', teal: '#0F766E', pink: '#BE185D', sky: '#0369A1' },
    B: { blue: '#60A5FA', red: '#F87171', green: '#4ADE80', purple: '#C084FC', teal: '#5EEAD4', pink: '#F472B6', sky: '#7DD3FC' }
};

const parseISO = s => new Date(s + 'T00:00:00');
const inRange = (d, a, b) => d >= a && d <= b;
const slice = (arr, s, e) => {
    if (!s || !e || !arr) return [];
    const a = parseISO(s),
        b = parseISO(e);
    return arr.filter(d => inRange(parseISO(d.date), a, b));
};
const sum = (arr, k) => (arr || []).reduce((t, d) => t + (Number(d[k]) || 0), 0);
const fmt = n => new Intl.NumberFormat().format(Number(n || 0));
const delta = (c, p) => { p = Number(p || 0); c = Number(c || 0); if (p === 0) return null; return ((c - p) / p) * 100; };
const arrow = v => v == null ? '' : (v >= 0 ? '▲' : '▼');
const cls = v => v >= 0 ? '#059669' : '#E41B13';
const stagger = els => els.forEach((el, i) => setTimeout(() => el.classList.add('enter'), 50 * i));
const formatDate = date => date.toISOString().slice(0, 10);
async function load() {
    try {
        const response = await fetch(dataUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        DATA = await response.json();

        Object.keys(DATA.social_bench).forEach(net => {
            if (DATA.social_bench[net].user && net !== 'spotify') {
                DATA.social_bench[net].user = '@observAuto';
            }
        });

        const endA = new Date(),
            startA = new Date(new Date().setDate(endA.getDate() - 27));
        const endB = new Date(new Date().setDate(startA.getDate() - 1)),
            startB = new Date(new Date().setDate(endB.getDate() - 27));
        dateEndA.value = formatDate(endA);
        dateStartA.value = formatDate(startA);
        dateEndB.value = formatDate(endB);
        dateStartB.value = formatDate(startB);

        generateSidebarNav();
        bindNav();
        render();
        adjustMainPadding();
        window.addEventListener('resize', () => {
            adjustMainPadding();
        });
    } catch (e) {
        document.body.innerHTML = `<div style="padding:40px;text-align:center;"><h2>Error al cargar datos</h2><p>${e.message}</p></div>`;
    }
}

function getWindows() {
    if (quickSelect.value === 'compare') {
        return {
            A: { start: dateStartA.value, end: dateEndA.value, label: "Periodo A" },
            B: { start: dateStartB.value, end: dateEndB.value, label: "Periodo B" }
        };
    } else {
        const days = Number(quickSelect.value);
        const endDates = (DATA.timeseries?.web || []).map(d => d.date).sort();
        const latest = endDates[endDates.length - 1] || formatDate(new Date());
        const eA = parseISO(latest);
        const sA = new Date(eA);
        sA.setDate(eA.getDate() - (days - 1));
        const eB = new Date(sA);
        eB.setDate(eB.getDate() - 1);
        const sB = new Date(eB);
        sB.setDate(sB.getDate() - (days - 1));
        return {
            A: { start: formatDate(sA), end: formatDate(eA), label: `Últimos ${days} días` },
            B: { start: formatDate(sB), end: formatDate(eB), label: `Anteriores ${days} días` }
        };
    }
}

function generateSidebarNav() {
    const navOrder = ['consolidado', 'website', 'linkedin', 'instagram', 'tiktok', 'youtube', 'x', 'threads', 'spotify'];
    let navHTML = '';
    navOrder.forEach((id, index) => {
        const label = id === 'x' ? 'X' : id.charAt(0).toUpperCase() + id.slice(1);
        navHTML += `<a href="#${id}" data-view="${id}" class="${index === 0 ? 'active' : ''}" aria-label="${label}">${ICONS[id]}<span class="label">${label}</span></a>`;
    });
    $('#sidebar-nav').innerHTML = navHTML;

    // Se mueven los listeners aquí para que se apliquen siempre que se genera la nav
    document.querySelectorAll('#sidebar-nav a').forEach(a => a.addEventListener('click', e => {
        e.preventDefault();
        
        // Cierra el menú en móvil si está abierto
        if (document.body.classList.contains('mobile-menu-open')) {
            document.body.classList.remove('mobile-menu-open');
        }

        document.querySelectorAll('#sidebar-nav a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
        render();
    }));
}

function bindNav() {
    const handleDateChange = () => {
        const isCompare = quickSelect.value === 'compare';
        compareWrap.style.display = isCompare ? 'flex' : 'none';
        $('#compare-mode-badge').style.display = 'inline-block';
        render();
        setTimeout(adjustMainPadding, 100);
    };
    quickSelect.addEventListener('change', handleDateChange);
    [dateStartA, dateEndA, dateStartB, dateEndB].forEach(el => el.addEventListener('change', render));

    $('#btnReload').addEventListener('click', () => location.reload());
    $('#btnPdf').addEventListener('click', () => {
        const current = $('.view:not([style*="display: none"])');
        const ts = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
        html2pdf().set({ filename: `observauto_${current.id}_${ts}.pdf`, margin: 10 }).from(current).save();
    });

    // --- INICIO DE MODIFICACIÓN: Funcionalidad del Menú Móvil ---
    const menuToggle = $('#menu-toggle');
    const overlay = $('#overlay');
    
    function toggleMenu() {
        document.body.classList.toggle('mobile-menu-open');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }
    // --- FIN DE MODIFICACIÓN ---
}

function clearCharts() { charts.forEach(c => c.destroy()); charts = []; }

function render() {
    clearCharts();
    const W = getWindows();
    const activeNavItem = document.querySelector('#sidebar-nav .active');
    const currentViewId = activeNavItem ? activeNavItem.dataset.view : 'consolidado';
    const isCompareMode = quickSelect.value === 'compare';

    let titleHTML = 'Dashboard Consolidado';
    const mainTitle = document.querySelector('#main-title');
    if (currentViewId !== 'consolidado') {
        const networkName = currentViewId === 'x' ? 'X' : currentViewId.charAt(0).toUpperCase() + currentViewId.slice(1);
        const user = DATA.social_bench[currentViewId]?.user;
        if (currentViewId === 'website') {
            titleHTML = `Estadísticas del Sitio Web`;
        } else if (user && SOCIAL_URLS[currentViewId]) {
            const profileUrl = (user.startsWith('@')) ? `${SOCIAL_URLS[currentViewId]}${user.replace('@', '')}` : SOCIAL_URLS[currentViewId];
            titleHTML = `<div class="main-title-with-user">
                         <span>Estadísticas de ${networkName}</span>
                         <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="user-badge">${ICONS[currentViewId]} ${user}</a>
                       </div>`;
        } else {
            titleHTML = `Estadísticas de ${networkName}`;
        }
    }
    mainTitle.innerHTML = titleHTML;

    const stamp = new Date(DATA.updated_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
    const comparisonText = isCompareMode ? `${W.A.start.slice(5)} / ${W.A.end.slice(5)} vs ${W.B.start.slice(5)} / ${W.B.end.slice(5)}` : `${W.A.label}`;
    $('#subtitle').innerHTML = `${comparisonText} · Act: ${stamp}`;
    $('#compare-mode-badge').textContent = isCompareMode ? 'Δ A vs B' : 'Δ vs periodo anterior';

    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    $('#app-footer').textContent = `© Observauto — V${SCRIPT_VERSION} (Cargado: ${timeString})`;

    document.querySelectorAll('section.view').forEach(v => v.style.display = 'none');
    const activeView = $(`#view-${currentViewId}`);
    activeView.style.display = 'grid';

    if (currentViewId === 'consolidado') renderConsolidado(W);
    else if (currentViewId === 'website') renderWebsite(W);
    else if (Object.keys(socialConfig).includes(currentViewId)) renderSocial(currentViewId, W);

    stagger([...activeView.querySelectorAll('.card')]);
}

function renderConsolidado(W) {
    const isCompareMode = quickSelect.value === 'compare';
    const view = $('#view-consolidado');
    const all_followers_A = sum(slice(DATA.timeseries.instagram, W.A.start, W.A.end), 'followers_gained'),
        all_followers_B = sum(slice(DATA.timeseries.instagram, W.B.start, W.B.end), 'followers_gained');
    const total_impressions_A = sum(slice(DATA.timeseries.web, W.A.start, W.A.end), 'pageviews') + sum(slice(DATA.timeseries.instagram, W.A.start, W.A.end), 'impressions'),
        total_impressions_B = sum(slice(DATA.timeseries.web, W.B.start, W.B.end), 'pageviews') + sum(slice(DATA.timeseries.instagram, W.B.start, W.B.end), 'impressions');
    const total_engagement_A = sum(slice(DATA.timeseries.tiktok, W.A.start, W.A.end), 'likes'),
        total_engagement_B = sum(slice(DATA.timeseries.tiktok, W.B.start, W.B.end), 'likes');
    const web_sessions_A = sum(slice(DATA.timeseries.web, W.A.start, W.A.end), 'sessions'),
        web_sessions_B = sum(slice(DATA.timeseries.web, W.B.start, W.B.end), 'sessions');

    view.innerHTML = `<div class="kpis"></div> <div class="card card-dark"></div> <div class="charts two-cols"></div><div class="card" id="top-content-card-consolidado"></div><div class="card" id="top-by-network-card"></div>`;

    view.querySelector('.kpis').innerHTML = `
        <div class="card card-with-accent col-3"><div class="accent-bar"></div><div class="card-content">${renderKPI('Crecimiento Audiencia', all_followers_A, all_followers_B)}</div></div>
        <div class="card card-with-accent col-3"><div class="accent-bar"></div><div class="card-content">${renderKPI('Alcance Total', total_impressions_A, total_impressions_B)}</div></div>
        <div class="card card-with-accent col-3"><div class="accent-bar"></div><div class="card-content">${renderKPI('Interacción Total', total_engagement_A, total_engagement_B)}</div></div>
        <div class="card card-with-accent col-3"><div class="accent-bar"></div><div class="card-content">${renderKPI('Tráfico Web (Sesiones)', web_sessions_A, web_sessions_B)}</div></div>`;
    view.querySelector('.card-dark').innerHTML = `<div class="card-dark-header"><strong>Insights Rápidos</strong><span class="badge">Generados automáticamente por IA</span></div><ul><li>Basado en el rendimiento consolidado en el periodo seleccionado.</li></ul>`;
    view.querySelector('.charts').innerHTML = `<div class="card"><div class="kpi-label" style="font-weight:600">Tráfico Web</div><div class="chartbox"><canvas id="chartWeb-consolidado"></canvas></div></div><div class="card"><div class="kpi-label" style="font-weight:600">Distribución de Redes</div><div class="chartbox"><canvas id="chartDonut-consolidado"></canvas></div></div>`;

    const allTopPosts = [];
    const socialNetworks = ['linkedin', 'instagram', 'tiktok', 'youtube', 'x', 'threads', 'spotify'];
    socialNetworks.forEach(net => {
        if (DATA.social_bench[net] && DATA.social_bench[net].top_posts) {
            allTopPosts.push(...DATA.social_bench[net].top_posts.map(p => ({...p, network: net })));
        }
    });
    allTopPosts.sort((a, b) => (b.reach || b.views) - (a.reach || a.views));

    const top10Consolidated = allTopPosts.slice(0, 10);
    $('#top-content-card-consolidado').innerHTML = `<h3 class="kpi-label" style="font-weight:600; font-size: 18px;">Top 10 Contenido Consolidado</h3>${renderTopContentTable(top10Consolidated)}`;

    let topByNetworkHTML = '<div class="top-by-network-grid">';
    socialNetworks.forEach(net => {
        const netName = net === 'x' ? 'X' : net.charAt(0).toUpperCase() + net.slice(1);
        const top5ForNet = allTopPosts.filter(p => p.network === net).slice(0, 5);
        if (top5ForNet.length > 0) {
            topByNetworkHTML += `<div><h4 class="network-top-title">${ICONS[net]} ${netName}</h4>${renderTopContentTable(top5ForNet, net)}</div>`;
        }
    });
    topByNetworkHTML += '</div>';
    $('#top-by-network-card').innerHTML = `<h3 class="kpi-label" style="font-weight:600; font-size: 18px;">Rendimiento Destacado por Canal (Top 5)</h3>${topByNetworkHTML}`;

    const webA = slice(DATA.timeseries.web, W.A.start, W.A.end);
    const labels = webA.map(d => { const parts = d.date.split('-'); return `${parts[2]}/${parts[1]}`; });
    const datasets = [{ label: `Sesiones (${W.A.label})`, data: webA.map(d => d.sessions), borderColor: chartColors.A.blue, backgroundColor: chartColors.A.blue, tension: 0.3 }];
    if (isCompareMode) {
        const webB = slice(DATA.timeseries.web, W.B.start, W.B.end);
        datasets.push({ label: `Sesiones (${W.B.label})`, data: webB.map(d => d.sessions), borderColor: chartColors.B.blue, backgroundColor: chartColors.B.blue, tension: 0.3 });
    }
    charts.push(new Chart($('#chartWeb-consolidado').getContext('2d'), { type: 'line', data: { labels, datasets }, options: { responsive: true, maintainAspectRatio: false } }));

    const donutCtx = $('#chartDonut-consolidado');
    if (donutCtx) {
        if (!isCompareMode) {
            charts.push(new Chart(donutCtx.getContext('2d'), { type: 'doughnut', data: { labels: Object.keys(DATA.mix.social_distribution), datasets: [{ data: Object.values(DATA.mix.social_distribution), backgroundColor: Object.values(chartColors.A) }] }, options: { responsive: true, maintainAspectRatio: false } }));
        } else {
            donutCtx.parentElement.innerHTML = `<div class="kpi-label" style="font-weight:600">Distribución de Redes</div><div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--muted); text-align:center; padding: 16px;"><p>Gráfico no disponible en modo de comparación.</p></div>`;
        }
    }
}

function renderWebsite(W) {
    const isCompareMode = quickSelect.value === 'compare';
    const view = $('#view-website');
    const webA = slice(DATA.timeseries.web, W.A.start, W.A.end),
        webB = slice(DATA.timeseries.web, W.B.start, W.B.end);
    const ctrCard = `<div class="kpi-label">CTR Orgánico</div><div class="kpi-value-simple">${DATA.kpis.gsc_ctr}%</div>`;
    const timeCard = `<div class="kpi-label">Tiempo Medio</div><div class="kpi-value-simple">${DATA.kpis.avg_time_on_page}</div>`;
    view.innerHTML = `<div class="kpis-5-cols">
        <div class="card">${renderKPI('Usuarios Únicos', sum(webA, 'users'), sum(webB, 'users'))}</div>
        <div class="card">${renderKPI('Sesiones', sum(webA, 'sessions'), sum(webB, 'sessions'))}</div>
        <div class="card">${renderKPI('Pageviews', sum(webA, 'pageviews'), sum(webB, 'pageviews'))}</div>
        <div class="card">${ctrCard}</div>
        <div class="card">${timeCard}</div>
    </div>
    <div class="charts two-cols">
        <div class="card"><div class="kpi-label" style="font-weight:600">Crecimiento de Audiencia</div><div class="chartbox"><canvas id="chart-website-visitors"></canvas></div></div>
        <div class="card"><div class="kpi-label" style="font-weight:600">Canales</div><div class="chartbox"><canvas id="chart-website-sources"></canvas></div></div>
    </div>
    <div class="card" id="top-pages-card"></div>`;

    $('#top-pages-card').innerHTML = renderTopPagesTable(DATA.website_bench.top_pages);

    const labels = webA.map(d => { const parts = d.date.split('-'); return `${parts[2]}/${parts[1]}`; });
    const datasetsVisitors = [{ label: `Visitantes (${W.A.label})`, data: webA.map(d => d.users), borderColor: chartColors.A.green, tension: 0.4, fill: false }];
    if (isCompareMode) {
        datasetsVisitors.push({ label: `Visitantes (${W.B.label})`, data: webB.map(d => d.users), borderColor: chartColors.B.green, tension: 0.4, fill: false });
    }
    charts.push(new Chart($('#chart-website-visitors').getContext('2d'), { type: 'line', data: { labels, datasets: datasetsVisitors }, options: { responsive: true, maintainAspectRatio: false } }));

    const sourcesDonut = $('#chart-website-sources');
    if (sourcesDonut) {
        if (!isCompareMode) {
            const sourcesData = DATA.mix.traffic_sources;
            charts.push(new Chart(sourcesDonut.getContext('2d'), { type: 'doughnut', data: { labels: Object.keys(sourcesData), datasets: [{ data: Object.values(sourcesData), backgroundColor: Object.values(chartColors.A) }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%' } }));
        } else {
            sourcesDonut.parentElement.innerHTML = `<div class="kpi-label" style="font-weight:600">Canales</div><div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--muted); text-align:center; padding: 16px;"><p>Gráfico no disponible en modo de comparación.</p></div>`;
        }
    }
}

const socialConfig = {
    instagram: {
        kpis: [{ label: 'Alcance', key: 'reach' }, { label: 'Impresiones', key: 'impressions' }, { label: 'Interacciones', key: 'interactions' }, { label: 'Seguidores Ganados', key: 'followers_gained' }],
        charts: [
            { type: 'line', title: 'Alcance e Impresiones', datasets: [{ label: 'Alcance', key: 'reach', color: chartColors.A.purple }, { label: 'Impresiones', key: 'impressions', color: chartColors.A.pink }] },
            { type: 'bar', title: 'Interacción y Crecimiento', datasets: [{ label: 'Interacciones', key: 'interactions', color: chartColors.A.sky, order: 2 }, { label: 'Nuevos Seguidores', key: 'followers_gained', color: chartColors.A.teal, type: 'line', order: 1 }] }
        ]
    },
    youtube: {
        kpis: [{ label: 'Visualizaciones', key: 'views' }, { label: 'Tiempo de Visualización (hrs)', key: 'watch_time_hours' }, { label: 'Suscriptores Ganados', key: 'subscribers_gained' }],
        charts: [{ type: 'line', title: 'Rendimiento del Canal', datasets: [{ label: 'Visualizaciones', key: 'views', color: chartColors.A.red, yAxisID: 'y' }, { label: 'Tiempo de Visualización (hrs)', key: 'watch_time_hours', color: chartColors.A.blue, yAxisID: 'y1' }], options: { scales: { y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Visualizaciones' } }, y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Horas' } } } } }]
    },
    tiktok: {
        kpis: [{ label: 'Visualizaciones', key: 'views' }, { label: 'Me Gusta', key: 'likes' }, { label: 'Nuevos Seguidores', key: 'followers_gained' }],
        charts: [{ type: 'line', title: 'Rendimiento General', datasets: [{ label: 'Visualizaciones', key: 'views', color: chartColors.A.pink }] }]
    },
    x: {
        kpis: [{ label: 'Impresiones', key: 'impressions' }, { label: 'Interacciones', key: 'engagements' }, { label: 'Nuevos Seguidores', key: 'followers_gained' }],
        charts: [{ type: 'line', title: 'Rendimiento General', datasets: [{ label: 'Impresiones', key: 'impressions', color: chartColors.A.sky }] }]
    },
    linkedin: {
        kpis: [{ label: 'Impresiones', key: 'impressions' }, { label: 'Clics', key: 'clicks' }, { label: 'Nuevos Seguidores', key: 'followers_gained' }],
        charts: [{ type: 'line', title: 'Rendimiento General', datasets: [{ label: 'Impresiones', key: 'impressions', color: chartColors.A.blue }] }]
    },
    threads: {
        kpis: [{ label: 'Impresiones', key: 'impressions' }, { label: 'Interacciones', key: 'engagements' }, { label: 'Nuevos Seguidores', key: 'followers_gained' }],
        charts: [{ type: 'line', title: 'Rendimiento General', datasets: [{ label: 'Impresiones', key: 'impressions', color: chartColors.A.teal }] }]
    },
    spotify: {
        kpis: [{ label: 'Reproducciones', key: 'streams' }, { label: 'Oyentes', key: 'listeners' }, { label: 'Nuevos Seguidores', key: 'followers_gained' }],
        charts: [{ type: 'bar', title: 'Audiencia del Podcast', datasets: [{ label: 'Reproducciones', key: 'streams', color: chartColors.A.green }, { label: 'Oyentes', key: 'listeners', color: chartColors.A.teal }] }]
    }
};

function renderSocial(id, W) {
    const isCompareMode = quickSelect.value === 'compare';
    const view = $(`#view-${id}`);
    const config = socialConfig[id];
    if (!config) { view.innerHTML = `<div class="card">Vista para "${id}" en construcción.</div>`; return; }

    const bench = DATA.social_bench[id];
    const dataA = slice(DATA.timeseries[id], W.A.start, W.A.end);
    const networkName = id.charAt(0).toUpperCase() + id.slice(1);

    const kpisHTML = config.kpis.map(kpi => {
        const dataB = slice(DATA.timeseries[id], W.B.start, W.B.end);
        return `<div class="card">${renderKPI(kpi.label, sum(dataA, kpi.key), sum(dataB, kpi.key))}</div>`
    }).join('');
    const totalFollowersCard = `<div class="card"><div class="kpi-label">Seguidores Totales</div><div class="kpi-value-simple">${fmt(bench.followers)}</div></div>`;
    const insightsCard = `<div class="card card-dark"><div class="card-dark-header"><strong>Insights Rápidos</strong><span class="badge">Específicos de ${networkName}</span></div><ul><li>Insights clave sobre el rendimiento de ${networkName} en este periodo.</li></ul></div>`;
    const chartsHTML = config.charts.map((chart, i) => `<div class="card"><div class="kpi-label" style="font-weight:600">${chart.title}</div><div class="chartbox"><canvas id="chart-${id}-${i}"></canvas></div></div>`).join('');

    view.innerHTML = `<div class="kpis">${kpisHTML}${config.kpis.length < 4 ? totalFollowersCard : ''}</div>${insightsCard}<div class="charts ${config.charts.length > 1 ? 'two-cols' : ''}">${chartsHTML}</div><div class="card" id="top-content-card-${id}"></div>`;

    $(`#top-content-card-${id}`).innerHTML = renderTopContentTable(bench.top_posts || [], id);

    const labels = dataA.map(d => { const parts = d.date.split('-'); return `${parts[2]}/${parts[1]}`; });
    config.charts.forEach((chart, i) => {
        let finalDatasets = [];
        chart.datasets.forEach(ds => {
            finalDatasets.push({
                label: `${ds.label} (${W.A.label})`,
                data: dataA.map(d => d[ds.key]),
                borderColor: ds.color,
                backgroundColor: ds.color,
                tension: 0.4,
                fill: false,
                type: ds.type || chart.type,
                order: ds.order,
                yAxisID: ds.yAxisID
            });
            if (isCompareMode) {
                const dataB = slice(DATA.timeseries[id], W.B.start, W.B.end);
                const colorKey = Object.keys(chartColors.A).find(key => chartColors.A[key] === ds.color) || 'blue';
                finalDatasets.push({
                    label: `${ds.label} (${W.B.label})`,
                    data: dataB.map(d => d[ds.key]),
                    borderColor: chartColors.B[colorKey],
                    backgroundColor: chartColors.B[colorKey],
                    tension: 0.4,
                    fill: false,
                    type: ds.type || chart.type,
                    order: ds.order,
                    yAxisID: ds.yAxisID
                });
            }
        });

        const chartOptions = { responsive: true, maintainAspectRatio: false, ...chart.options };
        charts.push(new Chart($(`#chart-${id}-${i}`).getContext('2d'), { type: chart.type, data: { labels, datasets: finalDatasets }, options: chartOptions }));
    });
}
const renderKPI = (label, valueA, valueB) => {
    const isCompareMode = quickSelect.value === 'compare';
    const deltaVal = delta(valueA, valueB);
    if (isCompareMode) {
        return `<div class="kpi-label">${label}</div><div class="kpi-compare-layout"><div class="kpi-compare-values"><div class="kpi-period-row"><span class="period-label">${getWindows().A.label}</span><span class="value">${fmt(valueA)}</span></div><div class="kpi-period-row"><span class="period-label">${getWindows().B.label}</span><span class="value">${fmt(valueB)}</span></div></div><div class="kpi-compare-delta" style="color:${cls(deltaVal)}">${arrow(deltaVal)} ${deltaVal !== null ? Math.abs(deltaVal).toFixed(0)+'%' : '-'}</div></div>`;
    } else {
        const deltaHTML = (deltaVal !== null) ? `<div class="kpi-delta-simple" style="color:${cls(deltaVal)}">${arrow(deltaVal)} ${Math.abs(deltaVal).toFixed(1)}%</div>` : `<div class="kpi-delta-simple">-</div>`;
        return `<div class="kpi-label">${label}</div><div class="kpi-value-simple">${fmt(valueA)}</div>${deltaHTML}`;
    }
};

function renderTopPagesTable(pages) {
    const headers = ['Título', 'Páginas vistas', 'Duración de la sesión'];
    let bodyHTML = pages.map(p => `<tr><td><div>${p.title}</div><small style="color:var(--muted);">${p.url}</small></td><td>${fmt(p.pageviews)}</td><td>${p.avg_duration}</td></tr>`).join('');
    return `<div class="table-scroll-wrapper"><h3 class="kpi-label" style="font-weight:600; font-size:18px;">Contenido Principal del Sitio Web</h3><table class="top-content-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${bodyHTML}</tbody></table></div>`;
}

function renderTopContentTable(posts, network = 'social') {
    const headers = ['Publicación', 'Tipo', network === 'youtube' || network === 'tiktok' || network === 'spotify' ? 'Vistas/Rep.' : 'Alcance', 'Reacciones', 'Compartido', 'Creado en'];
    let bodyHTML = (posts && posts.length > 0) ? posts.map(p => {
        const postText = p.text || 'Video sin descripción';
        return `<tr><td><div class="post-cell"><img src="${p.thumb}" alt="thumbnail" onerror="this.style.display='none'"/><div><div class="post-text">${postText.substring(0, 80)}${postText.length > 80 ? '...' : ''}</div><div class="post-reactions"><span class="reaction-item">${ICONS.reactions.like} ${fmt(p.likes)}</span><span class="reaction-item">${ICONS.reactions.love} ${fmt(p.love)}</span><span class="reaction-item">${ICONS.reactions.comment} ${fmt(p.comments)}</span></div></div></div></td><td>${p.type || p.network}</td><td>${fmt(p.reach || p.views)}</td><td>${fmt(p.total_reactions)}</td><td>${fmt(p.shares)}</td><td>${new Date(p.created_at + 'T00:00:00').toLocaleString('es-ES', {day:'2-digit', month:'2-digit', year:'numeric'})}</td></tr>`
    }).join('') : `<tr><td colspan="${headers.length}" style="text-align:center; color: var(--muted); padding: 24px;">No hay datos de publicaciones para este periodo.</td></tr>`;
    return `<div class="table-scroll-wrapper"><table class="top-content-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${bodyHTML}</tbody></table></div>`;
}

load();
