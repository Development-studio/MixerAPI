# MixerAPI
Easy to use API based on LXL and CJS. Adds some methods to increase your LXL scripting experiece
## Installation
You have to install [LiteXLoader](https://github.com/LiteLDev/LiteXLoader "LiteXLoader") to use this API. 
After everything is done, simply put the API script into `bds_folder/plugins/`
## Usage
To use MixerAPI, you have to put your script in `bds_folder/plugins/` and add a `require`
###### Example:
```JS
//This is your script
const api = require('./MixerAPI.js')
```
## Documentation
Documentation for every API method can be found in repo's wiki. **Attention! API may be changed in future**
## API usage examples
###### Ban/Unban
```JS
//This is your script
const api = require('./MixerAPI.js')

//MixerAPI is 100% compatible with LXL's JS API
mc.regPlayerCmd('ban', 'Ban any player', function(player, args){
  let gameTag = args[0] //You can use XUID as well
  let reason = args[1] //Optional, if == null, won't display ban reason for banned player
  api.banPlayer(gameTag, reason)
})

mc.regPlayerCmd('unban', 'unban player', function(player, args){
  let gameTag = args[0] //You can use XUID as well
  api.unbanPlayer(gameTag)
})
```
###### Get player's speed only by X and Z
```JS
//This is your script
const api = require('./MixerAPI.js')

//MixerAPI is 100% compatible with LXL's JS API
mc.listen('onMove', function (player, pos){
  let XZSpeed = api.getXZSpeed(player)
  logger.log('XZSpeed')
})
```
