import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Tech Insights</h4>
            <p>Your trusted source for technology news and insights.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/news">Latest News</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/news?category=AI">AI</Link></li>
              <li><Link to="/news?category=Software">Software</Link></li>
              <li><Link to="/news?category=Hardware">Hardware</Link></li>
              <li><Link to="/news?category=Crypto/Stocks">Crypto/Stocks</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Tech Insights. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
