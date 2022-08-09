import { Status } from "./status"
import { rule } from "./rule"
import { logMaker } from "../utils/log"
import { counter } from "../utils/counter"
import { dom } from "./dom"
import { math } from "./math"
import { animation } from "./animation"


const log = logMaker(true)
class Calculator{
    constructor() {
        this.rule = rule
    }

    // 分析每一次输入并给出相应的行为
    // @currentInputInfo获取单次信息
    // 注：该信息来源于db.json中对应的输入数据
    analysisEachTimeInput(currentInputInfo){
        // 生成当前输入时的所有状态的信息
        this._prepareData(currentInputInfo)
        // 检查规则，通过后执行
        this._checkRules(currentInputInfo) && this._run()
    }

    // 准备数据
    _prepareData(info){
        Status.generate(info)
    }

    // 检查规则
    _checkRules(currentInputInfo){
        // log
        this._checkRulesLog(currentInputInfo)
        // 设立全部通过的标识位，初始化位true，假定全部通过
        let passAllRulesFlag = true
        currentInputInfo.rule.every(ruleName => {
            // 根据规则名称，生成具体的函数名
            const ruleFunName = this._generateRuleFunName(ruleName)
            // 检查是否存在这个函数名
            if (this._ruleFunExists(ruleFunName)) {
                // 有规则函数，执行规则函数查看规则是否通过，标识看结果
                passAllRulesFlag &&= this._ruleFunExecute(ruleFunName)
            } else {
                // 没函数，标识为false
                passAllRulesFlag = false
                // 打印输出
                log(`Cannot find this function: ${ruleFunName}`, 'warn')
            }
            return passAllRulesFlag
        })
        // 返回 true说明全部通过，返回false说明有没有通过的规则
        return passAllRulesFlag
    }
    // log
    _checkRulesLog = (currentInputInfo) =>{
        const value = counter.next().value
        const tag = currentInputInfo.tag
        // debugger
        // console.trace()
        log(`====== Counter: [${value}] Input: ${tag} ======`)
    }
    // 生成具体的规则函数名
    _generateRuleFunName = (ruleFunName) => {
        return `this.rule.${ruleFunName}`
    }
    // 是否存在这个函数名
    _ruleFunExists = (ruleFunName) => {
        return typeof eval(ruleFunName) === "function"
    }
    // 执行规则函数
    _ruleFunExecute = (ruleFunName) => {
        return eval(ruleFunName)()
    }

    //规则通过后执行计算行为
    _run(){
        Status.lastInputShowResult = false
        this._addValue()
        this._showResult()
        this._clearAll()
        this._clearLast()
    } 

    _addValue = () => {
        if (Status.currentInputStatus.isAddValue) {
            dom.getInputDom().value += Status.currentInputInfo.tag
        }
    }
    _showResult = () => {
        if (Status.currentInputStatus.isShowResult) {
            if (!dom.getInputDom().value.length) return 
            const analysisInput = Status.currentInputDomSplitOptimize.join('')
            const calculateResult = math.calculate(analysisInput)

            if (typeof calculateResult === "number") {
                dom.getShowDom().value = analysisInput + '='
                dom.getInputDom().value = calculateResult
                animation.textAreaShowHistory()
            }

            Status.lastInputShowResult = true
        }
    }
    _clearAll = () => {
        if (Status.currentInputStatus.isClearAll) {
           if (dom.getInputDom().value.length) {
                dom.getInputDom().value = ''
                this._calculateShowDomValue()
            } else if (dom.getShowDom().value.length) {
                dom.getShowDom().value = ''
                animation.textAreaHideHistory()
            }
        }
        
    }
    _clearLast = () => {
        if (Status.currentInputStatus.isClearLast) {
            if (dom.getInputDom().value.length) {
                const input = dom.getInputDom().value.split('')
                input.pop()
                dom.getInputDom().value = input.join('')
            }
            if (dom.getShowDom().value.length) {
                this._calculateShowDomValue()
            }
        }
        
    }
    _calculateShowDomValue = () => {
        const history = dom.getShowDom().value.split('')
        if (history.pop() === '=') {
            dom.getShowDom().value += math.calculate(history.join(''))
        }
    }
}

const calculator = new Calculator()

export {calculator}