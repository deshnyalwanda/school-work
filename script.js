const inputText = document.getElementById('input-text');
const previewOutput = document.getElementById('preview-output');
const convertButton = document.getElementById('convert-button');
const pasteButton = document.getElementById('paste-button');
const darkModeSwitch = document.getElementById('dark-mode-switch');
const languageSelect = document.getElementById('language-select');

const translations = {
    en: {
        'site-title-link': 'AI Text 2 Word Converter',
        'fun-sentence': 'Say goodbye to equation frustration! Now, effortlessly transform complex AI-generated math into perfectly formatted Word documents with a single click!',
        'language-label': 'Language:',
        'paste-text-header': 'Paste Text from AI',
        'paste-button': 'Paste',
        'input-placeholder': 'Paste your mathematical text here...',
        'preview-header': 'Preview',
        'dark-mode-label': 'Dark Mode',
        'convert-button': 'Convert to Word (Download)',
        'step1-text': 'Copy the AI-generated mathematical text from its source. Make sure to copy using copy icon at the bottom of the AI response.',
        'step2-text': 'Paste the text into the input area and preview the formatted output.',
        'step3-text': 'Click "Convert to Word (Download)" to get your DOCX file.',
        'paste-error': 'Failed to paste from clipboard. Please ensure you have granted clipboard access or paste manually (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Please paste your equation or text into the input area first.',
        'conversion-failed': 'Conversion failed. Please try again later or contact support if the issue persists.',
        'unexpected-error': 'An unexpected error occurred during conversion. Please try again.',
        'mathjax-not-ready': 'Math rendering is not ready. Please wait a moment and try again.',
        'mathjax-components-not-loaded': 'Math rendering components are not loaded. Please wait a moment and try again.',
        'combined-footer-info': 'Contact us: <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. All rights reserved.',
        'sample-header': 'Sample Input and Output'
    },
    es: {
        'site-title-link': 'Convertidor de Texto AI a Word',
        'fun-sentence': '¡Diga adiós a la frustración con las ecuaciones! ¡Ahora, transforme sin esfuerzo las matemáticas complejas generadas por IA en documentos de Word perfectamente formateados con un solo clic!',
        'language-label': 'Idioma:',
        'paste-text-header': 'Pegar Texto de IA',
        'paste-button': 'Pegar',
        'input-placeholder': 'Pegue su texto matemático aquí...',
        'preview-header': 'Vista Previa',
        'dark-mode-label': 'Modo Oscuro',
        'convert-button': 'Convertir a Word (Descargar)',
        'step1-text': 'Copie el texto matemático generado por IA de su origen. Asegúrese de copiar utilizando el icono de copiar en la parte inferior de la respuesta de la IA.',
        'step2-text': 'Pegue el texto en el área de entrada y previsualice la salida formateada.',
        'step3-text': 'Haga clic en "Convertir a Word (Descargar)" para obtener su archivo DOCX.',
        'paste-error': 'Error al pegar desde el portapapeles. Asegúrese de haber concedido acceso al portapapeles o pegue manualmente (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Por favor, pegue su ecuación o texto en el área de entrada primero.',
        'conversion-failed': 'La conversión falló. Por favor, inténtelo de nuevo más tarde o póngase en contacto con el soporte si el problema persiste.',
        'unexpected-error': 'Ocurrió un error inesperado durante la conversión. Por favor, inténtelo de nuevo.',
        'mathjax-not-ready': 'La renderización de las matemáticas no está lista. Por favor, espere un momento e inténtelo de nuevo.',
        'mathjax-components-not-loaded': 'Los componentes de renderización de matemáticas no están cargados. Por favor, espere un momento y inténtelo de nuevo.',
        'combined-footer-info': 'Contáctenos: <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. Todos los derechos reservados.',
        'sample-header': 'Ejemplo de Entrada y Salida'
    },
    fr: {
        'site-title-link': 'Convertisseur de Texte IA en Word',
        'fun-sentence': 'Dites adieu à la frustration des équations ! Transformez désormais sans effort les mathématiques complexes générées par l\'IA en documents Word parfaitement formatés en un seul clic !',
        'language-label': 'Langue :',
        'paste-text-header': 'Coller le texte de l\'IA',
        'paste-button': 'Coller',
        'input-placeholder': 'Collez votre texte mathématique aquí...',
        'preview-header': 'Aperçu',
        'dark-mode-label': 'Mode Sombre',
        'convert-button': 'Convertir en Word (Télécharger)',
        'step1-text': 'Copiez le texte mathématique generado por l\'IA de su source. Assurez-vous de copier en utilisant l\'icône de copie au bas de la respuesta de l\'IA.',
        'step2-text': 'Collez le texto en la zona de entrada y previsualice el resultado formateado.',
        'step3-text': 'Haga clic en "Convertir a Word (Descargar)" para obtener su archivo DOCX.',
        'paste-error': 'Échec de la lectura del contenido del presse-papiers. Assurez-se d\'avoir accordé l\'accès au presse-papiers ou collez manuellement (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Veuillez d\'abord coller votre équation ou votre texto en la zona de saisie.',
        'conversion-failed': 'La conversion a échoué. Veuillez réessayer plus tard ou contacter le support si el problema persiste.',
        'unexpected-error': 'Une erreur inattendue est survenue lors de la conversion. Veuillez réessayer.',
        'mathjax-not-ready': 'Le rendu mathématique n\'est pas prêt. Veuillez patienter un instant et réessayer.',
        'mathjax-components-not-loaded': 'Les composants de rendu mathématique ne sont pas chargés. Veuillez patienter un instant et réessayer.',
        'combined-footer-info': 'Contactez-nous : <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. Tous droits réservés.',
        'sample-header': 'Exemple d\'entrée et de sortie'
    },
    de: {
        'site-title-link': 'KI Text zu Word Konverter',
        'fun-sentence': 'Verabschieden Sie sich von der Gleichungsfrustration! Verwandeln Sie jetzt mühelos komplexe KI-generierte Mathematik mit einem einzigen Klick in perfekt formatierte Word-Dokumente!',
        'language-label': 'Sprache:',
        'paste-text-header': 'Text von KI einfügen',
        'paste-button': 'Einfügen',
        'input-placeholder': 'Fügen Sie hier Ihren mathematischen Text ein...',
        'preview-header': 'Vorschau',
        'dark-mode-label': 'Dunkelmodus',
        'convert-button': 'In Word konvertieren (Herunterladen)',
        'step1-text': 'Kopieren Sie den von der KI generierten mathematischen Text aus der Quelle. Stellen Sie sicher, dass Sie das Kopiersymbol am unteren Rand der KI-Antwort verwenden.',
        'step2-text': 'Fügen Sie den Text in das Eingabefeld ein und zeigen Sie die formatierte Ausgabe in der Vorschau an.',
        'step3-text': 'Klicken Sie auf "In Word konvertieren (Herunterladen)", um Ihre DOCX-Datei zu erhalten.',
        'paste-error': 'Fehler beim Lesen des Inhalts der Zwischenablage. Stellen Sie sicher, dass Sie den Zugriff auf die Zwischenablage gewährt haben oder fügen Sie manuell ein (Strg+V/Cmd+V).',
        'empty-input-alert': 'Bitte fügen Sie zuerst Ihre Gleichung oder Ihren Text in das Eingabefeld ein.',
        'conversion-failed': 'Konvertierung fehlgeschlagen. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht.',
        'unexpected-error': 'Während der Konvertierung ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut.',
        'mathjax-not-ready': 'Mathematisches Rendering ist nicht bereit. Bitte warten Sie einen Moment und versuchen Sie es erneut.',
        'mathjax-components-not-loaded': 'Mathematische Rendering-Komponenten sind nicht geladen. Bitte warten Sie einen Moment und versuchen Sie es erneut.',
        'combined-footer-info': 'Kontaktieren Sie uns: <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. Alle Rechte vorbehalten.',
        'sample-header': 'Beispiel für Eingabe und Ausgabe'
    },
    sw: {
        'site-title-link': 'Kigeuzi cha Maandishi ya AI kwenda Word',
        'fun-sentence': 'Sema kwaheri kwa kuchanganyikiwa kwa milinganyo! Sasa, badilisha kwa urahisi hisabati changamano iliyozalishwa na AI kuwa hati za Word zilizopangiliwa kikamilifu kwa mbofyo mmoja!',
        'language-label': 'Lugha:',
        'paste-text-header': 'Bandika Maandishi kutoka AI',
        'paste-button': 'Bandika',
        'input-placeholder': 'Bandika maandishi yako ya hisabati hapa...',
        'preview-header': 'Onyesho la Kukagua',
        'dark-mode-label': 'Hali ya Giza',
        'convert-button': 'Badilisha hadi Word (Pakua)',
        'step1-text': 'Nakili maandishi ya hisabati yaliyozalishwa na AI kutoka chanzo chake. Hakikisha kunakili kwa kutumia aikoni ya kunakili iliyo chini ya jibu la AI.',
        'step2-text': 'Bandika maandishi kwenye eneo la kuingiza na uangalie onyesho la kukagua lililopangiliwa.',
        'step3-text': 'Bofya "Badilisha hadi Word (Pakua)" ili kupata faili yako ya DOCX.',
        'paste-error': 'Imeshindwa kusoma yaliyomo kwenye ubao wa kunakili. Tafadhali hakikisha umetoa ruhusa ya ufikiaji wa ubao wa kunakili au bandika mwenyewe (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Tafadhali bandika mlinganyo au maandishi yako kwenye eneo la kuingiza kwanza.',
        'conversion-failed': 'Ubadilishaji umeshindwa. Tafadhali jaribu tena baadaye au wasiliana na usaidizi ikiwa tatizo litaendelea.',
        'unexpected-error': 'Hitilafu isiyotarajiwa imetokea wakati wa ubadilishaji. Tafadhali jaribu tena.',
        'mathjax-not-ready': 'Utoaji wa hisabati hauko tayari. Tafadhali subiri kidogo na ujaribu tena.',
        'mathjax-components-not-loaded': 'Vijenzi vya utoaji wa hisabati havijapakiwa. Tafadhali subiri kidogo na ujaribu tena.',
        'combined-footer-info': 'Wasiliana nasi: <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. Haki zote zimehifaserved.',
        'sample-header': 'Mfano wa Ingizo na Matokeo'
    },
    ar: {
        'site-title-link': 'محول النص الرياضي بالذكاء الاصطناعي إلى Word',
        'fun-sentence': 'قل وداعًا لإحباط المعادلات! الآن، حوّل بسهولة المعادلات الرياضية المعقدة التي تم إنشاؤها بواسطة الذكاء الاصطناعي إلى مستندات Word منسقة بشكل مثالي بنقرة واحدة!',
        'language-label': 'اللغة:',
        'paste-text-header': 'لصق النص من الذكاء الاصطناعي',
        'paste-button': 'لصق',
        'input-placeholder': 'الصق النص الرياضي الخاص بك هنا...',
        'preview-header': 'معاينة',
        'dark-mode-label': 'الوضع الداكن',
        'convert-button': 'تحويل إلى Word (تنزيل)',
        'step1-text': 'انسخ النص الرياضي الذي تم إنشاؤه بواسطة الذكاء الاصطناعي من مصدره. تأكد من النسخ باستخدام أيقونة النسخ في الجزء السفلي من رد الذكاء الاصطناعي.',
        'step2-text': 'الصق النص في منطقة الإدخال وقم بمعاينة الإخراج المنسق.',
        'step3-text': 'انقر فوق "تحويل إلى Word (تنزيل)" للحصول على ملف DOCX الخاص بك.',
        'paste-error': 'فشل قراءة محتويات الحافظة. يرجى التأكد من منح الإذن بالوصول إلى الحافظة أو اللصق يدويًا (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'الرجاء لصق المعادلة أو النص في منطقة الإدخال أولاً.',
        'conversion-failed': 'فشل التحويل. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالدعم إذا استمرت المشكلة.',
        'unexpected-error': 'حدث خطأ غير متوقع أثناء التحويل. يرجى المحاولة مرة أخرى.',
        'mathjax-not-ready': 'عرض الرياضيات ليس جاهزًا. يرجى الانتظار لحظة والمحاولة مرة أخرى.',
        'mathjax-components-not-loaded': 'لم يتم تحميل مكونات عرض الرياضيات. يرجى الانتظار لحظة والمحاولة مرة أخرى.',
        'combined-footer-info': 'تواصل معنا: <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. جميع الحقوق محفوظة.',
        'sample-header': 'مثال على الإدخال والإخراج'
    },
    am: {
        'site-title-link': 'የአይአይ ጽሑፍ ወደ ዎርድ መቀየሪያ',
        'fun-sentence': 'የእኩልታ ብስጭትን ይሰናበቱ! አሁን፣ በAI የመነጩ ውስብስብ የሂሳብ ቀመሮችን በአንድ ጠቅታ ወደ ፍፁም የተቀረጹ የዎርድ ሰነዶች ያለልፋት ይቀይሩ!',
        'language-label': 'ቋንቋ:',
        'paste-text-header': 'ጽሑፍ ከአይአይ ለጥፍ',
        'paste-button': 'ለጥፍ',
        'input-placeholder': 'የሒሳብ ጽሑፍዎን እዚህ ይለጥፉ...',
        'preview-header': 'ቅድመ እይታ',
        'dark-mode-label': 'ጨለማ ሞድ',
        'convert-button': 'ወደ Word ቀይር (አውርድ)',
        'step1-text': 'በAI የመነጨውን የሂሳብ ጽሑፍ ከምንጩ ይቅዱ። ከAI ምላሽ ግርጌ ያለውን የቅጂ አዶ በመጠቀም መቅዳትዎን ያረጋግጡ።',
        'step2-text': 'ጽሑፉን ወደ ግብዓት ቦታው ይለጥፉ እና የተቀረጸውን ውፅዓት ይመልከቱ።',
        'step3-text': 'የእርስዎን DOCX ፋይል ለማግኘት "ወደ Word ቀይር (አውርድ)" የሚለውን ይጫኑ።',
        'paste-error': 'ከቅንጥብ ሰሌዳው ላይ ለመለጠፍ አልተሳካም። እባክዎን የቅንጥብ ሰሌዳ መዳረሻ እንደሰጡ ያረጋግጡ ወይም እራስዎ ይለጥፉ (Ctrl+V/Cmd+V)።',
        'empty-input-alert': 'እባክዎ መጀመሪያ እኩልታዎን ወይም ጽሑፍዎን ወደ ግብዓት ቦታው ይለጥፉ።',
        'conversion-failed': 'መቀየር አልተሳካም። እባክዎ ቆይተው እንደገና ይሞክሩ ወይም ችግሩ ከቀጠለ ድጋፍን ያግኙ።',
        'unexpected-error': 'በመቀየር ወቅት ያልተጠበቀ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።',
        'mathjax-not-ready': 'የሂሳብ ማሳያው ገና ዝግጁ አይደለም። እባክዎ ትንሽ ይጠብቁ እና እንደገና ይሞክሩ።',
        'mathjax-components-not-loaded': 'የሂሳብ ማሳያ ክፍሎች አልተጫኑም። እባክዎ ትንሽ ይጠብቁ እና እንደገና ይሞክሩ።',
        'combined-footer-info': 'ያግኙን: <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. ሁሉም መብቶች የተጠበቁ ናቸው።',
        'sample-header': 'የግቤት እና የውጤት ምሳሌ'
    },
    zh: {
        'site-title-link': 'AI文本转Word转换器',
        'fun-sentence': '告别公式烦恼！现在，只需轻轻一点，即可轻松将复杂的AI生成数学转换为格式完美的Word文档！',
        'language-label': '语言:',
        'paste-text-header': '粘贴AI文本',
        'paste-button': '粘贴',
        'input-placeholder': '在此粘贴您的数学文本...',
        'preview-header': '预览',
        'dark-mode-label': '深色模式',
        'convert-button': '转换为Word (下载)',
        'step1-text': '从AI源复制AI生成的数学文本。请确保使用AI回复底部的复制图标进行复制。',
        'step2-text': '将文本粘贴到输入区域并预览格式化输出。',
        'step3-text': '点击“转换为Word (下载)”以获取您的DOCX文件。',
        'paste-error': '从剪贴板粘贴失败。请确保您已授予剪贴板访问权限或手动粘贴 (Ctrl+V/Cmd+V)。',
        'empty-input-alert': '请先将您的公式或文本粘贴到输入区域。',
        'conversion-failed': '转换失败。请稍后重试或如果问题仍然存在，请联系支持。',
        'unexpected-error': '转换过程中发生意外错误。请重试。',
        'mathjax-not-ready': '数学渲染尚未准备好。请稍等片刻再试。',
        'mathjax-components-not-loaded': '数学渲染组件未加载。请稍等片刻再试。',
        'combined-footer-info': '联系我们: <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. 保留所有权利。',
        'sample-header': '输入和输出示例'
    },
    ru: {
        'site-title-link': 'Конвертер текста AI в Word',
        'fun-sentence': 'Попрощайтесь с проблемами уравнений! Теперь легко преобразуйте сложную математику, сгенерированную ИИ, в идеально отформатированные документы Word одним щелчком мыши!',
        'language-label': 'Язык:',
        'paste-text-header': 'Вставить текст из ИИ',
        'paste-button': 'Вставить',
        'input-placeholder': 'Вставьте ваш математический текст сюда...',
        'preview-header': 'Предварительный просмотр',
        'dark-mode-label': 'Темный режим',
        'convert-button': 'Конвертировать в Word (Скачать)',
        'step1-text': 'Скопируйте сгенерированный ИИ математический текст из его источника. Убедитесь, что вы копируете, используя значок копирования внизу ответа ИИ.',
        'step2-text': 'Вставьте текст в область ввода и просмотрите отформатированный вывод.',
        'step3-text': 'Нажмите «Конвертировать в Word (Скачать)», чтобы получить файл DOCX.',
        'paste-error': 'Не удалось вставить из буфера обмена. Убедитесь, что вы предоставили доступ к буферу обмена, или вставьте вручную (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Пожалуйста, сначала вставьте ваше уравнение или текст в область ввода.',
        'conversion-failed': 'Преобразование не удалось. Пожалуйста, попробуйте еще раз позже или обратитесь в службу поддержки, если проблема не исчезнет.',
        'unexpected-error': 'Во время преобразования произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.',
        'mathjax-not-ready': 'Рендеринг математики не готов. Пожалуйста, подождите немного и повторите попытку.',
        'mathjax-components-not-loaded': 'Компоненты рендеринга математики не загружены. Пожалуйста, подождите немного и повторите попытку.',
        'combined-footer-info': 'Свяжитесь с нами: <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. Все права защищены.',
        'sample-header': 'Пример ввода и вывода'
    },
    pt: {
        'site-title-link': 'Conversor de Texto AI para Word',
        'fun-sentence': 'Diga adeus à frustração com equações! Agora, transforme sem esforço a matemática complexa gerada por IA em documentos Word perfeitamente formatados com um único clique!',
        'language-label': 'Idioma:',
        'paste-text-header': 'Colar Texto da IA',
        'paste-button': 'Colar',
        'input-placeholder': 'Cole seu texto matemático aqui...',
        'preview-header': 'Pré-visualização',
        'dark-mode-label': 'Modo Escuro',
        'convert-button': 'Converter para Word (Download)',
        'step1-text': 'Copie o texto matemático gerado pela IA de sua origem. Certifique-se de copiar usando o ícone de copiar na parte inferior da resposta da IA.',
        'step2-text': 'Cole o texto na área de entrada e visualize a saída formatada.',
        'step3-text': 'Clique em "Converter para Word (Download)" para obter seu arquivo DOCX.',
        'paste-error': 'Falha ao colar do clipboard. Certifique-se de ter concedido acesso ao clipboard ou cole manualmente (Ctrl+V/Cmd+V).',
        'empty-input-alert': 'Por favor, cole sua equação ou texto na área de entrada primeiro.',
        'conversion-failed': 'A conversão falhou. Por favor, tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.',
        'unexpected-error': 'Ocorreu um erro inesperado durante a conversão. Por favor, tente novamente.',
        'mathjax-not-ready': 'A renderização matemática não está pronta. Por favor, aguarde um momento e tente novamente.',
        'mathjax-components-not-loaded': 'Os componentes de renderização matemática não estão carregados. Por favor, aguarde um momento e tente novamente.',
        'combined-footer-info': 'Contate-nos: <a href="mailto:info@aitext2wordconverter.com" style="color: blue; text-decoration: underline;">info@aitext2wordconverter.com</a> ©2025 Nyalweezy. Todos os direitos reservados.',
        'sample-header': 'Exemplo de Entrada e Saída'
    }
};

function updateContentLanguage(lang) {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'TEXTAREA' && element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[lang][key]);
            } else if (element.tagName === 'BUTTON') {
                element.textContent = translations[lang][key];
            } else {
                element.innerHTML = translations[lang][key]; // Use innerHTML for text that contains HTML tags
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

function convertMatrixStyle(input) {
    const matrixRegex = /(\$\$)\s*([\s\S]*?)\s*\\begin\{bmatrix\}([\s\S]*?)\\end\{bmatrix\}\s*(\$\$)/g;

    return input.replace(matrixRegex, (match, initialDollar, preambleContent, matrixBody, finalDollar) => {
        let cleanedPreamble = preambleContent.trim();

        const rows = matrixBody.split('\\\\')
            .map(row => row.trim())
            .filter(row => row.length > 0);

        const formattedMatrices = rows.map(row => `$$\\begin{bmatrix}\n${row}\n\\end{bmatrix}$$`);

        if (cleanedPreamble) {
            return `${initialDollar}${cleanedPreamble} $$\n${formattedMatrices.join('\n\n')}`;
        } else {
            return formattedMatrices.join('\n\n');
        }
    });
}

let isProgrammaticScroll = false;
let enableScrollingSync = true;

function handleScrollSync(sourceElement, targetElement) {
    if (enableScrollingSync && !isProgrammaticScroll) {
        isProgrammaticScroll = true;

        const sourceScrollPercentage = sourceElement.scrollTop / (sourceElement.scrollHeight - sourceElement.clientHeight);
        const targetScrollHeight = targetElement.scrollHeight;
        const targetClientHeight = targetElement.clientHeight;

        if (!isNaN(sourceScrollPercentage) && (targetScrollHeight - targetClientHeight) > 0) {
            targetElement.scrollTop = sourceScrollPercentage * (targetScrollHeight - targetClientHeight);
        }

        setTimeout(() => {
            isProgrammaticScroll = false;
        }, 50);
    }
}

function processText() {
    enableScrollingSync = false;

    const initialInputScrollPercentage = inputText.scrollTop / (inputText.scrollHeight - inputText.clientHeight);
    const initialPreviewScrollPercentage = previewOutput.scrollTop / (previewOutput.scrollHeight - previewOutput.clientHeight);

    const rawText = inputText.value;
    let processed = rawText;

    if (isDeepseekStyle(rawText)) {
        processed = convertLaTeX(rawText);
    }

    processed = convertMatrixStyle(processed);

    const html = marked.parse(processed);
    previewOutput.innerHTML = html;

    if (window.MathJax) {
        MathJax.typesetPromise([previewOutput])
            .then(() => {
                if (!isNaN(initialInputScrollPercentage) && (inputText.scrollHeight - inputText.clientHeight) > 0) {
                    inputText.scrollTop = initialInputScrollPercentage * (inputText.scrollHeight - inputText.clientHeight);
                }

                if (!isNaN(initialPreviewScrollPercentage) && (previewOutput.scrollHeight - previewOutput.clientHeight) > 0) {
                    previewOutput.scrollTop = initialPreviewScrollPercentage * (previewOutput.scrollHeight - previewOutput.clientHeight);
                }
                enableScrollingSync = true;
            })
            .catch((err) => {
                enableScrollingSync = true;
            });
    } else {
        enableScrollingSync = true;
    }
}

const debouncedProcessText = debounce(processText, 300);

inputText.addEventListener('scroll', () => handleScrollSync(inputText, previewOutput));
previewOutput.addEventListener('scroll', () => handleScrollSync(previewOutput, inputText));

inputText.addEventListener('input', debouncedProcessText);

pasteButton.addEventListener('click', async () => {
    enableScrollingSync = false;
    try {
        const clipboardText = await navigator.clipboard.readText();
        inputText.value = clipboardText;
        await processText();
    } catch (err) {
        alert(translations[languageSelect.value]['paste-error']);
    }
});

function downloadDocx() {
    if (!inputText.value.trim()) {
        alert(translations[languageSelect.value]['empty-input-alert']);
        return;
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
                        alert(error.message || translations[languageSelect.value]['unexpected-error']);
                    });
            })
            .catch(err => {
                alert(translations[languageSelect.value]['mathjax-not-ready']);
            });
    } else {
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
    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLanguage;
    updateContentLanguage(savedLanguage);
    processText();
});

languageSelect.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem('language', selectedLanguage);
    updateContentLanguage(selectedLanguage);
    processText();
});
