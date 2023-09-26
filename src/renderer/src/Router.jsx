import { HashRouter, Route, Routes } from "react-router-dom";
import * as React from "react";
import { useRef, useState } from "react";
import HomePage from "./pages/HomePage";
import TabListView from "./components/TabListView";
import ApplicationPanel from "./components/ApplicationPanel";
import Frame from "./pages/Frame";

function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TabList />} />
      </Routes>
    </HashRouter>
  );
}

function TabList() {
  const [windows, setWindows] = useState([
    {
      id: 0,
      title: "欢迎",
      component: <HomePage className={"h-full"} />,
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
                         title: "FIFO",
                         component: <Frame className={"h-full"} setWindows={setWindows} windowId={id.current} />
                       }]);
                     selectTab(id.current);
                   }}
                   onClose={id => setWindows(windows.filter(win => win.id !== id))}
                   before={<ApplicationPanel />}
                   className={"h-screen"} />

    </div>
  );
}

export default Router;
