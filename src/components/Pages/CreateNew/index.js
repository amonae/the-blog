import React, { useRef, useEffect, useState } from "react";
import { Layout } from "../../Pages";
import { BiRefresh } from "react-icons/bi";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import ContentEditable from "react-contenteditable";
import { unlink } from "fs";

export function CreateNew() {
  let quillEditor = useRef(null);
  let postTitle = useRef(null);
  let [mode, setMode] = useState("");

  //! Modes should be put inside PostContext so that it doesn't wipe out everytime the component re-renders!!! It needs to be cached/remembered somehow!

  //? state that is an object with 3 keys: prompt mode, time mode, word count mode. their values are booleans. use this to decide which component will be rendered/mode will be activated?

  function handleSave() {
    // let postTitle = quillEditor.current.
    let textContents = quillEditor.current.state.value;
    let deltaContents = quillEditor.current.editor.getContents();
    let title = postTitle.current.el.current.innerText;
    console.log(title);
    console.log(textContents);
    console.log(deltaContents);
  }

  function handleChange(e) {
    setMode(e.target.value);
  }

  return (
    <Layout>
      <TextEditor postTitleRef={postTitle} quillEditorRef={quillEditor} />
      {/* <button onClick={() => handleSave()}>Save</button> */}
      <div className="modeSelection">
        <input
          type="radio"
          onChange={(e) => handleChange(e)}
          id="promptMode"
          name="mode"
          value="promptMode"
        />
        <label htmlFor="promptMode">Prompt Mode</label>
        <br></br>

        <input
          type="radio"
          onChange={(e) => handleChange(e)}
          id="wordCountMode"
          name="mode"
          value="wordCountMode"
        />
        <label htmlFor="wordCountMode">Word Count Mode</label>
        <br></br>

        <input
          type="radio"
          onChange={(e) => handleChange(e)}
          id="timeLimitMode"
          name="mode"
          value="timeLimitMode"
        />
        <label htmlFor="timeLimitMode">Time Limit Mode</label>
        <br></br>
      </div>

      {mode === "promptMode" && <PromptMode />}
      {mode === "wordCountMode" && <WordCountMode />}
      {mode === "timeLimitMode" && <TimeLimitMode />}
    </Layout>
  );
}

function WordCountMode() {
  return <p>This is the wordcountmode component.</p>;
  // Implement a Chakra UI progress bar to indicate how far along user is to meeting their word count goal.
  // On every keystroke, call .getText Quill function?? and run it through some
}

function TimeLimitMode() {
  return <p>This is the TimeLimitMode component.</p>;
  // User sets time limit. Progress bar indicates how much time they have left. When time is up, lock the text editor. But ofc, give the user the option to unlock it if they want to.
}

//TODO: have 3 radio buttons for each "mode". prompt mode, word count mode, and time limit mode. for each click, render their respective components. ONLY ONE CAN BE RENDERED/SELECTED AT A TIME.

//? PROMPTMODE COMPONENT, TIMEMODECOMPONENT, WORDCOUNTCOMPONENT

function TextEditor({ quillEditorRef, postTitleRef }) {
  return (
    <>
      <ContentEditable
        ref={postTitleRef}
        className="post-title"
        html="<h2>Untitled</h2>"
      />
      <ReactQuill ref={quillEditorRef} theme="bubble" />
      {/* <ReactQuill ref={quillEditor} theme="bubble" /> */}
    </>
  );
}

function PromptMode() {
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);
  const [numberOfWords, setNumberOfWords] = useState(0);

  function changeNumberOfWords(e) {
    setNumberOfWords(Number(e.target.value));
  }

  function getWords() {
    if (numberOfWords > 10) {
      return setError({
        errorMessage: "Number must be below 10.",
      });
    } else {
      setError(null);
    }

    fetch(`https://random-word-api.herokuapp.com/word?number=${numberOfWords}`)
      .then((response) => response.json())
      .then((data) => setWords(data));
  }

  useEffect(() => {
    getWords();
  }, []);

  //! The words refresh/it refetches a new set of words when you click on Prompt Mode, then click on another mode, then click BACK on prompt mode. Maybe I shouldn't allow the user to switch between prompts. Maybe clicking on a prompt will render that component, and it makes the options of other modes disappears. OR, clicking on another mode says that "you will lose your progress if you switch modes. Are you sure you want to?", which the user must THEN click again to confirm that's what they really want.

  // ^^^ basically, if a mode has already been selected, and a NEW mode is now selected, pull up an alert box for the reader to confirm they really want to leave/lose their mode progress.

  return (
    <>
      <div className="words-list-wrapper">
        <input
          className="word-number-input"
          onChange={(e) => changeNumberOfWords(e)}
          type="text"
        />
        <p>words</p>
        <ul className="words-list">
          {words.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
        <BiRefresh onClick={() => getWords()} className="refresh-btn" />
        {error && <p>{error.errorMessage}</p>}
      </div>
    </>
  );
}
