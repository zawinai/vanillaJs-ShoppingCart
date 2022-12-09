export class Store{
     static store(name, saveItem){
          localStorage.setItem(name, JSON.stringify(saveItem))
     }

     static getProducts(id){  
          let product = JSON.parse(localStorage.getItem('products'))

          return product.find((p) => p.id === id)
     }

     static getCartProducts(){
          return localStorage.getItem('cartList') ? JSON.parse(localStorage.getItem('cartList')) : []
     }

     static clearStore(name){
          localStorage.removeItem(name)
     }

}