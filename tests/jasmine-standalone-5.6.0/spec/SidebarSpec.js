import { generateSidebar, hideSidebar } from "../../../scripts/sidebar.js";

describe("SIDEBAR", ()=>{
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
});