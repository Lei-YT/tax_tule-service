import Vue from "vue"
const requireComponent = require.context(
    './', //组件所在目录的相对路径
    false, //是否查询其子目录
    /\.vue/ //匹配基础组件文件名的正则表达式
)
requireComponent.keys().forEach(fileName => {
    // 获取文件名
    var names = fileName.split("/").pop().replace(/\.\w+$/, "");//BaseBtn

    // console.log(_.camelCase(names))

    // 获取组件配置
    const componentConfig = requireComponent(fileName);
    // 若该组件是通过"export default"导出的，优先使用".default"，
    // 否则退回到使用模块的根
    // _.camelCase(names) 进行驼峰转换
    Vue.component(_.camelCase(names), componentConfig.default || componentConfig);
})
