exports.setConfigFields = function () {
	configValues = this
	return [
		{
			type: 'text',
			id: 'versionInfo',
			width: 12,
			label: 'Heads up',
			value: 'You may need to replace existing actions when switching between versions!',
		},
		{
			type: 'checkbox',
			id: 'useV2',
			label: 'Version 2 or greater',
			width: 1,
			default: true,
		},
		{
			type: 'text',
			id: 'useV2Label',
			width: 11,
			label: 'Running H2R Graphics v2? (Default: Enabled)',
			value: 'Disabling this will allow you to use H2R Graphics v1.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			default: '127.0.0.1',
			regex: this.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 3,
			default: '8181',
			regex: this.REGEX_PORT,
			isVisible: (configValues) => configValues.useV2 === false,
		},
		{
			type: 'textinput',
			id: 'portV2',
			label: 'Target Port',
			width: 3,
			default: '4001',
			regex: this.REGEX_PORT,
			isVisible: (configValues) => configValues.useV2 === true,
		},
		{
			type: 'textinput',
			id: 'projectId',
			label: 'Project ID',
			width: 3,
			default: 'ABCD',
			isVisible: (configValues) => configValues.useV2 === true,
		}
	]
}
