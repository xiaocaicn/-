var itcast = {
    getParameter: function (str) { // ?id=7&name=jack
        // 删除?
        str = str.replace('?', '')  // id=7&name=jack
        // 分割字符串
        var arr = str.split('&')  // ["id=7","name=jack"]
        // 循环遍历再次分割
        var obj = {}
        for (var i = 0; i < arr.length; i++) { // 1.id=7
            var temp = arr[i].split('=') // ["id",7]
            // 将数据添加到对象
            obj[temp[0]] = temp[1] // {id:7}
        }
        return obj
    }
}