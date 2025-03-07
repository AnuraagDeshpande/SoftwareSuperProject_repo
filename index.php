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
            <button class="dark-button">
                Sign Up
            </button>
        </div>
        <!--SIDEBAR CODE-->
        <div class="sidebar">
            <h1>PMBOK</h1>
            <div></div>
            <h2 class="sidebar-subheader">General</h2>
            <button class="dark-button">
                <i class="fa fa-database" aria-hidden="true"></i>
                <div class="sidebar-label">
                    Projects
                </div>
            </button>
            <button class="dark-button">
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
            <div class="about-grid section-header">
                <div class="feature-desc">
                    <h1>Fresh design and useful features</h1>
                    <p>
                        We empower proffesionals around campus to take on challanges and persue projects that lead them to success. Our website is up around the clock to support the most odd working hours and deadlines that were yesterday.
                    </p>
                    <p>
                        The structure of the management system is based on the Project manegment book of knowledge and Software Engineering course.
                    </p>
                    <p>
                        Enjoy clean design and intuitive UI that is used by the best.
                    </p>
                </div>
                <div class="feature-grid">
                    <div class="primary-card js-emoji-switch">
                        &#128187
                    </div>
                    <div class="secondary-card">
                        fast
                    </div>
                    <div class="tertiary-card">
                        pmbok
                    </div>
                    <div class="tertiary-card js-emoji-switch">
                        &#128190
                    </div>
                    <div class="primary-card js-emoji-switch">
                        &#128188
                    </div>
                    <div class="secondary-card">
                        online
                    </div>
                    
                </div>
            </div>
            <!--TEAM MEMBER SECTION-->
            <h1 class="section-header">
                Meet out team
            </h1>
            <div class="team-grid">
                <!--JAVASCRIPT-->
            </div>
        </div>
        <div class="footer">
            <div class="footer-section">NAME</div>
            <div class="footer-section">
                <h3>resources:</h3>

                <a href="https://github.com/AnuraagDeshpande/SoftwareSuperProject_repo" target="_blank">
                    project github
                </a>
                <a>
                    documentation
                </a>
            </div>
            <div class="footer-section">
                
                    Completed as part of the Software Engineering course at Constructor University Bremen
                
            </div>
        </div>
        <script type="text/javascript" src="scripts/sidebar.js"></script>
        <script type="text/javascript" src="scripts/index.js"></script>
    </body>
</html>