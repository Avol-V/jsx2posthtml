[![NPM][npm]][npm-url]
[![Deps][deps]][deps-url]
[![Tests][build]][build-url]

# jsx2posthtml

Render JSX/Hyperscript to [PostHTML](https://github.com/posthtml/posthtml/) AST.

Can be used to inject elements to PostHTML AST with ability to use any plugin
to modify parsed JSX, or to produce HTML string, using only `posthtml-render`.

Supports functional components and `dangerouslySetInnerHTML`.

Examples of working with JSX with some ideas and code parts were taken from
packages `preact` and `vhtml` by *developit*.

## Installation

For bundlers and other NPM-based environments:

```
npm install --save-dev jsx2posthtml
```

Types for TypeScript are included.

### ES2015 CommonJS

By default this package provides ES2015 version with CommonJS module system.

To use it, you can:

```js
import h from 'jsx2posthtml';
//or
const h = require( 'jsx2posthtml' ).default;
```

It uses **default export**, so don’t forget to add `.default`, if you want to
use `require`.

### ES5 UMD

You can manually use ES5 version with UMD package if you want to use package in
a browser, or your Node version is outdated.

```js
import * as h from 'jsx2posthtml/es5';
//or
const h = require( 'jsx2posthtml/es5' );
```

This version **did not use default export**, so you should write `* as h` in
ESM `import` and you should not add `.default` with `require`.

For using directly in browser (import with `<script>` tag in HTML-file):

* [Development version](https://unpkg.com/jsx2posthtml/es5/index.js)
* [Production version](https://unpkg.com/jsx2posthtml/es5/jsx2posthtml.min.js)

You can use AMD or `jsx2posthtml` global variable.

Instead of importing `jsx2posthtml/es5`, you can specify alias in bandlers like
Webpack:

```js
{
	// …
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			'jsx2posthtml': 'jsx2posthtml/es5',
		},
	},
};
```

Also, you can write a similar alias to use other versions, available in this
package (described below).

### ES5 code with ES2015 module systems

Package contain `module` property for use with ES2015 module bundlers
(like Rollup and Webpack 2).

Bundlers moustly used for browsers, so this version is transplitted to ES5 code.

You can also use it directly:

```js
import h from 'jsx2posthtml/es5-esm';
```

### ES2015 code with ES2015 module systems

If you don’t want to use transplitted to ES5 code in your bundle, you can use
import ES2015 version.

```js
import h from 'jsx2posthtml/es2015';
```

## Usage

To use with JSX you should specify:

* `/** @jsx h */` for Babel, or
  * In Babel 5 config: `{"jsxPragma": "h"}`
  * In Babel 6 config:
    ```json
    {
      "plugins": [
        ["transform-react-jsx", {"pragma": "h"}]
      ]
    }
    ```
* For TypeScript in `tsconfig.json`, section `compilerOptions`:
  ```json
  "jsx": "react",
  "jsxFactory": "h"
  ```

Then just use:

```jsx
const node = (
	<div class="test">
		Hello, world!
	</div>
);
/*
node == {
	tag: 'div',
	attrs: {
		class: 'test',
	},
	content: [
		'Hello, world!',
	],
}
*/
```

You can write components — a functions with props argument (component
attributes), that returns AST node (similar to React functional component).

```tsx
import h from 'jsx2posthtml';
import * as render from 'posthtml-render';

const items = ['one', 'two'];

interface ItemProps
{
	item: string;
	index: number;
	children?: JSX.Element;
}

const Item = ( {item, index, children}: ItemProps ) => (
	<li id={'item-' + index}>
		<h2>{item}</h2>
		{children}
	</li>
);

const html = render(
	<div class="foo">
		<h1>Hi!</h1>
		<ul>
			{
				items.map(
					( item, index ) => (
						<Item
							item={item}
							index={index}
						>
							This is item {item}!
						</Item>
					),
				)
			}
		</ul>
	</div>,
);

/*
html == '<div class="foo"><h1>Hi!</h1><ul><li id="item-0">'
	+ '<h2>one</h2>This is item one!</li><li id="item-1">'
	+ '<h2>two</h2>This is item two!</li></ul></div>';
*/
```

Attribute `dangerouslySetInnerHTML` is also supported:

```jsx
const html = render(
	<div dangerouslySetInnerHTML={{__html: '<strong>allowed</strong>'}} />,
);
/*
html == '<div><strong>allowed</strong></div>'
*/
```

Or with small improvement, incompatible with React — specifying this object as
child element:

```jsx
const html = render(
	<div>
		{'<strong>blocked</strong>'}
		{{__html: '<strong>allowed</strong>'}}
		<em>allowed</em>
	</div>,
);
/*
html == '<div>&lt;strong&gt;blocked&lt;/strong&gt;'
	+ '<strong>allowed</strong><em>allowed</em></div>';
*/
```

You can find more examples in [tests](test/index.tsx).

## Change Log

[View changelog](CHANGELOG.md).

## License

[MIT](LICENSE).

[npm]: https://img.shields.io/npm/v/jsx2posthtml.svg
[npm-url]: https://npmjs.com/package/jsx2posthtml

[deps]: https://david-dm.org/m18ru/jsx2posthtml.svg
[deps-url]: https://david-dm.org/m18ru/jsx2posthtml

[build]: https://travis-ci.org/m18ru/jsx2posthtml.svg?branch=master
[build-url]: https://travis-ci.org/m18ru/jsx2posthtml
