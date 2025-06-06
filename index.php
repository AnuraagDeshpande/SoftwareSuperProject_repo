<?php
session_start();

// Check if the user is logged in
$isLoggedIn = isset($_SESSION['user_id']);
$username = $_SESSION['user_name'] ?? '';
?>

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
        <!--javaScript-->
        </div>

        <!--SIDEBAR CODE-->
        <div class="sidebar">
        <!--javaScript-->
        </div>
        
        <!--PAGE BODY AND COTNENT-->
        <div class="header">
            <div class="header-text">
                
                <h1>Manage all your Projects more efficiently!</h1>
                <h3>Based on the Project Management Book of Knowledge</h3>
            </div>
            <img src="media/index_header.jpg">
        </div>
        <div class="content-box">
            <h1>
                Loved by Our Users!
            </h1> 
            <div class="review-grid">
                <div class="review">
                    <div class="review-header">
                        <img src="media/profile-picture-placeholder.png">
                        by Jane Salvadore
                    </div>
                    Before we switched to this platform, our project management was all over the place: emails, 
                    spreadsheets, group chats, and constant miscommunication. Since adopting this site, everything’s centralized and easy to track. 
                    The interface is clean, responsive, and surprisingly easy to learn, even for less tech-savvy team members. It's made a huge impact on our productivity, and I genuinely can't imagine going back.
                </div>
                <div class="review">
                    <div class="review-header">
                        <img src="media/profile-picture-placeholder.png">
                        by David King
                    </div>
                    What I love most about this platform is how it balances simplicity with powerful features. Whether I’m managing a complex campaign or just assigning weekly tasks, everything feels smooth and intuitive.
                    We’ve tried a few other tools in the past, but none gave us the flexibility and control that this one does. Highly recommended!
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
                        Enjoy clean design and intuitive UI that is used by the best. Designed by us for you, if you exist. Do you like circles? I love circles! Enjoy our circles!
                    </p>
                    <p>
                        We use innovative technologies like JavaScript, HTML, PHP, SQL and CSS to make your experience the best it can be!
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
                Meet our team
            </h1>
            <div class="team-grid">
                <!--JAVASCRIPT-->
            </div>
        </div>
        <div class="footer">
            <div class="footer-section">
                <a href="https://github.com/AnuraagDeshpande/SoftwareSuperProject_repo" target="_blank">
                    project github
                </a>
            </div>
            <div class="footer-section">
                <a>
                    documentation
                </a>
            </div>
            <div class="footer-section">
                    Completed as part of the Software Engineering course at Constructor University Bremen
            </div>
        </div>

        <!-- Pass PHP session information to JS -->
        <script>
            const isLoggedIn = <?php echo json_encode($isLoggedIn); ?>;
            const username = <?php echo json_encode($username); ?>;
            console.log('isLoggedIn:', isLoggedIn);
            console.log('Username:', username);  // Check the username value
        </script>

        <script type="module">
            import { generateNavbar } from './scripts/navbar.js';
            generateNavbar(isLoggedIn, username);  // Pass both isLoggedIn and username

            import { generateSidebar } from './scripts/sidebar.js';
            generateSidebar();  // This will dynamically generate the sidebar
        </script>
        
        <script type="module" src="scripts/navigation.js"></script>
        <script type="module" src="scripts/index.js"></script>
    </body>
</html>
