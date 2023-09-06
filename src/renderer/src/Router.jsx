import { AutoMenu } from "./compoments/AutoMenu";
import { Route, Routes } from "react-router-dom";
import { Button } from "@fluentui/react-components";
import { TabListView } from "./components/TabListView";
import { ControlMenu } from "./components/ControlMenu";
import { useState } from "react";

function Router() {
  const Tab = <TabListView windows={[]}
                           newTabTitle={"new"}
                           newWindow={() => {
                             return { title: "new", component: <About /> };
                           }} />;
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" element={<AutoMenu />} />
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
                 setLogicalPageCount={setLogicalPageCount}
                 setPageSize={setPageSize}
                 setWorkingSetCount={setWorkingSetCount}
                 setAlgorithm={setAlgorithm}
                 trigger={<Button className={"float-right"}>设置</Button>} />
  );
};

export default Router;
