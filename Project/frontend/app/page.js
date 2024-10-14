import React from 'react';

const Quote = () => {
    return (
        <div style = {container}>
            <img
                src = "/Tree of Life.JPG"
                alt = "Life of Tree"
                style = {image}
            />
            <blockquote style = {quoteStyle}>
                <h2 style = {quoteText}>
                    Storing memories so that you don't have to 😎
                </h2>
                <h2 style = {extraStyle}>
                    This is extra text if we wanted to add it
                </h2>
            </blockquote>
        </div>
    );
}

const container = {
    position: 'relative',
    width: '100%',
    maxWidth: '1280px',
    margin: 'auto',
    marginTop: '50px',
    borderRadius: '8px',
    textAlign: 'center',
};

const image = {
    display: 'block',
    margin: 'auto',
    width: '1280px',
    height: '428px',
    borderRadius: '10px',
};

const quoteStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    margin: 'auto',
    padding: '5px',
    backgroundColor: 'clear',
};

const quoteText = {
    fontSize: '50px',
    fontStyle: 'Arial',
    color: 'white',
};

const extraStyle = {
    margin: 'auto',
    fontSize: '10px',
    color: 'white',
};

export default Quote;