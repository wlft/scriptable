// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;

// universe_stats/uvstatsv2.js / github.com/wlft/scriptable
// intended as a small widget

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

async function fetch_universes_vote_data() {
    try {
        let api_url = `https://games.roblox.com/v1/games/votes?universeIds=${universes.join(',')}`;
        let req = new Request(api_url);
        return await req.loadJSON();
    } catch (error) {
        return 'failed_to_fetch_data', error
    };
};

async function display_error_widget() {
	let err_label = widget.addText('Error occurred when displaying widget');
    err_label.textColor = Color.red();
	err_label.font = Font.semiboldSystemFont(18);
    err_label.centerAlignText();
    
    
//     widget.backgroundColor = Color.red();
    widget.refreshAfterDate = new Date(new Date().getTime() + 3e5);

    widget.presentSmall();
    Script.setWidget(widget);
    Script.complete();
};

async function display() {
    let data = await fetch_universes_data();
    if (data == 'failed_to_fetch_data') { await display_error_widget(); return; };
    let votes_res = await fetch_universes_vote_data();

    if (data && data.data && data.data.length > 0) {
        let highest = data.data[0]
        let highest_i = 0

        for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].playing > highest.playing) {
                highest = data.data[i];
                highest_i = i;
            };
        };

        let name = highest.name;
        let players = highest.playing.toLocaleString();
        let favorites = highest.favoritedCount.toLocaleString();
        let visits = highest.visits.toLocaleString();

        let name_label = widget.addText(name);
        name_label.textColor = Color.green();
        name_label.font = Font.boldSystemFont(18);
        name_label.lineLimit = 3;
        
        let players_txt = `${players} CCU`;
        let visits_txt = `➤ ${visits}`;
        
        let space = widget.addText("");
        space.font = Font.systemFont(6);
        
        let players_label = widget.addText(players_txt);
        players_label.textColor = Color.white();
        players_label.font = Font.semiboldSystemFont(14); 
        players_label.lineLimit = 1;
        
        if (votes_res && votes_res.data.length > 0 && votes_res.data[highest_i]) {
            let votes_data = votes_res.data[highest_i];
            let up = votes_data.upVotes;
            let down = votes_data.downVotes;

			let rating = Math.round((up)/(up+down)*100);

            let favourites_label = widget.addText(`★ ${favorites} (${rating}%)`);
            favourites_label.textColor = Color.white();
            favourites_label.font = Font.semiboldSystemFont(14);
            favourites_label.lineLimit = 1;
        } else {
            let favourites_label = widget.addText(`★ ${favorites}`);
            favourites_label.textColor = Color.white();
            favourites_label.font = Font.semiboldSystemFont(14);
            favourites_label.lineLimit = 1;
        };
        
        let visits_label = widget.addText(visits_txt);
        visits_label.textColor = Color.white();
        visits_label.font = Font.semiboldSystemFont(14);
        visits_label.lineLimit = 1;

        const s = widget.addStack()
        const d = s.addDate(new Date())
        s.spacing = 2;
        d.applyRelativeStyle()
        const suffix = s.addText("ago")
        d.textColor = Color.lightGray();
        d.font = Font.systemFont(8);
        suffix.textColor = Color.lightGray();
        suffix.font = Font.systemFont(8);
        
        const bg_img  = await get_highlighted_icon(highest.id);
        widget.backgroundImage = bg_img;
    
	    let gradient = new LinearGradient();
		gradient.locations = [0, 1];
		gradient.colors = [
		    new Color("#000000", 0.6),
		    new Color("#000000", 0.4)
		];
		widget.backgroundGradient = gradient;
    } else {
        await display_error_widget();
        return;
    };

	widget.refreshAfterDate = new Date(new Date().getTime() + 9e5);
    widget.presentSmall();
    Script.setWidget(widget);
    Script.complete();
};

async function get_highlighted_icon(universe_id) {
    let api_url = `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universe_id}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`;
    let req = new Request(api_url);
    let res = await req.loadJSON();

    if (res && res.data && res.data.length > 0) {
        let image_url = res.data[0].imageUrl;
        let image_data = await load_img(image_url);
        return image_data;
    } else {
        return await load_img("https://cdn.wolfite.net/bg/v2/WDWBG_11.png");
    };
};

async function load_img(image_url) {
    try {
        let img_req = new Request(image_url);
        return await img_req.loadImage();
    } catch (error) {
        console.error("error loading image:", error);
        return null;
    };
};

await display();