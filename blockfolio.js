var request = require("request");
var cheerio = require("cheerio");
var bittrex = require("node-bittrex-api");

const {deviceId} = require("./config");
const baseUrl = "https://api-v0.blockfolio.com/rest";

function getVestsToSteem(cb) {
	var vestsToSteem;
	var getVestsUrl = encodeURI("http://www.steemdollar.com/vests.php");
	var options = {
		method: "GET",
		port: 443,
		url: getVestsUrl,
		headers: {
			"User-Agent": "okhttp/3.6.0"
		}
	};
	request(options, (error, response, body) => {
    if (response.statusCode === 200){
			const $ = cheerio.load(body);
			vestsToSteem = $.html(".content > h1").match(/VESTS\s\=\s*(\d{3,}\.\d{1,})/)[1];
    } else {
			vestsToSteem = 487.74;
    }
    console.log(`Vests Per Steem = ${vestsToSteem}`);
    cb(vestsToSteem);
	});
}

function getPositions(cb) {
	var getPositionUrl = encodeURI(`${baseUrl}/get_all_positions/${deviceId}?fiat_currency=USD&locale=en-US&use_alias=true`);
	var options = {
		method: "GET",
		port: 443,
		url: getPositionUrl,
		headers: {
			"User-Agent": "okhttp/3.6.0"
		}
	};
	request(options, (error, response, body) => {
		if (error) {
			throw error;
		} else {
			cb(body);
		}
	});
}

function addPosition(assets, amount, watchOnly, cb) {
	assets.forEach((asset) => {
		bittrex.getticker( { market : `BTC-${asset}` }, function( ticker ) {
			var assetBtcPrice = +(ticker.result.Last).toFixed(8); // TODO: Support other exchanges
			var addCoinPath = `${baseUrl}/add_position_v2/${deviceId}/1/${asset}/BTC/bittrex/${assetBtcPrice}/${amount}/${new Date().getTime()}/${watchOnly}?platform=android_rn&note=&use_alias=true;`
			var options = {
				method: "GET",
				port: 443,
				url: addCoinPath,
				headers: {
					"User-Agent": "okhttp/3.6.0"
				}
			};
			request(options, (error, response, body) => {
				if(body === "success"){
					cb(`Successfully added ${amount} ${asset} to portfolio`);
				} else {
					cb(`Something went wrong while adding ${amount} ${asset} to portfolio`);
				}
			});
	  });
	});
}

module.exports = {
	getPositions,
	addPosition,
	getVestsToSteem
};
