<template>
    <svg class="icon" aria-hidden="true">
        <use :xlink:href="name"></use>
    </svg>
</template>

<script>
export default {
    name: "icon",
    props: {
        iconName: {
            type: String,
            required: true,
        },
    },
    computed: {
        name() {
            return `#${this.iconName}`;
        },
    },
};
</script>

<style>
.icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
