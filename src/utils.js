const msToString = (ms = 0) => {
	let seconds = ms / 1000
	let hours = parseInt(seconds / 3600)
	seconds = seconds % 3600
	let minutes = parseInt(seconds / 60)
	seconds = Math.ceil(seconds % 60)
	return `${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}:${
		seconds < 10 ? `0${seconds}` : `${seconds === 60 ? 00 : seconds}`
	}`
}

const stringToMS = (string = '00:00:00') => {
	let [h, m, s = '00'] = string.split(':')

	return (parseInt(h) * 60 * 60 + parseInt(m) * 60 + parseInt(s)) * 1000
}

const graphicToReadableLabel = (graphic) => {
	let id = graphic.id
	let label
	let contents

	if (graphic.type === 'lower_third') {
		label = `${graphic.line_one}, ${graphic.line_two} (Lower third - ${graphic.id})`
		contents = `${graphic.line_one}, ${graphic.line_two}`
	} else if (graphic.type === 'message') {
		label = `${graphic.body} (Message) - ${graphic.id})`
		contents = `${graphic.body}`
	} else if (graphic.type === 'time') {
		if (graphic.timerType === 'to_time_of_day') {
			label = `${
				graphic.status === 'onair' || graphic.status === 'coming' || graphic.status === 'going'
					? msToString(graphic.timeLeft * 1000)
					: graphic.endTime
			} (Time - ${graphic.id})`
			contents = `${
				graphic.status === 'onair' || graphic.status === 'coming' || graphic.status === 'going'
					? msToString(graphic.timeLeft * 1000)
					: graphic.endTime
			}`
		} else if (graphic.timerType === 'time_of_day') {
			label = `Current time of day (Time - ${graphic.id})`
			contents = `Current time of day`
		} else if (graphic.timerType === 'countdown' || graphic.timerType === 'countup') {
			label = `${
				graphic.status === 'onair' || graphic.status === 'coming' || graphic.status === 'going'
					? msToString(graphic.timeLeft)
					: graphic.duration
			} (Time - ${graphic.id})`
			contents = `${
				graphic.status === 'onair' || graphic.status === 'coming' || graphic.status === 'going'
					? msToString(graphic.timeLeft)
					: graphic.duration
			}`
		} else {
			label = `${
				graphic.status === 'onair' || graphic.status === 'coming' || graphic.status === 'going'
					? msToString(graphic.timeLeft)
					: graphic.duration
			} (Time - ${graphic.id})`
			contents = `${
				graphic.status === 'onair' || graphic.status === 'coming' || graphic.status === 'going'
					? msToString(graphic.timeLeft)
					: graphic.duration
			}`
		}
	} else if (graphic.type === 'image') {
		label = `${graphic.name} (Image - ${graphic.id})`
		contents = `${graphic.name}`
	} else if (graphic.type === 'ticker') {
		label = `${graphic.title} (Ticker - ${graphic.id})`
		contents = `${graphic.title}`
	} else if (graphic.type === 'social') {
		label = `Social - ${graphic.id}`
		contents = `Social`
	} else if (graphic.type === 'webpage') {
		label = `${graphic.url} (Webpage - ${graphic.id})`
		contents = `${graphic.url}`
	} else if (graphic.type === 'score') {
		label = `Score - ${graphic.id}`
		contents = `Score`
	} else if (graphic.type === 'lower_third_animated') {
		label = `${graphic.line_one}, ${graphic.line_two} (Two line - ${graphic.id})`
		contents = `${graphic.line_one}, ${graphic.line_two}`
	} else if (graphic.type === 'big_time') {
		label = `${
			graphic.status === 'onair' || graphic.status === 'coming' || graphic.status === 'going'
				? msToString(graphic.timeLeft)
				: graphic.duration
		} (Big timer - ${graphic.id})`
		contents = `${
			graphic.status === 'onair' || graphic.status === 'coming' || graphic.status === 'going'
				? msToString(graphic.timeLeft)
				: graphic.duration
		}`
	} else {
		label = `${graphic.type} (${graphic.id})`
		contents = `${graphic.type} (${graphic.id})`
	}

	return {
		id,
		label,
		contents,
	}
}

const graphicColours = (graphic) => {
	let bgColour

	switch (graphic) {
		case 'lower_third':
			bgColour = [202, 138, 4]
			break

		case 'message':
			bgColour = [234, 179, 8]
			break

		case 'time':
			bgColour = [248, 113, 113]
			break

		case 'image':
			bgColour = [37, 99, 235]
			break

		case 'ticker':
			bgColour = [165, 180, 252]
			break

		case 'social':
			bgColour = [126, 34, 206]
			break

		case 'webpage':
			bgColour = [55, 48, 163]
			break

		case 'score':
			bgColour = [34, 197, 94]
			break

		case 'big_time':
			bgColour = [248, 113, 113]
			break

		case 'lower_third_animated':
			bgColour = [250, 204, 21]
			break

		default:
			bgColour = [0, 0, 0]
			break
	}

	return { bgColour }
}

module.exports = {
	graphicToReadableLabel,
	stringToMS,
	graphicColours,
}
