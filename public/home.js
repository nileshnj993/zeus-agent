function f1() {
    if(document.getElementById("stickyNoteText").style.fontWeight == "bold")
        document.getElementById("stickyNoteText").style.fontWeight = "normal";
    else
        document.getElementById("stickyNoteText").style.fontWeight = "bold";
}

function f2() {
    if(document.getElementById("stickyNoteText").style.fontStyle == "italic")
        document.getElementById("stickyNoteText").style.fontStyle = "normal";
    else
        document.getElementById("stickyNoteText").style.fontStyle = "italic";
}

function f3() {
    if(document.getElementById("stickyNoteText").style.textDecoration == "underline")
        document.getElementById("stickyNoteText").style.textDecoration = "none";
    else
        document.getElementById("stickyNoteText").style.textDecoration = "underline";
}

function f4() {
	document.getElementById("stickyNoteText").style.textAlign = "left";
}

function f5() {
	document.getElementById("stickyNoteText").style.textAlign = "center";
}

function f6() {
	document.getElementById("stickyNoteText").style.textAlign = "right";
}

function f7() {
    if(document.getElementById("stickyNoteText").style.textTransform == "uppercase")
        document.getElementById("stickyNoteText").style.textTransform = "none";
    else
        document.getElementById("stickyNoteText").style.textTransform = "uppercase";
}

function f8() {
    if(document.getElementById("stickyNoteText").style.textTransform == "lowercase")
        document.getElementById("stickyNoteText").style.textTransform = "none";
    else
        document.getElementById("stickyNoteText").style.textTransform = "lowercase";
}

function f9() {
    if(document.getElementById("stickyNoteText").style.textTransform == "capitalize")
        document.getElementById("stickyNoteText").style.textTransform = "none";
    else
        document.getElementById("stickyNoteText").style.textTransform = "capitalize";
}

function f10() {
	document.getElementById("stickyNoteText").style.fontWeight = "normal";
	document.getElementById("stickyNoteText").style.textAlign = "left";
	document.getElementById("stickyNoteText").style.fontStyle = "normal";
	document.getElementById("stickyNoteText").style.textTransform = "capitalize";
	document.getElementById("stickyNoteText").style.textDecoration = "none";
	document.getElementById("stickyNoteText").value = " ";
}
