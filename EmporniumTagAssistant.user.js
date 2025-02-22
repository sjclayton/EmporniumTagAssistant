// ==UserScript==
// @name         EmporniumTagAssistant
// @namespace    SJC
// @version      1.2.5
// @description  Userscript to add a tagging assistant to Empornium
// @author       sjclayton / koukol
// @include      /^https?://www\.empornium\.(is|sx)/torrents\.php\?id=*/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2.2.0/src/js.cookie.min.js
// @grant        none
// @run-at       document-end
// ==/UserScript==
var $j = $.noConflict(true);

/// User variables (Any changes made here will be overwritten on a script update, so make sure you disable auto update if you care about your changes.)

// Feel free to modify any of the tags here or add your own.
// Tags added to the Custom section will be saved and persist across script updates.

var general =   ["360p", "480p", "540p", "720p", "1080p", "2160p", "hd", "sd", "full.hd", "ultra.hd", "60.fps", "mp4", "picset", "mega.pack", "hardcore", "softcore", "amateur", "pov", "1on1", "straight", "solo", "teen",
                 "fetish", "interracial", "lesbian", "toys", "mature", "images", "all.girl", "bdsm", "threesome", "ffm", "transsexual", "shemale", "femdom", "homemade", "orgy", "gangbang", "gay", "some.pov",
                 "mmf", "condom", "siterip", "split.scenes", "incest", "outdoor", "indoor", "oil", "dildo", "hitachi.magic.wand", "vibrator", "piss", "strap.on", "male.on.shemale", "feet", "closeup", "webcam",
                 "virtual.reality", "incest.roleplay", "buttplug", "asian", "milf", "european", "japanese", "jav", "latina", "nude", "censored", "uncensored", "white.female.black.male", "black", "ebony", "british",
                 "russian", "white", "eastern.european", "czech", "bed", "schoolgirl", "paysite", "gonzo", "american"];
var positions = ["doggy.style", "missionary", "prone.bone", "cowgirl", "reverse.cowgirl", "spooning", "sideways", "anal.doggy", "anal.missionary", "anal.prone.bone", "anal.cowgirl", "anal.reverse.cowgirl",
                 "anal.spooning", "anal.sideways", "standing.doggy", "69", "side.fuck"];
var acts =      ["blowjob", "handjob", "creampie", "squirting", "anal", "facial", "ball.sucking", "oral", "cumshot", "cunnilingus", "masturbation", "cum.in.mouth", "deepthroat", "fingering", "cum.on.tits", "rimming",
                 "titfuck", "ass.to.mouth", "cum.swallow", "double.penetration", "kissing", "open.mouth.facial", "m2f.cunnilingus", "female.completion", "bondage", "face.fuck", "female.on.female.cunnnilingus",
                 "blowjob.to.completion", "handjob.to.completion", "male.completion", "2.girl.blowjob", "cum.on.stomach", "cum.on.ass", "cum.on.pussy", "eye.contact", "gape", "anal.gape", "anal.fingering", "gagging",
                 "face.sitting", "pussy.to.mouth", "tease", "male.rimming.female", "female.rimming.male", "humiliation", "spanking", "pov.blowjob", "jerk.off.instruction", "female.rimming.female", "toy.in.ass", "anal.creampie",
                 "anal.dildo", "blowjob.after.cumshot", "striptease", "dirty.talk", "massage", "tit.sucking", "orgasm", "clit.rubbing", "footjob"];
var features =  ["brunette", "blonde", "redhead", "natural.tits", "fake.tits", "small.tits", "medium.tits", "big.tits", "big.ass", "shaved", "tattoo", "trimmed", "petite", "bubble.butt", "long.hair", "piercings",
                 "bbw", "hairy", "lightly.tattooed", "moderately.tattooed", "heavily.tattooed", "pierced.belly.button", "pierced.tongue", "pierced.nipples", "chubby", "short.hair", "glasses", "black.hair", "tanlines",
                 "hairy.pussy", "skinny", "slim", "barefoot", "pale", "big.areolas", "big.natural.tits", "big.cock", "big.black.cock", "big.fake.tits", "small.natural.tits"];
var clothing =  ["lingerie", "stockings", "garter.belt", "fishnets", "high.heels", "pantyhose", "socks", "boots", "bikini", "shoes.on", "under.knee.socks", "over.knee.socks"];

// Customize your section colours here. (Only used if not using the Afterdark stylesheet.)

var generalColour = "#005cad";
var actsColour = "#24a333";
var positionsColour = "#cc342b";
var featuresColour = "#8d0aa0";
var clothingColour = "#2da3a3";
var customColour = "#6a103c";

// Enable/disable alphabetical (natural sort) tag sorting

//var sortTags = false;
var sortTags = true;


/// Script -- Do NOT change anything below unless you know what you're doing, things are likely to break.

var customSaved = localStorage.getItem("customTagArray");
if (customSaved) {
    var customTemp = JSON.parse(customSaved);
    var custom = customTemp.replace(/ /g, '').split(",");
} else {
    var custom = [];
}

general.id = "General";
positions.id = "Positions";
acts.id = "Acts";
features.id = "Body\ Features";
clothing.id = "Clothing";
custom.id = "Custom";

general.name = "general";
positions.name = "positions";
acts.name = "acts";
features.name = "features";
clothing.name = "clothing";
custom.name = "custom";

// Layout setup

$j("<div class='manwrapper'></div>").appendTo('#tag_container');
if ($j('link[href*="afterdark/style.css"]').length) {
    $j("<style type='text/css'> #listbox .highlight{background-color: #5A8BB8; border-color: #7BA3C1; border-width: 1px; border-style: solid; color: white; fontSize: 1em;} </style>").appendTo(".manwrapper");
} else {
    $j("<style type='text/css'> #listbox .highlight{background-color: black; border-color: white; border-width: 1px; border-style: solid;} </style>").appendTo(".manwrapper");
}
$j("<center><div class='controls'><p class='header'>Tag Assistant</p><button class='' id='hidebtn' title='Show/Hide Tag Assistant'>Show</button> <button id='editbtn' title='Add/Edit Custom Tags'>Edit</button> <button class='reset' title='Clear All Selected Tags'>Reset</button> <button id='floatbtn' title='Toggle Float'>&#x25b2;</button></div></center>").appendTo('.manwrapper');
$j("<div id='tagmanager'></div>").appendTo('.manwrapper');
$j('.autoresults input:button').addClass('reset');


$j('#hidebtn').click(function() {
    $j('#hidebtn').toggleClass('active');
    $j('#tagmanager').slideToggle('fast');
    if ($j('#hidebtn').hasClass('active')) {
        $j('#hidebtn').text('Hide');
        $j('#editbtn').prop('hidden', false);
        Cookies.set('showManager', true, { expires: 90 });
    } else {
        $j('#hidebtn').text('Show');
        $j('#editbtn').prop('hidden', true);
        Cookies.remove('showManager');
    }
});

$j('#editbtn').click(function() {
    var saved = localStorage.getItem("customTagArray");
    if (saved) {
        var savedTags = saved.replace(/"/g, '');
    }
    $j('#hidebtn').prop('hidden', true);
    $j('#editbtn').prop('hidden', true);
    $j("<div id='edit_custom'><p class='header'>Add/edit your custom tags here, separated by commas using the format 'tag1, tag2, tag3' and so on.</p><center><input id='custom_input' type='text' spellcheck='false' style='font: 10pt monospace;'></input>  <button class='controls' id='savebtn'>Save</button></center></div>").insertBefore('#tagmanager p.header:first-child');
    $j('#edit_custom').css({marginBottom: "10px"});
    $j('#edit_custom input').css({width: "500px", margin: "5px"});
    if ($j('link[href*="afterdark/style.css"]').length) {
        $j('#savebtn').css({margin: "5px 1px", width: "40px", backgroundColor: "#666", borderColor: "#DDD", color: "#000", fontFamily: "Arial", fontSize: "13px", lineHeight: "1.25em"});
        $j('p.header').css({fontSize: "1em", fontWeight: "bold", backgroundColor: "#131327", margin: "0px", textAlign: "center", color: "#ccc"});
    } else {
        $j('#savebtn').css({margin: "5px 1px", width: "50px", lineHeight: "1.25em"});
        $j('p.header').css({fontSize: "0.5rem", fontWeight: "bold", backgroundColor: "gray", margin: "0px"});
    }
    $j('#custom_input').val(savedTags);
    $j('#savebtn').click(function() {
        if ($j('#custom_input').val() !== null || '') {
            localStorage.setItem("customTagArray", JSON.stringify($j('#custom_input').val()));
            location.reload();
        } else {
            return;
        }
    });
});

$j('#floatbtn').click(function() {
    $j('#tagmanager').toggleClass('floating');
    if ($j('#tagmanager').hasClass('floating')) {
        $j('#tagmanager').css({float: "none", marginBottom: "10px"});
        $j('#tagmanager').detach().insertBefore('#user-sidebar');
        $j('#hidebtn').addClass('active').text('Hide').prop('hidden', true);
        $j('#editbtn').prop('hidden', true);
        $j('#tagmanager').show();
    } else {
        $j('#tagmanager').css({float: "right"});
        $j('#hidebtn').prop('hidden', false);
        if (Cookies.get('showManager', true)) {
            $j('#editbtn').prop('hidden', false);
            $j('#tagmanager').show();
        } else {
            $j('#hidebtn').removeClass('active').text('Show');
            Cookies.remove('showManager');
            $j('#tagmanager').hide();
        }
        $j('#tagmanager').detach().appendTo('.manwrapper');
    }
});

function inputLayout(list) {
    var name = list.name;
    var id = list.id;
    var div = "<div class=" + name + " id='listbox'" + ">";
    var divclose = "</div>";
    var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

    $j("#tagmanager").append($j("<p class='header'>" + id + "</p>"));
    $j("#tagmanager").append($j(div));
    if (sortTags == true) {
        list.sort(collator.compare);
    }
    $j.each(list, function(index, value) {
        var checkbox = "<input type='checkbox' id=" + value + " value=" + value + " name=" + value + "><label for=" + value + ">" + value + "</label>";
        $j("." + (name)).append($j(checkbox));
    });
    $j("#tagmanager").append($j(divclose));
}

inputLayout(general);
inputLayout(acts);
inputLayout(positions);
inputLayout(features);
inputLayout(clothing);
if (customTemp) {
    inputLayout(custom);
}

// Style stuff

if ($j('link[href*="afterdark/style.css"]').length) {
    console.log('ETA: Afterdark Detected!');
    $j('.manwrapper').css({width: "auto", color: "white"});
    $j('.controls').css({float: "right", backgroundColor: "#111", margin: "5px 0px", padding: "3px 0px", width: "175px", color: "#ccc", fontWeight: "bold"});
    $j('.controls button').css({margin: "5px 1px", width: "40px", backgroundColor: "#666", borderColor: "#DDD", color: "#000", fontFamily: "Arial", fontSize: "13px", lineHeight: "1.25em"});
    $j('.controls #floatbtn').css({width: "25px"});
    $j('p.header').css({fontSize: "1em", fontWeight: "bold", backgroundColor: "#131327", margin: "0px", textAlign: "center", color: "#ccc"});
    $j('#listbox input').css({display: "none"});
    $j('#tagmanager').css({float: "right", clear: "both", backgroundColor: "#111", display: "none", padding: "0px"});
    $j('#tagmanager label').css({borderRadius: "3px", padding: "2px 5px", margin: "1px 3px", display: "inline-block", cursor: "pointer"});
    $j('#tagmanager #listbox').css({padding: "5px 2px", backgroundColor: "#111", color: "#6083E8", textAlign: "center", fontSize: "1em"});
} else {
$j('.manwrapper').css({width: "auto", color: "white"});
$j('.controls').css({float: "right", backgroundColor: "rgba(255,255,255,0.15)", margin: "5px 0px", borderRadius: "5px", padding: "3px", width: "200px"});
$j('.controls button').css({margin: "5px 1px", width: "50px", lineHeight: "1.25em"});
$j('.controls #floatbtn').css({width: "25px"});
$j('p.header').css({fontSize: "0.5rem", fontWeight: "bold", backgroundColor: "gray", margin: "0px"});
$j('#listbox input').css({display: "none"});
$j('#tagmanager').css({float: "right", clear: "both", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "5px", display: "none", padding: "10px", color: "white"});
$j('#tagmanager label').css({fontSize: "0.75rem", fontWeight: "bold", borderRadius: "3px", padding: "2px 5px", margin: "1px 3px", display: "inline-block", cursor: "pointer"});
$j('#tagmanager #listbox').css({padding: "5px 2px"});
$j('.general').css({backgroundColor: generalColour});
$j('.acts').css({backgroundColor: actsColour});
$j('.positions').css({backgroundColor: positionsColour});
$j('.features').css({backgroundColor: featuresColour});
$j('.clothing').css({backgroundColor: clothingColour});
$j('.custom').css({backgroundColor: customColour});
}

// Reset form elements

function resetForm() {
    $j('#listbox input').prop('checked', false);
    $j('label').removeClass('highlight');
}

$j('.reset, :input[value="+"]').on("mousedown", function () {
    resetForm();
});

$j(document).keypress(function(event) {
    if ($j("input#taginput").is(":focus") && event.key == "Enter") {
        resetForm();
    }
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
    $j(this).nextUntil('input').toggleClass('active').toggleClass('highlight');
}

$j(function() {
    $j('#tagmanager input[type=checkbox]').click(updateTextArea);

    if (Cookies.get('showManager', true)) {
        $j('#editbtn').prop('hidden', false);
        $j('#hidebtn').addClass('active').text('Hide');
        $j('#tagmanager').show();
    } else {
        $j('#editbtn').prop('hidden', true);
    }
});
