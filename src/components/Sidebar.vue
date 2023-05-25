<template>

<div class="sidebar col-auto px-sm-2 pt-5 px-0 sticky-top">
            <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a href="/" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span class="fs-5 d-none d-sm-inline"></span>
                </a>
                
                <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li>
                        <a href="#submenu1" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
                            <i class="fs-4 bi-journal-richtext"></i> <span class="ms-1 d-none d-sm-inline">Notebooks</span> </a>
                        <ul class="collapse nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                            <li class="w-100">
                                <a href="#" class="nav-link px-0"> <span class="d-none d-sm-inline">Notes</span></a>
                            </li>
                            <li>
                                <a href="#" class="nav-link px-0"> <span class="d-none d-sm-inline">Work</span></a>
                            </li>
                            <li>
                                <a href="#" class="nav-link px-0"> <span class="d-none d-sm-inline">Family</span></a>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <a href="#" v-on:click="pins" class="nav-link px-0 align-middle">
                            <i  class="fs-4 bi-pin"></i> <span class="ms-1 d-none d-sm-inline">Pins</span> </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link px-0 align-middle">
                            <i class="fs-4 bi-star"></i> <span class="ms-1 d-none d-sm-inline">Stars</span> </a>
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
        getTagList() {
            console.log(this.taglist)
        },
        getTagNotes(tag) {
            console.log(tag)
            this.$emit('getTagNotes', tag)
        },
        tagColor() {
            const tags = document.getElementsByClassName('tag')
            console.log(tags)
            // console.log('tagColor')
            // // loop through all tags and assign a random color
            // for (let i = 0; i < tags.length; i++) {
            //     // add a class to each tag
            //     tags[i].classList.add('bg-primary')
            // }
        }
    },
    created() {
        // console.log(this.taglist)
        // this.tagColor()
    }

}

</script>

<style scope>

</style>