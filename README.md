# companion-module-h2r-graphics

See HELP.md and LICENSE

# Module Development

## Pushing changes for inclusion in the beta

1) Push all changes to the repo
2) Use `npm version major|minor|patch` to bump the version number
3) Use `git push --follow-tags` to push the new version number.
4) Reach out on the `#module-development` channel in Slack to get the new changes included in the next beta.

## Changelog

**v3.8.0**

- Fix: Added "Stretch" to Animated Lower Third action.
- Fix: Add Video and Audio elapsed timing back into the app.

**v3.7.0**

- New: Refresh Webpage graphic action.
- New: Use internal variable in `addVariableSelectRow` action.

**v3.6.0**

- New: Score variables added for each score level and a collective team score.
- New: Draw on screen presets added.
- Fix: List "Add row" and "Select row" now accept variables as the list number.

**v3.5.0**

- New: Use Companion variables when setting `text.x` values.
- New: Use Companion variables when adding rows to lists.
- New: Parse `[listX.rowY.cellZ]` variables and show them on Companion buttons.
- New: Use graphic `labels` on presets (option in settings).
- New: `Toggle Cue on/off` status change for graphics.

**v3.4.0**

- New: Social variables added.
- New: Clear Map pins action.
- Fix: PNG toggle in config now working as expected.

**v3.3.0**

- New: Show/Hide graphic (using Text or Variable).
- New: Autohotkey instructions added for automating and launching H2R Graphics.
- New: Preset updates for Big timers and Image Sequence graphics.
- Fix: Timer logic refactored.

**v3.2.0**

- New: New timer graphics added.
- New: Set transition override for any graphic.
- New: Set and show Speaker Timer message.
- Fix: Lower Third animated Line Two not working as expected.

**v3.1.1**

- Package.json cleanup
- Remove pkg from Github

**v3.1.0**

- Support for new Utility graphics
- Fix for crashing when user's project had no Dynamic Text

**v3.0.1**

- Cleanup and help.md improvements

**v3.0.0**

- Support for Companion v3.x
- Removal of H2R Graphics v1 support.

**v2.2.0**

- Now supporting `Text` and `List` variables.
- Added `Now next then`, `Map`, `Checklist` and `QR code icons`.
- Fix: Select List index when setting and adding to Varaible Lists.

**v2.1.0**

- Support for more graphic types.
- Rename "Two Line" to "Animated Lower Third".
- Hiding some error logs for failed feedbacks.

**v2.0.0**

- Completely re-written to allow for switching between H2R Graphics v1 and v2
