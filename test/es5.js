'use strict';

// tslint:disable:no-var-keyword
// tslint:disable:prefer-const
// tslint:disable:only-arrow-functions
// tslint:disable:prefer-template
// tslint:disable:object-literal-shorthand

var expect = require( 'chai' ).expect;
var h = require( '../es5/index' );

describe(
	'ES5 version',
	function ()
	{
		var render = require( 'posthtml-render' );
		
		it(
			'should render to HTML',
			function ()
			{
				var items = ['one', 'two', 'three'];
				
				expect(
					render(
						h(
							'div',
							{class: 'foo'},
							h( 'h1', null, 'Hi!' ),
							h(
								'ul',
								null,
								items.map(
									function ( item )
									{
										return h( 'li', null, item );
									}
								)
							)
						)
					)
				).to.equal(
					'<div class="foo"><h1>Hi!</h1><ul><li>one</li><li>two</li><li>three</li></ul></div>'
				);
			}
		);
		
		it(
			'should sanitize children',
			function ()
			{
				expect(
					render(
						h(
							'div',
							null,
							'<strong>blocked</strong>',
							h( 'em', null, 'allowed' )
						)
					)
				).to.equal(
					'<div>&lt;strong&gt;blocked&lt;/strong&gt;<em>allowed</em></div>'
				);
			}
		);
		
		it(
			'should support sortof components',
			function ()
			{
				var items = ['one', 'two'];
				
				function Item( props )
				{
					return h(
						'li',
						{id: 'item-' + props.index},
						h( 'h2', null, props.item ),
						props.children
					);
				}
				
				expect(
					render(
						h(
							'div',
							{class: 'foo'},
							h( 'h1', null, 'Hi!' ),
							h(
								'ul',
								null,
								items.map(
									function ( item, index )
									{
										return h(
											Item,
											{
												item: item,
												index: index,
											},
											'This is item ' + item + '!'
										);
									}
								)
							)
						)
					)
				).to.equal(
					'<div class="foo"><h1>Hi!</h1><ul><li id="item-0">'
					+ '<h2>one</h2>This is item one!</li><li id="item-1">'
					+ '<h2>two</h2>This is item two!</li></ul></div>'
				);
			}
		);
		
	}
);
