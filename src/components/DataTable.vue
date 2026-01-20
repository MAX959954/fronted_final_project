<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  striped: {
    type: Boolean,
    default: true
  },
  hover: {
    type: Boolean,
    default: true
  },
  bordered: {
    type: Boolean,
    default: false
  },
  small: {
    type: Boolean,
    default: false
  },
  responsive: {
    type: Boolean,
    default: true
  }
})

const tableClasses = computed(() => {
  return [
    'table',
    {
      'table-striped': props.striped,
      'table-hover': props.hover,
      'table-bordered': props.bordered,
      'table-sm': props.small
    }
  ]
})
</script>

<template>
  <div :class="{ 'table-responsive': responsive }" class="overflow-x-auto">
    <table :class="tableClasses" class="w-full border-collapse">
      <thead class="bg-gray-100">
        <tr>
          <th 
            v-for="column in columns" 
            :key="column.key"
            class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
            :class="column.class"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="(row, index) in data" 
          :key="index"
          class="hover:bg-gray-50 transition-colors"
        >
          <td 
            v-for="column in columns" 
            :key="column.key"
            class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
            :class="column.class"
          >
            <slot 
              :name="`cell-${column.key}`" 
              :row="row" 
              :value="row[column.key]"
              :column="column"
            >
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="data.length === 0" class="text-center py-8 text-gray-500">
      No data available
    </div>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

.table-bordered {
  border: 1px solid #dee2e6;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table-sm th,
.table-sm td {
  padding: 0.25rem;
}
</style>
