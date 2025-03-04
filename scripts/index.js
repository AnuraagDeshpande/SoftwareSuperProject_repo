function shuffle(arr){
    if(Array.isArray(arr)){
        return arr.sort((a,b)=> 0.5 - Math.random());
    }
}

function getEmojis(){
    const emojis=["&#128187", "&#128190","&#128188","&#128195", "&#128203", "&#128206","&#128205","&#128346"];
    return shuffle(emojis).slice(0,3);
}

function switchEmojis(){
    const emojis = document.querySelectorAll(".js-emoji-switch");
    const newEmojis = getEmojis();
    emojis.forEach((emoji, index)=>{
        emoji.innerHTML=newEmojis[index];
    });
}

function setEmojiInterval(){
    setInterval(()=>{switchEmojis();}, 2000);
}

setEmojiInterval();
