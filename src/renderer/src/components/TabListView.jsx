import React, { useEffect, useRef, useState } from "react";
import { Button, TabList, Tab, PopoverTrigger, PopoverSurface, Popover } from "@fluentui/react-components";
import { Add12Regular, Dismiss12Regular, MoreHorizontalRegular } from "@fluentui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import KeepAlive from "react-activation";

function TabListView(props) {
  const { windows, newWindow, before, after } = props;
  const [id, setId] = useState(0);
  const [tabs, setTabs] = useState(windows.map(window => {
    const o = { ...window, id };
    setId(id + 1);
    return o;
  }));
  const [selectedTabsId, setSelectedTabsId] = useState([-1]);
  const [hiddenTabsId, setHiddenTabsId] = useState([]); // 标签页过多时隐藏的标签页

  const openedTabsId = useRef([]); // 打开的标签页的id

  function selectTab(tab) {
    if (tab.id !== -1) {
      if (openedTabsId.current.includes(tab.id)) {
        openedTabsId.current.splice(openedTabsId.current.indexOf(tab.id), 1);
      }
      openedTabsId.current.push(tab.id);
    }
    if (selectedTabsId[0] !== tab.id) {
      setSelectedTabsId([tab.id]);
    }
  }

  function closedTab(tab) {
    openedTabsId.current.splice(openedTabsId.current.indexOf(tab.id), 1);
    setSelectedTabsId([openedTabsId.current.at(-1) ?? -1]);
    setTabs(tabs.filter(t => t.id !== tab.id));
  }

  const tabList = useRef(null);// 标签页列表元素
  const tabListRoot = useRef(null);// 标签页列表的根元素
  const tabWidth = 160;

  // 监听tabList的clientWidth变化，当宽度超出时隐藏标签页
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

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
  useEffect(() => {
    handleResize();
  }, [tabs]);

  const tabListView = tabs.map(tab => {
    return {
      id: tab.id,
      component: (
        <Tab key={tab.id}
             value={tab.id}
             icon={tabs.icon}
             onClick={() => selectTab(tab)}
             className={"h-8"}
             style={{ width: tabWidth }}>
          <div className={"flex justify-between"}>
            <span className={"w-80"}>{tab.title}</span>
            {/* 删除标签页 */}
            <Button appearance={"subtle"}
                    size={"small"}
                    onClick={e => {
                      e.stopPropagation();// 防止触发Tab的onClick事件
                      closedTab(tab);
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
                onClick={() => {
                  const win = newWindow();
                  const newTab = { id, title: win.title, component: win.component };
                  setId(id + 1);
                  if (tabList.current.clientWidth + tabWidth > tabListRoot.current.clientWidth) {
                    setHiddenTabsId([...hiddenTabsId, newTab.id]);
                  }
                  setTabs([...tabs, newTab]);
                  selectTab(newTab);
                }}
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
            tabs
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
                      <div>{tab.id}</div>
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
