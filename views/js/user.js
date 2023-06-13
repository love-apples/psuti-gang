if (typeof Cookies.get('token') != undefined & Cookies.get('token') != '') {
    $.ajax({
        url: "/api/getUserByToken",
        method: "POST",
        data: {"token": Cookies.get('token')},
        success: function(data) {
            document.getElementById('headerLink').innerHTML = data.result.username
            document.getElementById('user-profile').href = '/user/' + data.result.id
            document.getElementById('user-themes').href = '/user/' + data.result.id + '/themes'
            document.getElementById('user-settings').href = '/settings/'
            document.getElementById('headerLink').href = '/user/' + data.result.id
        },
        error: (data) => {
            new Toast({
                title: 'Безопасность',
                text: 'Токен некорректен. Авторизируйтесь. ',
                theme: 'dark',
                autohide: true,
                interval: 3000
            });
            Cookies.set({'token': '-'}, 1);
        }
    });
    
    document.getElementById('user-exit').onclick = () => {
        Cookies.set('token', '', Date.now() - 604800);
        window.location.href = "/";
    }
}