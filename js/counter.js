var gather = document.getElementsByClassName('post_counter');
var len = gather.length;

var base_url = "https://api.soptq.me/counter/getAllViews.php";
var update_base_url = "https://api.soptq.me/counter/updateViews.php";
var url;

(function () {
    if (sessionStorage.getItem('posts_views') == null) {
        const xhr = new XMLHttpRequest();
        xhr.open('get', base_url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    sessionStorage.setItem('posts_views', xhr.responseText);
                    let json = JSON.parse(xhr.responseText);
                    if (json['code'] === 200){
                        for (let i = 0; i < len; ++i){
                            let post_title = gather[i].getAttribute('data-title');
                            gather[i].innerText = json[post_title];
                        }
                    }
                }
            }
        };
        xhr.send();
    } else {
        let json = JSON.parse(sessionStorage.getItem('posts_views'));
        for (let i = 0; i < len; ++i){
            let post_title = gather[i].getAttribute('data-title');
            gather[i].innerText = json[post_title];
        }
    }
})();

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)===0) return c.substring(name.length,c.length);
    }
    return undefined;
}

function updateViews(post_title) {
    if (getCookie(post_title) === undefined){
        let expireTime = new Date(new Date().getTime() + 5 * 60 * 1000).toUTCString();
        document.cookie= post_title + "=1;expires=" + expireTime;
        url = update_base_url + '?t=' + post_title + '&id=0';
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
    }
}
