"use strict";

function toggle_like(rows_id, type) {
    console.log(rows_id, type)
    let $a_like = $(`#${rows_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}

function All() {
    listing()
}

function theater() {
    getctype('theater')
}

function movies() {
    getctype('movies')
}

function consert() {
    getctype('consert')
}


function login() {
    let val = $('#loginBtn').text();
    if (val === '로그인') {
        window.location.href = '/login';
    }
    if (val === '로그아웃') {
        let cookies = $.cookie();
        for (var cookie in cookies) {
            $.removeCookie(cookie);
        }
        window.location.reload();
    }
}

function sign_up() {
    window.location.href = '/signup';

}

function checkStatus() {
    let status = $.cookie('mytoken');
    if (status) {
        $('#loginBtn').text('로그아웃');

        $('#signUpBtn').css('display', 'none');
    } else {
        $('#loginBtn').text('로그인');
    }
}

$(document).ready(function () {
    listing();
    checkStatus();
}, {once: true});

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}

function getctype(str) {
    $('#card-box').empty()
    $.ajax({
        type: "GET",
        url: `/culture/ctype?str=${str}`,
        data: {},
        success: function (response) {
            let rows = response['posting']
            console.log(rows)
            for (let i = 0; i < rows.length; i++) {
                let num = rows[i]['num'];
                let title = rows[i]['title']
                let url = rows[i]['url']
                let star = rows[i]['star']
                let comment = rows[i]['comment']

                let star_image = '⭐'.repeat(star)


                let temp_html = `<div class="col card-box">
                                 <div class="card h-100">
                                     <img src="${url}" class="card-img-top">
                                     <div class="card-body">
                                         <h5 class="card-title">${title}</h5>
                                         <p>${star_image}</p>
                                         <p class="mycomment">${comment}</p>
                                     </div>
                                 </div>
                                 <div class="option">
                                     <a href="#" onclick="updateCard(${num});"><span class="las la-edit"></span></a>
                                     <a href="#" onclick="dropList(${num});"><span class="las la-trash"></span></a>
                                 </div>
                            </div>`;

                $('#card-box').append(temp_html);
            }
        }
    })


}

function get_posts() {
    // $("#card-box").empty()
    $.ajax({
        type: "GET",
        url: "/get_posts",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]

                    let class_heart = post['heart_by_me'] ? "fa-heart": "fa-heart-o"
                    let count_heart = post['count_heart']

                    let html_temp = `<div class="box" id="${post["_id"]}">
                                        <article class="media">                                 
                                            <div class="media-content">
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                            <span class="icon is-small"><i class="fa ${class_heart}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(count_heart)}</span>
                                                        </a>
                                                    </div>
                                                </nav>
                                            </div>
                                        </article>
                                    </div>`
                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}

$(document).ready(function () {
    get_posts()
})

function open_box() {
    if ($.cookie('mytoken')) {
        /* NULL CHECK */
        if (url == '') {
            alert("URL IS NULL");
            return;
        }
        if (comment == '') {
            alert("comment IS NULL");
            return;
        }
        if (star == '-- 선택하기 --') {
            alert("SELECT STAR");
            return;
        }

    } else {
        alert('로그인해주세요')
        return;
    }

    $('#post-box').show()


}

function close_box() {
    $('#post-box').hide()
}

function deleat() {
    $('')
}


function listing() {
    $.ajax({
        type: 'GET',
        url: '/culture',
        data: {},
        success: function (response) {
            $('#card-box').empty();
            let rows = response['posting']
            console.log(rows);
            for (let i = 0; i < rows.length; i++) {
                let num = rows[i]['num'];
                let title = rows[i]['title']
                let url = rows[i]['url']
                let star = rows[i]['star']
                let comment = rows[i]['comment']

                let class_heart = rows['heart_by_me'] ? "fa-heart": "fa-heart-o"
                let count_heart = rows['count_heart']

                let star_image = '⭐'.repeat(star);

                let temp_html = `<div class="col card-box">
                                 <div class="card h-100">
                                     <img src="${url}" class="card-img-top">
                                     <div class="card-body">
                                         <h5 class="card-title">${title}</h5>
                                         <p>${star_image}</p>
                                         <p class="mycomment">${comment}</p>
                                     </div>
                                     <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${rows['_id']}', 'heart')">
                                                            <span class="icon is-small"><i class="fa ${class_heart}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(count_heart)}</span>
                                                        </a>
                                                    </div>
                                    </nav>
                                 </div>
                                 <div class="option">
                                     <a href="#" onclick="updateCard(${num});"><span class="las la-edit"></span></a>
                                     <a href="#" onclick="dropList(${num});"><span class="las la-trash"></span></a>
                                 </div>
                   
                            </div>`;

                $('#card-box').append(temp_html);
            }
        }
    })
}

function posting() {
    let url = $('#url').val()
    let title = $('#title').val()
    let star = $('#star').val()
    let comment = $('#comment').val()
    let ctype = $('#ctype').val()


    $.ajax({
        type: 'POST',
        url: '/culture',
        data: {url_give: url, title_give: title, star_give: star, comment_give: comment, ctype_give: ctype},
        success: function (response) {
            alert(response['msg'])
            window.location.reload();
        }
    });

}

// function open_box() {
//     $('#post-box').show()
// }
//
// function close_box() {
//     $('#post-box').hide()
// }

function dropList(n) {
    $.ajax({
        type: 'DELETE',
        url: `/culture`,
        data: {num_give: n},
        success: function (response) {
            alert(response['msg'])
            window.location.reload();
        }
    });
}

function updateCard(n) {
    window.open(`http://localhost:5000/culture/update?num=${n}`, 'new', 'scrollbars=yes,resizable=no width=640 height=560, left=0,top=0\');return false')
}

