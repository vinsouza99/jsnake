document.addEventListener('DOMContentLoaded', function () {
    //auto scroll
    function Scrolldown() {
        setTimeout(window.scroll(0, 240), 5000);
    }
    window.onload = Scrolldown;

    document.querySelector('#play-link').className = "active";

    const canvas = document.querySelector('#stage');
    const score_div = document.querySelector('#score-div');

    var context = canvas.getContext("2d");
    const difficulties = { EASY: 'easy', HARD: 'hard' };
    var difficulty = null;
    const styles = { CLASSIC: 'classic', MODERN: 'jsnake' };
    var style = null;

    /*BUTTONS*/
    const play_button = document.querySelector('#play-button');
    const easy_button = document.querySelector('#easy-button');
    const hard_button = document.querySelector('#hard-button');
    const classic_style = document.querySelector('#classic-button');
    const jsnake_style = document.querySelector('#jsnake-button');

    canvas.style.display = 'none';
    score_div.style.display = 'none';
    document.querySelector('#gameover-menu').style.display = 'none';
    document.querySelector('#pause-menu').style.display = 'none';
    play_button.disabled = true;

    easy_button.addEventListener('click', () => {
        difficulty = difficulties.EASY;
        easy_button.style.backgroundColor = 'forestgreen';
        hard_button.style.backgroundColor = 'green';
        if (style != null) {
            play_button.disabled = false;
            play_button.style.backgroundColor = 'green';
        }
    });
    hard_button.addEventListener('click', () => {
        difficulty = difficulties.HARD
        hard_button.style.backgroundColor = 'forestgreen';
        easy_button.style.backgroundColor = 'green';
        if (style != null) {
            play_button.disabled = false;
            play_button.style.backgroundColor = 'green';
        }
    });
    classic_style.addEventListener('click', () => {
        style = styles.CLASSIC;
        classic_style.style.backgroundColor = 'forestgreen';
        jsnake_style.style.backgroundColor = 'green';
        if (difficulty != null) {
            play_button.disabled = false;
            play_button.style.backgroundColor = 'green';
        }

    });
    jsnake_style.addEventListener('click', () => {
        style = styles.MODERN;
        jsnake_style.style.backgroundColor = 'forestgreen';
        classic_style.style.backgroundColor = 'green';
        if (difficulty != null) {
            play_button.disabled = false;
            play_button.style.backgroundColor = 'green';
        }
    });
    play_button.addEventListener('click', () => {
        document.querySelector('#game-menu').style.display = 'none';
        canvas.style.display = 'block';
        score_div.style.display = 'block';

        play(canvas, difficulty, style, context);
    });
    
});

function play(canvas, difficulty, style, context) {
    /* Enable gameplay */
    detectButtonPush();
    document.addEventListener("keydown", keyPush);

    var color_scheme = [];
    if (style == 'classic') {
        color_scheme = ['#9acc99', '#346856', '#030100', 'whitesmoke'];
    } else {
        color_scheme = ['black', 'red', 'green', 'yellow'];
    }
    const score_div = document.querySelector('#score-div');
    var score_text = document.querySelector('#score-text');
    var level_text = document.querySelector('#level-text');
    var pause_icon = document.querySelector('#pause-resume-icon')
    var is_paused = false;
    var intervalID = 0;

    /* Apply color scheme */
    score_div.style.backgroundColor = color_scheme[0];
    canvas.style.borderColor = color_scheme[3];
    score_div.style.borderColor = color_scheme[3];
    pause_icon.style.color = color_scheme[3];
    if (style == 'classic') {
        score_text.style.color = color_scheme[1];
        level_text.style.color = color_scheme[1];
    } else {
        score_text.style.color = 'white';
        level_text.style.color = color_scheme[1];
    }

    /* Run game */
    if (difficulty == 'easy') {
        intervalID = setInterval(easygame, 60);
        document.querySelector('#pause-button').addEventListener("click", pause_or_resume);
    } else {
        document.querySelector('#score-div').style.borderWidth = '5px';
        intervalID = setInterval(hardgame, 60);
        document.querySelector('#pause-button').addEventListener("click", pause_or_resume);
    }
    /* Variables definition */
    var score = 0;
    var speed = 1;
    var level = 'SLUG';
    var vx = vy = 0;

    /*render snake in the center of the screen.The canvas'
    * dimensions should be taken in consideration for the
    * numbers chosen here.
    */
    var snakex = 30;
    var snakey = 28;

    /*stands for 'side length'. It determines that every square that
     * represents the apple or the snake will have it side with length
     * of 10 pixels. The canvas' dimensions should be taken in consideration
     * for the number chosen here.
     */
    var sl = 10; 

    /*stands for 'render spaces'. It determines that there will be 59
     * spaces vertically and horizontally to the snake and apple to 
     * render. The canvas' dimensions should be taken in consideration
     * for the number chosen here.
    */
    var rs = 59;

    
    /*To prevent that the snake and the apple are rendered in the same place,
     * (very low chances but I don't want to ruin your fun with this crippling
     * concern) make sure that at least one of the inital coordinates are different.
     */
    var applex;
    do {
        applex = Math.floor(Math.random() * rs);
    }while(applex == 30)
    var appley = Math.floor(Math.random() * rs);

    var trail = []
    var tail = 3;

    function easygame() {
        score_text.innerText = `Score: ${score}`;
        level_text.innerText = `Level: ${level}`;

        //every time this function is called, the snake moves a bit
        snakex += vx;
        snakey += vy;

        //the snake reaches to the limit of the canvas
        if (snakex < 0) {
            snakex = rs;
        }
        if (snakex > rs) {
            snakex = 0;
        }
        if (snakey < 0) {
            snakey = rs;
        }
        if (snakey > rs) {
            snakey = 0;
        }
        //render play area
        context.fillStyle = color_scheme[0];
        context.fillRect(0, 0, canvas.width, canvas.height);

        //render snake
        context.fillStyle = color_scheme[2];
        for (var i = 0; i < trail.length; i++) {
            /* In the retro style, the snake's squares has borders*/
            if (style == 'classic') {     
                context.fillStyle = color_scheme[0];
                context.fillRect((trail[i].x-(0.3)) * sl+1, (trail[i].y-(0.3)) * sl+1, sl+3, sl+3);
                context.fillStyle = color_scheme[2];
            }
            context.fillRect(trail[i].x * sl, trail[i].y * sl, sl, sl);

            //if the snake hits itself
            if (trail[i].x == snakex && trail[i].y == snakey && tail != 3) {
                clearInterval(intervalID);
                document.removeEventListener("keydown", keyPush);
                setTimeout(function () {gameover(score, canvas, context, difficulty); }, 500);
            }
        }
        trail.push({ x: snakex, y: snakey });
        while (trail.length > tail) {
            trail.shift();
        }
        //render apple
        context.fillStyle = color_scheme[1];
        context.fillRect(applex * sl, appley * sl, sl, sl);

        //if the snake eats the apple
        if (applex == snakex && appley == snakey) {
            score += 50;
            if (score == 200) {
                level = 'SNAKE';
            } else if (score == 1000) {
                level = 'PYTHON';
            }
            if (level === 'SLUG') {
                tail++;
            } else if (level === 'SNAKE') {
                tail += 2;
            }else { //PYTHON
                tail += 3;
            }
            
            trail.push({ x: snakex, y: snakey });
            applex = Math.floor(Math.random() * rs);
            appley = Math.floor(Math.random() * rs);
        }
    }
    function hardgame() {
        score_text.innerText = `Score: ${score}`;
        level_text.innerText = `Level: ${level}`;
        //every time this function is called, the snake moves a bit
        snakex += vx;
        snakey += vy;
        //snake reaches to the limit of the canvas
        if (snakex < 0 || snakex > rs || snakey < 0 || snakey > rs) {
            clearInterval(intervalID);
            document.removeEventListener("keydown", keyPush);
            setTimeout(function () {gameover(score, canvas, context, difficulty); }, 500);
        }
        //render play area
        context.fillStyle = color_scheme[0];
        context.fillRect(0, 0, canvas.width, canvas.height);
        canvas.style.borderWidth = '5px';
        
        //render snake
        context.fillStyle = color_scheme[2];
        for (var i = 0; i < trail.length; i++) {
            /* In the retro style, the snake's squares has borders*/
            if (style == 'classic') {
                context.fillStyle = color_scheme[0];
                context.fillRect((trail[i].x - (0.3)) * sl + 1, (trail[i].y - (0.3)) * sl + 1, sl + 3, sl + 3);
                context.fillStyle = color_scheme[2];
            }
            context.fillRect(trail[i].x * sl, trail[i].y * sl, sl, sl);

            context.fillRect(trail[i].x * sl, trail[i].y * sl, sl, sl);

            //if the snake hits itself
            if (trail[i].x == snakex && trail[i].y == snakey && tail != 3) {
                vx = vy = 0;
                document.removeEventListener("keydown", keyPush);
                clearInterval(intervalID);
                setTimeout(function () { gameover(score, canvas, context, difficulty); }, 500);
            }
        }
        trail.push({ x: snakex, y: snakey });
        while (trail.length > tail) {
            trail.shift();
        }
        //render apple
        context.fillStyle = color_scheme[1];
        context.fillRect(applex * sl, appley * sl, sl, sl);

        //if the snake eats the apple
        if (applex == snakex && appley == snakey) {
            score += 50;
            if (score == 400) {
                level = 'SNAKE';
            } else if (score == 1500) {
                level = 'PYTHON';
            }
            if (level === 'SLUG') {
                tail++;
            } else if (level === 'SNAKE') {
                tail += 2;
            } else { //PYTHON
                tail += 3;
            }
            trail.push({ x: snakex, y: snakey });
            applex = Math.floor(Math.random() * rs);
            appley = Math.floor(Math.random() * rs);
        }
    }

    //if the user plays with the keyboard
    function keyPush(event) {
        event.preventDefault();
        switch (event.keyCode) {
            case 27:
                pause_or_resume();
                break;
            //left arrow
            case 37:
                //if the snake is not going in the horizontal direction already
                if (vx == 0) {
                    vx = -speed;
                    vy = 0;
                }
                break;
            //up arrow
            case 38:
                //if the snake is not going in the vertical direction already
                if (vy == 0) {
                    vx = 0;
                    vy = -speed;
                }
                break;
            //right arrow
            case 39:
                //if the snake is not going in the horizontal direction already
                if (vx == 0) {
                    vx = speed;
                    vy = 0;
                }
                break;
            //down arrow
            case 40:
                //if the snake is not going in the vertical direction already
                if (vy == 0) {
                    vx = 0;
                    vy = +speed;
                }
                break;
        }
    }

    //if the user plays with a mobile
    function detectButtonPush() {
        const up = document.querySelector('#up');
        const down = document.querySelector('#down');
        const left = document.querySelector('#left');
        const right = document.querySelector('#right');

        up.onclick = function () {
            if (vy == 0) {
                vx = 0;
                vy = -speed;
            }
        };
        down.onclick = function () {
            if (vy == 0) {
                vx = 0;
                vy = +speed;
            }
        };
        left.onclick = function () {
            if (vx == 0) {
                vx = -speed;
                vy = 0;
            }
        };
        right.onclick = function () {
            if (vx == 0) {
                vx = speed;
                vy = 0;
            }
        };
    }

    function pause_or_resume() {
        is_paused = !is_paused;
        if (is_paused) {
            document.querySelector('#pause-resume-icon').className = 'fa fa-play';
            clearInterval(intervalID);
            document.querySelector('#pause-menu').style.display = 'block';
            document.querySelector('#resume-button').addEventListener("click", pause_or_resume);
            document.querySelector('#back-button').onclick = function () {
                location.reload(true)
            };
        } else {
            document.querySelector('#pause-resume-icon').className = 'fa fa-pause';
            document.querySelector('#pause-menu').style.display = 'none';
            if (difficulty == 'easy') {
                intervalID = setInterval(easygame, 60);
            } else {
                document.querySelector('#score-div').style.borderWidth = '5px';
                intervalID = setInterval(hardgame, 60);
            }
        }
    }
}

function gameover(score, canvas, context, difficulty) {
    scrollUp();
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector('#gameover-menu').style.display = 'block';
    document.querySelector('#sign-in-message').style.display = 'none';
    document.querySelector('#game-menu').style.display = 'none';
    document.querySelector('#stage').style.display = 'none';
    document.querySelector('#score-div').style.display = 'none';
    document.querySelector('#pause-menu').style.display = 'none';
    document.querySelector('#your-score').innerText = `Your score: ${score}`;

    /* Try to get the user's highscore in the difficulty he/she just played in.
     * If the user is not authenticated, the gameover menu will display a message
     * telling him/her that it is needed to sign in to save their score.
     * 
     * If the user is signed in, the gameover menu will display his/her highscore and,
     * if the user has just beaten their highscore, the gameover menu will them them so
     * and display a button to save their new highscore.
     */
    fetch(`getscore/${difficulty}`, { method: 'GET', difficulty: `${difficulty}` })
    .then(response => response.json())
    .then(result => {
        if (result.highscore === 'not-user') {
            document.querySelector('#sign-in-message').style.display = 'block';
            document.querySelector('#save-score').style.display = 'none';
        } else {
            /* If the user is signed in but have not saved any scores yet, 
            * the function in views.py will return -1
            */
            if (result.highscore != -1 || result.highscore != 'None') {
                document.querySelector('#highscore-display').innerText = `Highscore: ${result.highscore}`;
            }
            // If the user is signed in but have not beaten their highscore in that difficulty
            if (score <= result.highscore || score == 0) {
                document.querySelector('#save-score').style.display = 'none';
                document.querySelector('#new-highscore').innerText = "";
            } else {
                document.querySelector('#save-score').style.display = 'inline';
                document.querySelector('#new-highscore').innerText = "New Highscore!";
            }
        }
    });
    document.querySelector('#try-again-button').addEventListener('click', () => {
        document.querySelector('#game-menu').style.display = 'block';
        document.querySelector('#gameover-menu').style.display = 'none';
        document.querySelector('#score-div').style.display = 'none';
        canvas.style.display = 'none';
        difficulty = null;
        style = null;
        var buttons = document.getElementsByClassName("game-menu-button");
        for (var i = 0, length = buttons.length; i < length; i++) {
            buttons[i].style.backgroundColor = 'green';
        }     
        document.querySelector('#play-button').disabled = true;
        document.querySelector('#play-button').style.backgroundColor = 'limegreen';
    });
    document.querySelector('#save-score').addEventListener('click', () => {
        fetch('save', {
            method: 'POST',
            body: JSON.stringify({
                score: `${score}`,
                difficulty: `${difficulty}`
            })
        })
        document.querySelector('#save-score').innerText = "Saved!";
        document.querySelector('#save-score').disabled = true;
        document.querySelector('#save-score').style.backgroundColor = "limegreen";
    });
}
/*after loading the game over menu, the screen would, for some reason, appear as if it was scrolled to
* the middle of the screen. So, this functions solves it.
*/
function scrollUp() {
    setTimeout(window.scroll(245, 240), 5000);
}
