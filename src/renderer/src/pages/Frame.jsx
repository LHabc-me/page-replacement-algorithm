import ControlPanel from "../components/ControlPanel";
import { Button, Field, Textarea, Toast, ToastBody, Toaster, ToastTitle, Tooltip, useId, useToastController } from "@fluentui/react-components";
import { Edit20Regular } from "@fluentui/react-icons";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import PageItem from "../components/PageItem";
import FIFO from "../components/algorithm/FIFO";
import { WindupChildren, OnChar } from "windups";
import { Process } from "../algorithm";

const Console = forwardRef((props, ref) => {
  const consoleRef = useRef(null);
  const [messages, setMessages] = useState([]);

  const scrollToBottom = () => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  };

  useImperativeHandle(ref, () => ({
    info: (text) => {
      setMessages((prevMessages) => [...prevMessages, { text, color: "" }]);
    },
    success: (text) => {
      setMessages((prevMessages) => [...prevMessages, { text, color: "green" }]);
    },
    warning: (text) => {
      setMessages((prevMessages) => [...prevMessages, { text, color: "orange" }]);
    },
    error: (text) => {
      setMessages((prevMessages) => [...prevMessages, { text, color: "red" }]);
    },
    clear: () => {
      setMessages([]);
    }
  }));

  return (
    <div {...props} ref={consoleRef}>
      <div className={"p-3 select-none"}>
        {
          messages.map((message, index) => (
            <WindupChildren key={index} onFinished={scrollToBottom}>
              <OnChar fn={scrollToBottom}>
                <div style={{ color: message.color }}>
                  {message.text}
                </div>
              </OnChar>
            </WindupChildren>
          ))
        }
      </div>
    </div>
  );
});


function Pages(props) {
  const { all, actives, onClick, ...rest } = props;
  const pagesRef = useRef([]);
  return (
    <div {...rest}>
      <div className={"flex flex-col justify-center content-center h-full"}>
        <div className={"grid grid-cols-6 h-full"}>
          {
            all.map((page, index) => {
              return (
                <PageItem key={index} ref={ref => pagesRef.current[index] = ref}
                          className={"place-self-center hover:cursor-pointer"}
                          pageNumber={page}
                          active={actives.includes(page)}
                          style={{ width: 50, height: 50 }}
                          onClick={() => {
                            if (onClick) {
                              onClick(page, pagesRef.current[index]);
                            }
                          }} />
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

function parseNumberString(input) {
  // 移除特殊字符并分割数字
  const numbers = input
    .replace(/[^0-9xXbB]/g, " ")
    .split(" ")
    .filter(number => number !== "")
    .filter(number => {
      const lowerCase = number.toLowerCase();
      if (lowerCase.startsWith("0x") || lowerCase.startsWith("0b")) {
        return number.length > 2 &&
          !lowerCase.slice(2).includes("x") &&
          !lowerCase.slice(2).includes("b");
      }
      return !lowerCase.includes("x") && !lowerCase.includes("b");
    });

  const decimalNumbers = numbers.map((number) => {
    const lowerCase = number.toLowerCase();
    if (lowerCase.startsWith("0x")) {
      return parseInt(number.slice(2), 16);
    } else if (lowerCase.startsWith("0b")) {
      return parseInt(number.slice(2), 2);
    } else {
      return parseInt(number, 10);
    }
  });

  return decimalNumbers.filter(number => !isNaN(number));
}

function Frame(props) {
  const { setWindows, windowId, ...rest } = props;

  const [config, setConfig] = useState({
    logicalPageCount: 6,
    pageSize: 4096,
    workingSetSize: 4,
    algorithm: "FIFO"
  });
  const [process, setProcess] = useState(new Process(config));
  const [configEditable, setConfigEditable] = useState(true);

  const onAlgorithmChange = (algorithm) => {
    setWindows(windows => windows.map(win => {
      if (win.id !== windowId) {
        return win;
      }
      return { ...win, title: algorithm };
    }));
  };

  const workingSetRef = useRef(null);
  const consoleRef = useRef(null);
  const [accessSequence, setAccessSequence] = useState("");
  const handleAccessSequenceChange = (_, data) => {
    const newSequence = parseNumberString(data.value);
    if (newSequence.toString() !== parseNumberString(accessSequence).toString()) {
      consoleRef.current.info(`访问序列已更新：${newSequence.join("->")}`);
    }
    setAccessSequence(data.value);
  };
  const [pages, setPages] = useState(Array.from({ length: config.logicalPageCount }, (_, index) => index));
  const [activePages, setActivePages] = useState([]);
  const handleConfigChange = (config) => {
    setConfig(config);
    onAlgorithmChange(config.algorithm);
    setPages(Array.from({ length: config.logicalPageCount }, (_, index) => index));
    setActivePages([]);
    setProcess(new Process(config));
    consoleRef.current.info("配置已更新");
  };
  return (
    <div {...rest} >
      <div className={"grid grid-cols-1 grid-rows-2 h-full p-5"}>
        <div>
          <Pages all={pages}
                 actives={activePages}
                 className={"h-full"}
                 onClick={async (page, ref) => {
                   await ref.flash();
                   if (workingSetRef.current.includes(page)) {
                     setActivePages(activePages.filter(p => p !== page));
                   } else {
                     setActivePages([...activePages, page]);
                   }
                   workingSetRef.current.pushBack(page);
                 }} />
        </div>
        <div className={"flex flex-row"}>
          <div className={"flex-1 flex flex-col"}>
            <FIFO className={"flex-1"} ref={workingSetRef} size={config.workingSetSize} />
            <Field label={"访问序列"} className={"select-none"}>
              <Textarea value={accessSequence} onChange={handleAccessSequenceChange} />
            </Field>
          </div>
          <div className={"w-1/4 flex flex-col"}>
            <Console className={"overflow-y-scroll flex-1"} ref={consoleRef} />
            <div>
              <ControlPanel config={config}
                            onConfigChange={handleConfigChange}
                            enableSettings={configEditable}
                            onRunNext={() => {
                            }}
                            onRunAll={() => {
                            }}
                            onPause={() => {
                            }}
                            onTerminate={() => {
                            }}
                            trigger=
                              {
                                <div className={"float-right"}>
                                  <Button icon={<Edit20Regular />}
                                          appearance={"secondary"}
                                          style={{ borderRadius: "100%" }}
                                          size={"large"}>
                                  </Button>
                                </div>
                              } />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Frame;
