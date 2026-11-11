export {};

declare module "*.glb";
declare module "*.png";

declare module "meshline" {
  export const MeshLineGeometry: any;
  export const MeshLineMaterial: any;
}

// 扩展 React.CSSProperties 类型，支持自定义 CSS 变量
declare module "react" {
  interface CSSProperties {
    // 添加索引签名，支持所有以 "--" 开头的自定义 CSS 变量
    [key: `--${string}`]: string | number | undefined;
  }
}

declare global {
  interface LilithFloatingWindowState {
    open: boolean;
    visible: boolean;
    locked: boolean;
  }

  interface Window {
    lilithFloatingWindows?: {
      getState(key: string): Promise<LilithFloatingWindowState>;
      show(key: string): Promise<void>;
      hide(key: string): Promise<void>;
      setLocked(key: string, locked: boolean): Promise<LilithFloatingWindowState>;
      reset(key: string): Promise<LilithFloatingWindowState>;
      close(key: string): Promise<void>;
      onStateChanged(listener: () => void): () => void;
    };
  }

  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}
