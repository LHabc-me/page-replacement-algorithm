import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import PageItem from "../PageItem";
import { Process } from "../../algorithms";

const LRU = forwardRef((props, ref) => {
  /**
   *     size: config.workingSetSize,
   *     logicalPageCount: config.logicalPageCount,
   *     pageSize: config.pageSize
   */
  const { size, logicalPageCount, pageSize } = props;
  const [workingSet, setWorkingSet] = useState([]);
  const pagesRef = useRef([]);
  const [process, setProcess] = useState(new Process({
    logicalPageCount,
    pageSize,
    workingSetSize: size,
    algorithm: "LRU"
  }));
  const includes = (page) => {
    if (workingSet.includes(page)) {
      return pagesRef.current[workingSet.indexOf(page)];
    }
    return false;
  };
  const moveToBack = (page) => {
    const index = workingSet.indexOf(page);
    if (index === -1) return;
    const newWorkingSet = [...workingSet];
    newWorkingSet.splice(index, 1);
    newWorkingSet.push(page);
    setWorkingSet(newWorkingSet);

    console.log("workingSet最后一个元素: " + workingSet.indexOf(-1));
  };
  const pushBack = (page) => {
    setWorkingSet(s => [...s, page]);
  };
  const popFront = () => {
    setWorkingSet(s => {
      return s.slice(1);
    });
    return workingSet[0];
  };
  const clear = () => {
    setWorkingSet([]);
  };
  const isFull = () => {
    return workingSet.length === size;
  };

  // add: 输入页面号，返回缺页号(没有缺页返回null)
  const add = (page) => {
    if (!isFull()) {
      pushBack(page);
      return null;
    }
    if (includes(page)) {
      moveToBack(page);
      return null;
    }
    popFront();
    pushBack(page);
    console.log(page * pageSize);
    return process.access(page * pageSize).logicalPage;
  };

  useImperativeHandle(ref, () => ({ add, includes, clear }));


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
    <div>
      <div className={"h-full flex flex-col justify-center"}>
        <div className={"flex flex-row gap-1.5 justify-center flex-wrap"}>
          <div style={textStyle} className={"items-start"}>
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
                                status={"normal"} />
                    </motion.div>
                  ))
                }
              </AnimatePresence>
            </AnimateSharedLayout>
          </div>
          <div style={textStyle} className={"items-end"}>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LRU;