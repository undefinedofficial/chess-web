<template>
  <section
    class="flex items-center w-full h-full p-16 bg-l-grey-light text-c-grey dark:bg-d-black dark:text-white"
  >
    <div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
      <div class="max-w-md text-center">
        <h2 class="mb-8 font-extrabold text-9xl text-gray-400 dark:text-gray-600">
          <span class="sr-only">Error</span>404
        </h2>
        <p class="text-2xl font-semibold md:text-3xl">
          Извините, мы не смогли найти эту страницу.
        </p>
        <p class="mt-4 mb-8 dark:text-gray-400"></p>
        <router-link
          rel="noopener noreferrer"
          class="px-8 py-3 font-semibold rounded bg-violet-400 text-gray-900 dark:bg-blue-400 dark:text-gray-900 whitespace-nowrap"
          to="/"
          >Вернуться на главную страницу</router-link
        >
        <a></a>
      </div>
    </div>
  </section>
</template>
