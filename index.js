const instance_skel = require('../../instance_skel')
const upgradeScripts = require('./upgrades')
const { getConfigFields } = require('./src/config')
const { initFeedbacks } = require('./src/feedback')
const { updateVariableDefinitions } = require('./src/variables')
const { executeActionV1, executeActionV2, getActionsV1, getActionsV2 } = require('./src/actions')
const { initPresets } = require('./src/presets')
const tcp = require('./src/tcp')

function instance(system, id, config) {
	var self = this

	// super-constructor
	instance_skel.apply(this, arguments)

	self.actions(system) // export actions

	self.init_tcp()
	self.feedback()
	initPresets.bind(this)()
	self.updateVariableDefinitions = updateVariableDefinitions

	return self
}

instance.GetUpgradeScripts = function () {
	return upgradeScripts
}

instance.prototype.CHOICES_showhide = [
	{ id: 'show', label: 'Show' },
	{ id: 'hide', label: 'Hide' },
]

instance.prototype.CHOICES_pauseresume = [
	{ id: 'pause', label: 'Pause' },
	{ id: 'resume', label: 'Resume' },
]

instance.prototype.CHOICES_image = [
	{ id: 'next', label: 'Next' },
	{ id: 'previous', label: 'Previous' },
	{ id: 'hide', label: 'Hide' },
]

instance.prototype.GRAPHIC_STATUS_TOGGLES = [
	{ id: 'coming', label: 'Show' },
	{ id: 'going', label: 'Hide' },
	{ id: 'cued', label: 'Cue on' },
	{ id: 'cuedoff', label: 'Cue off' },
]

instance.prototype.GRAPHIC_STATUS_OPTIONS = [
	{ id: 'ready', label: 'Ready' },
	{ id: 'cued', label: 'Cue on' },
	{ id: 'coming', label: 'Coming on air' },
	{ id: 'onair', label: 'On air' },
	{ id: 'going', label: 'Going off air' },
	{ id: 'cuedoff', label: 'Cue off' },
	{ id: 'offair', label: 'Off air' },
]

instance.prototype.GRAPHIC_POSITION_OPTIONS = [
	{ id: 'tl', label: 'Top Left' },
	{ id: 'tc', label: 'Top Middle' },
	{ id: 'tr', label: 'Top Right' },
	{ id: 'ml', label: 'Middle Left' },
	{ id: 'mc', label: 'Middle' },
	{ id: 'mr', label: 'Middle Right' },
	{ id: 'bl', label: 'Bottom Left' },
	{ id: 'bc', label: 'Bottom Middle' },
	{ id: 'br', label: 'Bottom Right' },
]

instance.prototype.updateConfig = function (config) {
	var self = this

	if (self.config.useV2 !== config.useV2) {
		self.log('info', `Version change: You may need to replace existing actions when switching between versions!`)

		self.config = config
		return self.actions()
	}

	self.config = config

	self.feedback()
	self.init_tcp()
	initPresets.bind(this)()
}
instance.prototype.init = function () {
	var self = this

	self.updateVariableDefinitions()
}

instance.prototype.init_tcp = function () {
	tcp.init.bind(this)()
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	return getConfigFields.bind(this)()
}

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this
	self.debug('destroy')
}

instance.prototype.actions = function () {
	if (this.config.useV2 === true) {
		this.setActions(getActionsV2.bind(this)())
	} else {
		this.setActions(getActionsV1.bind(this)())
	}
}

instance.prototype.action = function (action) {
	if (this.config.useV2 === true) {
		return executeActionV2.bind(this)(action)
	} else {
		return executeActionV1.bind(this)(action)
	}
}

instance.prototype.feedback = function (feedback, bank) {
	return initFeedbacks.bind(this)(feedback, bank)
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
