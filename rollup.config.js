import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	input: './es5-esm/index.js',
	output: {
		file: './es5/index.js',
		format: 'umd',
		name: 'jsx2posthtml',
	},
	plugins: [
			nodeResolve(
				{
					jsnext: true,
					main: true,
					browser: true,
				}
			),
	],
};
