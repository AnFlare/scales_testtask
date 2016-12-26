function TMain()
{
	
	// tasks
	// DONE 0. Make Reset button do its action
	// DONE AS OPTION 1. display weight on chumadan
	// DONE 2. add light (green/red) displaying weighting result
	// 3. optional - add arrow showing what direction is heavier
	// DONE 4. if weight is same = light green, if weight exists and not same - light red, if no weight on scales - light gray
	// DONE 5. fix offset of dragged chumadan
	
var main = this;
main.carriedChemodanID = "";
main.carriedChemodanOffset = [];
main.chumadans = [];
main.left_scale = {};
main.right_scale = {};
main.floorTop = 600,
main.gravityAccel = 0.3;

main.optionsDisplayWeighs = function() {
	if (document.getElementById("displayWeighs").checked) {
		for (var i = 0; i < main.chumadans.length; i++) {
			document.getElementById("bag"+i).innerHTML = main.chumadans[i].weight;
		}
	}
	else {
		for (var i = 0; i < main.chumadans.length; i++) {
			document.getElementById("bag"+i).innerHTML = "";
		}
	}
}

main.optionsDisplayArrow = function() {
	if ( document.getElementById("scaleArrow").checked ) document.getElementById("arrow").style.visibility = "initial" ;
	else document.getElementById("arrow").style.visibility = "hidden";
}

setIndicator = function(color) {
	document.getElementById("indicator").style.backgroundColor = color;
}

main.updateScale = function(whichScale, cheweight) {
	if (whichScale=="left") { main.left_scale.totalWeight += cheweight; }
	if (whichScale=="right") { main.right_scale.totalWeight += cheweight; }
	if (main.right_scale.totalWeight == 0 && main.left_scale.totalWeight == 0) { setIndicator("lightgrey"); }
	else if	(main.right_scale.totalWeight == main.left_scale.totalWeight) { setIndicator("limegreen"); }
	else { setIndicator("red"); }
}

main.init = function() {
	document.getElementById("Reset").addEventListener("click", main.init);
	document.getElementById("displayWeighs").addEventListener("click", main.optionsDisplayWeighs);
	document.getElementById("scaleArrow").addEventListener("click",main.optionsDisplayArrow);

	for (var i = 0 ; i < 12 ; i++) {
		var id = "bag"+i;
		var left = 360 + 30*i
		main.chumadans[i] = {
			"weight" : 10,
			"speed"  : 0,
			"id"     : id,
			"top"    : 400,
			"left"   : left,
			"width"  : 25,
			"height" : 35,
			"right"  : left + 25,
			"bottom" : 435,
		}
		document.getElementById(id).style.left = main.chumadans[i].left + "px";
		document.getElementById(id).style.top = main.chumadans[i].top + "px";
//		document.getElementById(id).innerHTML = main.chumadans[i].weight;
	}

	setIndicator("lightgrey");

	main.left_scale = {
		"id" : "left_scale",
		"left"  : 200,
		"right" : 450,
		"top"   : 300,
		"bottom": 335,
		"totalWeight" : 0
	}
	
	main.right_scale = {
		"id" : "right_scale",
		"left"  : 600,
		"right" : 850,
		"top"   : 300,
		"bottom": 335,
		"totalWeight" : 0
	}

//	console.log(main.chumadans, main.right_scale, main.left_scale)
}

main.init();
//console.log(main.left_scale, main.right_scale)

main.tick = function(){
	for (var i = 0 ; i < 12 ; i++) {
		var id = "bag"+i;
		var che = main.chumadans[i];
		che.speed += main.gravityAccel;
		che.bottom = che.top+che.height;
		che.right = che.left+che.width;
		
		if (che.bottom + che.speed >= main.floorTop) {
			che.top = main.floorTop - che.height;
			che.speed = 0;
//			console.log(che, main.left_scale, main.right_scale)
		}
		else if (che.bottom + che.speed >= main.left_scale.top && che.right > main.left_scale.left && che.left < main.left_scale.right && che.top < main.left_scale.bottom) {
			if (che.bottom < main.left_scale.top) {
				main.updateScale("left",che.weight);
				console.log("LEFT - " + main.left_scale.totalWeight);
			}
			che.top = main.left_scale.top - che.height;
			che.speed = 0;
		}
		else if (che.bottom + che.speed >= main.right_scale.top && che.right > main.right_scale.left && che.left < main.right_scale.right && che.top < main.right_scale.bottom) {
			if (che.bottom < main.right_scale.top) {
				main.updateScale("right",che.weight);
				console.log("RIGHT - " + main.right_scale.totalWeight);
			}
			che.top = main.right_scale.top - che.height;
			che.speed = 0;
		}
		else {
			che.top += che.speed;
		}
		document.getElementById(id).style.top = che.top + "px";
	}
}

setInterval(main.tick, 30);

/*OPTIONS*/



main.optionsDisplayWeighs();

/*
function getElementPixelProperty(id, propertyName) {
var stringProperty = document.getElementById(id).style[propertyName];
if (stringProperty == "" || stringProperty == undefined) {
console.log("empty!", id, propertyName)
}
return parseInt(stringProperty.substring(0, stringProperty.length - 2));
}
*/

// chumadan events

document.ondragstart = function(event) {
//	console.log("ondragstart", event);
//	console.log("chemodan", event.target.id);
	main.carriedChemodanID = event.target.id;

	var carriedChemodan;
	for (var i = 0; i < 12; i++) {
		if (main.chumadans[i].id == event.target.id) { carriedChemodan = main.chumadans[i]; }
	}

	carriedChemodanOffset = [event.clientX - carriedChemodan.left, event.clientY - carriedChemodan.top]

	if ( carriedChemodan.top + carriedChemodan.height == main.left_scale.top) {
		if ( carriedChemodan.right > main.left_scale.left && carriedChemodan.left < main.left_scale.right) {
			main.updateScale("left",-carriedChemodan.weight);
			console.log("LEFT - " + main.left_scale.totalWeight);
		}
	}

	if ( carriedChemodan.top + carriedChemodan.height == main.right_scale.top) {
		if ( carriedChemodan.right > main.right_scale.left && carriedChemodan.left < main.right_scale.right) {
			main.updateScale("right",-carriedChemodan.weight);
			console.log("RIGHT - " + main.right_scale.totalWeight);
		}
	}
}

document.ondragover = function(event) { event.preventDefault(); }

document.ondrop = function(event) {
//	console.log("ondrop", event);
	event.preventDefault();
	if (event.target.id == "left_scale" || event.target.id == "right_scale") {
		console.log("drop not allowed")
	}
	else {
		for (var i = 0 ; i < main.chumadans.length; i++) {
			if (main.carriedChemodanID == main.chumadans[i].id) {
				console.log(event, main.chumadans[i]);
				main.chumadans[i].left = event.clientX - carriedChemodanOffset[0];
				main.chumadans[i].top = event.clientY - carriedChemodanOffset[1];
			}
		}
		document.getElementById(main.carriedChemodanID).style.left = event.clientX - carriedChemodanOffset[0] + "px";
		document.getElementById(main.carriedChemodanID).style.top = event.clientY - carriedChemodanOffset[1] + "px";
		main.carriedChemodanID = "";
	}
}

}