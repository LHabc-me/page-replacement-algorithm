import { Route, Routes } from "react-router-dom";
import { Button, Select } from "@fluentui/react-components";
import Nav from "./Nav";

function Router() {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" element={<Nav />} />
      <Route path="/about" element={<About />} />
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
