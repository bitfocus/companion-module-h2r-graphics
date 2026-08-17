import { combineRgb } from '@companion-module/base'
import { graphicToReadableLabel, resolveGraphicId } from './utils.js'

const GRAPHIC_STATUS_OPTIONS = [
	{ id: 'ready', label: 'Ready' },
	{ id: 'cued', label: 'Cue on' },
	{ id: 'coming', label: 'Coming on air' },
	{ id: 'onair', label: 'On air' },
	{ id: 'going', label: 'Going off air' },
	{ id: 'cuedoff', label: 'Cue off' },
	{ id: 'offair', label: 'Off air' },
]

export const initFeedbacks = (self) => {
	let SELECTED_PROJECT_GRAPHICS = self.SELECTED_PROJECT_GRAPHICS || []
	const feedbacks = {}

	feedbacks['graphic_status'] = {
		type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
		name: 'Graphic status',
		defaultStyle: {
			bgcolor: combineRgb(255, 0, 0),
			color: combineRgb(255, 255, 255),
		},
		// options is how the user can choose the condition the feedback activates for
		options: [
			{
				type: 'dropdown',
				label: 'Status',
				id: 'status',
				default: 'onair',
				choices: GRAPHIC_STATUS_OPTIONS,
			},
			{
				type: 'dropdown',
				label: 'Graphic',
				id: 'graphicId',
				default: SELECTED_PROJECT_GRAPHICS.length > 0 ? SELECTED_PROJECT_GRAPHICS[0].id : '',
				choices: [
					...SELECTED_PROJECT_GRAPHICS.map((c) => {
						const { id, label } = graphicToReadableLabel(c)
						return {
							id,
							label,
						}
					}),
				],
				allowCustom: true,
				useVariables: true,
				minChoicesForSearch: 0,
				tooltip: "Pick a graphic, or enter a graphic's ID, label or a variable. Labels keep this working across projects.",
			},
		],
		// Async so the graphic can be given as a variable. Parsing through the context (rather
		// than self) is what tells Companion to re-check this feedback when those variables change.
		callback: async function (feedback, context) {
			const graphics = self.SELECTED_PROJECT_GRAPHICS || []

			let value = feedback?.options?.graphicId
			if (context?.parseVariablesInString) {
				value = await context.parseVariablesInString(String(value ?? ''))
			}

			const graphicId = resolveGraphicId(value, graphics)
			let status = graphics.find((g) => g.id === graphicId)?.status
			// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
			if (status === feedback.options.status) {
				return true
			} else {
				return false
			}
		},
	}
	return feedbacks
}
