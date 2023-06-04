<template>

    <header>
        <h1>{{ title  }}</h1>
        <span class="badge badge-primary">Primary</span>
    </header>
</template>

<script>


import Button from './Button.vue'

export default {
    name: 'Header',
    props: {
        title: {
            type: String,
            default: "Hello World"
        }
    },
    components: {
        Button
    }
}

</script>

<style>

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
</style>