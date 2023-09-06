import * as React from "react";
import { AlgorithmSelect } from "./compoments/AlgorithmSelect";
import { Button, Text } from "@fluentui/react-components";
import { ArgumentsSetting } from "./compoments/ArgumentsSetting";

export const SinglePage = () => {

  const renderTabs = () => {
    return (
      <AlgorithmSelect></AlgorithmSelect>
    );
  };

  return (
    <div className={"min-w-480 grid grid-cols-10 h-screen w-full"}>
      <div className={"col-span-7 grid grid-rows-3 bg-blue-600 h-screen w-full"}>
        <Button className={"place-self-center"}>Home</Button>
        {/*<Button className={"place-self-center"}>Home</Button>*/}
        {/*<Button className={"place-self-center"}>Home</Button>*/}
      </div>
      <div className={"container col-span-3 grid grid-rows-9 bg-black"}>
        <Text className={"row-span-1 bg-amber-50 flex"} align={"center"} font="numeric" block={true}>算法选择</Text>
        <div className={"container w-auto min-w-fit"}>{renderTabs()}</div>
        {/*<span className={"row-span-1"}></span>*/}
        <div className={"row-span-3 bg-emerald-300"}><ArgumentsSetting></ArgumentsSetting></div>
      </div>
    </div>
  );
};
