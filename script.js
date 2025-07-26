const inputText = document.getElementById('input-text');
const previewOutput = document.getElementById('preview-output');
const convertButton = document.getElementById('convert-button');
const pasteButton = document.getElementById('paste-button');
const darkModeSwitch = document.getElementById('dark-mode-switch');
const languageSelect = document.getElementById('language-select'); // Get the language select element

// Translations object
const translations = {
    en: {
        'site-title': 'Math Text Formatter',
        'fun-sentence': 'Say goodbye to equation frustration! Now, effortlessly transform complex AI-generated math into perfectly formatted Word documents with a single click!',
        'language-label': 'Language:',
        'paste-text-header': 'Paste Text from AI',
        'paste-button': 'Paste',
        'input-placeholder': 'Paste your mathematical text here...',
        'preview-header': 'Preview',
        'dark-mode-label': 'Dark Mode',
        'convert-button': 'Convert to Word (Download)',
        'footer-text': '©2025 Nyalweezy. All rights reserved.',
        'paste-error': 'Failed to paste from clipboard. Please ensure you have granted clipboard access or paste manually (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Please paste your equation or text into the input area first.',
        'conversion-failed': 'Conversion failed. Please try again later or contact support if the issue persists.',
        'unexpected-error': 'An unexpected error occurred during conversion. Please try again.',
        'mathjax-not-ready': 'Math rendering is not ready. Please wait a moment and try again.',
        'mathjax-components-not-loaded': 'Math rendering components are not loaded. Please wait a moment and try again.'
    },
    es: {
        'site-title': 'Formateador de Texto Matemático',
        'fun-sentence': '¡Diga adiós a la frustración con las ecuaciones! ¡Ahora, transforme sin esfuerzo las matemáticas complejas generadas por IA en documentos de Word perfectamente formateados con un solo clic!',
        'language-label': 'Idioma:',
        'paste-text-header': 'Pegar Texto de IA',
        'paste-button': 'Pegar',
        'input-placeholder': 'Pegue su texto matemático aquí...',
        'preview-header': 'Vista Previa',
        'dark-mode-label': 'Modo Oscuro',
        'convert-button': 'Convertir a Word (Descargar)',
        'footer-text': '©2025 Nyalweezy. Todos los derechos reservados.',
        'paste-error': 'Error al pegar desde el portapapeles. Asegúrese de haber concedido acceso al portapapeles o pegue manualmente (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Por favor, pegue su ecuación o texto en el área de entrada primero.',
        'conversion-failed': 'La conversión falló. Por favor, inténtelo de nuevo más tarde o póngase en contacto con el soporte si el problema persiste.',
        'unexpected-error': 'Ocurrió un error inesperado durante la conversión. Por favor, inténtelo de nuevo.',
        'mathjax-not-ready': 'La renderización de las matemáticas no está lista. Por favor, espere un momento e inténtelo de nuevo.',
        'mathjax-components-not-loaded': 'Los componentes de renderización de matemáticas no están cargados. Por favor, espere un momento e inténtelo de nuevo.'
    },
    fr: {
        'site-title': 'Formateur de Texte Mathématique',
        'fun-sentence': 'Dites adieu à la frustration des équations ! Transformez désormais sans effort les mathématiques complexes générées par l\'IA en documents Word parfaitement formatés en un seul clic !',
        'language-label': 'Langue :',
        'paste-text-header': 'Coller le texte de l\'IA',
        'paste-button': 'Coller',
        'input-placeholder': 'Collez votre texte mathématique ici...',
        'preview-header': 'Aperçu',
        'dark-mode-label': 'Mode Sombre',
        'convert-button': 'Convertir en Word (Télécharger)',
        'footer-text': '©2025 Nyalweezy. Tous droits réservés.',
        'paste-error': 'Échec de la lecture du contenu du presse-papiers. Assurez-vous d\'avoir accordé l\'accès au presse-papiers ou collez manuellement (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Veuillez d\'abord coller votre équation ou votre texte dans la zone de saisie.',
        'conversion-failed': 'La conversion a échoué. Veuillez réessayer plus tard ou contacter le support si le problème persiste.',
        'unexpected-error': 'Une erreur inattendue est survenue lors de la conversion. Veuillez réessayer.',
        'mathjax-not-ready': 'Le rendu mathématique n\'est pas prêt. Veuillez patienter un instant et réessayer.',
        'mathjax-components-not-loaded': 'Les composants de rendu mathématique ne sont pas chargés. Veuillez patienter un instant et réessayer.'
    },
    de: {
        'site-title': 'Mathe-Text-Formatierer',
        'fun-sentence': 'Verabschieden Sie sich von der Gleichungsfrustration! Verwandeln Sie jetzt mühelos komplexe KI-generierte Mathematik mit einem einzigen Klick in perfekt formatierte Word-Dokumente!',
        'language-label': 'Sprache:',
        'paste-text-header': 'Text von KI einfügen',
        'paste-button': 'Einfügen',
        'input-placeholder': 'Fügen Sie hier Ihren mathematischen Text ein...',
        'preview-header': 'Vorschau',
        'dark-mode-label': 'Dunkelmodus',
        'convert-button': 'In Word konvertieren (Herunterladen)',
        'footer-text': '©2025 Nyalweezy. Alle Rechte vorbehalten.',
        'paste-error': 'Fehler beim Lesen des Inhalts der Zwischenablage. Stellen Sie sicher, dass Sie den Zugriff auf die Zwischenablage gewährt haben oder fügen Sie manuell ein (Strg+V/Cmd+V).',
        'empty-input-alert': 'Bitte fügen Sie zuerst Ihre Gleichung oder Ihren Text in das Eingabefeld ein.',
        'conversion-failed': 'Konvertierung fehlgeschlagen. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht.',
        'unexpected-error': 'Während der Konvertierung ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut.',
        'mathjax-not-ready': 'Mathematisches Rendering ist nicht bereit. Bitte warten Sie einen Moment und versuchen Sie es erneut.',
        'mathjax-components-not-loaded': 'Mathematische Rendering-Komponenten sind nicht geladen. Bitte warten Sie einen Moment und versuchen Sie es erneut.'
    },
    sw: {
        'site-title': 'Kifomu cha Maandishi ya Hisabati',
        'fun-sentence': 'Sema kwaheri kwa kuchanganyikiwa kwa milinganyo! Sasa, badilisha kwa urahisi hisabati changamano iliyozalishwa na AI kuwa hati za Word zilizopangiliwa kikamilifu kwa mbofyo mmoja!',
        'language-label': 'Lugha:',
        'paste-text-header': 'Bandika Maandishi kutoka AI',
        'paste-button': 'Bandika',
        'input-placeholder': 'Bandika maandishi yako ya hisabati hapa...',
        'preview-header': 'Onyesho la Kukagua',
        'dark-mode-label': 'Hali ya Giza',
        'convert-button': 'Badilisha hadi Word (Pakua)',
        'footer-text': '©2025 Nyalweezy. Haki zote zimehifadhiwa.',
        'paste-error': 'Imeshindwa kusoma yaliyomo kwenye ubao wa kunakili. Tafadhali hakikisha umetoa ruhusa ya ufikiaji wa ubao wa kunakili au bandika mwenyewe (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Tafadhali bandika mlinganyo au maandishi yako kwenye eneo la kuingiza kwanza.',
        'conversion-failed': 'Ubadilishaji umeshindwa. Tafadhali jaribu tena baadaye au wasiliana na usaidizi ikiwa tatizo litaendelea.',
        'unexpected-error': 'Hitilafu isiyotarajiwa imetokea wakati wa ubadilishaji. Tafadhali jaribu tena.',
        'mathjax-not-ready': 'Utoaji wa hisabati hauko tayari. Tafadhali subiri kidogo na ujaribu tena.',
        'mathjax-components-not-loaded': 'Vijenzi vya utoaji wa hisabati havijapakiwa. Tafadhali subiri kidogo na ujaribu tena.'
    },
    ar: {
        'site-title': 'منسق النصوص الرياضية',
        'fun-sentence': 'قل وداعًا لإحباط المعادلات! الآن، حوّل بسهولة المعادلات الرياضية المعقدة التي تم إنشاؤها بواسطة الذكاء الاصطناعي إلى مستندات Word منسقة بشكل مثالي بنقرة واحدة!',
        'language-label': 'اللغة:',
        'paste-text-header': 'لصق النص من الذكاء الاصطناعي',
        'paste-button': 'لصق',
        'input-placeholder': 'الصق النص الرياضي الخاص بك هنا...',
        'preview-header': 'معاينة',
        'dark-mode-label': 'الوضع الداكن',
        'convert-button': 'تحويل إلى Word (تنزيل)',
        'footer-text': '©2025 Nyalweezy. جميع الحقوق محفوظة.',
        'paste-error': 'فشل قراءة محتويات الحافظة. يرجى التأكد من منح الإذن بالوصول إلى الحافظة أو اللصق يدويًا (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'الرجاء لصق المعادلة أو النص في منطقة الإدخال أولاً.',
        'conversion-failed': 'فشل التحويل. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالدعم إذا استمرت المشكلة.',
        'unexpected-error': 'حدث خطأ غير متوقع أثناء التحويل. يرجى المحاولة مرة أخرى.',
        'mathjax-not-ready': 'عرض الرياضيات ليس جاهزًا. يرجى الانتظار لحظة والمحاولة مرة أخرى.',
        'mathjax-components-not-loaded': 'لم يتم تحميل مكونات عرض الرياضيات. يرجى الانتظار لحظة والمحاولة مرة أخرى.'
    }
};

function updateContentLanguage(lang) {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'TEXTAREA' && element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[lang][key]);
            } else if (element.tagName === 'BUTTON') {
                // This is the corrected line for buttons
                element.textContent = translations[lang][key]; 
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}


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
        alert(translations[languageSelect.value]['paste-error']);
    } finally {
        // Re-enable scroll sync after paste and processing
        enableScrollingSync = true;
    }
});

function downloadDocx() {
    // Check if the input text area is empty
    if (!inputText.value.trim()) {
        alert(translations[languageSelect.value]['empty-input-alert']);
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
                                throw new Error(translations[languageSelect.value]['conversion-failed']);
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
                        alert(error.message || translations[languageSelect.value]['unexpected-error']);
                    });

            })
            .catch(err => {
                console.error("MathJax render failed before conversion:", err);
                // User-friendly warning for MathJax rendering
                alert(translations[languageSelect.value]['mathjax-not-ready']);
            });
    } else {
        // User-friendly warning for MathJax not loaded
        alert(translations[languageSelect.value]['mathjax-components-not-loaded']);
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
    // Set initial language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLanguage;
    updateContentLanguage(savedLanguage);
    processText();
});


languageSelect.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    console.log(`Language changed to: ${selectedLanguage}`);
    localStorage.setItem('language', selectedLanguage); // Save selected language
    updateContentLanguage(selectedLanguage);
});
