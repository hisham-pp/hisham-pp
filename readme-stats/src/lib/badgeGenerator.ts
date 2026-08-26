export interface BadgeConfig {
  name: string;
  color: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  iconColor?: string;
  showText?: boolean;
  iconWidth?: number;
  iconHeight?: number;
  textWidth?: number;
}

export function generateBadge(config: BadgeConfig): string {
  const { 
    name, 
    color, 
    icon, 
    iconPosition = 'left',
    showText = true,
    iconWidth = 14,
    iconHeight = 14,
    textWidth: customTextWidth
  } = config;

  const avgCharWidth = 7.5; // Bumped slightly for better default spacing
  const textWidth = showText 
    ? (customTextWidth !== undefined ? customTextWidth : Math.round(name.length * avgCharWidth)) 
    : 0;
  const textLengthScaled = textWidth * 10;

  const hasIcon = !!icon;
  const actualIconWidth = hasIcon ? iconWidth : 0;
  const paddingLeft = hasIcon ? (showText ? 5 : Math.round(iconWidth * 0.3)) : 6;
  const gap = (hasIcon && showText) ? 4 : 0;
  const paddingRight = showText ? 6 : Math.round(iconWidth * 0.3);

  const totalWidth = paddingLeft + actualIconWidth + gap + textWidth + paddingRight;
  
  let iconMarkup = '';
  let textX = 0;

  if (hasIcon) {
    // The icon is assumed to be raw SVG XML content read from a file.
    // We wrap it in an svg tag to strictly control its width and height to fit the badge
    const renderedIcon = `<svg x="0" y="0" width="${iconWidth}" height="${iconHeight}">${icon}</svg>`;

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

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${name}">
  <title>${name}</title>
  <g shape-rendering="crispEdges">
    <rect width="${totalWidth}" height="20" fill="${color}" rx="3" />
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    ${iconMarkup}
    ${textMarkup}
  </g>
</svg>`;
}
