import { Route, Routes } from "react-router-dom";
import { Button, Avatar } from "@fluentui/react-components";
import { TabListView } from "./components/TabListView";
import { ControlMenu } from "./components/ControlMenu";
import { ApplicationMenu } from "./components/ApplicationMenu";
import { useRef, useState } from "react";

function Router() {

  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" exact element={<TabList />} />
      <Route path="/about" element={<Main />} />
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
  const [logicalPageCount, setLogicalPageCount] = useState(6);
  const [pageSize, setPageSize] = useState(4096);
  const [workingSetCount, setWorkingSetCount] = useState(6);
  const [algorithm, setAlgorithm] = useState("FIFO");

  function onAlgorithmChange(_, data) {
    setAlgorithm(data.value);
    setWindows(windows => windows.map(win => {
      if (win.id !== windowId) {
        return win;
      }
      return { ...win, title: data.value };
    }));
  }

  return (
    <div className={"grid h-full bg-red-300"}>
      <ControlMenu logicalPageCount={logicalPageCount}
                   pageSize={pageSize}
                   workingSetCount={workingSetCount}
                   algorithm={algorithm}
                   onLogicalPageCountChange={(_, data) => setLogicalPageCount(data.value)}
                   onPageSizeChange={(_, data) => setPageSize(data.value)}
                   onWorkingSetCountChange={(_, data) => setWorkingSetCount(data.value)}
                   onAlgorithmChange={onAlgorithmChange}
                   trigger={<Button>设置</Button>}
                   className={"place-self-center"} />
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
    <div>
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
