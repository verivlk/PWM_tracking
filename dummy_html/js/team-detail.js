document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderTeamDetail(data);
});

async function renderTeamDetail(data) {
    await renderTemplate('#workers-panel search', '/templates/lists/input-space.html');
    await renderTemplate('#workers-panel search', '/templates/search.html');

    await renderList(
        '#worker-list', 
        '/templates/lists/worker-row.html', 
        data.workers, 
        fillWorkerRow, 
        enableSmartView 
    );
}

function enableSmartView(container) {
    const wrappers = container.querySelectorAll('.worker-wrapper');
    
    wrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const isMobile = window.innerWidth < 900;
            
            if (isMobile) {
                wrapper.classList.toggle('open');
            } else {
                wrappers.forEach(w => w.classList.remove('open'));
                wrapper.classList.add('open');
                updateBigDisplay(wrapper);
            }
        });
    });
}

function updateBigDisplay(wrapper) {
    const display = document.getElementById('details-view');
    if (!display) return;
    const worker = JSON.parse(wrapper.dataset.info);

    display.innerHTML = `
        <div class="big-card">
            <div class="big-avatar">
                ${worker.photo ? `<img src="${worker.photo}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : ''}
            </div>
            <h1>${worker.name}</h1>
            <p>Status: ${worker.status === 'active' ? 'Active' : 'Not active'}</p>
            
            <div class="info-grid">
                <div><strong>Rola:</strong><br>${worker.role || 'Pracownik'}</div>
                <div><strong>Email:</strong><br>${worker.email || 'brak@maila.pl'}</div>
                <div><strong>Telefon:</strong><br>${worker.phone || 'Nie podano'}</div>
                <div><strong>Lokalizacja:</strong><br>${worker.location || 'Biuro Główne'}</div>
            </div>
        </div>
    `;
}

function fillWorkerRow(clone, worker) {
    const wrapper = clone.querySelector('.worker-wrapper');
    wrapper.dataset.info = JSON.stringify(worker);

    const details = clone.querySelector('.details-content');
    if (details) {
        details.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: center;">
                <img src="${worker.photo}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
                <div>
                    <p><strong>Email:</strong> ${worker.email}</p>
                    <p><strong>Rola:</strong> ${worker.role}</p>
                </div>
            </div>
        `;
    }
}
