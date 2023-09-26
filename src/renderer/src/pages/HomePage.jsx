import { Image, Text } from "@fluentui/react-components";
import Replace from "../assets/Replace.svg?react";
import { ThemeContext } from "../components/ThemeContext";
import { useContext, useEffect, useState } from "react";


const HomePage = (props) => {
  const { ...rest } = props;
  const preventDrag = (e) => {
    e.preventDefault();
  };

  const { theme } = useContext(ThemeContext);

  const btnClass = "shadow-md w-full h-24 rounded-lg select-none " +
    "hover:shadow-lg transition duration-200 ease-in-out cursor-pointer ";

  const [textStyle, setTextStyle] = useState({
    //透明度
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

  return (
    <div {...rest}>
      <div className={"flex flex-row justify-center items-center h-full"}>
        <div className={"flex-1 flex flex-col justify-center items-center gap-8"}>
          <Text weight={"bold"} style={textStyle} size={500} className={"flex flex-col"} align={"center"}>
            页 面 置 换 算 法 模 拟 器<br />
            V1.0
          </Text>
          <div style={{ width: 180, height: 180 }}>
            <Replace className={"select-none h-full w-full"} fill={theme.value.colorBrandForegroundOnLight} />
          </div>
        </div>

        <div className={"flex-1 flex flex-col gap-6 pr-16"} style={textStyle}>
          <div className={"flex flex-col gap-6"}>
            <Text size={500}>项目相关</Text>

            <div className={btnClass} style={containerStyle}>
              <div className={"h-full flex flex-col justify-center items-start pl-8"}
                   onClick={() => window.open("https://o-rz.github.io")}>
                <Text size={400}>项目简介</Text>
                <Text>有关该项目的介绍</Text>
              </div>
            </div>

            <div className={btnClass} style={containerStyle}>
              <div className={"h-full flex flex-col justify-center items-start pl-8"}>
                <Text size={400}>使用教程</Text>
                <Text>如何使用该项目</Text>
              </div>
            </div>

          </div>

          <div className={"flex flex-col gap-6"}>
            <Text size={500}>仓库地址</Text>

            <div className={btnClass} style={containerStyle}>
              <div className={"h-full flex flex-col justify-center items-start pl-8"}
                   onClick={() => window.open("https://github.com/LHabc-me/page-replacement-algorithm")}>
                <Text size={400}>GitHub</Text>
                <Text>前往GitHub查看该项目</Text>
              </div>
            </div>

            <div className={btnClass} style={containerStyle}>
              <div className={"h-full flex flex-col justify-center items-start pl-8"}
                   onClick={() => window.open("https://github.com/LHabc-me/page-replacement-algorithm")}>
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
