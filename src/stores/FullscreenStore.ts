import { ref, computed } from "vue";
import { defineStore } from "pinia";

interface FullScreenDocument extends HTMLDocument {
  documentElement: FullScreenDocumentElement;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
}

interface FullScreenDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}

export const useFullscreenStore = defineStore("FullscreenStore", () => {
  const doc = <FullScreenDocument>document;
  const isFullscreen = ref(
    !!(
      doc.fullscreenElement ||
      doc.mozFullScreenElement ||
      doc.webkitFullscreenElement ||
      doc.msFullscreenElement
    )
  );

  const EnterFullscreen = () => {
    isFullscreen.value = true;
    const el = doc.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  const LeaveFullscreen = () => {
    isFullscreen.value = false;
    if (!!doc.exitFullscreen) doc.exitFullscreen();
    else if (doc.msExitFullscreen) doc.msExitFullscreen();
    else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
  };

  const SwitchFullscreen = () => {
    if (isFullscreen.value) LeaveFullscreen();
    else EnterFullscreen();
  };

  return { isFullscreen, SwitchFullscreen };
});
