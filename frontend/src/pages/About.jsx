import Header from '../components/Header';
import Footer from '../components/Footer';

function About() {
  return (
    <div>
      <Header />

      <main className="about-page">
        <div className="container">
          <section className="about-hero">
            <div className="about-hero-content">
              <h2>About Tech Insights</h2>
              <p className="lead">Passionate about technology and sharing knowledge with fellow tech enthusiasts</p>
            </div>
          </section>

          <section className="about-content">
            <div className="about-grid">
              <div className="about-text">
                <h3>Technology That Serves Humanity</h3>
                <p>Welcome to Tech Insights, where I curate technology news through the lens of human values and moral responsibility. In a world where profit often drives innovation, I believe we need voices that prioritize ethics, sustainability, and the dignity of human life.</p>

                <p>This platform focuses on technology that empowers people, respects privacy, and promotes fairness. From open source solutions to sustainable hardware design, from ethical AI development to digital rights advocacy—every story here reflects a commitment to technology that serves humanity rather than exploiting it.</p>

                <p><strong>My Core Beliefs:</strong></p>
                <ul>
                  <li><strong>Morals Over Profit:</strong> True innovation prioritizes human welfare over financial gain</li>
                  <li><strong>Pro-Life Technology:</strong> Advancing technology that respects and enhances human life and dignity</li>
                  <li><strong>Privacy as a Right:</strong> Personal data should be protected, not harvested for corporate profit</li>
                  <li><strong>Sustainable Innovation:</strong> Building technology that considers environmental and social impact</li>
                  <li><strong>Open and Fair:</strong> Supporting transparent, accessible technology that empowers everyone</li>
                </ul>

                <p>In an industry often driven by hype cycles and quarterly earnings, Tech Insights offers a different perspective—one that asks not just "can we build this?" but "should we build this?" and "how can we build it responsibly?"</p>

                <p>Join me in exploring technology that truly makes the world better, not just more profitable.</p>
              </div>
            </div>
          </section>

          <section className="interests-section">
            <h3>My Tech Interests</h3>
            <div className="interests-grid">
              <div className="interest-card">
                <div className="interest-icon">🤖</div>
                <h4>Ethical AI Development</h4>
                <p>Supporting AI that enhances human capabilities while preserving human dignity. Advocating for transparent, accountable, and human-centered artificial intelligence.</p>
              </div>
              <div className="interest-card">
                <div className="interest-icon">🔒</div>
                <h4>Privacy & Digital Rights</h4>
                <p>Championing technologies that protect user privacy and promote digital freedom. Supporting encryption, decentralized systems, and data sovereignty.</p>
              </div>
              <div className="interest-card">
                <div className="interest-icon">🌱</div>
                <h4>Sustainable Technology</h4>
                <p>Promoting tech solutions that prioritize longevity, repairability, and environmental responsibility over planned obsolescence and waste.</p>
              </div>
              <div className="interest-card">
                <div className="interest-icon">💻</div>
                <h4>Open Source Solutions</h4>
                <p>Advocating for transparent, community-driven software that empowers users and promotes collaboration over corporate control.</p>
              </div>
              <div className="interest-card">
                <div className="interest-icon">🛡️</div>
                <h4>Security & Trust</h4>
                <p>Focusing on technologies that protect users from surveillance, manipulation, and exploitation while building genuine digital trust.</p>
              </div>
              <div className="interest-card">
                <div className="interest-icon">⚖️</div>
                <h4>Tech Ethics & Policy</h4>
                <p>Examining how technology policy can promote human flourishing, fairness, and justice rather than serving narrow corporate interests.</p>
              </div>
            </div>
          </section>

          <section className="focus-areas">
            <h3>What You'll Find Here</h3>
            <div className="focus-grid">
              <div className="focus-item">
                <h4>Ethical AI & ML Coverage</h4>
                <p>Responsible AI development, privacy-preserving machine learning, and human-centered artificial intelligence</p>
              </div>
              <div className="focus-item">
                <h4>Privacy-First Software</h4>
                <p>Open source alternatives, encrypted communications, and software that respects user rights</p>
              </div>
              <div className="focus-item">
                <h4>Sustainable Hardware</h4>
                <p>Repairable devices, modular technology, and hardware designed for longevity not obsolescence</p>
              </div>
              <div className="focus-item">
                <h4>Digital Rights & Policy</h4>
                <p>Legislation protecting privacy, right to repair movements, and policies that serve people over profit</p>
              </div>
              <div className="focus-item">
                <h4>Moral Technology Analysis</h4>
                <p>Blog posts examining how technology can serve human flourishing and promote justice</p>
              </div>
              <div className="focus-item">
                <h4>Community-Driven Innovation</h4>
                <p>Open source projects, decentralized platforms, and technology built by and for communities</p>
              </div>
            </div>
          </section>

          <section className="support-section">
            <h3>Support Ethical Tech Journalism</h3>
            <p>Tech Insights operates independently to bring you technology news that prioritizes human values over corporate interests. Your support helps keep this platform ad-free and focused on what matters most—technology that serves humanity.</p>
            <p>By supporting this project, you're investing in:</p>
            <ul>
              <li>Independent reporting free from corporate influence</li>
              <li>Coverage that prioritizes ethics and human dignity</li>
              <li>A platform that values truth over profit margins</li>
              <li>Technology analysis through a moral and sustainable lens</li>
            </ul>
            <form action="https://www.paypal.com/donate" method="post" target="_blank" className="donate-form">
              <input type="hidden" name="hosted_button_id" value="YOUR_PAYPAL_BUTTON_ID" />
              <input type="hidden" name="currency_code" value="USD" />
              <button type="submit" className="btn btn-donate">Support via PayPal</button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
