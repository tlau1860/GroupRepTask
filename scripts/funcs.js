if (!Array.prototype.transpose) {
    Array.prototype.transpose = function () {
	var a = this,
	    w = a.length ? a.length : 0,
	    h = a[0] instanceof Array ? a[0].length : 0;
	if (h === 0 || w === 0) {
	    return []
	}
	var i, j, t = [];
	for (i = 0; i < h; i++) {
	    t[i] = [];
	    for (j = 0; j < w; j++) {
		t[i][j] = a[j][i]
	    }
	}
	return t
    };
}

if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function () {
	var arrayLength = this.length, j, tempi, tempj;
	if ( arrayLength === 0 ) {
	    return false;
	}
	while (--arrayLength) {
	    j = Math.floor( Math.random() * (arrayLength+1) );
	    tempi = this[arrayLength];
	    tempj = this[j];
	    this[arrayLength] = tempj;
	    this[j] = tempi;
	}
	return arrayLength;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
	for (var i = (start || 0), j = this.length; i < j; i++) {
	    if (this[i] === obj) { return i; }
	}
	return -1;
    }
}


if (!Array.prototype.rotate) {
    Array.prototype.rotate = (function() {
	// save references to array functions to make lookup faster
	var push = Array.prototype.push,
	    splice = Array.prototype.splice;
	return function(count) {
	    var len = this.length >>> 0, // convert to uint
		count = count >> 0; // convert to int
	    // convert count to value in range [0, len)
	    count = ((count % len) + len) % len;
	    // use splice.call() instead of this.splice() to make function generic
	    push.apply(this, splice.call(this, 0, count));
	    return this;
	};
    })();
}


if (!Array.prototype.map) {
    /*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map*/
    Array.prototype.map = function(fun /*, thisArg */)
    {
	"use strict";
	if (this === void 0 || this === null)
	    throw new TypeError();
	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun !== "function")
	    throw new TypeError();
	var res = new Array(len);
	var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	for (var i = 0; i < len; i++)
	{
	    // NOTE: Absolute correctness would demand Object.defineProperty
	    //       be used.  But this method is fairly new, and failure is
	    //       possible only if Object.prototype or Array.prototype
	    //       has a property |i| (very unlikely), so use a less-correct
	    //       but more portable alternative.
	    if (i in t)
		res[i] = fun.call(thisArg, t[i], i, t);
	}
	return res;
    };
}

if (!Array.prototype.sample) {
    Array.prototype.sample = function(n, replacement)
    {
	"use strict";
	// Sample n items from array
	// With replacement if second argument is true
	if (this === void 0 || this === null)
	    throw new TypeError();
	var t = Object(this).slice();
	if (typeof n !== "number")
	    throw new TypeError();
	if (replacement == true) {
	    var tmp = [];
	    for(var i = 0; i < n; i++) {
		tmp.push.apply(tmp,t.sample(1));
	    }
	    t = tmp;
	} else {
	    t.shuffle();
	    t = t.splice(0,n);
	}
	return t;
    };
}

if (!Array.prototype.rep) {
    Array.prototype.rep = function(n)
    {
	"use strict";
	if (this === void 0 || this === null)
	    throw new TypeError();
	var t = Object(this).slice();
	var len = t.length >>> 0;
	if (typeof n !== "number")
	    throw new TypeError();
	if (n <= 0) {
	    return [];
	}
	for(var i = 1; i < n; i++) {
	    this.push.apply(this, t);
	}
	return this;
    };
}

function isPicFiletype(stim){
    if (stim.length < 4) {return false;}
    try {
	var type = stim.slice(stim.length-4,stim.length);
    } catch (err) {
	return false;
    }
    type = type.toLowerCase();
    switch(type){
    case '.jpg':
	return true;

    case 'jpeg':
	return true;

    case '.bmp':
	return true;

    case '.png':
	return true;

    case '.gif':
	return true;

    case '.tif':
	return true;

    case 'tiff':
	return true;

    default:
	return false;
    }
}

function flattenPictureArray(array){
	var array_len = array.length;
	var flat_array = [];
	for (var i = 0; i < array_len; i++){
		if (typeof(array[i])=="string"){
			if (isPicFiletype(array[i])){
				flat_array.push("./pictures/" + array[i]);
			}
		} else if (typeof(array[i])=="object"){
			try {[].push.apply(flat_array, flattenPictureArray(array[i]));}
			catch (err) {}
		}
	}
	return flat_array;
}

function preloadImages_new(array, func){
	var flat_array = flattenPictureArray(array);
	if (flat_array.length > 0) {
	$('#preload_progress').progressbar({value: 0, max : flat_array.length}).height('4px');
	var pl = new preLoader(flat_array, {
		onComplete : function () {
			func();
		}
	});
	} else {
		func();
	}
}

function getSubjID (n) {
    var digits = [1,2,3,4,5,6,7,8,9];
    var subjID = digits.sample(1);
    digits.push(0);
    subjID.push.apply(subjID, digits.sample(n-1, true));
    return subjID.join('');
}


function inverseVotes (peer) {
    //Peer 2 always chooses the opposite of Peer 2
    var out = [];
    for(var i = 0; i < peer.length; i++) {
	out.push(peer[i] ^ 1);
    }
    return out;
}



function addVotes (peer, percent) {
    // Peer 3 always agrees with you the same as peer 2
    // Plus one extra occurrance
    var out = [];
    var rand = Math.random() > 0.5 ? 0 : 1;
    var peerAgrees = peer.reduce(function(a,b){return a+b;});
    var peerDisagrees = peer.length - peerAgrees;
    var numToAdd = Math.floor(peer.length * percent / 100) - peerAgrees;
    if (numToAdd > 0) {
	var votesToAdd = [1].rep(numToAdd);
	var votesToKeep = [0].rep(peerDisagrees - numToAdd);
	votesToAdd.push.apply(votesToAdd, votesToKeep);
	votesToAdd.shuffle();

	var counter = 0;
	for(var i = 0; i < peer.length; i++) {
	    var trial = peer[i];
	    if (trial == 1) {
		out.push(trial);
	    } else {
		out.push(votesToAdd[counter]);
		counter++;
	    }
	}
    } else if (numToAdd < 0) {
	var votesToAdd = [0].rep(Math.abs(numToAdd));
	var votesToKeep = [1].rep(peerAgrees - Math.abs(numToAdd));
	votesToAdd.push.apply(votesToAdd, votesToKeep);
	votesToAdd.shuffle();

	var counter = 0;
	for(var i = 0; i < peer.length; i++) {
	    var trial = peer[i];
	    if (trial == 0) {
		out.push(trial);
	    } else {
		out.push(votesToAdd[counter]);
		counter++;
	    }
	}
    } else {
	out = peer.slice();
    }
    return out;
}

function simulate(f, n) {
    var out = {};
    for(var i = 0; i < n; i++) {
	var tmp = f();
	tmp = tmp.join('');
	if (typeof out[tmp] == "number") {
	    out[tmp]++;
	} else {
	    out[tmp] = 1;
	}
    }
    return out;
}

function calcAgreement(agreement, n, peer) {
    var numAgrees = Math.floor(n * agreement[peer] / 100);
    var out = [1].rep(numAgrees); //Add a 1 for each agree
    out.push.apply(out, [0].rep(n -numAgrees)); //0 otherwise
    out.shuffle();
    return out;
}


// function samTimelineGen (stims, peers, opts) {
//     var opts = opts || {}
//     var prompt = opts.prompt ||  "Which movie do you think ${peer} chose?";
//     var choices = opts.choices || ['e', 'i'];
//     var peerAgreement = opts.peerAgreement || [
// 	50,
// 	{func: inverseVotes, ref: "A"},
// 	{func: addVotes, ref: "B", percent: 75}
//     ];
//     var peerCompares = opts.peerCompares || [1,1,0];
//     var peerLabels = opts.peerLabels || ['A', 'B', 'C'];
//     var peerCPercent = opts.peerCPercent || '';
//     var includeLikert = opts.includeLikert || false;
//     var stimDir = opts.stimDir || '';
//     var prompt_regex = opts.prompt_regex || /(.*)/;
//     var stim_regex = opts.stim_regex || /(.*)/;
//     var block_num = opts.block_num || 0;
//     var timing_post_trial = typeof opts.timing_post_trial == "undefined" ? 1000: opts.timing_post_trial  ;
//     var testing = typeof opts.testing == "undefined" ? false: opts.testing ;
//     if (testing) {
// 	timing_post_trial = 0;
//     }
//
//     var peer0 = opts.peer0 || [1].rep(stims.length);
//
//     // Calculate peer agreement based on opts.peerAgreement
//     // Enter just a number for % agreement with the participant
//     // Enter an object with a function, a peer reference, %, and options
//     // To compute a peer's agreement w.r.t another peer's choices.
//
//     // e.g., {func: inverseVotes, ref: 'A'} will make a given peer's
//     // choices be the exact opposite of the peer that is labeled 'A'
//
//     // e.g., {func: addVotes, ref: "B", percent: 75} will make a given
//     // peer's agrees be identical to peer 'B', and then add agreement
//     // up to 75% agreement with the participant
//
//     var peer_agree = [];
//     for(var i = 0; i < peerAgreement.length; i++) {
// 	var pa = peerAgreement[i];
// 	if (typeof pa == "number") {
// 	    peer_agree.push(calcAgreement(peerAgreement,stims.length,i));
// 	} else if (typeof pa == "object") {
// 	    pa.func	= pa.func	|| inverseVotes;
// 	    pa.ref	= pa.ref	|| "A";
// 	    pa.percent	= pa.percent	|| 75;
// 	    pa.opts	= pa.opts	|| {};
// 	    var peer = peer_agree[peerLabels.indexOf(pa.ref)];
// 	    peer_agree.push(pa.func(peer, pa.percent, pa.opts));
// 	}
//     }
//
//     //Shuffle the order of the peers, but maintain all their properties internally
//     var all_peers = [peers, peerAgreement, peerCompares, peerLabels, peer_agree].transpose();
//     all_peers.shuffle();
//     all_peers = all_peers.transpose();
//
//     peers = all_peers[0];
//     peerAgreement = all_peers[1];
//     peerCompares = all_peers[2];
//     peerLabels = all_peers[3];
//     peer_agree = all_peers[4];
//
//     peer_agree.unshift(peer0);
//     peer_agree = peer_agree.transpose();
//
//     var peer_compare = peerCompares;
//
//     peer_compare.unshift(0);
//     peers.unshift('You');
//     peerLabels.unshift('Self');
//
//     var timeline = [];
//
//     for(var i = 0; i < stims.length; i++) {
// 	var block = {
// 	    type		: 'similarity',
// 	    prompt		: 'Which movie would you prefer to watch?',
// 	    peers		: peers,
// 	    peer_agree		: peer_agree[i],
// 	    peer_compare	: peer_compare,
// 	    peer_label		: peerLabels,
// 	    stimuli		: [stimDir + stims[i] + 'a.jpg', stimDir + stims[i] + 'b.jpg'],
// 	    prompt		: prompt,
// 	    testing		: testing,
// 	    timing_post_trial	: timing_post_trial,
// 	    choices		: choices,
// 	    peerCPercent	: peerCPercent,
// 	    data		: {block_num: block_num},
// 	    stimDir		: '',
// 	    timeline: [
// 		{prompt: "Which movie would you choose?", peer: 0},
// 		{peer: 1},
// 		{peer: 2},
// 		{peer: 3},
// 	    ]
// 	}
// 	if (i == 0) {
// 	    block.timeline[0].phase = "FIRST";
// 	}
// 	if (i == stims.length - 1) {
// 	    block.timeline.push({phase: "MYSTERY", prompt:'Which one would you choose?<br>Remember, ${peer1} and ${peer2} know what\'s inside the boxes.'});
// 	}
// 	$.extend(block, opts.timing);
// 	timeline.push(block);
//     }



//     if (includeLikert) {
// 	var likertStims = peers.slice(1);
// 	likertStims.shuffle();
//
// 	var likertQuestions = ['How <span class="underline">likeable</span> is this person?', 'How <span class="underline">competent</span> is this person?', 'How <span class="underline">moral</span> is this person?'];
//
// 	for(var i = 0; i < likertStims.length; i++) {
// 	    likertQuestions.shuffle();
// 	    for(var j = 0; j < likertQuestions.length; j++) {
// 		var likertTrial = {
// 		    type: 'single-stim-sam',
// 		    stimulus: 'img/agents/' + likertStims[i] + '.jpg',
// 		    prompt_regex: prompt_regex,
// 		    stim_regex: stim_regex,
// 		    timing_post_trial: timing_post_trial,
// 		    prompt: $('<div>').append(
// 			$('<h3>', {html: likertQuestions[j]})
// 		    ).append(
// 			$('<p>', {text: 'Press a number between 1-9 on your keyboard'})
// 		    ).append(
// 			$('<table>', {html:
// 				      '<tr><td class="likertScale">1</td><td class="likertScale">2</td><td class="likertScale">3</td><td class="likertScale">4</td><td class="likertScale">5</td><td class="likertScale">6</td><td class="likertScale">7</td><td class="likertScale">8</td><td class="likertScale">9</td></tr>\
// <tr><td>Not at All</td><td></td><td></td><td></td><td>Moderately</td><td></td><td></td><td></td><td>Extremely</td></tr>',
// 				      css: {width:'600px'}})
// 		    ),
// 		    choices: ['1','2','3','4','5','6','7','8','9']
// 		}
// 		timeline.push(likertTrial);
// 	    }
// 	}
//     }
//
//     return timeline;
// }

function poliTimelineGen (stims, prompts, peers, opts) {
    var stims_prompts = [stims, prompts].transpose();
    stims_prompts.shuffle();
    var opts = opts || {}
    var prompt = opts.prompt ||  "<span>Which stance do you think <u>${peer}</u> chose?</span>";
    var choices = opts.choices || ['e', 'i'];
    var peerAgreement = opts.peerAgreement || [
	50,
	{func: inverseVotes, ref: "A"},
	{func: addVotes, ref: "B", percent: 75}
    ];
    var peerCPercent = opts.peerCPercent || '';
    var peerCompares = opts.peerCompares || [1,1,0];
    var peerLabels = opts.peerLabels || ['A', 'B', 'C'];
    var includeLikert = opts.includeLikert || false;
    var block_num = opts.block_num || 0;
    var timing_post_trial = typeof opts.timing_post_trial == "undefined" ? 1000: opts.timing_post_trial  ;
    var testing = typeof opts.testing == "undefined" ? false: opts.testing ;
    if (testing) {
	timing_post_trial = 0;
    }

    var peer0 = opts.peer0 || [1].rep(stims.length);

    // Calculate peer agreement based on opts.peerAgreement
    // Enter just a number for % agreement with the participant
    // Enter an object with a function, a peer reference, %, and options
    // To compute a peer's agreement w.r.t another peer's choices.

    // e.g., {func: inverseVotes, ref: 'A'} will make a given peer's
    // choices be the exact opposite of the peer that is labeled 'A'

    // e.g., {func: addVotes, ref: "B", percent: 75} will make a given
    // peer's agrees be identical to peer 'B', and then add agreement
    // up to 75% agreement with the participant

    var peer_agree = [];
    for(var i = 0; i < peerAgreement.length; i++) {
	var pa = peerAgreement[i];
	if (typeof pa == "number") {
	    peer_agree.push(calcAgreement(peerAgreement,stims.length,i));
	} else if (typeof pa == "object") {
	    pa.func	= pa.func	|| inverseVotes;
	    pa.ref	= pa.ref	|| "A";
	    pa.percent	= pa.percent	|| 75;
	    pa.opts	= pa.opts	|| {};
	    var peer = peer_agree[peerLabels.indexOf(pa.ref)];
	    peer_agree.push(pa.func(peer, pa.percent, pa.opts));
	}
    }

    //Shuffle the order of the peers, but maintain all their properties internally
    var all_peers = [peers, peerAgreement, peerCompares, peerLabels, peer_agree].transpose();
    all_peers.shuffle();
    all_peers = all_peers.transpose();

    peers = all_peers[0];
    peerAgreement = all_peers[1];
    peerCompares = all_peers[2];
    peerLabels = all_peers[3];
    peer_agree = all_peers[4];

    peer_agree.unshift(peer0);
    peer_agree = peer_agree.transpose();

    var peer_compare = peerCompares;

    peer_compare.unshift(0);
    peers.unshift('You');
    peerLabels.unshift('Self');

    var timeline = [];

    for(var i = 0; i < stims.length; i++) {
      var trial_stims = ["oes/" + opts.stimDir + stims[i], "xes/" + opts.stimDir + stims[i]];
      trial_stims.shuffle();
      console.log(opts);
      var block = {
        type			: 'similarity',
        prompt			: 'Which movie would you prefer to watch?',
	    peers			: peers,
	    stimDir			: './',
	    peer_agree			: peer_agree[i],
	    peer_compare		: peer_compare,
	    peer_label			: peerLabels,
	    stimuli			: trial_stims,
	    prompt			: prompt,
	    testing			: testing,
	    timing_post_trial		: timing_post_trial,
	    choices			: choices,
	    peerCPercent		: peerCPercent,
	    data			: {block_num: block_num},
	    timeline: [
		{prompt: prompts[i] + "<br><span id='subprompt'>Which would <u>you</u> choose?</span>", peer: 0},
		{peer: 1, prompt: prompts[i] + "<br><span id='subprompt'>Which do you think <u>${peer}</u> chose?</span>"},
		{peer: 2, prompt: prompts[i] + "<br><span id='subprompt'>Which do you think <u>${peer}</u> chose?</span>"},
		{peer: 3, prompt: prompts[i] + "<br><span id='subprompt'>Which do you think <u>${peer}</u> chose?</span>"},
	    ]
	}
	if (i == 0) {
	    block.timeline[0].phase = "FIRST";
	}
	if (i == stims.length - 1) {
	    block.timeline.push({phase: "MYSTERY", prompt:'Which one would you choose?<br>Remember, ${peer1} and ${peer2} know what\'s inside the boxes.'});
	}
	$.extend(block, opts.timing);
	timeline.push(block);
    }



  //   if (includeLikert) {
	// var likertStims = peers.slice(1);
	// likertStims.shuffle();
  //
	// var likertQuestions = ['How <span class="underline">likeable</span> is this person?', 'How <span class="underline">competent</span> is this person?', 'How <span class="underline">moral</span> is this person?'];

// 	for(var i = 0; i < likertStims.length; i++) {
// 	    likertQuestions.shuffle();
// 	    for(var j = 0; j < likertQuestions.length; j++) {
// 		var likertTrial = {
// 		    type: 'single-stim-sam',
// 		    stimulus: 'img/agents/' + likertStims[i] + '.jpg',
// 		    prompt: $('<div>').append(
// 			$('<h3>', {html: likertQuestions[j]})
// 		    ).append(
// 			$('<p>', {text: 'Press a number between 1-9 on your keyboard'})
// 		    ).append(
// 			$('<table>', {html:
// 				      '<tr><td class="likertScale">1</td><td class="likertScale">2</td><td class="likertScale">3</td><td class="likertScale">4</td><td class="likertScale">5</td><td class="likertScale">6</td><td class="likertScale">7</td><td class="likertScale">8</td><td class="likertScale">9</td></tr>\
// <tr><td>Not at All</td><td></td><td></td><td></td><td>Moderately</td><td></td><td></td><td></td><td>Extremely</td></tr>',
// 				      css: {width:'600px'}})
// 		    ),
// 		    choices: ['1','2','3','4','5','6','7','8','9']
// 		}
// 		timeline.push(likertTrial);
// 	    }
// 	}
//    }

    return timeline;
}


function poliTimelineGenNames (stims, prompts, peers, names, opts) {
    var stims_prompts = [stims, prompts].transpose();
    stims_prompts.shuffle();
    var opts = opts || {}
    var prompt = opts.prompt ||  "<span>Which movie do you think <u>${peer}</u> chose?</span>";
    var choices = opts.choices || ['e', 'i'];
    var peerAgreement = opts.peerAgreement || [
	50,
	{func: inverseVotes, ref: "A"},
	{func: addVotes, ref: "B", percent: 75}
    ];
    var peerCPercent = opts.peerCPercent || '';
    var peerCompares = opts.peerCompares || [1,1,0];
    var peerLabels = opts.peerLabels || ['A', 'B', 'C'];
    var includeLikert = opts.includeLikert || false;
    var block_num = opts.block_num || 0;
    var timing_post_trial = typeof opts.timing_post_trial == "undefined" ? 1000: opts.timing_post_trial  ;
    var testing = typeof opts.testing == "undefined" ? false: opts.testing ;
    if (testing) {
	timing_post_trial = 0;
    }

    var peer0 = opts.peer0 || [1].rep(stims.length);

    // Calculate peer agreement based on opts.peerAgreement
    // Enter just a number for % agreement with the participant
    // Enter an object with a function, a peer reference, %, and options
    // To compute a peer's agreement w.r.t another peer's choices.

    // e.g., {func: inverseVotes, ref: 'A'} will make a given peer's
    // choices be the exact opposite of the peer that is labeled 'A'

    // e.g., {func: addVotes, ref: "B", percent: 75} will make a given
    // peer's agrees be identical to peer 'B', and then add agreement
    // up to 75% agreement with the participant

    var peer_agree = [];
    for(var i = 0; i < peerAgreement.length; i++) {
	var pa = peerAgreement[i];
	if (typeof pa == "number") {
	    peer_agree.push(calcAgreement(peerAgreement,stims.length,i));
	} else if (typeof pa == "object") {
	    pa.func	= pa.func	|| inverseVotes;
	    pa.ref	= pa.ref	|| "A";
	    pa.percent	= pa.percent	|| 75;
	    pa.opts	= pa.opts	|| {};
	    var peer = peer_agree[peerLabels.indexOf(pa.ref)];
	    peer_agree.push(pa.func(peer, pa.percent, pa.opts));
	}
    }

    //Shuffle the order of the peers, but maintain all their properties internally
    var all_peers = [peers, peerAgreement, peerCompares, peerLabels, peer_agree, names].transpose();
    all_peers.shuffle();
    all_peers = all_peers.transpose();

    peers = all_peers[0];
    peerAgreement = all_peers[1];
    peerCompares = all_peers[2];
    peerLabels = all_peers[3];
    peer_agree = all_peers[4];
    names = all_peers[5];

    peer_agree.unshift(peer0);
    peer_agree = peer_agree.transpose();

    var peer_compare = peerCompares;

    peer_compare.unshift(0);
    peers.unshift('You.jpg');
    names.unshift('You');
    peerLabels.unshift('Self');

    var timeline = [];

    for(var i = 0; i < stims.length; i++) {
	var you_trial = {prompt: prompts[i] + "<br><span id='subprompt'>Which would <u>you</u> choose?</span>", peer: 0,};
	$.extend(you_trial, opts.you_timing);
	var trial_stims = ["oes/" + opts.stimDir + stims[i], "xes/" + opts.stimDir + stims[i]];
	trial_stims.shuffle();
	var block = {
	    type		: 'similarity',
	    prompt		: 'Which movie would you prefer to watch?',
	    peers		: peers,
	    peerExt		: '',
	    names		: names,
	    stimDir             : './',
	    peer_agree		: peer_agree[i],
	    peer_compare	: peer_compare,
	    peer_label		: peerLabels,
	    stimuli		: trial_stims,
	    prompt		: prompt,
	    testing		: testing,
	    timing_post_trial	: timing_post_trial,
	    choices		: choices,
	    peerCPercent	: peerCPercent,
	    data		: {block_num: block_num},
	    timeline: [
		you_trial,
		{peer: 1, prompt: prompts[i] + "<br><span id='subprompt'>Which do you think <u>${peer}</u> chose?</span>"},
		{peer: 2, prompt: prompts[i] + "<br><span id='subprompt'>Which do you think <u>${peer}</u> chose?</span>"},
		{peer: 3, prompt: prompts[i] + "<br><span id='subprompt'>Which do you think <u>${peer}</u> chose?</span>"},
	    ]
	}
	if (i == 0) {
	    block.timeline[0].phase = "FIRST";
	}
	if (i == stims.length - 1) {
	    block.timeline.push({phase: "MYSTERY", prompt:'Which one would you choose?<br>Remember, ${peer1} and ${peer2} know what\'s inside the boxes.'});
	}
	console.log(opts.timing);
	$.extend(block, opts.timing);
	timeline.push(block);
    }



//     if (includeLikert) {
// 	var likertStims = peers.slice(1);
// 	likertStims.shuffle();
//
// 	var likertQuestions = ['How <span class="underline">likeable</span> is this person?', 'How <span class="underline">competent</span> is this person?', 'How <span class="underline">moral</span> is this person?'];
//
// 	for(var i = 0; i < likertStims.length; i++) {
// 	    likertQuestions.shuffle();
// 	    for(var j = 0; j < likertQuestions.length; j++) {
// 		var likertTrial = {
// 		    type: 'single-stim-sam',
// 		    stimulus: 'img/agents/' + likertStims[i] + '.jpg',
// 		    prompt: $('<div>').append(
// 			$('<h3>', {html: likertQuestions[j]})
// 		    ).append(
// 			$('<p>', {text: 'Press a number between 1-9 on your keyboard'})
// 		    ).append(
// 			$('<table>', {html:
// 				      '<tr><td class="likertScale">1</td><td class="likertScale">2</td><td class="likertScale">3</td><td class="likertScale">4</td><td class="likertScale">5</td><td class="likertScale">6</td><td class="likertScale">7</td><td class="likertScale">8</td><td class="likertScale">9</td></tr>\
// <tr><td>Not at All</td><td></td><td></td><td></td><td>Moderately</td><td></td><td></td><td></td><td>Extremely</td></tr>',
// 				      css: {width:'600px'}})
// 		    ),
// 		    choices: ['1','2','3','4','5','6','7','8','9']
// 		}
// 		timeline.push(likertTrial);
// 	    }
// 	}
//     }

    return timeline;
}

// function exptGen (stims, nstims, peers, npeers, opts) {
//     var timeline = [];
//
//     stims.shuffle();
//     peers.shuffle();
//     var block_num = 0;
//     opts = opts || {};
//     while (stims.length >= nstims && peers.length >= npeers) {
// 	opts['block_num'] = block_num;
// 	var p = peers.splice(0, npeers);
// 	[].push.apply(timeline,
// 		      samTimelineGen(stims.splice(0, nstims), p, opts)
// 		     );
// 	block_num++;
//     }
//     return timeline;
// }
//
// function pad(arg) {
//
// }

function table(trs) {
    var $table = $('<table>');
    for(var i = 0; i < trs.length; i++) {
	$table.append(trs[i]);
    }
    return $table;
}

function tr(tds) {
    var $tr = $('<tr>');
    for(var i = 0; i < tds.length; i++) {
	$tr.append(tds[i]);
    }
    return $tr;
}

function tablify(arr) {
    var $table = $('<table>');
    for(var i = 0; i < arr.length; i++) {
	var $tr = $('<tr>');
	for(var j = 0; j < arr[i].length; j++) {
	    var $td = $('<td>');
	    $td.html(arr[i][j]);
	    $tr.append($td);
	}
	$table.append($tr);
    }
    return $table;
}

function defined(arg) {
    if (typeof arg != 'undefined') {
	return true;
    } else {
	return false;
    }
}

function shuffleTogether(l1, l2) {
    toShuffle = [l1, l2];
    toShuffle = toShuffle.transpose();
    toShuffle.shuffle();
    toShuffle = toShuffle.transpose();
    return toShuffle;
}
