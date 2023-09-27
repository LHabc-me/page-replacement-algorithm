import ControlPanel from "../components/ControlPanel";
import { Button, Radio, RadioGroup, Textarea } from "@fluentui/react-components";
import { Edit20Regular } from "@fluentui/react-icons";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import PageItem from "../components/PageItem";
import FIFO from "../components/algorithms/FIFO";
import { OnChar, WindupChildren } from "windups";
import { Process } from "../algorithms";
import LRU from "../components/algorithms/LRU";

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


const Pages = forwardRef((props, ref) => {
  const { all, pagesStatus, onClick, disableClick, ...rest } = props;
  const pagesRef = useRef([]);

  function getPages() {
    return pagesRef.current;
  }

  useImperativeHandle(ref, () => ({ getPages }));

  return (
    <div {...rest}>
      <div className={"flex flex-col justify-center content-center h-full"}>
        <div className={"grid grid-cols-6 h-full"}>
          {
            all.map((page, index) => {
              return (
                <PageItem key={index} ref={ref => pagesRef.current[index] = ref}
                          className={disableClick ? "place-self-center " : "place-self-center hover:cursor-pointer"}
                          pageNumber={page}
                          status={pagesStatus[page]}
                          style={{ width: 50, height: 50 }}
                          onClick={() => {
                            if (disableClick) return;
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
});

function getPageId(address, pageSize) {
  return Math.floor(address / pageSize);
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

  const workingSetRef = useRef(null);
  const consoleRef = useRef(null);

  // 访问序列组件（界面下方）
  const [accessMode, setAccessMode] = useState("id");
  const [accessSequence, setAccessSequence] = useState("");
  const handleAccessSequenceChange = (_, data) => {
    const newSequence = parseNumberString(data.value);
    if (newSequence.toString() !== parseNumberString(accessSequence).toString()) {
      consoleRef.current.info(`访问序列已更新：${newSequence.join("->")}`);
    }
    setAccessSequence(data.value);
  };

  const [config, setConfig] = useState({
    logicalPageCount: 6,
    pageSize: 4096,
    workingSetSize: 4,
    algorithm: "FIFO"
  });

  // 逻辑页组件（界面上方）
  const [pages, setPages] = useState(Array.from({ length: config.logicalPageCount }, (_, index) => index));
  const [pagesStatus, setPagesStatus] = useState(pages.map(() => "normal"));

  // 配置面板组件配置信息修改回调
  const onAlgorithmChange = (algorithm) => {
    setWindows(windows => windows.map(win => {
      if (win.id !== windowId) {
        return win;
      }
      return { ...win, title: algorithm };
    }));
  };
  const handleConfigChange = (config) => {
    setConfig(config);
    onAlgorithmChange(config.algorithm);
    setPages(Array.from({ length: config.logicalPageCount }, (_, index) => index));
    setPagesStatus(Array.from({ length: config.logicalPageCount }, (_, index) => index).map(() => "normal"));
    consoleRef.current.info("配置已更新");
  };

  // 工作集组件
  const [WorkSet, setWorkSet] = useState(<div></div>);
  useEffect(() => {
    const worksetProps = {
      className: "h-full",
      ref: workingSetRef,
      size: config.workingSetSize,
      logicalPageCount: config.logicalPageCount,
      pageSize: config.pageSize
    };
    if (config.algorithm === "FIFO") setWorkSet(<FIFO {...worksetProps} />);
    else if (config.algorithm === "LRU") setWorkSet(<LRU {...worksetProps} />);
    else if (config.algorithm === "NUR") setWorkSet(<FIFO {...worksetProps} />);
    else if (config.algorithm === "CLOCK") setWorkSet(<FIFO {...worksetProps} />);
    else setWorkSet(<div></div>);
  }, [config]);


  // 算法执行
  const process = useRef(null);
  const controlPanelRef = useRef(null);
  const setStatus = (page, status) => {
    setPagesStatus(arr => arr.map((s, index) => {
      if (index === page) return status;
      return s;
    }));
  };
  const [configEditable, setConfigEditable] = useState(true);
  const currentAccessIndex = useRef(0);
  const pageRef = useRef(null);
  const runNext = async () => {
    if (currentAccessIndex.current >= parseNumberString(accessSequence).length) {
      consoleRef.current.info("访问序列已执行完毕");
      endAlgorithm();
      return;
    }
    setConfigEditable(false); // 运行时禁止修改配置
    if (currentAccessIndex.current === 0) {
      // 第一次运行时，初始化进程
      process.current = new Process(config);
    }

    /*获取当前访问信息（地址、页号）*/
    const currentAccess = parseNumberString(accessSequence)[currentAccessIndex.current];
    const pageId = accessMode === "id" ? currentAccess : getPageId(currentAccess, config.pageSize);
    const address = accessMode === "id" ? currentAccess * config.pageSize : currentAccess;

    if (pageId >= config.logicalPageCount) {
      consoleRef.current.error(`访问页号${pageId}超出范围，跳过当前访问`);
      currentAccessIndex.current++;
      return;
    }

    process.current.access(address);

    await pageRef.current.getPages()[pageId].flash();// 闪烁正在访问的页面
    setStatus(pageId, "active");// 激活正在访问的页面
    consoleRef.current.info(`正在访问页面${pageId} 逻辑地址${address}`);
    if (!workingSetRef.current.includes(pageId)) {
      const replacedId = workingSetRef.current.access(pageId);
      consoleRef.current.success(`页面${pageId}不在工作集中，将其加入工作集`);
      setTimeout(() => {
        if (replacedId !== null) {
          setStatus(replacedId, "error");
          consoleRef.current.error(`从工作集中移除页面${replacedId}`);
        }
      }, 700);
    } else {
      workingSetRef.current.access(pageId);
      consoleRef.current.success(`页面${pageId}已在工作集中`);
    }
    currentAccessIndex.current++;
  };
  const algorithmIntervalId = useRef(null);
  const runAll = () => {
    runNext();
    algorithmIntervalId.current = setInterval(runNext, 3000);
  };
  const pause = () => {
    clearInterval(algorithmIntervalId.current);
  };
  const terminate = () => {
    consoleRef.current.info("算法已终止");
    endAlgorithm();
  };
  const endAlgorithm = () => {
    clearInterval(algorithmIntervalId.current);
    workingSetRef.current.clear();
    setPagesStatus(pagesStatus.map(() => "normal"));
    currentAccessIndex.current = 0;
    setConfigEditable(true);
    controlPanelRef.current.setShowPauseButton(false);
    consoleRef.current.info(`访问次数：${process.current.accessCount}`);
    consoleRef.current.info(`缺页次数：${process.current.pageFault}`);
    consoleRef.current.info(`命中次数：${process.current.pageHit}`);
    consoleRef.current.info(`缺页率：${process.current.pageFaultRate.toFixed(4) * 100}%`);
  };

  return (
    <div {...rest} >
      <div className={"grid grid-cols-1 grid-rows-2 h-full p-5"}>
        <div className={"pages-container"}>
          <Pages ref={pageRef}
                 all={pages}
                 pagesStatus={pagesStatus}
                 className={"h-full"}
                 disableClick={!configEditable}
                 onClick={async (page, ref) => {
                   if (accessMode === "id") {
                     handleAccessSequenceChange(null, { value: `${accessSequence} ${page}`.trim() });
                   } else {
                     const address = page * config.pageSize;
                     handleAccessSequenceChange(null, { value: `${accessSequence} ${address}`.trim() });
                   }
                 }} />
        </div>
        <div className={"flex flex-row"}>
          <div className={"flex-1 flex flex-col"}>
            <div className={"flex-1 workset-container"}>
              {WorkSet}
            </div>
            <div className={"flex flex-col access-sequence-container"}>
              <div className={"flex flex-row justify-between"}>
                <div className={"mt-1.5"}>
                  访问序列
                </div>
                <RadioGroup value={accessMode}
                            onChange={(_, data) => setAccessMode(data.value)}
                            layout={"horizontal"}
                            disabled={!configEditable}>
                  <Radio value={"id"} label={"输入页号"} />
                  <Radio value={"address"} label={"输入地址"} />
                </RadioGroup>
              </div>
              <Textarea value={accessSequence} onChange={handleAccessSequenceChange} />
            </div>
          </div>
          <div className={"w-1/4 flex flex-col"}>
            <Console className={"overflow-y-scroll flex-1 console-container"} ref={consoleRef} />
            <div>
              <ControlPanel ref={controlPanelRef}
                            config={config}
                            onConfigChange={handleConfigChange}
                            enableSettings={configEditable}
                            onRunNext={runNext}
                            onRunAll={runAll}
                            onPause={pause}
                            onTerminate={terminate}
                            trigger=
                              {
                                <div className={"float-right"}>
                                  <Button icon={<Edit20Regular />}
                                          appearance={"secondary"}
                                          style={{ borderRadius: "100%" }}
                                          size={"large"}
                                          className={"control-panel-container"}>
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
