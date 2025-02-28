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
            <button id="hamburger" onclick="
                hideSidebar();
            ">
                <i class="fa fa-bars" aria-hidden="true"></i>
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
        <div class="header">
            <div class="header-text">
                
                <h1>Manage your project more efficiently!</h1>
                <h3>Project Management Boook of Knowledge based</h3>
            </div>
            <img src="media/index_header.jpg">
        </div>        
    </body>
</html>