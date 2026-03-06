function workerRow(worker) {
    const isActive = worker.status === "active";
    const statusSymbol = isActive ? "&#10003;" : "&#10007;";

    return `
        <div class="worker-wrapper" tabindex="0">
            <article class="worker-row">
                <h3>${worker.name}</h3>
                <mark class="status ${worker.status}" aria-label="${worker.status}">
                    ${statusSymbol}
                </mark>
                <button class="expand" aria-label="Expand">&#9660;</button>
            </article>

            <div class="worker-details">
                <div class="details-content">
                    <p><strong>${worker.name}</strong></p>
                </div>
            </div>
        </div>
    `;
}