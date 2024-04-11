import { file } from 'tmp-promise';
import { writeFile } from 'fs/promises';

const port = process.env.PORT || 5000;

Bun.serve({
  port,
  fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/translate" && request.method === "POST") {
      return handleTranslate(request);
    }
    return new Response("Not Found", { status: 404 });
  },
});

async function handleTranslate(request) {
  // Extract the JSON body from the request
  const { text, srcLang, destLang } = await request.json();
  if (!text || !srcLang || !destLang) {
    return new Response("Missing required parameters", { status: 400 });
  }

  try {
    // Create a temporary file
    const { path, cleanup } = await file({ prefix: 'translate-', postfix: '.txt' });
    console.log(`Temporary file created at: ${path}`);

    // Write the text to the temporary file
    await writeFile(path, text);

    // Prepare the command for executing the Python script
    const cmdArray = ['python3', 'translate_script.py', path, srcLang, destLang];
    
    // Spawn the Python subprocess with explicit stdout handling
    // Short term for now
    const proc = Bun.spawn(cmdArray, {
      stdout: "pipe",
      onExit(proc, exitCode, signalCode, error) {
        // console.log(`Subprocess exited with code: ${exitCode}, signal: ${signalCode}`);
        if (error) {
          console.error(`Subprocess exit error: ${error}`);
        }
      },
    });

    // Capture and log subprocess stdout
    const stdoutText = await new Response(proc.stdout).text();
    // translated text is stdoutText
    // console.log(`Subprocess stdout: ${stdoutText}`);

    await proc.exited; // Ensure subprocess has exited
    console.log(`Subprocess for translation has exited successfully.`);

    // Cleanup the temporary file
    await cleanup();
    console.log(`Temporary file ${path}` + '\n' + 'Cleaned up successfully.');

    // Return the translated text in the response
    const translatedText = stdoutText; // translated text
    return new Response(JSON.stringify({ translatedText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error during translation: ${error.message}`);
    return new Response("Error during translation", { status: 500 });
  }
}

console.log(
  `Server is live and running on port: http://localhost:${port}`
)