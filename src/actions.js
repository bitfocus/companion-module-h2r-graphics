import got from 'got'

import { graphicToReadableLabel, stringToMS } from './utils.js'
import { splitHex } from '@companion-module/base'

const GRAPHIC_STATUS_TOGGLES = [
	{ id: 'coming', label: 'Show' },
	{ id: 'going', label: 'Hide' },
	{ id: 'toggle', label: 'Toggle on/off air' },
	{ id: 'cued', label: 'Cue on' },
	{ id: 'cuedoff', label: 'Cue off' },
	{ id: 'toggle-cued', label: 'Toggle Cued on/off' },
]

const DRAW_BRUSH_SIZES = [
	{ label: 'Extra small', id: 1 },
	{ label: 'Small', id: 3 },
	{ label: 'Medium', id: 6 },
	{ label: 'Large', id: 8 },
	{ label: 'Extra large', id: 10 },
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
	let SELECTED_PROJECT_GOOGLE_SHEETS = self.SELECTED_PROJECT_GOOGLE_SHEETS || {}
	let SELECTED_PROJECT_VARIABLES = self.SELECTED_PROJECT_VARIABLES || {}

	// Text variables come from the project itself, so the list grows with however many
	// the user has defined. dynamicText also holds other data sources (lists, sheets etc)
	// which updateVariableText can't set, so only offer the [text.x] ones.
	// [text.1] to [text.6] are always listed, so they stay selectable before the module
	// has connected or when the project hasn't reported them yet.
	const DEFAULT_TEXT_VARIABLES = ['text.1', 'text.2', 'text.3', 'text.4', 'text.5', 'text.6']

	const TEXT_VARIABLE_CHOICES = [
		...new Set([...DEFAULT_TEXT_VARIABLES, ...Object.keys(SELECTED_PROJECT_VARIABLES).filter((id) => /^text\.\d+$/.test(id))]),
	]
		// Sort numerically so [text.10] follows [text.9].
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
		.map((id) => ({
			id,
			label: `[${id}]`,
		}))

	const GOOGLE_SHEET_CHOICES = Object.entries(SELECTED_PROJECT_GOOGLE_SHEETS).map(([key, sheet]) => ({
		id: key,
		label: `${sheet.sheetTab} (${sheet.sheetId})`,
	}))

	// The sheet dropdowns allow custom values so a sheet can be picked at runtime. A typed
	// value may contain variables, and can reference the sheet by its internal id, its tab
	// name or its sheet id - the internal ids aren't meaningful to users writing expressions.
	const resolveGoogleSheet = async (value) => {
		if (SELECTED_PROJECT_GOOGLE_SHEETS[value]) return SELECTED_PROJECT_GOOGLE_SHEETS[value]

		const parsed = (await self.parseVariablesInString(value || '')).trim()
		if (SELECTED_PROJECT_GOOGLE_SHEETS[parsed]) return SELECTED_PROJECT_GOOGLE_SHEETS[parsed]

		const match = Object.values(SELECTED_PROJECT_GOOGLE_SHEETS).find(
			(sheet) => sheet.sheetTab === parsed || sheet.sheetId === parsed
		)
		if (match) return match

		// Fall back to treating the value as "sheetId/sheetTab" so sheets that aren't in the
		// project list yet can still be targeted.
		const [sheetId, ...tabParts] = parsed.split('/')
		if (sheetId && tabParts.length > 0) return { sheetId, sheetTab: tabParts.join('/') }

		self.log('warn', `Google Sheet "${parsed}" not found in project.`)
		return null
	}

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
		draw_on: {
			name: 'Draw on screen - On',
			options: [],
			callback: async () => {
				sendHttpMessage(`draw/on`)
			},
		},
		draw_off: {
			name: 'Draw on screen - Off',
			options: [],
			callback: async () => {
				sendHttpMessage(`draw/off`)
			},
		},
		draw_size: {
			name: 'Draw on screen - Set brush size',
			options: [
				{
					type: 'dropdown',
					label: 'Brush size',
					id: 'size',
					default: DRAW_BRUSH_SIZES[3].id,
					choices: DRAW_BRUSH_SIZES,
				},
			],
			callback: async (action) => {
				sendHttpMessage(`draw/size/${action.options.size}`)
			},
		},
		draw_color: {
			name: 'Draw on screen - Set color',
			options: [
				{
					id: 'color',
					type: 'colorpicker',
					label: 'Brush color',
					default: 'rgb(255, 0, 0)',
				},
			],
			callback: async (action) => {
				const color = splitHex(action.options.color)
				console.log('COLOUR', color)
				sendHttpMessage(`draw/color/${color.split('#')[1]}`)
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
				{
					type: 'textinput',
					label: 'Line three',
					id: 'line_three',
					useVariables: true,
				},
			],
			callback: async (action) => {
				let l1 = await self.parseVariablesInString(action.options.line_one || '')
				let l2 = await self.parseVariablesInString(action.options.line_two || '')
				let l3 = await self.parseVariablesInString(action.options.line_three || '')
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					line_one: l1,
					line_two: l2,
					line_three: l3,
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
						{
							id: 'stretch',
							label: 'Stretch',
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
		refreshWebpage: {
			name: 'Refresh Webpage',
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
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					refreshCount: new Date().getTime(),
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
							[
								'utility_speaker_timer',
								'time_countdown',
								'time_countup',
								'big_time_countdown',
								'big_time_countup',
							].includes(c.type)
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
							[
								'utility_speaker_timer',
								'time_countdown',
								'time_countup',
								'big_time_countdown',
								'big_time_countup',
							].includes(c.type)
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
							[
								'utility_speaker_timer',
								'time_countdown',
								'time_countup',
								'big_time_countdown',
								'big_time_countup',
							].includes(c.type)
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
							[
								'utility_speaker_timer',
								'time_countdown',
								'time_countup',
								'big_time_countdown',
								'big_time_countup',
							].includes(c.type)
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
					label: 'Amount in seconds (+/-)',
					id: 'amount',
					default: '10',
					required: true,
					useVariables: true,
				},
			],
			callback: async (action) => {
				// parseVariablesInString expects a string, and older versions of this action
				// stored `amount` as a number, so coerce before parsing.
				let t = await self.parseVariablesInString(String(action.options.amount ?? '0'))

				const seconds = parseInt(t, 10)
				if (isNaN(seconds)) {
					return self.log('warn', `Add/Remove time: "${t}" is not a valid number of seconds.`)
				}

				let cmd = `graphic/${action.options.graphicId}/timer/jump/${seconds}`

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
					useVariables: true,
				},
			],
			callback: async (action) => {
				let t = await self.parseVariablesInString(String(action.options.time ?? '00:00:00'))

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
		clearMapPins: {
			name: 'Clear pins on the Map graphic',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'map').map((c) => {
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
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					removePinCount: new Date().getTime(),
				}

				await sendHttpMessage(cmd, body)
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
					default: DEFAULT_TEXT_VARIABLES[0],
					choices: TEXT_VARIABLE_CHOICES,
					allowCustom: true,
				},
				{
					type: 'textinput',
					label: 'Text',
					id: 'text',
					useVariables: true,
				},
			],
			callback: async (action) => {
				let cmd = `updateVariableText/${action.options.variable}`
				let body = {
					text: await self.parseVariablesInString(action.options.text || ''),
				}
				// const graphicId = await self.parseVariablesInString(action.options.graphicId || '')
				// sendHttpMessage(`graphic/${graphicId}/update`, {
				// 	status: action.options.status,
				// })

				sendHttpMessage(cmd, body)
			},
		},
		addVariableListItem: {
			name: 'Variable List - Add item',
			options: [
				{
					type: 'textinput',
					label: 'List',
					id: 'listId',
					default: 1,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Column 1',
					id: 'colOne',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Column 2',
					id: 'colTwo',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Column 3',
					id: 'colThree',
					useVariables: true,
				},
			],
			callback: async (action) => {
				let var1 = await self.parseVariablesInString(action.options.colOne || '')
				let var2 = await self.parseVariablesInString(action.options.colTwo || '')
				let var3 = await self.parseVariablesInString(action.options.colThree || '')

				const listId = await self.parseVariablesInString(action.options.listId || 1)

				let cmd = `updateVariableList/${parseInt(listId)}/addRow`
				let body = {
					row: [{ value: var1 }, { value: var2 }, { value: var3 }],
				}

				sendHttpMessage(cmd, body)
			},
		},
		addVariableSelectRow: {
			name: 'Variable List - Select row',
			options: [
				{
					type: 'textinput',
					label: 'List',
					id: 'listId',
					default: 1,
					useVariables: true,
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
					type: 'textinput',
					label: 'Row number',
					id: 'number',
					required: true,
					range: false,
					useVariables: true,
					isVisible: (values) => values.nextPreviousNumber === 'number',
				},
			],
			callback: async (action) => {
				let cmd
				const listId = await self.parseVariablesInString(action.options.listId || 1)
				const number = await self.parseVariablesInString(action.options.number || 1)
				if (action.options.nextPreviousNumber === 'next' || action.options.nextPreviousNumber === 'previous') {
					cmd = `updateVariableList/${parseInt(listId)}/selectRow/${action.options.nextPreviousNumber}`
				} else {
					cmd = `updateVariableList/${parseInt(listId)}/selectRow/${parseInt(number)}`
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
		updateCustomHtmlTemplate: {
			name: 'Update content - Custom HTML',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					default: SELECTED_PROJECT_GRAPHICS.length > 0 ? SELECTED_PROJECT_GRAPHICS[0].id : '',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'custom_html').map((c) => {
							const { id, label } = graphicToReadableLabel(c)

							return {
								id,
								label,
							}
						}),
					],
				},
				...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'custom_html' && c.template?.properties)
					.map((c) => {
						return Object.entries(c.template.properties).map(([key, _d]) => {
							return {
								type: 'textinput',
								label: _d.label,
								id: key,
								tooltip: _d.description,
								default: c.data?.[key],
								useVariables: true,
								isVisibleData: c.id,
								isVisible: (values, data) => values['graphicId'] == data,
							}
						})
					})
					.flat(),
			],
			callback: async (action) => {
				const graphic = SELECTED_PROJECT_GRAPHICS.find((c) => c.id === action.options.graphicId)
				const properties = graphic?.template?.properties

				if (!properties) {
					self.log('warn', `Custom HTML graphic (${action.options.graphicId}) has no template properties.`)
					return
				}

				// Only send the properties belonging to the selected graphic. Every custom HTML
				// graphic in the project contributes its own options to this action, so
				// action.options also holds fields from the other graphics.
				// The app merges the update shallowly, so `data` is replaced wholesale - spread
				// the existing values first to avoid clearing properties left blank here.
				const data = { ...graphic.data }
				for (const key of Object.keys(properties)) {
					const value = action.options[key]
					if (value === undefined) continue

					data[key] = await self.parseVariablesInString(value)
				}

				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					data,
				}

				await sendHttpMessage(cmd, body)
			},
		},
		googleSheetSelectRow: {
			name: 'Google Sheet - Select Row',
			options: [
				{
					type: 'dropdown',
					label: 'Sheet',
					id: 'sheetInternalId',
					default: GOOGLE_SHEET_CHOICES.length > 0 ? GOOGLE_SHEET_CHOICES[0].id : '',
					choices: GOOGLE_SHEET_CHOICES,
					allowCustom: true,
					tooltip: 'Pick a sheet, or enter a tab name, sheet ID or variable to select one at runtime.',
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
						{
							id: 'match',
							label: 'Match column value',
						},
					],
				},
				{
					type: 'textinput',
					label: 'Row number',
					id: 'selectedRow',
					required: true,
					range: false,
					useVariables: true,
					isVisible: (values) => values.nextPreviousNumber === 'number',
				},
				{
					type: 'textinput',
					label: 'Column',
					id: 'matchColumn',
					tooltip: 'Column header to search, e.g. the column holding unique IDs. Spaces become underscores.',
					useVariables: true,
					isVisible: (values) => values.nextPreviousNumber === 'match',
				},
				{
					type: 'textinput',
					label: 'Value to match',
					id: 'matchValue',
					useVariables: true,
					isVisible: (values) => values.nextPreviousNumber === 'match',
				},
			],
			callback: async (action) => {
				const sheet = await resolveGoogleSheet(action.options.sheetInternalId)
				if (!sheet) return

				let selectedRow
				if (action.options.nextPreviousNumber === 'next' || action.options.nextPreviousNumber === 'previous') {
					selectedRow = action.options.nextPreviousNumber
				} else if (action.options.nextPreviousNumber === 'match') {
					// Find the row ourselves - the app only selects by index, so look the value up
					// in the sheet data we already hold and send the index it lives at.
					if (!sheet.data) {
						return self.log('warn', 'Google Sheet has no data yet. Refresh the sheet before matching a row.')
					}

					// Headers have their spaces replaced with underscores when the sheet is parsed.
					const column = (await self.parseVariablesInString(action.options.matchColumn || '')).trim().replace(/\s+/g, '_')
					const value = (await self.parseVariablesInString(action.options.matchValue || '')).trim()

					if (!column) return self.log('warn', 'Google Sheet - Select Row: no column given to match against.')

					const index = sheet.data.findIndex((row) => String(row?.[column] ?? '').trim() === value)

					if (index === -1) {
						return self.log('warn', `Google Sheet - Select Row: no row where "${column}" is "${value}".`)
					}

					selectedRow = index
				} else {
					selectedRow = await self.parseVariablesInString(action.options.selectedRow || '1')
				}
				let cmd = `googleSheet/selectRow/${sheet.sheetId}/${sheet.sheetTab}/${selectedRow}`
				await sendHttpMessage(cmd)
			},
		},
		googleSheetRefresh: {
			name: 'Google Sheet - Refresh sheet data',
			options: [
				{
					type: 'dropdown',
					label: 'Sheet',
					id: 'sheetInternalId',
					default: GOOGLE_SHEET_CHOICES.length > 0 ? GOOGLE_SHEET_CHOICES[0].id : '',
					choices: GOOGLE_SHEET_CHOICES,
					allowCustom: true,
					tooltip: 'Pick a sheet, or enter a tab name, sheet ID or variable to select one at runtime.',
				},
			],
			callback: async (action) => {
				const sheet = await resolveGoogleSheet(action.options.sheetInternalId)
				if (!sheet) return

				let cmd = `googleSheet/check/${sheet.sheetId}/${sheet.sheetTab}`
				await sendHttpMessage(cmd)
			},
		},
		telestratorSetTool: {
			name: 'Telestrator - Set tool',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'telestrator').map((c) => {
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
					label: 'Tool',
					id: 'tool',
					default: 'pen',
					choices: [
						{ id: 'pen', label: 'Pen' },
						{ id: 'highlighter', label: 'Highlighter' },
						{ id: 'arrow', label: 'Arrow' },
						{ id: 'circle', label: 'Circle' },
						{ id: 'rectangle', label: 'Rectangle' },
						{ id: 'line', label: 'Line' },
						{ id: 'eraser', label: 'Eraser' },
					],
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					tool: action.options.tool,
				}
				await sendHttpMessage(cmd, body)
			},
		},
		telestratorSetColor: {
			name: 'Telestrator - Set color',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'telestrator').map((c) => {
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
					label: 'Color',
					id: 'color',
					default: '#ff0000',
					choices: [
						{ id: '#ff0000', label: 'Red' },
						{ id: '#ffff00', label: 'Yellow' },
						{ id: '#00ff00', label: 'Green' },
						{ id: '#00bfff', label: 'Light Blue' },
						{ id: '#0000ff', label: 'Blue' },
						{ id: '#ff00ff', label: 'Magenta' },
						{ id: '#ffffff', label: 'White' },
						{ id: '#000000', label: 'Black' },
					],
					allowCustom: true,
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					brushColor: action.options.color,
				}
				await sendHttpMessage(cmd, body)
			},
		},
		telestratorSetBrushSize: {
			name: 'Telestrator - Set brush size',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'telestrator').map((c) => {
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
					label: 'Brush size (1-20)',
					id: 'brushSize',
					min: 1,
					max: 20,
					default: 3,
					step: 1,
					required: true,
					range: false,
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					brushSize: action.options.brushSize,
				}
				await sendHttpMessage(cmd, body)
			},
		},
		telestratorUndo: {
			name: 'Telestrator - Undo',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'telestrator').map((c) => {
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
				let cmd = `graphic/${action.options.graphicId}/telestrator/undo`
				await sendHttpMessage(cmd)
			},
		},
		telestratorDelete: {
			name: 'Telestrator - Delete all',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'telestrator').map((c) => {
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
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					strokes: [],
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
		progressUpdatePercent: {
			name: 'Progress - Set % complete',
			options: [
				{
					type: 'dropdown',
					label: 'Graphic',
					id: 'graphicId',
					choices: [
						...SELECTED_PROJECT_GRAPHICS.filter((c) => c.type === 'progress').map((c) => {
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
					label: '% Complete (0-100)',
					id: 'percent',
					min: 0,
					max: 100,
					default: 0,
					step: 1,
					required: true,
					range: false,
				},
			],
			callback: async (action) => {
				let cmd = `graphic/${action.options.graphicId}/update`
				let body = {
					percent: action.options.percent,
				}
				await sendHttpMessage(cmd, body)
			},
		},
	}
}
