// ============================================================
// InterviewAI — Markdown Renderer
// ============================================================

export function renderMarkdown(text: string): string {
  let html = text;

  // Escape HTML entities first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (triple backtick)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const langClass = lang ? ` data-lang="${lang}"` : '';
    return `<pre class="code-block"${langClass}><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />');

  // Tables
  html = html.replace(
    /^\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm,
    (_match, header, body) => {
      const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean);
      const rows = body.trim().split('\n').map((row: string) =>
        row.split('|').map((c: string) => c.trim()).filter(Boolean)
      );

      let table = '<table class="md-table"><thead><tr>';
      headers.forEach((h: string) => { table += `<th>${h}</th>`; });
      table += '</tr></thead><tbody>';
      rows.forEach((row: string[]) => {
        table += '<tr>';
        row.forEach((cell: string) => { table += `<td>${cell}</td>`; });
        table += '</tr>';
      });
      table += '</tbody></table>';
      return table;
    }
  );

  // Unordered lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Paragraphs (double newline)
  html = html.replace(/\n\n/g, '</p><p>');

  // Single newlines to <br>
  html = html.replace(/\n/g, '<br />');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }

  return html;
}
