'use strict';

class LinkElement {
    constructor(data) {
        this.short = data.short_link,
            this.original = data.original_link,
            this.id = Math.floor(Math.random() * 1_000_000)
    }
}

let listOfLinks = [];

const savedLinks = JSON.parse(localStorage.getItem("links"))

if (Array.isArray(savedLinks)) listOfLinks = savedLinks
else listOfLinks = [{
    short: "Short.example",
    original: "Long.example",
    id: Math.floor(Math.random() * 1_000_000)
}]

const isValidURL = input => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(input);
}

const throwError = domElement => {
    linkInput.classList.add("error");
    noInput.classList.add("hide")
    notALink.classList.add("hide")
    domElement.classList.remove("hide");
}

const getUserInput = input => {
    if (input === "") throwError(noInput)
    else if (!isValidURL(input)) throwError(notALink)
    else {
        linkInput.classList.remove("error");
        noInput.classList.add("hide")
        notALink.classList.add("hide")
        return input
    };
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));

const copyToClipboard = event => {    
    const btnID = event.target.id

    listOfLinks.forEach(link => {
        if (link.id == btnID) { // Using only == instead of === since the ID of the DOM Element is a number type and the ID from the JS Object is a string type
            navigator.clipboard.writeText(link.short)
                .then(() => {
                    event.target.textContent = "Copied!";
                    event.target.classList.add("clicked");
                })
                .catch(err => alert("Sorry! Try again."))
            delay(3000)
            .then(() => {
                // setting Button text back to "Copy" and removing purple color
                event.target.textContent = "Copy";
                event.target.classList.remove("clicked");
            }) 
        }
    })
}

const createLinkElement = () => {
    linkArea.innerHTML = "";
    listOfLinks.forEach(link => {

        const container = document.createElement("div")
        container.className = "main__link-area__element";

        const originalLink = document.createElement("div");
        originalLink.className = "main__link-area__element__original"
        originalLink.textContent = link.original;

        const shortLink = document.createElement("div");
        shortLink.className = "main__link-area__element__short"
        shortLink.textContent = link.short;

        const copyBtn = document.createElement("button");
        copyBtn.className = "main__link-area__element__copy";
        copyBtn.textContent = "Copy";
        copyBtn.id = link.id
        copyBtn.onclick = copyToClipboard

        container.appendChild(originalLink)
        container.appendChild(shortLink)
        container.appendChild(copyBtn)
        linkArea.appendChild(container);
    })
}

const saveToLocalStorage = item => {
    localStorage.setItem("links", JSON.stringify(item))
}

const shortenURL = async () => {
    const userInput = linkInput.value;
    const URL = `https://api.shrtco.de/v2/shorten?url=${getUserInput(userInput)}`
    try {
        const reponse = await fetch(URL);
        const result = await reponse.json();
        listOfLinks.unshift(new LinkElement(result.result))
        createLinkElement()
        saveToLocalStorage(listOfLinks);
    } catch (err) {
        console.log("Leider ist ein Fehler aufgetreten", err);
    }
}

const openMobileNav = () => {
    mobileNav.classList.toggle("show-nav");
}

createLinkElement();
