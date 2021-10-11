# MixerAPI
Easy to use API based on LXL and CJS. Adds some methods to increase your LXL scripting experiece
## Installation
You have to install [LiteXLoader](https://github.com/LiteLDev/LiteXLoader "LiteXLoader") and [cjs.js](https://github.com/callstackexceed/cjs.js "CJS") to use this API.
After everything is done, simply put the API script into `bds_folder/plugins/cjs`
## Usage
To use MixerAPI, you have to put your script in `bds_folder/plugins/cjs` and add a `require`
###### Example:
```JS
//This is your script
const api = require('./MixerAPI.js')
```
## Documentation
Documentation for every API method can be found in repo's [wiki](https://github.com/Development-studio/MixerAPI/wiki). **Attention! API may be changed in future**
## API usage examples
###### Ban/Unban
```JS
//This is your script
const api = require('./MixerAPI.js')

//MixerAPI is 100% compatible with LXL's JS API
mc.regPlayerCmd('ban', 'Ban any player', function(player, args){
  let gameTag = args[0] //You can use XUID as well
  let reason = args[1] //Optional, if == null, won't display ban reason for banned player
  api.BanAPI.banByGametag(gameTag, reason)
})

mc.regPlayerCmd('unban', 'unban player', function(player, args){
  let gameTag = args[0] //You can use XUID as well
  api.BanAPI.unbanByGametag(gameTag)
})
```
###### Get player's experience
```JS
//This is your script
const api = require('./MixerAPI.js')

//MixerAPI is 100% compatible with LXL's JS API
mc.regPlayerCmd("get","Get XP",function(pl,args){
    pl.tell(`You have: ${api.ExperienceAPI.get(pl)}XP`);
});
```
