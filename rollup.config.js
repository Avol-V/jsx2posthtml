import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: './es5-esm/index.js',
	dest: './es5/index.js',
	format: 'umd',
	moduleName: 'jsx2posthtml',
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
