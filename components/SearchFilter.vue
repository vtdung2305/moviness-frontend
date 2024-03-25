<script lang="ts" setup>
// micro compiler
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  placeholderKeyword: {
    type: String,
    default: 'components.search_filter.placeholder_keyword',
  },
  btnPrimaryName: {
    type: String,
    default: 'components.search_filter.btn_primary_name',
  },
})

const filter = ref({
  keyword: '',
  sortBy: 'DESC',
})

const sortList = [
  {
    name: 'components.search_filter.sort_list.desc',
    value: 'DESC',
  },
  {
    name: 'components.search_filter.sort_list.asc',
    value: 'ASC',
  },
  {
    name: 'components.search_filter.sort_list.alphabet',
    value: 'ALPHABET',
  },
]
const emit = defineEmits(['onFilter'])
const onFilter = () => {
  emit('onFilter', filter.value)
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex mt-4 gap-8">
      <FormTextInput
        v-model="filter.keyword"
        type-input="text"
        class="flex-1"
        :placeholder="$t(placeholderKeyword)"
      />
      <Button
        type="primary"
        class="w-37 text-xl"
        @click="onFilter"
        >{{ $t(btnPrimaryName) }}</Button
      >
    </div>
    <div class="flex mt-4 mb-9 gap-4">
      <Button
        v-for="(item, index) in sortList"
        :key="index"
        :type="
          item.value === filter.sortBy
            ? 'primary'
            : 'outline'
        "
        class="rounded-xl w-max h-30px px-4 text-14px"
        @click="filter.sortBy = item.value"
      >
        {{ $t(item.name) }}
      </Button>
    </div>
  </div>
</template>
