import got from 'got'

import { graphicToReadableLabel, stringToMS } from './utils.js'

const GRAPHIC_STATUS_TOGGLES = [
	{ id: 'coming', label: 'Show' },
	{ id: 'going', label: 'Hide' },
	{ id: 'toggle', label: 'Toggle' },
	{ id: 'cued', label: 'Cue on' },
	{ id: 'cuedoff', label: 'Cue off' },
]

const GRAPHIC_POSITION_OPTIONS = [
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

export const actionsV2 = (self) => {
	let SELECTED_PROJECT_GRAPHICS = self.SELECTED_PROJECT_GRAPHICS || []
	let SELECTED_PROJECT_MEDIA = self.SELECTED_PROJECT_MEDIA || []
	let SELECTED_PROJECT_THEMES = self.SELECTED_PROJECT_THEMES || {}

	const sendHttpMessage = async (cmd = '', body = {}) => {
		var baseUri = `http://${self.config.host}:${self.config.portV2}/api/${self.config.projectId}`

		self.log('debug', `ATTEMPTING ${baseUri}/${cmd}`)
		await got.post(`${baseUri}/${cmd}`, {
			json: {
				...body,
			},
		})
	}

	return {
		run: {
			name: 'Run',
			options: [],
			callback: async () => {
				sendHttpMessage(`run`)
			},
		},
		clear: {
			name: 'Hide all',
			options: [],
			callback: async () => {
				sendHttpMessage(`clear`)
			},
		},
		showHide: {
			name: 'Show/Hide graphic',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'status',
					default: 'coming',
					choices: GRAPHIC_STATUS_TOGGLES,
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
			callback: async (action) => {
				sendHttpMessage(`graphic/${action.options.graphicId}/update`, {
					status: action.options.status,
				})
			},
		},
		showHideGraphicWithVariable: {
			name: 'Show/Hide graphic (using Text or Variable)',
			options: [
				{
					type: 'dropdown',
					label: 'Show/Hide',
					id: 'status',
					default: 'coming',
					choices: GRAPHIC_STATUS_TOGGLES,
				},
				{
					type: 'textinput',
					label: 'Graphic',
					id: 'graphicId',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action) => {
				const graphicId = await self.parseVariablesInString(action.options.graphicId || '')
				sendHttpMessage(`graphic/${graphicId}/update`, {
					status: action.options.status,
				})
			},
		},
		updateContentLowerThird: {
			name: 'Update content - Lower third',
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
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Line two',
					id: 'line_two',
					useVariables: true,
				},
			],
			callback: async (action) => {
				let l1 = await self.parseVariablesInString(action.options.line_one || '')
				let l2 = await self.parseVariablesInString(action.options.line_two || '')
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					line_one: l1,
					line_two: l2,
				}
				await sendHttpMessage(cmd, body)
			},
		},
		updateContentLowerThirdAnimated: {
			name: 'Update content - Lower Third Animated',
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
					type: 'textinput',
					label: 'Line one',
					id: 'line_one',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Line two',
					id: 'line_two',
					useVariables: true,
				},
			],
			callback: async (action) => {
				let l1 = await self.parseVariablesInString(action.options.line_one || '')
				let l2 = await self.parseVariablesInString(action.options.line_two || '')

				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					animationName: action.options.animationName,
					line_one: l1,
					line_two: l2,
				}
				await sendHttpMessage(cmd, body)
			},
		},
		updateContentMessage: {
			name: 'Update content - Message',
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
					useVariables: true,
				},
			],
			callback: async (action) => {
				let b = await self.parseVariablesInString(action.options.body || '')

				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					body: b,
				}
				await sendHttpMessage(cmd, body)
			},
		},
		updateContentTime: {
			name: 'Update content - Time',
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
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {}
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
						durationMS: stringToMS(action.options.time),
						timeLeft: stringToMS(action.options.time),
					}
				} else if (action.options.type === 'countup') {
					body = {
						timerType: action.options.type,
						duration: action.options.time,
						durationMS: stringToMS(action.options.time),
						timeLeft: 0,
					}
				}

				sendHttpMessage(cmd, body)
			},
		},
		updateContentBigTimer: {
			name: 'Update content - Big Timer',
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
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {}
				if (action.options.type === 'countdown') {
					body = {
						shape: action.options.shape,
						timerType: action.options.type,
						duration: action.options.time,
						durationMS: stringToMS(action.options.time),
						timeLeft: stringToMS(action.options.time),
					}
				} else if (action.options.type === 'countup') {
					body = {
						shape: action.options.shape,
						timerType: action.options.type,
						duration: action.options.time,
						durationMS: stringToMS(action.options.time),
						timeLeft: 0,
					}
				}

				sendHttpMessage(cmd, body)
			},
		},
		updateContentImage: {
			name: 'Update content - Image',
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
						...SELECTED_PROJECT_MEDIA.map((img) => {
							return {
								id: img.filename,
								label: img.originalname,
							}
						}),
					],
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					name: action.options.image_name,
					filename: `${action.options.imageFilename}`,
				}

				sendHttpMessage(cmd, body)
			},
		},
		updateContentTicker: {
			name: 'Update content - Ticker',
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
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Items (Use | to split items)',
					id: 'items',
					useVariables: true,
				},
			],
			callback: async (action) => {
				let t = await self.parseVariablesInString(action.options.title || '')
				let items = await self.parseVariablesInString(action.options.items || '')

				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					title: t,
					items: items.split('|').map((item, i) => {
						return {
							title: `Item ${i + 1}`,
							body: item,
						}
					}),
				}

				await sendHttpMessage(cmd, body)
			},
		},
		updateContentWebpage: {
			name: 'Update content - Webpage',
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
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'URL',
					id: 'url',
					useVariables: true,
				},
			],
			callback: async (action) => {
				let name = await self.parseVariablesInString(action.options.name || '')
				let url = await self.parseVariablesInString(action.options.url || '')

				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					name: name,
					url: url,
				}

				await sendHttpMessage(cmd, body)
			},
		},
		updateContentUtilityLargeText: {
			name: 'Update content - Large Text (Utility)',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'utility_large_text').map((c) => {
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
					label: 'Text',
					id: 'text',
					useVariables: true,
				},
			],
			callback: async (action) => {
				let t = await self.parseVariablesInString(action.options.text || '')

				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					text: t,
				}
				await sendHttpMessage(cmd, body)
			},
		},
		speakerTimerRun: {
			name: 'Run/Resume - Timer',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) =>
							['utility_speaker_timer', 'time_countdown', 'time_countup'].includes(c.type)
						).map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/timer/run`
				await sendHttpMessage(cmd)
			},
		},
		speakerTimerReset: {
			name: 'Reset - Timer',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) =>
							['utility_speaker_timer', 'time_countdown', 'time_countup'].includes(c.type)
						).map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/timer/reset`
				await sendHttpMessage(cmd)
			},
		},
		speakerTimerPause: {
			name: 'Pause - Timer',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) =>
							['utility_speaker_timer', 'time_countdown', 'time_countup'].includes(c.type)
						).map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/timer/pause`
				await sendHttpMessage(cmd)
			},
		},
		speakerTimerJump: {
			name: 'Add/Remove time - Timer',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) =>
							['utility_speaker_timer', 'time_countdown', 'time_countup'].includes(c.type)
						).map((c) => {
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
					label: 'Amount in seconds (+/-)',
					id: 'amount',
					default: 10,
					step: 1,
					required: true,
					range: false,
				},
			],
			callback: async (action) => {
				let t = await self.parseVariablesInString(action.options.amount || 0)

				let cmd = `graphic/${action.options.graphicId}/timer/jump/${t}`

				await sendHttpMessage(cmd)
			},
		},
		speakerTimerDuration: {
			name: 'Set duration - Timer',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) =>
							['utility_speaker_timer', 'time_countdown', 'time_countup'].includes(c.type)
						).map((c) => {
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
					label: 'Time (HH:MM:SS)',
					id: 'time',
					default: '00:01:00',
				},
			],
			callback: async (action) => {
				let t = await self.parseVariablesInString(action.options.time || 0)

				let cmd = `graphic/${action.options.graphicId}/timer/duration/${stringToMS(t) / 1000}`

				await sendHttpMessage(cmd)
			},
		},
		speakerTimerSetMessage: {
			name: 'Speaker Timer - Set Message to speaker',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'utility_speaker_timer').map((c) => {
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
					label: 'Message',
					id: 'body',
					useVariables: true,
				},
			],
			callback: async (action) => {
				let b = await self.parseVariablesInString(action.options.body || '')

				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					speakerMessage: b,
				}
				await sendHttpMessage(cmd, body)
			},
		},
		speakerTimerToggleMessage: {
			name: 'Speaker Timer - Show/Hide message to speaker',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'utility_speaker_timer').map((c) => {
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
					label: 'Show/Hide',
					id: 'status',
					default: 'true',
					choices: [
						{ id: true, label: 'Show' },
						{ id: false, label: 'Hide' },
					],
				},
			],
			callback: async (action) => {
				let choice = action.options.status

				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					showSpeakerMessage: String(choice) === 'true' ? true : false,
				}
				await sendHttpMessage(cmd, body)
			},
		},
		updateContentScoreTotal: {
			name: 'Update content - Score - Total',
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
						{ id: '5', label: '5' },
						{ id: '6', label: '6' },
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
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/updateScore/${action.options.team}/${action.options.level}/${action.options.type}/${action.options.amount}`

				sendHttpMessage(cmd)
			},
		},
		updateGraphicPosition: {
			name: 'Update graphic position',
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
					choices: [...GRAPHIC_POSITION_OPTIONS],
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					position: action.options.position,
				}
				sendHttpMessage(cmd, body)
			},
		},
		updateGraphicX: {
			name: 'Update graphic offset X',
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
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					offsetX: action.options.x,
				}
				sendHttpMessage(cmd, body)
			},
		},
		updateGraphicY: {
			name: 'Update graphic offset Y',
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
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					offsetY: action.options.y,
				}
				sendHttpMessage(cmd, body)
			},
		},
		updateGraphicXY: {
			name: 'Update graphic offset X & Y',
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
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					offsetX: action.options.x,
					offsetY: action.options.y,
				}

				sendHttpMessage(cmd, body)
			},
		},
		updateGraphicScale: {
			name: 'Update graphic scale',
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
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					scale: action.options.scale,
				}

				sendHttpMessage(cmd, body)
			},
		},
		updateGraphicTheme: {
			name: 'Update graphic theme',
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
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					theme: action.options.theme,
				}
				sendHttpMessage(cmd, body)
			},
		},
		setTextVariable: {
			name: 'Set text variable',
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
						{
							id: 'text.4',
							label: '[text.4]',
						},
						{
							id: 'text.5',
							label: '[text.5]',
						},
						{
							id: 'text.6',
							label: '[text.6]',
						},
					],
				},
				{
					type: 'textinput',
					label: 'Text',
					id: 'text',
				},
			],
			callback: async (action) => {
				let cmd = `updateVariableText/${action.options.variable}`
				let body = {
					text: action.options.text,
				}

				sendHttpMessage(cmd, body)
			},
		},
		addVariableListItem: {
			name: 'Variable List - Add item',
			options: [
				{
					type: 'number',
					label: 'List',
					id: 'listId',
					default: '1',
					min: 1,
					max: 100,
					step: 1,
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
			callback: async (action) => {
				let cmd = `updateVariableList/${action.options.listId}/addRow`
				let body = {
					row: [{ value: action.options.colOne }, { value: action.options.colTwo }, { value: action.options.colThree }],
				}

				sendHttpMessage(cmd, body)
			},
		},
		addVariableSelectRow: {
			name: 'Variable List - Select row',
			options: [
				{
					type: 'number',
					label: 'List',
					id: 'listId',
					default: '1',
					min: 1,
					max: 100,
					step: 1,
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
					isVisible: (values) => values.nextPreviousNumber === 'number',
				},
			],
			callback: async (action) => {
				let cmd
				if (action.options.nextPreviousNumber === 'next' || action.options.nextPreviousNumber === 'previous') {
					cmd = `updateVariableList/${action.options.listId}/selectRow/${action.options.nextPreviousNumber}`
				} else {
					cmd = `updateVariableList/${action.options.listId}/selectRow/${action.options.number}`
				}

				sendHttpMessage(cmd)
			},
		},
		setTransitionOverride: {
			name: 'Set Transition Override',
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
					label: 'Next/Previous/Number',
					id: 'override',
					default: 'use-theme',
					choices: [
						{
							label: 'Use theme transition (default)',
							id: 'use-theme',
						},
						{
							label: 'None',
							id: 'none',
						},
						{
							label: 'Fade',
							id: 'fade',
						},
						{
							label: 'Slide',
							id: 'slide',
						},
						{
							label: 'Slide & Fade',
							id: 'slide_fade',
						},
						{
							label: 'Scale',
							id: 'scale',
						},
						{
							label: 'Scale & Fade',
							id: 'scale_fade',
						},
						{
							label: 'Blur & Fade',
							id: 'blur_fade',
						},
					],
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					transition: action.options.override,
				}

				await sendHttpMessage(cmd, body)
			},
		},
		sendCustonHTTP: {
			name: 'Send custom HTTP',
			options: [
				{
					type: 'textinput',
					label: 'URI',
					id: 'uri',
				},
			],
			callback: async (action) => {
				let cmd = `${action.options.uri}`
				sendHttpMessage(cmd)
			},
		},
	}
}
