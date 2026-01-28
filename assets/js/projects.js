document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const username = 'Gael926';
  const url = `https://api.github.com/users/${username}/repos`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return response.json();
    })
    .then((repos) => {
      // Sort by updated_at desc
      repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      // Clear loading state
      container.innerHTML = '';

      repos.forEach((repo) => {
        // Skip forked repos if desired, or keep them. Let's keep them for now.
        const card = document.createElement('article');
        card.className = 'bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden';

        const description = repo.description
          ? `<p class="mt-3 text-sm text-gray-600 flex-1 line-clamp-3">${escapeHtml(repo.description)}</p>`
          : `<p class="mt-3 text-sm text-gray-400 italic flex-1" data-i18n="project_no_description">Pas de description disponible.</p>`;

        const languageBadge = repo.language
          ? `<span class="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">${escapeHtml(repo.language)}</span>`
          : '';

        card.innerHTML = `
          <div class="p-6 flex flex-col flex-1">
            <div class="flex justify-between items-start gap-4">
              <h2 class="text-xl font-bold text-gray-900 break-words leading-tight">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-colors">
                  ${escapeHtml(repo.name)}
                </a>
              </h2>
              <div class="flex-shrink-0">
                 ${languageBadge}
              </div>
            </div>
            ${description}
            <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-500" title="Stars">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 </svg>
                 <span class="font-medium">${repo.stargazers_count}</span>
              </div>
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group" data-i18n="project_view">
                Voir le projet
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });

      // Re-apply translations for the new elements if the function exists
      if (typeof applyTranslations === 'function') {
        applyTranslations(container);
      }
    })
    .catch((error) => {
      console.error('Error fetching repos:', error);
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
            <p class="text-red-500" data-i18n="projects_error">Impossible de charger les projets pour le moment.</p>
        </div>
      `;
      if (typeof applyTranslations === 'function') {
        applyTranslations(container);
      }
    });
});

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
