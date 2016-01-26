'use strict';

const fs = require('fs');

class CssComplexity {

	constructor(url) {
		this.url = url;
		this.selectors = {};

		this.readCss().then(this.parseSelectors.bind(this));
	}

	readCss() {
		return new Promise((resolve) => {
			// load file contents

			fs.readFile(this.url, 'utf-8', function(err, data) {
				if (err) {
					throw err;
				}

				resolve(data);
			});
		});
	}

	parseSelectors(str) {
		// find all css rules ({...}) and replace them with comma

		str = str.replace(/{(.|[\r\n])+?}/g, ',');

		// split between comma char and add it to array

		str.split(',').forEach(this.analyzeSelector.bind(this));

		console.log('result', this.selectors);
	}

	analyzeSelector(selector, index) {
		selector = selector.trim();

		// ignore media query rules for now

		const firstChar = selector.charAt(0);

		if (firstChar === '@' || firstChar === '}') {
			return;
		}

		// update selectors data

		if (selector in this.selectors) {
			this.selectors[selector].occurrences += 1;
			this.selectors[selector].positions.push(index + 1);

			return;
		}

		this.selectors[selector] = {
			complexity: 1, // TODO: calculate complexity
			occurrences: 1,
			positions: [index + 1]
		};
	}


}

module.exports = CssComplexity;