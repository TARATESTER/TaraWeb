/*
 * Copyright (c) 2015 - 2019 - Tara Aung Co., Ltd - All Rights Reserved.
 * Tara Systems Project - Proprietary and confidential. www.taraaung.com
 */

/* global getUrlParam */
var loadingImg, infoMessage;

function init() {
    loadingImg = document.getElementById('loading_img');
    infoMessage = document.getElementById('message');
    var shopName = getUrlParam("shop_name");
    var systemType = getUrlParam("system_type");
    var hostName = getUrlParam("host_name");
    if (!shopName) {
        showErrorMessage("Sorry, shop name is required!");
        return;
    } else if (!systemType) {
        showErrorMessage("Sorry, system type is required!");
        return;
    } else if (!hostName) {
        showErrorMessage("Sorry, hostname is required!");
        return;
    }
    httpGetAsync("https://tarabartest.firebaseio.com/Shops/" + shopName + "/cloud_domain.json",
        function success(response) {
            var serverPublicUrl = response[systemType.toUpperCase()] + "/tarabar";
            httpGetAsync("https://tarabartest.firebaseio.com/Shops/" + shopName + "/cookies/" + shopName + "-" + hostName + ".json",
                function success(response) {
                    var params = "?host_name=" + hostName + "&sn=" + shopName;
                    params += "&icft=" + (response ? response.isClientFirstTime : "false");
                    window.location.replace(serverPublicUrl + params);
                }, function error(errorMsg) {
                    showErrorMessage(errorMsg);
                });
        }, function error(errorMsg) {
            showErrorMessage(errorMsg);
        });
}

function showErrorMessage(msg) {
    loadingImg.style.display = "none";
    infoMessage.style.color = "red";
    infoMessage.innerHTML = msg;
}

// this fetch params in the url dynamically;
getUrlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};

// javascript native network fetcher
function httpGetAsync(theUrl, callback, errorCallback) {
    fetch(theUrl).then(function (response) {
        return response.json();
    }).then(function (obj) {
        callback(obj);
    }).catch(function (msg) {
        errorCallback(msg);
    });
}
