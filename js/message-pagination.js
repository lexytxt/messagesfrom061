(function () {
  const messages = [
    "eyes-wide-shut.md",
    "i-want-to-be-somebody-to-you.md",
    "not-guilty.md",
    "russian-roulette.md",
    "she-cant-run.md",
    "the-last-bite.md"
  ];
  const params = new URLSearchParams(window.location.search);
  const currentFile = params.get("file");
  const index = messages.indexOf(currentFile);
  const container = document.getElementById("message-pagination");
  if (container) {
    container.innerHTML =
      (index > 0
        ? `<a href="message.html?file=${messages[index - 1]}">← Previous</a>`
        : `<span style="opacity:0.5;">← Previous</span>`)
      + `<span style="margin:0 12px;">|</span>` +
      (index < messages.length - 1
        ? `<a href="message.html?file=${messages[index + 1]}">Next →</a>`
        : `<span style="opacity:0.5;">Next →</span>`);
  }
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.getElementById("message-title")?.textContent || "Message",
            text: "Check out this message from Messages from 061.",
            url: window.location.href
          });
        } catch {}
      } else {
        alert("Copy this URL:\n" + window.location.href);
      }
    });
  }
  document.addEventListener("keydown", e => {
    if (index < 0) return;
    if (e.key === "ArrowLeft" && index > 0) {
      window.location.href = `message.html?file=${messages[index - 1]}`;
    }
    if (e.key === "ArrowRight" && index < messages.length - 1) {
      window.location.href = `message.html?file=${messages[index + 1]}`;
    }
  });
})();
