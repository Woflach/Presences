const presence = new Presence({
		clientId: "971311477514444800",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/g5Y299F.png",
			startTimestamp: browsingTimestamp,
		},
		search = document.querySelector<HTMLInputElement>(
			"body > div.pusher > div.site-nav.clearfix > div > header > nav > div.right.menu > div > div.ui.right.action.left.icon.input > input"
		),
		{ pathname, href } = document.location,
		[privacy, buttons] = await Promise.all([
			presence.getSetting<boolean>("privacy"),
			presence.getSetting<boolean>("buttons"),
		]);
	if (privacy) presenceData.details = "Browsing";
	else if (search.value) {
		presenceData.details = "Searching for";
		presenceData.state = search.value;
		presenceData.smallImageKey = "searching";
	} else if (pathname === "/") presenceData.details = "Homepathname";
	else if (pathname.includes("/server")) {
		presenceData.details = document
			.querySelector(
				"body > div.pusher > section > div.ui.stackable.grid > div.six.wide.column > table > thead > tr > th"
			)
			.textContent.trim();
		presenceData.state = document.querySelector(
			"[class='active item']"
		).textContent;
		presenceData.buttons = [
			{
				label: "View Server",
				url: href,
			},
		];
	} else if (pathname.includes("/cp")) {
		presenceData.buttons = [
			{
				label: "Open Control Panel",
				url: href,
			},
		];
		presenceData.details = "Control Panel";
		presenceData.state =
			document.querySelector("[class='active item']")?.textContent ??
			document.querySelector("[class=' active item']")?.textContent;
	} else if (pathname.includes("/partners")) {
		presenceData.buttons = [
			{
				label: "View Partners",
				url: href,
			},
		];
		presenceData.details = "Partners";
	} else if (pathname.includes("/sponsored")) {
		presenceData.buttons = [
			{
				label: "View Sponsored Servers",
				url: href,
			},
		];
		presenceData.details = "Sponsored";
	} else if (pathname.search(new RegExp(/Minecraft .* Servers/gm))) {
		presenceData.buttons = [
			{
				label: "View Category",
				url: href,
			},
		];
		presenceData.details = document.querySelector(
			"body > div.pusher > section > div.header-wrappy > h2 > span"
		).textContent;
	}
	if (!buttons) delete presenceData.buttons;
	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
