// Get references to the HTML elements
const inputText = document.getElementById('input-text');
const previewOutput = document.getElementById('preview-output');
const convertButton = document.getElementById('convert-button');
const pasteButton = document.getElementById('paste-button');

// --- Debounce Function ---
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// --- DeepSeek to ChatGPT LaTeX Conversion ---
function isDeepseekStyle(input) {
    // These checks remain to determine if the input *might* be DeepSeek style
    // even if we no longer explicitly convert \[, \], \(, \).
    return (
        input.includes('\\[') ||
        input.includes('\\]') ||
        input.includes('\\(') ||
        input.includes('\\)') ||
        input.includes('\\begin{align*}') ||
        /^#+\s/m.test(input) ||
        /^\s*---\s*$/m.test(input) ||
        input.includes('\\boxed{')
    );
}

function convertLaTeX(input) {
    let output = input;

    // This conversion specifically targets align* blocks.
    // It breaks down each line within align* into its own display math block ($$).
    // If you intend for `align*` to be preserved as a single block for MathJax,
    // this specific conversion might need adjustment.
    output = output.replace(/\\begin\{align\*\}([\s\S]*?)\\end\{align\*\}/g, (match, content) => {
        const lines = content.split('\\\\').map(line => line.trim()).filter(line => line !== '');
        return lines.map(line => `$$${line}$$`).join('\n');
    });

    // Modified: Convert any heading (e.g., #, ##, ###, ####) to bold text
    output = output.replace(/^#+\s*(.*)$/gm, '**$1**');
    // Remove horizontal rules
    output = output.replace(/^\s*---\s*$/gm, '');
    // Unbox \boxed{} content
    output = output.replace(/\\boxed\{(.*?)\}/g, '$1');

    // CRITICAL CHANGE: Removed the following lines which were incorrectly
    // converting `\[`, `\]`, `\(` and `\)` to `$$` or `$`.
    // These conversions were breaking LaTeX matrix environments (e.g., `\\[` for new rows)
    // and other standard MathJax delimiters.
    // MathJax (configured in index.html) already handles these standard delimiters correctly.
    // output = output.replace(/\\\[/g, '$$');
    // output = output.replace(/\\\]/g, '$$');
    // output = output.replace(/\\\(/g, '$');
    // output = output.replace(/\\\)/g, '$');

    return output;
}

// --- Process Input and Preview ---
let lastInputScrollTop = 0; // Store last scroll position of input
let lastPreviewScrollTop = 0; // Store last scroll position of preview

function processText() {
    // Save current scroll positions before updating
    lastInputScrollTop = inputText.scrollTop;
    lastPreviewScrollTop = previewOutput.scrollTop;

    const rawText = inputText.value;
    let processed = rawText;

    if (isDeepseekStyle(rawText)) {
        processed = convertLaTeX(rawText);
        console.log("Converted from DeepSeek style.");
    }

    const html = marked.parse(processed);
    previewOutput.innerHTML = html;

    if (window.MathJax) {
        // Typeset and then restore scroll positions
        MathJax.typesetPromise([previewOutput])
            .then(() => {
                // After MathJax typesets, the content height might change,
                // so we restore the scroll positions.
                inputText.scrollTop = lastInputScrollTop;
                previewOutput.scrollTop = lastPreviewScrollTop;
            })
            .catch((err) =>
                console.error('MathJax typesetting failed:', err)
            );
    } else {
        // If MathJax isn't loaded, just restore scroll
        inputText.scrollTop = lastInputScrollTop;
        previewOutput.scrollTop = lastPreviewScrollTop;
    }
}

// Debounced version of processText
const debouncedProcessText = debounce(processText, 300); // Adjust delay as needed

// --- Sync Scroll ---
let isProgrammaticScroll = false;
function handleScrollSync(scrolling, target) {
    if (isProgrammaticScroll) return;

    isProgrammaticScroll = true;
    requestAnimationFrame(() => {
        const ratio = scrolling.scrollTop / (scrolling.scrollHeight - scrolling.clientHeight);
        target.scrollTop = ratio * (target.scrollHeight - target.clientHeight);
        isProgrammaticScroll = false;
    });
}

inputText.addEventListener('scroll', () => handleScrollSync(inputText, previewOutput));
previewOutput.addEventListener('scroll', () => handleScrollSync(previewOutput, inputText));

// --- Event Listeners ---
// Use the debounced version for input
inputText.addEventListener('input', debouncedProcessText);

// Handle paste event directly on the textarea to apply shrink-font
inputText.addEventListener('paste', () => {
    inputText.classList.add('shrink-font');
    // Process text after a short delay to allow content to settle
    setTimeout(() => debouncedProcessText(), 0);
});

inputText.addEventListener('keydown', () => {
    // Remove shrink-font on any keydown to ensure normal editing
    inputText.classList.remove('shrink-font');
});

// --- Paste Button Functionality ---
pasteButton.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        inputText.value = text;
        inputText.classList.add('shrink-font'); // Apply shrink font on paste
        // Immediately process the pasted text, debounced to prevent jump
        debouncedProcessText();
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        alert('Failed to paste from clipboard. Please ensure you have granted clipboard access or paste manually (Ctrl+V/Cmd+V).');
    }
});


// --- Convert and Download as DOCX using Server-Side Pandoc ---
function downloadDocx() {
    if (!previewOutput.innerHTML.trim()) {
        alert("No content to export.");
        return;
    }

    // Wait for MathJax to complete typesetting before sending HTML to server
    // This ensures that MathJax-rendered elements (like SVGs or CHTML) are in the HTML
    MathJax.typesetPromise([previewOutput])
        .then(() => {
            // Construct the full HTML content to send to the server
            // This ensures all necessary styles for tables are included.
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Export</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        /* MathJax rendered elements might be SVG or CHTML, so ensure basic display */
        .mjx-chtml, .mjx-svg { display: inline-block; vertical-align: middle; }

        /* Include table styles for Pandoc to ideally pick up */
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
${previewOutput.innerHTML}
</body>
</html>`;

            // Send HTML to the server for Pandoc conversion
            fetch('/convert-to-docx', { // This is the endpoint on your server
                method: 'POST',
                headers: {
                    'Content-Type': 'text/html', // Indicate that you're sending HTML
                },
                body: htmlContent,
            })
            .then(response => {
                if (!response.ok) {
                    // If the server response is not OK (e.g., 500 error)
                    // Read the error message from the server if available
                    return response.text().then(text => {
                        throw new Error(`Server error: ${response.status} - ${text}`);
                    });
                }
                return response.blob(); // Get the response as a blob (the DOCX file)
            })
            .then(blob => {
                // Create a temporary URL for the blob and trigger download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'math_document.docx'; // Suggested filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href); // Clean up the object URL
            })
            .catch(error => {
                console.error('Error during DOCX conversion or download:', error);
                alert("Conversion failed. Please ensure the server is running and Pandoc is correctly configured.");
            });

        })
        .catch(err => {
            console.error("MathJax render failed before conversion:", err);
            alert("Math rendering failed. Please try again.");
        });
}

// --- Hook download button ---
convertButton.addEventListener('click', downloadDocx);

// --- Initial Render ---
processText(); // Call initially to render any pre-filled content