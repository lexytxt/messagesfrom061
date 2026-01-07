(function(){
    const contentContainer = document.getElementById('message-content');
    if(!contentContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');
    if(!file) {
        contentContainer.innerHTML = '<p>No message specified.</p>';
        return;
    }

    const markdownPath = '../messages/' + file;

    fetch(markdownPath)
        .then(response => response.text())
        .then(md => {
            // wrap in markdown-body for styling
            contentContainer.innerHTML = `<div class="markdown-body">${marked.parse(md)}</div>`;
        })
        .catch(err => {
            contentContainer.innerHTML = '<p>Could not load message.</p>';
            console.error(err);
        });
})();
