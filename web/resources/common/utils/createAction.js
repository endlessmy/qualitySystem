/**
 * @author qqli
 * @description 全局 createAction 封装
 */

const createAction = (type, payloadCreator, metaCreator) => {
    const identity = (...args) => args[0];
    const isFunc = fn => typeof fn === 'function';
    const isPromise = obj => typeof obj === 'object' && isFunc(obj.then);
    const finalPayloadCreator = isFunc(payloadCreator) ? payloadCreator : identity;

    return ({ commit, dispatch }, ...args) => {
        const payload = finalPayloadCreator(...args);
        const action = {
            type,
            payload
        };

        if (isFunc(metaCreator)) {
            action.meta = metaCreator(...args);
        }

        if (isPromise(payload)) {
            return payload
                .then(result => {
                    commit(type, Object.assign(action, { payload: result }));
                    return result;
                })
                .catch(error => Promise.reject(error));
        }

        return commit(type, Object.assign(action, { payload }));
    };
};

export default createAction;
