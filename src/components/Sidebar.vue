<template>

    <div class="sidebar col-auto px-sm-2 pt-5 px-0 sticky-top">
                <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                    <a href="/" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span class="fs-5 d-none d-sm-inline"></span>
                    </a>
                    
                    <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                        <li>
                            <a href="#" @click.prevent="$router.push('/')" class="nav-link px-0 align-middle">
                                <i class="fs-4 bi-journal-richtext"></i> <span class="ms-1 d-none d-sm-inline">Notebook</span> </a>
                        </li>
    
                        <li>
                            <a href="#" v-on:click="pins" class="nav-link px-0 align-middle">
                                <i  class="fs-4 bi-pin"></i> <span class="ms-1 d-none d-sm-inline">Pins</span> </a>
                        </li>
    
                        <li>
                            <a href="#submenu3" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
                                <i class="fs-4 bi-grid"></i> <span class="ms-1 d-none d-sm-inline">Tags</span> </a>
                                <ul class="collapse nav show flex-column ms-1" id="submenu3" data-bs-parent="#menu">
                                    
                                <li @click="getTagNotes(tag)" v-for="tag in this.taglist" :key="tag" class="">
                                    <a class="nav-link px-0"> <span class="d-none d-sm-inline badge bg-primary rounded-pill outline tag">{{ tag }}</span></a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <hr>
                </div>
            </div>
    </template>
    
    <script>
    
    export default {
        name: 'Sidebar',
        props: {
            title: {
                type: String,
                default: "Flownotes"
            },
            taglist: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            pins() {
                this.$emit('pins')
                console.log('pins')
            },
            getTagNotes(tag) {
                console.log(tag)
                this.$emit('getTagNotes', tag)
            },
        },
        created() {
            // console.log(this.taglist)
            // this.tagColor()
        }
    }
    
    </script>
    
    <style scoped>
    
    </style>
    