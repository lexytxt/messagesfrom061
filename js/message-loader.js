(function() {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
    if (!file) return;
    const contentContainer = document.getElementById('message-content');
    const markdownPath = 'messages/' + file;
    fetch(markdownPath)
        .then(res => res.text())
        .then(md => {
            const lines = md.split('\n');
            let titleLineIndex = lines.findIndex(l => l.trim().startsWith('# '));
            let titleText = '';

            if (titleLineIndex >= 0) {
                titleText = lines[titleLineIndex].replace(/^#\s*/, '');
                lines.splice(titleLineIndex, 1);
            } else {
                titleText = file.replace('.md', '');
            }
            contentContainer.innerHTML =
                `<h1>${titleText}</h1>` + marked.parse(lines.join('\n'));
        })
        .catch(err => {
            contentContainer.innerHTML = '<p>Could not load message.</p>';
            console.error(err);
        });
})();
