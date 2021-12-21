const { graphicToReadableLabel } = require('./utils')

exports.updateVariableDefinitions = function () {
	const variables = []

	let SELECTED_PROJECT_GRAPHICS = this.SELECTED_PROJECT_GRAPHICS || []

	// Add variable for instance Status an other status info
	variables.push({
		label: `Connected to H2R Graphics`,
		name: `connected_state`,
	})

	SELECTED_PROJECT_GRAPHICS.forEach((g) => {
		if (g.type === 'section') return null

		return variables.push({
			label: graphicToReadableLabel(g).label,
			name: `graphic_${g.id}_contents`,
		})
	})

	if (this.config.useV2 === true) {
		this.setVariableDefinitions(variables)
	} else {
		this.setVariableDefinitions([])
	}
}
