/**
 * Tag Badge Component
 * Displays a tag as a badge with customizable colors.
 * Uses Tailwind CSS for styling.
 */

/**
 * Render a single tag badge
 * @param {{label: string, color: string}} tag - Tag object
 * @returns {string} HTML string for the tag badge
 */
function renderTagBadge(tag) {
  return `
    <span 
      class="inline-block px-2.5 py-1 mr-1 mb-1 rounded text-white text-xs font-medium"
      style="background-color: ${tag.color};"
    >
      ${tag.label}
    </span>
  `;
}

/** * Render multiple tag badges
 * @param {Array<{label: string, color: string}>} tags - Array of tag objects
 * @param {boolean} [showsNoTagsMessage=true] - Whether to show "no tags" message when tags array is empty
 * @returns {string} HTML string for the tag badges container
 */
function renderTagBadges(tags, showsNoTagsMessage = true) {
  if (!tags || tags.length === 0) {
    if (showsNoTagsMessage) {
      return '<div class="text-sm text-gray-500 italic">Sin etiquetas</div>';
    } else {
      return '<div></div>';
    }
  }

  const tagsHtml = tags.map(tag => renderTagBadge(tag)).join('');
  return `<div class="flex flex-wrap mt-2">${tagsHtml}</div>`;
}