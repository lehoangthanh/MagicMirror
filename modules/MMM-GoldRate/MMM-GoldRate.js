/* global Module */

/* Magic Mirror
 * Module: MMM-CurrencyExchange
 *
 * By Stefan Krause http://yawns.de
 * MIT Licensed.
 */

Module.register("MMM-GoldRate", {
	defaults: {
		base: "",
		symbols: null,
		units: config.units,
		animationSpeed: 1000,
		updateInterval: 1000 * 3600, //update every hour
		timeFormat: config.timeFormat,
		lang: config.language,
		showCustomHeader: false,
		showFlag: true,
		showText: true,
		layoutStyle: "table",

		initialLoadDelay: 0, // 0 seconds delay

		// apiBase: "https://api.exchangeratesapi.io/latest",
		apiBase: "https://api.apilayer.com/exchangerates_data/latest"
	},

	// ##################################################################################
	// Define required scripts.
	// ##################################################################################
	getScripts: function () {
		return [];
	},

	// ##################################################################################
	// import css files
	// ##################################################################################
	getStyles: function () {
		return [];
	},

	// ##################################################################################
	// setup the module
	// ##################################################################################
	start: function () {
		Log.info("Starting module: " + this.name);

		var self = this;
		setInterval(function () {
			self.updateDom();
		}, this.config.updateInterval);
	},

	// ##################################################################################
	// handle all the output stuff
	// ##################################################################################
	getDom: async function () {
		const wrapper = document.createElement("div");
		const outputWrapper = document.createElement("div");

		// const  table = document.createElement('table');
		// table.className = "small align-left";

		// var dataLimit = 4;
		// for (i in currencies) {
		// 	const currency = currencies[i]['$'];
		// 	console.log('=-currencies=====', currency)
		// 	if ( i % dataLimit == 0) {
		// 		var row = document.createElement('tr');
		// 	}
		// 	const cell = document.createElement('td');
		// 	const rateContainer = document.createElement('strong');
		// 	rateContainer.innerHTML = currency.CurrencyCode +': '+currency.Transfer;
		// 	rateContainer.className = "light bold";

		// 	cell.appendChild(rateContainer);
		// 	row.appendChild(cell);
		// 	if ( i % dataLimit != 0 || i == (currencies.length-1) ) { table.appendChild(row) }
		// }

		// outputWrapper.appendChild(table);
		// wrapper.appendChild(outputWrapper);

		// Example
		// const petrolimexTable = await this.fetchPetrolimexHtml();

		const goldSJCHtml = await this.fetchGoldSJCHtml();
		wrapper.appendChild(goldSJCHtml);
		return wrapper;
	},

	fetchPetrolimexHtml: async function () {
		const url = "http://localhost:8880/cors?url=https://webtygia.com/gia-xang-dau/petrolimex.html";
		const response = await fetch(url);
		const content = await response.text();
		const dom = new DOMParser().parseFromString(content, "text/html");
		const xPath = '//*[@id="myTabletoday"]';
		const tableDom = this.getElementByXpath(xPath, dom);
		return tableDom;
	},

	fetchGoldSJCHtml: async function () {
		const url = "http://localhost:8880/cors?url=https://webtygia.com/gia-vang-sjc.html";
		const response = await fetch(url);
		const content = await response.text();
		const dom = new DOMParser().parseFromString(content, "text/html");
		const xPath = '//*[@id="myTable"]';
		const tableDom = this.getElementByXpath(xPath, dom);
		const trs = tableDom.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
		const arrTd = [];
		// for (i in trs) {
		// 	if(trs[i] === undefined) continue;
		// 	const tr = trs[i].getElementsByTagName('td')[0];
		// 	if(tr === undefined) continue;
		// 	console.log(tr.getElementsByTagName('a')[0])
		// 	const td = tr.getElementsByTagName('a')[0];
		// 	if(td.text === 'Hồ Chí Minh') arrTgitd.push(td.text)
		// }
		// console.log(arrTd)
		return tableDom;
	},

	getElementByXpath: function (path, dom) {
		return document.evaluate(path, dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	}
});
