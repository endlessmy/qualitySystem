/*
    add @dengyingfeng 2018/03/21

    exitToNav 参数说明：
    elId: 被移动元素Id(必填),
    targetId: 目标元素Id(必填),
    dur: 动画持续的时间（可选，默认为1s）,
    callback: 动画完成后的回调函数（可选）

*/


export default {
    methods: {
        exitToNav(elId, targetId, dur, callback) {
            let el = document.querySelector(`#${elId}`);
            let target = document.querySelector(`#${targetId}`);
            let modal = el.querySelector('.custom-dialog');
            let moveEL = modal || el;
            let movePos = moveEL.getBoundingClientRect();
            let targetPos = target.getBoundingClientRect();
            let elHtml = el.innerHTML;
            let copyEl = document.createElement('div');
            copyEl.innerHTML = elHtml;
            copyEl.style.width = movePos.width + 'px';
            copyEl.style.height = movePos.height + 'px';
            copyEl.style.textAlign = 'left';
            target.style.position = 'relative';
            copyEl.style.position = 'absolute';
            copyEl.style.boxSizing = 'contentBox';
            copyEl.style.top = parseInt(movePos.top - targetPos.top) + 'px';
            copyEl.style.left = parseInt(movePos.left - targetPos.left) + 'px';
            copyEl.children[0].setAttribute('style', '');
            let durTime = typeof dur === 'number' ? dur : 1; // 动持续时间
            copyEl.style.animationDuration = durTime + 's';
            copyEl.classList.add('exit-animate');
            if (!modal) {
                el.parentNode.removeChild(el); // 移动元素非弹窗需先删除，弹窗需在调用之前手动关闭。
            }
            target.appendChild(copyEl);
            if (typeof callback !== 'function') return;
            setTimeout(() => {
                callback.call(null);
            }, durTime * 1000);
        }
    }
};