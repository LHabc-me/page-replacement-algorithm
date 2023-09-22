import { Link, Button, Divider, Menu, MenuButton, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Popover, PopoverSurface, PopoverTrigger } from "@fluentui/react-components";
import { Settings16Filled, Desktop16Filled, WeatherMoon16Filled, WeatherSunny16Filled } from "@fluentui/react-icons";
import { useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";

function ThemeSelecter(props) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [checkedValues, setCheckedValues] = useState({ "theme": [theme.name] });
  const onCheckedValueChange = (_, { name, checkedItems }) => {
    toggleTheme(checkedItems[0]);
    setCheckedValues((s) => {
      return { ...s, [name]: checkedItems };
    });
  };
  const themes = [
    {
      value: "system",
      icon: <Desktop16Filled />,
      text: "自动"
    },
    {
      value: "light",
      icon: <WeatherSunny16Filled />,
      text: "亮色"
    },
    {
      value: "dark",
      icon: <WeatherMoon16Filled />,
      text: "暗色"
    }
  ];
  return (
    <Menu onCheckedValueChange={onCheckedValueChange}
          checkedValues={checkedValues}>
      <MenuTrigger disableButtonEnhancement>
        <MenuButton icon={themes.find((t) => t.value === theme.name).icon} {...props}>
          {
            themes.find((t) => t.value === theme.name).text
          }
        </MenuButton>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {
            themes.map((theme, index) => {
              return (
                <MenuItemRadio key={index} persistOnClick name={"theme"}
                               icon={theme.icon} value={theme.value}>
                  {theme.text}
                </MenuItemRadio>
              );
            })
          }
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

function AboutThisApp(props) {
  return (
    <div {...props}>
      <div className={"flex flex-row justify-between"}>
        <span>项目地址</span>
        <Link
          as={"a"}
          target={"_blank"}
          href={"https://github.com/LHabc-me/page-replacement-algorithm"}>
          page-replacement-algorithm
        </Link>
      </div>
      <div className={"flex flex-row justify-between"}>
        <span>使用教程</span>
        <Link
          as={"a"}
          target={"_blank"}
          href={""}>
          点击查看示例
        </Link>
      </div>
      <div className={"flex flex-row justify-between"}>
        <span>关于页面置换算法</span>
        <Link
          as={"a"}
          target={"_blank"}
          href={"https://zh.wikipedia.org/zh-cn/%E5%BF%AB%E5%8F%96%E6%96%87%E4%BB%B6%E7%BD%AE%E6%8F%9B%E6%A9%9F%E5%88%B6"}>
          算法介绍
        </Link>
      </div>
    </div>
  );
}

function ApplicationPanel(props) {
  return (
    <div {...props}>
      <Popover positioning={"below"}>
        <PopoverTrigger>
          <Button icon={<Settings16Filled />} appearance={"subtle"}>
          </Button>
        </PopoverTrigger>
        <PopoverSurface>
          <div style={{ height: 220, width: 300 }}
               className={"flex flex-col space-y-5"}>
            <div className={"space-y-2"}>
              <Divider alignContent={"start"}>主题设置</Divider>
              <ThemeSelecter className={"float-right"} />
            </div>
            <div className={"space-y-2"}>
              <Divider alignContent={"start"}>关于软件</Divider>
              <AboutThisApp className={"space-y-2"} />
            </div>
          </div>
        </PopoverSurface>
      </Popover>
    </div>
  );
}

export default ApplicationPanel;
