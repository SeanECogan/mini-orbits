var MiniOrbits = function(id, options) {
    // ** Public Methods **
    this.addAttractor = addAttractor;

    this.addRepeller = addRepeller;
    
    this.addSatellite = addSatellite;

    // ** Private Member Initialization **
    var canvas = document.getElementById(id);

    var isHoveringCanvas = false;
    var canvasX = -1000;
    var canvasY = -1000;

    var currentMass = 5;

    var attractors = [];
    var repellers = [];
    var satellites = [];

    var stars = [];
    initializeStars();

    // Add event listeners.
    canvas.addEventListener("mousemove", handleCanvasMouseMove);
    canvas.addEventListener("mouseover", handleCanvasMouseOver);
    canvas.addEventListener("mouseleave", handleCanvasMouseLeave);
    canvas.addEventListener("wheel", handleCanvasMouseWheel);

    window.addEventListener("keyup", handleWindowKeyup);

    var resizeEvent;
    window.addEventListener("resize", handleResize);

    // Intialize optional parameters.
    var tickLength = 20;

    if (options.tickLength) {
        tickLength = options.tickLength;
    }

    var twinkle = false;

    if (options.twinkle) {
        twinkle = options.twinkle;
    }

    canvas.className += "mini-orbits";

    addInstructionsDiv();

    // Initialize simulation.
    setInterval(tick, tickLength);

    // ** Private Methods **
    function addAttractor(x, y, mass) {
        attractors.push(new Attractor(x, y, mass));
    }

    function addRepeller(x, y, mass) {
        repellers.push(new Repeller(x, y, mass));
    }

    function addSatellite(x, y, mass) {
        satellites.push(new Satellite(x, y, mass));
    }

    function addInstructionsDiv() {
        var top = canvas.top;
        var left = canvas.left;

        var instructionsDiv = document.createElement("div");
        instructionsDiv.id = "mini-orbits-instructions";
        instructionsDiv.top = top + 10;
        instructionsDiv.left = left + 10;

        var title = document.createElement("h3");
        title.innerText = "Mini Orbits";

        var author = document.createElement("h5");
        author.innerText = "By Sean Cogan";

        var controls = document.createElement("h3");
        controls.innerText = "Controls";

        var hKey = document.createElement("p");
        hKey.innerHTML = "<span class='controls-label'>H:</span> Toggle controls visibility";

        var addKeys = document.createElement("p");
        addKeys.innerHTML = "<span class='controls-label'>A/R/S:</span> Add attractor/repeller/satellite";

        var scroll = document.createElement("p");
        scroll.innerHTML = "<span class='controls-label'>Scroll up/down:</span> Increase/decrease mass";

        instructionsDiv.appendChild(title);
        instructionsDiv.appendChild(author);
        instructionsDiv.appendChild(controls);
        instructionsDiv.appendChild(hKey);
        instructionsDiv.appendChild(addKeys);
        instructionsDiv.appendChild(scroll);
        document.body.appendChild(instructionsDiv);
    }

    function initializeStars() {
        stars = [];

        var maxHeight = canvas.height;
        var maxWidth = canvas.width;

        var numStars = Math.floor((Math.random() * 1000) + 100);

        for (var i = 0; i < numStars; i++) {
            var starX = Math.floor((Math.random() * maxWidth) + 1);
            var starY = Math.floor((Math.random() * maxHeight) + 1);
            var starHeight = Math.floor((Math.random() * 3) + 1);
            var starWidth = Math.floor((Math.random() * 3) + 1);
            var starOpacity = Math.random();

            stars.push(new Star(starX, starY, starHeight, starWidth, starOpacity));
        }
    }

    function tick() {
        clearCanvas();

        drawPreview();

        for (var i = 0; i < stars.length; i++) {
            drawStar(stars[i]);
        }

        if (attractors) {
            for (var i = 0; i < attractors.length; i++) {
                drawAttractor(attractors[i]);
            }
        }

        if (repellers) {
            for (var i = 0; i < repellers.length; i++) {
                drawRepeller(repellers[i]);
            }
        }

        if (satellites) {
            for (var i = 0; i < satellites.length; i++) {
                updateSatellite(satellites[i]);
            }
        }
    }

    function clearCanvas() {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawStar(star) {
        var context = canvas.getContext("2d");

        if (twinkle) {
            if (Math.random() < 0.01) {
                star.opacity = Math.random();
            }
        }

        context.fillStyle = "rgba(255, 255, 255, " + star.opacity + ")";
        // center X, center Y, height, and width.
        context.fillRect(star.x, star.y, star.height, star.width);
    }

    function drawPreview() {
        var context = canvas.getContext("2d");

        context.strokeStyle = "white";
        context.lineWidth = 3; 

        context.beginPath();

        // center X, center Y, radius, start angle, end angle.
        context.arc(canvasX, canvasY, currentMass * 2, 0, 2*Math.PI);

        context.stroke();
    }

    function drawAttractor(attractor) {
        var context = canvas.getContext("2d");

        context.strokeStyle = "green";
        context.lineWidth = 3; 

        context.beginPath();

        // center X, center Y, radius, start angle, end angle.
        context.arc(attractor.x, attractor.y, attractor.mass * 2, 0, 2*Math.PI);

        context.stroke();
    }

    function drawRepeller(repeller) {
        var context = canvas.getContext("2d");

        context.strokeStyle = "red";
        context.lineWidth = 3; 

        context.beginPath();

        // center X, center Y, radius, start angle, end angle.
        context.arc(repeller.x, repeller.y, repeller.mass * 2, 0, 2*Math.PI);

        context.stroke();
    }

    function updateSatellite(satellite) {
        // First, update the speed based on the attractors and repellers.
        if (attractors) {
            for (var i = 0; i < attractors.length; i++) {
                var attractor = attractors[i];

                var deltaX = attractor.x - satellite.x;
                var deltaY = attractor.y - satellite.y;
                var angle = Math.atan2(deltaY, deltaX);

                satellite.xSpeed += (((attractor.mass * satellite.mass) * Math.cos(angle)) * (1 / satellite.mass));
                satellite.ySpeed += (((attractor.mass * satellite.mass) * Math.sin(angle)) * (1 / satellite.mass));
            }
        }

        if (repellers) {
            for (var i = 0; i < repellers.length; i++) {
                var repeller = repellers[i];

                var deltaX = repeller.x - satellite.x;
                var deltaY = repeller.y - satellite.y;
                var angle = Math.atan2(deltaY, deltaX);

                satellite.xSpeed -= (((repeller.mass * satellite.mass) * Math.cos(angle)) * (1 / satellite.mass));
                satellite.ySpeed -= (((repeller.mass * satellite.mass) * Math.sin(angle)) * (1 / satellite.mass));
            }
        }

        // Then, update the position based on the new speed.
        satellite.x += satellite.xSpeed;
        satellite.y += satellite.ySpeed;

        drawSatellite(satellite);
    }

    function drawSatellite(satellite) {
        var context = canvas.getContext("2d");

        context.strokeStyle = "blue";
        context.lineWidth = 3; 

        context.beginPath();

        // center X, center Y, radius, start angle, end angle.
        context.arc(satellite.x, satellite.y, satellite.mass * 2, 0, 2*Math.PI);

        context.stroke();
    }

    function toggleControls() {
        var controls = document.getElementById("mini-orbits-instructions");

        if (!controls.style.display) {
            controls.style.display = "block";
        }

        if (controls.style.display == "block") {
            controls.style.display = "none";
        } else {
            controls.style.display = "block";
        }
    }

    function handleCanvasMouseMove(e) {
        canvasX = e.offsetX == undefined ? e.layerX - canvasElement.offset.Top : e.offsetX;
        canvasY = e.offsetY == undefined ? e.layerY - canvasElement.offset.Left : e.offsetY;
    }

    function handleCanvasMouseOver(e) {
        isHoveringCanvas = true;

        canvasX = e.offsetX == undefined ? e.layerX - canvasElement.offset.Top : e.offsetX;
        canvasY = e.offsetY == undefined ? e.layerY - canvasElement.offset.Left : e.offsetY;
    }

    function handleCanvasMouseLeave(e) {
        isHoveringCanvas = false;
        canvasX = -1000;
        canvasY = -1000;
    }

    function handleCanvasMouseWheel(e) {
        if (e.deltaY < 0) {
            if (currentMass < 10) {
                currentMass += 0.25;
            }
        } else {
            if (currentMass > 2) {
                currentMass -= 0.25;
            }
        }
    }

    function handleWindowKeyup(e) {
        // We only want to process keypresses in the canvas.
        if (isHoveringCanvas) {
            // We also only want to process keys for A, R, and S.
            switch (e.keyCode) {
                // A - Attractor.
                case 65:
                    addAttractor(canvasX, canvasY, currentMass);
                    break;

                // R - Repeller.
                case 82:
                    addRepeller(canvasX, canvasY, currentMass);
                    break;

                // S - Satellite.
                case 83:
                    addSatellite(canvasX, canvasY, currentMass);
                    break;

                default:
                    break;
            }
        }

        if (e.keyCode == 72) {
            toggleControls();
        }
    }

    function handleResize() {
        if (resizeEvent) {
            clearTimeout(resizeEvent);
        }

        resizeEvent = setTimeout(initializeStars(), 100);
    }
}