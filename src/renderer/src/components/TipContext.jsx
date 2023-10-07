import React, { createContext, useContext, useEffect, useState } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { ThemeContext } from "./ThemeContext";
import "../assets/tips.css";

const TipContext = createContext();
const TipProvider = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  const locale = {
    back: "上一步",
    next: "下一步",
    skip: "跳过",
    close: "下一步",
    last: "完成"
  };
  const [tips, setTips] = useState({
    steps: [
      {
        target: "body",
        content: "欢迎使用页置换算法模拟器！",
        placement: "center"
      },
      {
        target: ".about-project-container",
        content: "在此查看项目简介和使用教程"
      },
      {
        target: ".project-repository-container",
        content: "在此查看项目的仓库地址"
      },
      {
        target: ".application-panel",
        content: "在此切换主题和控制多页面"
      },
      {
        target: ".tablistview-newbtn",
        content: (
          <div>
            点击此处打开新页面，开始使用模拟器<br /><br />
            你可以在此处打开多个页面，每个页面都可以配置不同的算法和访问序列<br /><br />
            拖动页面标题栏到下方可以移动页面<br /><br />
          </div>),
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        hideFooter: true,
        placement: "bottom",
        spotlightClicks: true
      },
      {
        content: "在此配置算法相关参数",
        target: ".control-panel-container"
      },
      {
        target: ".access-sequence-container",
        content: (
          <div>
            在此输入访问序列<br />
            支持以任意分隔符分隔的数字序列，支持以十六进制输入<br />
          </div>
        )
      },
      {
        target: ".console-container",
        content: "算法的执行过程将在此处显示"
      },
      {
        target: ".pages-container",
        content: (
          <div>
            所有的逻辑页面在此处显示<br />
            初始颜色为<span className={"text-blue-500"}>蓝色</span><br />
            处于工作集内部的页面颜色为<span className={"text-green-500"}>绿色</span><br />
            被置换出去的页面颜色为<span className={"text-red-500"}>红色</span><br />
          </div>
        )
      },
      {
        target: ".workset-container",
        content: "工作集在此处显示"
      },
      {
        target: "body",
        content: "教程已结束，开始使用吧！",
        placement: "center"
      }
    ].map(i => ({ ...i, locale })),
    run: false,
    stepIndex: 0
  });
  const handleJoyrideCallback = ({ action, index, status, type }) => {
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setTips({ ...tips, stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setTips({ ...tips, stepIndex: 0, run: false });
    }
  };
  const { steps, run, stepIndex } = tips;
  useEffect(() => {
    window.global = {}; // Fix: https://github.com/gilbarbara/react-joyride/issues/772
  }, []);
  return (
    <TipContext.Provider value={{ tips, setTips }}>
      <Joyride callback={handleJoyrideCallback}
               continuous
               hideCloseButton
               run={run}
               showProgress
               showSkipButton
               steps={steps}
               stepIndex={stepIndex}
               styles={{
                 options: {
                   arrowColor: theme.value.colorNeutralBackground6,
                   backgroundColor: theme.value.colorNeutralBackground6,
                   primaryColor: theme.value.colorBrandBackground,
                   textColor: theme.value.colorNeutralBackgroundInverted
                 }
               }}
      />
      {children}
    </TipContext.Provider>
  );
};

export { TipContext, TipProvider };
