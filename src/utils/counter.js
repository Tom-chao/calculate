// 工厂函数
function* counterMaker(index = 0) {
    while (true) {
        yield index++
        // 先使用后++
    }
}

const counter = counterMaker(1)
export {
    counter,
    counterMaker
}