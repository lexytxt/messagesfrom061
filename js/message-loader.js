(async function () {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');

    const contentContainer = document.getElementById('message-content');
    const paginationContainer = document.getElementById('message-pagination');

    if (!contentContainer) return;

    contentContainer.innerHTML = '<p>Loading message...</p>';

    if (!file) {
        contentContainer.innerHTML = '<p>No message specified.</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    try {
        const res = await fetch('./js/messages.json');
        if (!res.ok) throw new Error();
        const messagesData = await res.json();

        const categories = {
            Confessional: [],
            Symbolist: []
        };

        let currentCategory = null;

        messagesData.forEach(m => {
            if (categories[m.category]) {
                categories[m.category].push(m.file);
                if (m.file === file) currentCategory = m.category;
            }
        });

        if (!currentCategory) throw new Error();

        Object.keys(categories).forEach(cat => {
            categories[cat].sort((a, b) => a.localeCompare(b));
        });

        const categoryMessages = categories[currentCategory];
        const index = categoryMessages.indexOf(file);

        if (index < 0) throw new Error();

        if (!window._messageCache) window._messageCache = {};

        let md;
        if (window._messageCache[file]) {
            md = window._messageCache[file];
        } else {
            const markdownRes = await fetch(`./messages/${file}`);
            if (!markdownRes.ok) throw new Error();
            md = await markdownRes.text();
            window._messageCache[file] = md;
        }

        contentContainer.innerHTML = marked.parse(md, { breaks: true });

        if (paginationContainer) {
            const prevLink = index > 0
                ? `<a href="message.html?file=${categoryMessages[index - 1]}">← Back</a>`
                : `<span style="opacity:0.4;">← Back</span>`;

            const nextLink = index < categoryMessages.length - 1
                ? `<a href="message.html?file=${categoryMessages[index + 1]}">Next →</a>`
                : `<span style="opacity:0.4;">Next →</span>`;

            paginationContainer.innerHTML = `
                <div style="display:flex; justify-content: space-between; gap:40px;">
                    ${prevLink}
                    ${nextLink}
                </div>
            `;
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft' && index > 0) {
                window.location.href = `message.html?file=${categoryMessages[index - 1]}`;
            }
            if (e.key === 'ArrowRight' && index < categoryMessages.length - 1) {
                window.location.href = `message.html?file=${categoryMessages[index + 1]}`;
            }
        });

    } catch {
        contentContainer.innerHTML = '<p>Could not load message.</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
    }
})();
