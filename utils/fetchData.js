export class FetchData{

     static async getData(){

          
          try{

               const data = await import('../products.json')
               
               let products = await data.items
               products = data.items.map(({id, name, price, image}) => {
                    return  {id, name, price, image }
               })

               return products

          }catch(e){
               console.log(e)
          }
     }
}