import { combineRgb } from '@companion-module/base'
import { graphicToReadableLabel, graphicColours, graphicIcons, replaceWithDataSource } from './utils.js'

export const initPresets = (self) => {
	const presets = {}
	let SELECTED_PROJECT_GRAPHICS = self.SELECTED_PROJECT_GRAPHICS || []
	let SELECTED_PROJECT_VARIABLES = self.SELECTED_PROJECT_VARIABLES || {}

	presets['Run'] = {
		type: 'button',
		category: 'Basic actions',
		name: 'Run',
		style: {
			text: 'Run',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'run',
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Hide'] = {
		type: 'button',
		category: 'Basic actions',
		name: 'Hide all graphics',
		style: {
			text: 'Hide all',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'clear',
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	const createPresetShowHide = (category, item) => {
		let bgColour = graphicColours(item.type).bgColour
		let pngIcon = graphicIcons(item.type).png
		let labelSource = ['lower_third', 'lower_third_animated'].includes(item.type)
			? self.config.lowerThirdPresetLabelSource || 'contents'
			: 'contents'

		return {
			category,
			type: 'button',
			name: replaceWithDataSource(graphicToReadableLabel(item).label, SELECTED_PROJECT_VARIABLES),
			style: {
				text: `$(${self.config.label}:graphic_${item.id}_${labelSource})`,
				png64: pngIcon,
				pngalignment: 'center:center',
				size: self.config.presetButtonTextSize || '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(bgColour[0], bgColour[1], bgColour[2]),
				latch: false,
			},
			steps: [
				{
					down: [
						{
							actionId: 'showHide',
							options: { graphicId: item.id, status: 'toggle' },
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'graphic_status',
					options: {
						graphicId: item.id,
						status: 'coming',
					},
					style: {
						bgcolor: combineRgb(132, 0, 0),
					},
				},
				{
					feedbackId: 'graphic_status',
					options: {
						graphicId: item.id,
						status: 'onair',
					},
					style: {
						bgcolor: combineRgb(255, 0, 0),
					},
				},
				{
					feedbackId: 'graphic_status',
					options: {
						graphicId: item.id,
						status: 'going',
					},
					style: {
						bgcolor: combineRgb(132, 0, 0),
					},
				},
			],
		}
	}

	SELECTED_PROJECT_GRAPHICS.forEach((graphic) => {
		if (graphic.type === 'section') return null
		const preset = createPresetShowHide('Show/Hide', graphic)

		presets[graphic.id] = preset
	})

	return presets
}
