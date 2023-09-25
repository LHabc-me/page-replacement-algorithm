import React from "react";
import {
  Button,
  Card,
  Divider,
  Image,
  Label,
  Tab,
  TabList,
  webLightTheme,
  Text,
  Tooltip,
  FluentProvider, webDarkTheme
} from "@fluentui/react-components";
import { AddRegular, ArrowSwapRegular, Memory16Regular } from "@fluentui/react-icons";
import "tailwindcss/tailwind.css";
import Replace from "./assets/Replace.svg";


export const HomePage = () => {
  const preventDrag = (e) => {
    e.preventDefault();
  };

  const btnStyle = "shadow-md w-full h-24 rounded-lg select-none antialiased text-gray-500 " +
    "hover:text-gray-400 hover:shadow-lg subpixel-antialiased transition duration-200 ease-in-out cursor-pointer " +
    "";
  const textStyle = "text-gray-500";

  return (
    <div className={"flex flex-row justify-center items-center h-screen"}>
      <div className={"flex-1 flex flex-col justify-center items-center gap-8"}>
        <Text className={textStyle} size={400}>页 面 置 换 算 法 模 拟 器</Text>
        <div className={"w-32 h-32"}>
          <Image src={Replace} fit={"contain"}
                 onDragStart={preventDrag}
                 draggable="false" style={{ userSelect: "none" }}></Image></div>
        {/*<Card className={"h-full justify-center items-center"}>*/}
        {/*  <footer>*/}

        {/*    <Text className={textStyle}>页 面 置 换 算 法 模 拟 器</Text>*/}
        {/*  </footer>*/}
        {/*</Card>*/}
      </div>

      <div className={"flex-1 flex flex-col gap-6 pr-16"}>
        <div className={"flex flex-col gap-6"}>
          <Text className={textStyle} size={500}>项目相关</Text>

          <div className={btnStyle}>
            <div className={"h-full flex flex-col justify-center items-start pl-8"}>
              <Text size={400}>项目简介</Text>
              <Text>有关该项目的介绍</Text>
            </div>
          </div>

          <div className={btnStyle}>
            <div className={"h-full flex flex-col justify-center items-start pl-8"}>
              <Text size={400}>使用教程</Text>
              <Text>如何使用该项目</Text>
            </div>
          </div>

        </div>

        <div className={"flex flex-col gap-6"}>
          <Text className={textStyle} size={500}>仓库地址</Text>

          <div className={btnStyle}>
            <div className={"h-full flex flex-col justify-center items-start pl-8"}>
              <Text size={400}>GitHub</Text>
              <Text>前往GitHub查看该项目</Text>
            </div>
          </div>

          <div className={btnStyle}>
            <div className={"h-full flex flex-col justify-center items-start pl-8"}>
              <Text size={400}>Gitee</Text>
              <Text>前往Gitee查看该项目</Text>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

