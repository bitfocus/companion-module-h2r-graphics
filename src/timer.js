const intervalIdObj = {}

const toTimeString = (timeLeft, amount = 'full') => {
	let hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24) || 0
	let minutes = Math.floor((timeLeft / (1000 * 60)) % 60) || 0
	const seconds = Math.floor((timeLeft / 1000) % 60) || 0

	if (timeLeft <= 0) {
		hours++
		minutes++
	}

	if (amount == 'hh') return hours.toString().padStart(2, '0')
	if (amount == 'mm') return minutes.toString().padStart(2, '0')
	if (amount == 'ss') return seconds.toString().padStart(2, '0')

	const hoursString = `${timeLeft < 0 ? '-' : ''}${Math.abs(hours).toString().padStart(2, '0')}`
	const minutesString = `${Math.abs(minutes).toString().padStart(2, '0')}`
	const secondsString = `${Math.abs(seconds).toString().padStart(2, '0')}`

	return `${hoursString}:${minutesString}:${secondsString}`
}
function calculateTimeLeft(timeCue) {
	const currentTime = new Date().getTime()
	let timeLeft

	if (['time_countup', 'big_time_countup'].includes(timeCue.type)) {
		timeLeft = currentTime - timeCue.startedAt
	} else if (['time_countdown', 'big_time_countdown', 'utility_speaker_timer'].includes(timeCue.type)) {
		timeLeft = timeCue.state === 'reset' ? Number.parseInt(timeCue.duration, 10) : timeCue.endAt - currentTime
	} else if (['time_to_tod', 'big_time_to_tod'].includes(timeCue.type)) {
		const t = new Date(timeCue?.endTime)?.getTime() || 0
		timeLeft = t - currentTime
	}

	if (
		['time_countdown', 'big_time_countdown', 'big_time_to_tod', 'time_tod', 'utility_speaker_timer'].includes(
			timeCue.type
		) &&
		timeCue.onEnd === 'hold'
	) {
		return Math.max(0, timeLeft)
	}
	return timeLeft
}

export function startStopTimer(instance, timerObj) {
	instance.log('debug', `ATTEMPTING ${timerObj.id} ${JSON.stringify(timerObj)}`)

	const timerKey = timerObj.id

	if (['paused', 'reset'].includes(timerObj.state)) return updateTimerDisplay(instance, timerObj, timerKey)

	clearInterval(intervalIdObj[timerKey])
	intervalIdObj[timerKey] = setInterval(() => {
		return updateTimerDisplay(instance, timerObj, timerKey)
	}, 1000)

	return updateTimerDisplay(instance, timerObj, timerKey)
}

function updateTimerDisplay(instance, timeCue, timerKey) {
	const timeLeft = calculateTimeLeft(timeCue)

	if (['paused', 'reset'].includes(timeCue.state)) {
		clearInterval(intervalIdObj[timerKey])
		delete intervalIdObj[timerKey]
	}

	instance.log('debug', `INTERVAL ${timeCue.id} ${JSON.stringify(timeCue)}`)
	return setTimerVariables(instance, timerKey, timeLeft)
}

function setTimerVariables(instance, timerKey, timeLeft) {
	return instance.setVariableValues({
		[`graphic_${timerKey}_contents`]: `${toTimeString(timeLeft)}`,
		[`graphic_${timerKey}_hh`]: `${toTimeString(timeLeft, 'hh')}`,
		[`graphic_${timerKey}_mm`]: `${toTimeString(timeLeft, 'mm')}`,
		[`graphic_${timerKey}_ss`]: `${toTimeString(timeLeft, 'ss')}`,
	})
}
