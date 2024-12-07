

import { createContext, useState, useEffect } from 'react';
import run from '../config/gemini';

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState('');
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState('');

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    try {
      setResultData('');
      setLoading(true);
      setShowResult(true);
      let response;

      if (prompt !== undefined) {
        response = await run(prompt);
        setRecentPrompt(prompt);
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        response = await run(input);
      }

      if (typeof response === 'string') {
        const responseArray = response.split('**');
        let newResponse = '';
        for (let i = 0; i < responseArray.length; i++) {
          if (i === 0 || i % 2 !== 1) {
            newResponse += responseArray[i];
          } else {
            newResponse += '<b>' + responseArray[i] + '</b>';
          }
        }

        const newResponse2 = newResponse.split('*').join('<br>');
        const newResponseArray = newResponse2.split('');
        for (let i = 0; i < newResponseArray.length; i++) {
          const nextWord = newResponseArray[i];
          delayPara(i, nextWord);
        }
      }

      setLoading(false);
      setInput('');
    } catch (error) {
      console.error('Error sending prompt:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial prompt call removed
  }, []);

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;