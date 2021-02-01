'use strict'


var gCanvas;
var gCtx;

var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs;
var gMemes = [];
var gCanvasId = 0;

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    canvasId: 0,

    lines: [
        {
            txt: '',
            startY: 80,
            startX: 0,
            fontSize: 60,
            align: 'left',
            color: 'white',
            stroke: 'black',
        },
        {
            txt: '',
            startY: 60,
            startX: 0,
            fontSize: 60,
            align: 'left',
            color: 'white',
            stroke: 'black',
        }
    ]
}


function createImg(id, keywords) {
    return {
        id,
        url: `./images/meme-imgs (square)/${id}.jpg`,
        keywords,
    }
}

function createImgs() {
    var imgs = loadFromStorage('imgs')
    if (!imgs || !imgs.length) {
        imgs = [];
        for (let i = 1; i < 19; i++) {
            imgs.push(createImg(i));
        }
        saveToStorage('imgs', imgs);
    }
    gImgs = imgs;
    return gImgs;
}


function createMemes() {
    var memes = loadFromStorage('memes')
    if (!memes) {
        memes = [];
    }
    gMemes = memes;
    let i = 0
    gMemes = gMemes.map(function (meme) {
        meme.canvasId = i;
        i++;
        return meme;
    })
    return gMemes;
}


function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}


function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}
