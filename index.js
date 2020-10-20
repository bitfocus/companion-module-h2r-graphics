var instance_skel = require("../../instance_skel");
var debug;
var log;

function instance(system, id, config) {
 var self = this;

 // super-constructor
 instance_skel.apply(this, arguments);

 self.actions(); // export actions

 // Example: When this script was committed, a fix needed to be made
 // this will only be run if you had an instance of an older "version" before.
 // "version" is calculated out from how many upgradescripts your intance config has run.
 // So just add a addUpgradeScript when you commit a breaking change to the config, that fixes
 // the config.

 self.addUpgradeScript(function () {
  // just an example
  if (self.config.host !== undefined) {
   self.config.old_host = self.config.host;
  }
 });

 return self;
}

instance.prototype.CHOICES_showhide = [
 { id: "show", label: "Show" },
 { id: "hide", label: "Hide" },
];

instance.prototype.CHOICES_pauseresume = [
 { id: "pause", label: "Pause" },
 { id: "resume", label: "Resume" },
];

instance.prototype.CHOICES_image = [
 { id: "next", label: "Next" },
 { id: "previous", label: "Previous" },
 { id: "hide", label: "Hide" },
];

instance.prototype.updateConfig = function (config) {
 var self = this;

 self.config = config;
};
instance.prototype.init = function () {
 var self = this;

 self.status(self.STATE_OK);

 debug = self.debug;
 log = self.log;
};

// Return config fields for web config
instance.prototype.config_fields = function () {
 var self = this;
 return [
  {
   type: "textinput",
   id: "host",
   label: "Target IP",
   width: 8,
   default: "127.0.0.1",
   regex: self.REGEX_IP,
  },
  {
   type: "textinput",
   id: "port",
   label: "Target Port",
   width: 4,
   default: "8181",
   regex: self.REGEX_PORT,
  },
 ];
};

// When module gets deleted
instance.prototype.destroy = function () {
 var self = this;
 debug("destroy");
};

instance.prototype.actions = function (system) {
 var self = this;
 self.system.emit("instance_actions", self.id, {
  clearall: {
   label: "Clear All Graphics",
  },
  "lowerthirds-show": {
   label: "Lower Thirds - Show",
   options: [
    {
     type: "textinput",
     label: "Value",
     id: "value",
     default: 1,
     regex: self.REGEX_SIGNED_NUMBER,
     tooltip: "(replace ‘1’ with whichever lower third you want to show)",
    },
   ],
  },
  "lowerthirds-hide": {
   label: "Lower Thirds - Hide",
  },
  ticker: {
   label: "Ticker - Show/Hide",
   options: [
    {
     type: "dropdown",
     label: "Show/Hide",
     id: "value",
     default: "show",
     choices: self.CHOICES_showhide,
    },
   ],
  },
  timer: {
   label: "Timer - Show/Hide",
   options: [
    {
     type: "dropdown",
     label: "Show/Hide",
     id: "value",
     default: "show",
     choices: self.CHOICES_showhide,
    },
   ],
  },
  "timer-customup": {
   label: "Timer - Custom UP",
   options: [
    {
     type: "textinput",
     label: "Value",
     id: "value",
     default: "01:00",
     tooltip: "hh:mm (e.g. 01:00 = 1 hour timer)",
    },
   ],
  },
  "timer-customdown": {
   label: "Timer - Custom DOWN",
   options: [
    {
     type: "textinput",
     label: "Value",
     id: "value",
     default: "00:01",
     tooltip: "hh:mm (e.g. 00:01 = 1 minute timer)",
    },
   ],
  },
  "timer-custom-down-time-of-day": {
   label: "Timer - Custom Down to Time of Day",
   options: [
    {
     type: "textinput",
     label: "Value",
     id: "value",
     default: "13:00",
     tooltip: "hh:mm (e.g. 13:00 = Count down to 13:00)",
    },
   ],
  },
  "timer-current-time": {
   label: "Timer - Current Time of Day",
  },
  stopwatch: {
   label: "Stopwatch",
  },
  "timer-pause-resume": {
   label: "Timer - Pause/Resume",
   options: [
    {
     type: "dropdown",
     label: "Pause/Resume",
     id: "value",
     default: "pause",
     choices: self.CHOICES_pauseresume,
    },
   ],
  },
  "timer-pre-message": {
   label: "Timer - Set pre-timer custom message",
   options: [
    {
     type: "textinput",
     label: "Value",
     id: "value",
     default: "Starting soon...",
     tooltip: "This custom message appears above the timer.",
    },
   ],
  },
  logo: {
   label: "Logo - Show/Hide",
   options: [
    {
     type: "dropdown",
     label: "Show/Hide",
     id: "value",
     default: "show",
     choices: self.CHOICES_showhide,
    },
   ],
  },
  message: {
   label: "Message - Show/Hide",
   options: [
    {
     type: "dropdown",
     label: "Show/Hide",
     id: "value",
     default: "show",
     choices: self.CHOICES_showhide,
    },
   ],
  },
  "message-custom": {
   label: "Message - Set a custom message",
   options: [
    {
     type: "textinput",
     label: "Value",
     id: "value",
     default: "LIVE!",
     tooltip: "Display a custom message on your output screen.",
    },
   ],
  },
  break: {
   label: "Break - Show/Hide",
   options: [
    {
     type: "dropdown",
     label: "Show/Hide",
     id: "value",
     default: "show",
     choices: self.CHOICES_showhide,
    },
   ],
  },
  "chat-hide": {
   label: "Chat - Hide",
  },
  "image-next-previous-hide": {
   label: "Image - Next/Previous/Hide",
   options: [
    {
     type: "dropdown",
     label: "Next/Previous/Hide",
     id: "value",
     default: "next",
     choices: self.CHOICES_image,
    },
   ],
  },
  "image-specific": {
   label: "Image - Show Specific",
   options: [
    {
     type: "textinput",
     label: "Value",
     id: "value",
     default: "1",
     tooltip: "Display a specific image, where '1' will show the first image.",
    },
   ],
  },
  score: {
   label: "Score - Show/Hide",
   options: [
    {
     type: "dropdown",
     label: "Show/Hide",
     id: "value",
     default: "show",
     choices: self.CHOICES_showhide,
    },
   ],
  },
  "score-increase-decrease": {
   label: "Score - Increase/Decrease score for specific team",
   options: [
    {
     type: "textinput",
     label: "Team",
     id: "team",
     tooltip: "Team to increase/decrease score.",
    },
    {
     type: "textinput",
     label: "Score",
     id: "score",
     tooltip:
      "'1' would increase by 1 point, '-10' would decrease by 10 points.",
    },
   ],
  },
 });
};

instance.prototype.action = function (action) {
 var self = this;

 debug("action: ", action);

 let oscPrefix = "/h2r-graphics/";

 let path = null;
 let bol = [];

 switch (action.action) {
  case "clearall":
   path = oscPrefix + "clear";
   bol = [];
   break;
  case "lowerthirds-show":
   path = oscPrefix + "lower-third";
   bol = [
    {
     type: "i",
     value: parseInt(action.options.value),
    },
   ];
   break;
  case "lowerthirds-hide":
   path = oscPrefix + "lower-third";
   bol = [
    {
     type: "s",
     value: "hide",
    },
   ];
   break;
  case "ticker":
   path = oscPrefix + "ticker";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "timer":
   path = oscPrefix + "timer";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "timer-customup":
   path = oscPrefix + "timer-custom-up";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "timer-customdown":
   path = oscPrefix + "timer-custom-down";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "timer-custom-down-time-of-day":
   path = oscPrefix + "timer-custom-down-time-of-day";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "timer-current-time":
   path = oscPrefix + "timer-current-time";
   bol = [];
   break;
  case "stopwatch":
   path = oscPrefix + "stopwatch";
   bol = [];
   break;
  case "timer-pause-resume":
   path = oscPrefix + "timer";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "timer-pre-message":
   path = oscPrefix + "timer-pre-message";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "logo":
   path = oscPrefix + "logo";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "message":
   path = oscPrefix + "message";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "message-custom":
   path = oscPrefix + "message";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "break":
   path = oscPrefix + "break";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "chat-hide":
   path = oscPrefix + "chat";
   bol = [
    {
     type: "s",
     value: "hide",
    },
   ];
   break;
  case "image-next-previous-hide":
   path = oscPrefix + "image";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "image-specific":
   path = oscPrefix + "image";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "score":
   path = oscPrefix + "score";
   bol = [
    {
     type: "s",
     value: action.options.value,
    },
   ];
   break;
  case "score-increase-decrease":
   path = oscPrefix + "score-team-" + action.options.team;
   bol = [
    {
     type: "s",
     value: action.options.score,
    },
   ];
   break;
  default:
   break;
 }

 if (path !== null) {
  debug("sending", self.config.host, self.config.port, path);
  self.system.emit("osc_send", self.config.host, self.config.port, path, bol);
 }
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
