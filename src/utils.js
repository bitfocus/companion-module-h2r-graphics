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

		default:
			bgColour = [0, 0, 0]
			break
	}

	return { bgColour }
}
const graphicIcons = (graphic) => {
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

		default:
			// BLANK
			png = `iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAmSURBVHgB7cABAQAAAIIg/69uSFAAAAAAAAAAAAAAAAAAAAAArwZBegAB2I2aJAAAAABJRU5ErkJggg==`
			break
	}

	return { png }
}

module.exports = {
	graphicToReadableLabel,
	stringToMS,
	graphicColours,
	graphicIcons,
}
