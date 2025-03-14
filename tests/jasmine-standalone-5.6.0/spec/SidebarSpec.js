import { generateSidebar, hideSidebar } from "../../../scripts/sidebar.js";

describe("Sidebar tests", ()=>{
    let testDiv= document.querySelector(".js-test-div")

    beforeEach(()=> {
        testDiv.innerHTML="<div class=\"sidebar\"></div>";
    });

    afterEach(()=>{
        testDiv.innerHTML="<div class=\"sidebar\"></div>";
    });

    //we expect that the sidebar puts something inside div
    it("generate sidebar basic test",()=>{
        const sidebar= document.querySelector(".sidebar");
        expect(sidebar.innerHTML).toEqual("");
        generateSidebar();
        expect(sidebar.innerHTML).not.toEqual("");
    });

    //we expect that when we hide it the class list changes 
    it("hide sidebar test",()=>{
        let sidebar= document.querySelector(".sidebar");
        expect(sidebar.classList.contains("sidebar-hidden")).toEqual(false);
        const initialListLen = sidebar.classList.length;
        hideSidebar();
        sidebar= document.querySelector(".sidebar");
        const newListLen = sidebar.classList.length;
        expect(initialListLen).toEqual(newListLen-1);
        expect(sidebar.classList.contains("sidebar-hidden")).toEqual(true);
    });


    /*it("generate navbar basic test",()=>{
        const navbar= document.querySelector(".navbar");
        expect(navbar.innerHTML).toEqual("");
        generateNavbar();
        expect(navbar.innerHTML).not.toEqual("");
    });

    //is the div no longer empty?
    /*it("generate navbar basic test",()=>{
        const navbar= document.querySelector(".navbar");
        expect(navbar.innerHTML).toEqual("");
        generateNavbar();
        expect(navbar.innerHTML).not.toEqual("");
    });

    //is the hamburger menu present?
    it("hamburger menu present",()=>{
        let ham= document.getElementById("hamburger");
        expect(ham).toEqual(null);
        generateNavbar();
        ham= document.getElementById("hamburger");
        expect(ham.innerHTML).not.toEqual(null);
    });

    //is the login link present?
    it("login page link persent",()=>{
        let button = document.querySelector('a[href="login.html"] button');
        expect(button).toEqual(null);
        generateNavbar();
        button = document.querySelector('a[href="login.html"] button');
        expect(button).not.toEqual(null);
    }); */
});