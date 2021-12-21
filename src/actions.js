const { graphicToReadableLabel, stringToMS } = require('./utils')

exports.getActionsV1 = function () {
	return {
		clearall: {
			label: 'v1 - Clear All Graphics',
		},
		lowerthirdsShow: {
			label: 'v1 - Lower Third - Show',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: 1,
					regex: this.REGEX_SIGNED_NUMBER,
					tooltip: '(replace ‘1’ with whichever lower third you want to show)',
				},
			],
		},
		lowerthirdsHide: {
			label: 'v1 - Lower Thirds - Hide',
		},
		ticker: {
			label: 'v1 - Ticker - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: this.CHOICES_showhide,
				},
			],
		},
		timer: {
			label: 'v1 - Timer - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: this.CHOICES_showhide,
				},
			],
		},
		timerCustomUp: {
			label: 'v1 - Timer - Custom UP',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '01:00',
					tooltip: 'hh:mm (e.g. 01:00 = 1 hour timer)',
				},
			],
		},
		timerCustomDown: {
			label: 'v1 - Timer - Custom DOWN',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '00:01',
					tooltip: 'hh:mm (e.g. 00:01 = 1 minute timer)',
				},
			],
		},
		timerCustomDownTimeOfDay: {
			label: 'v1 - Timer - Custom Down to Time of Day',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '13:00',
					tooltip: 'hh:mm (e.g. 13:00 = Count down to 13:00)',
				},
			],
		},
		timerCurrentTime: {
			label: 'v1 - Timer - Current Time of Day',
		},
		stopwatch: {
			label: 'v1 - Stopwatch',
		},
		timerPauseResume: {
			label: 'v1 - Timer - Pause/Resume',
			options: [
				{
					type: 'dropdown',
					label: 'Pause/Resume',
					id: 'value',
					default: 'pause',
					choices: this.CHOICES_pauseresume,
				},
			],
		},
		timerPreMessage: {
			label: 'v1 - Timer - Set pre-timer custom message',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: 'Starting soon...',
					tooltip: 'This custom message appears above the timer.',
				},
			],
		},
		logo: {
			label: 'v1 - Logo - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: this.CHOICES_showhide,
				},
			],
		},
		message: {
			label: 'v1 - Message - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: this.CHOICES_showhide,
				},
			],
		},
		messageCustom: {
			label: 'v1 - Message - Set a custom message',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: 'LIVE!',
					tooltip: 'Display a custom message on your output screen.',
				},
			],
		},
		break: {
			label: 'v1 - Break - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: this.CHOICES_showhide,
				},
			],
		},
		chatHide: {
			label: 'v1 - Chat - Hide',
		},
		imageNextPreviousHide: {
			label: 'v1 - Image - Next/Previous/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Next/Previous/Hide',
					id: 'value',
					default: 'next',
					choices: this.CHOICES_image,
				},
			],
		},
		imageSpecific: {
			label: 'v1 - Image - Show Specific',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '1',
					tooltip: "Display a specific image, where '1' will show the first image.",
				},
			],
		},
		score: {
			label: 'v1 - Score - Show/Hide',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'value',
					default: 'show',
					choices: this.CHOICES_showhide,
				},
			],
		},
		scoreIncreaseDecrease: {
			label: 'v1 - Score - Increase/Decrease score for specific team',
			options: [
				{
					type: 'textinput',
					label: 'Team',
					id: 'team',
					tooltip: 'Team to increase/decrease score.',
				},
				{
					type: 'textinput',
					label: 'Score',
					id: 'score',
					tooltip: "'1' would increase by 1 point, '-10' would decrease by 10 points.",
				},
			],
		},
	}
}

exports.getActionsV2 = function () {
	let SELECTED_PROJECT_GRAPHICS = this.SELECTED_PROJECT_GRAPHICS || []
	let SELECTED_PROJECT_MEDIA = this.SELECTED_PROJECT_MEDIA || []
	let SELECTED_PROJECT_THEMES = this.SELECTED_PROJECT_THEMES || {}
	return {
		run: {
			label: 'Run',
		},
		clear: {
			label: 'Hide all',
		},
		showHide: {
			label: 'Show/Hide graphic',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'status',
					default: 'coming',
					choices: this.GRAPHIC_STATUS_TOGGLES,
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
		},
		updateContentLowerThird: {
			label: 'Update content - Lower third',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'lower_third').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				{
					type: 'textinput',
					label: 'Line one',
					id: 'line_one',
				},
				{
					type: 'textinput',
					label: 'Line two',
					id: 'line_two',
				},
			],
		},
		updateContentLowerThirdAnimated: {
			label: 'Update content - Two Line',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'lower_third_animated').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				{
					type: 'dropdown',
					label: 'Animation',
					id: 'animationName',
					default: 'reveal',
					choices: [
						{
							id: 'reveal',
							label: 'Reveal',
						},
						{
							id: 'unfold',
							label: 'Unfold',
						},
						{
							id: 'slide-out',
							label: 'Slide out',
						},
					],
				},
				{
					type: 'checkbox',
					label: 'Two lines',
					id: 'twoLines',
					default: true,
				},
				{
					type: 'textinput',
					label: 'Line one',
					id: 'line_one',
				},
				{
					type: 'textinput',
					label: 'Line two',
					id: 'line_two',
				},
			],
		},
		updateContentMessage: {
			label: 'Update content - Message',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'message').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				{
					type: 'textinput',
					label: 'Message body',
					id: 'body',
				},
			],
		},
		updateContentTime: {
			label: 'Update content - Time',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'time').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: 'time_of_day',
					choices: [
						{
							id: 'time_of_day',
							label: 'Current time of day',
						},
						{
							id: 'to_time_of_day',
							label: 'To time of day',
						},
						{
							id: 'countdown',
							label: 'Count down',
						},
						{
							id: 'countup',
							label: 'Count up',
						},
					],
				},
				{
					type: 'textinput',
					label: 'Time (HH:MM:SS)',
					id: 'time',
					default: '00:01:00',
				},
			],
		},
		updateContentBigTimer: {
			label: 'Update content - Big Timer',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'big_time').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				{
					type: 'dropdown',
					label: 'Shape',
					id: 'shape',
					default: 'circle',
					choices: [
						{
							id: 'circle',
							label: 'Circle',
						},
						{
							id: 'line',
							label: 'Line',
						},
						{
							id: 'mask',
							label: 'Mask',
						},
					],
				},
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: 'countdown',
					choices: [
						{
							id: 'countdown',
							label: 'Count down',
						},
						{
							id: 'countup',
							label: 'Count up',
						},
					],
				},
				{
					type: 'textinput',
					label: 'Time (HH:MM:SS)',
					id: 'time',
					default: '00:01:00',
				},
			],
		},
		updateContentImage: {
			label: 'Update content - Image',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'image').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				{
					type: 'textinput',
					label: 'Name',
					id: 'imageName',
				},
				{
					type: 'dropdown',
					label: 'Image',
					id: 'imageFilename',
					choices: [
						...SELECTED_PROJECT_MEDIA.map((img, i) => {
							return {
								id: img.filename,
								label: img.originalname,
							}
						}),
					],
				},
			],
		},
		updateContentTicker: {
			label: 'Update content - Ticker',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'ticker').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				{
					type: 'textinput',
					label: 'Title',
					id: 'title',
				},
				{
					type: 'textinput',
					label: 'Items (Use | to split items)',
					id: 'items',
				},
			],
		},
		updateContentWebpage: {
			label: 'Update content - Webpage',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'webpage').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				{
					type: 'textinput',
					label: 'Name',
					id: 'name',
				},
				{
					type: 'textinput',
					label: 'URL',
					id: 'url',
				},
			],
		},
		updateContentScoreTotal: {
			label: 'Update content - Score - Total',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'score').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				{
					type: 'dropdown',
					label: 'Team number',
					id: 'team',
					default: '1',
					choices: [
						{ id: '1', label: '1' },
						{ id: '2', label: '2' },
					],
				},
				{
					type: 'dropdown',
					label: 'Level number',
					id: 'level',
					default: '1',
					choices: [
						{ id: '1', label: '1' },
						{ id: '2', label: '2' },
						{ id: '3', label: '3' },
						{ id: '4', label: '4' },
					],
				},
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: 'set',
					choices: [
						{ id: 'set', label: 'Set score' },
						{ id: 'up', label: 'Increment up' },
						{ id: 'down', label: 'Decrement down' },
					],
				},
				{
					type: 'number',
					label: 'Amount',
					id: 'amount',
					min: -1000,
					max: 1000,
					default: 1,
					step: 1,
					required: true,
					range: false,
				},
			],
		},
		updateGraphicPosition: {
			label: 'Update graphic position',
			options: [
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
				{
					type: 'dropdown',
					label: 'Position',
					id: 'position',
					default: 'mc',
					choices: [...this.GRAPHIC_POSITION_OPTIONS],
				},
			],
		},
		updateGraphicX: {
			label: 'Update graphic offset X',
			options: [
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
				{
					type: 'number',
					label: 'X (-100 to 100)',
					id: 'x',
					min: -100,
					max: 100,
					default: 0,
					step: 0.5,
					required: true,
					range: false,
				},
			],
		},
		updateGraphicY: {
			label: 'Update graphic offset Y',
			options: [
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
				{
					type: 'number',
					label: 'Y (-100 to 100)',
					id: 'y',
					min: -100,
					max: 100,
					default: 0,
					step: 0.5,
					required: true,
					range: false,
				},
			],
		},
		updateGraphicXY: {
			label: 'Update graphic offset X & Y',
			options: [
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
				{
					type: 'number',
					label: 'X (-100 to 100)',
					id: 'x',
					min: -100,
					max: 100,
					default: 0,
					step: 0.5,
					required: true,
					range: false,
				},
				{
					type: 'number',
					label: 'Y (-100 to 100)',
					id: 'y',
					min: -100,
					max: 100,
					default: 0,
					step: 0.5,
					required: true,
					range: false,
				},
			],
		},
		updateGraphicScale: {
			label: 'Update graphic scale',
			options: [
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
				{
					type: 'number',
					label: 'Scale (1 to 500)',
					id: 'scale',
					min: 1,
					max: 500,
					default: 100,
					step: 0.5,
					required: true,
					range: false,
				},
			],
		},
		updateGraphicTheme: {
			label: 'Update graphic theme',
			options: [
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
				{
					type: 'dropdown',
					label: 'Theme',
					id: 'theme',
					choices: [
						...Object.entries(SELECTED_PROJECT_THEMES).map(([id, theme]) => {
							return {
								id,
								label: theme.name,
							}
						}),
					],
				},
			],
		},
		setTextVariable: {
			label: 'Set text variable',
			options: [
				{
					type: 'dropdown',
					label: 'Text variable',
					id: 'variable',
					default: 'text.1',
					choices: [
						{
							id: 'text.1',
							label: '[text.1]',
						},
						{
							id: 'text.2',
							label: '[text.2]',
						},
						{
							id: 'text.3',
							label: '[text.3]',
						},
					],
				},
				{
					type: 'textinput',
					label: 'Text',
					id: 'text',
				},
			],
		},
		addVariableListItem: {
			label: 'Variable List - Add item',
			options: [
				{
					type: 'dropdown',
					label: 'List',
					id: 'listId',
					default: '1',
					choices: [
						{
							id: '1',
							label: '1',
						},
					],
				},
				{
					type: 'textinput',
					label: 'Column 1',
					id: 'colOne',
				},
				{
					type: 'textinput',
					label: 'Column 2',
					id: 'colTwo',
				},
				{
					type: 'textinput',
					label: 'Column 3',
					id: 'colThree',
				},
			],
		},
		addVariableSelectRow: {
			label: 'Variable List - Select row',
			options: [
				{
					type: 'dropdown',
					label: 'List',
					id: 'listId',
					default: '1',
					choices: [
						{
							id: '1',
							label: '1',
						},
					],
				},
				{
					type: 'dropdown',
					label: 'Next/Previous/Number',
					id: 'nextPreviousNumber',
					default: 'next',
					choices: [
						{
							id: 'next',
							label: 'Next',
						},
						{
							id: 'previous',
							label: 'Previous',
						},
						{
							id: 'number',
							label: 'Number',
						},
					],
				},
				{
					type: 'number',
					label: 'Row number',
					id: 'number',
					min: 1,
					max: 1000,
					default: 1,
					step: 1,
					required: true,
					range: false,
				},
			],
		},
	}
}

exports.executeActionV1 = function (action) {
	var self = this

	self.debug('action: ', action)

	let oscPrefix = '/h2r-graphics/'

	let path = null
	let bol = []

	switch (action.action) {
		case 'clearall':
			path = oscPrefix + 'clear'
			bol = []
			break
		case 'lowerthirdsShow':
			path = oscPrefix + 'lower-third'
			bol = [
				{
					type: 'i',
					value: parseInt(action.options.value),
				},
			]
			break
		case 'lowerthirdsHide':
			path = oscPrefix + 'lower-third'
			bol = [
				{
					type: 's',
					value: 'hide',
				},
			]
			break
		case 'ticker':
			path = oscPrefix + 'ticker'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'timer':
			path = oscPrefix + 'timer'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'timerCustomUp':
			path = oscPrefix + 'timer-custom-up'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'timerCustomDown':
			path = oscPrefix + 'timer-custom-down'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'timerCustomDownTimeOfDay':
			path = oscPrefix + 'timer-custom-down-time-of-day'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'timerCurrentTime':
			path = oscPrefix + 'timer-current-time'
			bol = []
			break
		case 'stopwatch':
			path = oscPrefix + 'stopwatch'
			bol = []
			break
		case 'timerPauseResume':
			path = oscPrefix + 'timer'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'timerPreMessage':
			path = oscPrefix + 'timer-pre-message'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'logo':
			path = oscPrefix + 'logo'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'message':
			path = oscPrefix + 'message'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'messageCustom':
			path = oscPrefix + 'message'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'break':
			path = oscPrefix + 'break'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'chatHide':
			path = oscPrefix + 'chat'
			bol = [
				{
					type: 's',
					value: 'hide',
				},
			]
			break
		case 'imageNextPreviousHide':
			path = oscPrefix + 'image'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'imageSpecific':
			path = oscPrefix + 'image'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'score':
			path = oscPrefix + 'score'
			bol = [
				{
					type: 's',
					value: action.options.value,
				},
			]
			break
		case 'scoreIncreaseDecrease':
			path = oscPrefix + 'score-team-' + action.options.team
			bol = [
				{
					type: 's',
					value: action.options.score,
				},
			]
			break
		default:
			self.log('info', `${action.action} is not available when version is set to v1.`)
			break
	}

	if (path !== null) {
		self.log('info', `${self.config.host}:${self.config.port}${path}, ${JSON.stringify(bol)}`)
		self.system.emit('osc_send', self.config.host, self.config.port, path, bol)
	}
}

exports.executeActionV2 = function (action) {
	var self = this
	var baseUri = `http://${self.config.host}:${self.config.portV2}/api/${self.config.projectId}`
	var cmd = ''
	var body = {}
	var header = {}

	var errorHandler = function (err, result) {
		if (err !== null) {
			self.log('error', `HTTP ${action.action.toUpperCase()} Request failed (${err.message})`)
			self.status(self.STATUS_ERROR, result.error.code)
		} else {
			self.status(self.STATUS_OK)
		}
	}

	self.debug('action: ', action)
	switch (action.action) {
		case 'run':
			cmd = 'run'
			break
		case 'clear':
			cmd = 'clear'
			break
		case 'showHide':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				status: action.options.status,
			}
			break
		case 'updateContentLowerThird':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				line_one: action.options.line_one,
				line_two: action.options.line_two,
			}
			break
		case 'updateContentLowerThirdAnimated':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				animationName: action.options.animationName,
				twoLines: action.options.twoLines,
				line_one: action.options.line_one,
				line_two: action.options.line_two,
			}
			break
		case 'updateContentMessage':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				body: action.options.body,
			}
			break
		case 'updateContentTime':
			cmd = `graphic/${action.options.graphicId}/update`
			let d = new Date()
			if (action.options.type === 'time_of_day') {
				body = {
					timerType: action.options.type,
				}
			} else if (action.options.type === 'to_time_of_day') {
				body = {
					timerType: action.options.type,
					endTime: action.options.time,
					timeLeft: stringToMS(action.options.time) - d.getMilliseconds(),
				}
			} else if (action.options.type === 'countdown') {
				body = {
					timerType: action.options.type,
					duration: action.options.time,
					timeLeft: stringToMS(action.options.time),
				}
			} else if (action.options.type === 'countup') {
				body = {
					timerType: action.options.type,
					duration: action.options.time,
					timeLeft: 0,
				}
			}
			break
		case 'updateContentBigTimer':
			cmd = `graphic/${action.options.graphicId}/update`
			if (action.options.type === 'countdown') {
				body = {
					shape: action.options.shape,
					timerType: action.options.type,
					duration: action.options.time,
					timeLeft: stringToMS(action.options.time),
				}
			} else if (action.options.type === 'countup') {
				body = {
					shape: action.options.shape,
					timerType: action.options.type,
					duration: action.options.time,
					timeLeft: 0,
				}
			}
			break
		case 'updateContentImage':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				name: action.options.imageName,
				url: `http://${self.config.host}:${self.config.portV2}/media/${action.options.imageFilename}`,
			}
			break
		case 'updateContentTicker':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				title: action.options.title,
				items: action.options.items.split('|').map((item, i) => {
					return {
						title: `Item ${i + 1}`,
						body: item,
					}
				}),
			}
			break
		case 'updateContentWebpage':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				name: action.options.name,
				url: action.options.url,
			}
			break
		case 'updateContentScoreTotal':
			cmd = `graphic/${action.options.graphicId}/updateScore/${action.options.team}/${action.options.level}/${action.options.type}/${action.options.amount}`
			break
		case 'updateGraphicPosition':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				position: action.options.position,
			}
			break
		case 'updateGraphicScale':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				scale: action.options.scale,
			}
			break
		case 'updateGraphicX':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				offsetX: action.options.x,
			}
			break
		case 'updateGraphicY':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				offsetY: action.options.y,
			}
			break
		case 'updateGraphicXY':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				offsetX: action.options.x,
				offsetY: action.options.y,
			}
			break
		case 'updateGraphicTheme':
			cmd = `graphic/${action.options.graphicId}/update`
			body = {
				theme: action.options.theme,
			}
			break
		case 'setTextVariable':
			cmd = `updateVariableText/${action.options.variable}`
			body = {
				text: action.options.text,
			}
			break
		case 'addVariableListItem':
			cmd = `updateVariableList/${action.options.listId}/addRow`
			body = {
				row: [{ value: action.options.colOne }, { value: action.options.colTwo }, { value: action.options.colThree }],
			}
			break
		case 'addVariableSelectRow':
			if (action.options.nextPreviousNumber === 'next' || action.options.nextPreviousNumber === 'previous') {
				cmd = `updateVariableList/${action.options.listId}/selectRow/${action.options.nextPreviousNumber}`
			} else {
				cmd = `updateVariableList/${action.options.listId}/selectRow/${action.options.number}`
			}

			break
		default:
			self.log('info', `${action.action} is not available when version is set to v2.`)
			break
	}

	if (cmd !== '') {
		self.system.emit('rest', `${baseUri}/${cmd}`, body, errorHandler, header)
	}
}
