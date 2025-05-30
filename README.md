# SoftwareSuperProject_repo
[repo](https://github.com/AnuraagDeshpande/SoftwareSuperProject_repo)
This project was completed as part of the software engineering course at Constructor University Bremen.

## File structure:
- "." contains html and php files with pages of the website as well as the SQL script
- "./styles" contains all css files that are named in the same manner as the page files
- "./scripts? contains frontend javascript code for each page
- "./media" contains the visuals of the website that are used as .png or .jpg files
- "./avatars" contains possible user profile pictures
- "./test" contains the Jasmine code that is used for unit testing
- "./Backend" contains the backend code that is essential for the system to work

## How to deploy:

The user can be referred to [[instructions]](./Backend/instructions.txt).

### Requirements:
- XAMPP
- Browser to view the website pages

### Guide:

Firstly, to connect database, we need to alter db_connection.php file to according our local/other (the server that you are using) credentials.

Next, after XAMPP is downloaded copy the contents of the repo into the htdocs folder. The exact location of this folder
depends on the OS used. On linux it is /opt/lampp/htdocs/SE_REPO. If SE_REPO does not exist yet create it and copy the repo contents inside.

In XAMPP config files set the port to be 3306 and the database to be MySQL with TCP/IP for connections. Other details can be also set.
Go to PHPmyAdmin and import the PMS.sql file or run it in the terminal to create the database and all tables. 

Once everything is set up and type in the address of the website on the system. Enjoy!

In order to test the code go to [[test]](./tests/jasmine-standalone-5.6.0/SpecRunner.html) - SpecRunner.html and run with live server to verify the correctness of the code

