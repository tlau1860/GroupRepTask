var study = "studyname";
var NBLOCKS = 4;
var NSTIMS = 8; //Per block
var NPEERS = 3; //Per block




var subjID = getSubjID(8);
var testing = $.url().param('testing');
if (testing == 1) {
    testing = true;
} else {
    testing = false;
}

var block;

var timing = {
    timeoutBeforePrompt		: 0,
    timeoutBeforeStim		: 0,
    timeoutBeforeResponse	: 1000, // Before they can make resp after prompt/stim
    timeoutBeforeMystery	: 2000,
    timeoutBeforeFeedback	: 0, // This is evil. Don't use it
    timeoutAfterFeedback	: 1000,
    timeoutAfterFeedbackMystery	: 1000,
    timing_post_trial		: 500,
};

var you_timing = {
    timeoutBeforePrompt		: 0,
    timeoutBeforeStim		: 0,
    timeoutBeforeResponse	: 2000, // Before they can make resp after prompt/stim
};

var peerC = [12.5, 87.5].rep(2);  // 4 blocks, half-and-half


//ONLY TEXT, PREAMBLES, AND HTML SHOULD BE CHANGED BEYOND THIS POINT.
var peers = {'f': females, 'm': males, 'a': mixed_genders};

var practice_timeline = practiceGenPoli({});

var toShuffle = shuffleTogether(stims.stimuli, stims.prompts);
stims.stimuli = toShuffle[0];
stims.prompts = toShuffle[1];

var timeline = [];

var welcome_block = {
    type: "text",
    text: "<div class='center-content'><br><br><br><br>Welcome to the experiment. Click the button to begin.<br><input type='button' value='Continue'/>",
    choices: 'mouse',
};

var comments_block = {
    type: 'survey-text-sam',
    questions: ['Comments'],
    //value: MID,
    validation: [function(x){if (x=='') {x = ' ';} return x;} ],
    rows: [4],
    input_type: 'textarea',
    preamble: ["<div> We would be grateful for any feedback in the event that you found any aspect(s) of the study unclear. Please use the space below to record any questions, comments, or feedback you may have. Thank you! </div>"],
};


var demo_block = {
    type: 'survey-text-sam',
    questions: ["Age: ", "Ethnicity: ", "Gender: "],
    validation: [function(x){if (x=='') {return false;}; return Number(x); }, function(x){return x.length > 0;}, function(x){if (typeof x == "number") {
	return false;
    } else if (Number(x) == x) {
	console.log('number x == x');
	return false;
    } else {
	return x.length>0;
    }}],
    validationMessage: ["Age must be a number", "Please enter your ethnicity", "Please enter your gender"],
    preamble: [" <div>\
    <h4>Choices </h4>\
    <p> In this task, you will be asked to choose which of two choices you prefer and to guess about the preferences of several other people for the same decisions. </p>\
    <p> Periodically, you will be given a choice between two 'mystery' boxes, which will be further explained in the example. </p>\
    <p> In total, you will make choices for 35 sets of decisions. The task should take less than 15 minutes. </p>\
    <p> Please enter some additional information and click \"Submit Answers\" to continue onto an example. </p>\
    <p style='font-size:small'> <strong>Do not</strong> refresh your browser when doing this task. If you do, you will have to repeat all of the trials you have already submitted. </p>\
    \
    <p> <strong>Technical requirements:</strong> </p>\
    <p style='font-size:small'> Please allow permission for Javascript to run on this site and disable any script blockers that are running. </p>\
    </div>"],
    on_finish: function(trial_data){
      var gender = trial_data['Q2'].trim().toLowerCase();
      if (gender.search(/woman|female|girl/) >= 0 || gender == 'f') {
        g = 'f';
        jsPsych.data.addDataToLastTrial({gender: 'female'});
      } else if (gender.search(/man|male|boy|guy/) >= 0 || gender == 'm') {
        g = 'm';
        jsPsych.data.addDataToLastTrial({gender: 'male'});
      }
      else {
        g = 'a';
        jsPsych.data.addDataToLastTrial({gender: 'other'});
      }

      jsPsych.data.addDataToLastTrial({age: trial_data['Q0'], ethnicity: trial_data['Q1']});

	for(var i = 0; i < NBLOCKS; i++) {
	    var stim = stims.stimuli.splice(0,NSTIMS);
	    var prompts = stims.prompts.splice(0,NSTIMS);
	    var peer = peers[g][0].splice(0, NPEERS);
	    var names = peers[g][1].splice(0, NPEERS);
	    var opts = {
        includeLikert: false,
        testing: testing,
        stimDir: stims.stimDir,
        block_num: i,
        peerAgreement: [50, {percent: 50, ref: "A", func: inverseVotes}, {percent: peerC[i], ref: "B", func: addVotes}],
        testing: testing,
        peerCPercent: peerC[i],
        stim_regex: /.*\/(.*)\.jpg/,
        prompt_regex: /How (.*) is this.*/,
        timing: timing,
        you_timing: you_timing,
      };

      block = poliTimelineGenNames(stim, prompts, peer, names, opts);
	    block.type = 'similarity';
	    for(var j = 0; j < block.length; j++) {
        jsPsych.addNodeToEndOfTimeline(block[j], function(){});
      }
    }
    jsPsych.addNodeToEndOfTimeline(comments_block);
  }
};


var fullscreen_block = {
    "type": "instructions",
    "show_clickable_nav": true,
    "key_forward": "",
    "pages": ['Please enter FULLSCREEN mode in your browser if you are not already in FULLSCREEN mode by clicking on View > Enter Full Screen or by pressing F11 (on most PCs) or ctrl + cmd + f or cmd + escape (on most Macs).<br><br>Click to continue.</strong>']
};

var practice_warning_block = {
    "type": "instructions",
    "show_clickable_nav": true,
    "key_forward": "",
    "pages": ['You will now learn more about the task and do some practice trials.<br><br>Click to continue.</strong>']
};

timeline.push(welcome_block);
timeline.push(demo_block);
timeline.push(fullscreen_block);
timeline.push(practice_warning_block);

timeline.push.apply(timeline,practice_timeline);

peerC.shuffle();

jsPsych.pluginAPI.preloadImages(stims, function () {

    if (testing) {
      timeline = [id_block, demo_block];
      var fs = false;
    }
    else {
      var fs = true;
    }

    jsPsych.init({
      timeline: timeline,
      show_progress_bar: true,
      fullscreen: fs,
      on_finish: function() {
        var data = jsPsych.data.getDataAsCSV();

     try {
       var d = jsPsych.data.getDataAsJSON({trial_type: 'survey-text'})
     }
     catch (e) {}
     var gend;
     if (g == 'f') {
       gend = 'female';
     }
     else if (g == 'm') {
       gend = 'male';
     }
     else {
       gend = 'other';
     }

     $('#jspsych-content').empty()
     .css('visibility', 'visible')
     .html('You are now done with the task! Please notify the experimenter. <br><br>' + subjID);

     var filename = subjID+'_'+study+'.csv';
     jsPsych.data.localSave(filename,'csv');
    }
  });
});
