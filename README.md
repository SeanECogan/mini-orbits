# mini-orbits
Build your own mini galaxy!

mini-orbits is a small library that lets you build your own miniature galaxy with questionable laws of physics. In mini-orbits, there
are three types of objects: repellers, attractors, and satellites. Repellers push satellites away from themselves, attractors pull
satellites towards themselves, and satellites are acted upon by repellers and attractors.

# How to Use
You will first need to add references to `mini-orbits.css`, `mini-orbits.js`, `attractor.js`, `repeller.js`, `satellite.js`, and 
`star.js`.

```
<link rel="stylesheet" href="styles/mini-orbits.css">

<script type="text/javascript" src="scripts/mini-orbits.js"></script>
<script type="text/javascript" src="scripts/objects/attractor.js"></script>
<script type="text/javascript" src="scripts/objects/repeller.js"></script>
<script type="text/javascript" src="scripts/objects/satellite.js"></script>
<script type="text/javascript" src="scripts/objects/star.js"></script>
```

Alternatively, you could bundle the JavaScript files and simply reference that bundled file. 

Regardless, once you have referenced the script and style files, you will need an HTML canvas element with an ID:

```
<canvas id="mini-orbits">
</canvas>
```

Then, you simply need to create a new instance of mini-objects that targets that canvas:

```
var simulation = new MiniOrbits("mini-orbits");
```

Once you initialize mini-orbits, you will see a blank galaxy ready for you to create in the canvas you specified! Instructions
on how to use mini-orbits itself will appear in the canvas, as well.

# Options
When initializing mini-orbits, you also have two options available to you through an optional options object:

```
var simulation = new MiniOrbits("mini-orbits", {
                          tickLength: 33,
                          twinkle: true
                      });
```           

**tickLength** - Expects an integer. Used to determine how many milliseconds are spent on each frame of the simulation. Typically,
a lower `tickLength` value results in a faster but less accurate simulation, while a higher `tickLength` will make things appear to 
move more slowly, but also more accurately.

**twinkle** - Expects a boolean. If true, the stars in the background of the canvas will twinkle randomly. If false, the stars will
remain a constant white color.
