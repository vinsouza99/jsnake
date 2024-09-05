document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#home-link').className = 'active';
    document.body.paddingBottom = '200px';

    apply_modal_feature('blockade');
    apply_modal_feature('jsnake');

    load_comments(1);
    const comment_button = document.querySelector('#comment-button');
    handle_pagination();

    comment_button.onclick = function () {
        var comments_num = document.querySelector('#comments_num');
        if (document.querySelector('#comment-textarea').value != "") {
            fetch('comment', {
                method: 'POST',
                body: JSON.stringify({
                    comment_content: document.querySelector('#comment-textarea').value
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    alert(result.error);
                } else {
                    load_comments(1);
                    comments_num.innerText = parseInt(comments_num.innerText) + 1;
                    document.querySelector('#comment-textarea').value = "";
                }
            });
        }
    };
});
function apply_modal_feature(target) {
    var modal = document.querySelector(`#${target}-modal`);
    var img = document.querySelector(`#${target}-img`);
    img.onclick = function () {
        console.log('here');
        modal.style.display = "block";
    }
    var close_button = document.querySelector(`#${target}-close-button`);
    close_button.onclick = function () {
        modal.style.display = "none";
    }
}
function load_comments(page) {
    const div_to_append = document.querySelector('#comments-display-div');
    fetch(`comments/${page}`, { method: 'GET', pagenumber: `${page}` })
    .then(response => response.json())
    .then(comments => {
        div_to_append.innerHTML = "";
        if (comments.length == 0) {
            const message = document.createElement('div');
            message.innerHTML = "<p> There are no comments yet. Be the first!</p>";
            message.style.padding = '10px';
            message.style.fontFamily = 'Manaspace';
            div_to_append.append(message);
        } else {
            for (var comment in comments) {
                const current_comment = comments[comment];
                const comment_display = document.createElement('div');
                comment_display.className = 'comment_display_div';

                comment_display.innerHTML =
                    `<span class="comment-autor"> ${current_comment.autor}</span>
                     <p class="comment-content"> ${current_comment.content}</p>
                     <span class="comment-timestamp"> ${current_comment.publication_date}</span>
                    `;
                div_to_append.append(comment_display);
            }
        }
    })
}
async function handle_pagination() {
    var response = await get_num_pages_and_comments();
    var page_limit = response[0];
    document.querySelector('#comments_num').innerText = response[1];
    var page_num = 1;

    const previous_button = document.querySelector('#previous-comments');
    const next_button = document.querySelector('#next-comments');

    if (page_limit == 1) { // disable both pagination number if there are only 10 or less scores
        previous_button.style.display = 'none';
        next_button.style.display = 'none';
    } else {
        //since this page always start by display the first page of scores, the previous button starts being unavailable
        previous_button.style.display = 'none';

        next_button.onclick = async function () {
            page_num++;
            previous_button.style.display = 'inline-block';
            load_comments(page_num);
            if (page_num == page_limit) { //the last page doesn't have a next one
                next_button.style.display = 'none';
            }
        };
        previous_button.onclick = function () {
            page_num--;
            next_button.style.display = 'inline-block';
            load_comments(page_num);
            if (page_num == 1) { //the first page doesn't have a previous one
                previous_button.style.display = 'none';
            }
        };
    }

}
async function get_num_pages_and_comments(){
    var response = await fetch('comments/0', { method: 'GET', pagenumber: '0' });
    var json = await response.json();
    var num_pages = json.pages;
    var num_comments = json.num;
    return [num_pages, num_comments];
}
