/**
 * jspsych-survey-dropdown
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 * Zach de Ingbretsen
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['survey-dropdown'] = (function() {

    var plugin = {};

    plugin.info = {
	name: 'survey-dropdown',
	description: '',
	parameters: {
	    questions: {
		type: [jsPsych.plugins.parameterType.STRING],
		array: true,
		default: undefined,
		no_function: false,
		description: ''
	    },
	    choices: {
		type: [jsPsych.plugins.parameterType.STRING],
		array: true,
		default: undefined,
		no_function: false,
		description: ''
	    },
	    premable: {
		type: [jsPsych.plugins.parameterType.STRING],
		default: '',
		no_function: false,
		description: ''
	    },
	}
    }

    plugin.trial = function(display_element, trial) {

	trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;

	// if any trial variables are functions
	// this evaluates the function and replaces
	// it with the output of the function
	trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

	
	// show preamble text
	display_element.empty().append($('<div>', {
	    "id": 'jspsych-survey-dropdown-preamble',
	    "class": 'jspsych-survey-dropdown-preamble'
	}));

	$('#jspsych-survey-dropdown-preamble').html(trial.preamble);

	// Warning message area
	display_element.append($('<div>', {
	    id: 'warning',
	    css: {color: 'red'}
	}));

	// add questions
	for (var i = 0; i < trial.questions.length; i++) {
	    // create div
	    display_element.append($('<div>', {
		"id": 'jspsych-survey-dropdown-' + i,
		"class": 'jspsych-survey-dropdown-question',
		"css": {
		    "margin": '2em 0em'
		}
	    }));

	    // add question text
	    $("#jspsych-survey-dropdown-" + i).append('<p class="jspsych-survey-dropdown">' + trial.questions[i] + '</p>');

	    // add dropdown box
	    $("#jspsych-survey-dropdown-" + i).append('<select name="#jspsych-dropdown' + trial.names[i] + '" ></select>');
	    for(var j = 0; j < trial.choices.length; j++) {
		$("#jspsych-survey-dropdown-" + i + " select").append(
		    $('<option>').html(trial.choices[j]).attr('value', trial.choices[j])
		);
	    }
	}

	// add submit button
	display_element.append($('<button>', {
	    'id': 'jspsych-survey-dropdown-next',
	    'class': 'jspsych-btn jspsych-survey-dropdown'
	}));

	$("#jspsych-survey-dropdown-next").html('Submit Answers');

	function validate( ) {
	    var validated = true;
	    var trial_data = {};
	    var $warning = $('<div>').attr('id', 'warning');
	    $("div.jspsych-survey-dropdown-question").each(function(index) {

		var resp = $(this).children('select').val();
		var id = $(this).children('select').attr('name');
		console.log(resp);
		console.log(id);

		if (resp == '') {
		    $warning.append(
			$('<p>').html(trial.validationMessage[index])
		    );
		    validated = false;
		} else {
		    trial_data[id] = resp;
		}
	    });
	    if (validated){
		finishTrial(trial_data); 
	    } else {
		$('#warning').html($warning);
	    }
	}

	function finishTrial(trialdata) {
	    // measure response time
	    var endTime = (new Date()).getTime();
	    var response_time = endTime - startTime;

	    // save data
	    $.extend(trialdata, {
		"rt": response_time,
	    });

	    display_element.html('');

	    // next trial
	    jsPsych.finishTrial(trialdata);
	}

	$("#jspsych-survey-dropdown-next").click(validate);

	var startTime = (new Date()).getTime();
    };

    return plugin;
})();
