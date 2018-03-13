import {expect} from 'chai';
import 'mocha';
import h from '../src/index';

describe(
	'Function h',
	() =>
	{
		it(
			'should convert to PostHTML AST',
			() =>
			{
				const items = ['one', 'two', 'three'];
				
				expect(
					<div class="foo">
						<h1>Hi!</h1>
						<p>Here is a list of {items.length} items:</p>
						<ul>
							{
								items.map(
									( item ) => (
										<li>{item}</li>
									),
								)
							}
						</ul>
					</div>,
				).to.deep.equal(
					{
						tag: 'div',
						attrs: {
							class: 'foo',
						},
						content: [
							{
								tag: 'h1',
								content: ['Hi!'],
							},
							{
								tag: 'p',
								content: [
									'Here is a list of ',
									3,
									' items:',
								],
							},
							{
								tag: 'ul',
								content: [
									{
										tag: 'li',
										content: ['one'],
									},
									{
										tag: 'li',
										content: ['two'],
									},
									{
										tag: 'li',
										content: ['three'],
									},
								],
							},
						],
					},
				);
			},
		);
		
		it(
			'should sanitize children',
			() =>
			{
				expect(
					<div>
						{'<strong>blocked</strong>'}
						<em>allowed</em>
					</div>,
				).to.deep.equal(
					{
						tag: 'div',
						content: [
							'&lt;strong&gt;blocked&lt;/strong&gt;',
							{
								tag: 'em',
								content: ['allowed'],
							},
						],
					},
				);
			},
		);
		
		it(
			'should allow dangerouslySetInnerHTML',
			() =>
			{
				expect(
					<div dangerouslySetInnerHTML={{__html: '<strong>allowed</strong>'}} />,
				).to.deep.equal(
					{
						tag: 'div',
						content: [
							'<strong>allowed</strong>',
						],
					},
				);
			},
		);
		
		it(
			'should allow dangerously set HTML as child object',
			() =>
			{
				expect(
					<div>
						{'<strong>blocked</strong>'}
						{{__html: '<strong>allowed</strong>'}}
						<em>allowed</em>
					</div>,
				).to.deep.equal(
					{
						tag: 'div',
						content: [
							'&lt;strong&gt;blocked&lt;/strong&gt;',
							'<strong>allowed</strong>',
							{
								tag: 'em',
								content: ['allowed'],
							},
						],
					},
				);
			},
		);
		
		it(
			'should leave unknown objects as is',
			() =>
			{
				expect(
					<div>
						<em>element</em>
						{{should: 'be object'}}
						{1}
						{'string'}
					</div>,
				).to.deep.equal(
					{
						tag: 'div',
						content: [
							{
								tag: 'em',
								content: ['element'],
							},
							{
								should: 'be object',
							},
							1,
							'string',
						],
					},
				);
			},
		);
		
		it(
			'should sanitize attributes',
			() =>
			{
				expect(
					<div data-some={`&<>"'`} />,
				).to.deep.equal(
					{
						tag: 'div',
						attrs: {
							'data-some': '&amp;&lt;&gt;&quot;&apos;',
						},
					},
				);
			},
		);
		
		it(
			'should flatten children',
			() =>
			{
				expect(
					<div>
						{[['a', 'c']]}
						<b>d</b>
						{['e', ['f'], [['g']]]}
					</div>,
				).to.deep.equal(
					{
						tag: 'div',
						content: [
							'a',
							'c',
							{
								tag: 'b',
								content: ['d'],
							},
							'e',
							'f',
							'g',
						],
					},
				);
			},
		);
		
		it(
			'should support sortof components',
			() =>
			{
				const items = ['one', 'two'];
				
				interface ItemProps
				{
					item: string;
					index: number;
					children?: JSX.Element;
				}
				
				// tslint:disable-next-line:variable-name
				const Item = ( {item, index, children}: ItemProps ) => (
					<li id={'item-' + index}>
						<h2>{item}</h2>
						{children}
					</li>
				);
				
				expect(
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
				).to.deep.equal(
					{
						tag: 'div',
						attrs: {
							class: 'foo',
						},
						content: [
							{
								tag: 'h1',
								content: ['Hi!'],
							},
							{
								tag: 'ul',
								content: [
									{
										tag: 'li',
										attrs: {
											id: 'item-0',
										},
										content: [
											{
												tag: 'h2',
												content: ['one'],
											},
											'This is item ',
											'one',
											'!',
										],
									},
									{
										tag: 'li',
										attrs: {
											id: 'item-1',
										},
										content: [
											{
												tag: 'h2',
												content: ['two'],
											},
											'This is item ',
											'two',
											'!',
										],
									},
								],
							},
						],
					},
				);
			},
		);
		
		it(
			'should support sortof components without args',
			() =>
			{
				const items = ['one', 'two'];
				
				// tslint:disable-next-line:variable-name
				const Item = () => (
					<li>
						<h2></h2>
					</li>
				);
				
				expect(
					<div class="foo">
						<h1>Hi!</h1>
						<ul>
							{
								items.map(
									( item ) => (
										<Item>
											This is item {item}!
										</Item>
									),
								)
							}
						</ul>
					</div>,
				).to.deep.equal(
					{
						tag: 'div',
						attrs: {
							class: 'foo',
						},
						content: [
							{
								tag: 'h1',
								content: ['Hi!'],
							},
							{
								tag: 'ul',
								content: [
									{
										tag: 'li',
										content: [
											{
												tag: 'h2',
											},
										],
									},
									{
										tag: 'li',
										content: [
											{
												tag: 'h2',
											},
										],
									},
								],
							},
						],
					},
				);
			},
		);
		
		it(
			'should support sortof components without args but with children',
			() =>
			{
				const items = ['one', 'two'];
				
				interface ItemProps
				{
					children?: JSX.Element;
				}
				
				// tslint:disable-next-line:variable-name
				const Item = ( {children}: ItemProps ) => (
					<li>
						<h2></h2>
						{children}
					</li>
				);
				
				expect(
					<div class="foo">
						<h1>Hi!</h1>
						<ul>
							{
								items.map(
									( item ) => (
										<Item>
											This is item {item}!
										</Item>
									),
								)
							}
						</ul>
					</div>,
				).to.deep.equal(
					{
						tag: 'div',
						attrs: {
							class: 'foo',
						},
						content: [
							{
								tag: 'h1',
								content: ['Hi!'],
							},
							{
								tag: 'ul',
								content: [
									{
										tag: 'li',
										content: [
											{
												tag: 'h2',
											},
											'This is item ',
											'one',
											'!',
										],
									},
									{
										tag: 'li',
										content: [
											{
												tag: 'h2',
											},
											'This is item ',
											'two',
											'!',
										],
									},
								],
							},
						],
					},
				);
			},
		);
		
		it(
			'should support empty (void) tags',
			() =>
			{
				expect(
					<div>
						<area />
						<base />
						<br />
						<col />
						<embed />
						<hr />
						<img />
						<input />
						<keygen />
						<link />
						<meta />
						<param />
						<source />
						<track />
						<wbr />
						{/* Not void elements */}
						<div />
						<span />
						<p />
					</div>,
				).to.deep.equal(
					{
						tag: 'div',
						content: [
							{
								tag: 'area',
							},
							{
								tag: 'base',
							},
							{
								tag: 'br',
							},
							{
								tag: 'col',
							},
							{
								tag: 'embed',
							},
							{
								tag: 'hr',
							},
							{
								tag: 'img',
							},
							{
								tag: 'input',
							},
							{
								tag: 'keygen',
							},
							{
								tag: 'link',
							},
							{
								tag: 'meta',
							},
							{
								tag: 'param',
							},
							{
								tag: 'source',
							},
							{
								tag: 'track',
							},
							{
								tag: 'wbr',
							},
							{
								tag: 'div',
							},
							{
								tag: 'span',
							},
							{
								tag: 'p',
							},
						],
					},
				);
			},
		);
		
		it(
			'should handle special prop names',
			() =>
			{
				expect(
					<div
						className="my-class"
						htmlFor="id"
					/>,
				).to.deep.equal(
					{
						tag: 'div',
						attrs: {
							class: 'my-class',
							for: 'id',
						},
					},
				);
			},
		);
		
	},
);

describe(
	'With posthtml-parser',
	() =>
	{
		const parser = require( 'posthtml-parser' );
		
		it(
			'should produce similar AST',
			() =>
			{
				const items = ['one', 'two', 'three'];
				
				expect(
					<div class="foo">
						<h1>Hi!</h1>
						<ul>
							{
								items.map(
									( item ) => (
										<li>{item}</li>
									),
								)
							}
						</ul>
					</div>,
				).to.deep.equal(
					parser(
						'<div class="foo"><h1>Hi!</h1><ul><li>one</li><li>two</li><li>three</li></ul></div>',
					)[0],
				);
			},
		);
		
		it(
			'should sanitize children with the same result',
			() =>
			{
				expect(
					<div>
						{'<strong>blocked</strong>'}
						<em>allowed</em>
					</div>,
				).to.deep.equal(
					parser(
						'<div>&lt;strong&gt;blocked&lt;/strong&gt;<em>allowed</em></div>',
					)[0],
				);
			},
		);
		
		it(
			'should equally parse empty (void) tags',
			() =>
			{
				expect(
					<div>
						<area />
						<base />
						<br />
						<col />
						<embed />
						<hr />
						<img />
						<input />
						<keygen />
						<link />
						<meta />
						<param />
						<source />
						<track />
						<wbr />
					</div>,
				).to.deep.equal(
					parser(
						'<div><area /><base /><br /><col /><embed /><hr />'
						+ '<img /><input /><keygen /><link /><meta /><param />'
						+ '<source /><track /><wbr /></div>',
					)[0],
				);
			},
		);
		
	},
);

describe(
	'With posthtml-render',
	() =>
	{
		const render = require( 'posthtml-render' );
		
		it(
			'should render to HTML',
			() =>
			{
				const items = ['one', 'two', 'three'];
				
				expect(
					render(
						<div class="foo">
							<h1>Hi!</h1>
							<ul>
								{
									items.map(
										( item ) => (
											<li>{item}</li>
										),
									)
								}
							</ul>
						</div>,
					),
				).to.equal(
					'<div class="foo"><h1>Hi!</h1><ul><li>one</li><li>two</li><li>three</li></ul></div>',
				);
			},
		);
		
		it(
			'should sanitize children',
			() =>
			{
				expect(
					render(
						<div>
							{'<strong>blocked</strong>'}
							<em>allowed</em>
						</div>,
					),
				).to.equal(
					'<div>&lt;strong&gt;blocked&lt;/strong&gt;<em>allowed</em></div>',
				);
			},
		);
		
		it(
			'should allow dangerouslySetInnerHTML',
			() =>
			{
				expect(
					render(
						<div dangerouslySetInnerHTML={{__html: '<strong>allowed</strong>'}} />,
					),
				).to.equal(
					'<div><strong>allowed</strong></div>',
				);
			},
		);
		
		it(
			'should allow dangerously set HTML as child object',
			() =>
			{
				expect(
					render(
						<div>
							{'<strong>blocked</strong>'}
							{{__html: '<strong>allowed</strong>'}}
							<em>allowed</em>
						</div>,
					),
				).to.equal(
					'<div>&lt;strong&gt;blocked&lt;/strong&gt;<strong>allowed</strong><em>allowed</em></div>',
				);
			},
		);
		
		it(
			'should sanitize attributes',
			() =>
			{
				expect(
					render(
						<div data-some={`&<>"'`} />,
					),
				).to.equal(
					'<div data-some="&amp;&lt;&gt;&quot;&apos;"></div>',
				);
			},
		);
		
		it(
			'should flatten children',
			() =>
			{
				expect(
					render(
						<div>
							{[['a', 'c']]}
							<b>d</b>
							{['e', ['f'], [['g']]]}
						</div>,
					),
				).to.equal(
					'<div>ac<b>d</b>efg</div>',
				);
			},
		);
		
		it(
			'should support sortof components',
			() =>
			{
				const items = ['one', 'two'];
				
				interface ItemProps
				{
					item: string;
					index: number;
					children?: JSX.Element;
				}
				
				// tslint:disable-next-line:variable-name
				const Item = ( {item, index, children}: ItemProps ) => (
					<li id={'item-' + index}>
						<h2>{item}</h2>
						{children}
					</li>
				);
				
				expect(
					render(
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
					),
				).to.equal(
					'<div class="foo"><h1>Hi!</h1><ul><li id="item-0">'
					+ '<h2>one</h2>This is item one!</li><li id="item-1">'
					+ '<h2>two</h2>This is item two!</li></ul></div>',
				);
			},
		);
		
		it(
			'should support empty (void) tags',
			() =>
			{
				expect(
					render(
						<div>
							<area />
							<base />
							<br />
							<col />
							<embed />
							<hr />
							<img />
							<input />
							<keygen />
							<link />
							<meta />
							<param />
							<source />
							<track />
							<wbr />
							{/* Not void elements */}
							<div />
							<span />
							<p />
						</div>,
					),
				).to.equal(
					'<div><area><base><br><col><embed><hr><img><input><keygen>'
					+ '<link><meta><param><source><track><wbr><div></div>'
					+ '<span></span><p></p></div>',
				);
			},
		);
		
		it(
			'should handle special prop names',
			() =>
			{
				expect(
					render(
						<div
							className="my-class"
							htmlFor="id"
						/>,
					),
				).to.equal(
					'<div class="my-class" for="id"></div>',
				);
			},
		);
		
	},
);
