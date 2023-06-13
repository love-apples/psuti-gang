let menu = false;

if (typeof Cookies.get('token') != undefined & Cookies.get('token') != '') {
    document.getElementById('headerLink').onmouseover = (event) => {
        if (!menu) {
            document.getElementById('user-menu').style.display = 'flex';
            setTimeout(() => {
                document.getElementById('user-menu').style.opacity = '1';
                menu = true;
            }, 300);
        }
    }

    document.addEventListener('click', function(e) {
        if (menu) {
            if (e.target.id != 'user-menu') {
                document.getElementById('user-menu').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('user-menu').style.display = 'none';
                    menu = false;
                }, 300);
            }
        }
    });
}