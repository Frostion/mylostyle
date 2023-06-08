loadRSS();
function loadRSS()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			//parse rss feed as an xml document
			var parser = new DOMParser();
			var xml = parser.parseFromString(this.responseText, "application/xml");
			
			//iterate through all rss feed items and generate a list of links
			var items = xml.querySelectorAll("item");
			var html = "";
			for(var i = 0; i < items.length; i++)
			{
				var item_title = items[i].querySelector("title").innerHTML;
				var item_link = items[i].querySelector("link").innerHTML;
				var item_date = new Date(items[i].querySelector("pubDate").innerHTML);
				var item_date_str = item_date.toLocaleDateString("default", { dateStyle: "medium" });
				
				html += "<li><a href=\"" + item_link + "\">" + item_date_str + "</a> :: " + item_title + "</li>";
			}
			document.getElementById("rss-feed").innerHTML = html;
		}
	}
	xhttp.open("GET", "rss.xml", true);
	xhttp.send();
}