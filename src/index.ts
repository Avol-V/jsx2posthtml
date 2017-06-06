// tslint:disable-next-line:no-reference
/// <reference path="./JSX.d.ts" />

/**
 * Create PostHTML AST nodes using HyperScript syntax.
 * 
 * @param tag Tag name or functional component.
 * @param attrs Attributes of the element.
 * @param content Child content of the element.
 */
function h(
	tag: string | FunctionalComponent,
	attrs: JSX.ElementAnyAttributes,
	...content: JSX.ElementContentItem[],
): JSX.Element
{
	// If content elements are given as an array
	content = flattenArray<JSX.ElementContentItem>( content );
	
	if ( typeof tag === 'function' )
	{
		return tag(
			{
				...attrs,
				children: content,
			},
		);
	}
	
	const node: JSX.Element = {tag};
	let usedInnerHtml: boolean = false;
	
	if ( attrs )
	{
		if (
			attrs.hasOwnProperty( 'dangerouslySetInnerHTML' )
			&& attrs.dangerouslySetInnerHTML
		)
		{
			node.content = [attrs.dangerouslySetInnerHTML.__html];
			usedInnerHtml = true;
		}
		
		const preparedAttrs = prepareAttrs( attrs );
		
		if ( preparedAttrs )
		{
			node.attrs = preparedAttrs;
		}
	}
	
	if (
		! usedInnerHtml
		&& ( content.length !== 0 )
	)
	{
		node.content = content.map( prepareContentItem );
	}
	
	return node;
}

/**
 * Map of characters should be escaped.
 */
const ESCAPE_MAP = {
	'&': 'amp',
	'<': 'lt',
	'>': 'gt',
	'"': 'quot',
	"'": 'apos',
};

/**
 * Characters should be escaped.
 */
type CharsToEscape = keyof typeof ESCAPE_MAP;

/**
 * Escape character.
 * 
 * @param char Character to escape.
 */
function escapeChar( char: CharsToEscape ): string
{
	return `&${ESCAPE_MAP[char]};`;
}

/**
 * RegExp to find characters to escape.
 */
const escapeRegexp = new RegExp(
	`[${Object.keys( ESCAPE_MAP ).join( '' )}]`,
	'g',
);

/**
 * Escape characters in string to use in HTML.
 * 
 * @param str Unescaped string.
 */
function escape( str: string ): string
{
	return str.replace( escapeRegexp, escapeChar );
}

/**
 * Map of attributes that should be renamed to use in DOM.
 */
const MAP_TO_DOM_ATTRIBUTES: {[key: string]: string} = {
	className: 'class',
	htmlFor: 'for',
};

/**
 * Prepare attrubutes to use in HTML.
 * 
 * @param attrs Element attributes.
 */
function prepareAttrs( attrs: JSX.ElementAnyAttributes ): JSX.ElementAnyAttributes | null
{
	const keys = Object.keys( attrs );
	const innerHtmlIndex = keys.indexOf( 'dangerouslySetInnerHTML' );
	
	if ( innerHtmlIndex !== -1 )
	{
		keys.splice( innerHtmlIndex, 1 );
	}
	
	if ( keys.length === 0 )
	{
		return null;
	}
	
	const nextAttrs: JSX.ElementAnyAttributes = {};
	
	for ( const attr of keys )
	{
		const attrName = (
			MAP_TO_DOM_ATTRIBUTES[attr]
			? MAP_TO_DOM_ATTRIBUTES[attr]
			: escape( attr )
		);
		
		const value = attrs[attr];
		
		if ( typeof value === 'string' )
		{
			nextAttrs[attrName] = escape( value );
		}
		else
		{
			nextAttrs[attrName] = attrs[attr];
		}
	}
	
	return nextAttrs;
}

/**
 * Prepare content item to use in HTML.
 * 
 * @param item Content item.
 */
function prepareContentItem( item: any ): any
{
	if ( typeof item === 'string' )
	{
		return escape( item );
	}
	
	if (
		item
		&& item.hasOwnProperty( '__html' )
	)
	{
		return item.__html;
	}
	
	return item;
}

/**
 * Deep array flatten.
 * 
 * @param array Array to be flattened.
 */
function flattenArray<T>( array: any[] ): T[]
{
	return array.reduce(
		( accumulator: any[], item: any ) => accumulator.concat(
			Array.isArray( item )
			? flattenArray( item )
			: item,
		),
		[],
	);
}

/**
 * Function that returns JSX element.
 */
export type FunctionalComponent = ( ...rest: any[] ) => JSX.Element;

/**
 * Module.
 */
export {
	h as default,
};
