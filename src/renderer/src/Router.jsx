import { Route, Routes } from "react-router-dom";
import { Button, Select } from "@fluentui/react-components";
import { TabView } from "./components/TabView";

function Router() {
  const Tab = <TabView windows={[]}
                       newTabTitle={"new"}
                       newWindow={() => {
                         return { title: "new", component: <Home /> };
                       }} />;
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" element={Tab}>
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
