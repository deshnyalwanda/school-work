const inputText = document.getElementById('input-text');
const previewOutput = document.getElementById('preview-output');
const convertButton = document.getElementById('convert-button');
const pasteButton = document.getElementById('paste-button');
const darkModeSwitch = document.getElementById('dark-mode-switch');
const languageSelect = document.getElementById('language-select'); // Get the language select element

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

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
    output = output.replace(/^\s*---\s*$/gm, '');
    output = output.replace(/\\boxed\{(.*?)\}/g, '$1');
    return output;
}

let lastInputScrollTop = 0;
let lastPreviewScrollTop = 0;

function processText() {
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
        MathJax.typesetPromise([previewOutput])
            .then(() => {
                inputText.scrollTop = lastInputScrollTop;
                previewOutput.scrollTop = lastPreviewScrollTop;
            })
            .catch((err) =>
                console.error('MathJax typesetting failed:', err)
            );
    } else {
        inputText.scrollTop = lastInputScrollTop;
        previewOutput.scrollTop = lastPreviewScrollTop;
    }
}

const debouncedProcessText = debounce(processText, 300);

let isProgrammaticScroll = false;
let enableScrollingSync = true;

function handleScrollSync(sourceElement, targetElement) {
    if (enableScrollingSync && !isProgrammaticScroll) {
        isProgrammaticScroll = true;
        const scrollPercentage = sourceElement.scrollTop / (sourceElement.scrollHeight - sourceElement.clientHeight);
        targetElement.scrollTop = scrollPercentage * (targetElement.scrollHeight - targetElement.clientHeight);
        isProgrammaticScroll = false;
    }
}

inputText.addEventListener('scroll', () => handleScrollSync(inputText, previewOutput));
previewOutput.addEventListener('scroll', () => handleScrollSync(previewOutput, inputText));

inputText.addEventListener('input', debouncedProcessText);

pasteButton.addEventListener('click', async () => {
    enableScrollingSync = false; // Temporarily disable to prevent jumpiness during paste
    try {
        const clipboardText = await navigator.clipboard.readText();
        inputText.value = clipboardText;

        // Process text immediately after pasting
        await processText();
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        alert('Failed to paste from clipboard. Please ensure you have granted clipboard access or paste manually (Ctrl+V/Cmd+V).');
    } finally {
        // Re-enable scroll sync after paste and processing
        enableScrollingSync = true;
    }
});

function downloadDocx() {
    // Check if the input text area is empty
    if (!inputText.value.trim()) {
        alert("Please paste your equation or text into the input area first.");
        return; // Stop the function if the input is empty
    }

    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
        MathJax.typesetPromise([previewOutput])
            .then(() => {
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
                            // User-friendly warning for conversion failure
                            return response.text().then(text => {
                                throw new Error(`Conversion failed. Please try again later or contact support if the issue persists.`);
                            });
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'math_document.docx';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(link.href);
                    })
                    .catch(error => {
                        console.error('Error during DOCX conversion or download:', error);
                        // User-friendly warning
                        alert(error.message || "An unexpected error occurred during conversion. Please try again.");
                    });

            })
            .catch(err => {
                console.error("MathJax render failed before conversion:", err);
                // User-friendly warning for MathJax rendering
                alert("Math rendering is not ready. Please wait a moment and try again.");
            });
    } else {
        // User-friendly warning for MathJax not loaded
        alert("Math rendering components are not loaded. Please wait a moment and try again.");
    }
}

convertButton.addEventListener('click', downloadDocx);

darkModeSwitch.addEventListener('change', () => {
    if (darkModeSwitch.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeSwitch.checked = true;
    }
    processText();
});


languageSelect.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    console.log(`Language changed to: ${selectedLanguage}`);
    alert(`You selected: ${selectedLanguage.toUpperCase()}`);
});