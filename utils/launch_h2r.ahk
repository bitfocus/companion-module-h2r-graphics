#SingleInstance
; customise these variables
exe := "C:\<path stuff>\h2r-graphics-electron\H2R Graphics.exe"
window_title := "Output 1 - <Project Name>"
url := "http://localhost:4001/api/<Project ID>/output/1/open"

If !WinExist("ahk_exe H2R Graphics.exe") {
	Run exe
	WinWait "ahk_exe H2R Graphics.exe",, 30  ; Wait up to 30 seconds instead of fixed Sleep
}

If !WinExist(window_title) {
	whr := ComObject("WinHttp.WinHttpRequest.5.1")
	whr.Open("POST", url, false)  ; false = synchronous, simpler since you WaitForResponse anyway
	whr.SetRequestHeader("Content-Type", "application/json")
	whr.Send("{}")
	; No need for WaitForResponse with synchronous request
}

WinWait window_title,, 30  ; Add timeout so it doesn't hang forever
if !WinExist(window_title) {
	MsgBox "Output window failed to open"
	ExitApp
}

; Check if not fullscreen/maximized
WinGetPos &X, &Y, &W, &H, window_title
; Get the screen dimensions dynamically
If (W != A_ScreenWidth)
{
	WinActivate window_title
	Sleep 100
	Send "^f"
}

Sleep 1000
if WinExist("H2R Graphics")
	WinMinimize "H2R Graphics"

WinSetAlwaysOnTop true, window_title  ; Keep output on top of taskbar