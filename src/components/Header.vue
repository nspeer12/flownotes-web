<template>

    <header>
        <h1>{{ title  }}</h1>
        <Button text="login" color="blue" />
        <Button text="Add Note" color="green"/>
        <Button text="Delete Task" color="red"/>
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