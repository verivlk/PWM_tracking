// https://stackoverflow.com/questions/40162907/w3includehtml-sometimes-includes-twice + ChatGPT

async function xLuIncludeFile() {
    let elements = document.querySelectorAll("[xlu-include-file]");
    while (elements.length > 0) {
        // Process elements in order
        for (const el of elements) {
            const file = el.getAttribute("xlu-include-file");
            try {
                const res = await fetch(file);
                if (!res.ok) throw new Error("File not found: " + file);

                el.innerHTML = await res.text();
                el.removeAttribute("xlu-include-file");
            } catch (err) {
                console.error(err);
            }
        }
        // Re-query the DOM for any new nested includes
        elements = document.querySelectorAll("[xlu-include-file]");
    }
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
