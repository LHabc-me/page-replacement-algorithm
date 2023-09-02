import { Route, Routes } from "react-router-dom";
import { Button } from "@fluentui/react-components";

function Router() {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

const Home = (props) => {
  return (
    <div className={"grid h-screen bg-black"}>
      <Button appearance={"primary"} className={"place-self-center"}>
        Home Compontent
      </Button>
    </div>
  );
};

const About = (props) => {
  return <div>About Compontent</div>;
};

export default Router;
