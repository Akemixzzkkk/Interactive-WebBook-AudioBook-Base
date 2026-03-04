const chapters = [
    {
        id: 0,
        name: "Capítulo I:",
        content: [
            {
                title: "NÃO FEITO",
                audio: "",
                image: ""
            }
        ]
    },
    {
        id: 1,
        name: "Capítulo II:",
        content: [
            {
                title: "NÃO FEITO",
                audio: "",
                image: ""
            }
        ]
    },
    {
        id: 2,
        name: "Capítulo III:",
        content: [
            {
                title: "NÃO FEITO",
                audio: "",
                image: ""
            }
        ]
    },
    {
        id: 3,
        name: "Capítulo IV:",
        content: [
            {
                title: "NÃO FEITO",
                audio: "",
                image: ""
            }
        ]
    },
    {
        id: 4,
        name: "Capítulo V:",
        content: [
            {
                title: "NÃO FEITO",
                audio: "",
                image: ""
            }
        ]
    },
    {
        id: 5,
        name: "Capítulo VI:",
        content: [
            {
                title: "NÃO FEITO",
                audio: "",
                image: ""
            }
        ]
    },
    {
        id: 6,
        name: "Capítulo VII:",
        content: [
            {
                title: "NÃO FEITO",
                audio: "",
                image: ""
            }
        ]
    }
];


const container = document.getElementById('void-text-container');
const chapterSelection = document.getElementById('chapter-selection');
const navContainer = document.getElementById('nav-container');
const nextBookArrow = document.getElementById('next-book-arrow');
const prevBookArrow = document.getElementById('prev-book-arrow');
const imageContainer = document.getElementById('void-image-container');
const voidImage = document.getElementById('void-image');
const audioPlayer = new Audio();

let currentChapterIndex = -1;
let isNarrating = false;
let isSkipping = false;
let isGoingBack = false;

function wait(ms) {
    return new Promise(resolve => {
        let timer = setTimeout(resolve, ms);
        const check = setInterval(() => {
            if (isSkipping || isGoingBack || !isNarrating) {
                clearTimeout(timer);
                clearInterval(check);
                resolve();
            }
        }, 50);
    });
}

function playAudio(src) {
    if (!src) return wait(3000); // Se não houver áudio, apenas espera

    return new Promise((resolve, reject) => {
        audioPlayer.src = src;
        audioPlayer.play().catch(reject);

        const onEnded = () => {
            cleanup();
            setTimeout(resolve, 500);
        };

        const cleanup = () => {
            audioPlayer.removeEventListener('ended', onEnded);
        };

        audioPlayer.addEventListener('ended', onEnded);

        const checkInterval = setInterval(() => {
            if (!isNarrating || isSkipping || isGoingBack) {
                clearInterval(checkInterval);
                audioPlayer.pause();
                cleanup();
                resolve();
            }
        }, 50);
    });
}

function fadeOut() {
    return new Promise((resolve) => {
        container.classList.remove('fade-in');
        container.classList.add('fade-out');

        let timer = setTimeout(resolve, 1000);
        const check = setInterval(() => {
            if (isSkipping || isGoingBack || !isNarrating) {
                clearTimeout(timer);
                clearInterval(check);
                resolve();
            }
        }, 50);
    });
}

function fadeIn(text, isTitle = false) {
    return new Promise((resolve) => {
        container.innerText = text;
        container.style.fontSize = isTitle ? "3rem" : "1.2rem";
        container.style.letterSpacing = isTitle ? "15px" : "2px";
        container.classList.remove('fade-out');
        container.classList.add('fade-in');

        let timer = setTimeout(resolve, 1000);
        const check = setInterval(() => {
            if (isSkipping || isGoingBack || !isNarrating) {
                clearTimeout(timer);
                clearInterval(check);
                resolve();
            }
        }, 50);
    });
}

function showImage(src) {
    return new Promise(async (resolve) => {
        voidImage.src = src;
        imageContainer.classList.remove('image-out');
        imageContainer.classList.add('image-in');

        await wait(10000);

        imageContainer.classList.remove('image-in');
        imageContainer.classList.add('image-out');

        setTimeout(resolve, 1500);
    });
}

// Renderiza a lista de capítulos dinamicamente para este livro
function renderChapterList() {
    const list = document.querySelector('.chapter-list');
    list.innerHTML = '';
    chapters.forEach((ch, index) => {
        const li = document.createElement('li');
        li.className = 'chapter-item';
        li.innerText = ch.name;
        li.onclick = () => selectChapter(index);
        list.appendChild(li);
    });

    setupHoverSounds();

    // Configura as setas
    nextBookArrow.classList.add('hidden'); // Estamos no último (por enquanto)
    prevBookArrow.classList.remove('hidden'); // Seta para voltar pro Livro 1
}

async function playNarrative(index) {
    if (!chapters[index]) return;

    currentChapterIndex = index;
    isNarrating = true;

    chapterSelection.classList.add('hidden');
    nextBookArrow.classList.add('hidden');
    prevBookArrow.classList.add('hidden');
    navContainer.classList.remove('hidden');

    const chapter = chapters[index];

    // Mostra o nome do capítulo antes de começar a narração
    await fadeIn(chapter.name, true);
    if (!isNarrating) return;
    await wait(2000);
    if (!isNarrating) return;
    await fadeOut();
    if (!isNarrating) return;

    let i = 0;

    while (i < chapter.content.length) {
        if (!isNarrating) break;

        isSkipping = false;
        isGoingBack = false;
        const item = chapter.content[i];
        const isTitle = !!item.title;

        await fadeIn(isTitle ? item.title : item.text, isTitle);

        if (isNarrating && !isSkipping && !isGoingBack) {
            try {
                await playAudio(item.audio);
            } catch (e) {
                console.error("Erro ao tocar áudio:", e);
                await wait(3000);
            }
        }

        await fadeOut();

        if (item.image && isNarrating && !isSkipping && !isGoingBack) {
            await showImage(item.image);
        }

        if (isGoingBack) {
            i = Math.max(0, i - 1);
        } else {
            i++;
        }
    }

    if (isNarrating) {
        const nextIndex = index + 1;
        if (chapters[nextIndex]) {
            await wait(2000);
            if (isNarrating) playNarrative(nextIndex);
        }
    }
}

function skipCurrent() {
    if (isNarrating) isSkipping = true;
}

function prevContent() {
    if (isNarrating) isGoingBack = true;
}

function prevBook() {
    // Volta para o primeiro livro
    if (isNarrating) return;

    chapterSelection.classList.add('hidden');
    prevBookArrow.classList.add('hidden');

    fadeIn("RETORNANDO...", true).then(() => {
        setTimeout(() => {
            fadeOut().then(() => {
                window.location.href = 'livro1.html?entered=true';
            });
        }, 1000);
    });
}

function selectChapter(index) {
    window.voidStarted = true;
    playNarrative(index);
}

function backToSelection() {
    isNarrating = false;
    isSkipping = false;
    audioPlayer.pause();
    audioPlayer.src = "";

    container.classList.remove('fade-in');
    container.classList.add('fade-out');
    navContainer.classList.add('hidden');

    setTimeout(() => {
        container.innerText = "";
        chapterSelection.classList.remove('hidden');
        renderChapterList(); // Garante que a lista deste livro seja mantida
        setupHoverSounds();
    }, 1000);
}

function setupHoverSounds() {
    const items = document.querySelectorAll('.chapter-item');
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (window.persistentAudio) {
                window.persistentAudio.playHoverSound();
            }
        });
    });
}

// Inicia com a lista de capítulos deste livro
renderChapterList();
