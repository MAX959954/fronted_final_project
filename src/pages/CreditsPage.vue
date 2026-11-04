<script setup>
import { useI18n } from '@/i18n'
import { credits } from '@/data/credits'

const { t } = useI18n()
</script>

<template>
  <div class="page wrap credits">
    <h1 class="page-title">{{ t('footer.credits') }}</h1>
    <p class="lead">{{ t('footer.creditsText') }}</p>

    <table>
      <tbody>
        <tr v-for="c in credits" :key="c.url">
          <th scope="row">{{ c.what }}</th>
          <td>
            <a :href="c.url" class="link" target="_blank" rel="noopener">{{ c.title }}</a>
          </td>
          <td>{{ c.author }}</td>
          <td class="muted">{{ c.licence }}</td>
        </tr>
      </tbody>
    </table>

    <p class="muted unsplash">{{ t('footer.creditsUnsplash') }}</p>
  </div>
</template>

<style scoped>
.lead {
  max-width: 52ch;
  margin-bottom: 40px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--step-small);
}

tr:nth-child(odd) {
  background: var(--surface);
}

th,
td {
  padding: 12px 14px;
  text-align: left;
  vertical-align: top;
}

th {
  font-weight: 500;
}

.unsplash {
  margin-top: 32px;
  font-size: var(--step-small);
}

@media (max-width: 720px) {
  tr {
    display: grid;
    gap: 2px;
    padding: 12px 14px;
  }

  th,
  td {
    padding: 0;
  }
}
</style>
