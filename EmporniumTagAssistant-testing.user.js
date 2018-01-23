// ==UserScript==
// @name         EmporniumTagAssistant-testing
// @namespace    SJC
// @version      1.2-rc1
// @description  Userscript to add a tagging assistant to Empornium
// @author       sjclayton
// @match        *://*.empornium.me/torrents.php?*
// @match        *://*.empornium.sx/torrents.php?*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2.2.0/src/js.cookie.min.js
// @grant        none
// @run-at       document-end
// ==/UserScript==
var $j = $.noConflict(true);

/// User variables
// Feel free to modify any of the tags here or, add your own to the custom list below.
var general = ["480p", "540p", "720p", "1080p", "2160p", "hd", "sd", "full.hd", "ultra.hd", "60.fps", "picset", "mega.pack", "hardcore", "softcore", "amateur", "pov"];
var positions = ["doggy.style", "missionary", "prone.bone", "cowgirl", "reverse.cowgirl", "spooning", "sideways", "anal.doggy", "anal.missionary", "anal.prone.bone", "anal.cowgirl", "anal.reverse.cowgirl", "anal.spooning", "anal.sideways"];
var acts = ["blowjob", "handjob", "creampie", "squirting", "anal", "facial", "ball.sucking"];
var common = ["brunette", "blonde", "redhead", "natural.tits", "fake.tits", "small.tits", "medium.tits", "big.tits", "big.ass", "shaved"];

// Customize your section colours here.
var generalColour = "#0074D9";
var positionsColour = "#2ECC40";
var actsColour = "#FF4136";
var commonColour = "#B10DC9";
var customColour = "#39CCCC";


/// Script setup -- Do not change anything below unless you know what you're doing, things might break.
var customSaved = localStorage.getItem("customTagArray");
if (customSaved) {
    var customTemp = JSON.parse(customSaved);
    var custom = customTemp.split(",");
} else {
    var custom = [];
}

general.name = "General";
positions.name = "Positions";
acts.name = "Acts";
common.name = "Common";
custom.name = "Custom";

$j("<div class='manwrapper'></div>").appendTo('.box_tags');
$j("<style type='text/css'> #listbox .highlight{background-color: black; border-color: white; border-width: 1px; border-style: solid;} </style>").appendTo(".manwrapper");
$j("<div class='controls'>Tag Assistant: <button class='' id='hidebtn' title='Show/Hide Tag Assistant'>Show</button> <button id='editbtn' title='Add/Edit Custom Tags'>Edit</button> <button class='reset' title='Clear All Selected Tags'>Reset</button></div>").appendTo('.manwrapper');
$j("<div id='tagmanager'></div>").appendTo('.manwrapper');
$j('.autoresults input:button').addClass('reset');

$j('#hidebtn').click(function() {
    $j('#hidebtn').toggleClass('active');
    $j('#tagmanager').slideToggle('fast');
    if ($j('#hidebtn').hasClass('active')) {
        $j('#hidebtn').text('Hide');
        Cookies.set('showManager', true);
    } else {
        $j('#hidebtn').text('Show');
        Cookies.remove('showManager');
    }
});


if ($j('link[title="afterdark"]').length) {
    // it exists
    console.log('Afterdark Detected!');
}

$j('#editbtn').click(function() {
    var saved = localStorage.getItem("customTagArray");
    if (saved !== null) {
        var savedTags = saved.replace(/"/g, '');
    }
    var input = prompt('Enter your custom tags here, separated by commas using the format "tag1, tag2, tag3" and so on.', savedTags);
    if (input !== null || '') {
        localStorage.setItem("customTagArray", JSON.stringify(input));
        location.reload();
    } else {
        return;
    }
});

function inputLayout(list) {
    var name = list.name;
    $j("#tagmanager").append($j("<p class='header'>" + name + "</p>"));
    var div = "<div class=" + name + " id='listbox'" + ">";
    $j("#tagmanager").append($j(div));
    $j.each(list, function(index, value) {
        var checkbox = "<input type='checkbox' id=" + value + " value=" + value + " name=" + value + "><label for=" + value + ">" + value + "</label>";
        $j("." + (name)).append($j(checkbox));
    });
    var divclose = "</div>";
    $j("#tagmanager").append($j(divclose));
}

inputLayout(general);
inputLayout(acts);
inputLayout(positions);
inputLayout(common);
if (customSaved) {
    inputLayout(custom);
}

// Style stuff
$j('.manwrapper').css({
    width: "auto",
    color: "white"
});
$j('.controls').css({
    float: "right",
    backgroundColor: "rgba(0,0,0,0.35)",
    margin: "5px",
    borderRadius: "5px",
    padding: "3px",
    minWidth: "165px"
});
$j('.controls button').css({
    padding: "1px 3px",
    margin: "2px",
    width: "50px"
});
$j('#tagmanager').css({
    float: "right",
    clear: "both",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: "5px",
    display: "none",
    padding: "10px"
});
$j('#listbox input').css({
    display: "none"
});
$j('#tagmanager label').css({
    fontSize: "0.75rem",
    fontWeight: "bold",
    borderRadius: "5px",
    padding: "2px 5px",
    margin: "1px 3px",
    display: "inline-block",
    cursor: "pointer"
});
$j('p.header').css({
    fontSize: "0.5rem",
    fontWeight: "bold",
    backgroundColor: "gray",
    margin: "0px"
});
$j('#tagmanager #listbox').css({
    padding: "5px 2px"
});
$j('.General').css({
    backgroundColor: generalColour
});
$j('.Acts').css({
    backgroundColor: actsColour
});
$j('.Positions').css({
    backgroundColor: positionsColour
});
$j('.Common').css({
    backgroundColor: commonColour
});
$j('.Custom').css({
    backgroundColor: customColour
});


// Reset form elements
$j('.reset').click(function() {
    $j('input#taginput').val('');
    $j('#listbox input').prop('checked', false);
    $j('label').removeClass('highlight');
});

// Push tag list to input box
function updateTextArea() {
    var allVals = [];

    $j('#tagmanager :checked').each(function(i) {
        allVals.push((i != 0 ? "" : "") + $j(this).val());
    });
    var str = new String(allVals);
    var output = str.split(' ');
    var taglist = new String(output);
    var taginput = taglist.replace(/,/g, ' ');
    $j('input#taginput').val(taginput);
    $j(this).nextUntil('input').toggleClass('active');
    $j(this).nextUntil('input').toggleClass('highlight');
}

$j(function() {
    $j('#tagmanager input[type=checkbox]').click(updateTextArea);
    updateTextArea();

    if (Cookies.get('showManager', true)) {
        $j('#hidebtn').addClass('active');
        $j('#hidebtn').text('Hide');
        $j('#tagmanager').show();
    }
});
