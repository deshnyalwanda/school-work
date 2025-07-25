const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000; // You can choose any available port

// Serve static files (your HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// Use bodyParser to parse incoming request bodies as plain text (HTML in this case)
app.use(bodyParser.text({ type: 'text/html', limit: '5mb' })); // Increased limit for potentially large HTML

app.post('/convert-to-docx', (req, res) => {
    const htmlContent = req.body;
    if (!htmlContent) {
        return res.status(400).send('No HTML content provided.');
    }

    const uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const inputFileName = `temp_input_${uniqueId}.html`;
    const outputFileName = `output_${uniqueId}.docx`;
    const inputFilePath = path.join(__dirname, inputFileName);
    const outputFilePath = path.join(__dirname, outputFileName);

    fs.writeFile(inputFilePath, htmlContent, (err) => {
        if (err) {
            console.error('Error writing HTML to temp file:', err);
            return res.status(500).send('Server error: Could not write HTML content.');
        }

        // Pandoc command:
        // --standalone: Create a complete standalone document.
        // --embed-resources: Embed images, etc., directly into the DOCX.
        // --mathjax: Tells Pandoc to process LaTeX math in HTML using MathJax syntax.
        //    (This is crucial if you're sending raw LaTeX or relying on Pandoc's math rendering)
        // If your MathJax is already rendering to SVG/CHTML in the HTML you send,
        // Pandoc will embed those as images/HTML elements.
        // For best results, consider sending the *raw Markdown/LaTeX* to the server
        // and letting Pandoc convert it directly to DOCX with native math.
        const pandocCommand = `pandoc "${inputFilePath}" -o "${outputFilePath}" --standalone --embed-resources --mathjax`;

        exec(pandocCommand, (error, stdout, stderr) => {
            // Clean up the temporary input file immediately
            fs.unlink(inputFilePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting temp input file:', unlinkErr);
            });

            if (error) {
                console.error(`Pandoc execution error: ${error.message}`);
                console.error(`Pandoc stderr: ${stderr}`);
                return res.status(500).send(`Pandoc conversion failed: ${stderr || error.message}`);
            }
            console.log(`Pandoc stdout: ${stdout}`);

            // Check if the output file was actually created
            if (!fs.existsSync(outputFilePath)) {
                console.error('Pandoc completed, but output file not found:', outputFilePath);
                return res.status(500).send('Pandoc conversion failed: Output file not generated.');
            }

            // Send the generated DOCX file back to the client
            res.download(outputFilePath, 'math_document.docx', (downloadErr) => {
                // Clean up the temporary output file after sending
                fs.unlink(outputFilePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting temp output file:', unlinkErr);
                });
                if (downloadErr) {
                    console.error('Error sending file to client:', downloadErr);
                }
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('Open your browser and navigate to http://localhost:3000');
});