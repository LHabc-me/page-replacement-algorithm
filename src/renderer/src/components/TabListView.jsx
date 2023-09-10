import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, TabList, Tab, PopoverTrigger, PopoverSurface, Popover } from "@fluentui/react-components";
import { Add12Regular, Dismiss12Regular, MoreHorizontalRegular } from "@fluentui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import KeepAlive from "react-activation";


/*
windows: {
  id: number,           // 标签页id，唯一
  title: string,        // 标签页标题
  icon: ReactNode       // 标签页图标
  component: ReactNode  // 标签页内容
  closeable: boolean    // 设置为false时可以防止关闭标签页
}
onAdd: function(selectTab: function(id: tab.id)) // selectTab为选择新标签页的回调函数
onClose: function(id: tab.id)
defaultSelectedValue: number // 默认选中的标签页id
 */
function TabListView(props) {
  const { windows, onAdd, onClose, defaultSelectedValue, before, after } = props;
  const [selectedTabsId, setSelectedTabsId] = useState([defaultSelectedValue ?? -1]);
  const [hiddenTabsId, setHiddenTabsId] = useState([]); // 标签页过多时隐藏的标签页

  const openedTabsId = useRef([]); // 打开的标签页的id

  function selectTab(id) {
    if (id !== -1) {
      if (openedTabsId.current.includes(id)) {
        openedTabsId.current.splice(openedTabsId.current.indexOf(id), 1);
      }
      openedTabsId.current.push(id);
    }
    if (selectedTabsId[0] !== id) {
      setSelectedTabsId([id]);
    }
  }

  function closedTab(tab) {
    openedTabsId.current.splice(openedTabsId.current.indexOf(tab.id), 1);
    setSelectedTabsId([openedTabsId.current.at(-1) ?? -1]);
    onClose(tab.id);
  }

  const tabList = useRef(null);// 标签页列表元素
  const tabListRoot = useRef(null);// 标签页列表的根元素
  const tabWidth = 160;

  // 监听tabList的clientWidth变化，当宽度超出时隐藏标签页
  // const tabsRef = useRef(tabs);
  const tabsRef = useRef(windows);
  // tabsRef.current = tabs;
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
      //取最后-count个标签页
      const last = tabsRef.current.slice(count).map(tab => tab.id);
      setHiddenTabsId([...last]);
    }
  }

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    handleResize();
  }, [windows]);

  const tabListView = windows.map(tab => {
    return {
      id: tab.id,
      component: (
        <Tab key={tab.id}
             value={tab.id}
             icon={tab.icon}
             onClick={() => selectTab(tab.id)}
             className={"h-8"}
             style={{ width: tabWidth }}>
          <div className={"flex justify-between"}>
            <span className={"w-80"}>{tab.title}</span>
            {/* 关闭标签页 */}
            {
              tab.closeable !== false &&
              <Button appearance={"subtle"}
                      size={"small"}
                      onClick={e => {
                        e.stopPropagation();// 防止触发Tab的onClick事件
                        closedTab(tab);
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
                 selectedValue={selectedTabsId[0]}
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
                       selectedValue={selectedTabsId[0]}>
                {tabListView.filter(tab => hiddenTabsId.includes(tab.id)).map(tab => tab.component)}
              </TabList>
            </PopoverSurface>
          </Popover>
        }

        {/* 新建标签，并选择新标签 */}
        <Button appearance={"subtle"}
                onClick={() => onAdd(selectTab)}
                icon={<Add12Regular />}
                ref={newBtn}>
        </Button>
        <div ref={afterElement}>
          {after}
        </div>
      </div>
      <AnimatePresence mode={"wait"}>
        {
          selectedTabsId[0] !== -1 && (
            windows
              .filter(tab => tab.id === selectedTabsId[0])
              .map(tab => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    key={tab.id}>
                    <KeepAlive name={`TabListView_Component_${tab.id}`} key={tab.id}>
                      {tab.component}
                    </KeepAlive>
                  </motion.div>
                )
              )
          )
        }
      </AnimatePresence>
    </div>
  );
}

export { TabListView };
