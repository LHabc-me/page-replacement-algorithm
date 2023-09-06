import React, { useState } from "react";
import { Button, TabList, Tab } from "@fluentui/react-components";
import { Add12Regular, Dismiss12Regular } from "@fluentui/react-icons";
import { AnimatePresence, motion } from "framer-motion";

function TabListView(props) {
  const { windows, newWindow } = props;
  const [id, setId] = useState(0);
  const [tabs, setTabs] = useState(windows.map((window) => {
    const o = { ...window, id };
    setId(id + 1);
    return o;
  }));
  const [selectedTabId, setSelectedTabId] = useState(-1);
  const ActiveTabComponent = tabs.find((tab) => tab.id === selectedTabId)?.component ?? <div>Not Found</div>;
  const [openedTabsId, setOpenedTabsId] = useState([]);
  return (
    <div>
      <div className={"flex flex-row"}>
        <TabList defaultSelectedValue={0}
                 selectedValue={selectedTabId}>
          {tabs.map(tab => {
            return (
              <Tab key={tab.id}
                   value={tab.id}
                   icon={tabs.icon}
                   onClick={() => {
                     if (selectedTabId !== tab.id) {
                       setSelectedTabId(tab.id);
                       setOpenedTabsId([...openedTabsId, tab.id]);
                     }
                   }}
                   className={"h-8 w-40"}
              >
                <div className={"flex justify-between"}>
                  <span className={"w-80"}>{tab.title}</span>
                  {tab.id === selectedTabId ? <motion.div className={"underline"} layoutId={"underline"} /> : null}
                  {/* 删除标签页 */}
                  <Button appearance={"subtle"}
                          size={"small"}
                          onClick={(event) => {
                            event.stopPropagation();
                            setTabs(tabs.filter((t) => t.id !== tab.id));
                            const opened = openedTabsId.filter((t) => t !== tab.id);
                            setOpenedTabsId(opened.filter((t) => t !== tab.id));
                            setSelectedTabId(opened[opened.length - 1] ?? -1);
                          }}
                          icon={<Dismiss12Regular />}
                          tabIndex={-1}
                  ></Button>
                </div>
              </Tab>
            );
          })}
        </TabList>
        {/* 新建标签，并选择新标签 */}
        <Button appearance={"subtle"}
                onClick={() => {
                  const win = newWindow();
                  const newTab = { id, title: win.title, component: win.component };
                  setId(id + 1);
                  setTabs([...tabs, newTab]);
                  setSelectedTabId(newTab.id);
                  setOpenedTabsId([...openedTabsId, newTab.id]);
                }}
                icon={<Add12Regular />}
        ></Button>
      </div>
      <AnimatePresence mode={"wait"}>
        {selectedTabId !== -1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            key={selectedTabId}
          >
            {/* 放置活跃标签页的component */}
            {ActiveTabComponent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { TabListView };
