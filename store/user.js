/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-03 14:42:28
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-03 16:46:15
 */
module.exports ={
    getInfo(api){
        api.loadSource(async ({ addCollection }) => {

            const {data} = await axios.get(``);
            
            console.log(data); 
            
            const configuration = addCollection('configuration');
          
            configuration.addNode({
                ...data
            })
            
        })
    }
}