import { combineRgb } from '@companion-module/base'
import { graphicToReadableLabel, graphicColours, graphicIcons, replaceWithDataSource } from './utils.js'

export const initPresets = (self) => {
	const presets = {}
	let SELECTED_PROJECT_GRAPHICS = self.SELECTED_PROJECT_GRAPHICS || []
	let SELECTED_PROJECT_VARIABLES = self.SELECTED_PROJECT_VARIABLES || {}
	let SELECTED_PROJECT_DYNAMIC_LISTS = self.SELECTED_PROJECT_DYNAMIC_LISTS || []

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
		let pngIcon = self.config.usePngForPresets === 'true' ? graphicIcons(item.type).png : null
		let labelSource
		if (self.config.useLabelForPresets === 'true') {
			labelSource = 'label'
		} else {
			labelSource = ['lower_third', 'lower_third_animated'].includes(item.type)
				? self.config.lowerThirdPresetLabelSource || 'contents'
				: 'contents'
		}

		return {
			category,
			type: 'button',
			name: replaceWithDataSource(
				graphicToReadableLabel(item).label,
				SELECTED_PROJECT_VARIABLES,
				SELECTED_PROJECT_DYNAMIC_LISTS
			),
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

	// DRAW ON SCREEN

	presets['drawing_on'] = {
		type: 'button',
		category: 'Draw on screen',
		name: 'Drawing On',
		style: {
			text: 'Drawing On',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'draw_on',
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['drawing_off'] = {
		type: 'button',
		category: 'Draw on screen',
		name: 'Drawing Off',
		style: {
			text: 'Drawing Off',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'draw_off',
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['drawing_size'] = {
		type: 'button',
		category: 'Draw on screen',
		name: 'Drawing size',
		style: {
			text: 'Drawing size',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'draw_size',
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['drawing_color'] = {
		type: 'button',
		category: 'Draw on screen',
		name: 'Drawing color',
		style: {
			text: 'Drawing color',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'draw_color',
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	return presets
}
