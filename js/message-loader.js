(async function() {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
    const contentContainer = document.getElementById('message-content');
    const paginationContainer = document.getElementById('message-pagination');
    const shareBtn = document.getElementById('share-btn');

    if (!contentContainer) return;

    contentContainer.innerHTML = '<p>Loading message...</p>';

    if (!file) {
        contentContainer.innerHTML = '<p>No message specified.</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    try {
        const res = await fetch('./js/messages.json');
        if (!res.ok) throw new Error('Could not load messages list');
        const messagesData = await res.json();

        const categories = {};
        messagesData.forEach(m => {
            if (!categories[m.category]) categories[m.category] = [];
            categories[m.category].push(m.file);
        });

        for (const key in categories) {
            categories[key].sort((a, b) => a.localeCompare(b));
        }

        const allMessages = Object.values(categories).flat();
        const index = allMessages.indexOf(file);

        if (index < 0) throw new Error('Message not found');

        if (!window._messageCache) window._messageCache = {};
        let md;
        if (window._messageCache[file]) {
            md = window._messageCache[file];
        } else {
            const markdownRes = await fetch(`./messages/${file}`);
            if (!markdownRes.ok) throw new Error('File not found');
            md = await markdownRes.text();
            window._messageCache[file] = md;
        }

        contentContainer.innerHTML = marked.parse(md, { breaks: true });

        if (paginationContainer) {
            const prevLink = index > 0
                ? `<a href="message.html?file=${allMessages[index-1]}">← Back</a>`
                : `<span style="opacity:0.5;">← Back</span>`;
            const nextLink = index < allMessages.length - 1
                ? `<a href="message.html?file=${allMessages[index+1]}">Next →</a>`
                : `<span style="opacity:0.5;">Next →</span>`;
            paginationContainer.innerHTML = `<div style="display:flex; justify-content: space-between; gap: 40px;">${prevLink}${nextLink}</div>`;
        }

        if (shareBtn) {
            shareBtn.onclick = async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: file.replace('.md', ''),
                            text: "Check out this message from Messages from 061.",
                            url: window.location.href
                        });
                    } catch {}
                } else {
                    alert("Copy this URL:\n" + window.location.href);
                }
            };
        }

        document.addEventListener('keydown', e => {
            if (index < 0) return;
            if (e.key === 'ArrowLeft' && index > 0) window.location.href = `message.html?file=${allMessages[index-1]}`;
            if (e.key === 'ArrowRight' && index < allMessages.length - 1) window.location.href = `message.html?file=${allMessages[index+1]}`;
        });

    } catch (err) {
        contentContainer.innerHTML = '<p>Could not load message.</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        console.error(err);
    }
})();
