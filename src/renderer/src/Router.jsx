import { Route, Routes } from "react-router-dom";
import TabListView from "./components/TabListView";
import ApplicationPanel from "./components/ApplicationPanel";
import { useRef, useState } from "react";
import Frame from "./pages/Frame";
import { HashRouter } from "react-router-dom";

function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" exact element={<TabList />} />
      </Routes>
    </HashRouter>
  );
}

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
                         // component: <Main setWindows={setWindows} windowId={id.current} />
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
