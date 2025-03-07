const team=[
    {
        name: "Birb",
        desc: "SCREAM",
        pic: "profile-picture-placeholder.png",
        links: {
            github: "",
            star: "",
            mail: ""
        }
    },
    {
        name: "Birb 2",
        desc: "moral support",
        pic: "profile-picture-placeholder.png",
        links: {
            github: "",
            star: "",
            mail: ""
        }
    },
    {
        name: "Birb 3",
        desc: "expert expert",
        pic: "profile-picture-placeholder2.jpg",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    },
    {
        name: "Birb 4",
        desc: "expert expert on experts",
        pic: "profile-picture-placeholder.png",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    },
    {
        name: "Birb",
        desc: "SCREAM",
        pic: "profile-picture-placeholder.png",
        links: {
            github: "",
            star: "",
            mail: ""
        }
    },
    {
        name: "Birb 2",
        desc: "moral support",
        pic: "profile-picture-placeholder.png",
        links: {
            github: "",
            star: "",
            mail: ""
        }
    },
    {
        name: "Birb 3",
        desc: "expert expert",
        pic: "profile-picture-placeholder2.jpg",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    },
    {
        name: "Birb 4",
        desc: "expert expert on experts",
        pic: "profile-picture-placeholder.png",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    }
];

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

function setTeamCards(){
    let teamCards="";
    let teamSection=document.querySelector(".team-grid");
    //console.log(teamSection.innerHTML);
    team.forEach((person)=>{
        const card = `
        <div class="team-card">
            <img src="media/${person.pic}">
            <h2>${person.name}</h2>
            ${person.desc}
            <div class="team-member-links">
                <button class="primary-button">
                    <i class="fa fa-github" aria-hidden="true"></i>
                </button>
                <button class="primary-button">
                    <i class="fa fa-asterisk" aria-hidden="true"></i>
                </button>
                <button class="primary-button">
                    <i class="fa fa-envelope-o" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        `;
        console.log(person);
        teamCards+=card;
    });
    console.log(teamCards);
    teamSection.innerHTML=teamCards;
}

setEmojiInterval();

setTeamCards();
