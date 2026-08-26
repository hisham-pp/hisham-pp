import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { techMap } from '@/lib/techs';

export async function GET(request: NextRequest) {
  try {
    const badgesDir = path.join(process.cwd(), 'public', 'badges');
    
    if (!fs.existsSync(badgesDir)) {
      return new NextResponse('Badges not found', { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const techsParam = searchParams.get('techs');

    let files: string[] = [];
    if (techsParam) {
      const requestedTechs = techsParam.split(',').map(t => t.trim().toLowerCase());
      files = requestedTechs
        .map(tech => techMap[tech])
        .filter(Boolean) as string[];
    } else {
      files = Object.values(techMap).sort();
    }

    if (files.length === 0) {
      return new NextResponse('No valid techs provided', { status: 400 });
    }
    
    let totalWidth = 0;
    const gap = 10;
    
    // First, calculate total width and prepare inner SVG tags
    const badgeElements = files.map(file => {
      const filePath = path.join(badgesDir, file);
      const svgContent = fs.readFileSync(filePath, 'utf8');
      
      // Extract width from the SVG tag (e.g. width="73")
      const widthMatch = svgContent.match(/<svg[^>]*width="([0-9.]+)"/);
      const badgeWidth = widthMatch ? parseFloat(widthMatch[1]) : 100;
      
      const cleanedSvgContent = svgContent.replace(/<\?xml.*?\?>/g, '').trim();

      return {
        svgContent: cleanedSvgContent,
        width: badgeWidth
      };
    });

    let currentX = 0;
    let stitchedSvgInner = '';

    // We render the list of badges twice to create a seamless infinite loop
    const allElements = [...badgeElements, ...badgeElements];

    allElements.forEach((badge, index) => {
      // Nested SVG element inherits x and y naturally
      stitchedSvgInner += `
        <g transform="translate(${currentX}, 0)">
          ${badge.svgContent}
        </g>
      `;
      currentX += badge.width + gap;
      
      // Keep track of the total width of just the first set for the animation
      if (index === badgeElements.length - 1) {
        totalWidth = currentX; 
      }
    });

    // The container width is essentially infinite, but we set it to the max we want to display.
    // GitHub typically caps image width at 800-900px on readmes.
    const viewBoxWidth = 850;
    const height = 24; // standard flat-square badge height is usually 20, we give it a bit of padding

    const wrapperSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${viewBoxWidth}" height="${height}" viewBox="0 0 ${viewBoxWidth} ${height}">
        <style>
          .marquee-content {
            animation: scroll 30s linear infinite;
          }
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${totalWidth}px); }
          }
          /* Pause animation on hover */
          svg:hover .marquee-content {
            animation-play-state: paused;
          }
        </style>
        
        <!-- Gradient masks to create fade out on edges -->
        <defs>
          <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="transparent" />
            <stop offset="5%" stop-color="white" />
            <stop offset="95%" stop-color="white" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
          <mask id="fadeMask">
            <rect x="0" y="0" width="${viewBoxWidth}" height="${height}" fill="url(#fade)" />
          </mask>
        </defs>

        <g mask="url(#fadeMask)">
          <g class="marquee-content">
            ${stitchedSvgInner}
          </g>
        </g>
      </svg>
    `;

    return new NextResponse(wrapperSvg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
      },
    });

  } catch (err) {
    console.error('Error generating tech-stack marquee:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
