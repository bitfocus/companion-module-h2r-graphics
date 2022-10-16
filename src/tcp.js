var io = require('socket.io-client')

const { graphicToReadableLabel } = require('./utils')
const { initPresets } = require('./presets')

let socket = null

exports.init = function () {
	var self = this

	if (self.config.host) {
		let uri = `http://${self.config.host}:${self.config.portV2}`
		socket = io.connect(uri, {
			transports: ['websocket'],
			forceNew: true,
		})

		socket.on('connect', () => {
			self.status(self.STATE_OK)
			self.setVariable(`connected_state`, 'True')

			console.log(socket.id) // undefined
		})

		socket.on('error', function (err) {
			self.status(self.STATUS_ERROR, err)
			self.setVariable(`connected_state`, 'False')

			// socket.emit('companion')
			console.log('error', err)
		})

		socket.on('disconnect', function () {
			self.status(self.STATUS_ERROR)
			self.setVariable(`connected_state`, 'False')
		})

		socket.on('connected', function (data) {
			console.log('connected')
		})

		socket.on('updateFrontend', function (data) {
			//add last message received variable here

			if (data.projects[self.config.projectId] === undefined) {
				return self.log('info', `H2R Graphics project (${self.config.projectId}) not found!`)
			}

			if (data.projects) {
				self.PROJECTS = data.projects
				self.SELECTED_PROJECT_GRAPHICS = data.projects[self.config.projectId].cues || []
				self.SELECTED_PROJECT_MEDIA = data.projects[self.config.projectId].media || []
				self.SELECTED_PROJECT_THEMES = data.projects[self.config.projectId].themes || {}

				data.projects[self.config.projectId].cues.map((c) => {
					const { id, contents } = graphicToReadableLabel(c)

					self.setVariable(`graphic_${id}_contents`, contents)
				})
			}

			self.actions()
			self.feedback()
			self.updateVariableDefinitions()
			self.checkFeedbacks('graphic_status')
			initPresets.bind(self)()
		})
	}
}
