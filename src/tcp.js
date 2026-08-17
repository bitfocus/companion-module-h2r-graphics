import io from 'socket.io-client'

import { graphicToReadableLabel, replaceWithDataSource } from './utils.js'
import { startStopTimer, startStopVideoAudioTimer } from './timer.js'

let socket = null

export const init_http = (self) => {
	if (!self.config.host) {
		return
	}
	const uri = `http://${self.config.host}:${self.config.portV2}`
	socket = io.connect(uri, {
		transports: ['websocket'],
		forceNew: true,
	})

	socket.on('connect', () => {
		self.updateStatus('ok')
	})

	socket.on('error', (err) => {
		self.updateStatus('Error')

		console.log('error', err)
	})

	socket.on('disconnect', () => {
		self.updateStatus('Disconnected')
	})

	socket.on('connected', () => {
		self.updateStatus('ok')
	})

	socket.on('updateFrontend', (data) => {
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
			self.SELECTED_PROJECT_DYNAMIC_LISTS = data.projects[self.config.projectId].dynamicLists || []
			self.SELECTED_PROJECT_GOOGLE_SHEETS = data.projects[self.config.projectId].sheets || {}

			const dynamicText = data.projects[self.config.projectId].dynamicText || {}
			const variables = []
			const variableValues = {}

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

				// Status lets a button react to a graphic going on and off air, which matters
				// for graphics with an onAirDuration that hide themselves after a few seconds.
				variables.push({
					variableId: `graphic_${id}_status`,
					name: `${label}: Status`,
				})
				variableValues[`graphic_${id}_status`] = c.status || 'offair'

				// A plain on air/off air flag, easier to test on a button than the raw status.
				// "coming" and "going" are transitions, so count as on air.
				variables.push({
					variableId: `graphic_${id}_on_air`,
					name: `${label}: On air`,
				})
				variableValues[`graphic_${id}_on_air`] = ['coming', 'onair', 'going'].includes(c.status)

				// Which outputs this graphic appears on. Output one is on unless explicitly
				// disabled; the rest are off unless explicitly enabled.
				variables.push({
					variableId: `graphic_${id}_outputs`,
					name: `${label}: Outputs`,
				})
				variableValues[`graphic_${id}_outputs`] = [
					['outputOne', '1'],
					['outputTwo', '2'],
					['outputThree', '3'],
					['outputFour', '4'],
					['outputUtility', 'U'],
				]
					.filter(([key]) => (c[key] === undefined ? key === 'outputOne' : c[key] === true))
					.map(([, name]) => name)
					.join(', ')

				if (['lower_third', 'lower_third_animated'].includes(c.type)) {
					// Lower thirds have a third line, animated ones only have two.
					const lines = [
						['first_line', c.line_one],
						['second_line', c.line_two],
						...(c.type === 'lower_third' ? [['third_line', c.line_three]] : []),
					]

					lines.forEach(([name, value]) => {
						variables.push({
							variableId: `graphic_${id}_${name}`,
							name: `${label}: ${name.replace('_', ' ')}`,
						})
						variableValues[`graphic_${id}_${name}`] = replaceWithDataSource(
							value || '',
							self.SELECTED_PROJECT_VARIABLES,
							self.SELECTED_PROJECT_DYNAMIC_LISTS,
						)
					})
				}

				if (c.type === 'build') {
					// Each text item's value is stored flat on the cue, keyed by item id,
					// falling back to the item's default when it hasn't been set.
					Object.entries(c.items || {})
						.filter(([, item]) => item?.type === 'STRING')
						.forEach(([itemId, item]) => {
							const variableId = `graphic_${id}_${itemId}`
							variables.push({
								variableId,
								name: `${label}: ${item._id || itemId}`,
							})
							variableValues[variableId] = replaceWithDataSource(
								c[itemId] || item.default || '',
								self.SELECTED_PROJECT_VARIABLES,
								self.SELECTED_PROJECT_DYNAMIC_LISTS,
							)
						})
				}

				if (['video', 'audio'].includes(c.type)) {
					variables.push({
						variableId: `graphic_${id}_playing`,
						name: `${label}: Playing status`,
					})
					variableValues[`graphic_${id}_playing`] = c.playing
					variables.push({
						variableId: `graphic_${id}_remaining`,
						name: `${label}: Time remaining (HH:MM:SS)`,
					})
					variables.push({
						variableId: `graphic_${id}_hh`,
						name: `${label}: Time remaining (HH)`,
					})
					variables.push({
						variableId: `graphic_${id}_mm`,
						name: `${label}: Time remaining (MM)`,
					})
					variables.push({
						variableId: `graphic_${id}_ss`,
						name: `${label}: Time remaining (SS)`,
					})

					startStopVideoAudioTimer(self, c)
				}

				if (['score'].includes(c.type)) {
					c.scores.forEach((score, sI) => {
						const scoreGrouped = []
						score.forEach((level, lI) => {
							if (lI + 1 > c.levels) return
							const variableId = `graphic_${id}_team_${sI + 1}_level_${lI + 1}_score`
							variables.push({
								variableId,
								name: `Score - Team ${sI + 1}, Level ${lI + 1}`,
							})
							scoreGrouped.push(level.score)
							variableValues[variableId] = level.score
						})
						const variableIdGrouped = `graphic_${id}_team_${sI + 1}_score`
						variables.push({
							variableId: variableIdGrouped,
							name: `Score - Team ${sI + 1}`,
						})
						variableValues[variableIdGrouped] = scoreGrouped.join(c.delimiter || '-')
					})
				}

				if (['social'].includes(c.type)) {
					variables.push({
						variableId: `graphic_${id}_author_display_name`,
						name: `Social - Author (${id})`,
					})
					variableValues[`graphic_${id}_author_display_name`] = c.chat.authorDetails.displayName

					variables.push({
						variableId: `graphic_${id}_author_profile_image_url`,
						name: `Social - Author Profile Image URL (${id})`,
					})
					variableValues[`graphic_${id}_author_profile_image_url`] = c.chat.authorDetails.profileImageUrl

					variables.push({
						variableId: `graphic_${id}_source`,
						name: `Social - Source (${id})`,
					})
					variableValues[`graphic_${id}_source`] = c.chat.source

					variables.push({
						variableId: `graphic_${id}_chat_type`,
						name: `Social - Chat Type (${id})`,
					})

					variableValues[`graphic_${id}_chat_type`] = c.chat.snippet.type

					variables.push({
						variableId: `graphic_${id}_chat_id`,
						name: `Social - Chat ID (${id})`,
					})

					variableValues[`graphic_${id}_chat_id`] = c.chat.id

					variables.push({
						variableId: `graphic_${id}_use_custom_image`,
						name: `Social - Use Custom Image (${id})`,
					})

					variableValues[`graphic_${id}_use_custom_image`] = c.useCustomImage || false

					variables.push({
						variableId: `graphic_${id}_custom_image`,
						name: `Social - Custom Image (${id})`,
					})

					variableValues[`graphic_${id}_custom_image`] = c.customImage || ''

					variables.push({
						variableId: `graphic_${id}_celebration`,
						name: `Social - Celebration (${id})`,
					})

					variableValues[`graphic_${id}_celebration`] = c.sponsoredCelebration || ''
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
						},
					)
					return startStopTimer(self, c)
				}
				variableValues[`graphic_${id}_contents`] = replaceWithDataSource(
					contents,
					self.SELECTED_PROJECT_VARIABLES,
					self.SELECTED_PROJECT_DYNAMIC_LISTS,
				)
			})
			Object.entries(dynamicText).map(([id, val]) => {
				variables.push({
					variableId: id,
					name: id,
				})
				variableValues[id] = val
			})

			const dynamicLists = data.projects[self.config.projectId].dynamicLists || []

			for (let [index, dynamicList] of dynamicLists.entries()) {
				// The app keeps the selected row number on row 0, cell 0.
				const selectedValue = dynamicList?.[0]?.[0]?.selected

				variables.push({
					variableId: `list${index + 1}_selected_row_number`,
					name: `Dynamic List ${index + 1} Selected Row Number`,
				})
				variableValues[`list${index + 1}_selected_row_number`] = selectedValue ?? ''
			}

			self.setVariableDefinitions(variables)
			self.setVariableValues(variableValues)
		}

		self.updateActions()
		self.updatePresets()
		self.updateFeedbacks()
		self.checkFeedbacks('graphic_status')
	})
}
