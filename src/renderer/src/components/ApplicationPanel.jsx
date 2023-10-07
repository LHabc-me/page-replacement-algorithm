import { Link, Button, Divider, Menu, MenuButton, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Popover, PopoverSurface, PopoverTrigger, Tooltip } from "@fluentui/react-components";
import { Settings16Filled, Desktop16Filled, WeatherMoon16Filled, WeatherSunny16Filled, Play16Filled, Pause16Filled, PlayMultiple16Filled, Square16Filled } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
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

function MutiPage(props) {
  const { onRunNext, onPause, onRunAll, onTerminate, ...rest } = props;
  const [tip, setTip] = useState();

  return (
    <>
      <div ref={setTip}></div>
      <div className={"flex flex-row justify-end"}>
        <Tooltip content={"单步执行"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
          <Button icon={<Play16Filled color={"green"} />} appearance={"subtle"}
                  onClick={onRunNext}></Button>
        </Tooltip>
        <Tooltip content={"顺序执行"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
          <Button icon={<PlayMultiple16Filled color={"green"} />}
                  appearance={"subtle"}
                  onClick={onRunAll}>
          </Button>
        </Tooltip>
        <Tooltip content={"暂停"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
          <Button icon={<Pause16Filled color={"green"} />}
                  appearance={"subtle"}
                  onClick={onPause}>
          </Button>
        </Tooltip>
        <Tooltip content={"终止"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
          <Button icon={<Square16Filled color={"red"} />} appearance={"subtle"}
                  onClick={onTerminate}></Button>
        </Tooltip>
      </div>
    </>
  );
}

function ApplicationPanel(props) {
  const { onRunNext, onPause, onRunAll, onTerminate, ...rest } = props;
  const [style, setStyle] = useState(null);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    if (theme.name === "light") {
      setStyle({
        // backgroundColor: theme.value.colorNeutralBackground6
      });
    } else {
      setStyle({});
    }
  }, [theme]);
  return (
    <div {...rest}>
      <Popover positioning={"below"}>
        <PopoverTrigger>
          <Button icon={<Settings16Filled />} appearance={"subtle"}>
          </Button>
        </PopoverTrigger>
        <PopoverSurface style={style}>
          <div style={{ width: 200 }}
               className={"flex flex-col space-y-5"}>
            <div className={"space-y-2"}>
              <Divider alignContent={"start"}>主题设置</Divider>
              <ThemeSelecter className={"float-right"} />
            </div>
            {/*<div className={"space-y-2"}>*/}
            {/*  <Divider alignContent={"start"}>关于软件</Divider>*/}
            {/*  <AboutThisApp className={"space-y-2"} />*/}
            {/*</div>*/}
            <div className={"space-y-2"}>
              <Divider alignContent={"start"}>多页面功能</Divider>
              <MutiPage className={"space-y-2"}
                        onRunNext={onRunNext}
                        onPause={onPause}
                        onRunAll={onRunAll}
                        onTerminate={onTerminate} />
            </div>
          </div>
        </PopoverSurface>
      </Popover>
    </div>
  );
}

export default ApplicationPanel;
