

function widthResizeCheckbox()
{
	var value = document.getElementById("widthResize").checked;
	document.getElementById("minWidth").disabled = !value;
	document.getElementById("maxWidth").disabled = !value;
}


function heightResizeCheckbox()
{
	var value = document.getElementById("heightResize").checked;
	document.getElementById("minHeight").disabled = !value;
	document.getElementById("maxHeight").disabled = !value;
}


function generateXML()
{
	location.hash = "";

	var xml = `<?xml version="1.0" encoding="utf-8" ?>
<widgetPackage xmlns="http://xmlns.sony.net/mylo/widget" version="1.0">
	<info>
		<packageName>${v("packageName")}</packageName>
		<author>${v("author")}</author>
		<abstract>${v("abstract")}</abstract>
		<version>${v("version")}</version>
		<locale>${v("locale")}</locale>
		<engine>${v("engine")}</engine>
		<updateURL>${v("updateURL")}</updateURL>
		<siteURL>${v("siteURL")}</siteURL>`;
		
	if(document.getElementById("widthResize").checked)
	{
		xml += `
		<minWidth>${v("minWidth")}</minWidth>
		<maxWidth>${v("maxWidth")}</maxWidth>`;
	}
	if(document.getElementById("heightResize").checked)
	{
		xml += `
		<minHeight>${v("minHeight")}</minHeight>
		<maxHeight>${v("maxHeight")}</maxHeight>`;
	}
	
	xml += `
		<defWidth>${v("defWidth")}</defWidth>
		<defHeight>${v("defHeight")}</defHeight>
		<createDate>${v("createDate")}</createDate>
	</info>
</widgetPackage>`;

	//enable download links
	document.getElementById("downloadlink").href = "data:attachment/text," + encodeURI(xml);
	
	//enable result previews
	document.getElementById("xmlpreview").innerHTML = escapeHTML(xml);
	document.getElementById("results").removeAttribute("hidden");
	
	//scroll browser to results section
	location.hash = "#results";
}


function v(id)
{
	return document.getElementById(id).value;
}

function escapeHTML(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }