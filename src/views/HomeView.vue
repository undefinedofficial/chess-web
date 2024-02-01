<template>
  <div class="mx-3 md:mt-8 space-y-3 md:w-full">
    <Card class="divide-y divide-gray-500">
      <h4 class="text-lg text-center">Играть по сети</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        <div
          class="h-full p-4 relative bg-l-grey-light dark:bg-d-black rounded-lg border-2 border-transparent hover:border-c-blue-15 text-center transition-colors"
          v-for="(mode, i) in OnlineModes"
          :key="i"
          @click="OnSelect(mode)"
        >
          <img
            class="p-1 m-auto dark:brightness-[10]"
            width="100"
            height="100"
            :src="mode.avatar"
            :alt="mode.firstname"
          />
          <div class="my-2">
            <h5 class="font-bold text-lg whitespace-wrap">
              {{ mode.firstname }}
            </h5>
            <p class="text-xs">{{ mode.description }}</p>
          </div>
          <b-tooltip class="mx-1 border-c-blue" vertical="bottom" :wrap="false">{{
            mode.tooltip
          }}</b-tooltip>
        </div>
      </div>
    </Card>
    <CollapseCard class="divide-y divide-gray-500 max-h-[38rem]">
      <h4 class="text-lg text-center">Играть с компьютером</h4>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-rows-3 lg:grid-rows-2 gap-4 pt-2"
      >
        <div
          class="h-full p-3 bg-l-grey-light dark:bg-d-black rounded-lg border-2 border-transparent hover:border-c-blue-15 text-center transition-colors"
          v-for="user in bots.entries()"
          :key="user[0]"
          @click="OnSelect(user[1] as any)"
        >
          <div class="relative p-1 mx-auto h-32 w-32">
            <img
              width="120"
              height="120"
              :src="user[1].avatar"
              :alt="user[1].firstname"
            />
            <div v-if="user[1].location" class="absolute bottom-0 right-0 h-6">
              <i
                class="block flag scale-75"
                :class="'flag-' + user[1].location.toLowerCase()"
              ></i>
            </div>
          </div>
          <div class="my-2">
            <h5 class="font-bold text-lg whitespace-nowrap">
              {{ user[1].firstname }}
              <span class="text-sm"> ({{ user[1].elo }})</span>
            </h5>
            <p class="text-xs">{{ user[1].description }}</p>
          </div>
        </div>
      </div>
    </CollapseCard>
    <div class="col-span-3 block justify-self-center"></div>
  </div>
  <OnlineModal
    v-model="modalOnline"
    :gamemode="gamemode"
    :status="Status"
    @start="OnStart"
    @close="OnStop"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import Card from "../components/Card.vue";
import CollapseCard from "@/components/CollapseCard.vue";
import OnlineModal from "@/components/Modals/OnlineModal.vue";

import type { GameMode } from "@/models/gamemode.model";
import type { Orientation } from "@/models/Orientation.model";

import { bots } from "@/hooks/profiles.hook";

import { useGameMode } from "@/hooks/gamemode.hook";
import { useBattleStore } from "@/stores/BattleStore";

const { OnlineModes } = useGameMode();

const modalOnline = ref(false);
const gamemode = ref<GameMode>(OnlineModes[0]);
const OnSelect = (mode: GameMode) => {
  gamemode.value = mode;
  modalOnline.value = true;
};

const router = useRouter();
const battleStore = useBattleStore();

const Status = computed(() => {
  switch (battleStore.status) {
    case "start":
      return "Приятной игры!";
    case "wait":
      return "Подбор сопериника...";
  }
  return "Подключение...";
});

const OnStart = async (mode: GameMode, orientation: Orientation) => {
  const roomid = await battleStore.FindBattle({ mode: mode.mode, orientation });

  setTimeout(() => {
    router.push("/r/" + roomid);
  }, 500);
};
const OnStop = () => {
  battleStore.FindStop();
};
//   public modalOnline = false;
//   public mode: TypeMode = this.GetOnline[0];
//   public get Status(): string {
//     switch (surfaceModule.Status) {
//       case BATTLESTATUS.START:
//         return "Приятной игры";
//       case BATTLESTATUS.WAIT:
//         return "Подбор игрока";
//     }
//     return "Подключение";
//   }

//   public onSelect(mode: TypeMode) {
//     this.modalOnline = true;
//     this.mode = mode;
//   }

//   StartOnline(mode: TypeMode, orientation: Orientation, clock: number) {
//     if (!mode) console.error("error mode");
//     surfaceModule
//       .SendStart({ mode: mode.mode as number, orientation, clock })
//       .then((roomId) => {
//         setTimeout(() => {
//           this.$router.push("/r/" + roomId);
//         }, 500);
//       })
//       .catch(() => {
//         this.modalOnline = false;
//       });
//   }

//   @Watch("modalOnline")
//   StopOnline(val: boolean) {
//     if (!val) {
//       surfaceModule.SendStop();
//     }
//   }
// }
</script>
