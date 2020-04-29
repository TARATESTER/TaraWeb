/*
 * Copyright (c) 2015 - 2020 - Tara Aung Co., Ltd - All Rights Reserved.
 * Tara Systems Project - Proprietary and confidential. www.taraaung.com
 */

/* global getUrlParam:writable */
var loadingImg, infoMessage;

// eslint-disable-next-line no-unused-vars
function init() {
    loadingImg = document.getElementById("loading_img");
    infoMessage = document.getElementById("message");
    var shopName = getUrlParam("shop_name");
    var systemType = getUrlParam("system_type");
    var hostName = getUrlParam("host_name");
    if (!shopName) {
        showErrorMessage(
            "Check Correct \"ShopName\"</br></br>" +
            "\"ShopName\" မှန်\\မမှန် စစ်ပေးပါ");
        return;
    } else if (!systemType) {
        showErrorMessage(
            "Check Correct \"SystemType\"</br></br>" +
            "\"SystemType\" မှန်\\မမှန် စစ်ပေးပါ");
        return;
    } else if (!hostName) {
        showErrorMessage(
            "Check Correct \"HostName\"</br></br>" +
            "\"HostName\" မှန်\\မမှန် စစ်ပေးပါ");
        return;
    }
    httpGetAsync("https://tarabartest.firebaseio.com/Shops/" + shopName + "/cloud_domain.json",
        function success(response) {
            var serverPublicUrl = response[systemType.toUpperCase()] + "/tarabar";
            httpGetAsync("https://tarabartest.firebaseio.com/Shops/" + shopName + "/cookies/" + shopName + "-" + hostName + ".json",
                function success(response) {
                    var params = "?host_name=" + hostName + "&sn=" + shopName;
                    params += "&icft=" + (response ? response.isClientFirstTime : "true");
                    httpGetAsync(serverPublicUrl + "/client_info",
                        function success(response) {
                            window.location.replace(serverPublicUrl + params);
                        }, function error(errorMsg) {
                            showErrorMessageForHttpGet(shopName, hostName, systemType);
                        });
                }, function error(errorMsg) {
                    showErrorMessageForHttpGet(shopName, hostName, systemType);
                });
        }, function error(errorMsg) {
            showErrorMessageForHttpGet(shopName, hostName, systemType);
        });
}

function showErrorMessage(msg) {
    loadingImg.style.display = "none";
    var backBtn = document.getElementById("back_btn");
    if (backBtn) {
        backBtn.style.display = "block";
    }
    infoMessage.style.color = "red";
    infoMessage.style["font-size"] = "large";
    infoMessage.style["font-family"] = "cursive";
    infoMessage.style["line-height"] = "35px";
    infoMessage.innerHTML = msg;
}

// this fetch params in the url dynamically;
getUrlParam = function (name) {
    // eslint-disable-next-line no-useless-escape
    var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);
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

function showErrorMessageForHttpGet(shopName, hostName, systemType) {
    showErrorMessage("ShopName = " + shopName + "</br>HostName = " + hostName + "</br>Systemtype = " + systemType + "</br>" +
        "Please confirm above information is correct!</br></br>" +
        "1. Please check internet connection is ok at both Server and client machine.</br>" +
        "2. Check that Cloud Access status is online at Server Logs.</br>" +
        "3. At server machine, Click on \"Restart Cloud Access\" (Home Screen -> About -> Server Logs).</br>" +
        "4. Make sure Server and Client date and time are correct and the same.</br></br>" +
        "1. Cloud Services မရတော့တဲ့အခါ Server နဲ့ Client စက်တွေမှာ Internet ရှိမရှိစစ်ပေးပါ။</br>" +
        "2. Server စက်ရဲ့ Server Log မှာ online ဖြစ်ပီးစိမ်းနေလား စစ်ပေးပါ။</br>" +
        "3. Server စက်ရဲ့ about icon ထဲက server log တွင် \"Restart Cloud Access\" ကို နှိပ်၍ Cloud Service ကို restart ချပေးပါ။</br>" +
        "4. Server နှင့် Client စက်များ၏ အချိန် တူညီ‌ကြောင်း ကိုစစ်ပေးပါ။</br>");
}
