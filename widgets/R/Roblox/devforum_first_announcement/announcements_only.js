// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-brown; icon-glyph: magic;

// devforum_first_announcement/anouncements_only.js // github.com/wlft/scriptable
// intended as a medium widget

let widget = new ListWidget();

async function fetch_latest() {
    let url = "https://devforum.roblox.com/c/updates/45.json";
    let req = new Request(url);
    let response = await req.loadJSON();

    if (response && response.topic_list && response.topic_list.topics && response.topic_list.topics.length > 1) {
        let topic = response.topic_list.topics[1];
        if (topic.pinned == true) { topic = response.topic_list.topics[2]; }; // (not lazy at all)
				if (topic.pinned == true) { topic = response.topic_list.topics[3]; };
        if (topic.pinned == true) { topic = response.topic_list.topics[4]; };

        return {
            title: topic.title,
            url: `https://devforum.roblox.com/t/${topic.slug}/${topic.id}`,
            views: topic.views,
            like_count: topic.like_count,
            posts_count: topic.posts_count,
            created_at: topic.created_at,
            // colour: topic.category_id == 62 ? '#FF0000' : topic.category_id ? "#00FF00" : "0000FF",
						category_id: topic.category_id
        };
    } else {
        return null;
    }
}

async function display() {
    let announcement = await fetch_latest();

    if (announcement) {
//         widget.addSpacer();
        let favicon_img = await load_img("https://doy2mn9upadnk.cloudfront.net/user_avatar/devforum.roblox.com/roblox/240/4100645_2.png");
        let favicon_widget = widget.addImage(favicon_img);
        favicon_widget.imageSize = new Size(36, 36);

        widget.addSpacer(5);
        
        let breadcrumb = widget.addText('Latest Announcement');
        
        if (announcement.category_id == 62) {
          breadcrumb.textColor = new Color("#01B757");
        } else if (announcement.category_id == 36) {
          breadcrumb.textColor = new Color("#E22219");
        } else if (announcement.category_id == 193) {
          breadcrumb.textColor = new Color("#FED602");
        } else if (announcement.category_id == 90) {
          breadcrumb.textColor = new Color("#7D26CC");
        } else {
	        breadcrumb.textColor = Color.gray();         
        }
        breadcrumb.font = Font.semiboldSystemFont(14);
        
        let text = widget.addText(announcement.title);
        text.url = announcement.url;
        text.textColor = Color.white();
        let text_size = 20;
        if (announcement.title.length >= 30){
            text_size = 14;
        }
        console.log(announcement.title.length);
        text.font = Font.semiboldSystemFont(text_size);
        text.lineLimit = 2;

		let details = widget.addText(`Views: ${announcement.views} | Likes: ${announcement.like_count} | Posts: ${announcement.posts_count}`);
        details.textColor = Color.white();
        details.font = Font.mediumSystemFont(12);
        details.textOpacity = 0.7;

        widget.backgroundColor = new Color("#101014");
        
        const s = widget.addStack()
        const d = s.addDate(new Date(announcement.created_at))
        d.applyRelativeStyle()
        const suffix = s.addText(" ago")
        d.textColor = Color.gray();
        d.font = Font.systemFont(8);
        suffix.textColor = Color.gray();
        suffix.font = Font.systemFont(8);

        widget.addSpacer();
		widget.presentMedium();
        Script.setWidget(widget);
        Script.complete();
    } else {
        console.error("Failed to fetch latest announcement.");
    }
}

display();

async function load_img(image_url) {
    try {
        let img_req = new Request(image_url);
        return await img_req.loadImage();
    } catch (error) {
        console.error("error loading image:", error);
        return null;
    }
}
