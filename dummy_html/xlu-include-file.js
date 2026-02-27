// https://stackoverflow.com/questions/40162907/w3includehtml-sometimes-includes-twice + ChatGPT

// Pomocnicza funkcja rekurencyjna obsługująca zagnieżdżenia i relatywne ścieżki
async function processIncludes(parentElement, baseURL) {
    const elements = parentElement.querySelectorAll("[xlu-include-file]");
    
    for (const el of elements) {
        const file = el.getAttribute("xlu-include-file");
        try {
            const fetchUrl = new URL(file, baseURL).href;
            
            const res = await fetch(fetchUrl);
            if (!res.ok) throw new Error("File not found: " + fetchUrl);

            let content = await res.text();

            // --- MAGIA NAPRAWIANIA ŚCIEŻEK ---
            // Tworzymy tymczasowy parser, żeby przejrzeć pobrany HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            
            // Naprawiamy wszystkie href i src w pobranym fragmencie
            // Używamy fetchUrl (folderu szablonu) jako bazy
            const folderBase = fetchUrl.substring(0, fetchUrl.lastIndexOf("/") + 1);

            doc.querySelectorAll("[href], [src]").forEach(link => {
                const attr = link.hasAttribute("href") ? "href" : "src";
                const oldVal = link.getAttribute(attr);

                // Naprawiamy tylko ścieżki relatywne (nie dotykamy http:// ani /)
                if (oldVal && !oldVal.startsWith("http") && !oldVal.startsWith("/") && !oldVal.startsWith("#")) {
                    const absoluteUrl = new URL(oldVal, folderBase).pathname;
                    link.setAttribute(attr, absoluteUrl);
                }
            });

            // Podmieniamy placeholdery (Twoja funkcja)
            content = doc.body.innerHTML;
            if (el.hasAttribute("data-title")) { 
                content = replaceArticleTemplatePlaceholders(content, el);
            }

            el.innerHTML = content;
            el.removeAttribute("xlu-include-file");

            // Rekurencja dla zagnieżdżonych plików
            await processIncludes(el, fetchUrl);
            
        } catch (err) {
            console.error("Błąd wczytywania szablonu:", err);
        }
    }
}
async function xLuIncludeFile() {
    await processIncludes(document, document.baseURI);
}


function replaceArticleTemplatePlaceholders(content, element) {
    let articleData = {
        title: element.getAttribute("data-title"),
        subtitle: element.getAttribute("data-subtitle"),
        date: element.getAttribute("data-date"),
        displayDate: element.getAttribute("data-display-date"),
        content: element.getAttribute("data-content"),
        image: element.getAttribute("data-image"),
        imageCaption: element.getAttribute("data-image-caption")
    };

    /*
    return content.replace(/{{title}}/g, articleData.title)
        .replace(/{{subtitle}}/g, articleData.subtitle)
        .replace(/{{date}}/g, articleData.date)
        .replace(/{{displayDate}}/g, articleData.displayDate)
        .replace(/{{content}}/g, articleData.content)
        .replace(/{{image}}/g, articleData.image || '')
        .replace(/{{imageCaption}}/g, articleData.imageCaption || '');
    */

    return content
        .replace(/{{title}}/g, articleData.title ?? "{{title}}")
        .replace(/{{subtitle}}/g, articleData.subtitle ?? "{{subtitle}}")
        .replace(/{{date}}/g, articleData.date ?? "{{date}}")
        .replace(/{{displayDate}}/g, articleData.displayDate ?? "{{displayDate}}")
        .replace(/{{content}}/g, articleData.content ?? "{{content}}")
        .replace(/{{image}}/g, articleData.image ?? "{{image}}")
        .replace(/{{imageCaption}}/g, articleData.imageCaption ?? "{{imageCaption}}");

}


function redirectToArticle(event, element) {
    event.preventDefault(); // Evita la navegación predeterminada

    // Obtener datos del artículo desde los atributos
    let params = new URLSearchParams();
    params.append("title", element.getAttribute("data-title"));
    params.append("subtitle", element.getAttribute("data-subtitle"));
    params.append("date", element.getAttribute("data-date"));
    params.append("displayDate", element.getAttribute("data-display-date"));
    params.append("content", element.getAttribute("data-content"));
    params.append("image", element.getAttribute("data-image") || "");
    params.append("imageCaption", element.getAttribute("data-image-caption") || "");

    // Redirigir a article.html con los parámetros
    window.location.href = "article.html?" + params.toString();
}

document.addEventListener("DOMContentLoaded", xLuIncludeFile);
