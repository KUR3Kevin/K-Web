import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <h1 className="site-logo">
            <Link to="/">Tech Insights</Link>
          </h1>
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/news" className={isActive('/news') ? 'active' : ''}>
                  News
                </Link>
              </li>
              <li>
                <Link to="/blog" className={isActive('/blog') ? 'active' : ''}>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className={isActive('/about') ? 'active' : ''}>
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="donate-btn">Donate</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
