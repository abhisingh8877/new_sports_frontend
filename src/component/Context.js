import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);

const Context = (props) => {
  const [news, setNews] = useState([]);
  const [error,setError]=useState("");
  const [payValue,setPayValue]=useState(0);
  const [url,seturl]=useState("");
  const [authorvalue,setauthorValue]=useState({});
  
  useEffect(() => {
    const findNews = async () => {
      try {
        const response = await fetch("https://sport-dunia-backend.onrender.com/api/articles/News");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const newsJson = await response.json();
        if(newsJson.isSuccess)
        {
            setNews(prev=>[...prev,newsJson.articles])
        }
        else
        {
            setError("Their is some error for finding news");
        }
        
      } catch (error) {
        setError("Their is some error ",error);
        console.error("Error fetching news:", error);
      }
    };

    findNews();
    const findPayValue=async()=>{
        try{
            const response=await fetch("https://sport-dunia-backend.onrender.com/api/payout/findPay");
            if(!response.ok)
            {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const newJsonvalue= await response.json();
            if(newJsonvalue.isSuccess)
            {
                setPayValue(newJsonvalue.new_PayValue);
            }
            else
            {
                setError("Their is some error with finding Payvalue");
            }
        }
        catch(error)
        {
            setError("Their is some error ",error);
            console.error("Error fetching Payvalue:", error);
        }
    }
    findPayValue();
  }, []);
    const AddCountofAuthor=(author,url_value)=>{
        for(let i=0;i<url.length;i++)
        {
            if(url[i]===url_value)
            {
                return;
            }
        }
        seturl((prev) => [...prev, url_value]);
        setauthorValue((prev) => ({
            ...prev,
            [author]: (prev[author] || 0) + 1, // Increment the count for the given author
          }));

    }
    const countAllValues = () => {
        return Object.values(authorvalue).reduce((total, value) => total + value*payValue, 0);
      };
    const calculateValueforOneAuthor=(keys)=>{
       return authorvalue[keys]*payValue;
    }
   const sharedValue={news,payValue,countAllValues,AddCountofAuthor,authorvalue,calculateValueforOneAuthor};
  return (
    <UserContext.Provider value={sharedValue}>
      {props.children}
    </UserContext.Provider>
  );
};

export default Context;
