<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SE project</title>
        <link href="styles/main.css" rel="stylesheet"/>
        <link href="styles/sidebar.css" rel="stylesheet"/>
        <link href="styles/navbar.css" rel="stylesheet"/>
        <link href="styles/index.css" rel="stylesheet"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <script type="text/javascript" src="scripts/sidebar.js"></script>
    </head>
    <body>
        <!--NAVIGATION BAR CODE-->
        <div class="navbar">
            <div>
                <button id="hamburger" onclick="
                    hideSidebar();
                ">
                    <i class="fa fa-bars" aria-hidden="true"></i>
                </button>
                NAME
            </div>
            <button class="dark-navbar-button">
                Sign Up
            </button>
        </div>
        <!--SIDEBAR CODE-->
        <div class="sidebar">
            <h1>PMBOK</h1>
            <div></div>
            <h2 class="sidebar-subheader">General</h2>
            <button class="sidebar-cell">
                <i class="fa fa-database" aria-hidden="true"></i>
                <div class="sidebar-label">
                    Projects
                </div>
            </button>
            <button class="sidebar-cell">
                <i class="fa fa-users" aria-hidden="true"></i>
                <div class="sidebar-label">
                    Team
                </div>
            </button>
        </div>
        <!--PAGE BODY AND COTNENT-->
        <div class="header">
            <div class="header-text">
                
                <h1>Manage your project more efficiently!</h1>
                <h3>Project Management Boook of Knowledge based</h3>
            </div>
            <img src="media/index_header.jpg">
        </div>
        <div class="content-box">
            <h1>
                Beloved by imaginary users!
            </h1> 
            <div class="review-grid">
                <div class="review">
                    <div class="review-header">
                        <img src="media/profile-picture-placeholder.png">
                        by Pikachu
                    </div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim aeque doleamus animo, cum corpore dolemus, fieri tamen permagna accessio potest, si aliquod aeternum et infinitum impendere malum nobis opinemur. Quod.
                </div>
                <div class="review">
                    <div class="review-header">
                        <img src="media/profile-picture-placeholder.png">
                        by Beloved Client
                    </div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim aeque doleamus animo, cum corpore dolemus, fieri tamen permagna accessio potest, si aliquod aeternum et infinitum impendere malum nobis opinemur. Quod.
                </div>
            </div>
            <h1 class="section-header">
                Fresh design and useful features
            </h1>
            <h1 class="section-header">
                Meet out team
            </h1>
        </div>
    </body>
</html>