These are empty scripts to allow you to run your own version of the base experiment found in [Lau, Pouncy, Gershman, & Cikara, 2018](http://dx.doi.org/10.1037/xge0000470) (OSF Repo: https://osf.io/vjbtc/). There are four javascript files and three directories that will need to be edited and/or filled (described below).

To start the task, double click <code>index.html</code>. There is filler text in the code at the moment which will allow everything to run. If using a PC, you may need to set up an Apache server. The script will randomly assign generate and assign an 8-digit subjID. At the end of the experiment, a csv file in the form of subjID_studyname.csv will be saved to wherever your browser saves its downloads.

**Agent Faces**

- <code>agents.js</code> -- This contains the names of the image files used for the agents' faces. Fill this in and replace the filler text.

- <code>img/agents</code> -- image files for agents (eg, femaleface1.jpg and maleface1.jpg) will need be saved here. Do not touch the other files in this directory.

**Policy Stances**

- <code>stims.js</code> -- This contains the image file names for the policy stances as well as the prompt that should appear at the top of the screen with that particular file. Fill this in and replace the filler text.

- <code>oes</code> -- Policy images with a green checkmark (transparent-green-checkmark-hi.jpg) superimposed on top of them need to be saved here. Filenames should be the same as those found in the xes directory.

- <code>xes</code> -- Policy images with a red X (big-red-x.jpg) superimposed on top of them need to be saved here. Filenames should be the same as those found in the oes directory.

**Other Files**

- <code>preload.js</code> -- The script will preload this list of files; designate the path to each image file (agents and policy stances). Fill this in and replace the filler text.

- <code>instructions.js</code> -- This file contains all the text shown during the instruction block. The text has been modified to reflect where you may want to insert your own instructions. Take a look in the experiment to understand which instructions map onto which page.

- <code>main.js</code> -- You will want to edit a few variables in this file (eg, <code>study</code>, which affects the naming of the file, or the timing delays). You can also edit the number of blocks shown or the number of policy stances per block. This file also contains general experimental instructions (eg, "The task is complete."), which probably do not need to be edited.


*Questions or comments? Please e-mail tlau[at]alumni[dot]harvard[dot]edu*
