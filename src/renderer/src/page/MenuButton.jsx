import * as React from "react";
import { useState } from "react";
import { Avatar, Button, Card, Input, makeStyles, shorthands, Switch, Text, tokens } from "@fluentui/react-components";
import {
  Add12Regular,
  FlashSettings20Filled,
  ImageReflection20Regular,
  RotateLeft20Regular
} from "@fluentui/react-icons";
import { motion } from "framer-motion";

const useStyles = makeStyles({
  container: {
    ...shorthands.gap("16px"),
    display: "flex",
    flexWrap: "wrap"
  },

  card: {
    width: "auto",
    height: "fit-content"
  },

  flex: {
    ...shorthands.gap("4px"),
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },

  labels: {
    ...shorthands.gap("6px")
  },

  footer: {
    ...shorthands.gap("12px")
  },

  caption: {
    color: tokens.colorNeutralForeground3
  },

  taskCheckbox: {
    display: "flex",
    alignItems: "flex-start"
  },

  grid: {
    ...shorthands.gap("16px"),
    display: "flex",
    flexDirection: "column"
  }
});

export const Templates = () => {
  return (
    <div className={"flex flex-col"}>
      <div><RenderCard /></div>
    </div>
  );
};

export const RenderCard = () => {
  const styles = useStyles();
  const [id, setId] = useState(1);
  const [list, setList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [nowSelectedId, setNowSelectedId] = useState(0);
  const [inputValue, setInputValue] = useState(0);

  // ModeSwitch, 选择模式或删除模式
  const [checked, setChecked] = React.useState(true);
  const onCheckedChange = React.useCallback(
    (ev) => {
      setChecked(ev.currentTarget.checked);
    },
    [setChecked]
  );

  // 处理选择
  const handleSelectClick = (idToSelect) => {
    setSelectedIds(() => {
      setNowSelectedId(idToSelect);
      return selectedIds.includes(idToSelect) ? selectedIds : [...selectedIds, idToSelect];
    });
    // 标记选中的 Avatar 为绿色
    setList((prevList) =>
      prevList.map((value) => {
        if (value.id == idToSelect) {
          return {
            ...value,
            color: "dark-green",
            isDeleting: false
          };
        }
        return value;
      }));
  };

  // 处理删除
  const handleDeleteClick = (idToSelect) => {
    setNowSelectedId(idToSelect);
    setDeletedIds(() => {
      return deletedIds.includes(idToSelect) ? deletedIds : [...deletedIds, idToSelect];
    });
    // 标记要删除的 Avatar 为红色
    setList((prevList) =>
      prevList.map((value) => {
        if (value.id == idToSelect) {
          return {
            ...value,
            color: "dark-red",
            isDeleting: true
          };
        }
        return value;
      }));
  };

  // 处理重置
  const handleResetClick = () => {
    setList((prevList) =>
      prevList.map((value) => {
        return {
          ...value,
          color: "neutral",
          isDeleting: false
        };
      }));
    setNowSelectedId(0);
    setSelectedIds([]);
    setDeletedIds([]);
  };

  // 新建avatar
  const newAvatar = () => {
    const o = {
      id,
      color: "neutral",
      shape: "square",
      active: "unset",
      key: id,
      activeAppearance: "ring-shadow",
      isDeleted: false,
      isDeleting: false
    };
    setId(id + 1);
    return o;
  };
  // 选择avatar

  return (
    <>
      <Card className={styles.card}>
        <header className={"flex flex-col gap-3"}>
          <div className={styles.taskCheckbox}>
            <label>
              <Text block weight={"bold"} size={600}>
                工作集状态
              </Text>
            </label>
          </div>
          <div className={"flex flex-row gap-2"}>
            {/*<Text>输入要选择的工作集ID</Text>*/}
            {/*<Input contentBefore={""} appearance={"underline"} id={"input"} type={"number"}*/}
            {/*       value={inputValue} onChange={(_, data) => {*/}
            {/*  setInputValue(data.value);*/}
            {/*}}></Input>*/}

            <Button onClick={() => {
              handleResetClick();
            }} icon={<FlashSettings20Filled />}>Reset</Button>
            <Switch
              checked={checked}
              onChange={onCheckedChange}
              label={checked ? "Select" : "Delete"}
            />
          </div>
          <div className={"flex flex-row gap-2"}>
            <Button
              onClick={() => {
                const ava = newAvatar();
                setList([...list, ava]);
              }}
              icon={<Add12Regular primaryFill={"#0078DB"} />}
            ></Button>
            {list.map((value) => {
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }} // 根据索引计算新的位置
                  exit={{ opacity: 0, scale: 0.5, x: 0 }}
                  transition={{ duration: 0.5 }}
                  key={value.id}
                >
                  <Avatar
                    icon={value.id}
                    color={value.color}
                    shape={value.shape}
                    active={nowSelectedId == value.id ? "active" : "inactive"}
                    key={value.id}
                    activeAppearance={value.appearance}
                    style={{
                      opacity: value.isDeleting ? 0.7 : 1,
                      transition: "opacity 0.5s ease-in-out",
                      show: value.isDeleting ? "hidden" : "visible"
                    }} onClick={() => {
                    // handleSelectClick(value.id);
                    checked ? handleSelectClick(value.id) :
                      handleDeleteClick(value.id);
                  }}
                  ></Avatar>
                </motion.div>
              );
            })}
          </div>
        </header>
      </Card>
    </>
  );
};
