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
function isDeepseekStyle(input) {
    return (
        input.includes('\\[') ||
        input.includes('\\]') ||
        input.includes('\\(') ||
        input.includes('\\)') ||
        input.includes('\\begin{align*}') ||
        input.includes('\\boxed{')
    );
}

function convertLaTeX(input) {
    let output = input;
    output = output.replace(/\\begin\{align\*\}([\s\S]*?)\\end\{align\*\}/g, (match, content) => {
        const lines = content.split('\\\\').map(line => line.trim()).filter(line => line !== '');
        return lines.map(line => `$$${line}$$`).join('\n');
    });
    output = output.replace(/\\\[/g, '$$');
    output = output.replace(/\\\]/g, '$$');
    output = output.replace(/\\\(/g, '$');
    output = output.replace(/\\\)/g, '$');
    // Removed: output = output.replace(/^#+\s*(.*)$/gm, '**$1**'); // This line caused the bold/asterisk issue
    output = output.replace(/^\s*---\s*$/gm, ''); // This removes horizontal rules.
    output = output.replace(/\\boxed\{(.*?)\}/g, '$1');
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
let enableScrollingSync = true; // New flag to control scrolling sync

function handleScrollSync(sourceElement, targetElement) {
    if (enableScrollingSync && !isProgrammaticScroll) {
        isProgrammaticScroll = true;
        const scrollPercentage = sourceElement.scrollTop / (sourceElement.scrollHeight - sourceElement.clientHeight);
        targetElement.scrollTop = scrollPercentage * (targetElement.scrollHeight - targetElement.clientHeight);
        // No setTimeout needed here, as isProgrammaticScroll prevents infinite loop
        isProgrammaticScroll = false; // Immediately reset
    }
}

inputText.addEventListener('scroll', () => handleScrollSync(inputText, previewOutput));
previewOutput.addEventListener('scroll', () => handleScrollSync(previewOutput, inputText));

// Use the debounced version for input
inputText.addEventListener('input', debouncedProcessText);


// --- Paste Button Functionality ---
pasteButton.addEventListener('click', async () => {
    enableScrollingSync = false; // Disable scrolling sync during paste and processing
    try {
        const clipboardText = await navigator.clipboard.readText();
        inputText.value = clipboardText;

        await processText(); // Directly call and await processText for immediate update
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        alert('Failed to paste from clipboard. Please ensure you have granted clipboard access or paste manually (Ctrl+V/Cmd+V).');
    } finally {
        enableScrollingSync = true; // Re-enable scrolling sync after processing
    }
});

// --- Convert and Download as DOCX ---
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