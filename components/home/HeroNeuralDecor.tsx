/** Lightweight SVG constellation — hero-only, no 3D libs */
export default function HeroNeuralDecor() {
  return (
    <>
      <svg
        className="hero-neural-svg"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="hero-neural-lines" strokeWidth="1">
          <line x1="80" y1="120" x2="220" y2="90" stroke="rgba(251,191,36,0.28)" />
          <line x1="220" y1="90" x2="340" y2="160" stroke="rgba(255,80,80,0.22)" />
          <line x1="340" y1="160" x2="280" y2="280" stroke="rgba(251,191,36,0.2)" />
          <line x1="280" y1="280" x2="140" y2="240" stroke="rgba(255,120,100,0.18)" />
          <line x1="140" y1="240" x2="80" y2="120" stroke="rgba(251,191,36,0.16)" />

          <line x1="900" y1="100" x2="1040" y2="140" stroke="rgba(251,191,36,0.26)" />
          <line x1="1040" y1="140" x2="1120" y2="60" stroke="rgba(255,80,80,0.2)" />
          <line x1="1040" y1="140" x2="1080" y2="260" stroke="rgba(251,191,36,0.18)" />
          <line x1="1080" y1="260" x2="960" y2="220" stroke="rgba(255,120,100,0.16)" />
          <line x1="960" y1="220" x2="900" y2="100" stroke="rgba(251,191,36,0.14)" />

          <line x1="480" y1="80" x2="620" y2="50" stroke="rgba(251,191,36,0.14)" />
          <line x1="620" y1="50" x2="720" y2="110" stroke="rgba(255,80,80,0.12)" />
          <line x1="200" y1="400" x2="320" y2="360" stroke="rgba(251,191,36,0.12)" />
          <line x1="980" y1="380" x2="1100" y2="420" stroke="rgba(255,80,80,0.12)" />
          <line x1="60" y1="500" x2="160" y2="560" stroke="rgba(251,191,36,0.1)" />
          <line x1="1050" y1="520" x2="1150" y2="480" stroke="rgba(255,120,100,0.1)" />
        </g>

        <g className="hero-neural-nodes">
          <circle className="neural-node neural-node-a" cx="80" cy="120" r="2.5" fill="rgba(251,191,36,0.85)" />
          <circle className="neural-node neural-node-b" cx="220" cy="90" r="3" fill="rgba(255,200,120,0.9)" />
          <circle className="neural-node neural-node-c" cx="340" cy="160" r="2" fill="rgba(255,100,100,0.75)" />
          <circle className="neural-node neural-node-a" cx="280" cy="280" r="2.5" fill="rgba(251,191,36,0.7)" />
          <circle className="neural-node neural-node-b" cx="140" cy="240" r="2" fill="rgba(255,150,100,0.65)" />

          <circle className="neural-node neural-node-c" cx="900" cy="100" r="2.5" fill="rgba(251,191,36,0.8)" />
          <circle className="neural-node neural-node-a" cx="1040" cy="140" r="3.5" fill="rgba(255,210,130,0.95)" />
          <circle className="neural-node neural-node-b" cx="1120" cy="60" r="2" fill="rgba(255,100,100,0.7)" />
          <circle className="neural-node neural-node-c" cx="1080" cy="260" r="2.5" fill="rgba(251,191,36,0.75)" />
          <circle className="neural-node neural-node-a" cx="960" cy="220" r="2" fill="rgba(255,150,100,0.6)" />

          <circle className="neural-node neural-node-b" cx="480" cy="80" r="1.5" fill="rgba(251,191,36,0.5)" />
          <circle className="neural-node neural-node-c" cx="620" cy="50" r="2" fill="rgba(255,200,120,0.55)" />
          <circle className="neural-node neural-node-a" cx="720" cy="110" r="1.5" fill="rgba(255,100,100,0.45)" />
          <circle className="neural-node neural-node-b" cx="200" cy="400" r="2" fill="rgba(251,191,36,0.4)" />
          <circle className="neural-node neural-node-c" cx="1100" cy="420" r="2" fill="rgba(255,150,100,0.4)" />
        </g>
      </svg>

      <div className="hero-orbs" aria-hidden>
        <span className="hero-orb hero-orb--1" />
        <span className="hero-orb hero-orb--2" />
        <span className="hero-orb hero-orb--3" />
        <span className="hero-orb hero-orb--4" />
      </div>
    </>
  );
}
