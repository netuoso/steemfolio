// SteemFolio -- by @netuoso
// Automatically add your STEEM rewards to your Blockfolio account

var steem = require("steem");
var {username} = require("./config");
var {getPositions,addPosition,getVestsToSteem} = require("./blockfolio");

steem.api.setOptions({url: "https://api.steemit.com"});

var stream;

function run() {
	stream = steem.api.streamOperations((err,op) => {
		if(op[0] === 'claim_reward_balance' && op[1].account !== username){
			var claimedSbd = (+op[1].reward_sbd.split(" ")[0]).toFixed(3);
			var claimedVests = (+op[1].reward_vests.split(" ")[0]).toFixed(6);
			if (claimedSbd > 0){
				addPosition(["SBD"], claimedSbd, 0, function(data){console.log(data)});
			}
			if (claimedVests > 0) {
				getVestsToSteem((vestsToSteem) => {
					var claimedSteem = ((claimedVests/1000000)*vestsToSteem).toFixed(6);
					addPosition(["STEEM"], claimedSteem, 0, function(data){console.log(data)});
				})
			}
		}
	});
};

try {
	run();
} catch(e) {
	stream();
	run();
}
