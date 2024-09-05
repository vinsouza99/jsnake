document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#join-link').className = 'active';

    const login_div = document.querySelector('#login-div');
    const register_div = document.querySelector('#register-div');

    login_div.style.display = 'block';
    register_div.style.display = 'none';

    document.querySelector('#register-here-button').onclick = function () {
        login_div.style.display = 'none';
        register_div.style.display = 'block';
    };
    document.querySelector('#login-here-button').onclick = function () {
        login_div.style.display = 'block';
        register_div.style.display = 'none';
    };

});
