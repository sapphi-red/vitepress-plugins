```vue,=detype=
<script setup lang="ts">
type Foo = {
  foo: string
}

const fooList: Foo[] = []
</script>

<template>
  <div>{{ fooList.join(', ') }}</div>
</template>
```
