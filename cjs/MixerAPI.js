//Information code

const apiVersionMajor = 1
const apiVersionMinor = 0
const apiVersionRevision = 0

const isBeta = true

class TargetVersion{
	static set(apiVerMaj, apiVerMin, apiVerRev) {
		mc.listen('onServerStarted', function () {
			if (apiVersionMajor != apiVerMaj || apiVersionMinor < apiVerMin || apiVersionRevision < apiVerRev) {
				logger.log('red', 'Incompatible API version in one of the scripts')
				mc.runCmd('stop')
			}
		})
	}
}
module.exports.TargetVersion = TargetVersion

mc.listen('onServerStarted', function(){
	colorLog('green', 'This server is using MixerAPI v' + apiVersionMajor + '.' + apiVersionMinor + '.' + apiVersionRevision)
	if (isBeta){
		colorLog('yellow', 'Warn: This API version is currently in Beta')
	}
})

//BanAPI code

const path = './plugins/MixerAPI/banList.json';

mc.listen('onServerStarted', function(){
	if (!file.exists(path)) {
	    file.writeTo(path, '[]');
	}
})

class BanAPI{
	static banByObject(bplayer, reason){
		let cid = bplayer.getDevice().clientId
		let bname = bplayer.realName
		let bxuid = bplayer.xuid
		let banList = JSON.parse(file.readFrom(path))
    	    banList.push({
    	        "gametag": bname,
    	        "clientID": cid,
    	        "xuid": bxuid,
    	        "reason": reason
    	    })
    	    file.writeTo(path, JSON.stringify(banList))
		bplayer.kick('You are banned on this server!' + '\n' + reason)
	}
	static banByGametag(bplayername, reason){
		let bplayer = mc.getPlayer(bplayername)
		banByObject(bplayer, reason)
	}
	static unbanByGametag(bplayername){
		let banList = JSON.parse(file.readFrom(path));
    	for (let i = 0; i < banList.length; i++) {
    	    if (bplayername === banList[i]['gametag']) {
    	    	switch (i){
    	    		case 0:
    	    			unbanObj = `{"gametag":"${banList[i]['gametag']}","clientID":"${banList[i]['clientID']}","xuid":"${banList[i]['xuid']}","reason":"${banList[i]['reason']}"}`
    	    			break
    	    		default:
    	    			unbanObj = `,{"gametag":"${banList[i]['gametag']}","clientID":"${banList[i]['clientID']}","xuid":"${banList[i]['xuid']}","reason":"${banList[i]['reason']}"}`
    	    			break
    	   		}
    	    banList = String(JSON.stringify(banList))
    	    rewrite = banList.replace(unbanObj, '')
    	    file.writeTo(path, rewrite)
    		}
    	}
	}
	static unbanByObject(bplayer){
		let bplayername = bplayer.realName
		unbanByGametag(bplayername)
	}
}
module.exports.BanAPI = BanAPI

mc.listen('onPreJoin', function (player) {
	let banList = JSON.parse(file.readFrom(path))
    for (let i = 0; i < banList.length; i++) {
        if (player.getDevice().clientId === banList[i]['clientID'] || player.realName === banList[i]['gametag'] || player.xuid === banList[i]['xuid']) {
            player.kick(`You are banned on this server!\n${banList[i]['reason']}`);
        }
    }
})

//ExperienceAPI code

class ExperienceAPI {
	static get(player) {
		let currentXp = player.getNbt().getTag('PlayerLevel').toString()
		return currentXp
	}
	static set(player,xp) {
		let xpToChange = player.getNbt().setInt('PlayerLevel', Number(xp))
		player.setNbt(xpToChange)
	}
	static add(player,xp) {
		let xpToChange = player.getNbt().setInt('PlayerLevel', Number(get(player)) + Number(xp))
		player.setNbt(xpToChange)
	}
	static reduce(player,xp) {
		let xpToChange = player.getNbt().setInt('PlayerLevel', Number(get(player)) - Number(xp)) 
		let currentXp = get(player)
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