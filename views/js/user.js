if (typeof Cookies.get('token') != undefined) {
    $.ajax({
        url: "api/getUserByToken",
        method: "POST",
        data: {"token": Cookies.get('token')},
        success: function(data) {
            console.log(data)
            document.getElementById('headerLink').innerHTML = data.result.username
            document.getElementById('headerLink').href = 'user/' + data.result.id
        },
        error: (data) => {
            new Toast({
                title: 'Безопасность',
                text: 'Токен некорректен. Авторизируйтесь.',
                theme: 'dark',
                autohide: true,
                interval: 3000
            });
        }
    });
}