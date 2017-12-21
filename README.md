# SteemFolio

Automatically add your claimed Steem rewards to your Blockfolio account

### Dependencies
- Node/Npm
- Cheerio
- SteemJs
- Node-Bittrex-Api

### How to get started
- Clone this repo
	- `git clone https://github.com/netuoso/steemfolio`
- Install node packages
	- `cd steemfolio && npm install`
- Configure your Username and Device ID in `config.js`
	- `var username = "your_username_goes_here"`;
	- `var deviceId = "YOUR:DEVICE_ID_GOES_HERE"`;
- Run the application
  - `npm run steemfolio`

### Returns your entire portfolio
 ```
 getPositions(function(data){
 	console.log(data);
 });
```

### Adds a new position to your portfolio
```
 addPosition(["STEEM"], 1, 0, function(data){
 	console.log(data);
 });
```
