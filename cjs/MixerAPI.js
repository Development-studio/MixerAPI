//Information code

const apiVersion= [1, 1, 0]

const isBeta = true
//API version will be now contained in plugin-ish Script information object

let scriptList = []

class ScriptInfo{ 
	static load(infoObject) {
		scriptList.push(infoObject)
		mc.listen('onServerStarted', function () {
			if (apiVersion[0] != infoObject.apiVersion[0] || apiVersion[1] < infoObject.apiVersion[1] || apiVersion[2] < infoObject.apiVersion[2]) {
				colorLog('red', 'Incompatible API version in ' + infoObject.name)
				logger.log('Server will be stopped')
				setTimeout(mc.runcmd('stop'), 5000)
			}
		})
		let _scriptList = ('MixerAPI v' + apiVersion[0] + '.' + apiVersion[1] + '.' + apiVersion[2] + ' by Development-studio')
		for (let i = 0; i <= scriptList.length; i++) {
			_scriptList = _scriptList + ', ' + scriptList[i].name + ' by ' + scriptList[i].authors
		}
		mc.regPlayerCmd('plugins', 'Display list of installed scripts', function (player, args) {
			player.tell(_scriptList, 0)
		})
		mc.regConsoleCmd('plugins', function (args) {
			logger.log(_scriptList)
		})
	}
}

/*
Info object example:
ScriptInfo.load( {
	name: 'Sample script',
	authors: ['Me!!'],
	apiVersion: [1, 1, 0]
} )
*/

module.exports.ScriptInfo = ScriptInfo

mc.listen('onServerStarted', function(){
	colorLog('green', 'This server is using MixerAPI v' + apiVersion[0] + '.' + apiVersion[1] + '.' + apiVersion[2])
	if (isBeta){
		colorLog('yellow', 'Warn: This API version is currently in Beta')
	}
})

//BanAPI code


const path = './plugins/MixerAPI/banList.json';

mc.listen('onServerStarted', function(){
	if (!file.exists(path)) {
	    file.writeTo(path, '{"bans": []}');
	}
})

class BanAPI {
    static banByObject(bplayer, reason){
        let banList = JSON.parse(file.readFrom(path))
        banList.bans.push({
			"gametag": bplayer.realName,
			"clientID": bplayer.getDevice().clientId,
			"xuid": bplayer.xuid,
			"reason": reason,
		})
        file.writeTo(path, JSON.stringify(banList))
        bplayer.kick(reason)
    }
    static banByGametag(bplayername, reason="You are banned"){
		let bplayer = mc.getPlayer(bplayername)
		this.banByObject(bplayer,reason)
	}
    static unbanByGametag(bplayername){
        let banList = JSON.parse(file.readFrom(path))
		let selectedBan = banList.bans.find(({ gametag }) => gametag === bplayername)
        let banSelect = []
        banSelect.push(selectedBan)
        let filteredBan = banList.bans.filter(
            (item) => !banSelect.includes(item)
        )
        let readyBansJson = { bans: filteredBan };
        File.writeTo(
            path,
            JSON.stringify(readyBansJson)
        );
    }
    static unbanByObject(bplayer){
		let bplayername = bplayer.realName
		this.unbanByGametag(bplayername)
	}
}

module.exports.BanAPI = BanAPI

mc.listen('onPreJoin', function (player) {
	let banList = JSON.parse(file.readFrom(path))
    let selectedBan = banList.bans.find(({ gametag }) => gametag === player.realName)
	if (selectedBan != null) {
		if (player.getDevice().clientId === selectedBan.clientID || player.realName === selectedBan.gametag || player.xuid === selectedBan.xuid) {
			player.kick(selectedBan.reason);
		}
	}
})

//ExperienceAPI code

class ExperienceAPI {
	static get(player) {
		let currentXp = player.getNbt().getTag('PlayerLevel').get()
		return currentXp
	}
	static set(player,xp) {
		let xpToChange = player.getNbt().setInt('PlayerLevel', Number(xp))
		player.setNbt(xpToChange)
	}
	static add(player,xp) {
		let xpToChange = player.getNbt().setInt('PlayerLevel', Number(this.get(player)) + Number(xp))
		player.setNbt(xpToChange)
	}
	static reduce(player,xp) {
		let xpToChange = player.getNbt().setInt('PlayerLevel', Number(this.get(player)) - Number(xp)) 
		let currentXp = this.get(player)
		let xpToReduce = xp
		if (currentXp < xpToReduce) {
			return false
		} else {
			player.setNbt(xpToChange)
			return true
		}
	}
}
module.exports.ExperienceAPI = ExperienceAPI

//ChatAPI code

class ChatAPI {
	static tellFrom(player, message) {
		let name = player.realName
		if(!isMuted){
			mc.runcmd('tellraw @a {"rawtext":[{"text":"<' + name + '> ' + message + '"}]}')
		}
	}
	static isMuted(player){
		if(player.hasTag('is_muted')){
			return true
		}else{
			return false
		}
	}
	static mute(player) {
		player.addTag('is_muted')
	}
	static muteByGametag(playername) {
		let player = mc.getPlayer(playername)
		mute(player)
	}
	static unmute(player) {
		if (isMuted) {
			player.removeTag('is_muted')
		}
	}
	static unmuteByGametag(playername) {
		let player = mc.getPlayer(playername)
		mute(player)
	}
}
module.exports.ChatAPI = ChatAPI

mc.listen('onChat', function (player, msg) {
	if (isMuted) {
		player.tell(Format.Gray + 'You are muted!', 0)
		return false
	}
})

//SpeedAPI code

//BROKEN!!
/*
async function getXZSpeed(player) {
	let xOld = player.pos.x
	let zOld = player.pos.z
	let xNewPromise = new Promise(
		async function getNewPosX(xNew_){
			setTimeout(
				function () {
					let newPlayer = mc.getPlayer(player.xuid)
					let xNew = newPlayer.pos.x
					xNew_(xNew)
				}
			, 5)
		}
	)
	let zNewPromise = new Promise(
		async function getNewPosZ(zNew_){
			setTimeout(
				function () {
					let newPlayer = mc.getPlayer(player.xuid)
					let zNew = newPlayer.pos.z
					zNew_(zNew)
				}
			, 5)
		}
	)
	let XZSpeed = new Promise(
		async function countSpeed(XZSpeed_){
			let xNewPromise_ = await xNewPromise
			let zNewPromise_ = await zNewPromise
			let xMove = Math.abs(xNewPromise_ - xOld)
			let zMove = Math.abs(zNewPromise_ - zOld)
			let XZMove = Math.sqrt(Math.pow(xMove,2) + Math.pow(zMove,2))
			XZSpeed_(XZMove * 1000)
		}
	)
	let result = await XZSpeed
	logger.log(result)
	return result
}
module.exports.getXZSpeed = getXZSpeed
*/ 
