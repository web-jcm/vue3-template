<template>
    <div class="wrap">
        <el-carousel
            direction="horizontal"
            indicator-position="none"
            :autoplay="true"
            arrow="never"
            height="50px"
        >
            <el-carousel-item v-for="item in lists" :key="item.tableId">
                <a href="javascript:void(0)" class="important"
                    ><i class="el-icon-bell"></i>　{{ item.noticeTitle }}</a
                >
            </el-carousel-item>
        </el-carousel>
    </div>
</template>
<script>
export default {
    name: "Marquee",
    props: ["lists"], // 父组件传入数据， 数组形式 [ "连雨不知春去","一晴方觉夏深"]
    data() {
        return {
            text: "", // 数组文字转化后的字符串
        };
    },
    methods: {},
    // 把父组件传入的arr转化成字符串
    mounted: function () {},
    watch: {
        lists() {
            // for (let i = 0; i < this.lists.length; i++) {
            //     this.nextText += " 　　　　　" + this.lists[i];
            // }
        },
    },
    // 更新的时候运动
    updated: function () {
        // this.move();
    },
};
</script>
<style scoped>
.wrap {
    overflow: hidden;
}
.important {
    color: red;
}
</style>
