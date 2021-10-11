//Information code

const apiVersion = 2

function targetApiVersion(av) {
	mc.listen('onServerStarted', function () {
		if(av < apiVersion){
			colorLog('yellow', 'Warn: Outdated script\'s target API!')
		}
		if(av > apiVersion){
			colorLog('red', 'Outdated MixerAPI version or typo in one of script\'s target API!')
		}
	})	
}
module.exports.targetApiVersion = targetApiVersion

mc.listen('onServerStarted', function(){
	colorLog('green', 'This server is using MixerAPI v' + apiVersion)
})

//BanAPI code

const path = './plugins/MixerAPI/banList.json';

mc.listen('onServerStarted', function(){
	if (!file.exists(path)) {
	    file.writeTo(path, '[]');
	}
})

function banPlayer(bplayer, reason) {
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
module.exports.banPlayer = banPlayer

function banByGametag(bplayername, reason) {
	let bplayer = mc.getPlayer(bplayername)
	banPlayer(bplayer, reason)
}
module.exports.banByGametag = banByGametag

function unbanPlayer(bplayer) {
	let bplayername = bplayer.realName
	unbanByGametag(bplayername)
}
module.exports.unbanPlayer = unbanPlayer

function unbanByGametag(bplayername) {
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
module.exports.unbanByGametag = unbanByGametag

mc.listen('onPreJoin', function (player) {
	let banList = JSON.parse(file.readFrom(path))
    for (let i = 0; i < banList.length; i++) {
        if (player.getDevice().clientId === banList[i]['clientID'] || player.realName === banList[i]['gametag'] || player.xuid === banList[i]['xuid']) {
            player.kick(`You are banned on this server!\n${banList[i]['reason']}`);
        }
    }
})

//ExperienceAPI code

// I propose to group all the API's into separate classes
// class ExperienceAPI {
// 	static get(player) {
// 		...
// 	}
// 	static set(player,xp) {
// 		...
// 	}
// 	static add(player,xp) {
// 		...
// 	}
// 	static reduce(player,xp) {
// 		...
// 	}
// }

function experienceGet(player) {
	let currentXp = player.getNbt().getTag('PlayerLevel').toString()
	return currentXp
}
module.exports.experienceGet = experienceGet

function experienceSet(player, xp) {
	let xpToChange = player.getNbt().setInt('PlayerLevel', Number(xp))
	player.setNbt(xpToChange)
}
module.exports.experienceSet = experienceSet

function experienceAdd(player, xp) {
	let xpToChange = player.getNbt().setInt('PlayerLevel', Number(experienceGet(player)) + Number(xp))
	player.setNbt(xpToChange)
}
module.exports.experienceAdd = experienceAdd

function experienceReduce(player, xp) {
	let xpToChange = player.getNbt().setInt('PlayerLevel', Number(experienceGet(player)) - Number(xp)) 
	let currentXp = experienceGet(player)
	let xpToReduce = xp
	if (currentXp < xpToReduce) {
		return false
	} else {
		player.setNbt(xpToChange)
		return true
	}
}
module.exports.experienceReduce = experienceReduce

//SpeedAPI code

//BROKEN!!
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