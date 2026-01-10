(function() {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
    const contentContainer = document.getElementById('message-content');
    const paginationContainer = document.getElementById('message-pagination');
    const shareBtn = document.getElementById('share-btn');
    if (!file) {
        if (contentContainer) contentContainer.innerHTML = '<p>No message specified.</p>';
        return;
    }
    const messages = [
        "drunk-dial.md",
        "eyes-wide-shut.md",
        "not-guilty.md",
        "russian-roulette.md",
        "the-last-bite.md"
    ];
    const markdownPath = './messages/' + file;
    fetch(markdownPath)
        .then(res => {
            if (!res.ok) throw new Error('File not found');
            return res.text();
        })
        .then(md => {
            const lines = md.split('\n');
            let titleIndex = lines.findIndex(l => l.trim().startsWith('# '));
            let title = titleIndex >= 0 ? lines[titleIndex].replace(/^#\s*/, '') : file.replace('.md', '');
            if (titleIndex >= 0) lines.splice(titleIndex, 1);
            if (contentContainer) contentContainer.innerHTML = `<h1>${title}</h1>` + marked.parse(lines.join('\n'));
            const index = messages.indexOf(file);
            if (paginationContainer && index >= 0) {
                const prevLink = index > 0 ? `<a href="message.html?file=${messages[index-1]}">← Back</a>` : `<span style="opacity:0.5;">← Back</span>`;
                const nextLink = index < messages.length-1 ? `<a href="message.html?file=${messages[index+1]}">Next →</a>` : `<span style="opacity:0.5;">Next →</span>`;
                paginationContainer.innerHTML = `${prevLink}${nextLink}`;
            }
            if (shareBtn) {
                shareBtn.addEventListener('click', async () => {
                    if (navigator.share) {
                        try {
                            await navigator.share({ title, text: "Check out this message from Messages from 061.", url: window.location.href });
                        } catch {}
                    } else {
                        alert("Copy this URL:\n" + window.location.href);
                    }
                });
            }
            document.addEventListener('keydown', e => {
                if (index < 0) return;
                if (e.key === 'ArrowLeft' && index > 0) window.location.href = `message.html?file=${messages[index-1]}`;
                if (e.key === 'ArrowRight' && index < messages.length-1) window.location.href = `message.html?file=${messages[index+1]}`;
            });
        })
        .catch(err => {
            console.error(err);
            if (contentContainer) contentContainer.innerHTML = '<p>Could not load message.</p>';
            if (paginationContainer) paginationContainer.innerHTML = '';
        });
})();
