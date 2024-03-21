import express from 'express';
import { spawn } from 'child_process';
import { json } from 'body-parser';
import tmp from 'tmp';
import fs from 'fs';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

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

app.post('/translate', async (req, res) => {
  const { text, srcLang, destLang } = req.body;

  if (!text || !srcLang || !destLang) {
    return res.status(400).send('Missing required parameters');
  }

  // Write text to a temporary file
  tmp.file(
    { prefix: 'translate-', postfix: '.txt' },
    (err, path, fd, cleanupCallback) => {
      if (err) {
        return res.status(500).send('Failed to create temporary file');
      }

      fs.write(fd, text, async (err) => {
        if (err) {
          cleanupCallback();
          return res.status(500).send('Failed to write to temporary file');
        }

        fs.close(fd, async (err) => {
          if (err) {
            cleanupCallback();
            return res.status(500).send('Failed to close temporary file');
          }

          try {
            const translatedText = await spawnAsync('python3', [
              'translate_script.py',
              path,
              srcLang,
              destLang,
            ]);
            cleanupCallback(); // Clean up the temporary file
            res.json({ translatedText });
          } catch (error) {
            cleanupCallback(); // Ensure cleanup in case of error
            console.error(`stderr: ${error.message}`);
            return res.status(500).send('Error during translation');
          }
        });
      });
    },
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
