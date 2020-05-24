
export default {
    // 判断数据的数据类型
    getTypes:function (instance){
        return Object.prototype.toString.call(instance).slice(8,-1);
    },
};