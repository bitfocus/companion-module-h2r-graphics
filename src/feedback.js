const { graphicToReadableLabel } = require('./utils')

exports.initFeedbacks = function () {
	var self = this
	let SELECTED_PROJECT_GRAPHICS = self.SELECTED_PROJECT_GRAPHICS || []
	const feedbacks = {}

	feedbacks['graphic_status'] = {
		type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
		label: 'Graphic status',
		description: 'When your chosen graphic goes onair, these properties will be set',
		style: {
			// The default style change for a boolean feedback
			// The user will be able to customise these values as well as the fields that will be changed
			bgcolor: self.rgb(255, 0, 0),
		},
		// options is how the user can choose the condition the feedback activates for
		options: [
			{
				type: 'dropdown',
				label: 'Status',
				id: 'status',
				default: 'onair',
				choices: self.GRAPHIC_STATUS_OPTIONS,
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
			},
		],
		callback: function (feedback) {
			let status = self.SELECTED_PROJECT_GRAPHICS.find((g) => g.id === feedback.options.graphicId).status
			// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
			if (status === feedback.options.status) {
				return true
			} else {
				return false
			}
		},
	}
	self.setFeedbackDefinitions(feedbacks)
}
