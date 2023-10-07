import { useContext, useEffect, useRef, useState } from "react";
import HomePage from "./pages/HomePage";
import TabListView from "./components/TabListView";
import ApplicationPanel from "./components/ApplicationPanel";
import Frame from "./pages/Frame";

function App() {
  const [windows, setWindows] = useState([
    {
      id: 0,
      title: "欢迎",
      component: <HomePage className={"h-full"} />,
      closeable: false,
      draggable: false
    }]);
  const id = useRef(0);
  const frames = useRef([]);
  const mutiPagesId = useRef([]);
  return (
    <>
      <div className={"h-full"}>
        <TabListView windows={windows}
                     newTabTitle={"new"}
                     defaultSelectedId={0}
                     onSelectedIdChange={(id) => {
                       mutiPagesId.current = id.filter(i => i !== 0);
                     }}
                     onAdd={(selectTab) => {
                       id.current++;
                       setWindows([...windows,
                         {
                           id: id.current,
                           title: "FIFO",
                           component: <Frame className={"h-full"}
                                             setWindows={setWindows}
                                             windowId={id.current}
                                             ref={ref => {
                                               frames.current[id.current] = ref;
                                               console.log(frames.current);
                                             }} />
                         }]);
                       selectTab(id.current);
                     }}
                     onClose={id => setWindows(windows.filter(win => win.id !== id))}
                     before={<ApplicationPanel
                       className={"application-panel"}
                       onRunNext={() => {
                         for (let i = 0; i < mutiPagesId.current.length; i++) {
                           window[`Frame_${mutiPagesId.current[i]}`].runNext();
                         }
                       }}
                       onPause={() => {
                         for (let i = 0; i < mutiPagesId.current.length; i++) {
                           window[`Frame_${mutiPagesId.current[i]}`].pause();
                         }
                       }}
                       onRunAll={() => {
                         for (let i = 0; i < mutiPagesId.current.length; i++) {
                           window[`Frame_${mutiPagesId.current[i]}`].runAll();
                         }
                       }}
                       onTerminate={() => {
                         for (let i = 0; i < mutiPagesId.current.length; i++) {
                           window[`Frame_${mutiPagesId.current[i]}`].terminate();
                         }
                       }} />}
                     className={"h-screen"} />

      </div>
    </>
  );
}

export default App;
