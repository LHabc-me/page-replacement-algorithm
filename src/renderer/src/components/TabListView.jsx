import React, { useEffect, useRef, useState } from "react";
import { Button, TabList, Tab, PopoverTrigger, PopoverSurface, Popover } from "@fluentui/react-components";
import { Add12Regular, Dismiss12Regular, MoreHorizontalRegular } from "@fluentui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import KeepAlive from "react-activation";

function TabListView(props) {
  const { windows, newWindow, before, after } = props;
  const [id, setId] = useState(0);
  const [tabs, setTabs] = useState(windows.map((window) => {
    const o = { ...window, id };
    setId(id + 1);
    return o;
  }));
  const [selectedTabId, setSelectedTabId] = useState(-1);
  const [openedTabsId, setOpenedTabsId] = useState([]); // 所有可用标签页
  const [hiddenTabsId, setHiddenTabsId] = useState([]); // 标签页过多时隐藏的标签页

  const tabList = useRef(null);// 标签页列表元素
  const tabListRoot = useRef(null);// 标签页列表的根元素
  const tabWidth = 160;

  // 监听tabList的clientWidth变化，当宽度超出时隐藏标签页
  const openedTabsIdRef = useRef(openedTabsId);
  openedTabsIdRef.current = openedTabsId;

  const moreBtn = useRef(null);
  const newBtn = useRef(null);
  const beforeElement = useRef(null);
  const afterElement = useRef(null);

  function handleResize() {
    const width = tabWidth * openedTabsIdRef.current.length;
    const maxWidth = tabListRoot.current.clientWidth - 32/*moreBtn*/
      - beforeElement.current.clientWidth - afterElement.current.clientWidth - newBtn.current.clientWidth;

    // 计算一共可以显示多少个标签页
    const count = Math.floor((maxWidth - width) / tabWidth);
    if (count >= 0) {// 显示所有隐藏标签页
      setHiddenTabsId([]);
    } else {// 隐藏标签页-count个
      //取最后-count个标签页
      const last = openedTabsIdRef.current.slice(count);
      // console.log(last);
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
  useEffect(() => {
    handleResize();
  }, [openedTabsId]);

  const tabListView = tabs.map(tab => {
    return {
      id: tab.id,
      component: (
        <Tab key={tab.id}
             value={tab.id}
             icon={tabs.icon}
             onClick={() => {
               if (selectedTabId !== tab.id) {
                 setSelectedTabId(tab.id);
               }
             }}
             className={"h-8"}
             style={{ width: tabWidth }}>
          <div className={"flex justify-between"}>
            <span className={"w-80"}>{tab.title}</span>
            {/* 删除标签页 */}
            <Button appearance={"subtle"}
                    size={"small"}
                    onClick={() => {
                      setTabs(tabs.filter((t) => t.id !== tab.id));
                      const opened = openedTabsId.filter((t) => t !== tab.id);
                      setOpenedTabsId(opened.filter((t) => t !== tab.id));
                      if (selectedTabId === tab.id) {
                        setSelectedTabId(opened[opened.length - 1] ?? -1);
                      }
                    }}
                    icon={<Dismiss12Regular />}>
            </Button>
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
        <TabList defaultSelectedValue={0}
                 selectedValue={selectedTabId}
                 ref={tabList}>
          {tabListView.filter((tab) => !hiddenTabsId.includes(tab.id)).map((tab) => tab.component)}
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
              <TabList selectedValue={selectedTabId} vertical>
                {tabListView.filter((tab) => hiddenTabsId.includes(tab.id)).map((tab) => tab.component)}
              </TabList>
            </PopoverSurface>
          </Popover>
        }

        {/* 新建标签，并选择新标签 */}
        <Button appearance={"subtle"}
                onClick={() => {
                  const win = newWindow();
                  const newTab = { id, title: win.title, component: win.component };
                  setId(id + 1);
                  if (tabList.current.clientWidth + tabWidth > tabListRoot.current.clientWidth) {
                    setHiddenTabsId([...hiddenTabsId, newTab.id]);
                  }
                  setTabs([...tabs, newTab]);
                  setSelectedTabId(newTab.id);
                  setOpenedTabsId([...openedTabsId, newTab.id]);
                }}
                icon={<Add12Regular />}
                ref={newBtn}>
        </Button>
        <div ref={afterElement}>
          {after}
        </div>
      </div>
      <AnimatePresence mode={"wait"}>
        {selectedTabId !== -1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            key={selectedTabId}>
            <KeepAlive>
              <TabList>
                {/* 放置活跃标签页的component */}
                {tabs.find((tab) => tab.id === selectedTabId)?.component ?? <div>Not Found</div>}
              </TabList>
            </KeepAlive>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { TabListView };
