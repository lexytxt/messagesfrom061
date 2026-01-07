(function() {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
    if (!file) return;
    const contentContainer = document.getElementById('message-content');
    const paginationContainer = document.getElementById('message-pagination');
    const shareBtn = document.getElementById('share-btn');
    const markdownPath = './messages/' + file;
    fetch(markdownPath)
        .then(res => {
            if (!res.ok) throw new Error('File not found');
            return res.text();
        })
        .then(md => {
            const lines = md.split('\n');
            let titleIndex = lines.findIndex(l => l.trim().startsWith('# '));
            let title = '';
            if (titleIndex >= 0) {
                title = lines[titleIndex].replace(/^#\s*/, '');
                lines.splice(titleIndex, 1);
            } else {
                title = file.replace('.md', '');
            }
            contentContainer.innerHTML = `<h1>${title}</h1>` + marked.parse(lines.join('\n'));
            const messages = [
                "eyes-wide-shut.md",
                "i-want-to-be-somebody-to-you.md",
                "not-guilty.md",
                "russian-roulette.md",
                "she-cant-run.md",
                "the-last-bite.md"
            ];
            const index = messages.indexOf(file);
            if (paginationContainer && index >= 0) {
                paginationContainer.innerHTML =
                    (index > 0 ? `<a href="message.html?file=${messages[index-1]}">← Previous</a>` : `<span style="opacity:0.5;">← Previous</span>`) +
                    `<span style="margin:0 12px;">|</span>` +
                    (index < messages.length-1 ? `<a href="message.html?file=${messages[index+1]}">Next →</a>` : `<span style="opacity:0.5;">Next →</span>`);
            }
            if (shareBtn) {
                shareBtn.addEventListener('click', async () => {
                    if (navigator.share) {
                        try {
                            await navigator.share({
                                title: title,
                                text: "Check out this message from Messages from 061.",
                                url: window.location.href
                            });
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
            contentContainer.innerHTML = '<p>Could not load message.</p>';
            if (paginationContainer) paginationContainer.innerHTML = '';
            console.error(err);
        });
})();
