var menuState = "<init>";
var currentBranche = -1;
var currentTimeout = null;

function onBrancheHover() {

    if (currentTimeout)
        clearTimeout(currentTimeout);

    var e = window.event;
    if (e) {
        var sender = e.srcElement || e.target;
        setButtonOpacity(parseInt(sender.id));
    }
}

function setButtonOpacity(id) {

    var jumboTron = document.getElementsByClassName("jumbotron");
    if (jumboTron.length > 0) {
        var btn = jumboTron[0].getElementsByClassName("sc-img-branche");
        for (var i = 0, j = 0; i < btn.length; i++, j++) {

            if (btn[i].id == id) {
                btn[i].style.opacity = 1.0;
                btn[i].parentElement.style.color = "var( --sc-white-100)";
            } else {
                btn[i].style.opacity = 0.75;
                btn[i].parentElement.style.color = "transparent";
            }
        }
    }
}

function onBrancheMouseOut() {

    if (currentTimeout)
        clearTimeout(currentTimeout);

    currentTimeout = setTimeout(onBrancheRestore, 500);

}
function onBrancheRestore() {

    showBranche(currentBranche);
    return false;
}

function onBrancheClick() {

    var e = window.event;
    if (e) {
        var sender = e.srcElement || e.target;
        i = parseInt(sender.id);
        showBranche(i);
    }
    return false;
}

function showBranche(id) {

    setButtonOpacity(id);
    if (id === currentBranche)
        return false; /* nothing to do */

    currentBranche = id;

    var urlString = scHeaderItems[id]["background"];
    if (window.innerWidth < 768) {
        urlString = scHeaderItems[id]["background-responsive"];
    }
    var jumboTron = document.getElementsByClassName("jumbotron");
    if (jumboTron.length > 0) {
        jumboTron[0].style.backgroundImage = "url( '" + urlString + "')";
    }
    var claim = document.getElementById("sc-header-claim");
    if (claim) {
        claim.innerHTML = scHeaderItems[id]["claim"];
    }
    var text = document.getElementById("sc-header-text");
    if (text) {
        text.innerHTML = scHeaderItems[id]["text"];
    }
    var link = document.getElementsByClassName("sc-header-link-details");
    if (link.length > 0) {
        link[0].href = scHeaderItems[id]["targetPage"];
    }
    return false;
};

function timelinePictures() {

    timeLines = document.getElementsByClassName("tx_timeline");
    for (var i = 0; i < timeLines.length; i++) {

        /* insert pictures into the timeline */
        var headers = timeLines[i].getElementsByClassName("timeline-heading");
        for (var j = 0; j < headers.length; j++) {
            var h4 = headers[j].getElementsByTagName("h4");
            if (h4.length > 0) {
                var year = h4[0].innerHTML.trim();
                h4[0].innerHTML = year.match(/\d+/g)
                    + '<img class="img-fluid timeline-image" src="/fileadmin/images/Historie/'
                    + year
                    + '.jpg"></img>';

            }
        }
    }
}

/*  Find first ancestor of el with tagName
     or undefined if not found */
function upTo(el, tagName) {
    tagName = tagName.toLowerCase();

    while (el && el.parentNode) {
        el = el.parentNode;
        if (el.tagName && el.tagName.toLowerCase() == tagName) {
            return el;
        }
    }
    return null;
}
const idTel = "sc-id-tel"
const idUlTel = "sc-id-ul-tel"
const idDivTel = "sc-id-div-tel"
const idUlICons = "sc-id-ul-icons"

function prepareMenu() {
    /*  change the main menu to look better
        After this there are 4 ul sections. The spacing is done
        as follows (we want the telephone number to be centered)
        |mr-auto|ml-auto mr-auto|ml-auto|<none>|
    */
    var menu = document.getElementById("navbarToggler");
    if (!menu)
        return false;

    /* insert a new div which holds the telephone after collapse */
    var menuDiv;
    if (menu.tagName.toLowerCase() == "div")
        menuDiv = menu;
    else
        menuDiv = upTo(menu, "div");

    if (menuDiv) {
        var newDiv = document.createElement("div");
        if (newDiv) {
            newDiv.id = idDivTel;
            newDiv.classList.add("navbar-header");
            /* set the div before the toggle button */
            var button = menuDiv.parentNode.getElementsByClassName("navbar-toggler");
            if (button.length > 0)
                menuDiv.parentNode.insertBefore(newDiv, button[0]);
            else
                menuDiv.parentNode.insertBefore(newDiv, menuDiv);
            newDiv.style.display = "none";
        }
    }

    /* loop over all links to find the telephone */
    var links = menu.getElementsByClassName("nav-link");
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.search("tel:") >= 0) {

            links[i].classList.add("sc-tel-number");
            liTel = upTo(links[i], "li");
            liTel.id = idTel;

            var ul = upTo(liTel, "ul");
            var div = upTo(ul, "div")
            if (ul && div) {
                var ulIcons = document.createElement("ul");
                ulIcons.classList.add("ml-auto", "navbar-nav");
                ulIcons.id = idUlICons;
                div.insertBefore(ulIcons, ul.nextSibling);

                var ulTel = document.createElement("ul");
                ulTel.classList.add("ml-auto", "mr-auto", "navbar-nav");
                ulTel.id = idUlTel;
                ulTel.appendChild(liTel);

                div.insertBefore(ulTel, ul.nextSibling);
            }
            /* append the svg's to the third section */
            for (var j = links.length - 1; j >= 0; j--) {
                var li = upTo(links[j], "li");
                if (ul.isSameNode(upTo(li, "ul"))) {
                    if (li.classList.contains("dropdown"))
                        continue;

                    ulIcons.appendChild(li);
                }
            }
            break;
        }
    }
    /* adjust the spacing between sections */
    var sections = menu.getElementsByClassName("navbar-nav");
    if (sections.length >= 4) {
        sections[0].classList.remove("ml-auto");
        sections[0].classList.add("mr-auto");

        sections[1].classList.add("ml-auto", "mr-auto");

        sections[2].classList.remove("mr-auto");
        sections[2].classList.add("ml-auto");

        sections[3].classList.remove("ml-auto", "mr-auto");
    }
    /* -- duplicate the icons to the section shown in navbar on collapse */
    newDiv.appendChild(ulTel.cloneNode(true));
    newDiv.appendChild(ulIcons.cloneNode(true));

    /* replace the toggler icon for animations */
    var icons = document.getElementsByClassName("navbar-toggler-icon");
    if (icons.length > 0) {
        //var d = document.createElement("div");
        //d.classList.add( "icon-bar");
        for (var i = 1; i <= 3; i++) {
            var s = document.createElement("span");
            s.classList.add("icon-bar", "sc-icon-bar-" + i.toString());
            icons[0].parentNode.appendChild(s);
        }
    }
    /* hide shop link in menu in desktop version */
    var shopLink = document.getElementsByClassName("sc-icon-cart");
    for (var i = 0; i < shopLink.length; i++) {
        var li = upTo(shopLink[i], "li");
        if (li)
            li.classList.add("sc-shop-link");
    }
}

function loadProductTeaser(productId, productDiv) {

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {

        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {

                // copy the whole result into the target <div>
                productDiv.innerHTML = xmlhttp.response;

            } else {
                productDiv.innerHTML =
                    '<div style="color: red; font-weight: 700;">'
                    + 'Could not load article ['
                    + productId
                    + ']. Error code: '
                    + xmlhttp.status
                    + '</div>';
            }
        }
    };
    xmlhttp.open("GET", "/shop/teaser/" + productId, true);
    xmlhttp.send();
}

function getProductTeasers() {

    // alert("start");
    var teasers = document.getElementsByClassName("sc-product-teaser");
    for (var i = 0; i < teasers.length; i++) {

        var teaser = teasers[i];
        var productId = teaser.id;

        loadProductTeaser(productId, teaser);
    }
    // alert("fertig");
}

function prepareAppointments() {

    headersNoContext = document.getElementsByClassName("sc-application-nocontext");
    headersContext = document.getElementsByClassName("sc-application-context");
    inputs = document.getElementsByClassName("sc-form-context");
    if (headersNoContext.length > 0 || headersContext.length > 0 || inputs.length > 0) {
        /* -- get referring page and extract the path name -- */
        path = document.referrer.replace(/^[^:]+:\/\/[^/]+/, '').replace(/#.*/, '').replace(/\?.*/, '');
        if (path == document.URL.replace(/^[^:]+:\/\/[^/]+/, '').replace(/#.*/, '').replace(/\?.*/, '')) {
            /* -- same page => nothing to do -- */
            return;
        }
        context = window.sessionStorage.getItem(path + ".context");

        if (context && context.length > 0) {
            for (i = 0; i < headersNoContext.length; i++) {
                headersNoContext[i].style.display = "none";
            }
            for (i = 0; i < headersContext.length; i++) {
                subHeads = headersContext[i].getElementsByTagName("h3");
                if (subHeads && subHeads.length > 0)
                    subHeads[0].innerText = context;
            }
            for (i = 0; i < inputs.length; i++) {
                inputs[i].value = context;
                inputs[i].parentNode.parentNode.style.display = "none";
            }
        }
        else {
            for (i = 0; i < headersContext.length; i++) {
                headersContext[i].style.display = "none";
            }
            for (i = 0; i < inputs.length; i++) {
                inputs[i].value = 'Initiativbewerbung';
                inputs[i].parentNode.parentNode.style.display = "none";
            }
        }
    }
}
function getBrowserLang() {
    if (navigator.languages != undefined)
        lang = navigator.languages[0];
    else
        lang = navigator.language;

    return lang == null ? "" : lang.substr(0, 2);
}

function defaultLang() {
    return "en";
}

function prepareMainPage() {

    const langChecked = "alreadyCheckedLanguage";

    // console.log("prepareMainPage");

    if (!window.sessionStorage.getItem(langChecked)) {

        window.sessionStorage.setItem(langChecked, true);

        /* check language */
        lang = getBrowserLang();
        if (!langArray.includes(lang))
            lang = defaultLang();

        if ((window.location.pathname == "/") && (lang != defaultLang())) {
            window.location.replace("/" + lang + "/");
                return false;
        }
    }
    var jumboTron = document.getElementsByClassName("jumbotron");
    if (jumboTron.length > 0) {

        var btn = jumboTron[0].getElementsByClassName("sc-img-branche");
        for (var i = 0, j = 0; i < btn.length; i++, j++) {
            if (j < scHeaderItems.length) {
                btn[i].src = scHeaderItems[j]["icon"];
                btn[i].alt = scHeaderItems[j]["alt"];

                btn[i].onclick = onBrancheClick;
                btn[i].onmouseover = onBrancheHover;
                btn[i].onmouseout = onBrancheMouseOut;

                btn[i].id = j.toString();
                var caption = btn[i].parentElement.getElementsByClassName("image-caption");
                if (caption.length > 0) {
                    caption[0].innerHTML = scHeaderItems[j]["label"];
                }
            }
            else {
                btn[i].parentElement.style.display = "none";
            }
        }
    }
    var elem = jumboTron[0].getElementsByClassName("sc-header-link-search");
    for (var i = 0; i < elem.length; i++) {
        elem[i].href = theSearchLink;
        elem[i].innerHTML = theSearchButton;
    }
    elem = jumboTron[0].getElementsByClassName("sc-header-link-details");
    for (i = 0; i < elem.length; i++) {
        elem[i].innerHTML = theButtonText;
    }
    elem = jumboTron[0].getElementsByClassName("sc-industries-text");
    for (i = 0; i < elem.length; i++) {
        elem[i].innerHTML = theTitle;
    }
    /* -- start with a random item */
    var nextBranche = parseInt(Math.random() * scHeaderItems.length, 10);
    showBranche(nextBranche);
    return true;
}

function callUnsubscribe( uri)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        /* nothing to do here */;
    }
    xmlhttp.open( "GET", uri, true);
    xmlhttp.send();
}

function prepareUnsubscribe() {

    let buttons = document.getElementsByClassName("sc-button-round-white");
    let search = window.location.search;

    for (var i = 0; i < buttons.length; i++) {
        let uri = "/shop/unsubscribe" + search;
        buttons[i].setAttribute("onclick", "callUnsubscribe('" + uri + "');");
    }
    return true;
}

function savePageContext() {

    pageContext = document.getElementsByTagName("sc-page-context");
    if (pageContext.length > 0) {
        pc = pageContext[0];

        path = window.location.pathname;
        id = pc.getAttribute("id");
        context = pc.getAttribute("context");

        window.sessionStorage.setItem(path + ".id", id);
        window.sessionStorage.setItem(path + ".context", context);
    }
}
function preparePDFLinks() {

    /* add a target="_blank" fo rall linked pdf files */
    var links = document.querySelectorAll('a[href*=".pdf"], a[href*=".PDF"], a[href*="/pdf/"]')
    for (i = 0; i < links.length; i++) {
        links[i].setAttribute('target', '_blank');
        links[i].setAttribute('download', '');
    }
}
/*
function prepareIndexing() {

    var content = document.getElementById("page-content");
    if (content) {
        content.innerHTML = "<!--TYPO3SEARCH_start-->" + content.innerHTML + "<!--TYPO3SEARCH_end-->";
    }
}

function respondToVisibility(element, callback) {

    var options = {
        root: document.documentElement
    }

    var observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            callback(entry.intersectionRatio > 0);
        });
    }, options);

    observer.observe(element);
}
*/
function setInputFocus(isVisible) {

    if (!isVisible)
        return;

    var e = window.event;
    if (e) {
        var sender = e.srcElement || e.target;
        if (sender) {
            input = sender.getElementsByTagName("input");
            if (input.length > 0)
                input[0].setFocus();
        }
    }
}
function toggleSearchBox() {

    let box = document.getElementById("searchbox");
    if (box) {
        if (window.getComputedStyle(box).display === "none") {
            box.setAttribute("style", "display: block;");
        }
        else
            box.style.display = "none";
    }
}
const langArray = ['en', 'de', 'es', 'fr', 'it', 'ru'];

function addSlash(uri) {
    if (uri.substring(uri.length - 1, uri.length) == '/') {
        return uri;
    }
    return uri + '/';
}

function stripSlash(uri) {
    if (uri.substring(uri.length - 1, uri.length) == '/') {
        return uri.substring(0, uri.length - 1);
    }
    return uri;
}
function adjustLang(snippet) {

    /* adjust href in the language menu for the shop links ("shop" before lang) */
    let path = window.location.pathname;
    let search = window.location.search;
    path = addSlash(path);
    snippet = addSlash(snippet);

    // console.log('adjustLang: from [' + path + ']');

    /* -- does <path> contain the snippet? -- */
    if (path.indexOf(snippet) >= 0) {

        let menu = document.getElementById("language_menu");
        if (menu != null) {
            /* -- remove any language marker -- */
            for (let lang of langArray) {
                let offs = path.indexOf('/' + lang.substring(0, 2) + '/');
                if (offs >= 0)
                    path = path.substr(0, offs) + path.substr(offs + 3);
            }
            for (i = 0; i < langArray.length; i++) {

                let uri = menu.querySelector('[hreflang="' + langArray[i] + '"]');
                let langPath = path;

                if (uri) {
                    if (i == 0) {
                        /* -- Default (first) language uri without lang marker -- */
                        uri.href = stripSlash(langPath) + search;
                    }
                    else {
                        /* -- insert language marker -- */
                        let offs = path.indexOf(snippet);
                        if (offs >= 0) {
                            langPath = path.substr(0, offs + snippet.length) + langArray[i].substr(0, 2) + '/' + path.substr(offs + snippet.length);
                        }
                        uri.href = stripSlash(langPath) + search;
                    }
                }
            }
        }
        return true;
    }
    return false;
}
function adjustShopLanguageLinks() {
    if ( ! adjustLang("/shop/intra")) {
        if ( ! adjustLang("/shop")) {
            adjustLang("/public");
        }
    }
}

function prepareSearch() {

    var elems = document.getElementsByClassName("sc-icon-search");
    for (i = 0; i < elems.length; i++) {
        var a = upTo(elems[i], "a");
        if (a) {
            a.href = "#";
            a.onclick = toggleSearchBox;
        }
    }
    /*
    var box = document.getElementById("searchbox");
    if (box) {
        box.style.display = "none";
        respondToVisibility( box, setInputFocus);
    }
    */
}
function preparePage() {

    if (document.getElementById("page-27")) {
        if (!prepareMainPage())
            return;
    }

    if (document.getElementById("page-577")) {
        if (!prepareUnsubscribe())
            return;
    }

    prepareAppointments();
    // prepareSearch();
    timelinePictures();
    preparePDFLinks();
    prepareMenu();
    adjustShopLanguageLinks();
    // getProductTeasers();
    savePageContext();

    /* get the current menu state */
    var element = document.querySelector('body');
    menuState = window.getComputedStyle(element, ':after')
        .getPropertyValue('content');

}

function getRules() {
    var rules = {};
    for (var i = 0; i < document.styleSheets.length; ++i) {
        var cssRules = document.styleSheets[i].cssRules;
        for (var j = 0; j < cssRules.length; ++j)
            rules[cssRules[j].selectorText] = cssRules[j];
    }
    return rules;
}

function getClass(name) {
    var rules = getRules();
    if (!rules.hasOwnProperty(name))
        throw 'TODO: deal_with_notfound_case';
    return rules[name];
}

var timeOut = null;

function reloadWindow() {
    this.location.reload(false); /* false to get page from cache */
    timeOut = null;
}

$(window).resize(function _onResize() {

    if (document.getElementById("page-27")) {
        /* load the background images of the slider. They might have changed. */
        var branche = currentBranche;
        currentBranche = -1;
        showBranche(branche);
    }
    if (document.getElementById("page-62")) {
        /* load the background images of the slider. They might have changed. */
        var branche = currentBranche;
        currentBranche = -1;
        showBranche(branche);
    }
    /*  check if we toggle between mobile and desktop window.
        If so, reload to avoid the menu-style bug
    */
    var element = document.querySelector('body');
    var newValue = window.getComputedStyle(element, ':after')
        .getPropertyValue('content');

    if (newValue !== menuState) {
        const oldValue = menuState;
        menuState = newValue;
        /* -- Tauschen der Klassen ist leider nicht ausreichend, da auch die untergeordneten Elemente dynamisch generiert werden 
                var menu = document.getElementById( "navbarToggler");
                if ( ! menu)
                    return false;
        
                if ( menuState === '"sc-bp-xl"')
                { 
                    var elems = menu.getElementsByClassName( "remove-xl");
                    for ( var i = 0; i < elems.length; i++) {
                        elems[i].classList.add("show-xl");
                    }
                    var elems = menu.getElementsByClassName( "show-xl");
                    for ( var i = 0; i < elems.length; i++) {
                        elems[i].classList.remove("remove-xl");
                    }
                }
                else
                { 
                    var elems = menu.getElementsByClassName( "show-xl");
                    for ( var i = 0; i < elems.length; i++) {
                        elems[i].classList.add("remove-xl");
                    }
                    var elems = menu.getElementsByClassName( "remove-xl");
                    for ( var i = 0; i < elems.length; i++) {
                        elems[i].classList.remove("show-xl");
                    }
                }
        ---------------------------------------------------------------------- */
        if (timeOut);
        else {
            timeOut = setTimeout(reloadWindow, 1);
        }
    }
});

preparePage();
// console.log( "JS executed");

