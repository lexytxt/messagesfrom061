(function(){
    const contentContainer = document.getElementById('message-content');
    const titleContainer = document.getElementById('message-title');
    if(!contentContainer || !titleContainer) return;

    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
    if(!file){
        contentContainer.innerHTML = '<p>No message selected.</p>';
        return;
    }

    const markdownPath = '../messages/' + file;

    fetch(markdownPath)
        .then(response => response.text())
        .then(md => {
            const lines = md.split('\n');
            if(lines[0].startsWith('# ')){
                titleContainer.textContent = lines[0].replace('# ','').trim();
                md = lines.slice(1).join('\n');
            } else {
                titleContainer.textContent = 'Message';
            }
            contentContainer.innerHTML = marked.parse(md);
        })
        .catch(err => {
            contentContainer.innerHTML = '<p>Could not load message.</p>';
            console.error(err);
        });
})();
