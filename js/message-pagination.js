(function(){
    const messages=[
        "message.html?file=eyes-wide-shut.md",
        "message.html?file=i-want-to-be-somebody-to-you.md",
        "message.html?file=russian-roulette.md",
        "message.html?file=she-cant-run.md",
        "message.html?file=the-last-bite.md"
    ];
    const current = window.location.href;
    const index = messages.findIndex(m => current.includes(m.split('?')[1]));
    const container = document.getElementById("message-pagination");
    if(container){
        container.innerHTML =
            (index>0 ? `<a href="${messages[index-1]}">← Previous</a>` : `<span style="opacity:0.5;">← Previous</span>`)
            + `<span style="margin:0 12px;">|</span>` +
            (index<messages.length-1 ? `<a href="${messages[index+1]}">Next →</a>` : `<span style="opacity:0.5;">Next →</span>`);
    }
    const shareBtn = document.getElementById("share-btn");
    if(shareBtn){
        shareBtn.addEventListener("click", async ()=>{
            if(navigator.share){
                try{
                    await navigator.share({
                        title: document.querySelector("h2").textContent,
                        text: "Check out this message from Messages from 061!",
                        url: window.location.href
                    });
                }catch(err){console.error("Sharing failed",err);}
            }else{
                alert("Your browser does not support sharing. Copy the URL instead: " + window.location.href);
            }
        });
    }
    document.addEventListener("keydown", e=>{
        if(index < 0) return;
        if(e.key==="ArrowLeft" && index>0) window.location.href = messages[index-1];
        if(e.key==="ArrowRight" && index<messages.length-1) window.location.href = messages[index+1];
    });
})();
