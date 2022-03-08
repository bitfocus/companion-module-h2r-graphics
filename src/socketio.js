const io = require('socket.io-client')

const { graphicToReadableLabel } = require('./utils')

exports.init_socketio = function () {
	var self = this

	if (self.config.host) {
		let uri = `http://${self.config.host}:${self.config.portV2}`
		self.socket = io.connect(uri, {
			transports: ['websocket'],
			forceNew: true,
		})

		self.socket.on('connect', () => {
			self.status(self.STATE_OK)
			self.setVariable(`connected_state`, 'Connected')

			console.log(socket.id) // undefined
		})

		self.socket.on('error', function (err) {
			self.status(self.STATUS_ERROR, err)
			self.socket.destroy()
			self.setVariable(`connected_state`, 'Error')

			// socket.emit('companion')
			console.log('error', err)
		})

		self.socket.on('disconnected', function () {
			self.status(self.STATUS_ERROR)
			self.socket.destroy()
			self.setVariable(`connected_state`, 'Disconnected')
		})

		self.socket.on('connected', function (data) {
			console.log('connected')
		})

		self.socket.on('updateFrontend', function (data) {
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

			self.init_actions();
			self.init_feedbacks();
			self.init_variables();
			self.init_presets();

			self.checkFeedbacks('graphic_status');
		})
	}
}
