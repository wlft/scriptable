// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;

// universe_stats/uvstatsv1.js / github.com/wlft/scriptable
// intended as a small widget

const widget = new ListWidget();
const universe = 13058; // target universe ID here

async function fetch_data() {
    try {
        let url = `https://games.roblox.com/v1/games?universeIds=${universe}`;
        let req = new Request(url);
        return await req.loadJSON();
    } catch (error) {
        console.error("Error fetching data: ", error);
        return error;
    }
}

async function fetch_votes_data() {
    let api_url = `https://games.roblox.com/v1/games/votes?universeIds=${universe}`;
    let req = new Request(api_url);
    return await req.loadJSON();
}

async function display() {

    let data = await fetch_data();
    let votes_response = await fetch_votes_data();

    if (data && data.data && data.data.length > 0) {
        let game_data = data.data[0];

        let name = game_data.name;
        let players = game_data.playing.toLocaleString();
        let favorites = game_data.favoritedCount.toLocaleString();
        let visits = game_data.visits.toLocaleString();

        let name_label = widget.addText(name);
        name_label.textColor = Color.blue();
        name_label.font = Font.boldSystemFont(18);
        name_label.lineLimit = 3;

        let space = widget.addText("");
        space.font = Font.systemFont(6);

        let players_txt = `${players} CCU`;
        let visits_txt = `➤ ${visits}`;

        let players_label = widget.addText(players_txt);
        players_label.textColor = Color.white();
        players_label.font = Font.semiboldSystemFont(14); 
        players_label.lineLimit = 1;

        if (votes_response && votes_response.data && votes_response.data.length > 0) {
            let votes_data = votes_response.data[0];
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
        }


        let visits_label = widget.addText(visits_txt);
        visits_label.textColor = Color.white();
        visits_label.font = Font.semiboldSystemFont(14);
        visits_label.lineLimit = 1;

        const s = widget.addStack()
        const d = s.addDate(new Date())
        d.applyRelativeStyle()
        const suffix = s.addText("ago")
        d.textColor = Color.lightGray();
        d.font = Font.systemFont(8);
        suffix.textColor = Color.lightGray();
        suffix.font = Font.systemFont(8);

    } else {
        let error_label = widget.addText(`ERROR QUERYING ROBLOX API`);
        error_label.textColor = Color.red();
        error_label.font = Font.boldSystemFont(18);
    }

    let background_image = await get_highlighted_icon();
    widget.backgroundImage = background_image;
    
    let gradient = new LinearGradient();
gradient.locations = [0, 1];
gradient.colors = [
    new Color("#000000", 0.6),
    new Color("#000000", 0.4)
];
widget.backgroundGradient = gradient;

    widget.presentSmall();
    Script.setWidget(widget);
    Script.complete();
}

async function get_highlighted_icon() {
    let api_url = `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universe}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`;
    let req = new Request(api_url);
    let response = await req.loadJSON();

    if (response && response.data && response.data.length > 0) {
        let image_url = response.data[0].imageUrl;
        let image_data = await load_img(image_url);
        return image_data;
    } else {
        return await load_img("https://cdn.wolfite.net/bg/v2/WDWBG_11.png");
    }
}

async function load_img(image_url) {
    try {
        let img_req = new Request(image_url);
        return await img_req.loadImage();
    } catch (error) {
        console.error("error loading image:", error);
        return null;
    }
}

display();