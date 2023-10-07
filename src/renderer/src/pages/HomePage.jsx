import { Text } from "@fluentui/react-components";
import Icon from "../assets/Icon.svg?react";
import { ThemeContext } from "../components/ThemeContext";
import { TipContext } from "../components/TipContext";
import React, { useContext, useEffect, useState } from "react";

const HomePage = (props) => {
  const { ...rest } = props;
  const { theme } = useContext(ThemeContext);

  const btnContainerClass = "shadow-md w-full h-24 rounded-lg select-none " +
    "hover:shadow-lg transition duration-200 ease-in-out cursor-pointer " +
    "hover:opacity-100 opacity-80";

  const [style, setStyle] = useState(null);
  useEffect(() => {
    if (theme.name === "light") {
      setStyle({
        backgroundColor: theme.value.colorNeutralBackground6
      });
    } else {
      setStyle({});
    }
  }, [theme]);

  const [textStyle, setTextStyle] = useState({
    opacity: 0.8
  });
  const [containerStyle, setContainerStyle] = useState({});
  useEffect(() => {
    const containerBackground = theme.name === "dark" ?
      theme.value.colorNeutralBackground6 :
      theme.value.colorNeutralBackground5Selected;
    setContainerStyle({
      backgroundColor: containerBackground
    });
  }, [theme]);
  const { tips, setTips } = useContext(TipContext);
  return (
    <div {...rest}>
      <div className={"flex flex-row justify-center items-center h-full"}
           style={style}>
        <div className={"flex-1 flex flex-col justify-center items-center gap-8"}>
          <Text weight={"bold"} style={textStyle} size={500} className={"flex flex-col"}
                align={"center"}>
            页 面 置 换 算 法 模 拟 器<br />
            V1.0
          </Text>
          <div style={{ width: 180, height: 180 }}>
            <Icon className={"select-none h-full w-full"}
                  fill={theme.value.colorBrandBackground} />
          </div>
        </div>

        <div className={"flex-1 flex flex-col gap-6 pr-16"}>
          <div className={"flex flex-col gap-6 about-project-container"}>
            <Text size={500} style={textStyle}>项目相关</Text>
            <div className={btnContainerClass} style={containerStyle}>
              <div className={"h-full flex flex-col justify-center items-start pl-8"}
                   onClick={() => window.open("https://o-rz.github.io")}>
                <Text size={400}>算法简介</Text>
                <Text>有关页面置换算法的介绍</Text>
              </div>
            </div>

            <div className={btnContainerClass} style={containerStyle}
                 onClick={() => setTips(o => ({ ...o, run: true, stepIndex: 0 }))}>
              <div className={"h-full flex flex-col justify-center items-start pl-8"}>
                <Text size={400}>使用教程</Text>
                <Text>如何使用该项目</Text>
              </div>
            </div>
          </div>

          <div className={"flex flex-col gap-6 project-repository-container"}>
            <Text size={500} style={textStyle}>仓库地址</Text>
            <div className={btnContainerClass} style={containerStyle}>
              <div className={"h-full flex flex-col justify-center items-start pl-8"}
                   onClick={() => window.open("https://github.com/LHabc-me/page-replacement-algorithm")}>
                <Text size={400}>GitHub</Text>
                <Text>前往GitHub查看该项目</Text>
              </div>
            </div>

            <div className={btnContainerClass} style={containerStyle}>
              <div className={"h-full flex flex-col justify-center items-start pl-8"}
                   onClick={() => window.open("https://gitee.com/kina0630/page-replacement-algorithm")}>
                <Text size={400}>Gitee</Text>
                <Text>前往Gitee查看该项目</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
