export class ComponentValidator {
  private static readonly ALLOWED_COMPONENTS = [
    'Button',
    'Card',
    'Input',
    'Table',
    'Modal',
    'Sidebar',
    'Navbar',
    'Chart',
    'div',
    'span',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'table',
    'thead',
    'tbody',
    'tr',
    'td',
    'th'
  ];

  static validate(code: string): boolean {
    const importRegex = /import\s+.*\s+from\s+['"][^'"]+['"]/g;
    const imports = code.match(importRegex) || [];
    
    imports.forEach(imp => {
      if (imp.includes('react')) return;
      if (imp.includes('./')) return;
      
      const isAllowed = this.ALLOWED_COMPONENTS.some(comp => 
        imp.includes(comp) || imp.includes(`./${comp}`)
      );
      
      if (!isAllowed) {
        throw new Error(`Prohibited import: ${imp}`);
      }
    });

    const inlineStyleRegex = /style=\s*\{\s*\{\s*[^}]+\}\s*\}/g;
    const inlineStyles = code.match(inlineStyleRegex);
    if (inlineStyles && inlineStyles.length > 0) {
      throw new Error('Inline styles prohibited - use Tailwind classes');
    }

    if (code.includes('const Styled') || 
        code.includes('styled(') ||
        code.includes('createComponent')) {
      throw new Error('Creating new components is prohibited');
    }

    return true;
  }
}