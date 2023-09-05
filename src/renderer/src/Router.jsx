import { Route, Routes } from "react-router-dom";
import { Button, Select } from "@fluentui/react-components";
import Nav from "./Nav";
import { TabView } from "./components/TabView";

function Router() {
  const windows = [{ id: 1, title: "a", url: "/about" }, { id: 2, title: "a" }, { id: 3, title: "a" }];
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" element={<Nav />} />
      <Route path="/about" element={<About />} />
      <Route path="/" element={<TabView windows={windows} newTabTitle={"new"} />}>
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

const Home = (props) => {
  return (
    <div className={"grid h-screen bg-white"}>
      <Button appearance={"primary"} className={"place-self-center"}>
        Home Compontent
      </Button>
    </div>
  );
};

const About = (props) => {
  return (
    <Select>
      <option>Red</option>
      <option>Green</option>
      <option>Blue</option>
    </Select>
  );
};

export default Router;
