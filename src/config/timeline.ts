/* The scroll story is one timeline measured in viewport heights scrolled (100 = one screen).
   Every phase is a [start, end] pair, so pacing is tuned by editing numbers here.

     50-330    the hit ball flies at the viewer and fills the screen
     350-430   project 1 is revealed on the ball colour
     480-585   project 1 fades; the ball zooms back out
     585-690   the ball drops and bounces off the right edge (dust at each landing)
     690-770   project 2 is revealed (hold to 800)
     800-940   project 2 takes three cartoon hops up and back (dust at each landing)
     940-1010  project 3 whips in from the right on a spring (hold to 1045)
     1045-1068 a ball flies in from the right and smacks project 3 out to the left
     1068-1148 the ball drops and bounces three times to centre
     1148-1228 the camera zooms into the ball until it fills the screen
     1228-1300 project 4 is revealed on it (hold to 1335)
     1335-1415 project 4 fades; the camera zooms out to the ball hanging in mid-air
     1430-1456 a racket swings up from the bottom right and hits it (impact at 1444)
     1444-1490 the ball flies off to the upper right
     1490-1555 project 5 is revealed (hold to 1585)
     1585-1670 a shower of balls knocks project 5 down out of the viewport
     1668-1708 project 6 drops in from above and settles (hold to 1735)
     1735-1801 a racket smashes project 6 three times; the third sends it out the bottom
     1796-1858 a ball rolls across the floor and the closing words appear behind it
   The page ends at STAGE_HEIGHT (in vh); the stage's CSS height must match it. */

export const T = {heroOut:[0,45],roll:[50,330],fillIn:[325,350],reveal1:[350,430],out1:[480,505],fillOut:[505,525],zoomOut:[505,585],bounce:[585,690],reveal2:[690,770],away:[800,940],slide:[940,1010],fly:[1045,1068],knock:[1068,1100],bounce2:[1068,1148],zoom2:[1148,1218],fillIn2:[1205,1228],reveal4:[1228,1300],out4:[1335,1355],fillOut2:[1355,1375],zoomOut2:[1350,1415],swing:[1430,1456],hit:1444,flight:[1444,1490],reveal5:[1490,1555],rain:[1585,1670],drop6:[1668,1708],reveal7:[1802,1852],roll7:[1796,1858]};

/** Scroll position (in vh) where each project is fully readable, for jump links. */
export const HOLD: Record<string, number> = {
  triton: 455, qre: 780, remindly: 1030, sightread: 1315, interim: 1570, pintos: 1722,
  a1: 455, a2: 780, a3: 1030, a4: 1315, a5: 1570, a6: 1722,
};
