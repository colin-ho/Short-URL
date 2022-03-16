import logo from './logo.svg';
import './App.css';
import { useState } from "react";

function App() {
    const [longurl, setLongurl] = useState("");
    const [shorturl, setShorturl] = useState("");
    const [returnLongURL, setReturnLongURL] = useState(""); 

    const handleSubmit = (e) => {
        e.preventDefault(); 

        fetch("http://localhost:8000/shorten/", {
            method: "POST",
            body: JSON.stringify({ longurl: longurl }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                setShorturl(data.shorturl);
                setReturnLongURL(data.longurl);
                setLongurl("");
            });
    };
    return (
        <div className="App">
            <h1>URL Shortener</h1>

            <form style={{width:'100%'}} onSubmit={e => handleSubmit(e)}>
                <div id="inputCont">
                    <input
                        type="text"
                        name="longurl"
                        value={longurl}
                        onChange={(e) => setLongurl(e.target.value)}
                    />
                    <button id="submitbutton"
                        type="submit"
                        disabled={!longurl}
                    >
                        Shorten
                    </button>
                </div>
            </form>


            {returnLongURL ?
                <div>
                    <p>Original URL: <a href={returnLongURL} target="_blank" className='url'>{returnLongURL}</a></p>
                    <p>
                        Shortened URL: <a href={shorturl} target="_blank" className='url'>{shorturl}</a>
                    </p>
                </div>
                : <div />}
        </div>
    );
}

export default App;