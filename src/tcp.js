import io from 'socket.io-client'

import { graphicToReadableLabel, replaceWithDataSource } from './utils.js'

let socket = null

const intervalIdObj = {}

const toTimeString = (timeLeft, amount = 'full') => {
	const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24) || 0
	const minutes = Math.floor((timeLeft / (1000 * 60)) % 60) || 0
	const seconds = Math.floor((timeLeft / 1000) % 60) || 0

	if (amount == 'hh') return hours.toString().padStart(2, '0')
	if (amount == 'mm') return minutes.toString().padStart(2, '0')
	if (amount == 'ss') return seconds.toString().padStart(2, '0')

	const hoursString = `${hours<0 ? '-':''}${Math.abs(hours).toString().padStart(2, '0')}`
	const minutesString = `${Math.abs(minutes).toString().padStart(2, '0')}`
	const secondsString = `${Math.abs(seconds).toString().padStart(2, '0')}`

	return `${hoursString}:${minutesString}:${secondsString}`
}

function startStopTimer(self, timerObj) {
	self.log('debug', `ATTEMPTING ${timerObj.id} ${JSON.stringify(timerObj)}`)

	function updateTimerDisplay(timeCue, timerKey) {
		const currentTime = new Date().getTime()
		let timeLeft

		if (timeCue.type === 'time_countup' || timeCue.type === 'big_time_countup') {
			timeLeft = currentTime - timeCue.startedAt
		} else if (timeCue.type === 'time_countdown' || timeCue.type === 'big_time_countdown' || timeCue.type === 'utility_speaker_timer') {
			if(timeCue.state === 'reset'){
				timeLeft = Number.parseInt(timeCue.duration, 10)
			}else{
				timeLeft = timeCue.endAt - currentTime
			}
		} else if (timeCue.type === 'time_to_tod' || timeCue.type === 'big_time_to_tod') {
			let t = new Date(timeCue?.endTime)?.getTime() || 0
			timeLeft = t - currentTime
		}

		if (['paused', 'reset'].includes(timeCue.state)) {
			clearInterval(intervalIdObj[timerKey])
			delete intervalIdObj[timerKey]
			return self.setVariableValues({
				[`graphic_${timerKey}_contents`]: `⏸ ${toTimeString(timeLeft)}`,
				[`graphic_${timerKey}_hh`]: `${toTimeString(timeLeft, 'hh')}`,
				[`graphic_${timerKey}_mm`]: `${toTimeString(timeLeft, 'mm')}`,
				[`graphic_${timerKey}_ss`]: `${toTimeString(timeLeft, 'ss')}`,
			})
		}

		self.log('debug', `INTERVAL ${timeCue.id} ${JSON.stringify(timeCue)}`)
		return self.setVariableValues({
			[`graphic_${timerKey}_contents`]: `${toTimeString(timeLeft)}`,
			[`graphic_${timerKey}_hh`]: `${toTimeString(timeLeft, 'hh')}`,
			[`graphic_${timerKey}_mm`]: `${toTimeString(timeLeft, 'mm')}`,
			[`graphic_${timerKey}_ss`]: `${toTimeString(timeLeft, 'ss')}`,
		})
	}

	const timerKey = timerObj.id

	if (['paused', 'reset'].includes(timerObj.state)) return updateTimerDisplay(timerObj, timerKey)

	clearInterval(intervalIdObj[timerKey])
	intervalIdObj[timerKey] = setInterval(() => {
		return updateTimerDisplay(timerObj, timerKey)
	}, 1000)

	return updateTimerDisplay(timerObj, timerKey)
}

export const init_http = (self) => {
	if (self.config.host) {
		let uri = `http://${self.config.host}:${self.config.portV2}`
		socket = io.connect(uri, {
			transports: ['websocket'],
			forceNew: true,
		})

		socket.on('connect', () => {
			self.updateStatus('ok')
		})

		socket.on('error', function (err) {
			self.updateStatus('Error')

			console.log('error', err)
		})

		socket.on('disconnect', function () {
			self.updateStatus('Disconnected')
		})

		socket.on('connected', function () {
			self.updateStatus('ok')
		})

		socket.on('updateFrontend', function (data) {
			if (data.projects[self.config.projectId] === undefined) {
				self.updateStatus(`Project "${self.config.projectId}" not found.`)
				return self.log('info', `H2R Graphics project (${self.config.projectId}) not found!`)
			}

			if (data.projects) {
				self.updateStatus(`ok`)
				self.PROJECTS = data.projects
				self.SELECTED_PROJECT_GRAPHICS = data.projects[self.config.projectId].cues || []
				self.SELECTED_PROJECT_MEDIA = data.projects[self.config.projectId].media || []
				self.SELECTED_PROJECT_THEMES = data.projects[self.config.projectId].themes || {}
				self.SELECTED_PROJECT_VARIABLES = data.projects[self.config.projectId].dynamicText || {}

				let dynamicText = data.projects[self.config.projectId].dynamicText || {}
				let variables = []
				let variableValues = {}

				data.projects[self.config.projectId].cues.map((c) => {
					const { id, label, contents } = graphicToReadableLabel(c)
					variables.push({
						variableId: `graphic_${id}_contents`,
						name: label,
					})
					variables.push({
						variableId: `graphic_${id}_label`,
						name: label,
					})
					variableValues[`graphic_${id}_label`] = c.label || id

					if (['lower_third', 'lower_third_animated'].includes(c.type)) {
						variables.push({
							variableId: `graphic_${id}_first_line`,
							name: label,
						})
						variableValues[`graphic_${id}_first_line`] = c.line_one
					}

					if (
						[
							'time_countdown',
							'time_countup',
							'time_to_tod',
							'big_time_countdown',
							'big_time_countup',
							'big_time_to_tod',
							'utility_speaker_timer',
						].includes(c.type)
					) {
						variables.push(
							{
								variableId: `graphic_${id}_hh`,
								name: `Hours (${id})`,
							},
							{
								variableId: `graphic_${id}_mm`,
								name: `Minutes (${id})`,
							},
							{
								variableId: `graphic_${id}_ss`,
								name: `Seconds (${id})`,
							}
						)
						return startStopTimer(self, c)
					}
					variableValues[`graphic_${id}_contents`] = replaceWithDataSource(contents, self.SELECTED_PROJECT_VARIABLES)
				})
				Object.entries(dynamicText).map(([id, val]) => {
					variables.push({
						variableId: id,
						name: id,
					})
					variableValues[id] = val
				})
				self.setVariableDefinitions(variables)
				self.setVariableValues(variableValues)
			}

			self.updateActions()
			self.updatePresets()
			self.updateFeedbacks()
			self.checkFeedbacks('graphic_status')
		})
	}
}
