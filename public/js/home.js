function f1() {
	//function to make the text bold using DOM method
    if(document.getElementById("stickyNoteText").style.fontWeight == "bold"){
        document.getElementById("stickyNoteText").style.fontWeight = "normal";
    }
    else{
        document.getElementById("stickyNoteText").style.fontWeight = "bold";
    }
	
}

function f2() {
	//function to make the text italic using DOM method
    if(document.getElementById("stickyNoteText").style.fontStyle == "italic"){
        document.getElementById("stickyNoteText").style.fontStyle = "normal";
    }
    else{
        document.getElementById("stickyNoteText").style.fontStyle = "italic";
    }
	
}

function f3() {
	//function to make the text alignment left using DOM method
	document.getElementById("stickyNoteText").style.textAlign = "left";
}

function f4() {
	//function to make the text alignment center using DOM method
	document.getElementById("stickyNoteText").style.textAlign = "center";
}

function f5() {
	//function to make the text alignment right using DOM method
	document.getElementById("stickyNoteText").style.textAlign = "right";
}

function f6() {
	//function to make the text in Uppercase using DOM method
    if(document.getElementById("stickyNoteText").style.textTransform == "uppercase"){
        document.getElementById("stickyNoteText").style.textTransform = "none";
    }
    else{
        document.getElementById("stickyNoteText").style.textTransform = "uppercase";
    }
}

function f7() {
	//function to make the text in Lowercase using DOM method
    if(document.getElementById("stickyNoteText").style.textTransform == "lowercase"){
        document.getElementById("stickyNoteText").style.textTransform = "none";
    }
    else{
        document.getElementById("stickyNoteText").style.textTransform = "lowercase";
    }

}

function f8() {
	//function to make the text capitalize using DOM method
    if(document.getElementById("stickyNoteText").style.textDecoration == "underline"){
        document.getElementById("stickyNoteText").style.textDecoration = "none";
    }
    else{
        document.getElementById("stickyNoteText").style.textDecoration = "underline";
    }

}

function f9() {
	//function to make the text back to normal by removing all the methods applied
	//using DOM method
	document.getElementById("stickyNoteText").style.fontWeight = "normal";
	document.getElementById("stickyNoteText").style.textAlign = "left";
	document.getElementById("stickyNoteText").style.fontStyle = "normal";
	document.getElementById("stickyNoteText").style.textTransform = "capitalize";
	document.getElementById("stickyNoteText").value = " ";
}
