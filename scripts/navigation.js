import { generateNavbar } from "./navbar.js";
import { generateSidebar, hideSidebar } from "./sidebar.js";

generateNavbar();
generateSidebar();

window.hideSidebar=hideSidebar;