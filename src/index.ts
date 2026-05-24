import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';
import { auth } from './auth';
import { renderTradingViewWidget } from './tradingViewWidget';

async function initLanding() {
  const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
  const widgetContainer = document.getElementById('widget-container') as HTMLDivElement;

  if (!loginBtn || !widgetContainer) {
    throw new Error('Required DOM elements not found.');
  }

  renderTradingViewWidget(widgetContainer);

  const auth0 = await auth.getAuthClient();

  const isAuthenticated = await auth.runAuth(auth0);

  if (isAuthenticated) {
    window.location.href = '/dashboard.html';
    return;
  }

  loginBtn.addEventListener('click', () => auth.login(auth0));
}

initLanding();
