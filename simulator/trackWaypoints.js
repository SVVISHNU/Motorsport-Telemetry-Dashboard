const TRACK_LENGTH = 5891; // meters

const SVG_WAYPOINTS = [
  { dist: 0,    x: 60,  y: 290 },
  { dist: 350,  x: 95,  y: 291 },
  { dist: 700,  x: 130, y: 290 },
  { dist: 950,  x: 160, y: 281 },
  { dist: 1150, x: 190, y: 270 },
  { dist: 1350, x: 208, y: 250 },
  { dist: 1550, x: 220, y: 230 },
  { dist: 1750, x: 195, y: 205 },
  { dist: 1950, x: 170, y: 190 },
  { dist: 2150, x: 140, y: 195 },
  { dist: 2350, x: 110, y: 200 },
  { dist: 2750, x: 150, y: 130 },
  { dist: 3150, x: 200, y: 80  },
  { dist: 3400, x: 250, y: 60  },
  { dist: 3600, x: 280, y: 53  },
  { dist: 3800, x: 310, y: 50  },
  { dist: 4050, x: 345, y: 65  },
  { dist: 4250, x: 370, y: 90  },
  { dist: 4600, x: 405, y: 160 },
  { dist: 4900, x: 420, y: 200 },
  { dist: 5150, x: 400, y: 235 },
  { dist: 5400, x: 340, y: 270 },
  { dist: 5650, x: 270, y: 283 },
  { dist: 5750, x: 200, y: 290 },
  { dist: 5891, x: 60,  y: 290 }
];

function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

function getTrackPosition(distance) {
  const n = SVG_WAYPOINTS.length;
  const normDist = ((distance % TRACK_LENGTH) + TRACK_LENGTH) % TRACK_LENGTH;

  for (let i = 0; i < n - 1; i++) {
    const w1 = SVG_WAYPOINTS[i];
    const w2 = SVG_WAYPOINTS[i + 1];
    if (normDist >= w1.dist && normDist <= w2.dist) {
      const t = (normDist - w1.dist) / (w2.dist - w1.dist);
      const p0 = SVG_WAYPOINTS[(i - 1 + n - 1) % (n - 1)];
      const p1 = w1, p2 = w2;
      const p3 = SVG_WAYPOINTS[(i + 2) % (n - 1)];
      return {
        x: parseFloat(catmullRom(p0.x, p1.x, p2.x, p3.x, t).toFixed(2)),
        y: parseFloat(catmullRom(p0.y, p1.y, p2.y, p3.y, t).toFixed(2))
      };
    }
  }
  return { x: SVG_WAYPOINTS[0].x, y: SVG_WAYPOINTS[0].y };
}

module.exports = {
  TRACK_LENGTH,
  SVG_WAYPOINTS,
  getTrackPosition
};
