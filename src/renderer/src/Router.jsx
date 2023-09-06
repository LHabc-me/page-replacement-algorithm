import { Link, Route, Routes } from "react-router-dom";
import { Button, Select } from "@fluentui/react-components";
import { TabView } from "./components/TabView";
import * as React from "react";
import { SinglePage } from "./SinglePage";
import { AutoMenu } from "./compoments/AutoMenu";

function Router() {
  const Tab = <TabView windows={[]}
                       newTabTitle={"new"}
                       newWindow={() => {
                         return { title: "new", component: <Home /> };
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
  return (
    <>
      <Select>
        <option>Red</option>
        <option>Green</option>
        <option>Blue</option>
      </Select>
      <Button>
        <Link to={"/"}>Return</Link>
      </Button></>
  );
};

export default Router;
