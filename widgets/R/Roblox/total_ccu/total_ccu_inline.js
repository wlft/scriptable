// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: magic;

// universe_stats/uvstatsv1.js / github.com/wlft/roblox-ios-widgets
// intended as an inline accessory widget

const widget = new ListWidget();
const universes = [13058,18836269,211008];

async function fetch_universes_data() {
    try {
        let url = `https://games.roblox.com/v1/games?universeIds=${universes.join(',')}`;
        let req = new Request(url);
        return await req.loadJSON();
    } catch (error) {
        console.error('Error fetching data: ', error)
        return 'failed_to_fetch_data', error;
    };
};

let total_ccu = 0

let data = await fetch_universes_data();

if (data && data.data && data.data.length > 0) {
    for (let i = 0; i < data.data.length; i++) {
        total_ccu = total_ccu + data.data[i].playing;
    };
    
    let ccu_label = widget.addText(`${total_ccu} CCU`);
	ccu_label.textColor = Color.white();
	ccu_label.font = Font.semiboldSystemFont(14);
	ccu_label.lineLimit = 1;
} else {
    let err_label = widget.addText(`...`);
	err_label.textColor = Color.white();
	err_label.font = Font.semiboldSystemFont(14);
	err_label.lineLimit = 1;
};

widget.presentAccessoryInline();
Script.setWidget(widget);
Script.complete()