const { graphicToReadableLabel } = require('./utils')

module.exports = {
	setVariables: function() {
		let self = this;

		let variables = []

		// Add variable for instance Status and other status info
		variables.push({
			label: `Connected to H2R Graphics`,
			name: `connected_state`,
		})

		if (self.config.useV2) {
			let SELECTED_PROJECT_GRAPHICS = self.SELECTED_PROJECT_GRAPHICS || []

			SELECTED_PROJECT_GRAPHICS.forEach((g) => {
				if (g.type === 'section') return null
	
				variables.push({
					label: graphicToReadableLabel(g).label,
					name: `graphic_${g.id}_contents`,
				})
			})
		}

		return variables;
	}
}
