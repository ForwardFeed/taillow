<script lang="ts" setup>
import { ref } from 'vue';

type Props = {
    fields: string[]
}
const props = withDefaults(defineProps<Props>(), {
    fields:  ()=>[]
})
const datalist = ref()
</script>
<template>
    <div class="search-filter-reorder-container">
        <div class="search-box">
            <datalist ref="datalist">
                <option value="test"></option>
            </datalist>
            <div class="search-box">
                <div class="search-bar">
                    <div class="search-field"></div>
                    <input type="search" class="search-input"/>
                    <div class="search-enter">
                        |>
                    </div>
                </div>
            </div>
            <div class="search-suggestions">
                <div class="search-suggestion">habb</div>
            </div>
        </div>
        <div class="filter-reorder-box">
            <div class="filter-reorder-table">
                <div class="reorder-bar">
                    <div class="reorder-button">

                    </div>
                </div>
                <div class="filter-list">
                    <div class="filter">
                        <span class="filter-text"></span>
                        <span class="filter-cross">x</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
.search-filter-reorder-container{
    display: flex;
    background-color: yellowgreen;
    flex-direction: row;
}

.search-box{
    background-color: rgb(170, 31, 31);
    display: flex;
    flex-direction: column;
}
.search-bar{
    display: flex;
    width: calc(3em + 11em + 2em);
}
.search-field{
    width: 3em;
    background-color: rgb(231, 132, 132);
}
.search-input{
    width: 11em;
    background-color: rgb(197, 73, 73);
}   
.search-enter{
    width: 2em;
    word-wrap:normal;
}
.search-suggestions{

}
.search-suggestion{

}
.filter-reorder-box{

}
.filter-reorder-table{

}
.reorder-bar{

}
.reorder-button{

}
.filter-list{

}
.filter{

}
.filter-text{

}
.filter-cross{

}
/* Adapation to phone*/
@media (orientation: portrait) {
    .search-filter-reorder-container{
        flex-direction: column;
    }
}
</style>