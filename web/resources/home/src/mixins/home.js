import utils from 'common/utils/misc';
import ENCRYPT from '../containers/login/dependencies/encryptJS';
import {
    Base64
} from 'js-base64';

export default {
    methods: {
        encryptRSA(data) {
            ENCRYPT.setMaxDigits(131);
            var modulus = 'a9662d4f816fb3161556fe7104accaa87fbd199226f79001b0bea20434eb0b11da0f4b51854ccfc22748820ac399842810ddbb3d86ca91b85650df384ce823f146efd0454f33dba5c25eda6730fda0f33033a9e4d9ca14cb55ca67cdfefad4a3258834e1dfccb978880111c8e28a44a14a22246d33d86ba394665a44915a39f1';
            var exponent = '10001';
            var key = new ENCRYPT.RSAKeyPair(exponent, '', modulus, 1024);
            var encryptedData = ENCRYPT.encryptedString(key, data, ENCRYPT.RSAAPP.PKCS1Padding);
            return '!ENCRYPT-CMSS!' + Base64.encode(encryptedData);
        },

        handleUserPy(obj) {
            // 刪除字符串中的数字
            var handledName = obj.userPy.replace(/[0-9]/g, '');
            let _index = handledName.indexOf('_');
            let _length = handledName.length;
            let _lastTwo = handledName.substring(_length - 2);
            if (_index > -1) {
                handledName = handledName.substring(0, _index);
            } else if (_lastTwo.indexOf('wx') > -1 || _lastTwo.indexOf('xs') > -1) {
                handledName = handledName.substring(0, _length - 2);
            }
            return handledName;
        },

        // 新密码校验规则
        validateNewPwd(rule, value, callback) {
            let userPy = this.handleUserPy(utils.getLoginUserInfo());
            value = value.trim();
            // 允许的regTeShu 涵盖的特殊字符
            // var reg = /^(?![a-zA-Z]+$)(?![a-z\d]+$)(?![a-z!#&\.\+\\"]+$)(?![A-Z\d]+$)(?![A-Z!#&\.\+\\"]+$)(?![\d!#&\.\+\\"]+$)[a-zA-Z\d!#&\.\+\\"]+$/;
            let capitalLetter = /[A-Z]/;
            let lowercaseLetter = /[a-z]/;
            let regNum = /[0-9]/;
            let regTeShu = /[`~!@#$^&*()=_|{}:;',"\[\]\\.<>\/?+-]/;
            let complex = 0;
            if (capitalLetter.test(value)) complex += 1;
            if (lowercaseLetter.test(value)) complex += 1;
            if (regNum.test(value)) complex += 1;
            if (regTeShu.test(value)) complex += 1;

            // 校验三个以上重复
            // let regRepeat = /([a-zA-Z\d!#&\.\+\\])(\1){3,}/;
            let regRepeat = /([a-zA-Z\d`~!@#$^&*()=_|{}:;',"\[\]\\.<>\/?+-])(\1){3,}/;
            // 三个以上连续字符
            let a, b, c, d;
            let isContinuous = false;
            for (let i = 0; i < value.length - 3; i++) {
                a = value.charCodeAt(i);
                b = value.charCodeAt(i + 1);
                c = value.charCodeAt(i + 2);
                d = value.charCodeAt(i + 3);
                if ((a + 1 === b && b + 1 === c && c + 1 === d) || (a - 1 === b && b - 1 === c && c - 1 === d)) {
                    isContinuous = true;
                }
            }

            if (value.length < 8) {
                callback(new Error('至少设置8位密码'));
            } else if (value.toLowerCase().indexOf(userPy) > -1) {
                callback(new Error('不能出现用户名的全拼'));
            } else if (complex < 3) {
                callback(new Error('至少由三类字符组成'));
            } else if (regRepeat.test(value)) {
                callback(new Error('不能出现3位以上的重复字符'));
            } else if (isContinuous) {
                callback(new Error('不能出现3位以上连续数字或字母'));
            } else {
                callback();
            }
        }
    }
};
