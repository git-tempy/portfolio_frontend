import About from './About';
import Education from './Education';
import Certificates from './Certificates';
import './AboutCertificates.css';

export default function AboutCertificates({ language, dbAbout }) {
  return (
    <section className="about-certificates-section" id="about-certificates">
      <div className="about-certificates-wrapper">
        <About language={language} dbAbout={dbAbout} />
        <Education language={language} />
        <Certificates language={language} />
      </div>
    </section>
  );
}
