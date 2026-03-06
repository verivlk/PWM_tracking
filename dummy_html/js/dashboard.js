fetch('../data.json')
    .then(res => res.json())
    .then(data => {

        const list = document.getElementById('worker-list');

        data.workers.forEach(worker => {
            list.innerHTML += workerRow(worker);
        });

    });