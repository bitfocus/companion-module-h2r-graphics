export const msToString = (ms = 0) => {
	let seconds = ms / 1000
	let hours = parseInt(seconds / 3600)
	seconds = seconds % 3600
	let minutes = parseInt(seconds / 60)
	seconds = Math.ceil(seconds % 60)
	return `${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}:${
		seconds < 10 ? `0${seconds}` : `${seconds === 60 ? '00' : seconds}`
	}`
}

export const stringToMS = (string = '00:00:00') => {
	let [h, m, s = '00'] = string.split(':')

	return (parseInt(h) * 60 * 60 + parseInt(m) * 60 + parseInt(s)) * 1000
}

export const graphicToReadableLabel = (graphic) => {
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
	} else if (graphic.type === 'image_with_message') {
		label = `${graphic.body} (Image with Mesage - ${graphic.id})`
		contents = `${graphic.body}`
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
	} else if (graphic.type === 'animated_background') {
		label = `${graphic.animationName} (Animated Background - ${graphic.id})`
		contents = `${graphic.animationName}`
	} else if (graphic.type === 'video') {
		label = `${graphic.name} (Video - ${graphic.id})`
		contents = `${graphic.name}`
	} else if (graphic.type === 'celebration') {
		label = `${graphic.celebrationType} (Celebration - ${graphic.id})`
		contents = `${graphic.celebrationType}`
	} else if (graphic.type === 'now_next_then') {
		label = `${graphic.items[0].sectionTitle} (Now next then - ${graphic.id})`
		contents = `${graphic.items[0].sectionTitle}`
	} else if (graphic.type === 'qr') {
		label = `${graphic.message} (QR code - ${graphic.id})`
		contents = `${graphic.message}`
	} else if (graphic.type === 'map') {
		label = `Map - ${graphic.id}`
		contents = `Map`
	} else if (graphic.type === 'checklist') {
		label = `${graphic.title} (Checklist - ${graphic.id})`
		contents = `${graphic.title}`
	} else if (graphic.type === 'utility_large_text') {
		label = `${graphic.text} (Large Text - ${graphic.id})`
		contents = `${graphic.text}`
	} else if (graphic.type === 'utility_time_of_day') {
		label = `Time of day (Time of Day - ${graphic.id})`
		contents = `Time of day`
	} else if (graphic.type === 'utility_pattern') {
		label = `Pattern - ${graphic.id}`
		contents = `Pattern`
	} else if (graphic.type === 'utility_speaker_timer') {
		label = `${msToString(graphic.duration)} (Speaker timer - ${graphic.id})`
		contents = ['running'].includes(graphic.state) ? `${graphic.endAt}` : `${msToString(graphic.duration)}`
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

export const graphicColours = (graphic) => {
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

		case 'icon_with_message':
			bgColour = [234, 179, 8]
			break

		case 'credits':
			bgColour = [34, 197, 94]
			break

		case 'video':
			bgColour = [80, 74, 226]
			break

		case 'image_with_message':
			bgColour = [150, 103, 28]
			break

		case 'animated_background':
			bgColour = [67, 102, 232]
			break

		case 'celebration':
			bgColour = [111, 41, 203]
			break

		case 'now_next_then':
			bgColour = [50, 87, 68]
			break

		case 'qr':
			bgColour = [53, 88, 52]
			break

		case 'checklist':
			bgColour = [100, 102, 237]
			break

		case 'map':
			bgColour = [45, 60, 135]
			break

		default:
			bgColour = [0, 0, 0]
			break
	}

	return { bgColour }
}
export const graphicIcons = (graphic) => {
	let png

	switch (graphic) {
		case 'lower_third':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHTSURBVHgB7ZThUQIxEIUXxwLsQEqwA84K1ArECvQqACtQK2CsQKiAswKhArECoIJzH3kZ1xsQZHT0x/tm3iTZ5HY3m1zMhBB/SV3Xbdcr2oa9R/uL69x1xHHB+bGrz37fNXDdcE0WvrsPfsYxjveHjfVQJ+ZDH4OcZ4idfd7RFuMMmvvZxIHtRrtRHATtukrXo+vJdeKauVbF8rZwdfjJmWvqgn3huqIq2qYcY+4+hOrTDh7Yf2vkcxTGsS2prufT5bpn2tAf2w4c2n4USLjVag0x8AQuLRVoZKkYmJ/AxpPCHDZ3bp83NGE7t1Tcpes4B3H/E/pfrfVxFU7+zPtLxlrHIvjPzOgD9rm3JznGJna9QU3yTYjJwFZZKgYK9sgEb5hYTKRDtTlG4fB7oLil7UZBH8cb5geWCo8bN4wTnssi7ONL9i0Qruol//vCUrJVKMJqbOlGXbOfQbGuqLweGzhlwluTJiV8WDqIdWDu1lWHghjfyh7zqGwL3ykQHjiAk+lnm6X3pwzBkPCCm88nNwp+ivqD7Cf/Tvi2Zz8H3rM23yCjb9yqwnVhvw0fYyGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEOLf8w7C6DWBaBx7RQAAAABJRU5ErkJggg==`
			break

		case 'message':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGASURBVHgB7dTxTcJAFMfxw/i/HaFOoBvYEWAC2ECYAJwANigbWCeADYgTgBPoBvU9+7vkif3DRBIw+X6SF3vv3vXso9eUAFyytm1Li73FNOQmyvlco+t9yN1bbDRehvvknP8tw/12Fs9hXFjMVetzQ+V/7JXOTQ/m3kNur1x+6JVF5RHml2rU1wNarL0Jynn9SrXDcL+8fqmcz001V2ivddzrr67T6XzkX7LHjUXpNRofLLz2zWI0GAwO3hi7HivfWG6rWh9vtb7StedmVtPoLWl69jqJq3Q6LxaPFhOLp6O5W4sHhRupxsf+JlT2sAu7nqXu4Wq9GUXqmvaauqaOtd7zhZpTW+xS17y+vc4rHLE7P2bhaMUjNgn1hY5HpbEfsYXq5sqt8zrV1opWx2ejyN+zuNciXZKjZvi3o1Y+/tNRqYZkO+VyM1o12r8vTb6f7rnRHqXW5dppmP+2V/rP2u4IHefK9Et96wEAAAAAAAAAAAAAAAAAAAAAAAAA6PMJELIab6B0iTgAAAAASUVORK5CYII=`
			break

		case 'time':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADVSURBVHgB7dPNDYJAEIbhwXjXErYTKYEODBVoCXQgdkAHagfYgR24JdgBzoYhbjh5MBNi3if5sn/sgcmsCIB/MAxDq3nOErLxqrlk309nR0t+rxInK/HTaWqb39K8KIqoY7C9jabSny9t3djZ1vKy+ym9OHErkBbjoeltmc9zUXOw+c7Wk1SkIJ+CuvDsoG+cNWV6UjIWJ87Od5YgTtayLOkZ3TUnGZ/SPjuL2nW1OFtaByWtjMXoZvupsyaNAAAAAAAAAAAAAAAAAAAAAAAAAACA33kDVUdpoA9PsA4AAAAASUVORK5CYII=`
			break

		case 'image':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEiSURBVHgB7dTRTcNAEEXRNeKflLBUQAlsB7iDJBUQKqAEoIKECnAHoQNDBXEHpAMzI57FCMEPki1ZuUd6sr0zjpTRelMCMFd932fLQde95SXUimp1WGt/9Cws9+prh167NlobktMcaTB9GJQrqu30vNJz/UfPQbWN5UND26tWht6xnKdpvVr8z3Z2XVq6UKtVz5ai+xvLuqqqRruksfuj3Xv/hXpHdZam9ZS+BuPD2CUNyHeF1t+1towvaThbSxt2zKXlWhnN1AM6Wt4sD5bnsO4D6yxXes4ahPfeau3Oskjfu853k++udZqrX86gMhzOqvtZstKhuw3v+fqj3mv1G37+bEI9yumU6RMEAAAAAAAAAAAAAAAAAAAAAAAAAODfPgH66h0vMFhShgAAAABJRU5ErkJggg==`
			break

		case 'ticker':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE9SURBVHgB7dTRTQJBEMbxxfguHXgdiB0cHdCBUAF0IHSgFYgViBVAB9oB1wF2cH6T+za57JMPXgjk/0smw87sXdjJ3aUE4NK0bTtTHIuI2k6x8p6l61+KZ9dWirdef68YF/eJWlWsl+mS+AC1B3Lw77EPs/awWufonRRz92LPxP3a92s9vNq9Kvd9XZikAdymAYxGo0apiT+vfNL6EHWt85Za8an6zvWp0o8i9leKD8UmX2eV9zTOqfg9TgMYZEB/EIc55YUG8R3ZA6xSd+iH4pp7xZ37W9f2eV0M89/cpPM4KGZ+VfI3Zt7rPSri9XnqXfOqISwU615t6v2DPD3hLAPSIbdK74pj6p6kxrXcb5Q2ipcYost7f2uOxe0WqRt2na5RPEEJAAAAAAAAAAAAAAAAAAAAAAAAAICB/QI89xHf9AjT5wAAAABJRU5ErkJggg==`
			break

		case 'social':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE3SURBVHgB7dSBScNQFIXhV3GAjJAR6gZ1gmaDphPYDVyhG7Qb2A2iE1gnsBtUJ4jnhhN8BEVEUwj8HxzS3N48uCHvpQRgitq2vVNelWfl3rVC2Wb16of+6N1mPY3/L3xfRS1NjV9E6wHmHrxU9srR9Y1ydm/tnsqJ+sL9O69Zes34r3atey6N6DqN501ZKk/K7Ww2O2mYuF/r9yEa4qvRpXIes/rJz+e6HuVFWSn7dAFXaQQaNIa7SZ/DNP22GIi+vv6ePX+MFzrojZd5VM7K/Jv1/t0oLyi2lS4PSnwRa6VUohYDrtyzcO3g+tLbqPR2qwfrxRqFr6FOU+bzo9e41g/fnyUb14tB/zZbY+fDusnW7u59BuXqNCUevPiq/pt+AAAAAAAAAAAAAAAAAAAAAAAAAAD+6gM/A09KXqlvfAAAAABJRU5ErkJggg==`
			break

		case 'webpage':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF+SURBVHgB7dTtUcJAEMbxwwbUDs4KxApIB6YD0wF0YDoAKyAdiBUEK8AOsAOwgrgnz87s8FGckdH/b2aHy2Yv95IcKQE4Z8MwtBbPatcWG7WzxdZirF+PPtzz60f16ZXbWMzDGCvlrkJuGmq9/+xorDr9NptEZbFTuxsOKm3WVvmiUX6sDfK6Rm3ftJk/U22v/brW8xrfAMVOfcrLWqtdxQ39rot0urd0mPTYfiYWrxaVRXl761B3aZEt4qRvFevRaPSu3N7apd9etZWe82Rxr5oH9Vlp/DufR5mKxsnpB5y8QTbJspAyuUapNh02qiz8JZRWyueQu7G4Lrnwtuf+RZrOYqrnl4X7V/GhKBYWvcVM11njTNK50FEon/myLECf/+CL9iMU6nM4VlfqW4cjlo/qlgo/dq1qcxivUX6Zzk1YSK3rvkS4H21DvevjQkO/shmbcL0ItV3o3+l+e/TcJv1n2qiT/4gBAAAAAAAAAAAAAAAAAAAAAAAAAH/fJ6huB3NZQWVPAAAAAElFTkSuQmCC`
			break

		case 'score':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEsSURBVHgB7dThTYNAGMbxwzgAI+AGOIEdoW7ABrhB2QA3aDdQJ6AblA1wg+IE5/uah3hWiV/KB5L/L3nS4ym9cBeuIQBYqxjjzjJYTpatusLSqffP4p/+NZljb8ktT+qmbMPa+ENbzpZSCzqp9wUdLBvL80X/kvSDNqPT7zeaz8eN5ajOk4eF3IbljBZ/8NrylmXZvd4Kz6Nd93bd27ic6Wt101zevWtOF5Pv+7CQm7AQW+jRPu4sH5Z2elNk1D2j7vvV63rajNYy6PqgrrA8KOtjG1L5kdHY35KoI+PHpFW/86Ok8ZD09cURq5SzOj9i+7BmWsgQvzXqy6T/+o+a6Sv1XTIetDlN/KkKa6WNyv/oi7n7AwAAAAAAAAAAAAAAAAAAAAAAAAAAV/YJIFeFjZEgJQ8AAAAASUVORK5CYII=`
			break

		case 'big_time':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFlSURBVHgB7dTRbcIwEMZxU/UdukG6ARuUDZoNyghsABuUDVA3KBNAJ2CElAlgg/QOfUYniz5AotKH/086xTk7vjiJkxKA/6xt24lFo9hYTJX387Hac53vcn+4viliZTHTMc89C+PflatU73xtMZ/Xmqd70yJa3fDC4qB8q76pbrhW+5Qvrp+F8WPNswlz78L4JtTz9lLjJqFurdwh1rrFY+rPxGJo8VHk3zw3GAw+fVHWfrY45k7Lby1/bvvRF1hOroVWF+oOlT+GnLe/1R6lDh5SfyqLJ4tXW0y8KW/nm19Z+NdQp+usLXy7nB520ecP/EWRQh3fcnt/Meme8jZQuwpbJR8X+h9UYVvUv82h83KLjbRdmlAjzzUt5op1N6mj3r4gLdDf2jZvFVla7NXnsb72rdp4/wK/fO4L3Ss9lLbIe91x13/Qn9FX0Ol/AAAAAAAAAAAAAAAAAAAAAAAAAADArX4A60ygGjhjv2YAAAAASUVORK5CYII=`
			break

		case 'lower_third_animated':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgB7ZTvUcJAEMUXxwIoISWkA88KxAoMFYgVSAdgBUAHsYLECqADQgXBCuLu3IuzYoAMw4wffL+ZN8nd7u3tn4AIIeSvaZpmpCrcOldtvTrOmM9aNXQx/NrsE2ihCoiVuRgzH9ts3sdyOsijwD1+b+721vAJcuUGZQeJpiioQYHhwD+BrXbFZNibueKmUOHiFS6GnW/kZ9Nr5xNQfIP4KZ41bAFxMjQnIN+6HdQ5buQCBoPBRlVi6d9bRirbW6me3P5elZ2YoNlT2E271mCF6uNB9Wg2W+PeDVxKy8vFSqDv2Oavmut7ZXlIDy5qUA+sKZZsLbGYdlrWgLFqoeqaoNnfJDb4VbV0tgC7Ucn5Au+g5Mg9vbh6gzDpVGIDEiSTtXadYK6Pd/h0YRN+xnvu9q3pOzwricUfw76WMVS63Ibu68ylB7fSn8T9H9jFyyN+E4k/uzGS+pT401g5nyn2fqHn9nqmlNhEQYxEYlH3VjDWWxRbyelcl6oPnLcv2gb2onG6zhFCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCH/ky+zbJBaZPCbcwAAAABJRU5ErkJggg==`
			break

		case 'icon_with_message':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH6SURBVHgB7ZThbcJADIVDJ8gGTSconYB0gmaDsgF0AsIE0AnCBsAEYQPYIN0gdIKrLb0rJhgof5AqvU+yLnnx2T7n7pKEEHIPQgiFWI3nTJ/FGozZFV2fx3jO9fsNeXXu0rz3EX8Ma4wVF2qYQNtqDSZeBT012sj4TqCd5OoWOowLg8Mci12YxnV169+ieP0WnEZoAXNH17khLgpxlRK2RUy1FPk3yDWHFcjfxxz7o0NsuFlnwJwc84ZeLvV/cArWQjOxstfrbWTUwNMzehb/oLAXqxIHLUCGgdgzikk7Ll9iBWK94z2SIm9m8jyKacyV1DKGpn4jsZ1or/DNEetT7M1oa/FZ4duLxjmT67RBSPaLBNqjIfvEJy52inHk+GhznpB44HzXBWhjdFuvk+MGxfkD1FPK8IFYle4M1KcL/RabxR2EmDvUnpuf2WLUHa2+MydXdlRBPGLYxq05m5NLOp4bzM/g4x0x3cKVo8e5tdn6tTlidce/MjUsjO8SWoE48Xgtw+EeKpErXgepyX+Sy22QSdKY89uHnhu9NXqDYxTvGq9BqXO0bINyk782DbIMnRrixW210q7H/KB4N81NzNp8t5TJNcJhS/5JvydeDd4PuBLjJn9CCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCH/lx+NQDLmx4NbOwAAAABJRU5ErkJggg==`
			break

		case 'credits':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF3SURBVHgB7dXtTcMwEMbxK+I7HaFMQDYgnYAyAWEENigTtEwAnQCYoGEC2CBlgnaD8FxzEVYEiA+WKNL/J50cO2cnfmlqBuA/adt2plgrGsW9YhxtTYTfKxWTpK3PLQd51WDM2aBPE23F8Jl2iGLSbp5M1q+ruPaJLBXbJLeK3CLKNsoq8sqk/yTqT4o6rn0DXhWLZKEqy+TY8pop6tFoNPeKXnSqwnez8Lra33yigz4nioli0zcor47+pYorxUu0e84mFmCb5O3i2e+K68jL4sjyGkfs+Yv6okTVd3+rcqm4TfqUinPrFmloZ7+gZ0xjTB9n/7OzTHIvUK0o4qj70X/0b0Lc2yhOrZt0OvEbTdB3/SEdyMdQcWFxen7iPzEfX2Ncqny2btGzyLpAceR9J/2F/bSMLTktuu8Lc6dY2OdJa+K7s+7zvKLC66vhwn1j5fnR78y6U3rY/uKfxD/iBgAAAAAAAAAAAAAAAAAAAAAAAADAFz4Ai4lYrXh4sfgAAAAASUVORK5CYII=`
			break

		case 'image_with_message':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH+SURBVHgB7ZTtUcMwDIZdjv9kA8IG3YAwAWUCsgHZgDIBYYKWCcoGYQO6QcoELRMYKX1NhZq7thz0+PE+dzo7sqwv2wmBEHJsYoytyFDkReTN6HOsVfi+FWnURuTxAP8F/JRG9whdDp9tEhOrRax7k0+ynYhkLs+Z8Z+J1NDrniH0W7H2KSCiiCbNoZ/ie4wk0jwVPO7x9ZWMa5DSGF0LXSquhl1hcqpwcG8Y1ffMHGY6uFJkiT2ZyX0uMkLOSzRtK5blNOxmIaIn9ipyiVEpdT4YDLpmyfxKZGUKVl0hos3RhF/E9tX5HiKpvCfuGfQLk8ctYtyIr4Xs/YB/9VGpDrZq9yByhzxr6DTHOWQq9ivxYWOtfBInYTdPKKRCku9m7QOjrultmJm1PKwbqpyjiD7fd5Bnt3aB/WnfFeyvRbobJAWOwroR2qQWNyfHHi12Dvvg8prAvnCxLsM+uCdW4gpGzKfmWS3xJDJc9brHV+uvrnliGcY2bp5semKlsc+NTYa4Izy1Ajb6xCbIscV8ZuI0Ef9JF/9brJ82qPvHYK1rEObjuKHB6XlfXVF9DcK8QTG+QV/Arvax4vqftHRN1qbV7oAq51f3VGbdkoffxjfgL+mLdUhRx8yVEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEELI/+ETmK8GbNsEzmMAAAAASUVORK5CYII=`
			break

		case 'video':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD0SURBVHgB7dRhDcIwEIbhBgVIqAQcMAmTMAdIwAIOwAE4GA6QUAngoNyFr6SUwL/92PI+yWXrUZrcpbcQAMxVznljkSzWWndal3y0GPXuz2O1N1UxKtfuj2HOvFiLu8Wg9akUll+iij2oebeqGW5QfqNcvdfPSmHuVFApOqnotkGDfu89qXe3q5rUKVdu2PuMMKFVmN7Fwkeqt2e0uP7Z+2jWncVW/3v82LsOc6cx85ty0frrBmkcz82IxeqMMq57rfeLGDGnMcvVKLUNKsbSlPwpKddX+1P5NqEx9XcHAAAAAAAAAAAAAAAAAAAAAAAAALA8T7fEe56O0g6nAAAAAElFTkSuQmCC`
			break

		case 'celebration':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHwSURBVHgB7ZXhUcJAEIUXx//agbEC6cBYgXQgdoAVECtQK0ArECsgVABUQKxArAD3yTvZYZwkzuioM++beXNkb/Nu77IJZkKI32a9XvdcE9fMdRNiy6ABNdq5N+bAIwvX8BsybxxiI9dh8EBswt+DHU+oS+8uc4bBqx/qnSVfrtdr2vt+UwI25MOj69pVulD8q4+Va+W6Yiqu+65sxyJjzpz5KXbGEX4PPh647piH9Z5dBTeBTeEQch/HzMGDWrjuuTa8Dnkgfa6J+248ViUP15BzB4zV0nhAXKzsdDoFLnyxM8ZzLpDxel7jgZyVbQ8VnDAO78p9jXNz5qXicUAlc3PWgfx3P78uWVda68L14PEx4zljU3r3PfZkLdlrmfdx0tgMFOZOqazm/iPm5CF2DDvcxy4F6Iol17vl63Bum06pbLPRrxK7JHX8yFp0D2hzQKVxEyg4fSM4h8O6pOo66I45RYjdugrbtr6x+PRqYDM9jiecz9gRdaBTzllvxnunadJruLdNJ3WtBY0HxBbGtwFP9oUFX3M6X28pPonljE1SIFgnv7mF1zNsYGB8vdJDsM3Davqw4uAX9Iee6BmBV2XfTfxn+euw2/9NvUIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIX6WN8P9YzuXYAzQAAAAAElFTkSuQmCC`
			break

		case 'animated_background':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHlSURBVHgB7ZTdUcNADIQVhnfcAe6AUAGmAtwBpgLcAUkFpINABYQKklQQU0FMBaEDoyXrQRgS54EHhtlvZsd3ku6k+/GZCSH+Ak3TrKDQL11PoT935a4JhfbalYWYGeJCv4gxbEdNmSfaymBDTU+utFPrPPgxR0L7bbDf2S9uTubaUBlto2ZLGRaHBT+wqIL+Of0p+2v7uunrEJNx8Q3bQ+ZZsZ9xHtgW7I9YVxLmbTdySF9BbXhw7XqKvrUf2WEUrpnr2ZUHe+W6QyE7xsE/ZPEjV22fi0jhc43bmMFgsOAYQ9tVMRzjU+qNtjVjRuznndxnrozxC7aXHj9jHedc014O3aAL1yuTXQc7+ljglIvoAv+jq+Qc4+CDrWKxGJtbfw1QusP/1uknQe0BbviduHBr762H3g3iL5W6Tl0nwfaBn8iExSU7psAp4X+vLdwg54p9bPiLfd34LrXnuaGqUFuCd4W5q86YZ96uJXPBn/PmFoxZWg/H1k/BZDcsKrXtaccTg2/102D8BngvbHuTjHPgRDHPpftrbvg8viMd8GY0bI9DXVCN/JinM2aKt9C2G1MyT+rt9g3E7/lg4jt7DkIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIcQ/5R2L87OAzMyCPAAAAABJRU5ErkJggg==`
			break

		case 'now_next_then':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIDSURBVHgB7ZXvTeNAEMU3iO+kg3MHlw5wB5er4JIKclSAr4ILFRgqSKggpgLcQUwFmArCPPwGDUuIBEJISO8njXZ3dvx2Zv/IKQkhvoLdbjc1uzUbc7w2+8v+wmzL+XP6arOK/cpsxX7J2PEhXdo2mPtcp6B/ksXB6pD3JpvbcM1NiFnSplnskmvGWOQ39fFx2CMUMDHDBpyZncDH4KXZb7PerDbfg7V3Zr/MKrNTs5KbgPhuNBr1h3Q519MHOo7PTWfG+Gv650HD83D+UW/FuJaxRVbbju2YGr7mjLn/t5zz/F5sUKL4zIKvg69EovbxGgPOldw0FFNw3LL9ycIiKAind5P5x6GQFptqMSi4ZvJLbnRj/icdGzdRAGPmABobd7h1aTjcGf0/qOd4fHeg7ieO9xQyZ4LxBtxnMSdMDH08wyYNm1LSzt7QXWWJgtOQZBvWxWbkse/FtYtsXfd3IT8/mHg701GuyJuCk57Q1aTh9As+oT9BGJuyYLtmH8+r3aMLnaugmxg7p/k3eEYXabgBVfo4vWuznlf+eButjxfhz/OZozfEcSs6fniZhsK2abhJ8PsNabzlaXfBt48qvTxJvH2n8h+AaWF9FLYIz+ezKMKadTaHNfv0UfxPJIQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQnw3HgHNJIea1n5GlwAAAABJRU5ErkJggg==`
			break

		case 'checklist':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG2SURBVHgB7ZThTQJBEIUHYwHXgVcCVKB0cFQgVgAdgBWIFYAVgBUcVABWwFqBWAHOy70zm4tBst4PQ96XvFxud/bN3tzOmgkh/iPH47Fwla69a+7K6rEoZkYVjKs15vyI71vXhGNj+EXzW3ojrtvIP//Jx5U38kEzS+DaEsAG/LF0PbseXU8ufHRw5VFohnA+oQHHg3vc+RObfuC6uY99Mi5njinmO53Oge9Zwztn0eDTZ24U+oW+yDFi3mAJJBXIKVw733h9EgbcMDaLvz1k3E1jYzmfgR6v7rGIPA6uIeNwEhc+v7LTBK67d21cfV+DscCiHvx9bYlcWQtgQ65dNHRL5Y3QeBwF/Yg8dvwwi+a79ntuFKfnerPqtJRoSWuJ1AKhGF20Ce+HZX0fWPXH0BY44ptozfc4/yhORsH7or5jpozFfI85xqc2grvIqnaHH05hbmcU9lySCsQPxN2DNsApyPh+ChSiZsrWwV2xp0ew6i6pcwR6TtgqoOT6MvJdu97pA63+0lKt08ZxbsujzdYSQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQghxWXwB7OMuc15ZyCMAAAAASUVORK5CYII=`
			break

		case 'qr':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFsSURBVHgB7dTRUcJAFIXhxfFd7AArUCuQEugAOhArMB0gFWgHxgoSK5AOQgfBCuK5eHdY0Dgy5iHO/N/MnZBzsyHZJBsCgP+iaZqRqlBVqkfb9zxmb6rFN+Puk/6kJZ95Nk+y5+Q/cs9jXYW+8Qt7UI394oskn3tex5v13sL7Ez/GDFtyG5/55MTftR9fqJ48txqGDpyGjthFaTNSZYPBYKP9tX5X8QnLRrXybcrGLTUm9/OsWvKpZ9tzKS+1LZXfahvfujO/huD9PzsJHbPJaWnZp1Wr3lV5ktuT3iTjSz/HXh6+Tmyax96F6sarE529QcHfDls3tD1XXarWutm1Muvfhc+nOz2YxFfLdEzpffssr1UvB/lYtVRt1xb/hKbei29drnNnoa98vaianbnnls18rahj7r24sDdp74c8S85fNbvFu2j2jUNf+c2N0on4xZjhMTkAAAAAAAAAAAAAAAAAAAAAAAAAAMf4ADranYWgCZjnAAAAAElFTkSuQmCC`
			break

		case 'map':
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgB7dRhTcRAEMXxKUFAJVQCEg4FHA7qAJwQFBAUgIMrCsAB56B10HtzeU1GwKVNmv8veWl3dvthN52NALAX8zwflH+lL7U31zqPe49fy5qTa7+5PvbKB5ROHrfe+FwO6FsZlzWu5Zqjv8+5Y6zkPrbxkJvVs6vFPDA9npRn5SsPrWmas6cnvQ+q5XsbK7mLbbwrL85nqeefMTlnpS9zeWCj54bYo9JirZ/Xu2dpMd81f8rHcu/4u6XFuljZJi2mVpm02UGvP6XcKQfl0a2UbTS6FdNU2g0AAAAAAAAAAAAAAAAAAAAAAAAAANzSBdGTyjOnDtskAAAAAElFTkSuQmCC`
			break

		default:
			// BLANK
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAmSURBVHgB7cABAQAAAIIg/69uSFAAAAAAAAAAAAAAAAAAAAAArwZBegAB2I2aJAAAAABJRU5ErkJggg==`
			break
	}

	return { png }
}

export const replaceWithDataSource = (text, dynamicText, keepBrakets = false) => {
	const array = text.split(/\[(.*?)\]/g)
	let array2
	const regEx = /\[(.*?)\]/g
	const match = text.match(regEx)

	if (!match) return text

	array2 = [...array]

	match.forEach((m, i) => {
		let m2 = m.replace('[', '')
		let m3 = m2.replace(']', '')

		const index = array.indexOf(m3)

		let returnString = dynamicText?.[m3]

		array2.splice(index, 1)
		array2.splice(index, 0, !keepBrakets ? returnString : `[${returnString || 'Not set'}]`)
	})

	return array2.join('')
}
