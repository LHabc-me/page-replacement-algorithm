import { AutoMenu } from "./compoments/AutoMenu";
import { Route, Routes } from "react-router-dom";
import { Button, Divider } from "@fluentui/react-components";
import { TabListView } from "./components/TabListView";
import { ControlMenu } from "./components/ControlMenu";
import { useState } from "react";
import { Settings16Filled } from "@fluentui/react-icons";

function Router() {
  const Tab =
    <div>
      <TabListView windows={[]}
                   newTabTitle={"new"}
                   newWindow={() => {
                     return { title: "new", component: <About /> };
                   }}
                   before={
                     <Button icon={<Settings16Filled />} appearance={"subtle"}>
                     </Button>
                   } />

    </div>;
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" element={Tab} />
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

const About = (props) => {
  const [logicalPageCount, setLogicalPageCount] = useState(6);
  const [pageSize, setPageSize] = useState(4096);
  const [workingSetCount, setWorkingSetCount] = useState(6);
  const [algorithm, setAlgorithm] = useState("FIFO");

  return (
    <ControlMenu logicalPageCount={logicalPageCount}
                 pageSize={pageSize}
                 workingSetCount={workingSetCount}
                 algorithm={algorithm}
                 onLogicalPageCountChange={(_, data) => setLogicalPageCount(data.value)}
                 onPageSizeChange={(_, data) => setPageSize(data.value)}
                 onWorkingSetCountChange={(_, data) => setWorkingSetCount(data.value)}
                 onAlgorithmChange={(_, data) => setAlgorithm(data.value)}
                 trigger={<Button className={"float-left"}>设置</Button>} />
  );
};

export { Router };
