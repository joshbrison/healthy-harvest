// Shared Header Injection
export function injectHeader() {
    if (document.querySelector('.hh-header')) return;
    const style = document.createElement('style');
    style.textContent = `
        .hh-header { background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.04); position: sticky; top: 0; z-index: 1000; }
        .hh-header-shell { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
        .hh-header-logo { display: flex; align-items: center; gap: 10px; font-size: 1.4rem; font-weight: 700; color: #4CAF50; }
        .hh-header-nav ul { display: flex; gap: 24px; list-style: none; margin: 0; padding: 0; }
        .hh-header-nav a { color: #333; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .hh-header-nav a.active, .hh-header-nav a:hover { color: #4CAF50; }
        .hh-header-actions { display: flex; gap: 12px; }
        .hh-header-actions .btn { padding: 6px 18px; border-radius: 6px; border: 1px solid #4CAF50; background: #fff; color: #4CAF50; font-weight: 500; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .hh-header-actions .btn.btn-primary { background: #4CAF50; color: #fff; }
        .hh-header-actions .btn:hover { background: #4CAF50; color: #fff; }
    `;
    document.head.appendChild(style);
    const headerMarkup = `
        <div class="hh-header-shell">
            <div class="hh-header-logo">
                <span>🌱</span>
                <span>Healthy Harvest</span>
            </div>
            <nav class="hh-header-nav">
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="advice.html">Get Advice</a></li>
                    <li><a href="diagnose.html">Diagnose</a></li>
                    <li><a href="weather.html">Weather</a></li>
                    <li><a href="market.html">Market</a></li>
                </ul>
            </nav>
            <div class="hh-header-actions">
                <a href="login.html" class="btn">Login</a>
                <a href="login.html?register=true" class="btn btn-primary">Register</a>
            </div>
        </div>
    `;
    let header = document.querySelector('header');
    if (!header) {
        header = document.createElement('header');
        document.body.insertBefore(header, document.body.firstChild);
    }
    header.className = 'hh-header';
    header.innerHTML = headerMarkup;
    // Highlight active nav link
    const page = window.location.pathname.split('/').pop();
    document.querySelectorAll('.hh-header-nav a').forEach(link => {
        if (link.getAttribute('href') === page) {
            link.classList.add('active');
        }
    });
}
