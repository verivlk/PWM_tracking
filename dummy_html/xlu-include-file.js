// https://stackoverflow.com/questions/40162907/w3includehtml-sometimes-includes-twice

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
/*
    const el = document.querySelector("[xlu-include-file]");
    if (!el) return; // no more includes

    const file = el.getAttribute("xlu-include-file");
    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error("File not found: " + file);

        el.innerHTML = await res.text();
        el.removeAttribute("xlu-include-file");

        // Recursive call to process nested includes
        await xLuIncludeFile();
    } catch (err) {
        console.error(err);
    }
*/

    // let z = document.getElementsByTagName("*");

/*
    const elements = document.querySelectorAll("[xlu-include-file]");
    if (elements.length === 0) return; // nothing to include
    for (const el of elements) {
        const file = el.getAttribute("xlu-include-file");
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error("File not found: " + file);

            const html = await response.text();
            el.innerHTML = html;
            el.removeAttribute("xlu-include-file");
        } catch (err) {
            console.error(err);
        }
    }
*/

    // Recursively call to handle nested includes
    // (wait a tiny bit to ensure DOM is updated)
    // setTimeout(xLuIncludeFile, 0);
    /*for (let i = 0; i < z.length; i++) {
        if (z[i].getAttribute("xlu-include-file")) {
            let a = z[i].cloneNode(false);
            let file = z[i].getAttribute("xlu-include-file");

            try {
                let response = await fetch(file);
                if (response.ok) {

                    let content = await response.text();


                    // Si el archivo es una plantilla, reemplazamos los placeholders
                    if (file === "article-template.html") {

                        content = replaceArticleTemplatePlaceholders(content, z[i]);

                        /!*
                        let articleData = {
                            title: z[i].getAttribute("data-title"),
                            subtitle: z[i].getAttribute("data-subtitle"),
                            date: z[i].getAttribute("data-date"),
                            displayDate: z[i].getAttribute("data-display-date"),
                            content: z[i].getAttribute("data-content"),
                            image: z[i].getAttribute("data-image"),
                            imageCaption: z[i].getAttribute("data-image-caption")
                        };

                        content = content.replace(/{{title}}/g, articleData.title)
                            .replace(/{{subtitle}}/g, articleData.subtitle)
                            .replace(/{{date}}/g, articleData.date)
                            .replace(/{{displayDate}}/g, articleData.displayDate)
                            .replace(/{{content}}/g, articleData.content)
                            .replace(/{{image}}/g, articleData.image || '')
                            .replace(/{{imageCaption}}/g, articleData.imageCaption || '');

                        *!/
                    }



                    a.removeAttribute("xlu-include-file");
                    //a.innerHTML = await response.text();
                    a.innerHTML = content;
                    z[i].parentNode.replaceChild(a, z[i]);
                    xLuIncludeFile();
                }
            } catch (error) {
                console.error("Error fetching file:", error);
            }

            return;
        }

    }*/
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
