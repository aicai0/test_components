// 存储
const setStore = (name, value) =>{
    if (!name) {
        return false;
    }
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(name, string_value);
}
// 获取
const getStore = (name) =>{
    if (!name) return false;
    try {
        if(window.localStorage.getItem(name) && window.localStorage.getItem(name).length > 1){
            let return_string = window.localStorage.getItem(name);
            try{
                return JSON.parse(return_string)
            }  catch (err) {
                return return_string
            }
        }
    } catch (err) {
        console.log('localStorage err')
    }
}
// 删除
const removeStore = (name) => {
    if (!name || !window.localStorage.getItem(name)) return false;
    window.localStorage.removeItem(name);
}
export default{
    setStore,
    getStore,
    removeStore,
}
