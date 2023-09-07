import { useId, Popover, PopoverSurface, PopoverTrigger, Button, Tooltip, TabList, Tab, Card, CardHeader, Slider, Label } from "@fluentui/react-components";
import { Play16Filled, ChevronDoubleRight16Filled, Square16Filled, Settings16Filled, Pause16Filled, PlayMultiple16Filled, Next16Filled } from "@fluentui/react-icons";
import React, { useEffect, useState, useRef } from "react";

function SecondaryMenu(props) {
  const logicalPageCountLabelId = useId("logicalPageCountLabel");
  const pageSizeLabelId = useId("pageSizeLabel");
  const workingSetCountLabelId = useId("workingSetCountLabel");
  const [open, setOpen] = useState(false);

  const {
    logicalPageCount,
    pageSize,
    workingSetCount,
    algorithm,
    onLogicalPageCountChange,
    onPageSizeChange,
    onWorkingSetCountChange,
    onAlgorithmChange,

    enableSettings
  } = props;

  return (
    <Popover inline withArrow
             positioning={"before"}
             open={open}
             onOpenChange={(e, data) => setOpen(data.open || false)}
             openOnHover
             unstable_disableAutoFocus>
      <PopoverTrigger disableButtonEnhancement>
        <Button icon={<Settings16Filled />} appearance={"subtle"}></Button>
      </PopoverTrigger>
      <PopoverSurface>
        <div className={"flex flex-col"}>
          <TabList className={"w-100"} size={"small"} appearance={"subtle"} selectedValue={algorithm}
                   onTabSelect={onAlgorithmChange}
                   disabled={!enableSettings}>
            <Tab value={"FIFO"}>FIFO</Tab>
            <Tab value={"LRU"}>LRU</Tab>
            <Tab value={"NUR"}>NUR</Tab>
            <Tab value={"CLOCK"}>CLOCK</Tab>
          </TabList>

          <Label htmlFor={logicalPageCountLabelId}>逻辑页面总数<span className={"float-right mr-2"}>{logicalPageCount}</span></Label>
          <Slider value={logicalPageCount} step={1} min={1} max={12} id={logicalPageCountLabelId}
                  onChange={onLogicalPageCountChange}
                  disabled={!enableSettings} />

          <Label htmlFor={pageSizeLabelId}>逻辑页面大小<span className={"float-right mr-2"}>{pageSize}字节</span></Label>
          <Slider value={pageSize} step={1024} min={1024} max={4096 * 2} id={pageSizeLabelId}
                  onChange={onPageSizeChange}
                  disabled={!enableSettings} />

          <Label htmlFor={workingSetCountLabelId}>工作集大小<span className={"float-right mr-2"}>{workingSetCount}</span></Label>
          <Slider value={workingSetCount} step={1} min={1} max={12} id={workingSetCountLabelId}
                  onChange={onWorkingSetCountChange}
                  disabled={!enableSettings} />

          <div className={"flex flex-row"}>
            <Button appearance={"primary"}
                    onClick={() => setOpen(false)}
                    disabled={!enableSettings}>确定</Button>
            <Button onClick={() => setOpen(false)}>取消</Button>
          </div>
        </div>
      </PopoverSurface>
    </Popover>
  );
}


function ControlMenu(props) {
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [tip, setTip] = useState();
  const [enableSettings, setEnableSettings] = useState(true);
  const { trigger } = props;
  return (
    <div style={props.style} className={props.className}>
      {/*按钮提示*/}
      <div ref={setTip}></div>

      <Popover inline positioning={"before"} openOnHover unstable_disableAutoFocus>
        <PopoverTrigger disableButtonEnhancement>
          {trigger}
        </PopoverTrigger>
        <PopoverSurface className={"flex flex-col"} style={{ padding: 5 }}>
          <Tooltip content={"单步执行"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
            <Button icon={<Play16Filled color={"green"} />} appearance={"subtle"}
                    onClick={() => setEnableSettings(false)}></Button>
          </Tooltip>
          {
            showPauseButton ?
              <Tooltip content={"暂停"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
                <Button icon={<Pause16Filled color={"green"} />}
                        appearance={"subtle"}
                        onClick={() => setShowPauseButton(false)}>
                </Button>
              </Tooltip>
              :
              <Tooltip content={"顺序执行"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
                <Button icon={<PlayMultiple16Filled color={"green"} />}
                        appearance={"subtle"}
                        onClick={() => {
                          setShowPauseButton(true);
                          setEnableSettings(false);
                        }}>
                </Button>
              </Tooltip>
          }
          <Tooltip content={"终止"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
            <Button icon={<Square16Filled color={"red"} />} appearance={"subtle"}
                    onClick={() => setEnableSettings(true)}></Button>
          </Tooltip>
          <SecondaryMenu {...props} enableSettings={enableSettings} />
        </PopoverSurface>
      </Popover>
    </div>
  );
}

export { ControlMenu };
