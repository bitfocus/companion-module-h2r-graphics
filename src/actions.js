const { graphicToReadableLabel, stringToMS } = require('./utils')

module.exports = {
	setActions: function() {
		let self = this;

		let actions = {};

		if (self.config.useV2 == false) {
			//v1 uses OSC and different actions
			let oscPrefix = '/h2r-graphics/';
			let path = null;
			let bol = [];
			
			actions.clearall = {
				label: 'Clear All Graphics',
				callback: function (action, bank) {
					path = oscPrefix + 'clear';
					bol = [];
					self.sendCommand(path, bol);
				}
			};

			actions.lowerthirdsShow = {
				label: 'Lower Third - Show',
				options: [
					{
						type: 'textinput',
						label: 'Value',
						id: 'value',
						default: 1,
						regex: self.REGEX_SIGNED_NUMBER,
						tooltip: '(replace \"1\" with whichever lower third you want to show)',
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'lower-third'
					bol = [
						{
							type: 'i',
							value: parseInt(action.options.value),
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.lowerthirdsHide = {
				label: 'Lower Thirds - Hide',
				callback: function (action, bank) {
					path = oscPrefix + 'lower-third'
					bol = [
						{
							type: 's',
							value: 'hide',
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.ticker = {
				label: 'Ticker - Show/Hide',
				options: [
					{
						type: 'dropdown',
						label: 'Show/Hide',
						id: 'value',
						default: 'show',
						choices: self.CHOICES_showhide,
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'ticker'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.timer = {
				label: 'Timer - Show/Hide',
				options: [
					{
						type: 'dropdown',
						label: 'Show/Hide',
						id: 'value',
						default: 'show',
						choices: self.CHOICES_showhide,
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'timer'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.timerCustomUp = {
				label: 'Timer - Custom UP',
				options: [
					{
						type: 'textinput',
						label: 'Value',
						id: 'value',
						default: '01:00',
						tooltip: 'hh:mm (e.g. 01:00 = 1 hour timer)',
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'timer-custom-up'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.timerCustomDown = {
				label: 'Timer - Custom DOWN',
				options: [
					{
						type: 'textinput',
						label: 'Value',
						id: 'value',
						default: '00:01',
						tooltip: 'hh:mm (e.g. 00:01 = 1 minute timer)',
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'timer-custom-down'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.timerCustomDownTimeOfDay = {
				label: 'Timer - Custom Down to Time of Day',
				options: [
					{
						type: 'textinput',
						label: 'Value',
						id: 'value',
						default: '13:00',
						tooltip: 'hh:mm (e.g. 13:00 = Count down to 13:00)',
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'timer-custom-down-time-of-day'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.timerCurrentTime = {
				label: 'Timer - Current Time of Day',
				callback: function (action, bank) {
					path = oscPrefix + 'timer-current-time'
					bol = []
					self.sendCommand(path, bol);
				}
			};

			actions.stopwatch = {
				label: 'Stopwatch',
				callback: function (action, bank) {
					path = oscPrefix + 'stopwatch'
					bol = []
					self.sendCommand(path, bol);
				}
			};

			actions.timerPauseResume = {
				label: 'Timer - Pause/Resume',
				options: [
					{
						type: 'dropdown',
						label: 'Pause/Resume',
						id: 'value',
						default: 'pause',
						choices: self.CHOICES_pauseresume,
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'timer'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.timerPreMessage = {
				label: 'Timer - Set pre-timer custom message',
				options: [
					{
						type: 'textinput',
						label: 'Value',
						id: 'value',
						default: 'Starting soon...',
						tooltip: 'This custom message appears above the timer.',
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'timer-pre-message'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.logo = {
				label: 'Logo - Show/Hide',
				options: [
					{
						type: 'dropdown',
						label: 'Show/Hide',
						id: 'value',
						default: 'show',
						choices: self.CHOICES_showhide,
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'logo'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.message = {
				label: 'Message - Show/Hide',
				options: [
					{
						type: 'dropdown',
						label: 'Show/Hide',
						id: 'value',
						default: 'show',
						choices: self.CHOICES_showhide,
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'message'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.messageCustom = {
				label: 'Message - Set a custom message',
				options: [
					{
						type: 'textinput',
						label: 'Value',
						id: 'value',
						default: 'LIVE!',
						tooltip: 'Display a custom message on your output screen.',
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'message'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.break = {
				label: 'Break - Show/Hide',
				options: [
					{
						type: 'dropdown',
						label: 'Show/Hide',
						id: 'value',
						default: 'show',
						choices: self.CHOICES_showhide,
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'break'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.chatHide = {
				label: 'Chat - Hide',
				callback: function (action, bank) {
					path = oscPrefix + 'chat'
					bol = [
						{
							type: 's',
							value: 'hide',
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.imageNextPreviousHide = {
				label: 'Image - Next/Previous/Hide',
				options: [
					{
						type: 'dropdown',
						label: 'Next/Previous/Hide',
						id: 'value',
						default: 'next',
						choices: self.CHOICES_image,
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'image'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.imageSpecific = {
				label: 'Image - Show Specific',
				options: [
					{
						type: 'textinput',
						label: 'Value',
						id: 'value',
						default: '1',
						tooltip: "Display a specific image, where '1' will show the first image.",
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'image'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.score = {
				label: 'Score - Show/Hide',
				options: [
					{
						type: 'dropdown',
						label: 'Show/Hide',
						id: 'value',
						default: 'show',
						choices: self.CHOICES_showhide,
					},
				],
				callback: function (action, bank) {
					path = oscPrefix + 'score'
					bol = [
						{
							type: 's',
							value: action.options.value,
						},
					]
					self.sendCommand(path, bol);
				}
			};

			actions.scoreIncreaseDecrease = {
				label: 'Score - Increase/Decrease score for specific team',
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
				callback: function (action, bank) {
					path = oscPrefix + 'score-team-' + action.options.team
					bol = [
						{
							type: 's',
							value: action.options.score,
						},
					]
					self.sendCommand(path, bol);
				}
			};
		}
		else {
			//assume v2 or later
			let SELECTED_PROJECT_GRAPHICS = self.SELECTED_PROJECT_GRAPHICS || []
			let SELECTED_PROJECT_MEDIA = self.SELECTED_PROJECT_MEDIA || []
			let SELECTED_PROJECT_THEMES = self.SELECTED_PROJECT_THEMES || {}
			
			let cmd = ''
			let body = {}

			actions.run = {
				label: 'Run',
				callback: function (action, bank) {
					cmd = 'run';
					body = {};
					self.sendCommand(cmd, body);
				}
			};

			actions.clear = {
				label: 'Hide all',
				callback: function (action, bank) {
					cmd = 'clear';
					body = {};
					self.sendCommand(cmd, body);
				}
			};

			actions.showHide = {
				label: 'Show/Hide graphic',
				options: [
					{
						type: 'dropdown',
						label: 'Show/Hide',
						id: 'status',
						default: 'coming',
						choices: self.GRAPHIC_STATUS_TOGGLES,
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						status: action.options.status,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateContentLowerThird = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						line_one: action.options.line_one,
						line_two: action.options.line_two,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateContentLowerThirdAnimated = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						animationName: action.options.animationName,
						twoLines: action.options.twoLines,
						line_one: action.options.line_one,
						line_two: action.options.line_two,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateContentMessage = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						body: action.options.body,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateContentTime = {
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
				callback: function (action, bank) {
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
					self.sendCommand(cmd, body);
				}
			};

			actions.updateContentBigTimer = {
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
				callback: function (action, bank) {
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
					self.sendCommand(cmd, body);
				}
			};

			actions.updateContentImage = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						name: action.options.imageName,
						url: `http://${self.config.host}:${self.config.portV2}/media/${action.options.imageFilename}`,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateContentTicker = {
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
				callback: function (action, bank) {
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
					self.sendCommand(cmd, body);
				}
			};

			actions.updateContentWebpage = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						name: action.options.name,
						url: action.options.url,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateContentScoreTotal = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/updateScore/${action.options.team}/${action.options.level}/${action.options.type}/${action.options.amount}`
					self.sendCommand(cmd, body);
				}
			};

			actions.updateGraphicPosition = {
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
						choices: [...self.GRAPHIC_POSITION_OPTIONS],
					},
				],
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						position: action.options.position,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateGraphicX = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						offsetX: action.options.x,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateGraphicY = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						offsetY: action.options.y,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateGraphicXY = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						offsetX: action.options.x,
						offsetY: action.options.y,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateGraphicScale = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						scale: action.options.scale,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.updateGraphicTheme = {
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
				callback: function (action, bank) {
					cmd = `graphic/${action.options.graphicId}/update`
					body = {
						theme: action.options.theme,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.setTextVariable = {
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
				callback: function (action, bank) {
					cmd = `updateVariableText/${action.options.variable}`
					body = {
						text: action.options.text,
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.addVariableListItem = {
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
				callback: function (action, bank) {
					cmd = `updateVariableList/${action.options.listId}/addRow`
					body = {
						row: [{ value: action.options.colOne }, { value: action.options.colTwo }, { value: action.options.colThree }],
					}
					self.sendCommand(cmd, body);
				}
			};

			actions.addVariableSelectRow = {
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
				callback: function (action, bank) {
					if (action.options.nextPreviousNumber === 'next' || action.options.nextPreviousNumber === 'previous') {
						cmd = `updateVariableList/${action.options.listId}/selectRow/${action.options.nextPreviousNumber}`
					} else {
						cmd = `updateVariableList/${action.options.listId}/selectRow/${action.options.number}`
					}
					self.sendCommand(cmd, body);
				}
			};
		}

		return actions;
	}
}