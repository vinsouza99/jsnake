# JSnake
JSnake is a website where you can play the classic snake game written in **JavaScript**. Besides that, you can learn more about the history of the game, compete with others players for the highest score in two difficulties and have access to the source code for the game.

## _Defending_
I consider that JSnake satisfies the distinctiveness and complexity requirements because:\
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**1.** It is not some kind of social network. There are users, but there is nothing like posts or profiles (after all, it does not fit the purpose);\
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**2.** There is nothing similar to an e-commerce or shopping in it;\
	**Also,**\
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**3.** It uses Django in the backend and JavaScript in the frontend;\
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**4.** There are three models in the project: one for the users, other for the scores and other for the comments;\
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**5.** It is mobile responsive (the navbar and other elements responds to screen width and a digital keyboard appears so the user can play if he/she is accessing the website with a mobile);\
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**6.** There is a pagination system to allow users to navigate through both set of scores (easy and hard) without the need to scroll;
	
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; I believe this project to be more complex than the previous ones because it is the first one for which mobile responsiveness was a requirement and because it is all about Web Gaming. Besides coding the game in two difficulties and with increasing difficulty according to the snake's level of growth (Slug, Snake and Python), I had to make the game playable both in computer and mobile, and for that I had to come up with a functional digital keyboard that appears when the user is accessing the site with smaller screen. Because it is a game, I had to add features such as a start menu, a game over menu, pausing and pausing menu and make they all feel as one. That is a lot of variables to deal with, even more when the user can choose between two color schemes to the game. Another factor that contributes for the complexity of this project is the score system. Not only the user (that is signed in) can save their score and compete with themselves, but also they can compete with other users for the highest score in both game difficulties (easy and hard) that are displayed with a ranking that continues even when the user hits the 'next' or 'previous' button in the pagination. Also, justice is complex. If more than one user has the same score, they will be considered tied and will be given the same ranking. The coding for all that gave me headaches, so I consider this project more complex than the previous ones.

## _Files content:_
_jsnake/static/media_       **(path)**\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Blockade_title.png -** The image of one of the first snakes games. It is used in the home page (home.html);\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**JSnake.png -** The logo image of the website. Used in the base layout (layout.html) ;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**new_snek.png -** Screenshot of the snake game that runs in this website for comparison purposes. Also appears in the home page (home.html);\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**snek.png-** Appears in the tab icon;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**snek_gif.gif-** Used in the game menu (play.html). Thought it would look cute;

_jsnake/static/_  **(path)**\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **home.js -** JavaScript code that runs in the home.html file. It sets the 'home' link class in the navbar as 'active' and load comments made by users and the pagination;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**join.js -** JavaScript code that runs in the join.html file. It sets the 'sign up' link class in the navbar as 'active' and handles the toggle between the 'login' and the 'register' form;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**scores.js -** JavaScript code that runs in the scores.html file. It handles the rendering of scores in the appropriate div (easy or hard) and the navigation through score pages by the user;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**snake.js -** JavaScript code that runs in the play.html file. It is where the magic happens. It contains the code for the game in both difficulties and the functions responsible for the gameplay, displaying the correct menus and saving scores.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**source.js -** JavaScript code that runs in the source.html file. It sets the 'source' link class in the navbar as 'active';\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**style.css-** The only CSS file. All the CSS needed to render the webpage like I imagined is there (the only CSS I did not write was the CSS responsible for the code snippet style. For that I used a library from _cdn.jsdelivr.net_)

_jsnake/templates/jsnake_ **(path)**\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**home.html -** All the HTML needed for the home page;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**layout.html -** All the HTML needed for the layout. It is inherited by all the other HTML files;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**login_register.html -** All the HTML needed for the login/ register page. Both forms are here. The join.js file handles the toggle between them;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**play.html -** All the HTML needed for the play page. The canvas where the game is rendered and the menus are here;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**scores.html -** All the HTML needed for the score page;\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**source.html -** All the HTML needed for the source page. It displays the JavaScript codes (and only the _JavaScript_ codes) that are sufficient for this game to run. Here I used a library from _cdn.jsdelivr.net_ for highlighting the JS code inside the code tag;

## _How to run_
To run the application I believe you will have to do the same thing I do: run the server.

Once you do that, that is how you use it:

The **Home** page is the first one you'll face. It is the blog-like part of the site, where you will learn a little bit of the game history. You can leave a comment if you are signed in, also.

Next, you can go to the **Play** page to actually play it. You can choose between two difficulties, easy and hard, between two color schemes, classic and JSnake, and , if you are signed in, can save your score so you can compete with yourself and with others players. There are also instructions, just in case the gameplay isn't clear to you. If you are using a mobile device (with screen width less or equal to 705px) it will appear a digital keyboard so you can play with a  mobile as well. It is possible to pause the game by hitting the pause button in the top right corner of the play area or by pressing 'esc'.

Next, you can go to the **Score** page to checkout the highscores on each difficulty. If you are signed in, you will see your username colored in yellow next to your scores, so you can keep track of your progress more easily. This page displays 10 scores at a time on each difficulty, so, if there are more than 10, it will appear a 'next' and 'previous' button so you can see a new set of scores.

Then you can go to **Source** page if you are interested in the source code for the game in JavaScript. The code is not the same as the one which runs in the website because in the complete version there are other variables, statements and functions that are meant to make the game run in this site how it is supposed to run. However, it is strongly similar and it is written in a more generic way so that the user that wishes to run the game in their on website will only need to add a canvas to the HTML and write a _gameover()_ function to make the code work.

If you wish to save your scores and compete with others, you will need to go to the **Sign in** page to register or to sign in if you are already registered.
