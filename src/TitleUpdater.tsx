import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const titleMap: Record<string, string> = {
      "/": "主页",
      "/widgetDesktop": "歌曲组件",
      "/lyric": "歌词组件",
      "/player": "播放器",
      "/markdown/editor": "Markdown 编辑器",
      "/settings": "通用",
      "/settings/general": "通用",
      "/settings/lyric": "歌词组件",
      "/settings/player": "播放器",
      "/settings/desktop": "桌面组件",
      "/settings/camera": "虚拟摄像头",
      "/settings/output": "歌曲信息输出",
      "/apiPage": "API 接口",
      "/extension": "扩展功能",
      "/extension/window": "窗口模式",
      "/extension/deployment": "页面部署",
      // "/sponsor": "赞助",
      "/about": "关于",
    };

    let title = titleMap[location.pathname];

    if (!title && location.pathname.startsWith("/lyric/")) {
      title = " 歌词组件";
    }

    if (title) {
      document.title = title;
    } else {
      document.title = "404";
    }
  }, [location.pathname]);

  return null;
}
