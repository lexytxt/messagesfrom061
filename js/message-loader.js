(function () {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');

    const content = document.getElementById('message-content');
    const pagination = document.getElementById('message-pagination');

    if (!content || !file) {
        if (content) content.textContent = 'No message specified.';
        if (pagination) pagination.innerHTML = '';
        return;
    }

    content.textContent = 'Loading message…';

    const cache = new Map();

    fetch('./js/messages.json')
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(messages => {
            const categories = {};

            messages.forEach(m => {
                if (!categories[m.category]) {
                    categories[m.category] = [];
                }
                categories[m.category].push(m.file);
            });

            Object.values(categories).forEach(list => {
                list.sort((a, b) => a.localeCompare(b));
            });

            let currentCategory = null;

            for (const key in categories) {
                if (categories[key].includes(file)) {
                    currentCategory = key;
                    break;
                }
            }

            if (!currentCategory) throw new Error();

            const list = categories[currentCategory];
            const index = list.indexOf(file);

            return loadMarkdown(file).then(md => {
                content.innerHTML = marked.parse(md, { breaks: true });

                const prev =
                    index > 0
                        ? `<a href="message.html?file=${list[index - 1]}">← Back</a>`
                        : `<span>← Back</span>`;

                const next =
                    index < list.length - 1
                        ? `<a href="message.html?file=${list[index + 1]}">Next →</a>`
                        : `<span>Next →</span>`;

                pagination.innerHTML = `
                    <div style="display:flex; justify-content:space-between; gap:40px;">
                        ${prev}
                        ${next}
                    </div>
                `;

                document.addEventListener('keydown', e => {
                    if (document.activeElement !== document.body) return;

                    if (e.key === 'ArrowLeft' && index > 0) {
                        window.location.href = `message.html?file=${list[index - 1]}`;
                    }

                    if (e.key === 'ArrowRight' && index < list.length - 1) {
                        window.location.href = `message.html?file=${list[index + 1]}`;
                    }
                });
            });
        })
        .catch(() => {
            content.textContent = 'Could not load message.';
            pagination.innerHTML = '';
        });

    function loadMarkdown(name) {
        if (cache.has(name)) return Promise.resolve(cache.get(name));

        return fetch(`./messages/${name}`)
            .then(r => {
                if (!r.ok) throw new Error();
                return r.text();
            })
            .then(t => {
                cache.set(name, t);
                return t;
            });
    }
})();
