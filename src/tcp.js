import io from 'socket.io-client'

import { graphicToReadableLabel, replaceWithDataSource } from './utils.js'
import { startStopTimer } from './timer.js'

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

				if (['lower_third', 'lower_third_animated'].includes(c.type)) {
					variables.push({
						variableId: `graphic_${id}_first_line`,
						name: label,
					})
					variableValues[`graphic_${id}_first_line`] = replaceWithDataSource(
						c.line_one,
						self.SELECTED_PROJECT_VARIABLES,
						self.SELECTED_PROJECT_DYNAMIC_LISTS
					)
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
						}
					)
					return startStopTimer(self, c)
				}
				variableValues[`graphic_${id}_contents`] = replaceWithDataSource(
					contents,
					self.SELECTED_PROJECT_VARIABLES,
					self.SELECTED_PROJECT_DYNAMIC_LISTS
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
				let selectedValue = null

				for (const element of dynamicList) {
					const found = element.find((item) => item.value === 'Selected')
					if (found) {
						selectedValue = found.selected
						break
					}
				}

				variables.push({
					variableId: `list${index + 1}_selected_row_number`,
					name: `Dynamic List ${index + 1} Selected Row Number`,
				})
				variableValues[`list${index + 1}_selected_row_number`] = selectedValue
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
