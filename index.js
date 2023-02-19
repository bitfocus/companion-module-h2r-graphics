import { InstanceBase, runEntrypoint } from '@companion-module/base'
import { upgrade } from './src/upgrades.js'
import { init_http } from './src/tcp.js'
import { actionsV2 } from './src/actions.js'
import { initPresets } from './src/presets.js'
import { initFeedbacks } from './src/feedback.js'

class H2RGraphicsInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateActions()

		init_http(this)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				default: '127.0.0.1',
				regex: this.REGEX_IP,
			},
			{
				type: 'textinput',
				id: 'portV2',
				label: 'Target Port',
				width: 3,
				default: '4001',
				regex: this.REGEX_PORT,
			},
			{
				type: 'textinput',
				id: 'projectId',
				label: 'Project ID',
				width: 3,
				default: 'ABCD',
			},
		]
	}

	updateActions() {
		this.setActionDefinitions(actionsV2(this))
	}

	updatePresets() {
		const presets = initPresets(this)
		this.setPresetDefinitions(presets)
	}
	updateFeedbacks() {
		const feedbacks = initFeedbacks(this)
		this.log('debug', JSON.stringify(feedbacks))
		this.setFeedbackDefinitions(feedbacks)
	}
}

runEntrypoint(H2RGraphicsInstance, upgrade)
