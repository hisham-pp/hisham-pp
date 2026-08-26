import { techMap } from "@/lib/techs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-zinc-900 font-sans p-8 pt-16">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center p-8 bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl mb-12">
        <h1 className="text-2xl font-semibold text-zinc-100 mb-8">
          Tech Stack Marquee Preview
        </h1>
        
        {/* We use an img tag pointing to our API route to simulate exactly how GitHub will render it */}
        <div className="w-full bg-[#0d1117] p-8 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-800">
          <img src="/api/tech-stack-marquee?techs=react,nextjs,tailwindcss,typescript,nodejs,postgresql,docker" alt="Tech Stack Marquee" className="max-w-full" />
        </div>

        <p className="mt-8 text-sm text-zinc-400 max-w-lg text-center">
          This SVG is generated entirely on the server via the <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">/api/tech-stack-marquee</code> endpoint. 
          When deployed to Vercel, you can use the absolute URL in your GitHub <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">README.md</code>.
          <br />
          <br />
          Use the <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">?techs=</code> query parameter to select specific technologies!
        </p>
      </main>

      <section className="w-full max-w-4xl bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl">
        <h2 className="text-xl font-semibold text-zinc-100 mb-6">
          Available Technologies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(techMap).map(([tech, filename]) => (
            <div key={tech} className="flex flex-col items-center justify-center p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
              <div className="h-10 flex items-center justify-center mb-3">
                <img src={`/badges/${filename}`} alt={tech} className="max-h-full" />
              </div>
              <code className="text-xs text-zinc-400 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded">
                {tech}
              </code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
