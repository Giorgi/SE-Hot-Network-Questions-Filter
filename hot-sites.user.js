// ==UserScript==
// @name           stackoverflow-hot-sites
// @namespace      stackoverflow
// @description    Configure sites to show in Hot Network Questions section
// @version        0.1
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @match          *://stackoverflow.com/*
// @match          *://serverfault.com/*
// @match          *://superuser.com/*
// @match          *://meta.stackoverflow.com/*
// @match          *://meta.serverfault.com/*
// @match          *://meta.superuser.com/*
// @match          *://stackapps.com/*
// @match          *://*.stackexchange.com/*
// @match          *://askubuntu.com/*
// @match          *://meta.askubuntu.com/*
// @match          *://answers.onstartups.com/*
// @match          *://meta.answers.onstartups.com/*
// @match          *://mathoverflow.net/*
// @match          *://area51.stackexchange.com/proposals/*
// @author         Giorgi Dalakishvili
// ==/UserScript==

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

function hideSite(item) {
    $('.' + item.faviconClass, '#hot-network-questions').parent().hide();
}

function unhideSite(faviconClass) {
    $('.' + faviconClass, '#hot-network-questions').parent().show();
}

addGlobalStyle('.delete-site {margin: 2px 6px 0px 0px; }');
addGlobalStyle('.unhide-site {margin: 0px 6px 0px 0px; }');
addGlobalStyle('.inline-question {display: inline !important; }');
addGlobalStyle('.hidden-site {margin-top: 0px !important; }');


$(".favicon", '#hot-network-questions').next().addClass('inline-question');
$(".favicon", '#hot-network-questions').each(function() {
    $(this).before('<span title="Hide questions from ' + $(this).attr('title') +'" class="delete-tag delete-site"></span>');
});

window.addEventListener('load', function() {
    var hiddenSites = getHiddenSites();

    var ul = $('<ul></ul>');
    hiddenSites.forEach(function(item) {
        hideSite(item);

        ul.append('<li><span title="Unhide questions from ' + item.title +'" class="delete-tag unhide-site"></span><div class="favicon ' + item.faviconClass + ' hidden-site"></div>' + item.title.replace('Stack Exchange', '') +'</li>')
    });

    $('#hot-network-questions').append('<h4 style="margin-top: 10px;">Sites hidden by user</h4>', ul);
    addEventListeners(ul);
}, false);


$('.delete-site').click(function() {
    var faviconElement = $(this).next();
    var faviconClass = faviconElement.attr('class').split(' ')[1];

    var splitClass = faviconClass.split('-');

    if (splitClass.length === 2) {
        var newItem = {
            faviconClass: faviconClass,
            title: faviconElement.attr('title')
        };
        hideSite(newItem);
        
        var hiddenSites = getHiddenSites();
        hiddenSites.push(newItem);
        
        GM_setValue('hiddenHotSites', JSON.stringify(hiddenSites));

        $("ul", '#hot-network-questions').slice(1).append('<li><span title="Unhide questions from ' + newItem.title +'" class="delete-tag unhide-site"></span><div class="favicon ' + newItem.faviconClass + ' hidden-site"></div>' + newItem.title.replace('Stack Exchange', '') +'</li>')
    }
});

function addEventListeners(element) {
    element.on('click', '.unhide-site', function() {
        var faviconElement = $(this).next();
        var faviconClass = faviconElement.attr('class').split(' ')[1];

        var splitClass = faviconClass.split('-');
        if (splitClass.length === 2) {
            $(this).parent().remove();
            unhideSite(faviconClass);

            var hiddenSites = getHiddenSites();

            hiddenSites = $.grep(hiddenSites, function(item) {
                return  item.faviconClass != faviconClass;
            });

            GM_setValue('hiddenHotSites', JSON.stringify(hiddenSites));
        }
    });   
}

function getHiddenSites() {
    var value = GM_getValue("hiddenHotSites");
    
    return (value && JSON.parse(value)) || [];
}