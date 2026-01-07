(function () {
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file");
  if (!file) return;
  const content = document.getElementById("message-content");
  const title = document.getElementById("message-title");
  if (!content || !title) return;
  fetch("messages/" + file)
    .then(res => {
      if (!res.ok) throw new Error("Not found");
      return res.text();
    })
    .then(md => {
      content.innerHTML = marked.parse(md);
      const firstLine = md.split("\n").find(l => l.trim().startsWith("#"));
      title.textContent = firstLine
        ? firstLine.replace(/^#+\s*/, "")
        : file.replace(".md", "").replace(/-/g, " ");
    })
    .catch(() => {
      content.innerHTML = "<p>Could not load message.</p>";
    });
})();
