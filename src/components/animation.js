import { gsap } from "gsap";
import CSSRulePlugin from "gsap/CSSRulePlugin";
gsap.registerPlugin(CSSRulePlugin)

import { data } from "./data";
import { css } from "./css"
import { dom } from "./dom";

class Animation{
    btnPress(dom){
        if (dom) {
            //先移除，再添加，防止之前就有mousedown事件
            dom.classList.remove('mousedown')
            dom.classList.add('mousedown')
        } else {
            console.error("cannot find dom")
        }
    }
    btnRelease(dom){
        if (dom) {
            dom.classList.remove('mousedown')
        } else {
            console.error("cannot find dom")
        }
    }
    // 切换主题动画
    switchTheme({toDark = true, switchBtnDuration=0,backgroundDuration=0,calculatorDuration=0,calculatorDelay = 0}){
        if (toDark) {
            this.switchBtnToDark({duration:switchBtnDuration})
            this.backgroundToDark({duration:backgroundDuration})
            this.calculatorToDark({duration:calculatorDuration,delay:calculatorDelay})
        } else {
            this.switchBtnToLight({duration:switchBtnDuration})
            this.backgroundToLight({duration:backgroundDuration})
            this.calculatorToLight({duration:calculatorDuration,delay:calculatorDelay})
        }
    }
    // 切换按钮转浅色
    switchBtnToLight({tween = gsap.timeline(), duration = 0}){
        tween.to('#sun', {duration,ease:"power2",y:40,opacity:0,display:"none"})
        tween.to('#moon', {duration:0,ease:"power2",y:-40,opacity:0,display:"none"})
        tween.to('#moon', {duration,ease:"power2",y:0,opacity:1,display:"block"})
    }
    // 按钮浅色转深色
    switchBtnToDark({tween = gsap.timeline(), duration = 0}){
        tween.to('#moon', {duration,ease:"power2",y:40,opacity:0,display:"none"})
        tween.to('#sun', {duration:0,ease:"power2",y:-40,opacity:0,display:"none"})
        tween.to('#sun', {duration,ease:"power2",y:0,opacity:1,display:"block"})
    }
    // 背景转浅色
    backgroundToLight({tween = gsap.timeline(), duration = 0}){
        tween.to('body', {duration,background:css.lightPrimaryColor})
    }
    // 背景转深色
    backgroundToDark({tween = gsap.timeline(), duration = 0}){
        tween.to('body', {duration,background:css.darkPrimaryColor})
    }
    // 计算器转浅色
    calculatorToLight({tween = gsap.timeline(), duration = 0,delay=0}){
        this.calculatorBackgroundToLight({tween,duration})
        this.calculatorBtnToLight({tween,duration,delay})
    }
    // 计算器转深色
    calculatorToDark({tween = gsap.timeline(), duration = 0,delay=0}){
        this.calculatorBackgroundToDark({tween,duration})
        this.calculatorBtnToDark({tween,duration,delay})
    }
    // 计算机背景转浅色
    calculatorBackgroundToLight({tween = gsap.timeline(), duration = 0}){
        tween.to('.calculator', {duration,boxShadow:css.lightCalculatorBgShadow})
    }
    // 计算机背景转深色
    calculatorBackgroundToDark({tween = gsap.timeline(), duration = 0}){
        tween.to('.calculator', {duration,boxShadow:css.darkCalculatorBgShadow})
    }
    // 计算机按钮转浅色
    calculatorBtnToLight({tween = gsap.timeline(), duration = 0,delay=0}){
        data.orderList.forEach((btnInfo,index) => {
            // 基地转浅色
            this.calculatorBtnGroundToLight({btnInfo,duration,delay:index*delay})
            // 上层转深色
            this.calculatorBtnBeforeToLight({btnInfo,duration,delay:index*delay})
        });
    }
    // 计算机按钮转深色
    calculatorBtnToDark({tween = gsap.timeline(), duration = 0,delay=0}){
        data.orderList.slice().reverse().forEach((btnInfo,index) => {
            // 基地转深色
            this.calculatorBtnGroundToDark({btnInfo,duration,delay:index*delay})
            // 上层转深色
            this.calculatorBtnBeforeToDark({btnInfo,duration,delay:index*delay})
        });
    }
    calculatorBtnGroundToLight({btnInfo,tween = gsap.timeline(), duration = 0,delay=0}){
        const id = `#${btnInfo.id}`
        let background = css.lightSpanBackgroundLinear
        switch (btnInfo.id) {
            case 'clear':
                background = css.clearColor
                break;
            case 'delete':
                background = css.deleteColor
                break;
            case 'equal':
                background = css.equalColor
                break;
        }
        tween.to(id,{duration,delay,background})
    }
    calculatorBtnGroundToDark({btnInfo,tween = gsap.timeline(), duration = 0,delay=0}){
        const id = `#${btnInfo.id}`
        let background = css.darkSpanBackgroundLinear
        switch (btnInfo.id) {
            case 'clear':
                background = css.clearDeepColor
                break;
            case 'delete':
                background = css.deleteDeepColor
                break;
            case 'equal':
                background = css.equalDeepColor
                break;
        }
        tween.to(id,{duration,delay,background})
    }
    calculatorBtnBeforeToLight({btnInfo,tween = gsap.timeline(), duration = 0,delay=0}){
        const id = CSSRulePlugin.getRule(`#${btnInfo.id}::before`)
        tween.to(id,{
            duration,delay,
            color:css.lightTextColor,
            textShadow:css.lightTextShadow,
            background:css.lightSpanBeforeBackgroundLinear,
            boxShadow:css.lightSpanBeforeBoxShadow,
            borderTop:css.lightSpanBeforeBorder,
            borderBottom:css.lightSpanBeforeBorder,
            borderLeft:css.lightSpanBeforeBorder
        })
    }
    calculatorBtnBeforeToDark({btnInfo,tween = gsap.timeline(), duration = 0,delay=0}){
        const id = CSSRulePlugin.getRule(`#${btnInfo.id}::before`)
        tween.to(id,{
            duration,delay,
            color:css.darkTextColor,
            textShadow:css.darkTextShadow,
            background:css.darkSpanBeforeBackgroundLinear,
            boxShadow:css.darkSpanBeforeBoxShadow,
            borderTop:css.darkSpanBeforeBorder,
            borderBottom:css.darkSpanBeforeBorder,
            borderLeft:css.darkSpanBeforeBorder
        })
    }
    textAreaShowHistory = () => {
        gsap.to(dom.getInputDom(), {duration: 0.5, y: 24})
        gsap.to(dom.getShowDom(),
            {duration: 0.5, y: -24, opacity: 1, display: "block"})
    }
    textAreaHideHistory = () => {
        gsap.to(dom.getInputDom(), {duration: 0, y: 0})
        gsap.to(dom.getShowDom(),
            {duration: 0, y: 0, opacity: 0, display: "none"})
    }
}   
const animation = new Animation()

export {animation}