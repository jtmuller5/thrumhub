export default function InstallPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Installation */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-3">
          Install <span className="text-teal-400">Thrum</span>
        </h1>
        <p className="text-slate-400 mb-6">
          The Thrum CLI lets you manage HEARTBEAT snippets from your terminal.
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <code className="font-mono text-sm text-teal-400">
            npm install -g thrumhub
          </code>
        </div>
        <p className="text-slate-500 text-sm mt-3">
          Once installed, the CLI command is{" "}
          <code className="text-teal-400 font-mono">thrum</code>.
        </p>
      </section>

      {/* Quick Start */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className="flex-none w-7 h-7 rounded-full bg-teal-500/10 text-teal-400 font-bold text-sm flex items-center justify-center border border-teal-500/20">
              1
            </span>
            <div>
              <p className="text-slate-200 mb-2">
                Initialize your HEARTBEAT.md file
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                <code className="font-mono text-sm text-slate-300">
                  thrum init
                </code>
              </div>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-none w-7 h-7 rounded-full bg-teal-500/10 text-teal-400 font-bold text-sm flex items-center justify-center border border-teal-500/20">
              2
            </span>
            <div>
              <p className="text-slate-200 mb-2">
                Find a snippet from the registry
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                <code className="font-mono text-sm text-slate-300">
                  thrum search weather
                </code>
              </div>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-none w-7 h-7 rounded-full bg-teal-500/10 text-teal-400 font-bold text-sm flex items-center justify-center border border-teal-500/20">
              3
            </span>
            <div>
              <p className="text-slate-200 mb-2">
                Add the snippet to your HEARTBEAT
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                <code className="font-mono text-sm text-slate-300">
                  thrum add &lt;snippet-id&gt;
                </code>
              </div>
            </div>
          </li>
        </ol>
      </section>

      {/* Commands Reference */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Commands</h2>
        <div className="space-y-8">
          <Command
            name="thrum init"
            description="Initialize a HEARTBEAT.md file in the current directory with thrum-zone markers. This sets up the file structure that Thrum uses to manage your snippets."
            usage="thrum init"
          />
          <Command
            name="thrum search"
            description="Search the ThrumHub registry for snippets. Filter results by category or frequency."
            usage={`thrum search <query>\nthrum search weather -c utilities\nthrum search backup -f daily`}
          />
          <Command
            name="thrum add"
            description="Install a snippet from the registry into your HEARTBEAT.md. If the snippet has variables, you'll be prompted to fill them in."
            usage="thrum add <snippet-id>"
          />
          <Command
            name="thrum remove"
            description="Remove an installed snippet from your HEARTBEAT.md."
            usage="thrum remove <snippet-id>"
          />
          <Command
            name="thrum list"
            description="List all snippets currently installed in your HEARTBEAT.md."
            usage="thrum list"
          />
          <Command
            name="thrum doctor"
            description="Validate your HEARTBEAT.md setup. Checks for correct thrum-zone markers, snippet formatting, and potential issues."
            usage="thrum doctor"
          />
        </div>
      </section>
    </div>
  );
}

function Command({
  name,
  description,
  usage,
}: {
  name: string;
  description: string;
  usage: string;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-teal-400 font-mono mb-2">
        {name}
      </h3>
      <p className="text-slate-400 mb-3">{description}</p>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
        <pre className="font-mono text-sm text-slate-300 whitespace-pre">
          {usage}
        </pre>
      </div>
    </div>
  );
}
