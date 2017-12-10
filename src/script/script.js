'use strict';

var array = [];
var result_data;
var base_url;
var compared_data;
var compare_coin;

function processAllCrypto(){
    var allCrypto = document.querySelector("#currency");

    if (!allCrypto){
        console.error("Inputfield not found!");
    }else{
        console.info("Inputfield correct!");

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                var result = JSON.parse(this.responseText);
                var resultHolder = document.querySelector(".result");
                result_data = result.Data;
                base_url = result.BaseImageUrl;
                SetSideBar(result.Data);
            }
        };
        xhttp.open("GET", "https://min-api.cryptocompare.com/data/all/coinlist");
        xhttp.send();

        allCrypto.addEventListener("input", function(e){
            CheckNameInArray(e.target.value);
            // When user is typing.
        });
    }
}

document.addEventListener("DOMContentLoaded", function(){
    processAllCrypto();
    document.querySelector(".sidebar-list").addEventListener("click", function(e){
        var choose_curr = document.querySelector(".choose-curr");
        choose_curr.classList.add("hide");
        for (var key in result_data){
            if (result_data[key].FullName == e.target.innerHTML){
                console.log(result_data[key].FullName + " = " + e.target.innerHTML);
                document.querySelector(".result-title").innerHTML = result_data[key].FullName;

                var url_end = result_data[key].ImageUrl;
                var url = base_url + url_end;
                console.log(url);
                document.querySelector(".result-image").src = url;
                document.querySelector(".result-compare").innerHTML = "1 \"" + result_data[key].CoinName + "\" : ";
                compare_coin = result_data[key].Name;
                CompareCurrency();
            }
        }
        console.log(e.target.innerHTML);
    })
});

function CompareCurrency(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            compared_data = JSON.parse(this.responseText);
            var coin_container = document.querySelector(".coin-container");
            coin_container.classList.add("active");
            for (var key in compared_data){
                document.querySelector(".result-compared").innerHTML = "$ " + compared_data[key].USD + " USD";
                console.log("$ " + compared_data[key].USD + " USD");
            }
        }
    };
    var url_api = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + compare_coin + "&tsyms=USD,EUR";
    xhttp.open("GET", url_api);
    xhttp.send();
}

$(document).ready(function() {
    function toggleSidebar() {
        $(".button").toggleClass("active");
        $(".button").toggleClass("move-to-left");
        $(".sidebar").toggleClass("opened");

        $(".sidebar-item").toggleClass("active");
        $(".sidebar-search").toggleClass("active");
    }
    $(".button").on("click tap", function() {
        toggleSidebar();
    });
    $(document).keyup(function(e) {
        if (e.keyCode === 27) {
            toggleSidebar();
        }
    });    
});

function buildArrayFromResult(result){
    for (var key in result) {
        array.push(result[key].FullName);
    }
}

function buildPopularArray(result){
    var popular_array = [];
    for (var key in result){
        if (result[key].SortOrder <= 130){
            popular_array.push(result[key].FullName);
        }
    }
    console.log(popular_array);
    return popular_array;
}

function CheckNameInArray(input){
    var filter, ul, li, a, i, b, filter_array = [];
    filter = input.toUpperCase();
    console.log(filter);
    ul = document.querySelector(".sidebar-list");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        console.log(a.innerHTML.toUpperCase());
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function MakeListItems(_array){
    for (var i = 0; i < _array.length; i++) {
        
            var element = _array[i];
            
            var list_item = document.createElement("li");
            list_item.classList.add("sidebar-item");
        
            var list_item_content = document.createElement("a");
            list_item_content.classList.add("sidebar-anchor");
            list_item_content.innerHTML = element;
        
            list_item.appendChild(list_item_content);
        
            var list = document.querySelector("ul.sidebar-list");
            list.appendChild(list_item);
        }
}

function SetSideBar(result){
    buildArrayFromResult(result);
    var popular_array = buildPopularArray(result);
    MakeListItems(popular_array);
}

var switch_element = document.querySelector(".slider");
switch_element.addEventListener("click", function() {

    if (switch_element.classList.contains("class_clicked")) {
        switch_element.classList.remove("class_clicked");
        for (var key in compared_data){
            document.querySelector(".result-compared").innerHTML = "$ " + compared_data[key].USD + " USD";
        }
    } else {
        switch_element.classList.add("class_clicked");
        for (var key in compared_data){
            document.querySelector(".result-compared").innerHTML = "€ " + compared_data[key].EUR;
        }
    }
});

var refresh = document.querySelector(".fa.fa-refresh");
refresh.addEventListener("mouseover", function(){
    refresh.classList.add("fa-spin");
});
refresh.addEventListener("mouseout", function(){
    setTimeout(function(){
        refresh.classList.remove("fa-spin");
    }, 500);
});
refresh.addEventListener("click", function(){
    CompareCurrency();
    setTimeout(function(){
        refresh.classList.remove("fa-spin");
    }, 500);
});