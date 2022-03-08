const { graphicToReadableLabel, graphicColours, graphicIcons } = require('./utils')

exports.setPresets = function () {
	let self = this;

	let presets = []

	let SELECTED_PROJECT_GRAPHICS = self.SELECTED_PROJECT_GRAPHICS || []

	presets.push({
		category: 'Basic actions',
		label: 'Run',
		bank: {
			style: 'text',
			text: 'Run',
			size: '18',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(0, 0, 0),
		},
		actions: [
			{
				action: 'run'
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
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(0, 0, 0),
		},
		actions: [
			{
				action: 'clear'
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
				text: `$(${self.config.label}:graphic_${item.id}_contents)`,
				png64: pngIcon,
				pngalignment: 'center:center',
				size: '18',
				color: self.rgb(255, 255, 255),
				bgcolor: self.rgb(bgColour[0], bgColour[1], bgColour[2]),
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
						fg: self.rgb(0, 0, 0),
					},
					style: {
						bgcolor: selfß.rgb(132, 0, 0),
					},
				},
				{
					type: 'graphic_status',
					options: {
						graphicId: item.id,
						status: 'onair',
						fg: self.rgb(0, 0, 0),
					},
					style: {
						bgcolor: self.rgb(255, 0, 0),
					},
				},
				{
					type: 'graphic_status',
					options: {
						graphicId: item.id,
						status: 'going',
						fg: selfß.rgb(0, 0, 0),
					},
					style: {
						bgcolor: self.rgb(132, 0, 0),
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

	return presets;
}
