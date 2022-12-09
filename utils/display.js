import { calculateTotal } from './pricing.js'


export class Display{

     static displayProducts(products){       

          const container = document.querySelector("[data-product-container]")
          const template = document.getElementById('card')

          const breadCrumb = document.querySelector("[data-breadcrumbs]")

               Array.from(breadCrumb.children).forEach(b => {
                 
                    b.addEventListener('click' , (e) => {

                         Array.from(breadCrumb.children).map(
                              c => {
                                   c.dataset.option == e.target.dataset.option 
                                   ?
                                   c.classList.add('select')
                                   :
                                   c.classList.remove('select')
                              }
                         )   
                    })
          })
          if(products){
               products.map((p) => {
                    const card = template.content.cloneNode(true).children[0]
                    
                    const name = card.querySelector("[data-name]")
                    const price = card.querySelector("[data-price]")
                    const image = card.querySelector("[data-image]")
                    const id = card.querySelector("[data-id]")
                    
                    name.innerText = p.name
                    price.innerText = `$${p.price}`
                    image.src = p.image 
                    
                    id.dataset.id = p.id
     
                    container.append(card)
                    
                    return { name : p.name, price : p.price, image : p.image}
                    
               })

          }
          const cards = document.querySelectorAll("#card-id")

          if(cards.length){

               import('./storeData.js').then(({Store}) => {

                    const cartItems = Store.getCartProducts()

                    cards.forEach((c) => {     
                         
                         if(cartItems.length >= 1){
     
                              const check =  cartItems.map((s) => s).find((f) => f.id == c.firstElementChild.dataset.id)
     
                              const div = document.createElement('div')
                              
                              if(check){
                                   
                                   div.classList.add('incart-label')
                                   
                                div.innerText = "In cart"
                                
                                c.firstElementChild.append(div)
                                
                              }
                         }
                    })

                    if(cartItems.length >= 1){
                         const qtyIcon = document.querySelector("[data-cart-icon-quantiy]")
                    
                         qtyIcon.classList.add('qty')
          
                         const num = cartItems.reduce((total, item) => {
                              return total + item.quantity
                         },0)
                         
                         qtyIcon.innerText = num
     
                         calculateTotal()

                    }
                    
               })

          }
          
     }

}




export function displayDetailModal(products){

     const click = document.querySelectorAll('#card-id')
     const modal = document.getElementById('modal')
     const modalClose = document.getElementById('close-modal')


     click.forEach((c) => {

          
          c.addEventListener('click', (e) => {
               modal.show()

               const found = products.find(p => p.id == e.target.parentElement.dataset.id )

               const detail = document.querySelector("[data-detail]")
               const idContainer = detail.parentElement.nextElementSibling

               const name = detail.querySelector("[data-name]")
               const price = detail.querySelector("[data-price]")
               const img = detail.querySelector("[data-image]")
               const id = idContainer.querySelectorAll("[data-add-to-cart]")

               name.textContent = found.name // Bug
               price.textContent = found.price
               img.src = found.image

               import('./storeData.js').then(({Store}) => { 

                    const check = Store.getCartProducts().find((f) => f.id === parseInt(e.target.parentElement.dataset.id))

                    if(check === undefined){
                         id.forEach(i => {

                              i.disabled = false
                              i.innerText = "Add to cart"
                         })
                         
                    }else{
                         
                         id.forEach(i => {
                              i.disabled = true
                              i.innerText = "In Cart"
                         })
                    }
                    
                    id.forEach(i => {
                         i.dataset.id = found.id
                    })
               })


          })
     })


     modalClose.addEventListener('click', () => modal.close())


}

export function addProductToCart(cartList){

     const addToCartBtn = document.querySelector("[data-add-to-cart]")
     const modal = document.getElementById('modal')
     const cards = document.querySelectorAll('#card-id')

     addToCartBtn.addEventListener('click', (e) => {
          
          const target = e.target

          if(target.dataset.id){
               import('./fetchData.js').then(({FetchData}) => {
                    FetchData.getData().then((data) => {

                         let found = data.find(p => p.id === parseInt(target.dataset.id))
                         
                         if(cartList){

                              import('./storeData.js').then(({Store}) => {

                                   import('./pricing.js').then(({calculateTotal}) => {
                                        calculateTotal()
                                   })
                         
                                   cartList = [...Store.getCartProducts(), {...found, quantity : 1}]

                                   const qtyIcon = document.querySelector("[data-cart-icon-quantiy]")
          
                                   qtyIcon.classList.add('qty')
                              
                                   const num = cartList.reduce((total, item) => {
                                        return total + item.quantity
                                   },0)
                                   
                                   qtyIcon.innerText = num

                                   modal.close()

                                   Store.store('cartList', cartList)

                                   const check = Store.getCartProducts().find((c) => c.id == found.id)

                                   cards.forEach((c) => {
                                        if(parseInt(c.firstElementChild.dataset.id) === check.id){
                                             const div = document.createElement('div')
                                             div.classList.add('incart-label')
                                             div.innerText = "In Cart"
                                             c.firstElementChild.append(div)

                                        }
                                   })
                              })

                              const parent = document.querySelector("[data-template-parent]")
                              const template = document.querySelector("[data-cart-template]").content.cloneNode(true).firstElementChild
                              const name = template.querySelector("[data-cart-name]")
                              const price = template.querySelector("[data-cart-price]")
                              const image = template.querySelector("[data-cart-img]")
                              const btns = template.querySelector("[data-qty-btn-container]")
                              const qty = template.querySelector("[data-quantity]")

                              const cartTitle = parent.previousElementSibling.firstElementChild
                              cartTitle.textContent = "Your Cart"
          
                              name.textContent = found.name
                              price.textContent = found.price
                              image.src = found.image
                              qty.innerText = 1
                              btns.dataset.id = found.id
                              
                              parent.append(template)

                              import('./pricing.js').then(({handleQty}) => {
                                   template.lastElementChild.querySelectorAll('button').forEach((b) => {
                                        b.addEventListener('click', (e) => handleQty(e))
                                   })

                                   
                              })
                              
                         }

                    })
               })
          }
     })
}


export function showProductsInCart(){

     const cards = document.querySelectorAll('#card-id')
     
     if(cards.length){

          const parent = document.querySelector("[data-template-parent]")
          const cartTitle = parent.previousElementSibling.firstElementChild

          Array.from(parent.children).forEach((p) => {
               parent.removeChild(p)
          })

          
          import('./storeData.js').then(({Store}) => {
               
               const cartItems = Store.getCartProducts()

               if(cartItems.length >= 1){

                    cartTitle.textContent = "Your Cart"
                    
                    cartItems.forEach((c) => {
                         const template = document.querySelector("[data-cart-template]").content.cloneNode(true).firstElementChild
                         const name = template.querySelector("[data-cart-name]")
                         const price = template.querySelector("[data-cart-price]")
                         const image = template.querySelector("[data-cart-img]")
                         const btns = template.querySelector("[data-qty-btn-container]")
                         const qty = template.querySelector("[data-quantity]")
                         
                         name.textContent = c.name
                         price.textContent = "$ " +c.price 
                         image.src = c.image
                         qty.innerText = c.quantity
                         btns.dataset.id = c.id
                         
                         parent.append(template)
                         
                         
                         import('./pricing.js').then(({handleQty}) => {
                              template.lastElementChild.querySelectorAll('button').forEach((b) => {
                                   b.addEventListener('click', (e) => handleQty(e))
                              })
                              
                         })
                    })      

                    
               }else{
                    cartTitle.textContent = "Empty Cart"

               }
               
          })
     }
}


export function clearCart(parent){
     Array.from(parent.children).forEach((n) => {
          n.remove()
          
     })
}