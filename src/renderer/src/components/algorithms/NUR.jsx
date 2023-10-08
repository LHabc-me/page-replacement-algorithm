import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import PageItem from "../PageItem";
import { Process } from "../../algorithms";

const NUR = forwardRef((props, ref) => {
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
      algorithm: "CLOCK"
    });
  };
  useEffect(reset, [logicalPageCount, pageSize, size]);
  const includes = (page) => {
    return workingSet.includes(page);
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
    const pageEntry = process.current.pageTable.pageTableEntries[page];

    if (includes(page)) {
      // 如果在工作集中，直接更新访问位，并将clockHand指向下一个页面
      if (!pageEntry.accessed) {
        pageEntry.accessed = true;
      }
      return null;
    } else {
      // 如果不在工作集中，判断工作集是否已满
      if (isFull()) {
        // 如果工作集已满，则从clockHand指向的位置开始逐项访问，直至访问至访问位为0的页面，将page替换为该页面
        const index = workingSet.indexOf(result);
        console.log("index: " + index);
        const newWorkingSet = [...workingSet];
        newWorkingSet.splice(index, 1, page);
        setWorkingSet(newWorkingSet);
        console.log("newWorkingSet: " + newWorkingSet);
        console.log("workingSet[result]" + workingSet[result]);
        return result;
      } else {
        // 如果工作集未满，直接将page加入工作集
        pushBack(page);
        console.log("CLOCK.jsx中clockHand: " + process.current.pageTable.clockHand);
        return null;
      }
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
            最新
          </div>
        </div>
      </div>
    </div>
  );
});

export default NUR;
