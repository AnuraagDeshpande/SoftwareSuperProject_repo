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

/** shuffle the arrangement of elements in a list */
export function shuffle(arr){
    if(Array.isArray(arr)){
        return arr.sort((a,b)=> 0.5 - Math.random());
    }
}

/** get a list of 3 random emojis from a predefined list */
export function getEmojis(){
    const emojis=["&#128187", "&#128190","&#128188","&#128195", "&#128203", "&#128206","&#128205","&#128346"];
    return shuffle(emojis).slice(0,3);
}

/** switch elements that have a js-emoji-switch class */
export function switchEmojis(){
    const emojis = document.querySelectorAll(".js-emoji-switch");
    if(emojis){
        const newEmojis = getEmojis();
        emojis.forEach((emoji, index)=>{
            emoji.innerHTML=newEmojis[index];
        });
    }
}

/** start switching emojis in a page */
export function setEmojiInterval(){
    return setInterval(()=>{switchEmojis();}, 2000);
}

/** set the content of a team-grid section to be cards with project team member names and info */
export function setTeamCards(){
    let teamCards="";
    let teamSection=document.querySelector(".team-grid");
    if(teamSection){
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
            teamCards+=card;
        });
        teamSection.innerHTML=teamCards;
    }
}

/** initiate the page */
function init(){
    setEmojiInterval();
    setTeamCards();
}

init();
