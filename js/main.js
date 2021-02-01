'use strict'


function initPage() {
    renderImgs();
    createImgs();
    createMemes();
    var meme = loadFromStorage('meme');
    if (!meme) meme = gMeme;
    else gMeme = meme;
}


function onImageClicked(id) {
    gMeme.selectedImgId = id;

    let elGallery = document.querySelector('.imgs-container');
    elGallery.classList.add('hidden');
    let elCanvas = document.querySelector('.generator');
    elCanvas.classList.remove('hidden');

    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');
    resizeCanvas();
    gCtx.fillStyle = '#ffffff';
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height);
    saveToStorage('meme', gMeme);
    drawImgFromlocal();
}

function onGalleryClicked() {
    let elControler = document.querySelector('.generator');
    elControler.classList.add('hidden');
    let elGallery = document.querySelector('.imgs-container');
    elGallery.classList.remove('hidden');
    showMemesGallery(false);
}

function onStickerClicked(num) {
    var elImg = new Image();
    elImg.src = `stickers/sticker${num}.png`;
    elImg.onload = () => {
        switch (num) {
            case '1':
                gCtx.drawImage(elImg, 70, 100, 60, 60);
                break;
            case '2':
                gCtx.drawImage(elImg, 180, 100, 60, 60);
                break;
            case '3':
                gCtx.drawImage(elImg, 300, 100, 60, 60);
                break;
        }
    }
}

function onSaveTxt(userInput) {
    var lineIdx = gMeme.selectedLineIdx
    gMeme.lines[lineIdx].txt = userInput;

    drawImgFromlocal();
    saveToStorage('meme', gMeme);
}

function setFillColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
    drawImgFromlocal();
    saveToStorage('meme', gMeme);
}

function setStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].stroke = color;
    drawImgFromlocal();
    saveToStorage('meme', gMeme);
}



function drawImgFromlocal() {
    var img = new Image();
    img.src = `./images/meme-imgs (square)/${gMeme.selectedImgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        renderText();
    }
}

function onChangeFontSize(val) {
    var size = gMeme.lines[gMeme.selectedLineIdx].fontSize;
    if (val === 'down') {
        size -= 5;
    } else {
        size += 5;
    }
    gMeme.lines[gMeme.selectedLineIdx].fontSize = size;
    saveToStorage('meme', gMeme);
    drawImgFromlocal(gMeme.selectedImgId);
}

function onChangeLine() {
    if (gMeme.selectedLineIdx === 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx = 1;
    var elTxt = document.querySelector('.txt-meme');
    elTxt.value = gMeme.lines[gMeme.selectedLineIdx].txt;
    saveToStorage('meme', gMeme);
    drawImgFromlocal(gMeme.selectedImgId);
}

function onTrashClick() {
    gMeme.lines[gMeme.selectedLineIdx].txt = '';
    var elTxt = document.querySelector('.txt-meme');
    elTxt.value = gMeme.lines[gMeme.selectedLineIdx].txt;
    saveToStorage('meme', gMeme);
    drawImgFromlocal(gMeme.selectedImgId);
}

function onMovingTxt(direction) {
    var txtY = gMeme.lines[gMeme.selectedLineIdx].startY;
    if (direction === 'down') {
        txtY += 3;
    } else {
        txtY -= 3;
    }
    gMeme.lines[gMeme.selectedLineIdx].startY = txtY;
    saveToStorage('meme', gMeme);
    drawImgFromlocal();
}

function onSaveMeme(){
    gMemes.push(gMeme);
    saveToStorage('memes', gMemes);
}

function onMemesGalleryClicked() {
    let elControler = document.querySelector('.generator');
    elControler.classList.add('hidden');
    let elGallery = document.querySelector('.imgs-container');
    elGallery.classList.add('hidden');
    showMemesGallery(true);
    renderMemes();

}

function onChangeTextAlign(val) {
    var alignTxt = gMeme.lines[gMeme.selectedLineIdx].align;
    switch (val) {
        case 'right':
            gMeme.lines[gMeme.selectedLineIdx].startX = gCanvas.width;
            break;
        case 'center':
            gMeme.lines[gMeme.selectedLineIdx].startX = gCanvas.width / 2;
            break;
        case 'left':
            gMeme.lines[gMeme.selectedLineIdx].startX = 0;
            alignTxt = 'left';
            break;
    }
    gMeme.lines[gMeme.selectedLineIdx].align = val;
    saveToStorage('meme', gMeme);
    drawImgFromlocal();
}



function drawMemeLine(context, text, x, y, size = 40, color, stroke, align) {
    context.lineWidth = '2';
    context.strokeStyle = stroke;
    context.fillStyle = color;
    context.font = `${size}px impact`;
    context.textAlign = align;
    context.fillText(text, x, y);
    context.strokeText(text, x, y);
}
function drawText(text, x, y, size = 40, color, stroke, align) {
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = stroke;
    gCtx.fillStyle = color;
    gCtx.font = `${size}px impact`;
    gCtx.textAlign = align;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}

function renderCanvas(img) {
    gCanvas.width = img.width;
    gCanvas.height = img.height;
    gCtx.drawImage(img, 0, 0);
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
function onImgInput(ev) {
    loadImageFromInput(ev, renderCanvas)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}

function onresizeCanvas() {
    // document.querySelector('.canvas-container').onresize = function() {
    resizeCanvas();
    drawImgFromlocal();
    // }
}


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
}
function resizeCanvasByMeme(meme) {
    var elContainer = document.querySelector(`.meme-container${meme.canvasId}`);
    var canvas = document.getElementById(`meme${meme.canvasId}`);
    // Note: changing the canvas dimension this way clears the canvas
    canvas.width = elContainer.offsetWidth;
    canvas.height = elContainer.offsetHeight;
}


function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

function showMemesGallery(show) {
    // memes-container
    if (show) {
        document.querySelector('.memes-container').classList.remove('hidden');
    } else {
        document.querySelector('.memes-container').classList.add('hidden');
    }
}


function renderMemeText(meme) {
    if (!meme) return;
    let id = meme.canvasId
    let elCanvas = document.getElementById(`meme${id}`);
    let context = elCanvas.getContext('2d');
    let line = meme.lines[0];
    drawMemeLine(context, line.txt, line.startX, line.startY,
        line.fontSize, line.color, line.stroke, line.align);
    line = meme.lines[1];
    drawMemeLine(context, line.txt, line.startX, elCanvas.height - line.startY,
        line.fontSize, line.color, line.stroke, line.align);
    return;
}

function renderText() {
    var meme = loadFromStorage('meme');
    if (!meme) return;
    for (var i = 0; i < gMeme.lines.length; i++) {
        var imgTxt = meme['lines'][i]['txt'];
        var startX = gMeme.lines[i].startX;
        var alignTxt = gMeme.lines[i].align;
        var fontSize = gMeme['lines'][i]['fontSize'];
        var colorTxt = gMeme['lines'][i]['color'];
        var colorStroke = gMeme['lines'][i]['stroke'];
        if (i === gMeme.selectedLineIdx) {
            colorStroke = 'orange';
        }
        if (i === 0) {
            var startY = gMeme.lines[i].startY;
            drawText(imgTxt, startX, startY, fontSize, colorTxt, colorStroke, alignTxt);
            gMeme['lines'][i]['startY'] = startY;
        } else {
            var startY = gCanvas.height - gMeme.lines[i].startY;
            drawText(imgTxt, startX, startY, fontSize, colorTxt, colorStroke, alignTxt);
        }
    }
}


function renderMemes() {
    var memes = createMemes();
    var strHtmls = memes.map(function (meme) {
        return `
        <div class="meme-container${meme.canvasId}">
            <canvas onclick="draw(event)" id="meme${meme.canvasId}" width="0" height="0"></canvas>
        </div> 
        `
    })
    document.querySelector('.memes-container').innerHTML = strHtmls.join('');
    memes.forEach(meme => {
        drawMemeOnCanvas(meme);
    });
}

function drawMemeOnCanvas(meme) {
    var img = new Image();
    img.src = `./images/meme-imgs (square)/${meme.selectedImgId}.jpg`;
    let elMeme = document.getElementById(`meme${meme.canvasId}`);
    let memeCanvasContext = elMeme.getContext('2d');
    img.onload = () => {
        memeCanvasContext.drawImage(img, 0, 0, elMeme.width, elMeme.height) //img,x,y,xend,yend
        renderMemeText(meme);
    }
    resizeCanvasByMeme(meme);
}

function renderImgs() {
    var imgs = createImgs();
    var strHtmls = imgs.map(function (img) {
        return `
        <div class="img">
            <img class="${img.id}" onclick="onImageClicked('${img.id}')" src="./images/meme-imgs (square)/${img.id}.jpg" alt="Card image">
        </div> 
        `
    })
    document.querySelector('.imgs-container').innerHTML = strHtmls.join('');
}
