// SettingsDesktop.tsx
import React, { useEffect, useState } from "react";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  MoveDiagonalOne,
  PauseCircle,
  DangerTriangle,
} from "@mynaui/icons-react";
import { Link } from "@heroui/link";
import { Spacer } from "@heroui/spacer";
import { Button } from "@heroui/button";
import { useOpenExternalUrl } from "@/hooks/useOpenExternalUrl";

interface OsBitResponse {
  osBit: number;
}

export default function DesktopSettingsPage() {
  const [osBitNumber, setOsBitNumber] = useState<number>(64);
  const { openExternalUrl } = useOpenExternalUrl();
  const [widgetState, setWidgetState] = useState({
    open: false,
    visible: false,
    locked: true,
  });
  const [lyricState, setLyricState] = useState({
    open: false,
    visible: false,
    locked: true,
  });
  const floatingWindows = window.lilithFloatingWindows;

  const refreshWidgetState = async () => {
    if (floatingWindows) {
      setWidgetState(await floatingWindows.getState("nps:widget"));
    }
  };

  const refreshLyricState = async () => {
    if (floatingWindows) {
      setLyricState(await floatingWindows.getState("nps:lyric"));
    }
  };

  useEffect(() => {
    (async () => {
      // 获取系统位数
      try {
        const response = await fetch("/api/system/osBit");

        if (!response.ok) {
          throw new Error(`HTTP 响应错误！状态码：${response.status}`);
        }

        const data: OsBitResponse = await response.json();
        const { osBit } = data;

        setOsBitNumber(osBit);
      } catch (error: any) {
        console.log("获取系统信息失败：" + error.message);
      }
    })();
    void refreshWidgetState();
    void refreshLyricState();
    return floatingWindows?.onStateChanged(() => {
      void refreshWidgetState();
      void refreshLyricState();
    });
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full max-w-[800px] py-6 px-10 gap-6">
        <h1 className="text-3xl text-white font-bold leading-9">桌面组件</h1>

        {/* 打开方式 */}
        <div className="flex flex-col gap-4">
          <h1 className="text-xl text-default-800 font-bold leading-9">
            打开方式
          </h1>
          <p>
            {floatingWindows
              ? "在当前页面统一管理桌面组件的显示、锁定和位置"
              : "在软件托盘图标的右键菜单中启用并管理桌面组件"}
          </p>
          <Image
            alt="桌面组件帮助"
            src="/assets/desktop-widget-help.png"
            width={256}
          />
          {floatingWindows && (
            <div className="flex flex-wrap gap-2 rounded-xl border border-default-200 bg-default-50/40 p-4">
              <h2 className="w-full text-base font-semibold">播放器组件</h2>
              <Button color="primary" onPress={async () => {
                if (widgetState.visible) {
                  await floatingWindows.hide("nps:widget");
                } else {
                  await floatingWindows.show("nps:widget");
                }
                await refreshWidgetState();
              }}>
                {widgetState.visible
                  ? "隐藏组件"
                  : widgetState.open
                    ? "显示组件"
                    : "启动组件"}
              </Button>
              <Button variant="flat" isDisabled={!widgetState.open} onPress={async () => {
                await floatingWindows.setLocked("nps:widget", !widgetState.locked);
                await refreshWidgetState();
              }}>
                {widgetState.locked ? "解锁交互" : "锁定并穿透"}
              </Button>
              <Button variant="flat" onPress={async () => {
                await floatingWindows.reset("nps:widget");
                await refreshWidgetState();
              }}>
                重置位置
              </Button>
              <Button color="danger" variant="flat" isDisabled={!widgetState.open} onPress={async () => {
                await floatingWindows.close("nps:widget");
                await refreshWidgetState();
              }}>
                关闭组件
              </Button>
              <p className="w-full text-sm text-default-500">
                {widgetState.locked
                  ? "当前已锁定并启用鼠标穿透。请先解锁，再移动或缩放组件。"
                  : "当前已解锁。可拖动顶部控制区域或拖拽窗口边缘调整大小。"}
              </p>
            </div>
          )}
          {floatingWindows && (
            <div className="flex flex-wrap gap-2 rounded-xl border border-default-200 bg-default-50/40 p-4">
              <h2 className="w-full text-base font-semibold">歌词组件</h2>
              <Button color="primary" onPress={async () => {
                if (lyricState.visible) {
                  await floatingWindows.hide("nps:lyric");
                } else {
                  await floatingWindows.show("nps:lyric");
                }
                await refreshLyricState();
              }}>
                {lyricState.visible
                  ? "隐藏歌词"
                  : lyricState.open
                    ? "显示歌词"
                    : "启动歌词"}
              </Button>
              <Button variant="flat" isDisabled={!lyricState.open} onPress={async () => {
                await floatingWindows.setLocked("nps:lyric", !lyricState.locked);
                await refreshLyricState();
              }}>
                {lyricState.locked ? "解锁交互" : "锁定并穿透"}
              </Button>
              <Button variant="flat" onPress={async () => {
                await floatingWindows.reset("nps:lyric");
                await refreshLyricState();
              }}>
                重置位置
              </Button>
              <Button color="danger" variant="flat" isDisabled={!lyricState.open} onPress={async () => {
                await floatingWindows.close("nps:lyric");
                await refreshLyricState();
              }}>
                关闭歌词
              </Button>
              <p className="w-full text-sm text-default-500">
                {lyricState.locked
                  ? "歌词窗口已锁定并启用鼠标穿透。"
                  : "歌词窗口已解锁，可移动或缩放。"}
              </p>
            </div>
          )}
        </div>

        <Divider />

        {/* 使用帮助 */}
        <div className="flex flex-col gap-4 font-poppins">
          <h1 className="text-xl text-default-800 font-bold leading-9">
            使用帮助
          </h1>
          <Accordion variant="bordered">
            <AccordionItem
              classNames={{
                trigger: "cursor-pointer",
              }}
              startContent={<MoveDiagonalOne />}
              title="如何调整桌面组件的大小？"
            >
              <p className="leading-7">
                打开桌面组件设置，点击 <b>"缩放"</b>{" "}
                解锁按钮，用鼠标拖拽组件窗口的边框。
              </p>
            </AccordionItem>
            <AccordionItem
              classNames={{
                trigger: "cursor-pointer",
              }}
              startContent={<PauseCircle />}
              title="如何在歌曲暂停时自动隐藏桌面组件？"
            >
              <p className="leading-7">
                在{" "}
                <a
                  className="cursor-pointer custom-underline font-bold"
                  onClick={() => {openExternalUrl("http://localhost:9863/settings/widget");}}
                >
                  歌曲组件
                </a>{" "}
                设置页面中开启 <b>"暂停时隐藏"</b> 选项即可。
              </p>
            </AccordionItem>
            <AccordionItem
              classNames={{
                trigger: "cursor-pointer",
              }}
              startContent={<DangerTriangle />}
              title="为什么桌面组件无法正常启动或显示？"
            >
              <p className="leading-7">
                可前往{" "}
                <Link
                  className="cursor-pointer"
                  showAnchorIcon
                  onPress={() => {openExternalUrl("https://developer.microsoft.com/zh-cn/microsoft-edge/webview2/#download-section");}}
                >
                  WebView2
                </Link>{" "}
                页面，下载并安装{" "}
                <b>"常青独立安装程序 ({osBitNumber === 32 ? "x86" : "x64"})"</b>。
              </p>
            </AccordionItem>
          </Accordion>
        </div>

        <Spacer y={2} />
      </div>
    </div>
  );
}
