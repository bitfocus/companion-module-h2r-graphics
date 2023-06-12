import io from 'socket.io-client'

import { graphicToReadableLabel, replaceWithDataSource } from './utils.js'

let socket = null

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
