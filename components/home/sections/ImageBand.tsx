// Beat 4 — full-bleed editorial band, built to home-C.html + enhanced
// (scroll parallax + slow ken-burns per the approved motion vocabulary).
// REAL client photography — profile PDF p.1, tracked as img-cover-pills-lab
// in working/V/asset-manifest.yaml (status: produced, not a placeholder).
export default function ImageBand() {
  return (
    <div className="hc-band" data-band-parallax>
      <img
        src="/assets/imagery/cover-pills-lab.jpg"
        alt="Quality-assured pharmaceutical manufacturing and testing"
        loading="lazy"
      />
      <span className="hc-cap" data-reveal>
        Quality-assured manufacturing &amp; testing
        <small>
          From formulation to finished pack — tested for efficacy, safety and
          effectiveness.
        </small>
      </span>
    </div>
  );
}
