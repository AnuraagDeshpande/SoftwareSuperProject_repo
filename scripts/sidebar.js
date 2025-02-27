let isSidebarHidden=false;

function hideSidebar(){
    console.log("hiding side bar");
    const labels = document.querySelectorAll(".js-sidebar-hide");
    isSidebarHidden = false;
    labels.forEach((item)=>{
        item.classList.toggle("hidden");
    });
    //the sidebar has to shrink into a button
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("sidebar-hidden");
    //the menu button has to shrink as well
    const hamburger = document.getElementById("hamburger");
    hamburger.classList.toggle("hamburger-hidden");
}