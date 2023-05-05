import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function MemeFetcher() {
const [meme, setMeme] = useState([]);
const [error, setError] = useState('');
const [topText, setTopText] = useState('');
const [bottomText, setBottomText] = useState('');
const [generatedMemeUrl, setGeneratedMemeUrl] = useState(null);
const canvasRef = useRef(null);

useEffect (() => {
    async function fetchMeme() {
    try {
        const memeResponse = await axios.get('https://api.imgflip.com/get_memes');
        console.log(memeResponse);
        const memes = memeResponse.data.data.memes;
        const randomMeme = memes[Math.floor(Math.random() * memes.length)]; // Select a random meme
        console.log(randomMeme);
        setMeme(randomMeme);
    } catch(error) {
        setError('No Memes for the naugthy ones!');
    }
    }
    fetchMeme();
    }, []);

    async function handleSubmit(event) {
    event.preventDefault();
    try {
    const memeImg = new Image();
    memeImg.crossOrigin = "anonymous"; // Add this line
    memeImg.src = meme.url;

      // Wait for the image to load before drawing on the canvas
        memeImg.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = memeImg.width;
        canvas.height = memeImg.height;

        // Draw the meme image on the canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(memeImg, 0, 0);

        // Set text styles
        const fontSize = canvas.height / 10;
        ctx.font = `${fontSize}px Impact`;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = fontSize / 10;
        ctx.textAlign = "center";

        // Draw top text
        const topTextY = canvas.height / 8;
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, topTextY);
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, topTextY);

        // Draw bottom text
        const bottomTextY = canvas.height - (canvas.height / 8);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, bottomTextY);
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, bottomTextY);

        // Convert the canvas to a data URL and save it in state
        const generatedMemeUrl = canvas.toDataURL();
        setGeneratedMemeUrl(generatedMemeUrl);
    };
    } catch(error) {
    setError('No Memes for the naugthy ones!');
    }
}

return (
    <div>
    {generatedMemeUrl ? (
        <img src={generatedMemeUrl} alt="generated meme" />
    ) : (
        <>
        {meme.url && (
            <div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <img src={meme.url} alt="meme" />
            </div>
        )}
        <form onSubmit={handleSubmit}>
            <label>
            Top Text:
            <input type="text" value={topText} onChange={event => setTopText(event.target.value)} />
            </label>
            <br />
            <label>
            Bottom Text:
            <input type="text" value={bottomText} onChange={event => setBottomText(event.target.value)} />
            </label>
            <br />
            <button type="submit">Generate Meme</button>
        </form>
        </>
    )}
</div>
)};