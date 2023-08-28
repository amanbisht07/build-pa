import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BotMessage from "./Component/BotMessage";
import UserMessage from "./Component/UserMessage";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useDispatch } from "react-redux";

export const BotContext = createContext();

export const BotProvider = ({ children }) => {
  const dispatch = useDispatch();

  let role = sessionStorage.getItem("role");

  let uuid = uuidv4();
  const initilMessage = {
    uuid,
    isBot: true,
    component: (
      <BotMessage
        key={uuid}
        uuid={uuid}
        message="Hello What Can I Do For You"
      />
    ),
  };

  const [openBot, setopenBot] = useState(false);
  const [messages, setmessages] = useState([initilMessage]);
  const [lastQuery, setlastQuery] = useState({
    text: "",
    file: "",
  });

  const [stompClient, setStompClient] = useState("");
  const [connected, setConnected] = useState(false);
  const [helpDesk, setHelpDesk] = useState("");

  useEffect(() => {
    if (stompClient) {
      stompClient.debug = null;
      stompClient.connect({}, onConnected, onError);
    } else {
      connect();
    }
  }, [stompClient]);

  // connecting to socket
  const connect = async () => {
    try {
      let helpDesk = await (
        await fetch(window.__ENV__.REACT_APP_GET_SUPPORT)
      ).json();
      let Sock = new SockJS(window.__ENV__.REACT_APP_CHAT_BOT);
      let Client = over(Sock);
      // setHelpDesk(helpDesk);
      setHelpDesk("7wg.cad.cad");
      setStompClient(Client);
    } catch (error) {
      console.log(error);
      callMessageOut("error", "An Error Occurred While Connecting To Helpdesk");
    }
  };

  const onConnected = () => {
    setConnected(true);
    stompClient.subscribe(`/user/${role}/private`, onGetMessage);
  };

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  const onGetMessage = (payload) => {
    let data = JSON.parse(payload.body);
    addBotMsg(data.text, data.file, data.filename);
  };

  const onError = (err) => {
    setConnected(false);
    callMessageOut("error", "Lost Connection To Help Desk");
  };

  // in this useEffect based on userQuery either callApi for response from assistant and from socket
  useEffect(() => {
    if (lastQuery.text || lastQuery.file) {
      const { text, file } = lastQuery;
      let chatMessage;

      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          chatMessage = {
            sender: role,
            receiverName: helpDesk,
            text: text,
            file: base64,
          };
          send(chatMessage);
        };
      } else {
        chatMessage = {
          sender: role,
          receiverName: helpDesk,
          text: text,
          file: "",
        };
        send(chatMessage);
      }
    }
  }, [lastQuery]);

  const addBotMsg = (msg, blob, fileName) => {
    let uuid = uuidv4();
    let botMsg = {
      uuid,
      isBot: true,
      component: (
        <BotMessage
          key={uuid}
          uuid={uuid}
          message={msg}
          blob={blob}
          fileName={fileName}
        />
      ),
    };
    setmessages((prevState) => [...prevState, botMsg]);
  };

  const addUserMsg = (msg, blob) => {
    let uuid = uuidv4();
    let userMsg = {
      uuid,
      isBot: false,
      component: (
        <UserMessage key={uuid} uuid={uuid} message={msg} blob={blob} />
      ),
    };
    setmessages((prevState) => [...prevState, userMsg]);
    setlastQuery({
      text: msg,
      file: blob,
    });
  };

  const send = (body) => {
    stompClient.send("/helpdesk/private-message", {}, JSON.stringify(body));
  };

  return (
    <BotContext.Provider
      value={{
        openBot,
        setopenBot,
        messages,
        setmessages,
        addBotMsg,
        addUserMsg,
        connected,
        helpDesk,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};
