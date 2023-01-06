import './App.css';
import { useState } from "react";

const App = () => {

    const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:8000/" : window.location.protocol + "//" + window.location.host + "/";
    const ENDPOINT = process.env.NODE_ENV === "development" ? "http://localhost:8000/" : "/";

    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [page, setPage] = useState(0);
    const [error, setError] = useState("");
    const [clickCount, setClickCount] = useState(-1);

    const validUrl = (url) => {
        if (!url.split(".")[1] && !url.includes("localhost")) return false;
        if (!url.startsWith("http://") || !url.startsWith("https://")) {
            url = "https://" + url;
        }
        let givenURL;
        try {
            givenURL = new URL(url);
        } catch (error) {
            return false;
        }
        return true;
    }

    const createShortUrl = async () => {
        const res = await fetch(ENDPOINT + "create-shortened-url", {
            method: "POST",
            body: JSON.stringify({ long_url: longUrl, short_url: shortUrl }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.status === "fail") {
            setError(data.message);
        } else {
            setShortUrl(BASE_URL + data.short_url);
            setPage(2);
            setError("");
        }
    }

    const checkUrlClicks = async () => {
        const shortUrlSplit = shortUrl.split("/");
        const res = await fetch(ENDPOINT + "check-click-count", {
            method: "POST",
            body: JSON.stringify({ short_url: shortUrlSplit[shortUrlSplit.length - 1] }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.status === "fail") {
            setError(data.message);
        } else {
            setClickCount(data.clicks);
            setError("");
        }
    }

    const handleNext = async (e, ok, page) => {
        e.preventDefault();
        if (!ok) return;
        if (page === 1) {
            setPage(1);
        }
        else if (page === 2) {
            await createShortUrl();
        }
        else if (page === 3) {
            await checkUrlClicks();
        }
    }

    const retry = () => {
        setLongUrl("");
        setShortUrl("");
        setPage(0);
    }

    const inputShortUrl = (candidate) => {
        if (candidate.length > 9) {
            setError("10 characters max ;(");
        } else {
            setError("");
            setShortUrl(candidate);
        }
    }

    const switchPage = (page) => {
        setShortUrl("");
        setLongUrl("");
        setClickCount(-1);
        setPage(page);
    }

    const MainApp = () => {
        return (
            <div className="App">
                {page === 0 && <p className="switchPageButton" onClick={() => switchPage(3)}>Check click count</p>}
                {page === 3 && <p className="switchPageButton" onClick={() => switchPage(0)}>Get shorter links</p>}

                {page === 0 &&
                    <div className="Page">
                        <h2>Get shorter links :)</h2>
                        <form onSubmit={(e) => handleNext(e, validUrl(longUrl), 1)}>
                            <input type="text" placeholder='Enter your URL here...' autoFocus value={longUrl} onChange={(e) => setLongUrl(e.target.value)} ></input>
                        </form>
                        <button disabled={!validUrl(longUrl)} onClick={() => setPage(1)} className="forwardButton">&rarr;</button>
                    </div>
                }

                {page === 1 &&
                    <div className="Page">
                        <h2>
                            <button onClick={() => setPage(0)} className="backwardButton">&larr;</button>
                            {error ? <span className="error">{error}</span> : "Choose a path name"}
                        </h2>
                        <form onSubmit={(e) => handleNext(e, shortUrl && validUrl(BASE_URL + shortUrl), 2)}>
                            <div className="pathInput">
                                <p>/</p>
                                <input type="text" placeholder='Enter your path here...' autoFocus value={shortUrl} onChange={(e) => inputShortUrl(e.target.value)} />
                            </div>
                        </form>
                        <button disabled={!(shortUrl && validUrl(BASE_URL + shortUrl))} onClick={() => createShortUrl()} className="forwardButton">&rarr;</button>


                    </div>
                }

                {page === 2 &&
                    <div className="Page">
                        <h2>Here's your new URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></h2>
                        <div className="result">
                            <span>Original: </span>
                            <span className='longUrl'>{longUrl}</span>
                        </div>
                        <button onClick={retry} className="retryButton">&#x21bb;</button>
                    </div>
                }

                {page === 3 &&
                    <div className="Page">
                        <h2>
                            {error ? <span className="error">{error}</span>: clickCount!==-1 ? "Your link has "+ clickCount.toString() + " clicks" : "Check your link's click count"}
                        </h2>
                        <form onSubmit={(e) => handleNext(e, validUrl(shortUrl), 3)}>
                            <input type="text" placeholder='Enter your URL here...' autoFocus value={shortUrl} onChange={(e) => setShortUrl(e.target.value)} ></input>
                        </form>
                        <button disabled={!validUrl(shortUrl)} onClick={() => checkUrlClicks()} className="forwardButton">&rarr;</button>
                    </div>
                }

            </div>
        )
    }

    return (
        <MainApp />
    );
}

export default App;