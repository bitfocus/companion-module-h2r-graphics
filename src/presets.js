const { graphicToReadableLabel, graphicColours, graphicIcons } = require('./utils')

exports.initPresets = function () {
	const presets = []
	let SELECTED_PROJECT_GRAPHICS = this.SELECTED_PROJECT_GRAPHICS || []

	presets.push({
		category: 'Basic actions',
		label: 'Run',
		bank: {
			style: 'text',
			text: 'Run',
			size: '18',
			color: this.rgb(255, 255, 255),
			bgcolor: this.rgb(0, 0, 0),
		},
		actions: [
			{
				action: 'run',
			},
		],
	})

	presets.push({
		category: 'Basic actions',
		label: 'Hide all graphics',
		bank: {
			style: 'text',
			text: 'Hide all',
			size: '18',
			color: this.rgb(255, 255, 255),
			bgcolor: this.rgb(0, 0, 0),
		},
		actions: [
			{
				action: 'clear',
			},
		],
	})

	const createPresetShowHide = (category, item) => {
		let bgColour = graphicColours(item.type).bgColour
		let pngIcon = graphicIcons(item.type).png
		return {
			category,
			label: graphicToReadableLabel(item).label,
			bank: {
				style: 'text',
				text: `$(${this.config.label}:graphic_${item.id}_contents)`,
				png64: pngIcon,
				pngalignment: 'center:center',
				size: '18',
				color: this.rgb(255, 255, 255),
				bgcolor: this.rgb(bgColour[0], bgColour[1], bgColour[2]),
				latch: true,
			},
			actions: [{ action: 'showHide', options: { graphicId: item.id, status: 'coming' } }],
			release_actions: [{ action: 'showHide', options: { graphicId: item.id, status: 'going' } }],
			feedbacks: [
				{
					type: 'graphic_status',
					options: {
						graphicId: item.id,
						status: 'coming',
						fg: this.rgb(0, 0, 0),
					},
					style: {
						bgcolor: this.rgb(132, 0, 0),
					},
				},
				{
					type: 'graphic_status',
					options: {
						graphicId: item.id,
						status: 'onair',
						fg: this.rgb(0, 0, 0),
					},
					style: {
						bgcolor: this.rgb(255, 0, 0),
					},
				},
				{
					type: 'graphic_status',
					options: {
						graphicId: item.id,
						status: 'going',
						fg: this.rgb(0, 0, 0),
					},
					style: {
						bgcolor: this.rgb(132, 0, 0),
					},
				},
			],
		}
	}

	SELECTED_PROJECT_GRAPHICS.forEach((graphic) => {
		if (graphic.type === 'section') return null
		const preset = createPresetShowHide('Show/Hide', graphic)

		presets.push(preset)
	})

	if (this.config.useV2 === true) {
		this.setPresetDefinitions(presets)
	} else {
		this.setPresetDefinitions([])
	}
}
