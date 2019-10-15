//Use this to edit instruction prompts
function practiceGenPoli(opts) {
    var timeline = [
      {
	    "type":"similarity",
	    "prompt":"<span>Which position do you think <u>${peer}</u> chose?</span>",
	    "peers":["You", "Bugs","Daffy"],
	    "peer_agree":[1,0,1],
	    "peer_compare":[0,1,1],
	    "peer_label":['Self', 'A', 'B'],
	    "stimuli":["xes/example/example.jpg","oes/example/example.jpg"],
	    "choices":["e","i"],
	    "peerExt": ".jpg",
	    "trialButtonLabel": "Once you have finished reading these instructions, click continue to try it out for yourself.<br>",
	    "feedbackButtonLabel": "Click Continue to proceed:<br>",
	    "practice": true,
	    "stimDir" : "",
	    "timeline":[
        {"phase": "FIRST",
        "prompt":"You will be asked about your opinions on //INSERT WHAT IS RELEVANT TO YOU HERE//. Take a moment to consider your stance. When each new pair of positions is presented, you will be asked to select the stance you would take with the E or I key on your keyboard. Also, notice the table on the right, displaying your and others' choices.<br>\
Take a moment to consider these positions now.<br>\
<br>Should cartoons include plotlines involving duck-hunting?\
<br>Which would you choose?<br>\
Note that the red X always means NO and the green check always means YES<br>",
		 "instructsAfterClick":"Try making your selection now:<br>\
<br>Should cartoons include plotlines involving duck-hunting?\
<br>Which would you choose?<br>\
Note that the red X always means NO and the green check always means YES<br>",
		 "peer":0,
		 "feedbackChoices": "mouse",
		 "feedbackPrompt": "Great job! After choosing your own preference, you will be asked to make guesses about the preferences of several other participants for the same policy decision.",
		},
		{"peer":1,
		 "prompt":"After choosing your own preference, you will be asked to make guesses about the preferences of several other participants for the same policy decision.\
<br>Should cartoons include plotlines involving duck-hunting?\
<br>Which policy stance do you think ${peer} chose?",
		 'feedbackPrompt': 'You will receive feedback about their true preferences (indicated by an arrow pointing towards the participant\'s preferred policy position).\
<br>This feedback will remain on the screen for one second before you can make a guess for the next person. Note that their responses are being recorded in the table on the right.\
<br>Note that their responses are being recorded in the table on the right.<br>',
		 "instructsAfterClick":"Try making your selection now:<br>\
<br>Should cartoons include plotlines involving duck-hunting?\
<br>Which policy stance do you think ${peer} chose?",
		 "feedbackChoices": "mouse",
		},
		{"peer":2,
		 "prompt":"Other participants may agree or disagree on their preferences.\
<br>Should cartoons include plotlines involving duck-hunting?\
<br>Which policy stance do you think ${peer} chose?",
		 'feedbackPrompt': 'Initially you may not know anything about the other participants, but by observing their policy choices you can gradually improve your guesses.',
		 "feedbackChoices": "mouse",
		},
		{"phase":"MYSTERY","prompt":"</p></h3><p>Periodically, you will be given a choice between two \"mystery\" boxes, each of which contains a policy decision. The only information you have about the decisions in these boxes are the choices of other participants (indicated by arrows) who got to look inside the boxes before choosing. These participants will be the same ones whose choices you saw for other decisions. <br><br>Which one would you choose? Remember, ${peer1} and ${peer2} know what's inside the boxes.",
		 //Select the box you would prefer based on the other participants' choices to continue.
		 "peer1":1,
		 "peer2":2,
		 "stim_label": ['',''],
		}]},
    ];

    var info_screen = {
      "type": "instructions",
      "show_clickable_nav": false,
      "key_forward": " ",
      "pages": ['<br><br><strong>After that, you will continue with a new set of policy decisions, along with a new set of other participants.<br><br>Press the SPACEBAR to continue on to the actual task.</strong>']
    };
    timeline.push(info_screen);

    return timeline;
}
