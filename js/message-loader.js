(function(){
    const contentContainer = document.getElementById('message-content');
    const titleElement = document.getElementById('message-title');
    if(!contentContainer || !titleElement) return;

    const currentHtml = window.location.pathname.split('/').pop();
    const markdownPath = currentHtml.replace('.html','.md');

    fetch(markdownPath)
        .then(response => response.text())
        .then(md => {
            contentContainer.innerHTML = marked.parse(md);
            const firstLine = md.split('\n').find(line => line.trim() !== '');
            if(firstLine && firstLine.startsWith('# ')){
                titleElement.textContent = firstLine.replace('# ','');
            } else {
                titleElement.textContent = currentHtml.replace('.html','').replace(/-/g,' ');
            }
        })
        .catch(err => {
            contentContainer.innerHTML = '<p>Could not load message.</p>';
            titleElement.textContent = 'Error';
            console.error(err);
        });
})();
