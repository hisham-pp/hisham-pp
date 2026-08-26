import { techMap } from "@/lib/techs";

const techGroups = [
  {
    title: "Frontend",
    keys: "react,nextjs,angular,typescript,javascript,html5,css3,tailwindcss,mui,chakra,radix_ui,redux,redux_saga,zustand,react_hook_form,rtk_query,react_query,react_select,react_datepicker,apexcharts,vuejs,nuxtjs,three_js".split(",")
  },
  {
    title: "UI Tools",
    keys: "vitest,axios,lodash,next_auth,zod,yup,dayjs,date_fns,i18next,jspdf,react_quill,react_toastify,stylis_plugin_rtl,react_dropzone,monaco_editor,react_easy_crop,google_libphonenumber,dnd_kit,emotion_react,graphql".split(",")
  },
  {
    title: "Backend",
    keys: "nodejs,nestjs,python,django,flask,fastapi,fastify,rest_api,api_integration,webhooks,serverless,aws_lambda,soap,azure_functions,bcryptjs,express,passport,rxjs,jest,boto3,opentelemetry,bullmq,exceljs,pdfkit,pdfmake,xlsx,uuid,sanitize_html,multer,mongoose".split(",")
  },
  {
    title: "Databases",
    keys: "postgresql,mongodb,sqlite,dynamodb,supabase,prisma,typeorm,drizzle_orm,redis,mysql,firebase,mssql,s3,db".split(",")
  },
  {
    title: "Cloud & DevOps",
    keys: "gcp,netlify,cloudflare,railway,kubernetes,ansible,nginx,rabbitmq".split(",")
  },
  {
    title: "Tools & Development",
    keys: "git,github,gitlab,vscode,cursor,windsurf,kiro,claude_code,claude_desktop,codex,devin,gemini,gemini_cli,claude,chatgpt,ai_studio,antigravity,antigravity_cli,pnpm,npm,sonarqube,postman,linux,windows,wsl,eslint,prettier,lefthook,husky,figma,vim,neovim,dbeaver,storybook".split(",")
  },
  {
    title: "Build Tools, Auth & Package Managers",
    keys: "vite,webpack,esbuild,babel,turborepo,nx,yarn,pip,venv,auth0,jwt,expo".split(",")
  },
  {
    title: "AI & ML",
    keys: "pytorch,numpy,pandas,openai_sdk".split(",")
  },
  {
    title: "Testing",
    keys: "playwright,puppeteer".split(",")
  },
  {
    title: "Languages & Scripting",
    keys: "javascript,typescript,python,html5,css3,sql,json,yaml,xml,terraform,bash,zsh,powershell,markdown,c,cpp".split(",")
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-zinc-900 font-sans p-8 pt-16">
      <main className="flex w-full max-w-5xl flex-col items-center justify-center mb-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-zinc-100 mb-4">
            Tech Stack Marquee Combinations
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            These SVGs are generated entirely on the server via the <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">/api/tech-stack-marquee</code> endpoint. 
            When deployed to Vercel, you can use the absolute URL in your GitHub <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">README.md</code>.
            Use the <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">?techs=</code> query parameter to select specific technologies.
          </p>
        </div>

        <div className="w-full flex flex-col gap-12">
          {techGroups.map((group) => {
            const queryStr = group.keys.join(",");
            return (
              <section key={group.title} className="w-full bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl">
                <h2 className="text-xl font-semibold text-zinc-100 mb-6 border-b border-zinc-800 pb-2">
                  {group.title}
                </h2>
                
                {/* Marquee Preview */}
                <div className="w-full bg-[#0d1117] p-8 rounded-lg flex flex-col items-center justify-center overflow-hidden border border-zinc-800 mb-8">
                  <img src={`/api/tech-stack-marquee?techs=${queryStr}`} alt={`${group.title} Marquee`} className="max-w-full" />
                </div>
                
                {/* Available Technologies Grid for this Group */}
                <h3 className="text-sm font-medium text-zinc-400 mb-4">
                  Keys Available in this Group
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {group.keys.map((tech) => {
                    const filename = techMap[tech];
                    if (!filename) return null; // In case of a typo in the array
                    return (
                      <div key={tech} className="flex flex-col items-center justify-center p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                        <div className="h-8 flex items-center justify-center mb-2">
                          <img src={`/badges/${filename}`} alt={tech} className="max-h-full" />
                        </div>
                        <code className="text-[10px] text-zinc-400 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded truncate max-w-full">
                          {tech}
                        </code>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
