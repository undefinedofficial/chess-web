<template>
  <div class="chess-loader relative h-max rounded-md overflow-hidden">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div class="piece-Left chess-pawn-white"></div>
    <div class="piece-Right chess-pawn-black"></div>
  </div>
</template>

<style lang="scss" scoped>
$oddColor: #8ca2ad;
$evenColor: #dee3e6;

.chess-pawn-white {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzcuMTciIGhlaWdodD0iMTc3LjE3IiBzaGFwZS1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSIwIDAgNTAgNTAiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIyMS4xMyIgeTE9IjM3LjM1IiB4Mj0iNzcuNzYiIHkyPSIzNy40NjkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLjk3MzI0IDAgMS4yNDMpIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJtMjUgNDYuNDVoLTEzLjM5NGMtLjY2LTEuNjA3LS45OTEtMy4yODgtLjk5MS01LjA0IDAtMi45NzUuODY0LTUuNjQ0IDIuNTk5LTguMDIgMS43MzYtMi4zNjUgMy45NzEtNC4wNTQgNi42OTctNS4wNjgtMS4xNjgtLjUyNy0yLjEyNS0xLjMyNy0yLjg2Mi0yLjM5OC0uNzM3LTEuMDcxLTEuMTAxLTIuMjgzLTEuMTAxLTMuNjM0IDAtMS42ODkuNTc2LTMuMTU2IDEuNzM2LTQuMzkyIDEuMTUyLTEuMjQ0IDIuNTc0LTEuOTYxIDQuMjY3LTIuMTUxLTEuMzQ2LS45ODEtMi4wMi0yLjI4Mi0yLjAyLTMuODg5IDAtMS4zNTEuNDkxLTIuNTEzIDEuNDgyLTMuNDc3Ljk4Mi0uOTY0IDIuMTc2LTEuNDQyIDMuNTgxLTEuNDQyIDEuMzg5IDAgMi41ODIuNDc4IDMuNTczIDEuNDQyLjk5MS45NjQgMS40OSAyLjEyNiAxLjQ5IDMuNDc3IDAgMS42MDctLjY2OSAyLjkwOS0yLjAyIDMuODg5IDEuNjkzLjE5IDMuMTE2LjkwNiA0LjI2NyAyLjE1MSAxLjE2IDEuMjM2IDEuNzM2IDIuNzAzIDEuNzM2IDQuMzkyIDAgMS4zNTEtLjM3MyAyLjU2My0xLjEyNiAzLjYzNC0uNzUzIDEuMDcxLTEuNzEgMS44Ny0yLjg2MiAyLjM5OCAyLjcyNiAxLjAxNCA0Ljk2MSAyLjcwMyA2LjY5NyA1LjA2OCAxLjczNiAyLjM3MyAyLjU5OSA1LjA0IDIuNTk5IDguMDIgMCAxLjczOS0uMzIyIDMuNDItLjk2NSA1LjA0aC0xMy4zOTQiIGZpbGw9IiMxZjFhMTciLz48cGF0aCBkPSJtMjUgNDQuODA4aDEyLjE3NWMuMzQ3LTEuMTU0LjUyNS0yLjI5MS41MjUtMy40MDMgMC0yLjUxMy0uNzExLTQuNzg3LTIuMTQyLTYuODMxLTEuNDMxLTIuMDQ0LTMuMjc3LTMuNTUyLTUuNTItNC41MTYtMS41ODQtLjYyLTEuNjQzLS42NTktMS42NDMtMS43MzkgMC0uODQ5LjU1OS0xLjQ3NSAxLjY2OC0xLjg3OSAxLjUzMi0xLjA0NyAyLjMwMy0yLjQzMSAyLjMwMy00LjE1MyAwLTEuMjQ0LS40MzItMi4zMjQtMS4yODctMy4yNjMtLjg2NC0uOTMxLTEuOTA1LTEuNDY3LTMuMTI0LTEuNjE1LS45OTktLjA4Mi0xLjQ5LS42MjYtMS40OS0xLjY0IDAtLjQ1My4xNzgtLjg3My41NDItMS4yNjEuODk4LS42NzYgMS4zNDYtMS41NTcgMS4zNDYtMi42NTMgMC0uODk4LS4zMzktMS42NzMtLjk5OS0yLjMxNi0uNjYtLjY0My0xLjQ0OC0uOTY0LTIuMzU0LS45NjQtLjk0IDAtMS43NDQuMzIxLTIuMzk2Ljk2NC0uNjUyLjY0My0uOTc0IDEuNDE3LS45NzQgMi4zMTYgMCAxLjA3OS40NCAxLjk2MSAxLjMzOCAyLjY1My4zNjQuMzU0LjU0Mi43NzUuNTQyIDEuMjYxIDAgMS4wMTQtLjQ4MyAxLjU1Ny0xLjQ2NSAxLjY0LTEuMjM2LjE0OC0yLjI4Ni42ODQtMy4xMzMgMS42MTUtLjg1NS45MzktMS4yNzkgMi4wMi0xLjI3OSAzLjI2MyAwIDEuNzIyLjc3IDMuMTA2IDIuMzAzIDQuMTUzIDEuMTA5LjQxMiAxLjY2OCAxLjA0NiAxLjY2OCAxLjg3OSAwIDEuMDc5LS4wNjcgMS4xMTgtMS42NjggMS43MzktMi4yNDQuOTY0LTQuMDgxIDIuNDcyLTUuNTAzIDQuNTE2LTEuNDIyIDIuMDQ0LTIuMTM0IDQuMzE4LTIuMTM0IDYuODMxIDAgMS4xOTUuMTc4IDIuMzI0LjUyNSAzLjQwM2gxMi4xNzUiIGZpbGw9InVybCgjMCkiLz48L3N2Zz4=");
}
.chess-pawn-black {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzcuMTciIGhlaWdodD0iMTc3LjE3IiBzaGFwZS1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSIwIDAgNTAgNTAiPjxwYXRoIGQ9Im0yNSA0Ni40NWgtMTMuMzk0Yy0uNjYtMS42NTEtLjk5MS0zLjM3OC0uOTkxLTUuMTgyIDAtMy4wNTYuODY0LTUuOCAyLjU5OS04LjIzOCAxLjczNi0yLjQzIDMuOTcxLTQuMTY2IDYuNjk3LTUuMjA3LTEuMTY4LS41NDItMi4xMjUtMS4zNjMtMi44NjItMi40NjQtLjczNy0xLjEwMS0xLjEwMS0yLjM0NS0xLjEwMS0zLjczNCAwLTEuNzM2LjU3Ni0zLjI0MyAxLjczNi00LjUxMyAxLjE1Mi0xLjI3OCAyLjU3NC0yLjAyIDQuMjY3LTIuMjEtMS4zNDYtMS4wMS0yLjAyLTIuMzQ1LTIuMDItMy45OTYgMC0xLjM4OS40OTEtMi41ODIgMS40ODItMy41NzMuOTgyLS45OTEgMi4xNzYtMS40ODIgMy41ODEtMS40ODIgMS4zODkgMCAyLjU4Mi40OTEgMy41NzMgMS40ODIuOTkxLjk5MSAxLjQ5IDIuMTg0IDEuNDkgMy41NzMgMCAxLjY1MS0uNjY5IDIuOTg5LTIuMDIgMy45OTYgMS42OTMuMTk1IDMuMTE2LjkzMSA0LjI2NyAyLjIxIDEuMTYgMS4yNyAxLjczNiAyLjc3NyAxLjczNiA0LjUxMyAwIDEuMzg5LS4zNzMgMi42MzMtMS4xMjYgMy43MzQtLjc1MyAxLjEwMS0xLjcxIDEuOTIyLTIuODYyIDIuNDY0IDIuNzI2IDEuMDQxIDQuOTYxIDIuNzc3IDYuNjk3IDUuMjA3IDEuNzM2IDIuNDM4IDIuNTk5IDUuMTgyIDIuNTk5IDguMjM4IDAgMS43ODYtLjMyMiAzLjUxNC0uOTY1IDUuMTgyaC0xMy4zOTQiIGZpbGw9IiMxZjFhMTciIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC45NzMyNCAwIDEuMjQzKSIvPjwvc3ZnPg==");
}
.chess-loader {
  height: 100px;
  width: 100px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  div {
    display: block;
    &:nth-child(1),
    &:nth-child(4) {
      background-color: $evenColor;
    }
    &:nth-child(3),
    &:nth-child(2) {
      background-color: $oddColor;
    }
  }

  div.piece-Left,
  div.piece-Right {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50%;
    height: 50%;
    background-size: contain;
  }

  div.piece-Left {
    animation: chess-slide-white 4s ease infinite;
  }
  div.piece-Right {
    animation: chess-slide-black 4s ease infinite;
  }
}

@keyframes chess-slide-white {
  to,
  from {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(0, -100%);
  }
  50% {
    transform: translate(100%, -100%);
  }
  75% {
    transform: translate(100%, 0);
  }
}
@keyframes chess-slide-black {
  to,
  from {
    transform: translate(100%, -100%);
  }
  25% {
    transform: translate(100%, 0);
  }
  50% {
    transform: translate(0, 0);
  }
  75% {
    transform: translate(0, -100%);
  }
}
</style>
