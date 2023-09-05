import React, { useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, TabList, Tab } from "@fluentui/react-components";
import { Add12Regular, Dismiss12Regular, DocumentRegular, DocumentFilled, bundleIcon } from "@fluentui/react-icons";
import { ThemeContext } from "../components/ThemeContext";

function TabView(props) {
  const { windows, newTabTitle } = props;
  const [tabs, setTabs] = useState(windows.map((window, index) => ({ id: index, title: window.title })));
  const [id, setId] = useState(windows.length);
  const navigate = useNavigate();
  const Document = bundleIcon(DocumentFilled, DocumentRegular);

  return (
    <div>
      <div className={"flex flex-row"}>
        <TabList defaultSelectedValue={0}>
          {tabs.map((tab) => {
            return (
              <Tab key={tab.id}
                   value={tab.id}
                   icon={tabs.icon /*?? <Document />*/}
                   onClick={() => navigate(tab.url)}
                   className={"h-8 w-40"}>
                <div className={"flex justify-between"}>
                  <span className={"w-80"}>
                    {tab.title}
                  </span>
                  {/*  删除标签页*/}
                  <Button appearance={"subtle"}
                          size={"small"}
                          onClick={(event) => {
                            event.stopPropagation();
                            setTabs(tabs.filter((t) => t.id !== tab.id));
                          }}
                          icon={<Dismiss12Regular />}
                          tabIndex={-1}>
                  </Button>
                </div>
              </Tab>
            );
          })}
        </TabList>
        {/*新建标签，并选择新标签*/}
        <Button appearance={"subtle"}
                onClick={() => {
                  setTabs([...tabs, { id: id, title: newTabTitle }]);
                  setId(id + 1);
                }}
                icon={<Add12Regular />}>
        </Button>
      </div>
      <Outlet />
    </div>
  );
}

export { TabView };
