'use strict';

var array = [];
var result_data;

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
                SetSideBar(result.Data);
            }
        };
        xhttp.open("GET", "https://min-api.cryptocompare.com/data/all/coinlist");
        xhttp.send();

        allCrypto.addEventListener("input", function(e){
            console.info(e.target.value);
            CheckNameInArray(e.target.value);
            // When user is typing.
        });
    }
}

document.addEventListener("DOMContentLoaded", function(){
    processAllCrypto();
    document.querySelector(".sidebar-list").addEventListener("click", function(e){
        for (var key in result_data){
            if (result_data[key].FullName == e.target.innerHTML){
                console.log(result_data[key].FullName + " = " + e.target.innerHTML);
                document.querySelector(".result-title").innerHTML = result_data[key].Id;
            }
        }
        console.log(e.target.innerHTML);
        e.target.style.color = "#F00";
    })
});

$(document).ready(function() {
    function toggleSidebar() {
        $(".button").toggleClass("active");
        $(".button").toggleClass("move-to-left");
        $(".sidebar").toggleClass("opened");

        $(".sidebar-item").toggleClass("active");
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
        if (result[key].SortOrder <= 10){
            popular_array.push(result[key].FullName);
        }
    }
    console.log(popular_array);
    return popular_array;
}

function CheckNameInArray(input){
    var filter, ul, li, a, i;
    filter = input.toUpperCase();
    console.log(filter);
    ul = document.querySelector(".sidebar-list");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
function SetSideBar(result){
    buildArrayFromResult(result);
    var popular_array = buildPopularArray(result);
    
    for (var i = 0; i < popular_array.length; i++) {
        
            var element = popular_array[i];
            
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
