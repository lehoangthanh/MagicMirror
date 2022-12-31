/* global Module */

/* Magic Mirror
 * Module: MMM-CurrencyExchange
 *
 * By Stefan Krause http://yawns.de
 * MIT Licensed.
 */

Module.register("MMM-CurrencyExchange", {
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
		return ["moment.js"];
	},

	// ##################################################################################
	// import css files
	// ##################################################################################
	getStyles: function () {
		return ["MMM-CurrencyExchange.css"];
	},

	// ##################################################################################
	// setup the module
	// ##################################################################################
	start: function () {
		Log.info("Starting module: " + this.name);
		// this.loaded = false;

		// this.scheduleUpdate(this.config.initialLoadDelay);

		// this.updateTimer = null;

		if (this.config.base == "") {
			this.config.base = "EUR";
		}

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
		const currencies = await this.fetchCurrency();
		const table = document.createElement("table");
		table.className = "small align-left";

		var dataLimit = 4;
		for (i in currencies) {
			const currency = currencies[i]["$"];
			if (i % dataLimit == 0) {
				var row = document.createElement("tr");
			}
			const cell = document.createElement("td");
			const rateContainer = document.createElement("strong");
			rateContainer.innerHTML = currency.CurrencyCode + ": " + currency.Transfer;
			rateContainer.className = "light bold";

			cell.appendChild(rateContainer);
			row.appendChild(cell);
			if (i % dataLimit != 0 || i == currencies.length - 1) {
				table.appendChild(row);
			}
		}

		outputWrapper.appendChild(table);
		wrapper.appendChild(outputWrapper);
		return wrapper;
	},

	// ##################################################################################
	// fetch new data
	// ##################################################################################
	fetchCurrency: async function () {
		const url = "http://localhost:8880/cors-xml?url=https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx";
		const response = await fetch(url);
		const content = await response.text();
		const data = JSON.parse(content);

		const allowCurrencies = ["USD", "CAD", "AUD", "EUR"];
		const currencies = data.ExrateList.Exrate.filter((item) => allowCurrencies.indexOf(item["$"].CurrencyCode) > -1);
		return currencies;
	}
});
