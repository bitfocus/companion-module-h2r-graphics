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

	//when sending these dynamically, the H2R program should just send the label and contents properties already formatted as desired
	//and this entire function can be simplified or even removed

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
		label = `${graphic.line_one}, ${graphic.line_two} (LT Animated - ${graphic.id})`
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
	} else if (graphic.type === 'icon_with_message') {
		label = `${graphic.body} (Message - ${graphic.id})`
		contents = `${graphic.body}`
	} else if (graphic.type === 'credits') {
		label = `${graphic.lead} (Credits - ${graphic.id})`
		contents = `${graphic.lead}`
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

	let blank_bgColour = [0, 0, 0];
	obj = self.GRAPHICS.find((gfx) => gfx.id == graphic);

	if (obj) {
		return obj.bgColour;
	}
	else {
		return blank_bgColour;
	}
}
const graphicIcons = (graphic) => {
	let png;

	let blank_png = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAmSURBVHgB7cABAQAAAIIg/69uSFAAAAAAAAAAAAAAAAAAAAAArwZBegAB2I2aJAAAAABJRU5ErkJggg==';

	obj = self.GRAPHICS.find((gfx) => gfx.id == graphic);

	if (obj) {
		return obj.png;
	}
	else {
		return blank_png;
	}
}

module.exports = {
	graphicToReadableLabel,
	stringToMS,
	graphicColours,
	graphicIcons,
}
