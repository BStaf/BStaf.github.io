import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { auth } from './auth';
import { fetchLatestPosts, ResponsePost } from './dataRepo';

function renderPosts(posts: ResponsePost[], container: HTMLElement) {
  container.innerHTML = '';
  for (const post of posts) {
    const card = document.createElement('div');
    card.className = 'card mb-4';

    const date = new Date(post.timestamp);
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const sanitized = post.response
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\\n/g, '<br />')
      .replace(/\\t/g, '&emsp;');

    card.innerHTML =
      '<div class="card-body">' +
        '<h5 class="card-title text-muted">' + formatted + '</h5>' +
        '<hr />' +
        '<div class="card-text">' + sanitized + '</div>' +
      '</div>';

    container.appendChild(card);
  }
}

async function initDashboard() {
  const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
  const postsDiv = document.getElementById('posts') as HTMLDivElement;

  if (!logoutBtn || !postsDiv) {
    throw new Error('Required DOM elements not found.');
  }

  const auth0 = await auth.getAuthClient();
  const isAuthenticated = await auth0.isAuthenticated();

  if (!isAuthenticated) {
    window.location.href = '/';
    return;
  }

  logoutBtn.addEventListener('click', () => auth.logout(auth0));

  try {
    const posts = await fetchLatestPosts(auth0);
    renderPosts(posts, postsDiv);
  } catch (e: any) {
    postsDiv.textContent = 'Error: ' + e.message;
  }
}

initDashboard();
