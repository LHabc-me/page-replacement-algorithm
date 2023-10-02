import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import PageItem from "../PageItem";
import { Process } from "../../algorithms";

const NUR = forwardRef((props, ref) => {
  /**
   *     size: config.workingSetSize, // 工作集大小
   *     logicalPageCount: config.logicalPageCount, // 逻辑页数
   *     pageSize: config.pageSize // 页面大小
   */
  const { size, logicalPageCount, pageSize } = props;
  const [workingSet, setWorkingSet] = useState([]);
  const pagesRef = useRef([]);

  const initialPages = {};

  // 在初始化工作集时，为每个页面创建一个页面条目对象
  for (let i = 0; i < logicalPageCount; i++) {
    initialPages[i] = {
      accessed: false,
      modified: false
    };
  }

  // 将初始页面条目对象设置为 pagesRef.current
  pagesRef.current = initialPages;

  const process = useRef(null);
  useEffect(() => {
    process.current = new Process({
      logicalPageCount,
      pageSize,
      workingSetSize: size,
      algorithm: "NUR"
    });
  }, [logicalPageCount, pageSize, size]);
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
  };
  const isFull = () => {
    return workingSet.length === size;
  };

  // access: 输入页面号，返回缺页号(没有缺页返回null)
  // 暂时的想法，后续方案需要调整
  // 分四种情况，工作集未满且不包含page，工作集未满且包含page，工作集已满且不包含page，工作集已满且包含page
  // 工作集未满且不包含page，则直接加入
  // 工作集未满且包含page，则修改page的访问位
  // 工作集已满且不包含page，则从工作集首项开始逐项访问，直至访问至访问位为0的页面，将page替换为该页面
  // 工作集已满且包含page，则修改page的访问位
  const access = (page) => {
    const pageEntry = pagesRef.current[page];

    // 更新页面的 referenced 和 modified 位
    if (!pageEntry.accessed) {
      pageEntry.accessed = true;
    }

    pageEntry.accessed = true; // 标记为已引用
    pageEntry.modified = false; // 假设页面未修改

    const result = process.current.access(page * pageSize);

    if (!isFull()) {
      pushBack(page);
      return null;
    } else {
      // 根据 NUR 算法选择要替换的页面
      let replacePage = null;

      // 遍历工作集，根据页面位选择替换页面
      for (const workingPage of workingSet) {
        const workingPageEntry = pagesRef.current[workingPage];

        if (!workingPageEntry.accessed && !workingPageEntry.modified) {
          // 00 类别的页面，优先选择
          replacePage = workingPage;
          break;
        } else if (!workingPageEntry.accessed && workingPageEntry.modified) {
          // 01 类别的页面
          replacePage = workingPage;
        }
        // 其他情况继续遍历
      }

      if (replacePage !== null) {
        // 找到替换的页面，将其从工作集中移除
        const index = workingSet.indexOf(replacePage);
        workingSet.splice(index, 1);

        // 将新页面加入工作集
        pushBack(page);
        return result;
      } else {
        // 如果没有找到替换的页面，默认选择第一个页面
        const firstPage = popFront(); // 移除第一个页面
        pushBack(page); // 将新页面加入工作集
        return firstPage;
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
                      <PageItem
                        pageNumber={page}
                        ref={ref => pagesRef.current[index] = ref}
                        style={{
                          height: blockLength,
                          width: blockLength,
                          backgroundColor: pagesRef.current[page].accessed ? "lightblue" : "white",
                          border: pagesRef.current[page].modified ? "2px solid red" : "2px solid black"
                        }}
                        status={"normal"}
                      />
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

export default NUR;
