module.exports = [
	// Move from hypen-case to camelCase
    function(context, config, actions) {
        var changed = false;

		for (var k in actions) {
			var action = actions[k];

			if (action.action == "lowerthirds-show") {
				action.action = "lowerthirdsShow";
				action.label = action.id + ":" + action.action;
				changed = true;
			} else if (action.action == "lowerthirds-hide") {
				action.action = "lowerthirdsHide";
				action.label = action.id + ":" + action.action;
				changed = true;
			} else if (action.action == "timer-customup") {
				action.action = "timerCustomUp";
				action.label = action.id + ":" + action.action;
				changed = true;
			} else if (action.action == "timer-customdown") {
				action.action = "timerCustomDown";
				action.label = action.id + ":" + action.action;
				changed = true;
			}
		}

		return changed;
    },
]