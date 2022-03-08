const instance_skel = require('../../instance_skel')
const upgrades = require('./upgrades')
const config = require('./src/config')

const choices = require('./src/choices');

const socketio = require('./src/socketio')

const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

instance.prototype.socket = null; //used with socketio connection

function instance(system, id, config) {
	let self = this

	// super-constructor
	instance_skel.apply(this, arguments)

	return self
};

// Initalize module
instance.prototype.init = function () {
	let self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATUS_WARNING, 'connecting');
	self.setVariable('connected_state', 'Connecting');

	self.init_choices();

	self.init_socketio();
	
	self.init_actions();
	self.init_feedbacks();
	self.init_variables();
	self.init_presets();
};

instance.GetUpgradeScripts = function () {
	return upgrades;
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	return config.setConfigFields.bind(this)();
}

instance.prototype.updateConfig = function (config) {
	let self = this;

	if (self.config.useV2 !== config.useV2) {
		self.log('info', `Version change: You may need to replace existing actions when switching between versions!`)
	}

	self.config = config;

	self.status(self.STATUS_WARNING, 'connecting');
	self.setVariable('connected_state', 'Connecting');

	self.init_choices();
	
	self.init_socketio();
	
	self.init_actions();
	self.init_feedbacks();
	self.init_variables();
	self.init_presets();
}

// When module gets deleted
instance.prototype.destroy = function () {
	let self = this;
	debug('destroy', self.id)
}

// ############################
// ####  Instance Choices  ####
// ############################
instance.prototype.init_choices = function (system) {
	choices.setChoices.bind(this)();
}

instance.prototype.init_socketio = function () {
	socketio.init_socketio.bind(this)();
}

// ############################
// ####  Instance Actions  ####
// ############################
instance.prototype.init_actions = function (system) {
	this.setActions(actions.setActions.bind(this)());
}

// ############################
// #### Instance Feedbacks ####
// ############################
instance.prototype.init_feedbacks = function (system) {
	this.setFeedbackDefinitions(feedbacks.setFeedbacks.bind(this)());
};

// ############################
// #### Instance Variables ####
// ############################
instance.prototype.init_variables = function () {
	this.setVariableDefinitions(variables.setVariables.bind(this)());
};

// ##########################
// #### Instance Presets ####
// ##########################
instance.prototype.init_presets = function () {
	this.setPresetDefinitions(presets.setPresets.bind(this)());
};

instance.prototype.sendCommand = function(cmd, body) {
	let self = this;
	if (!self.config.useV2) {
		//use v1 command
		self.oscSend(self.config.host, self.config.port, cmd, body);
	}
	else {
		//use v2 command

		//below is HTTP REST, we could replace with socketio
		let errorHandler = function (err, result) {
			if (err !== null) {
				self.log('error', `HTTP Request failed (${err.message})`);
				self.status(self.STATUS_ERROR, result.error.code);
			} else {
				self.status(self.STATUS_OK);
			}
		}

		let baseUri = `http://${self.config.host}:${self.config.portV2}/api/${self.config.projectId}`;
		self.system.emit('rest', `${baseUri}/${cmd}`, body, errorHandler, header);

		//example socketio command instead of REST
		/*if (self.socket) {
			self.socket.emit('action', self.config.projectId, cmd, body);
		}*/
	}
}

instance_skel.extendedBy(instance)
exports = module.exports = instance