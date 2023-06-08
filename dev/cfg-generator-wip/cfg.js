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
	
	var myloconfig = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\
<config xmlns=\"http://xmlns.sony.net/mylo/widget\" version=\"1.0\">\n\
</config>";

	//enable download links
	document.getElementById("downloadmyloconfig").href = "data:attachment/text," + encodeURI(myloconfig);
	
	//enable result previews
	document.getElementById("myloconfig").innerHTML = escapeHTML(myloconfig);
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