export interface BadgeConfig {
  name: string;
  color: string;
  textColor?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  iconColor?: string;
  showText?: boolean;
  iconWidth?: number;
  iconHeight?: number;
  textWidth?: number;
  defs?: string; // Optional custom SVG defs (e.g. for gradients)
}

export function generateBadge(config: BadgeConfig): string {
  const { 
    name, 
    color, 
    textColor = '#fff',
    icon, 
    iconPosition = 'left',
    showText = true,
    iconWidth = 14,
    iconHeight = 14,
    textWidth: customTextWidth,
    defs = ''
  } = config;

  const avgCharWidth = 7.5; // Bumped slightly for better default spacing
  const textWidth = showText 
    ? (customTextWidth !== undefined ? customTextWidth : Math.round(name.length * avgCharWidth)) 
    : 0;
  const textLengthScaled = textWidth * 10;

  const hasIcon = !!icon;
  const actualIconWidth = hasIcon ? iconWidth : 0;
  const paddingLeft = 6;
  const paddingRight = 6;
  const gap = showText && hasIcon ? 4 : 0;

  const totalWidth = paddingLeft + actualIconWidth + gap + textWidth + paddingRight;

  let iconMarkup = '';
  let textX = 0;

  if (hasIcon) {
    let renderedIcon = '';
    const trimmedIcon = icon.trim();
    if (trimmedIcon.startsWith('<svg')) {
      renderedIcon = trimmedIcon.replace(
        /^<svg[^>]*>/i, 
        (match) => {
          let newTag = match.replace(/\s+(x|y|width|height)="[^"]*"/gi, '');
          if (config.iconColor) {
            // Only strip and replace fill if we explicitly want to override it
            newTag = newTag.replace(/\s+fill="[^"]*"/gi, '');
            return newTag.replace('<svg', `<svg x="0" y="0" width="${iconWidth}" height="${iconHeight}" fill="${config.iconColor}"`);
          } else {
            return newTag.replace('<svg', `<svg x="0" y="0" width="${iconWidth}" height="${iconHeight}"`);
          }
        }
      );
    } else {
      renderedIcon = `<svg x="0" y="0" width="${iconWidth}" height="${iconHeight}">${icon}</svg>`;
    }

    if (iconPosition === 'left' || !showText) {
      const iconX = paddingLeft;
      const iconY = (20 - iconHeight) / 2;
      iconMarkup = `<g transform="translate(${iconX}, ${iconY})">${renderedIcon}</g>`;
      
      const textStartX = paddingLeft + actualIconWidth + gap;
      const textCenterX = textStartX + (textWidth / 2);
      textX = textCenterX * 10;
    } else {
      const textStartX = paddingLeft;
      const textCenterX = textStartX + (textWidth / 2);
      textX = textCenterX * 10;
      
      const iconX = textStartX + textWidth + gap;
      const iconY = (20 - iconHeight) / 2;
      iconMarkup = `<g transform="translate(${iconX}, ${iconY})">${renderedIcon}</g>`;
    }
  } else {
    const textCenterX = totalWidth / 2;
    textX = textCenterX * 10;
  }

  const textMarkup = showText 
    ? `<text x="${textX}" y="140" transform="scale(.1)" textLength="${textLengthScaled}" font-weight="bold">${name}</text>`
    : '';

  const defsMarkup = defs ? `<defs>${defs}</defs>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${name}">
  <title>${name}</title>
  ${defsMarkup}
  <rect width="${totalWidth}" height="20" fill="${color}" rx="3" />
  <g fill="${textColor}" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    ${iconMarkup}
    ${textMarkup}
  </g>
</svg>`;
}
