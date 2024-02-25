# Useful Utilities

## Automated H2R Launching on Windows

If you want to automate launching H2R on Windows the [launch_h2r.ahk](/utils/launch_h2r.ahk) script will help.

- Download AutoHotkey v2 from <https://www.autohotkey.com/download/ahk-v2.exe>
- install it
- Copy `launch_h2r.ahk` somewhere that Bitfocus Companion can find it
- Edit `launch_h2r.ahk` to customise paths and window titles at the top:

```autohotkey
exe := "C:\<path stuff>\h2r-graphics-electron\H2R Graphics.exe"
window_title := "Output 1 - <Project Name>"
url := "http://localhost:4001/api/<Project ID, like ABCDS>/output/1/open"
```

If you now double click `launch_h2r.ahk` in your Windows Explorer, it should launch H2R (if needed), open an output window (if needed) and maximise it full screen.

If you want to automate this in Companion

- create a button
- add the steps shown below

![Companion Action Steps](/utils/companion%20steps.png)

> [!IMPORTANT]
> For the "Path" you want something like:
> `"C:\Program Files\AutoHotkey\v2\AutoHotkey.exe" "<path>\scripts\launch_h2r.ahk"`
>
> You will need the quotes and spaces exactly as shown.

If you now press the button, H2R should launch, and open the output window full screen ready for you to use in your video switcher.
