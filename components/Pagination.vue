<script setup lang="ts">
import { computed, PropType } from 'vue'
import { RoleEnum } from '@/constants/role'

import { Theme } from '@/interfaces/role'
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  pageRange: {
    type: Number,
    default: 1,
  },
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const emit = defineEmits<{
  (event: 'page-changed', id: number): void
}>()

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.perPage)
})

const isFirstPage = computed(() => {
  return props.currentPage === 1
})

const isLastPage = computed(() => {
  return props.currentPage >= totalPages.value
})

const changePage = (page: number) => {
  if (
    page > 0 &&
    page <= totalPages.value &&
    page !== props.currentPage
  ) {
    emit('page-changed', page)
  }
}

const rangeStart = computed(() => {
  const start = props.currentPage - props.pageRange
  if (isFirstPage.value) {
    return 1
  }
  if (props.currentPage === totalPages.value - 1) {
    return totalPages.value - 4
  }
  if (isLastPage.value) {
    return totalPages.value - 4
  }
  return start > 0 ? start : 1
})

const rangeEnd = computed(() => {
  const end = props.currentPage + props.pageRange
  if (isFirstPage.value) {
    return 5
  }
  if (props.currentPage === 2) {
    return 5
  }
  if (isLastPage.value) {
    return totalPages
  }
  return end < totalPages.value ? end : totalPages
})

const hasFirst = () => {
  return rangeStart.value !== 1
}

const hasLast = () => {
  return rangeEnd.value < totalPages.value
}

const calculatedPages = computed(() => {
  const pages = []
  for (let i = rangeStart.value; i <= rangeEnd.value; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<template>
  <div class="w-full flex justify-center">
    <div
      v-if="totalPages <= 6"
      class="relative z-0 inline-flex tablet:gap-2 gap-1"
      :class="`pagination-${theme}`"
    >
      <div
        class="tablet:w-12 tablet:h-12 rounded-full flex items-center justify-center tablet:text-xs text-8px mr-2 pagination-prev w-32px h-32px"
        :class="{ disabled: isFirstPage }"
        @click.prevent="changePage(currentPage - 1)"
      >
        <span class="icon-down" />
      </div>
      <div
        v-for="(page, index) in totalPages"
        :key="index"
        class="tablet:w-12 tablet:h-12 w-32px h-32px rounded-full flex items-center justify-center tablet:text-xl text-xs font-bold pagination-item"
        :class="{ active: currentPage === page }"
        @click.prevent="changePage(page)"
      >
        {{ page }}
      </div>
      <div
        class="tablet:w-12 tablet:h-12 rounded-full flex items-center justify-center tablet:text-xs text-8px ml-2 pagination-next w-32px h-32px"
        :class="{ disabled: isLastPage }"
        @click.prevent="changePage(currentPage + 1)"
      >
        <span class="icon-down" />
      </div>
    </div>
    <div
      v-else
      class="relative z-0 inline-flex tablet:gap-2 gap-1"
      :class="`pagination-${theme}`"
    >
      <div
        class="tablet:w-12 tablet:h-12 rounded-full flex items-center justify-center tablet:text-xs text-8px mr-2 pagination-prev w-32px h-32px"
        :class="{ disabled: isFirstPage }"
        @click.prevent="changePage(currentPage - 1)"
      >
        <span class="icon-down" />
      </div>
      <div
        v-if="hasFirst()"
        class="tablet:w-12 tablet:h-12 w-32px h-32px rounded-full flex items-center justify-center tablet:text-xl text-xs font-bold pagination-item"
        @click.prevent="changePage(1)"
      >
        1
      </div>
      <div
        v-if="hasFirst()"
        class="tablet:w-12 tablet:h-12 w-32px h-32px rounded-full flex items-center justify-center tablet:text-xl text-xs font-bold pagination-item"
      >
        ...
      </div>
      <div
        v-for="(page, index) in calculatedPages"
        :key="index"
        class="tablet:w-12 tablet:h-12 w-32px h-32px rounded-full flex items-center justify-center tablet:text-xl text-xs font-bold pagination-item"
        :class="{ active: currentPage === page }"
        @click.prevent="changePage(page)"
      >
        {{ page }}
      </div>
      <div
        v-if="hasLast()"
        class="tablet:w-12 tablet:h-12 w-32px h-32px rounded-full flex items-center justify-center tablet:text-xl text-xs pagination-item"
      >
        ...
      </div>
      <div
        v-if="hasLast()"
        class="tablet:w-12 tablet:h-12 w-32px h-32px rounded-full flex items-center justify-center tablet:text-xl text-xs font-bold pagination-item"
        @click.prevent="changePage(totalPages)"
      >
        {{ totalPages }}
      </div>
      <div
        class="tablet:w-12 tablet:h-12 rounded-full flex items-center justify-center tablet:text-xs text-8px ml-2 pagination-next w-32px h-32px"
        :class="{ disabled: isLastPage }"
        @click.prevent="changePage(currentPage + 1)"
      >
        <span class="icon-down" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.pagination-prev,
.pagination-next {
  background: $color-white-2;
  cursor: pointer;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &:hover {
    filter: brightness(1.1);
  }

  &.disabled {
    cursor: not-allowed;
  }
}

.pagination-prev {
  transform: rotate(90deg);
}

.pagination-next {
  transform: rotate(-90deg);
}

.pagination-item {
  cursor: pointer;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &:hover {
    filter: brightness(1.1);
  }

  &.active {
    filter: drop-shadow(
      0px 5px 10px rgba(51, 51, 51, 0.051)
    );
    color: $color-white-2 !important;
  }
}

.pagination-shinseido {
  .pagination-prev .icon-down::before,
  .pagination-next .icon-down::before,
  .pagination-item {
    color: $color-shinseido;
  }

  .pagination-item {
    &.active {
      background: $gradient-180-shinseido;
    }
  }
}

.pagination-kanrisha {
  .pagination-prev .icon-down::before,
  .pagination-next .icon-down::before,
  .pagination-item {
    color: $color-kanrisha;
  }

  .pagination-item {
    &.active {
      background: $gradient-180-kanrisha;
    }
  }
}

.pagination-trainer {
  .pagination-prev .icon-down::before,
  .pagination-next .icon-down::before,
  .pagination-item {
    color: $color-trainer;
  }

  .pagination-item {
    &.active {
      background: $gradient-180-trainer;
    }
  }
}
</style>
