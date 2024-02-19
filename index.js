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
			{
				type: 'dropdown',
				id: 'usePngForPresets',
				label: 'Show PNG heading on Presets',
				width: 6,
				default: 'true',
				choices: [
					{ id: 'true', label: 'Yes' },
					{ id: 'false', label: 'No' },
				],
			},
			{
				type: 'dropdown',
				id: 'presetButtonTextSize',
				label: 'Preset Button Text Size',
				width: 6,
				default: '18',
				allowCustom: true,
				regex: '/^(?:[0-9]+|auto)$/',
				choices: [
					{ id: 'auto', label: 'Auto' },
					{ id: '7', label: '7pt' },
					{ id: '14', label: '14pt'},
					{ id: '18', label: '18pt' },
					{ id: '24', label: '24pt' },
					{ id: '30', label: '30pt'},
					{ id: '33', label: '44pt' },
				],
			},
			{
				type: 'dropdown',
				id: 'lowerThirdPresetLabelSource',
				label: 'Text Format for Lower Third Preset Buttons',
				width: 6,
				default: 'contents',
				choices: [
					{ id: 'contents', label: 'Line 1, Line 2' },
					{ id: 'first_line', label: 'Line 1' },
					{ id: 'label', label: 'Label (shows ID if label is empty)' },
				],
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
