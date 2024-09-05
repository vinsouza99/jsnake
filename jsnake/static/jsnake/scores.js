document.addEventListener('DOMContentLoaded', async function () {
    document.querySelector('#score-link').className = "active";
    document.body.paddingBottom = '200px';

    //the page of scores to be viewed in each difficulty. It always starts by the first (how the turntables)
    var easy_page = 1;
    var hard_page = 1;

    //the number of pages is needed to disbale the previous/next buttons when they reach to the end or to the beginning of the pagination
    const page_limit_easy = await get_num_pages('easy');
    const page_limit_hard = await get_num_pages('hard');

    //every page returns info that are needed by the next page. More explanation below
    var easy_first_page_info = await load_highscores('easy', easy_page, [-1,0]);
    var hard_first_page_info = await load_highscores('hard', hard_page, [-1,0]);

    handle_pagination_buttons('easy',easy_page, page_limit_easy, easy_first_page_info);
    handle_pagination_buttons('hard',hard_page, page_limit_hard, hard_first_page_info);
});
async function handle_pagination_buttons(dif, page_num, page_limit, first_page_info) {
    /*
     * Every page needs info about the last score listed in the previous page. It is like 
     * this because, when the user navigate trough the scores, the application can know 
     * how the ranking was so it can render the next set of scores following the ranking 
     * number. 
    */
    var pagination_info = [];
    pagination_info[0] = [-1, 0]; //the first page won't have a previous score nor ranking
    pagination_info[1] = first_page_info;
    
    const div = document.querySelector(`#${dif}-pagination-div`);
    const previous_button = document.querySelector(`#previous-${dif}`);
    const next_button = document.querySelector(`#next-${dif}`);
    div.style.height = '50px';

    if (page_limit == 1) { // disable both pagination number if there are only 10 or less scores
        previous_button.style.display = 'none';
        next_button.style.display = 'none';
    } else {
        //since this page always start by display the first page of scores, the previous button starts being unavailable
        previous_button.style.display = 'none'; 

        next_button.onclick = async function () {
            page_num++;
            previous_button.style.display = 'inline-block';
            pagination_info[page_num] = await load_highscores(dif, page_num, pagination_info[page_num - 1]);
            if (page_num == page_limit) { //the last page doesn't have a next one
                next_button.style.display = 'none';
            }
        };
        previous_button.onclick = function () {
            page_num--;
            next_button.style.display = 'inline-block';
            load_highscores(dif, page_num, pagination_info[page_num - 1]);
            if (page_num == 1) { //the first page doesn't have a previous one
                previous_button.style.display = 'none';
            }
        };
    }
}
async function load_highscores(difficulty, page, page_info) {
    //this function will return the info about the ranking and last score displayed
    return await
    fetch(`scores/${difficulty}/${page}`, { method: 'GET', dif: `${difficulty}`, pagenumber :`${page}` })
    .then(response => response.json())
    .then(scores => {
        var div_to_append = null;
        if (difficulty === 'easy') {
            div_to_append = document.querySelector('#easy-scores');
        } else {
            div_to_append = document.querySelector('#hard-scores');
        }
        div_to_append.innerHTML = "";
        if (scores.length == 0) {
            const message = document.createElement('div')
            message.className = "score-list-div";
            message.innerHTML = "<p> There are no highscores in this difficulty yet. Be the first!</p>";
            message.style.padding = '10px';
            div_to_append.append(message);
        } else {
            const user_username = document.querySelector('#user-username').innerText;
            var previous_score = page_info[0];
            var ranking = page_info[1];
            for (var score in scores) {
                const current_score = scores[score];
                const score_display = document.createElement('div');
                score_display.className = "score_list_div";
                /*
                 * If two users have the same score in the same difficulty, they are in a tie.
                 * How I'm a fair fellow, they will have the same ranking number. The ranking
                 * number only changes when the score about to be rendered is smaller than the
                 * previous (no tie).
                 */
                if (previous_score != current_score.value) {
                    ranking++;
                    previous_score = current_score.value;
                }
                if (ranking == 1) {
                    score_display.className = 'highest_score_display';
                    if (user_username == current_score.scorer) { //highlight the scorer name if he/she is the current user
                        score_display.innerHTML = `<span class="first_place_ranking">${ranking}</span><span class="first-place-value">${current_score.value}</span> <span class="other-info-text"> By <span class="highlited-scorer-name"> ${current_score.scorer}</span> on ${current_score.timestamp}</span> `;
                    } else {
                        score_display.innerHTML = `<span class="first_place_ranking">${ranking}</span><span class="first-place-value">${current_score.value}</span> <span class="other-info-text"> By <span class="scorer-name"> ${current_score.scorer}</span> on ${current_score.timestamp}</span> `;
                    }
                } else {
                    if (user_username == current_score.scorer) { //highlight the scorer name if he/she is the current user
                        score_display.innerHTML = `<span class="ranking-num">${ranking}</span><span class="score-value">${current_score.value}</span> <span class="other-info-text"> By <span class="highlited-scorer-name"> ${current_score.scorer}</span> on ${current_score.timestamp}</span> `;
                    } else {
                        score_display.innerHTML = `<span class="ranking-num">${ranking}</span><span class="score-value">${current_score.value}</span> <span class="other-info-text"> By <span class="scorer-name"> ${current_score.scorer}</span> on ${current_score.timestamp}</span> `;
                    }
                }
                div_to_append.append(score_display);
            }
            /* By returning the last score (previous_score), the next page will know if 
             * the first score to be rendered in the new set of score is in a tie with
             * the last score in the previous page. In that way, the ranking number 
             * (ranking) will remain the same if there is a tie or change if there isn't
             */
            return [previous_score, ranking];
        }
    });
}
async function get_num_pages(difficulty) {
    var response = await fetch(`scores/${difficulty}/0`, { method: 'GET', dif: `${difficulty}`, pagenumber: '0' });
    var json = await response.json();
    var num_pages = json.pages;
    return num_pages;
}