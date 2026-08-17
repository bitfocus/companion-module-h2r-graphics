import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const config = await generateEslintConfig({})

export default [
	...config,
	{
		// This module is "type": "module", so the .js sources are ES modules.
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'module',
		},
	},
]
