import { getEmojis, setTeamCards, switchEmojis, shuffle } from "../../../scripts/index.js";

describe("INDEX PAGE TESTS",()=>{
    let testDiv= document.querySelector(".js-test-div");

    //we test the getEmojis function
    describe("#get emojis test",()=>{
        //we expect a list of length 3
        it("list length test",()=>{
            const emojis = getEmojis();
            expect(emojis.length).toEqual(3);
        });

        //output type should be an array
        it("output type test",()=>{
            const emojis = getEmojis();
            expect(Array.isArray(emojis)).toEqual(true);
        });

        //each element is a code point
        it("array contents",()=>{
            const emojis = getEmojis();
            const prefix = emojis[0].slice(0,2);
            expect(prefix === "&#").toEqual(true);
        });  
    });

    //we test the setTeamCard functions
    describe("#place the team cards test",()=>{
        beforeEach(()=> {
            testDiv.innerHTML="<div class=\"team-grid\"></div>";
        });
    
        afterEach(()=>{
            testDiv.innerHTML="<div class=\"team-grid\"></div>";
        });

        //we expect to not be empty after function call
        it("basic test",()=>{
            const teamGrid = document.querySelector(".team-grid");
            expect(teamGrid.innerHTML).toEqual("");
            setTeamCards();
            expect(teamGrid.innerHTML).not.toEqual("");
        }); 

        //we check that key classes inside the div are present in correct quantitites
        it("content class test",()=>{
            setTeamCards();
            const cards = document.querySelectorAll("team-card");
            expect(cards).not.toEqual(null);
            const links = document.querySelectorAll("team-member-links");
            expect(links).not.toEqual(null);
            expect(links.length).toEqual(cards.length);
        });
    });

    //switch elements inside the js-emoji-switch
    describe("#emoji switch test",()=>{
        beforeEach(()=> {
            testDiv.innerHTML="<div class=\"js-emoji-switch\"></div>".repeat(3);
        });
    
        afterEach(()=>{
            testDiv.innerHTML="";
        });

        //we expect values to change
        it("value change test",()=>{
            let emojis = document.querySelectorAll(".js-emoji-switch");
            switchEmojis();
            const initEm = Array.from(document.querySelectorAll(".js-emoji-switch")).map((el)=>{ return el.innerHTML;});
            switchEmojis();
            emojis = Array.from(emojis).map((el)=>{return el.innerHTML;})
            const dif = emojis.map((emoji, index)=>{return initEm[index] !== emoji});
            expect(dif.includes(true)).toEqual(true);
        });

        it("is the value emoji test",()=>{
            switchEmojis();
            const initEm = Array.from(document.querySelectorAll(".js-emoji-switch")).map(el=> el.innerHTML);
            const res = initEm.map(elem => {
                return /\p{Emoji}/u.test(elem);
            });

            expect(res.every(value => value === true)).toEqual(true);
        });
    });

    describe('shuffle function', () => {

        it('length stays the same', () => {
            const arr = [1, 2, 3, 4, 5];
            const result = shuffle(arr);
            expect(result.length).toBe(arr.length);
        });
    
        it('random order of elements', () => {
            const arr = [1, 2, 3, 4, 5];
            const shuffled = shuffle([...arr]);
            expect(shuffled).not.toEqual(arr);
        });
    });
});

let testDiv= document.querySelector(".js-test-div");
testDiv.innerHTML="";