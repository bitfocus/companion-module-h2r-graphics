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
	// self.init()

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

	// self.status(self.STATE_OK)
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
		this.system.emit('instance_actions', this.id, getActionsV2.bind(this)())
	} else {
		this.system.emit('instance_actions', this.id, getActionsV1.bind(this)())
	}

	// self.system.emit('instance_actions', self.id, {
	// 	clearall: {
	// 		label: 'Clear All Graphics',
	// 	},
	// 	lowerthirdsShow: {
	// 		label: 'Lower Third - Show',
	// 		options: [
	// 			{
	// 				type: 'textinput',
	// 				label: 'Value',
	// 				id: 'value',
	// 				default: 1,
	// 				regex: self.REGEX_SIGNED_NUMBER,
	// 				tooltip: '(replace ‘1’ with whichever lower third you want to show)',
	// 			},
	// 		],
	// 	},
	// 	lowerthirdsHide: {
	// 		label: 'Lower Thirds - Hide',
	// 	},
	// 	ticker: {
	// 		label: 'Ticker - Show/Hide',
	// 		options: [
	// 			{
	// 				type: 'dropdown',
	// 				label: 'Show/Hide',
	// 				id: 'value',
	// 				default: 'show',
	// 				choices: self.CHOICES_showhide,
	// 			},
	// 		],
	// 	},
	// 	timer: {
	// 		label: 'Timer - Show/Hide',
	// 		options: [
	// 			{
	// 				type: 'dropdown',
	// 				label: 'Show/Hide',
	// 				id: 'value',
	// 				default: 'show',
	// 				choices: self.CHOICES_showhide,
	// 			},
	// 		],
	// 	},
	// 	timerCustomUp: {
	// 		label: 'Timer - Custom UP',
	// 		options: [
	// 			{
	// 				type: 'textinput',
	// 				label: 'Value',
	// 				id: 'value',
	// 				default: '01:00',
	// 				tooltip: 'hh:mm (e.g. 01:00 = 1 hour timer)',
	// 			},
	// 		],
	// 	},
	// 	timerCustomDown: {
	// 		label: 'Timer - Custom DOWN',
	// 		options: [
	// 			{
	// 				type: 'textinput',
	// 				label: 'Value',
	// 				id: 'value',
	// 				default: '00:01',
	// 				tooltip: 'hh:mm (e.g. 00:01 = 1 minute timer)',
	// 			},
	// 		],
	// 	},
	// 	timerCustomDownTimeOfDay: {
	// 		label: 'Timer - Custom Down to Time of Day',
	// 		options: [
	// 			{
	// 				type: 'textinput',
	// 				label: 'Value',
	// 				id: 'value',
	// 				default: '13:00',
	// 				tooltip: 'hh:mm (e.g. 13:00 = Count down to 13:00)',
	// 			},
	// 		],
	// 	},
	// 	timerCurrentTime: {
	// 		label: 'Timer - Current Time of Day',
	// 	},
	// 	stopwatch: {
	// 		label: 'Stopwatch',
	// 	},
	// 	timerPauseResume: {
	// 		label: 'Timer - Pause/Resume',
	// 		options: [
	// 			{
	// 				type: 'dropdown',
	// 				label: 'Pause/Resume',
	// 				id: 'value',
	// 				default: 'pause',
	// 				choices: self.CHOICES_pauseresume,
	// 			},
	// 		],
	// 	},
	// 	timerPreMessage: {
	// 		label: 'Timer - Set pre-timer custom message',
	// 		options: [
	// 			{
	// 				type: 'textinput',
	// 				label: 'Value',
	// 				id: 'value',
	// 				default: 'Starting soon...',
	// 				tooltip: 'This custom message appears above the timer.',
	// 			},
	// 		],
	// 	},
	// 	logo: {
	// 		label: 'Logo - Show/Hide',
	// 		options: [
	// 			{
	// 				type: 'dropdown',
	// 				label: 'Show/Hide',
	// 				id: 'value',
	// 				default: 'show',
	// 				choices: self.CHOICES_showhide,
	// 			},
	// 		],
	// 	},
	// 	message: {
	// 		label: 'Message - Show/Hide',
	// 		options: [
	// 			{
	// 				type: 'dropdown',
	// 				label: 'Show/Hide',
	// 				id: 'value',
	// 				default: 'show',
	// 				choices: self.CHOICES_showhide,
	// 			},
	// 		],
	// 	},
	// 	messageCustom: {
	// 		label: 'Message - Set a custom message',
	// 		options: [
	// 			{
	// 				type: 'textinput',
	// 				label: 'Value',
	// 				id: 'value',
	// 				default: 'LIVE!',
	// 				tooltip: 'Display a custom message on your output screen.',
	// 			},
	// 		],
	// 	},
	// 	break: {
	// 		label: 'Break - Show/Hide',
	// 		options: [
	// 			{
	// 				type: 'dropdown',
	// 				label: 'Show/Hide',
	// 				id: 'value',
	// 				default: 'show',
	// 				choices: self.CHOICES_showhide,
	// 			},
	// 		],
	// 	},
	// 	chatHide: {
	// 		label: 'Chat - Hide',
	// 	},
	// 	imageNextPreviousHide: {
	// 		label: 'Image - Next/Previous/Hide',
	// 		options: [
	// 			{
	// 				type: 'dropdown',
	// 				label: 'Next/Previous/Hide',
	// 				id: 'value',
	// 				default: 'next',
	// 				choices: self.CHOICES_image,
	// 			},
	// 		],
	// 	},
	// 	imageSpecific: {
	// 		label: 'Image - Show Specific',
	// 		options: [
	// 			{
	// 				type: 'textinput',
	// 				label: 'Value',
	// 				id: 'value',
	// 				default: '1',
	// 				tooltip: "Display a specific image, where '1' will show the first image.",
	// 			},
	// 		],
	// 	},
	// 	score: {
	// 		label: 'Score - Show/Hide',
	// 		options: [
	// 			{
	// 				type: 'dropdown',
	// 				label: 'Show/Hide',
	// 				id: 'value',
	// 				default: 'show',
	// 				choices: self.CHOICES_showhide,
	// 			},
	// 		],
	// 	},
	// 	scoreIncreaseDecrease: {
	// 		label: 'Score - Increase/Decrease score for specific team',
	// 		options: [
	// 			{
	// 				type: 'textinput',
	// 				label: 'Team',
	// 				id: 'team',
	// 				tooltip: 'Team to increase/decrease score.',
	// 			},
	// 			{
	// 				type: 'textinput',
	// 				label: 'Score',
	// 				id: 'score',
	// 				tooltip: "'1' would increase by 1 point, '-10' would decrease by 10 points.",
	// 			},
	// 		],
	// 	},
	// })
}

instance.prototype.action = function (action) {
	if (this.config.useV2 === true) {
		return executeActionV2.bind(this)(action)
	} else {
		return executeActionV1.bind(this)(action)
	}

	// var self = this

	// self.debug('action: ', action)

	// let oscPrefix = '/h2r-graphics/'

	// let path = null
	// let bol = []

	// switch (action.action) {
	// 	case 'clearall':
	// 		path = oscPrefix + 'clear'
	// 		bol = []
	// 		break
	// 	case 'lowerthirdsShow':
	// 		path = oscPrefix + 'lower-third'
	// 		bol = [
	// 			{
	// 				type: 'i',
	// 				value: parseInt(action.options.value),
	// 			},
	// 		]
	// 		break
	// 	case 'lowerthirdsHide':
	// 		path = oscPrefix + 'lower-third'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: 'hide',
	// 			},
	// 		]
	// 		break
	// 	case 'ticker':
	// 		path = oscPrefix + 'ticker'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'timer':
	// 		path = oscPrefix + 'timer'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'timerCustomUp':
	// 		path = oscPrefix + 'timer-custom-up'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'timerCustomDown':
	// 		path = oscPrefix + 'timer-custom-down'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'timerCustomDownTimeOfDay':
	// 		path = oscPrefix + 'timer-custom-down-time-of-day'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'timerCurrentTime':
	// 		path = oscPrefix + 'timer-current-time'
	// 		bol = []
	// 		break
	// 	case 'stopwatch':
	// 		path = oscPrefix + 'stopwatch'
	// 		bol = []
	// 		break
	// 	case 'timerPauseResume':
	// 		path = oscPrefix + 'timer'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'timerPreMessage':
	// 		path = oscPrefix + 'timer-pre-message'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'logo':
	// 		path = oscPrefix + 'logo'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'message':
	// 		path = oscPrefix + 'message'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'messageCustom':
	// 		path = oscPrefix + 'message'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'break':
	// 		path = oscPrefix + 'break'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'chatHide':
	// 		path = oscPrefix + 'chat'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: 'hide',
	// 			},
	// 		]
	// 		break
	// 	case 'imageNextPreviousHide':
	// 		path = oscPrefix + 'image'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'imageSpecific':
	// 		path = oscPrefix + 'image'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'score':
	// 		path = oscPrefix + 'score'
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.value,
	// 			},
	// 		]
	// 		break
	// 	case 'scoreIncreaseDecrease':
	// 		path = oscPrefix + 'score-team-' + action.options.team
	// 		bol = [
	// 			{
	// 				type: 's',
	// 				value: action.options.score,
	// 			},
	// 		]
	// 		break
	// 	default:
	// 		break
	// }

	// if (path !== null) {
	// 	self.log('info', `${self.config.host}:${self.config.port}${path}, ${JSON.stringify(bol)}`)
	// 	self.system.emit('osc_send', self.config.host, self.config.port, path, bol)
	// }
}

instance.prototype.feedback = function (feedback, bank) {
	return initFeedbacks.bind(this)(feedback, bank)
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
