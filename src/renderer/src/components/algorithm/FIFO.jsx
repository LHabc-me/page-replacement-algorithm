import { forwardRef, useEffect, useImperativeHandle, useState, useRef } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import PageItem from "../PageItem";

const FIFO = forwardRef((props, ref) => {
  const { size, ...rest } = props;
  const [workingSet, setWorkingSet] = useState([]);
  const pagesRef = useRef([]);
  const pushBack = (page) => {
    if (workingSet.length === size) {
      setWorkingSet(s => [...s.slice(1), page]);
    } else {
      setWorkingSet(s => [...s, page]);
    }
  };
  const popFront = () => {
    setWorkingSet(s => {
      return s.slice(1);
    });
  };
  const includes = (page) => {
    if (workingSet.includes(page)) {
      return pagesRef.current[workingSet.indexOf(page)];
    }
    return false;
  };
  const clear = () => {
    setWorkingSet(Array.from({ length: size }, () => null));
  };

  useImperativeHandle(ref, () => ({ pushBack, popFront, includes, clear }));

  const blockLength = 36;
  const textStyle = {
    writingMode: "vertical-rl",
    textOrientation: "upright",
    userSelect: "none",
    width: blockLength,
    height: blockLength,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  };

  return (
    <div {...rest}>
      <div className={"h-full flex flex-col justify-center"} onClick={popFront}>
        <div className={"flex flex-row gap-1.5 justify-center flex-wrap"}>
          <div style={textStyle} className={"items-start"}>
            队首
          </div>
          <div className={"flex flex-row gap-1.5 justify-center flex-wrap"}
               style={{
                 width: blockLength * (size + 1) + 6 * size
               }}>
            <AnimateSharedLayout>
              <AnimatePresence initial={false}>
                {
                  workingSet.map((page, index) => (
                    <motion.div
                      key={page}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}>
                      <PageItem pageNumber={page}
                                ref={ref => pagesRef.current[index] = ref}
                                style={{ height: blockLength, width: blockLength }}
                                active />
                    </motion.div>
                  ))
                }
              </AnimatePresence>
            </AnimateSharedLayout>
          </div>
          <div style={textStyle} className={"items-end"}>
            队尾
          </div>
        </div>
      </div>
    </div>
  );
});

export default FIFO;
