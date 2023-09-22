import { useContext, forwardRef, useImperativeHandle } from "react";
import { ThemeContext } from "./ThemeContext";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const PageItem = forwardRef((props, ref) => {
  const { pageNumber, active, ...rest } = props;
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
    if (active) {
      animation.start({
        backgroundColor: theme.value.colorBrandForegroundOnLight,
        transition: { duration: 0.3 } // 设置颜色渐变的过渡时间
      });
    } else {
      animation.start({
        backgroundColor: theme.value.colorStatusDangerForeground3,
        transition: { duration: 0.3 } // 设置颜色渐变的过渡时间
      });
    }
  }, [active, animation, theme]);

  return (
    <div {...rest}>
      <motion.div
        className={"h-full flex flex-col justify-center rounded"}
        style={{
          backgroundColor: active
            ? theme.value.colorBrandForegroundOnLight
            : theme.value.colorStatusDangerForeground3
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
