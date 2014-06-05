var xRatio = 1100/1387;
var page = 3;
var pageMax = 324;
var single = false;
var zoom = false;

function resize() {
    if (window.innerWidth < 500) {
        single = true;
        $("#page-2").hide();

    } else {
        single = false;
        $("#page-2").show();
    }

    var h = window.innerHeight - 20;
    var w = h * xRatio;

    $(".page").height(h).width(w);
    if (single) {
        if (w + 10 > window.innerWidth) {
            w = window.innerWidth - 15;
            h = w / xRatio;

            $(".page").height(h).width(w);
        }

        $(".book").width(w + 5)
    } else {
        $(".book").width(w * 2 + 5);
    }

}

setInterval(function() {
    zoom = (document.documentElement.clientWidth / window.innerWidth < 1)

    if (zoom) {
        $(".book").swipe("disable");
        $(".navigator").hide();
        $(".scroll").hide();

    } else if (single) {
        $(".book").swipe("enable");
        $(".navigator").show();

    } else {
        $(".scroll").show();
    }

}, 1000)

var firstImage = new Image();
var secondImage = new Image();

function updatePages() {
    window.location.hash = "#" + (page - 2);
    $("#page-1").show();

    if (!single)
        $("#page-2").show();

    $(".page .loading").fadeIn("fast");


    firstImage.src = "https://matt-walton.net/geog/pages/" + page + "v.png";

    firstImage.onload = function() {
        $("#page-1 .loading").fadeOut("fast");
        $("#page-1").css("background-image", "url(" + firstImage.src + ")");
    }

    secondImage.src = "https://matt-walton.net/geog/pages/" + (page+1) + "v.png";

    secondImage.onload = function() {
        $("#page-2 .loading").fadeOut("fast");
        $("#page-2").css("background-image", "url(" + secondImage.src + ")");
    }

    secondImage.onerror = function() {
        $("#page-2").hide();
    }

    $("#page-max").html(pageMax);
    $("#page-number").html(page-2);
    $(".navigator").css("margin-left", "-" + (($(".navigator").width() + 40)/2) + "px");
}

function nextPage() {
    page = page + (single && 1 || 2);
    if (page > pageMax)
        page = 1;

    updatePages();
}

function prevPage() {
    page = page - (single && 1 || 2);
    if (page < 3)
        page = pageMax-1;

    updatePages();
}

function setPage(p) {
    p = p + 2;
    page = Math.min(p, pageMax);
    updatePages();
}

$(window).resize(resize);

$(document).ready(function() {
    if (window.location.hash && parseInt(window.location.hash.substring(1)))
        page = parseInt(window.location.hash.substring(1)) + 2;

    resize();
    updatePages();

    $("#scroll-left").click(prevPage);
    $("#scroll-right").click(nextPage);


    $(".book").swipe({
        swipeLeft: function() {
            if (single) {
                nextPage();
            }
        },

        swipeRight: function() {
            if (single) {
                prevPage();
            }
        },

        fingers: 1
    });

    $(".navigator").click(function() {
        $("#page-number").focus();

    }).keypress(function(e) {
        if (e.keyCode == 13) {
            setPage(parseInt($("#page-number").html()));
            $(window).focus();
            return e.preventDefault();
        }

        if (isNaN(parseInt(String.fromCharCode(e.keyCode)))) {
            e.preventDefault();
        }

    });
});