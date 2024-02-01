<template>
  <component :is="Layout">
    <RouterView />
  </component>

  <CookiesModal />
  <transition-group
    tag="div"
    name="bounce-right"
    class="fixed px-2 bottom-3 md:right-3 flex flex-col-reverse"
  >
    <Notification
      v-for="n in notifyStore.notifications"
      :key="n.id"
      :type="n.type"
      :icon="n.icon"
      :title="n.title"
      :description="n.description"
      :duration="n.timeout"
      :feedback="!!n.accept && !!n.reject"
      @accept="n.accept"
      @reject="n.reject"
      @close="n.reject"
      textAlign="text-left"
    ></Notification>
  </transition-group>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

import Notification from "./components/Notification.vue";
import CookiesModal from "./components/Modals/CookiesModal.vue";

import { useUserStore } from "./stores/UserStore";
import { useNotificationStore } from "./stores/NotificationStore";
import { useSocketStore } from "./stores/SocketStore";

useUserStore().Reconstruction();

const Layout = computed(() => {
  const { meta } = useRoute();
  return defineAsyncComponent(
    () => import(`@/views/Layouts/${meta.layout || "Empty"}Layout.vue`)
  );
});
const notifyStore = useNotificationStore();

const router = useRouter();
const socketStore = useSocketStore();
router.beforeEach(async (to, from, next) => {
  if (to.meta.ws) await socketStore.Connect();
  else socketStore.Disconnect();
  next();
});
</script>

<style lang="scss">
@import "@/styles/chessfont.css";
@import "@/styles/tailwind.css";
@import "@/styles/scrollbar.scss";
@import "@/country-flag/country-flag.css";

html,
body,
#app {
  display: flex;
  max-height: 100%;
  max-width: 100%;
  height: 100%;
  width: 100%;
  overflow: auto;

  @apply bg-l-grey-light text-c-grey dark:bg-d-black dark:text-white;
}

[v-cloak] {
  display: none !important;
}

.bounce-right-move {
  transition: all 1s linear;
}
.bounce-right-enter-active {
  transition: all 1s linear;
  animation: bounceInRight 0.7s;
}
.bounce-right-leave-active {
  animation: bounceOutRight 0.7s;
}

@keyframes bounceInRight {
  60%,
  75%,
  90%,
  from,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translateX(2000px);
  }
  60% {
    opacity: 1;
    transform: translateX(-25px);
  }
  75% {
    transform: translateX(10px);
  }
  90% {
    transform: translateX(-5px);
  }
  to {
    transform: none;
  }
}

@keyframes bounceOutRight {
  20% {
    opacity: 1;
    transform: translateX(-20px);
  }
  30% {
    transform: scaleY(0.8);
  }
  to {
    opacity: 0;
    transform: translateX(2000px);
  }
}
</style>
