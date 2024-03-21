import express from 'express';
import { spawn } from 'child_process';
import { json } from 'body-parser';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// Set the body size limit to accommodate large texts
app.use(json({ limit: '100mb' }));

// Function to handle the spawning of the Python process asynchronously
const spawnAsync = (cmd, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { maxBuffer: 1024 * 1024 * 100 }); // Increase buffer size for stdout and stderr
    let outputData = '';
    let errorData = '';

    child.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(outputData);
      } else {
        reject(
          new Error(`Spawn process exited with code ${code}: ${errorData}`),
        );
      }
    });
  });

// POST endpoint for translation
app.post('/translate', async (req, res) => {
  const { text, srcLang, destLang } = req.body;

  // Check if all required parameters are provided
  if (!text || !srcLang || !destLang) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    // Asynchronously call the Python script for translation
    const translatedText = await spawnAsync('python3', [
      'translate_script.py',
      text,
      srcLang,
      destLang,
    ]);
    res.json({ translatedText: translatedText.trim() }); // Trim the text to remove any unwanted whitespace
  } catch (error) {
    console.error(`Error during translation: ${error.message}`);
    res.status(500).send('Error during translation');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
