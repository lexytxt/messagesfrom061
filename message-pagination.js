(function(){
const messages=[
"eyes-wide-shut.html",
"i-want-to-be-somebody-to-you.html",
"russian-roulette.html",
"she-cant-run.html",
"the-last-bite.html"
];
const current=window.location.pathname.split("/").pop();
const index=messages.indexOf(current);
const container=document.getElementById("message-pagination");
if(container){
container.innerHTML=
(index>0?`<a href="${messages[index-1]}">← Previous Message</a>`:`<span style="opacity:0.5;">← Previous Message</span>`)
+`<span style="margin:0 12px;">|</span>`+
(index<messages.length-1?`<a href="${messages[index+1]}">Next Message →</a>`:`<span style="opacity:0.5;">Next Message →</span>`);
}
const shareBtn=document.getElementById('share-btn');
if(shareBtn){
shareBtn.addEventListener('click',async()=>{
if(navigator.share){
try{
await navigator.share({
title:document.querySelector('h2').textContent,
text:'Check out this message from Messages from 061!',
url:window.location.href
});
}catch(err){console.error('Sharing failed',err);}
}else{
alert('Your browser does not support sharing. You can copy the URL instead: '+window.location.href);
}
});
}
})();
