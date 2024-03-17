#!/usr/bin/env node

import { getText, print } from "./crawler-utils";
import { syntaxFiles, syntaxURLs } from "./config";
import { writeFileSync } from "fs";

main();
async function main() {
	await Promise.all([
		download('original'),
		download('sublime')
	]).then(() => {
		print.info('downloaded syntaxes')
	}).catch(error => {
		print._error(error.message);
	})
}

async function download(syntaxName: keyof typeof syntaxURLs) {
	const url = syntaxURLs[syntaxName];
	const targetFiles = [syntaxFiles[syntaxName]];
	let text = await getText(`${syntaxName} syntax`, url);
	text = text.replace('?>', `?>\n<!-- vscode-nginx-conf-hint { syntax-type: ${syntaxName} }  -->`)
	for (const element of targetFiles)
		writeFileSync(element, text);
}
