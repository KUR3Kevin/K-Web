import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
  return (
    <div>
      <Header />

      <main className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">Stay Ahead in Tech</h2>
            <p className="hero-subtitle">Curated news on AI, software, hardware, and the future of technology</p>
            <div className="hero-cta">
              <Link to="/news" className="btn btn-primary">Latest News</Link>
              <Link to="/blog" className="btn btn-secondary">Read the Blog</Link>
            </div>
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI & Machine Learning</h3>
              <p>Latest developments in ChatGPT, Claude, and cutting-edge AI technology</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Software Updates</h3>
              <p>Stay current with Windows, macOS, and essential software releases</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Hardware Innovation</h3>
              <p>NVIDIA GPUs, processors, and breakthrough tech hardware</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Tech Markets</h3>
              <p>Crypto trends, tech stocks, and industry valuations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Support Independent Tech Journalism</h2>
          <p>Help keep this site running and ad-free</p>
          <form action="https://www.paypal.com/donate" method="post" target="_blank">
            <input type="hidden" name="hosted_button_id" value="YOUR_PAYPAL_BUTTON_ID" />
            <input type="hidden" name="currency_code" value="USD" />
            <button type="submit" className="btn btn-donate">Donate via PayPal</button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
