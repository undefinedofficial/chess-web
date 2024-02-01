import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import bChessLoader from "@/components/based/b-chessloader.vue";
import bTooltip from "@/components/based/b-tooltip.vue";
import bAvatar from "@/components/based/b-avatar.vue";
import bButton from "@/components/based/b-button.vue";
import bSwitch from "@/components/based/b-switch.vue";
import bModal from "@/components/based/b-modal.vue";
import bIcon from "@/components/based/b-icon.vue";
import bToggle from "@/components/based/b-toggle.vue";
import bItext from "@/components/based/b-itext.vue";
import bRange from "@/components/based/b-range.vue";
import bProgress from "@/components/based/b-progress.vue";
import bDropdown from "@/components/based/b-idropdown.vue";
import bLoader from "./components/based/b-loader.vue";

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    "b-chessloader": typeof bChessLoader;
    "b-tooltip": typeof bTooltip;
    "b-avatar": typeof bAvatar;
    "b-loader": typeof bLoader;
    "b-toggle": typeof bToggle;
    "b-idropdown": typeof bDropdown;
    "b-itext": typeof bItext;
    "b-range": typeof bRange;
    "b-progress": typeof bProgress;
    "b-button": typeof bButton;
    "b-switch": typeof bSwitch;
    "b-modal": typeof bModal;
    "b-icon": typeof bIcon;
  }
}

const app = createApp(App).use(createPinia()).use(router);
app.component("b-chessloader", bChessLoader);
app.component("b-tooltip", bTooltip);
app.component("b-avatar", bAvatar);
app.component("b-loader", bLoader);
app.component("b-button", bButton);
app.component("b-switch", bSwitch);
app.component("b-toggle", bToggle);
app.component("b-idropdown", bDropdown);
app.component("b-itext", bItext);
app.component("b-range", bRange);
app.component("b-progress", bProgress);
app.component("b-modal", bModal);
app.component("b-icon", bIcon);
app.mount("#app");
