import { Route, Routes } from "react-router-dom";
import { Button, Avatar } from "@fluentui/react-components";
import { TabListView } from "./components/TabListView";
import { ControlMenu } from "./components/ControlMenu";
import * as React from "react";
import { useState } from "react";
import { Templates } from "./page/MenuButton";

function Router() {
  const Tab = <TabListView windows={[]}
                           newTabTitle={"new"}
                           newWindow={() => {
                             return { title: "new", component: <About /> };
                           }} />;
  // const ava = <
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" element={<Templates />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

const Home = (props) => {
  return (
    <div className={"grid h-screen bg-white"}>
      <Button appearance={"primary"} className={"place-self-center"}>
        Home Component
      </Button>
    </div>
  );
};

const Main = (props) => {
  const { setWindows, windowId } = props;
  const [config, setConfig] = useState({
    logicalPageCount: 6,
    pageSize: 4096,
    workingSetCount: 6,
    algorithm: "FIFO"
  });

  function onAlgorithmChange(algorithm) {
    setWindows(windows => windows.map(win => {
      if (win.id !== windowId) {
        return win;
      }
      return { ...win, title: algorithm };
    }));
  }

  return (
    <div className={"h-full bg-red-300"}>
      <ControlMenu config={config}
                   onConfigChange={(config) => {
                     setConfig(config);
                     onAlgorithmChange(config.algorithm);
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
  );
};

function TabList() {
  const [windows, setWindows] = useState([
    {
      id: 0,
      title: "欢迎",
      component: <div>首页</div>,
      closeable: false
    }]);
  const id = useRef(0);
  return (
    <div className={"h-full"}>
      <TabListView windows={windows}
                   newTabTitle={"new"}
                   defaultSelectedId={0}
                   onAdd={(selectTab) => {
                     id.current++;
                     setWindows([...windows,
                       {
                         id: id.current,
                         title: "new",
                         component: <Main setWindows={setWindows} windowId={id.current} />
                       }]);
                     selectTab(id.current);
                   }}
                   onClose={id => setWindows(windows.filter(win => win.id !== id))}
                   before={<ApplicationMenu />}
                   className={"h-screen"} />

    </div>
  );
}

function Test() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(-1);
  return (
    <div className={"flex flex-row"}>
      <Button onClick={() => setList([...list, list.length])}>+1</Button>
      {
        list.map((value, index) => (
          <Avatar key={index} icon={value.toString()}
                  onClick={() => setSelected(index)}
                  active={selected === index ? "active" : ""} />
        ))
      }
    </div>
  );
}

export { Router };
