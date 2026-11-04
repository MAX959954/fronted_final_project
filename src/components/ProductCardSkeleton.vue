<template>
  <div class="card-skeleton" aria-hidden="true">
    <div class="skeleton frame" />
    <div class="skeleton line short" />
    <div class="skeleton line" />
    <div class="skeleton line price" />
  </div>
</template>

<style scoped>
.card-skeleton {
  display: grid;
  gap: 12px;
}

/* Same proportions as ProductCard, so nothing jumps when the real cards arrive. */
.frame {
  aspect-ratio: 4 / 5;
  margin-bottom: 4px;
}

.line {
  height: 1em;
  width: 70%;
}

.short {
  width: 35%;
}

.price {
  width: 25%;
}
</style>
