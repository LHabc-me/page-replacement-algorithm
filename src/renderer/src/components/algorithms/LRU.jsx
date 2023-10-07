import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from "react";
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
  const process = useRef(null);
  const reset = () => {
    process.current = new Process({
      logicalPageCount,
      pageSize,
      workingSetSize: size,
      algorithm: "LRU"
    });
  };

  useEffect(reset, [logicalPageCount, pageSize, size]);
  const includes = (page) => {
    return workingSet.includes(page);
  };
  const moveToBack = (page) => {
    const index = workingSet.indexOf(page);
    if (index === -1) return;
    const newWorkingSet = [...workingSet];
    newWorkingSet.splice(index, 1);
    newWorkingSet.push(page);
    setWorkingSet(newWorkingSet);
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
    reset();
  };
  const isFull = () => {
    return workingSet.length === size;
  };

  // access: 输入页面号，返回缺页号(没有缺页返回null)
  const access = (page) => {
    const result = process.current.access(page * pageSize);
    // console.log(result);
    if (!isFull()) {// 工作集未满
      pushBack(page);
      return null;
    } else if (includes(page)) {// 工作集已满，且包含page，将page移至工作集末尾
      moveToBack(page);
      return null;
    } else {// 工作集已满，且不包含page，将工作集首元素移除，将page加入工作集末尾
      popFront();
      pushBack(page);
      return result;
    }
  };

  useImperativeHandle(ref, () => ({ access, includes, clear }));


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
    <div className={"h-full"}>
      <div className={"h-full flex flex-col justify-center"}>
        <div className={"flex flex-row gap-1.5 justify-center flex-wrap"}>
          <div style={textStyle} className={"items-start"}>
            最旧
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
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
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
            最新
          </div>
        </div>
      </div>
    </div>
  );
});

export default LRU;
