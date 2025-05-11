const team=[
    {
        name: "Alen Kostov",
        desc: "Backend Developer",
        pic: "alen.jpeg",
        links: {
            github: "",
            star: "",
            mail: ""
        }
    },
    {
        name: "Anuraag Satej Deshpande",
        desc: "Frontend Developer",
        pic: "anuraag.jpeg",
        links: {
            github: "",
            star: "",
            mail: ""
        }
    },
    {
        name: "Dulguun Ulziibayar",
        desc: "Backend Developer",
        pic: "dulguun.jpeg",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    },
    {
        name: "Efrata Aynalem Bayle",
        desc: "Frontend Developer",
        pic: "profile-picture-placeholder.png",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    },
    {
        name: "Fidan Yagubzade",
        desc: "Frontend Developer",
        pic: "fidan.jpeg",
        links: {
            github: "",
            star: "",
            mail: ""
        }
    },
    {
        name: "Hikmat Vuqar Oglu Vugarli",
        desc: "Backend Developer",
        pic: "hikmat.jpeg",
        links: {
            github: "",
            star: "",
            mail: ""
        }
    },
    {
        name: "Nafiba Yoseph Biru",
        desc: "Frontend Developer",
        pic: "nafiba.jpeg",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    },
    {
        name: "Nijusha Amgain",
        desc: "Frontend Developer",
        pic: "nijusha.jpeg",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    },
    {
        name: "Rashad Rahimzade",
        desc: "Backend Developer",
        pic: "clara.jpeg",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    },
    {
        name: "Timofei Podkorytov",
        desc: "Frontend Developer",
        pic: "timofei.jpeg",
        links: {
            github: "",
            star: "",
            mail: ""
        } 
    },
    {
        name: "Zaara Valladares",
        desc: "Backend Developer",
        pic: "zaara.jpeg",
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
