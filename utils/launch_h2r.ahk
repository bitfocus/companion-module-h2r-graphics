#SingleInstance
; customise these variables
exe := "C:\<path stuff>\h2r-graphics-electron\H2R Graphics.exe"
window_title := "Output 1 - <Project Name>"
url := "http://localhost:4001/api/<Project ID>/output/1/open"

If !WinExist("ahk_exe H2R Graphics.exe") {
	Run exe
	Sleep 5000
}
If !WinExist(window_title) {
	whr := ComObject("WinHttp.WinHttpRequest.5.1")
	whr.Open("POST", url, true)
	whr.SetRequestHeader("Content-Type", "application/json")
	whr.Send("{}")
	whr.WaitForResponse()
}
	
WinWait window_title

; if the window is not maximized, maximize it
WinGetPos &X, &Y, &W, &H, window_title
If (W != 1920)
{
	WinActivate window_title
	Send "^f"
}

Sleep 1000

WinMinimize "H2R Graphics" ; just in case it pops up