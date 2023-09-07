import { Route, Routes } from "react-router-dom";
import { Button, Avatar } from "@fluentui/react-components";
import { TabListView } from "./components/TabListView";
import { ControlMenu } from "./components/ControlMenu";
import { ApplicationMenu } from "./components/ApplicationMenu";
import { useState } from "react";

function Router() {
  const tab =
    <div>
      <TabListView windows={[]}
                   newTabTitle={"new"}
                   newWindow={() => {
                     return { title: "new", component: <About /> };
                   }}
                   before={<ApplicationMenu />}
                   className={"h-screen"} />

    </div>;
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" element={tab} />
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
    <div className={"grid h-full bg-red-300"}>
      <ControlMenu logicalPageCount={logicalPageCount}
                   pageSize={pageSize}
                   workingSetCount={workingSetCount}
                   algorithm={algorithm}
                   onLogicalPageCountChange={(_, data) => setLogicalPageCount(data.value)}
                   onPageSizeChange={(_, data) => setPageSize(data.value)}
                   onWorkingSetCountChange={(_, data) => setWorkingSetCount(data.value)}
                   onAlgorithmChange={(_, data) => setAlgorithm(data.value)}
                   trigger={<Button>设置</Button>}
                   className={"place-self-center"} />
    </div>
  );
};

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
