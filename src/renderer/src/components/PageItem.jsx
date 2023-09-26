import { useContext, forwardRef, useImperativeHandle } from "react";
import { ThemeContext } from "./ThemeContext";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

// status: "active": 激活(绿色)，"normal": 未激活(蓝色)，"error": 错误(红色)
const PageItem = forwardRef((props, ref) => {
  const { pageNumber, status, ...rest } = props;
  const { theme } = useContext(ThemeContext);
  const animation = useAnimation();

  useImperativeHandle(ref, () => ({
    flash: async () => {
      for (let i = 0; i < 2; ++i) {
        await animation.start({ opacity: 0.5 });
        await animation.start({ opacity: 1 });
      }
    }
  }));

  useEffect(() => {
    const backgroundColor = (() => {
      if (status === "active") return theme.value.colorPaletteLightGreenBackground3;
      else if (status === "normal") return theme.value.colorBrandForegroundOnLight;
      else if (status === "error") return theme.value.colorStatusDangerForeground3;
    })();
    animation.start({
      backgroundColor,
      transition: { duration: 0.3 } // 设置颜色渐变的过渡时间
    });
  }, [status, animation, theme]);

  return (
    <div {...rest}>
      <motion.div
        className={"h-full flex flex-col justify-center rounded"}
        style={{
          backgroundColor: (() => {
            if (status === "active") return theme.value.colorPaletteLightGreenBackground3;
            else if (status === "normal") return theme.value.colorBrandForegroundOnLight;
            else if (status === "error") return theme.value.colorStatusDangerForeground3;
          })()
        }}
        initial={{ opacity: 1 }}
        animate={animation}
      >
        <div className={"mx-auto select-none font-bold"} style={{ fontSize: 18 }}>
          {pageNumber ?? ""}
        </div>
      </motion.div>
    </div>
  );
});

export default PageItem;
