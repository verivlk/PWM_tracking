// js/dashboard.js

document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderDashboard(data);
});

async function renderDashboard(data) {
    await renderTemplate('#workers-panel search', '/templates/lists/input-space.html');
    await renderTemplate('#workers-panel search', '/templates/search.html');

    const searchInput = document.querySelector('#workers-panel search input');

    const refreshList = (filteredTeams) => {
        renderList(
            '#worker-list', 
            '/templates/lists/worker-row.html', 
            filteredTeams, 
            fillTeamRow, 
            enableSmartView
        );
    };

    refreshList(data.teams);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            const filtered = data.teams.filter(team => {
                
                const matchName = team.name.toLowerCase().includes(term);
                
                const matchProject = team.project?.toLowerCase().includes(term);
                
                const matchMember = team.members?.some(m => m.name.toLowerCase().includes(term));
                
                return matchName || matchProject || matchMember;
            });

            refreshList(filtered);
        });
    }
}

function enableSmartView(container) {
    const wrappers = container.querySelectorAll('.worker-wrapper');
    const detailsView = document.getElementById('details-view');
    if (detailsView && window.innerWidth >= 900) {
        const first = wrappers[0];
        if (first) {
            first.classList.add('open');
            updateBigDisplay(first);
        }
    }

    wrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const isMobile = window.innerWidth < 900;
            
            if (isMobile || !detailsView) {
                wrapper.classList.toggle('open');
            } else {
                wrappers.forEach(w => w.classList.remove('open'));
                wrapper.classList.add('open');
                updateBigDisplay(wrapper);
            }
        });
    });
}

function fillTeamRow(clone, team) {
    const details = clone.querySelector('.details-content');
    if (details && team.members) {
        details.innerHTML = `
            <strong>Project:</strong> ${team.project || 'Brak'}<br>
            <div class="sub-list">
                <strong>Members:</strong>
                ${team.members.map(m => `<div>• ${m.name}</div>`).join('')}
            </div>
        `;
    }
}