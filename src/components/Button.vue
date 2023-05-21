<template>

    <button class="btn" :style="{background: color}" @click="onClick()">{{ text }}</button>

</template>

<script>
    export default {
        name: 'Button',
        props: {
            text: {
                type: String,
                default: "Add Task"
            },
            color: {
                type: String,
                default: "steelblue"
            }
        },
        methods: {
            onClick() {
                console.log('click')
            }
        }
    }
</script>

<style scoped>
    button {
        display: inline-block;
        background: #000;
        color: #fff;
        border: none;
        padding: 10px 20px;
        margin: 5px;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        font-size: 15px;
        font-family: inherit;
    }
    button:focus {
        outline: none;
    }
    button:active {
        transform: scale(0.98);
    }
</style>