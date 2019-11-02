var instance_skel = require('../../instance_skel');
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
	{id: 'show', label: 'Show'},
	{id: 'hide', label: 'Hide'}
]

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
};
instance.prototype.init = function() {
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
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			default: '127.0.0.1',
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 4,
			default: '8181',
			regex: self.REGEX_PORT
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
};

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {
		
		'clearall': {
			label: 'Clear All Graphics'
		},
		'lowerthirds-show': {
			label: 'Lower Thirds - Show',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: 1,
					regex: self.REGEX_SIGNED_NUMBER,
					tooltip: '(replace ‘1’ with whichever lower third you want to show)'
				}
			]
		},
		'lowerthirds-hide': {
			label: 'Lower Thirds - Hide'
		},
		'ticker': {
			label: 'Ticker - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: self.CHOICES_showhide
				}
			]
		},
		'timer': {
			label: 'Timer - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: self.CHOICES_showhide
				}
			]
		},
		'timer-customup': {
			label: 'Timer - Custom UP',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '01:00',
					tooltip: 'hh:mm (e.g. 01:00 = 1 hour timer)'
				}
			]
		},
		'timer-customdown': {
			label: 'Timer - Custom DOWN',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '00:01',
					tooltip: 'hh:mm (e.g. 00:01 = 1 minute timer)'
				}
			]
		},
		'logo': {
			label: 'Logo - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: self.CHOICES_showhide
				}
			]
		},
		'message': {
			label: 'Message - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: self.CHOICES_showhide
				}
			]
		},
		'break': {
			label: 'Break - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: self.CHOICES_showhide
				}
			]
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;

	debug('action: ', action);
	
	let oscPrefix = '/h2r-graphics/';
	
	let path = null;
	let bol = [];
	
	switch (action.action) {

		case 'clearall':
			path = oscPrefix + 'clear';
			bol = [];
			break;
		case 'lowerthirds-show':
			path = oscPrefix + 'lower-third';
			bol = [
				{
					type: 'i',
					value: parseInt(action.options.value)
				}
			];
			break;
		case 'lowerthirds-hide':
			path = oscPrefix + 'lower-third';
			bol = [
				{
					type: 's',
					value: 'hide'
				}
			];
			break;
		case 'ticker':
			path = oscPrefix + 'ticker';
			bol = [
				{
					type: 's',
					value: action.options.value
				}
			];
			break;
		case 'timer':
			path = oscPrefix + 'timer';
			bol = [
				{
					type: 's',
					value: action.options.value
				}
			];
			break;
		case 'timer-customup':
			path = oscPrefix + 'timer-custom-up';
			bol = [
				{
					type: 's',
					value: action.options.value
				}
			];
			break;
		case 'timer-customdown':
			path = oscPrefix + 'timer-custom-down';
			bol = [
				{
					type: 's',
					value: action.options.value
				}
			];
			break;
		case 'logo':
			path = oscPrefix + 'logo';
			bol = [
				{
					type: 's',
					value: action.options.value
				}
			];
			break;
		case 'message':
			path = oscPrefix + 'message';
			bol = [
				{
					type: 's',
					value: action.options.value
				}
			];
			break;
		case 'break':
			path = oscPrefix + 'break';
			bol = [
				{
					type: 's',
					value: action.options.value
				}
			];
			break;
		default:
			break;
	}
	
	if (path !== null) {
		debug('sending',self.config.host, self.config.port, path);
		self.system.emit('osc_send', self.config.host, self.config.port, path, bol);
	}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
