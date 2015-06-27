// ==UserScript==
// @name           stackoverflow-hot-sites
// @namespace      stackoverflow
// @description    Configure sites to show in Hot Network Questions section
// @version        0.1
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

addGlobalStyle('.delete-site {margin: 2px 6px 0px 0px; }');
addGlobalStyle('.inline-question {display: inline !important; }');

$(".favicon", '#hot-network-questions').next().addClass('inline-question');
$(".favicon" ,'#hot-network-questions').before('<span title="Hide questions from this site" class="delete-tag delete-site"></span>');

$('.delete-site').click(function(data) {
    faviconElement = $(this).next();
    faviconClass = faviconElement.attr('class').split(' ')[1];

    splitClass = faviconClass.split('-');

    if (splitClass.length === 2) {
        if (confirm('Hide questions from '+faviconElement.attr('title') +' ?')) {
            siteName = splitClass[1];
            $('.' + faviconClass, '#hot-network-questions').parent().hide();   
        }
    }
});