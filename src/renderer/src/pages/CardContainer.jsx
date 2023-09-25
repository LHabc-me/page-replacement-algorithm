import * as React from "react";
import { useState } from "react";
import { Avatar, AvatarGroup, Card, Image, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { ArrowSwapRegular, Memory16Regular } from "@fluentui/react-icons";

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

// export const RenderCard = () => {
//   return (
//     <div className={"flex flex-col"}>
//       <div><Card /></div>
//     </div>
//   );
// };

export const CardContainer = () => {
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
      <Card>
        <header className={"flex flex-row gap-3 w-12 h-auto"}>
          <Image
            src={arraw_swap} />
          <Image
            src={memory} />
          {/*<Avatar icon={<ArrowSwapRegular />} color={"neutral"}></Avatar>*/}
          {/*<Avatar icon={<Memory16Regular />}></Avatar>*/}
        </header>
        <footer className={styles.footer}>
        </footer>
      </Card>
    </>
  );
};
