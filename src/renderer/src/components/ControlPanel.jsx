import { useId, Popover, PopoverSurface, PopoverTrigger, Button, Tooltip, TabList, Tab, Slider, Label } from "@fluentui/react-components";
import { Play16Filled, Square16Filled, Settings16Filled, Pause16Filled, PlayMultiple16Filled } from "@fluentui/react-icons";
import { useState, forwardRef, useImperativeHandle } from "react";

function SecondaryMenu(props) {
  const logicalPageCountLabelId = useId("logicalPageCountLabel");
  const pageSizeLabelId = useId("pageSizeLabel");
  const workingSetSizeLabelId = useId("workingSetSizeLabel");
  const [open, setOpen] = useState(false);

  const {
    config,
    onConfigChange,
    enableSettings
  } = props;
  const [newConfig, setNewConfig] = useState(config);


  function onLogicalPageCountChange(_, data) {
    setNewConfig({ ...newConfig, logicalPageCount: data.value });
  }

  function onPageSizeChange(_, data) {
    setNewConfig({ ...newConfig, pageSize: data.value });
  }

  function onWorkingSetSizeChange(_, data) {
    setNewConfig({ ...newConfig, workingSetSize: data.value });
  }

  function onAlgorithmChange(_, data) {
    setNewConfig({ ...newConfig, algorithm: data.value });
  }

  return (
    <Popover inline withArrow
             positioning={"before"}
             open={open}
             onOpenChange={(e, data) => setOpen(data.open || false)}
             openOnHover
             unstable_disableAutoFocus>
      <PopoverTrigger disableButtonEnhancement>
        <Button icon={<Settings16Filled />} appearance={"subtle"} onClick={() => setNewConfig(config)}></Button>
      </PopoverTrigger>
      <PopoverSurface>
        <div className={"flex flex-col"}>
          {
            config.algorithm &&
            <TabList className={"w-100"} size={"small"} appearance={"subtle"} selectedValue={newConfig.algorithm}
                     onTabSelect={onAlgorithmChange}
                     disabled={!enableSettings}>
              <Tab value={"FIFO"}>FIFO</Tab>
              <Tab value={"LRU"}>LRU</Tab>
              <Tab value={"NUR"}>NUR</Tab>
              <Tab value={"CLOCK"}>CLOCK</Tab>
            </TabList>
          }
          {
            config.logicalPageCount &&
            <>
              <Label htmlFor={logicalPageCountLabelId}>逻辑页面总数<span className={"float-right mr-2"}>{newConfig.logicalPageCount}</span></Label>
              <Slider value={newConfig.logicalPageCount} step={1} min={1} max={12} id={logicalPageCountLabelId}
                      onChange={onLogicalPageCountChange}
                      disabled={!enableSettings} />
            </>
          }
          {
            config.pageSize &&
            <>
              <Label htmlFor={pageSizeLabelId}>逻辑页面大小<span className={"float-right mr-2"}>{newConfig.pageSize}字节</span></Label>
              <Slider value={newConfig.pageSize} step={1024} min={1024} max={4096 * 2} id={pageSizeLabelId}
                      onChange={onPageSizeChange}
                      disabled={!enableSettings} />
            </>
          }
          {
            config.workingSetSize &&
            <>
              <Label htmlFor={workingSetSizeLabelId}>工作集大小<span className={"float-right mr-2"}>{newConfig.workingSetSize}</span></Label>
              <Slider value={newConfig.workingSetSize} step={1} min={1} max={12} id={workingSetSizeLabelId}
                      onChange={onWorkingSetSizeChange}
                      disabled={!enableSettings} />
            </>
          }
          <div className={"flex flex-row"}>
            <Button appearance={"primary"}
                    onClick={() => {
                      onConfigChange(newConfig);
                    }}
                    disabled={!enableSettings || JSON.stringify(newConfig) === JSON.stringify(config)}>确定</Button>
            <Button onClick={() => setOpen(false)}>取消</Button>
          </div>
        </div>
      </PopoverSurface>
    </Popover>
  );
}


const ControlPanel = forwardRef((props, ref) => {
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [tip, setTip] = useState();
  const {
    trigger, onRunNext, onRunAll, onPause, onTerminate, enableSettings,
    config, onConfigChange, ...rest
  } = props;
  useImperativeHandle(ref, () => ({ setShowPauseButton }));
  return (
    <div {...rest}>
      {/*按钮提示*/}
      <div ref={setTip}></div>

      <Popover inline positioning={"before"} openOnHover unstable_disableAutoFocus>
        <PopoverTrigger disableButtonEnhancement>
          {trigger}
        </PopoverTrigger>
        <PopoverSurface className={"flex flex-col"} style={{ padding: 5 }}>
          <Tooltip content={"单步执行"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
            <Button icon={<Play16Filled color={"green"} />} appearance={"subtle"}
                    onClick={onRunNext}></Button>
          </Tooltip>
          {
            showPauseButton ?
              <Tooltip content={"暂停"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
                <Button icon={<Pause16Filled color={"green"} />}
                        appearance={"subtle"}
                        onClick={() => {
                          setShowPauseButton(false);
                          onPause();
                        }}>
                </Button>
              </Tooltip>
              :
              <Tooltip content={"顺序执行"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
                <Button icon={<PlayMultiple16Filled color={"green"} />}
                        appearance={"subtle"}
                        onClick={() => {
                          setShowPauseButton(true);
                          onRunAll();
                        }}>
                </Button>
              </Tooltip>
          }
          <Tooltip content={"终止"} relationship={"label"} mountNode={tip} withArrow positioning={"before"}>
            <Button icon={<Square16Filled color={"red"} />} appearance={"subtle"}
                    onClick={() => {
                      setShowPauseButton(false);
                      onTerminate();
                    }}></Button>
          </Tooltip>
          <SecondaryMenu {...props} enableSettings={enableSettings} />
        </PopoverSurface>
      </Popover>
    </div>
  );
});
export default ControlPanel;
