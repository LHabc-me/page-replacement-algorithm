import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, TabList, Tab, PopoverTrigger, PopoverSurface, Popover } from "@fluentui/react-components";
import { Add12Regular, Dismiss12Regular, MoreHorizontalRegular } from "@fluentui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import KeepAlive from "react-activation";
import { TipContext } from "./TipContext";

/*
windows: {
  id: number,           // 标签页id，唯一
  title: string,        // 标签页标题
  icon: ReactNode       // 标签页图标
  component: ReactNode  // 标签页内容
  closeable: boolean    // 设置为false时可以防止关闭标签页
  draggable: boolean    // 设置为false时可以防止拖动标签页
}
onAdd: function(selectTab: function(id: tab.id)) // selectTab为选择新标签页的回调函数
onClose: function(id: tab.id) // 关闭标签页的回调函数，需要在此函数中删除标签页。会自动选择新标签页。
defaultSelectedValue: number // 默认选中的标签页id
onSelectedIdChange: function(arr: ids) // 选中的标签页id变化时的回调函数
before: ReactNode // 标签页列表前的元素
after: ReactNode // 标签页列表后的元素
 */


function TabListView(props) {
  let { windows, onAdd, onClose, defaultSelectedId, before, after, onSelectedIdChange } = props;


  const { tips, setTips } = useContext(TipContext);// 用于显示教程

  const [selectedTabsId, setSelectedTabsId] = useState([defaultSelectedId]);
  const [hiddenTabsId, setHiddenTabsId] = useState([]); // 标签页过多时隐藏的标签页

  const openedTabsId = useRef([]); // 打开的标签页的id

  function selectTab(id) {
    if (typeof id === "number") {
      if (openedTabsId.current.includes(id)) {
        openedTabsId.current.splice(openedTabsId.current.indexOf(id), 1);
      }
      openedTabsId.current.push(id);
    }
    setWindowsLayout([]);
    setSelectedTabsId([id]);
  }

  function closedTab(id) {
    // 自动选择新标签页
    if (openedTabsId.current.includes(id)) {
      openedTabsId.current.splice(openedTabsId.current.indexOf(id), 1);
    }
    setSelectedTabsId([openedTabsId.current.at(-1)]);
    onClose(id);
  }

  const tabList = useRef(null);// 标签页列表元素
  const tabListRoot = useRef(null);// 标签页列表的根元素
  const tabWidth = 160;

  // 监听tabList的clientWidth变化，当宽度超出时隐藏标签页
  const tabsRef = useRef(windows);
  tabsRef.current = windows;

  const moreBtn = useRef(null);
  const newBtn = useRef(null);
  const beforeElement = useRef(null);
  const afterElement = useRef(null);

  function handleResize() {
    const width = tabWidth * tabsRef.current.length;
    const maxWidth = tabListRoot.current.clientWidth - 32/*moreBtn*/
      - beforeElement.current.clientWidth - afterElement.current.clientWidth - newBtn.current.clientWidth;

    // 计算一共可以显示多少个标签页
    const count = Math.floor((maxWidth - width) / tabWidth);
    if (count >= 0) {// 显示所有隐藏标签页
      setHiddenTabsId([]);
    } else {// 隐藏标签页-count个
      // 取最后-count个标签页
      const last = tabsRef.current.slice(count).map(tab => tab.id);
      setHiddenTabsId([...last]);
    }
  }

  useEffect(() => {
    handleResize();
    if (typeof selectedTabsId[0] === "number") {
      selectTab(selectedTabsId[0]);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    handleResize();
  }, [windows]);

  useEffect(() => {
    openedTabsId.current = openedTabsId.current.filter(id => windows.map(tab => tab.id).includes(id));
  }, [windows]);

  useEffect(() => {
    if (onSelectedIdChange) {
      onSelectedIdChange(selectedTabsId);
    }
  }, [selectedTabsId]);

  // 分屏时的悬浮框相关
  const [hoverHeight, setHoverHeight] = useState(0);
  const [windowsLayout, setWindowsLayout] = useState({});
  const [activeHoverItems, setActiveHoverItems] = useState([]);
  const layouts = {
    leftTop: "col-start-1 row-start-1 row-span-1 col-span-1",
    rightTop: "col-start-2 row-start-1 row-span-1 col-span-1",
    left: "col-start-1 row-start-1 row-span-2 col-span-1",
    right: "col-start-2 row-start-1 row-span-2 col-span-1",
    leftBottom: "col-start-1 row-start-2 row-span-1 col-span-1",
    rightBottom: "col-start-2 row-start-2 row-span-1 col-span-1"
  };
  useEffect(() => {
    const adjustHeight = () => {
      setHoverHeight(tabListRoot.current.clientHeight - tabList.current.clientHeight);
    };
    window.addEventListener("resize", adjustHeight);
    adjustHeight();
    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, [tabListRoot, tabList]);


  const tabListView = windows.map(tab => {
    return {
      id: tab.id,
      component: (
        <Tab key={tab.id}
             value={tab.id}
             icon={tab.icon}
             onClick={() => selectTab(tab.id)}
             onMouseDown={(e) => {
               if (tab.closeable !== false && e.button === 1) {
                 e.stopPropagation();
                 closedTab(tab.id);
               }
             }}
             className={"h-8"}
             style={{ width: tabWidth }}
             draggable={tab.draggable !== false}
             onDrag={(e) => {
               const left = 0, top = tabList.current.clientHeight;
               const width = tabListRoot.current.clientWidth, height = hoverHeight;
               const x = e.clientX, y = e.clientY;
               const positioning = getPostioning(left, top, width, height, x, y);
               if (positioning) {
                 setActiveHoverItems([positioning]);
               } else {
                 setActiveHoverItems([]);
               }
             }}
             onDragEnd={(e) => {
               setActiveHoverItems([]);
               const left = 0, top = tabList.current.clientHeight;
               const width = tabListRoot.current.clientWidth, height = hoverHeight;
               const x = e.clientX, y = e.clientY;
               const positioning = getPostioning(left, top, width, height, x, y);
               if (positioning) {
                 // 检测重叠
                 const unOverLapsId = Object
                   .entries(windowsLayout).filter(([_, layout]) => !layout.includes(positioning) && !positioning.includes(layout))
                   .map(([id]) => Number(id));
                 setWindowsLayout({
                   ...Object.fromEntries(unOverLapsId.map(id => [id, windowsLayout[id]])),
                   [tab.id]: positioning
                 });
                 setSelectedTabsId([...unOverLapsId.filter(id => id !== tab.id), tab.id]);
               }
             }}>
          <div className={"flex justify-between"}>
            <span className={"w-80"}>{tab.title}</span>
            {/* 关闭标签页 */}
            {
              tab.closeable !== false &&
              <Button appearance={"subtle"}
                      size={"small"}
                      onClick={e => {
                        e.stopPropagation();// 防止触发Tab的onClick事件
                        closedTab(tab.id);
                      }}
                      icon={<Dismiss12Regular />}>
              </Button>
            }
          </div>
        </Tab>
      )
    };
  });
  return (
    <div style={props.style} className={props.className} ref={tabListRoot}>
      <div className={"flex flex-row"}>
        <div ref={beforeElement}>
          {before}
        </div>
        <TabList defaultSelectedValue={-1}
                 selectedValue={selectedTabsId.filter(id => typeof id === "number").length === 1 ? selectedTabsId[0] : null}
                 ref={tabList}>
          {tabListView.filter(tab => !hiddenTabsId.includes(tab.id)).map(tab => tab.component)}
        </TabList>

        {/*标签页过多时在此隐藏*/}
        {
          hiddenTabsId.length !== 0 &&
          <Popover positioning={"below"}>
            <PopoverTrigger disableButtonEnhancement>
              <Button icon={<MoreHorizontalRegular />}
                      appearance={"subtle"}
                      ref={moreBtn}>
              </Button>
            </PopoverTrigger>
            <PopoverSurface style={{ padding: 0 }}>
              <TabList vertical
                       defaultValue={-1}
                       selectedValue={selectedTabsId.filter(id => typeof id === "number").length === 1 ? selectedTabsId[0] : null}>
                {tabListView.filter(tab => hiddenTabsId.includes(tab.id)).map(tab => tab.component)}
              </TabList>
            </PopoverSurface>
          </Popover>
        }

        {/* 新建标签，并选择新标签 */}
        <Button appearance={"subtle"}
                onClick={() => {
                  onAdd(selectTab);
                  setTips(o => ({ ...o, run: false }));
                  if (tips.stepIndex !== 0) {
                    setTimeout(() => {
                      setTips(o => ({ ...o, run: true, stepIndex: tips.stepIndex + 1 }));
                    }, 800);
                  }
                }}
                icon={<Add12Regular />}
                ref={newBtn}
                className={"tablistview-newbtn"}>
        </Button>
        <div ref={afterElement}>
          {after}
        </div>
      </div>
      {
        activeHoverItems.length !== 0 &&
        <div className={"absolute w-full left-0 grid grid-cols-2 grid-rows-1 p-0"}
             style={{ height: hoverHeight }}>
          {

            ["left", "right"].map((layout, index) => {
              return (
                <HoverItem key={index}
                           active={activeHoverItems.includes(layout)} />
              );
            })
          }
        </div>
      }
      {
        activeHoverItems.length !== 0 &&
        <div className={"absolute w-full left-0 grid grid-cols-2 grid-rows-2 p-0"}
             style={{ height: hoverHeight }}>
          {
            ["leftTop", "rightTop", "leftBottom", "rightBottom"].map((layout, index) => (
              <HoverItem key={index}
                         active={activeHoverItems.includes(layout)} />
            ))
          }
        </div>
      }
      <AnimatePresence mode={"wait"}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          key={selectedTabsId.filter(id => typeof id === "number").join(" ")}>
          <div className={"grid grid-rows-2 grid-cols-2"}
               style={{ height: hoverHeight }}>
            {
              selectedTabsId.filter(tab => typeof tab === "number").length !== 0 && (
                windows
                  .filter(tab => selectedTabsId.includes(tab.id))
                  .map(tab => (
                      <div key={tab.id}
                           className={layouts[windowsLayout[tab.id]] ?? "col-span-2 row-span-2"}>
                        <KeepAlive name={`TabListView_Component_${tab.id}`}>
                          <div style={{
                            height: (() => {
                              if (!windowsLayout[tab.id]) {
                                return hoverHeight;
                              }
                              return windowsLayout[tab.id].includes("Top") || windowsLayout[tab.id].includes("Bottom")
                                ? hoverHeight / 2 : hoverHeight;
                            })()
                          }}>
                            {tab.component}
                          </div>
                        </KeepAlive>
                      </div>
                    )
                  )
              )
            }
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


function HoverItem(props) {
  const { onDrop, active, onEnter, onLeave } = props;

  const handleDragEnter = () => {
    if (onEnter) {
      onEnter();
    }
  };

  const handleDragLeave = () => {
    if (onLeave) {
      onLeave();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // 阻止默认的拖放行为
  };

  const handleDrop = () => {
    // 在这里执行拖放成功后的操作
    if (onDrop) {
      onDrop();
    }
  };
  return (
    <div className={active ? "bg-gray-500 opacity-50" : ""}
         onDragEnter={handleDragEnter}
         onDragLeave={handleDragLeave}
         onDragOver={handleDragOver}
         onDrop={handleDrop}>
    </div>
  );
}


function getPostioning(left, top, width, height, x, y) {
  if (x > left && x < left + width / 3) {
    // 左侧
    if (y > top && y < top + height / 3) {
      return "leftTop";
    } else if (y > top + height * 2 / 3 && y < top + height) {
      return "leftBottom";
    } else if (y > top + height / 3 && y < top + height * 2 / 3) {
      return "left";
    }
  }
  if (x > left + width * 2 / 3 && x < left + width) {
    // 右侧
    if (y > top && y < top + height / 3) {
      return "rightTop";
    } else if (y > top + height * 2 / 3 && y < top + height) {
      return "rightBottom";
    } else if (y > top + height / 3 && y < top + height * 2 / 3) {
      return "right";
    }
  }
}

export default TabListView;
