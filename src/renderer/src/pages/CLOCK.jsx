import React, { useEffect, useState } from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { motion } from "framer-motion";
import { Add12Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    position: "relative",
    width: "200px",
    height: "200px",
    backgroundColor: "red"
  },
  pointer: {
    // marginTop: "50px",
    // marginLeft: "50px",
    width: "2px",
    height: "70px",
    position: "relative",
    top: "75%",
    left: "50%",
    transformOrigin: "top center",
    backgroundColor: "black"
  }
});

const Clock = () => {
  const classes = useStyles();
  const [angle, setAngle] = useState(-180);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prevAngle) => prevAngle + 6);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={"w-80 h-80 bg-blue-400 grid place-content-center"} id={"box"}>
      {/*<Button icon={<Add12Regular />} className={"w-auto h-auto bg-amber-400"}></Button>*/}
      <div className={"w-52 h-52 bg-red-600"}>
        <motion.div
          className={classes.pointer}
          style={{
            transform: `translate(0, -50px) rotate(${angle}deg)`,
            transition: "transform 1s ease-in-out" // 添加过渡动画
          }}
        />
      </div>
    </div>

  );
};

export default Clock;
