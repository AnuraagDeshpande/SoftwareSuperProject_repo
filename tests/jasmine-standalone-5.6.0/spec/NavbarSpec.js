import { generateNavbar } from "../../../scripts/navbar.js";

describe("NAVBAR", ()=>{
    let testDiv= document.querySelector(".js-test-div")

    beforeEach(()=> {
        testDiv.innerHTML="<div class=\"navbar\"></div>";
    });

    afterAll(()=>{
        testDiv.innerHTML="";
    });

    //is the div no longer empty?
    it("generate navbar basic test",()=>{
        const navbar= document.querySelector(".navbar");
        expect(navbar.innerHTML).toEqual("");
        generateNavbar(false, "name");
        expect(navbar.innerHTML).not.toEqual("");
    });

    //is the hamburger menu present?
    it("hamburger menu present",()=>{
        let ham= document.getElementById("hamburger");
        expect(ham).toEqual(null);
        generateNavbar(false, "name");
        ham= document.getElementById("hamburger");
        expect(ham.innerHTML).not.toEqual(null);
    });

    //is the login link present?
    it("login page link persent",()=>{
        let button = document.querySelector('#btn-login');
        expect(button).toEqual(null);
        generateNavbar(false, "name");
        button = document.querySelector('#btn-login');
        expect(button).not.toEqual(null);
    }); 
});