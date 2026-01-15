(async function () {
    const searchBar = document.getElementById('search-bar');

    try {
        const res = await fetch('./js/messages.json');
        if (!res.ok) throw new Error();
        const messages = await res.json();

        const containers = {
            Confessional: document.getElementById('confessional-messages'),
            Postmodern: document.getElementById('postmodern-messages'),
            Symbolist: document.getElementById('symbolist-messages')
        };

        Object.values(containers).forEach(c => c.innerHTML = '');

        const grouped = {};

        messages.forEach(m => {
            if (!grouped[m.category]) grouped[m.category] = [];
            grouped[m.category].push(m);
        });

        Object.keys(grouped).forEach(category => {
            grouped[category].sort((a, b) => a.title.localeCompare(b.title));
            grouped[category].forEach(m => {
                const a = document.createElement('a');
                a.href = `message.html?file=${m.file}`;
                a.textContent = m.title;
                containers[m.category]?.appendChild(a);
            });
        });

        searchBar.addEventListener('input', () => {
            const q = searchBar.value.toLowerCase();
            document.querySelectorAll('.category-list a').forEach(a => {
                a.style.display = a.textContent.toLowerCase().includes(q) ? 'block' : 'none';
            });
        });

    } catch {
        document.querySelectorAll('.category-list').forEach(c => {
            c.innerHTML = '<p>Could not load messages.</p>';
        });
    }
})();
