let exportObj = {
    // HTML标签反转义
    HTMLDecode(text) {
        let temp = document.createElement('div');
        temp.innerHTML = text;
        let output = temp.innerText || temp.textContent || '';
        temp = null;
        return output;
    },
    formatProjectName(name) {
        return exportObj.HTMLDecode(name).replace(/^([^\u4E00-\u9FA5|a-zA-Z])*/, '').slice(0, 1);
    }
};

export default {
    ...exportObj
};
