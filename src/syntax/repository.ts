import { names } from "./match-names";
import type { SyntaxPattern } from "./types";

/**
 * @see https://macromates.com/manual/en/language_grammars
 *
 * a dictionary (i.e. key/value pairs) of rules which can be included from other places in the grammar. The key is the name of the rule and the value is the actual rule. Further explanation (and example) follow with the description of the include rule key.
 */
export const syntaxRepository: {
	[x: string]: {
		patterns: SyntaxPattern[];
	}
} = {
	if_condition: {
		patterns: [
			{
				include: '#variables'
			},
			{
				match: /\!?\~\*?\s/,
				name: names.operator,
			},
			{
				match: /\!?\-[fdex]\s/,
				name: names.operator,
			},
			{
				match: /\!?=[^=]/,
				name: names.operator,
			},
			{
				include: '#regexp_and_string',
			}
		]
	},

	server_parameters: {
		patterns: [
			{
				match: /(?:^|\s)(weight|max_conn|max_fails|fail_timeout|slow_start)(=)([0-9][0-9\.]*[bBkKmMgGtTsShHdD]?)(?:\s|;|$)/,
				captures: {
					'1': names.variable.parameter,
					'2': names.operator,
					'3': names.numeric,
				}
			},
			{
				include: '#values'
			}
		]
	},

	variables: {
		patterns: [
			{
				match: /(\$)([A-Za-z0-9\_]+)\b/,
				captures: {
					'1': names.$,
					'2': names.variable.other,
				},
			},
			{
				match: /(\$\{)([A-Za-z0-9\_]+)(\})/,
				captures: {
					'1': names.$,
					'2': names.variable.other,
					'3': names.$,
				},
			}
		]
	},

	regexp_and_string: {
		patterns: [
			{
				match: /\^.*?\$/,
				name: names.string.regexp,
			},
			{
				begin: '"', end: '"',
				name: names.string.doubleQuoted,
				patterns: [
					{ match: /\\"/, name: names.string.escaped },
					{ include: '#variables' },
				],
			},
			{
				begin: "'", end: "'",
				name: names.string.singleQuoted,
				patterns: [
					{ match: /\\'/, name: names.string.escaped },
					{ include: '#variables' },
				],
			}
		],
	},

	values: {
		patterns: [
			{
				include: '#variables'
			},
			{
				match: /\#.*/,
				name: names.comment,
			},
			// {
			// 	match: /[\t ]([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|[0-9a-f:]+)(\/[0-9]{2})?(?=[\t ;])/,
			// 	captures: {
			// 		'1': names.ipaddr,
			// 		'2': names.cidr,
			// 	}
			// },
			{
				match: /[\t ](=?[0-9][0-9\.]*[bBkKmMgGtTsShHdD]?)(?=[\t ;])/,
				captures: {
					'1': names.numeric,
				}
			}, {
				match: /[\t ](on|off|true|false)(?=[\t ;])/,
				name: names.languageConstant,
			}, {
				match: /[\t ](kqueue|rtsig|epoll|\/dev\/poll|select|poll|eventport|max|all|default_server|default|main|crit|error|debug|warn|notice|last)(?=[\t ;])/,
				name: names.languageConstant,
			}, {
				match: /\\.*\ |\~\*|\~|\!\~\*|\!\~/,
				name: names.string.regexp,
			}, {
				include: '#regexp_and_string'
			}
		]
	}

}
