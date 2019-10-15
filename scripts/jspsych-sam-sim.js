var resp, mouse_listener_instructs, keyboard_listener;
/**
 * jspsych-sam-sim.js
 * Josh de Leeuw
 * Zach Ingbretsen
 *
 * Latent grouping trial design
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins.similarity = (function() {

    var resp, mouse_listener_instructs, keyboard_listener, trial_data;
    var plugin = {};


    jsPsych.pluginAPI.registerPreload('similarity', 'stimuli', 'image',function(t){ return !t.is_html || t.is_html == 'undefined'});
    jsPsych.pluginAPI.registerPreload('similarity', 'peers', 'image',function(t){ return !t.is_html || t.is_html == 'undefined'});

    plugin.info = {
	name: 'similarity',
	description: '',
	parameters: {
	    stimuli: {
		type: [jsPsych.plugins.parameterType.STRING],
		default: undefined,
		array: true,
		no_function: false,
		description: ''
	    },
	    peers: {
		type: [jsPsych.plugins.parameterType.STRING],
		default: undefined,
		array: true,
		no_function: false,
		description: ''
	    },
	    names: {
		type: [jsPsych.plugins.parameterType.STRING],
		default: undefined,
		array: true,
		no_function: false,
		description: ''
	    },
	    choices: {
		type: [jsPsych.plugins.parameterType.STRING],
		default: undefined,
		array: true,
		no_function: false,
		description: ''
	    },
	    fMRI: {
		type: [jsPsych.plugins.parameterType.BOOL],
		default: false,
		no_function: false,
		description: ''
	    },
	    is_html: {
		type: [jsPsych.plugins.parameterType.BOOL],
		default: false,
		no_function: false,
		description: ''
	    },
	    labels: {
		type: [jsPsych.plugins.parameterType.STRING],
		array: true,
		default: ['Not at all similar', 'Identical'],
		no_function: false,
		description: ''
	    },
	    intervals: {
		type: [jsPsych.plugins.parameterType.INT],
		default: 100,
		no_function: false,
		description: ''
	    },
	    show_ticks: {
		type: [jsPsych.plugins.parameterType.BOOL],
		default: false,
		no_function: false,
		description: ''
	    },
	    show_response: {
		type: [jsPsych.plugins.parameterType.SELECT],
		options: ['FIRST_STIMULUS', 'SECOND_STIMULUS','POST_STIMULUS'],
		default: 'FIRST_STIMULUS',
		no_function: false,
		description: ''
	    },
	    timing_post_trial: {
		type: [jsPsych.plugins.parameterType.INT],
		default: 0,
		no_function: false,
		description: ''
	    },
	    timing_image_gap: {
		type: [jsPsych.plugins.parameterType.INT],
		default: 1000,
		no_function: false,
		description: ''
	    },
	    testing: {
		type: [jsPsych.plugins.parameterType.BOOL],
		default: '',
		no_function: false,
		description: ''
	    },
	    prompt: {
		type: [jsPsych.plugins.parameterType.STRING],
		default: '',
		no_function: false,
		description: ''
	    },
	    phase: {
		type: [jsPsych.plugins.parameterType.STRING],
		default: '',
		no_function: false,
		description: ''
	    }
	}
    }

    plugin.trial = function(display_element, trial) {

	function ifelse(arg, arg_def) {
	    return (typeof arg === 'undefined') ? arg_def : arg;
	}

	function custTimeout(func, time) {
	    console.log("custTimeout");
	    time = ifelse(time, 0);
	    if (time > 0) {
		jsPsych.pluginAPI.setTimeout(function() {
		    console.log("executing:");
		    console.log(func);
		    func();
		}, time);
	    } else {
		func();
	    }
	}

	// default parameters
	trial.labels		= (typeof trial.labels === 'undefined')		? ["Not at all similar", "Identical"] : trial.labels;
	trial.intervals		= trial.intervals || 100;
	trial.show_ticks	= ifelse(trial.show_ticks, false);
	//(typeof trial.show_ticks === 'undefined')	? false : trial.show_ticks;

	trial.show_response = trial.show_response || "SECOND_STIMULUS";
	trial.mystery = trial.mystery || ['img/mystery1.jpg', 'img/mystery2.jpg'];

	trial.timing_post_trial		= (typeof trial.timing_post_trial === 'undefined') ? 1000: trial.timing_post_trial ; // default 1000ms
	trial.timing_image_gap		= trial.timing_image_gap || 1000; // default 1000ms

	trial.is_html	= (typeof trial.is_html === 'undefined') ? false : trial.is_html;
	trial.prompt	= (typeof trial.prompt === 'undefined') ? '' : trial.prompt;
	trial.testing	= (typeof trial.testing === 'undefined') ? false : trial.testing;
	trial.practice	= (typeof trial.practice === 'undefined') ? false : trial.practice;
	trial.names	= (typeof trial.names === 'undefined') ? trial.peers : trial.names;

	trial.center_percent	= trial.center_percent	|| 75 ;
	trial.fMRI		= trial.fMRI		|| false ;
	trial.phase		= trial.phase		|| "" ;
	trial.peerDir		= trial.peerDir		|| 'img/agents/';
	trial.peerExt		= (typeof trial.peerExt === 'undefined') ? '.jpg' : trial.peerExt ;
	trial.stimDir		= (typeof trial.stimDir === 'undefined') ? 'img/movies/': trial.stimDir;
	trial.stimTableWidth	= trial.stimTableWidth	|| '600px';
	trial.prefix		= trial.prefix		|| 'jspsych-';
	trial.mysteryCorrect	= trial.mysteryCorrect	|| 'B';
	trial.peerCPercent      = trial.peerCPercent    || '';

	trial.respDelay      = trial.respDelay    || 0;

	trial.yes_no_labels	= (typeof trial.yes_no_labels === 'undefined') ? true : trial.yes_no_labels;

	trial.prompt = trial.prompt.replace(/\${peer}/, trial.names[trial.peer]);

	trial.timeoutBeforeFeedback	= ifelse(trial.timeoutBeforeFeedback, 0);
	trial.timeoutBeforeMystery	= ifelse(trial.timeoutBeforeMystery, 0);
	trial.timeoutBeforePrompt	= ifelse(trial.timeoutBeforePrompt, 0);
	trial.timeoutBeforeResponse	= ifelse(trial.timeoutBeforeResponse, 0);
	trial.timeoutBeforeStim		= ifelse(trial.timeoutBeforeStim, 0);
	trial.timeoutAfterFeedback	= ifelse(trial.timeoutAfterFeedback, 0);
	trial.timeoutAfterFeedbackMystery = ifelse(trial.timeoutAfterFeedbackMystery, 0);
	trial.timeoutAfterStim		= ifelse(trial.timeoutAfterStim, 0);

	// if any trial variables are functions
	// this evaluates the function and replaces
	// it with the output of the function

	trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	var startTime, keyboard_listener, practice_keyboard_listener, keyboard_listener2;

	showBlankScreen();

	if (trial.practice) {
	    $('#' + trial.prefix + 'progressbar-container').hide();
	    trial.timing_post_trial = 0;
	} else {
	    $('#' + trial.prefix + 'progressbar-container').show();
	}


	function showBlankScreen() {
	    //$(display_element).css('visibility', 'hidden');
	    $('#jspsych-stim').css('visibility', 'hidden');
	    if (trial.phase == "FIRST") {
		writeHTML();
	    }
	    if (trial.peer == 0) {
		$('#' + trial.prefix + 'history_table').append(
		    addHistoryRow()
		);
	    }

	    custTimeout(showNextStim, trial.timeoutBeforeStim);
	}

	function createHistoryTable () {

	    var $div = $('<div>', {
		id: trial.prefix + 'history',
		css: {width: '600px'}
	    });

	    var $table = $('<table>', {
		id: trial.prefix + 'history_table',
		css: {
		}
	    });

	    var $tr_pic = $('<tr>');
	    var $tr_name = $('<tr>');

	    for (var j = 0; j < trial.peers.length; j++) {
		$tr_pic.append($('<td>', {
		    //width: "25%"
		}).html($('<div>', {
		    css: {
			//width: '25%'
		    }
		}).append(
		    $('<img>', {
			src: trial.peerDir + trial.peers[j] + trial.peerExt,
			class: 'history',
		    }
		     ).addClass(trial.peer_label[j]))
		       )
			      );
		$tr_name.append($('<td>', {
		    //width: "25%"
		}).html(
		    $('<p>', {
			text: trial.names[j],
			class: 'history',
		    }
		     ).addClass(trial.peer_label[j])
		)
			       );
	    }

	    $table.append($tr_pic);
	    $table.append($tr_name);
	    $div.append($table);
	    return $div;
	}

	function addHistoryRow() {
	    var $tr = $('<tr>');
	    for (var j = 0; j < trial.peers.length; j++) {
		$tr.append($('<td>'));
	    }
	    return $tr;
	}

	function createStimTable() {
	    var $div = $('<div>', {
		id: trial.prefix + 'stim',
		css: {
		    width: trial.stimTableWidth,
		}
	    });

	    var $table = $('<table>', {
		'id': trial.prefix + 'stim_table',
	    })

	    var $prompt = $('<tr>').append($('<td>', {
		html: '<h5 id="jspsych-prompt">',
		width: trial.stimTableWidth,
		colspan: 2
	    }));

	    var $tr = $('<tr>');
	    for (var i = 0; i < trial.stimuli.length; i++) {
		var $td = $('<td>', {
		    id: 'jspsych-choice_' + i
		});
		$tr.append($td);
	    }

	    var $tr_label = $('<tr>');
	    for (var i = 0; i < trial.stimuli.length; i++) {
		var $td = $('<td>', {
		    id: 'jspsych-label_' + i,
		    "class": "jspsych-label",
		});
		$tr_label.append($td);
	    }

	    var $tr_sub_label = $('<tr>');
	    for (var i = 0; i < trial.stimuli.length; i++) {
		var $td = $('<td>', {
		    id: 'jspsych-sub-label_' + i,
		    "class": "jspsych-sub-label",
		});
		$tr_sub_label.append($td);
	    }


	    $table.append($prompt);
	    $table.append($tr_label);
	    $table.append($tr);
	    $table.append($tr_sub_label);
	    $div.append($table);
	    return $div;
	}

	function writeHTML() {
	    $(display_element).empty();

	    var $historyTable = createHistoryTable();
	    var $stimTable = createStimTable();

	    var $displayTable = $('<div>').append(
		$('<div>').append(
		    $('<div>', {
			html: $stimTable,
			css: {
			    //width: '80%'
			    float: 'left',
			    position: 'relative',
			    //width: '200px',
			    top: '0px',
			    left: '0px'

			}
		    })
		).append(
		    $('<div>', {
			html: $historyTable,
			css: {
			    //width: "10%"
			    float: 'right',
			    position: 'relative',
			    width: '300px',
			    top: '0px',
			    //left: trial.stimTableWidth,
			    'margin-left': '30px',
			}
		    })
		)
	    );

	    display_element.append($displayTable);
	    display_element.prepend($('<div>', {
		id: 'header',
		css: {
		    //height: '50px',
		    //'background-color': 'blue',
		}
	    }));
	    $stimTable.append($('<div>', {id: "jspsych-peer"}));
	}

	function writeStims() {
	    for(var i = 0; i < trial.stimuli.length; i++) {
		var label = '';
		$('#jspsych-label_' + i).html($('<p>', {
		    text: trial.choices[i].toUpperCase(),
		    css: {
			margin: '0px',
			height: '25px',
		    }
		}));
		if (trial.stim_label != undefined) {
		    $('#jspsych-label_' + i).append(
			$('<p>', {
			    text: trial.stim_label[i].toUpperCase(),
			    css: {
				margin: '0px',
				height: '25px',
				color: 'gray',
			    }
			})		    );
		}

		$('#jspsych-choice_' + i).html($('<img>', {
		    src: trial.stimDir + trial.stimuli[i],
		    class: 'stim',
		}));

		if (trial.yes_no_labels == true) {
		    if (trial.stimuli[i].indexOf('xes') >= 0) {
			var lab = "NO";
		    } else if (trial.stimuli[i].indexOf('oes') >= 0) {
			var lab = "YES";
		    } else {
			var lab = "";
		    }
		    $('#jspsych-sub-label_' + i).empty().append(
			$('<p>', {
			    text: lab,
			    css: {
				margin: '0px',
				height: '25px',
				color: 'gray',
			    }
			})		    );
		}
	    }
	    $('#jspsych-stim').css('visibility', 'visible');
	}

	function showNextStim() {
	    if (trial.phase == "MYSTERY") {
		custTimeout(askMystery,trial.timeoutBeforeMystery);
		custTimeout(startKeyListener, trial.timeoutBeforeResponse +
			   trial.timeoutBeforeMystery);
	    } else {
		custTimeout(askPref, trial.timeoutBeforePrompt);
		custTimeout(writeStims, trial.timeoutBeforeStim);
		var max_t = Math.max(trial.timeoutBeforePrompt,trial.timeoutBeforeStim);
		custTimeout(startKeyListener, trial.timeoutBeforeResponse + max_t);
	    }

	    //$(display_element).css('visibility', 'visible');

	    if (trial.practice == true) {
		var mouse_listener_instructs = function(e) {
		    function setTrialInstructs() {
			if (typeof trial.instructsAfterClick != 'undefined') {
			    var newPrompt = trial.instructsAfterClick.replace(
				    /\${peer}/, trial.names[trial.peer]
			    );
			    $('#jspsych-prompt').html(newPrompt);
			}
		    }
		    $('#feedbackContinue').unbind('click', mouse_listener_instructs);
		    $('#continueBlock').remove();
		    setTrialInstructs();
		    startKeyListener();
		};

		stopKeyListener();
		//console.log('askpref');
		appendContinue(mouse_listener_instructs, trial.trialButtonLabel);
	    }
	}

	function askMystery() {
	    writePrompt();

	    for(var i = 0; i < trial.stimuli.length; i++) {
		$('#jspsych-choice_' + i).html($('<img>', {
		    src: trial.stimDir + trial.mystery[i],
		    class: 'stim mystery' ,
		}));
		$('#jspsych-sub-label_' + i).empty()
	    }


	    for(var i = 0; i < trial.stimuli.length; i++) {
		var label = '';
		$('#jspsych-label_' + i).html($('<p>', {
		    text: trial.choices[i].toUpperCase(),
		    css: {
			margin: '0px',
			height: '25px',
		    }
		}));
	    }

	    $('#jspsych-peer').html(
		$('<div>', {id: 'jspsych-peer-pic'}).append(
		    $('<img>', {src: trial.peerDir + 'arrowL.jpg', width: '25%'})
		).append(
		    $('<div>', {css: {display: 'inline-block'}}).append(
			$('<img>', {
			    src: trial.peerDir + trial.peers[trial.peer1] + trial.peerExt,
			    width: '100%',
			    class: "mystery" + trial.peer_label[trial.peer1],
			})
		    ).append(
			$('<p>').text(trial.names[trial.peer1])
		    )
		).append(
		    $('<div>', {css: {display: 'inline-block'}}).append(
			$('<img>', {
			    src: trial.peerDir + trial.peers[trial.peer2] + trial.peerExt,
			    width: '100%',
			    class: "mystery" + trial.peer_label[trial.peer2],
			})
		    ).append(
			$('<p>').text(trial.names[trial.peer2])
		    )
		).append(
		    $('<img>', {src: trial.peerDir + 'arrowR.jpg', width: '25%'})
		)

	    ).append(
		$('<p>', {id: 'jspsych-peer-name'}).text(trial.names[trial.peer])
	    );

	    $('#jspsych-peer-pic>div').css( {
		'width': '20%'
	    });
	    $('#jspsych-peer-pic>div>img').css( {
		'width': '85%'
	    });
	    $('#jspsych-peer-pic>img').css( {
		'width': '20%'
	    });

	    $('#jspsych-stim').css('visibility', 'visible');
	}

	function writePrompt() {
	    if (trial.phase == "MYSTERY") {
		var mysteryPeers = []
		mysteryPeers.push(trial.peer_compare.indexOf(1));
		mysteryPeers.push(
		    trial.peer_compare.slice(mysteryPeers[0] + 1).indexOf(1) + mysteryPeers[0] + 1
		);
		mysteryPeers.shuffle();

		trial.peer1 = mysteryPeers.pop();
		trial.peer2 = mysteryPeers.pop();
		trial.prompt = trial.prompt.replace(/\${peer1}/, trial.names[trial.peer1]);
		trial.prompt = trial.prompt.replace(/\${peer2}/, trial.names[trial.peer2]);
	    } else {
		trial.prompt = trial.prompt.replace(/\${peer}/, trial.names[trial.peer]);
	    }

	    if (trial.practice) {
		$('#jspsych-prompt').html(
		    $('<p>', {
			html: trial.prompt,
			css: {
			}
		    })
		).addClass('practice');
	    } else {

		if (trial.phase == "MYSTERY") {
		    var marg = 50;
		} else {
		    var marg = 20;
		}
		$('#jspsych-prompt').html(
		    $('<p>', {
			html: trial.prompt,
			css: {
			    height: '0px',
			    'margin-bottom': marg + 'px',
			    'margin-top': '0px',
			}
		    })
		);
	    }
	}

	function appendContinue(listener, text) {
	    //console.log(listener);
	    var $div = $('<div>', {
		id: 'continueBlock',
	    });
	    var $p = $('<p>', {
		html: text,
	    });

	    var $butt = $('<input>')
		.attr('type', 'button')
		.attr('value', 'Continue')
		.attr('id', 'feedbackContinue')
		.on('click', listener);

	    $div.append($p).append($butt);
	    $('#jspsych-prompt').append($div);
	}

	function askPref() {
	    writePrompt();


	    if (trial.names[trial.peer].toLowerCase() == "you") {
		$('#jspsych-peer').empty();
	    } else {
		$('#jspsych-peer').html(
		    $('<p>', {id: 'jspsych-peer-ACC'})
		).append(
		    $('<div>', {id: 'jspsych-peer-pic'}).append(
			$('<img>', {
			    src: trial.peerDir + trial.peers[trial.peer] + trial.peerExt,
			    class: 'peer',
			})
		    )
		).append(
		    $('<p>', {id: 'jspsych-peer-name'}).text(trial.names[trial.peer])
		);
	    }

	}

	function showFeedback( trial_data ) {

	    var mouse_listener = function(e) {
		$('#feedbackContinue').unbind('click', mouse_listener);
		jsPsych.finishTrial(trial_data);
	    };

	    //console.log('showing feedback');
	    var $histAppend = $($('#jspsych-history_table tr').slice(-1).children()[trial.peer]);

	    if (trial.phase != "MYSTERY") {
		//console.log('not mystery');
		if (trial.peer != 0) {
		    /*
		      $('#jspsych-peer').html(
		      $('<p>').text(trial.peers[trial.peer])
		      );
		      $('#jspsych-peer').append(
		      $('<img>', {src: trial.peer_pics[trial.peer]})
		      );
		    */


		    $histAppend.append(
			$('<img>', {
			    src: trial_data.peerChoice,
			    class: 'history',
			})
		    )

		    if (trial_data.ACC == 1) {
			$('#jspsych-peer-ACC').text( "CORRECT").css({color: 'green'});
		    } else {
			$('#jspsych-peer-ACC').text( "INCORRECT").css({color: 'red'});
		    }
		} else {
		    $histAppend.append(
			$('<img>', {
			    src: trial_data.respChoice,
			    class: 'history',
			}).addClass('self')
		    )
		}

		if (!trial.practice || trial.feedbackPrompt == undefined || trial.phase == "MYSTERY" ) {
		    custTimeout(function () {
			jsPsych.finishTrial(trial_data);
		    }, trial.timeoutAfterFeedback);
		} else {
		    if (trial.feedbackChoices == 'mouse' || trial.feedbackChoices == 'click') {
			//console.log('feedbackChoices == mouse');
			appendContinue(mouse_listener, trial.feedbackButtonLabel);
		    } else {
			practice_keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
			    callback_function: function () {
				jsPsych.pluginAPI.cancelKeyboardResponse(practice_keyboard_listener);
				jsPsych.finishTrial(trial_data);
			    },
			    valid_responses: [' '],
			    rt_method: 'date',
			    persist: true,
			    allow_held_key: false
			});
		    }

		    if (trial.feedbackPrompt) {
			//console.log('yes, feedbackPrompt');
			$('#jspsych-prompt').html(trial.feedbackPrompt);


			if (trial.feedbackChoices == 'mouse' || trial.feedbackChoices == 'click') {
			    //console.log('yes, feedbackChoices is mouse or click');
			    appendContinue(mouse_listener, trial.feedbackButtonLabel);
			} else {
			    $('#jspsych-prompt').append(
				$('<p>', {
				    text: "Press the Spacebar to continue"
				}));
			}

		    }

		}


		//console.log('drawing arrow');

		if (trial_data.peerSide == 'left') {
		    $('#jspsych-peer-pic').prepend(
			$('<img>', {
			    src: trial.peerDir + 'arrowL.jpg',
			    class: 'peer',
			})
		    );
		} else {
		    $('#jspsych-peer-pic').append(
			$('<img>', {
			    src: trial.peerDir + 'arrowR.jpg',
			    class: 'peer',
			})
		    );
		}

	    } else {
		custTimeout(function () {
		    jsPsych.finishTrial(trial_data);
		}, trial.timeoutAfterFeedbackMystery);
	    }
	}

	function fmriAdvance() {

	}

	function startKeyListener() {
	    startTime = (new Date()).getTime();
	    keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
		callback_function: logResp,
		valid_responses: trial.choices,
		rt_method: 'date',
		persist: true,
		allow_held_key: false
	    });
	    // keyboard_listener2 = jsPsych.pluginAPI.getKeyboardResponse({
	    // 	callback_function: fmriAdvance,
	    // 	valid_responses: ['p'],
	    // 	rt_method: 'date',
	    // 	persist: true,
	    // 	allow_held_key: false
	    // });
	}

	function stopKeyListener() {
	    jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
	}

	function logResp(arg) {
	    stopKeyListener();
	    jsPsych.pluginAPI.clearAllTimeouts();

	    var endTime			= (new Date()).getTime();
	    var response_time		= endTime - startTime;
	    var respCharCode		= arg.key;
	    var respKey			= String.fromCharCode(arg.key);
	    var respChoiceNum		= trial.choices.indexOf(respKey.toLowerCase());
	    var respChoice		= trial.stimDir + trial.stimuli[respChoiceNum];
	    var unselectedChoice	= trial.stimDir + trial.stimuli[(respChoiceNum + 1) % 2];

	    var subjectChoice, subjectUnselected,
		peerChoice, ACC, lastSelfTrial,
		left, right, peerSide;
	    if (trial.peer == 0) {
		subjectChoice = respChoice;
	    } else {
		var selfTrials = jsPsych.data.getData({peerNum: 0});
		lastSelfTrial = selfTrials[selfTrials.length -1];

		subjectChoice = lastSelfTrial.respChoice;
		subjectUnselected = lastSelfTrial.unselectedChoice;

		if (trial.peer_agree[trial.peer] == 1) {
		    peerChoice = subjectChoice;
		} else {
		    peerChoice = subjectUnselected;
		}

		if (respChoice == peerChoice && trial.phase != "MYSTERY") {
		    ACC = 1;
		} else {
		    ACC = 0;
		}
		left = trial.stimDir + trial.stimuli[0];
		right = trial.stimDir + trial.stimuli[1];
		if (peerChoice == left) {
		    peerSide = 'left';
		} else {
		    peerSide = 'right';
		}
	    }

	    var correctChoice	= trial.peer_agree[trial.peer] == 1 ?
		trial.stimuli[respChoiceNum] :
		trial.stimuli[(respChoiceNum + 1) % 2];

	    var peerName	= trial.names[trial.peer];
	    var peerImg 	= trial.peers[trial.peer];
	    var mysteryPeers = [trial.peer1, trial.peer2];

	    var trial_data = {
		"rt"			: arg.rt,
		"respCharCode"		: respCharCode,
		"respKey"		: respKey,
		"respChoiceNum"		: respChoiceNum,
		"respChoice"		: respChoice,
		"unselectedChoice"	: unselectedChoice,
		"subjectChoice"		: subjectChoice,
		"peerChoice"		: peerChoice,
		"stimuli"		: JSON.stringify(trial.stimuli),
		"peerNum"		: trial.peer,
		"peerName"		: peerName,
		"peerImg"		: peerImg,
		"peerSide"		: peerSide,
		"ACC"			: ACC,
		"MysteryPeer1"		: trial.peer1,
		"MysteryPeer2"		: trial.peer2,
		"phase"			: trial.phase,
		"peerCPercent"		: trial.peerCPercent,
	    };
	    if (trial.phase == "MYSTERY") {
		trial_data['mysteryRespKey'] = respKey;
		// Chosen mystery peer
		trial_data['mysteryPeerChosenImg'] = trial.peers[mysteryPeers[respChoiceNum]];
		trial_data['mysteryPeerChosenName'] = trial.names[mysteryPeers[respChoiceNum]];
		trial_data['mysteryLabelChosen'] = trial.peer_label[mysteryPeers[respChoiceNum]];
		// Unchosen mystery peer
		trial_data['mysteryPeerUnchosenImg'] = trial.peers[mysteryPeers[(respChoiceNum + 1) % 2]];
		trial_data['mysteryPeerUnchosenName'] = trial.names[mysteryPeers[(respChoiceNum + 1) % 2]];
		trial_data['mysteryLabelUnchosen'] = trial.peer_label[mysteryPeers[(respChoiceNum + 1) % 2]];

		if (trial_data['mysteryLabelChosen'] == trial.mysteryCorrect) {
		    trial_data['ACC'] = 1;
		} else {
		    trial_data['ACC'] = 0;
		}
	    }

	    for(var i = 0; i < trial.peers.length; i++) {
		trial_data["PeerImg" + i] = trial.peers[i];
		trial_data["PeerName" + i] = trial.names[i];
		trial_data["PeerAgreement" + i] = trial.peer_agree[i];
		trial_data["PeerCompare" + i] = trial.peer_compare[i];
		trial_data["PeerLabel" + i] = trial.peer_label[i];
	    }

	    custTimeout(function () {showFeedback(trial_data);}, trial.timeoutBeforeFeedback);
	}

	function jitter() {
	}

    };
    return plugin;
})();
