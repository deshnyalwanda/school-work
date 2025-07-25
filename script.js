// Get references to the HTML elements
const inputText = document.getElementById('input-text');
const previewOutput = document.getElementById('preview-output');
const convertButton = document.getElementById('convert-button');
const pasteButton = document.getElementById('paste-button');

// --- Debounce Function ---
// Ensures a function is not called too frequently.
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// --- DeepSeek to ChatGPT LaTeX Conversion ---
// This function aims to convert DeepSeek-style LaTeX delimiters
// (\[...\], \(...\)) to ChatGPT-style ($$...$$, $...$) which are
// generally more compatible with Markdown parsers and MathJax for web display
// and subsequent Pandoc conversion from HTML.
function convertLaTeX(input) {
    let output = input;

    // 1. Convert display math delimiters: \\[ ... \\] to $$ ... $$
    //    Uses a non-greedy match to handle multiple blocks.
    output = output.replace(/\\\[(.*?)\\\]/gs, '$$$$$1$$$$');

    // 2. Convert inline math delimiters: \( ... \) to $ ... $
    //    Uses a non-greedy match.
    output = output.replace(/\\\((.*?)\\\)/gs, '$$$1$$');

    // 3. Convert align* blocks specifically:
    //    This logic breaks down each line within align* into its own display math block ($$).
    //    It runs after the general delimiter conversion, so any `\[` or `\(` inside `align*`
    //    would have already been converted.
    output = output.replace(/\\begin\{align\*\}(.*?)\\end\{align\*\}/gs, (match, content) => {
        return content.split('\n').map(line => line.trim()).filter(line => line.length > 0)
                      .map(line => `$$ ${line} $$`)
                      .join('\n');
    });

    return output;
}

// --- Process and Render Text ---
async function processText() {
    let text = inputText.value;

    // Convert DeepSeek-style LaTeX to ChatGPT-style first
    text = convertLaTeX(text);

    // Convert markdown to HTML
    let htmlContent = marked.parse(text);

    // Set the HTML to the preview area
    previewOutput.innerHTML = htmlContent;

    // Typeset (render) the math
    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
        await MathJax.typesetPromise([previewOutput]);
    }
}

// --- Synchronized Scrolling ---
let isScrolling = false;

inputText.addEventListener('scroll', () => {
    if (!isScrolling) {
        isScrolling = true;
        // Calculate scroll percentage
        const scrollPercentage = inputText.scrollTop / (inputText.scrollHeight - inputText.clientHeight);
        // Apply to preview output
        previewOutput.scrollTop = scrollPercentage * (previewOutput.scrollHeight - previewOutput.clientHeight);
        setTimeout(() => { isScrolling = false; }, 50); // Small delay to prevent infinite loop
    }
});

previewOutput.addEventListener('scroll', () => {
    if (!isScrolling) {
        isScrolling = true;
        const scrollPercentage = previewOutput.scrollTop / (previewOutput.scrollHeight - previewOutput.clientHeight);
        inputText.scrollTop = scrollPercentage * (inputText.scrollHeight - inputText.clientHeight);
        setTimeout(() => { isScrolling = false; }, 50);
    }
});


// --- Hook input changes ---
inputText.addEventListener('input', debounce(processText, 300));

// --- Paste Functionality ---
pasteButton.addEventListener('click', async () => {
    try {
        const clipboardText = await navigator.clipboard.readText();
        inputText.value = clipboardText;
        processText(); // Immediately process pasted text
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        alert('Could not paste from clipboard. Please paste manually.');
    }
});

// --- Download DOCX Function ---
function downloadDocx() {
    // Ensure MathJax has finished rendering before attempting to convert to DOCX
    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
        // Wait for MathJax to finish processing the current preview
        MathJax.typesetPromise([previewOutput])
        .then(() => {
            // Get the HTML content from the preview area after MathJax has rendered it
            const contentToConvert = previewOutput.innerHTML;

            fetch('/convert-to-docx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/html'
                },
                body: contentToConvert
            })
            .then(response => {
                if (!response.ok) {
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
    } else {
        alert("MathJax is not loaded or ready. Cannot convert to DOCX.");
    }
}

// --- Hook download button ---
convertButton.addEventListener('click', downloadDocx);

// --- Initial Render ---
processText(); // Call initially to render any pre-filled content