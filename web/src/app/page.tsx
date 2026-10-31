import * as fs from 'fs';
import * as path from 'path';

import { Suspense } from "react";

import Counter from "./components/counter";
import ClientPanel from "./components/client-panel";
import ServerReport from "./components/server-report";


export const dynamic = "force-dynamic";




export default function Page() {

  const filePath = "../logic/README.md";

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log(fileContent);
  } catch (error) {
    console.error('Failed to read file:', error);
    return 'Error loading file content.';
  }

  return (
    <main>
      <header>
        <h1>m81</h1>
        <p>React Server Components + SSR</p>
      </header>

      <section>
        <h2>1. Server Component containing a Client Component</h2>
        <Counter initialCount={0} />
      </section>

      <section>
        <h2>2. Client Component containing server-rendered content</h2>
        <ClientPanel>
          <Suspense
            fallback={<p>Loading server report...</p>}
          >
            <ServerReport />
          </Suspense>
        </ClientPanel>
      </section>
    </main>
  );

}
