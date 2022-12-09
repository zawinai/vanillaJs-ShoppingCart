export function calculateTotal(){
     
     import('./storeData.js').then(({Store}) => {

          const parent = document.querySelector("[data-total-template-parent]")

          const totalContainer = document.querySelector("[data-total-container]")

          const cart = document.getElementById('cart')

          const openCart = document.getElementById('open-cart')
          
          const closeCart = document.getElementById('cart-close')
          
          const cartItems = Store.getCartProducts()
          
          const cartShow = () => {
               cart.classList.add('cart-container-show')
          }

          
          const checkOut = document.querySelector("[data-checkout]")
          
          const totalPrice = cartItems.map((c) => c.price * c.quantity).reduce((prev, curr) => { return prev + curr },0)
          
          const totalQty = cartItems.map((c) => c.quantity).reduce((prev, curr) => { return prev + curr },0)

          const price = document.querySelector("[data-total-price]")

          const quantity = document.querySelector("[data-total-quantity]")

          const handleCheckOut = () => {

               const nodes = cart.querySelector("[data-template-parent]")

               
               Store.store(`Shopping@ ${Date()}`, cartItems)
               
               Store.clearStore('cartList')    
               
               cart.querySelector("[data-cart-title]").textContent = "Thank You 4 shopping w/ us!"
               
               Array.from(nodes.children).forEach((n) => {
     
                    n.remove()
                    
               })
                    const labels = document.querySelectorAll(".incart-label")
          
                    labels.forEach((l) => {
                         l.remove()
                    })

                    const qtyIcon = document.querySelector("[data-cart-icon-quantiy]")

                    qtyIcon.remove()
          
          }

          if(cartItems.length >= 1){
               
                    parent.appendChild(totalContainer)
               
                    openCart.addEventListener('click', cartShow)

                    price.textContent = `Total : ${totalPrice}`
                    
                    quantity.textContent = ` ${totalQty} : items`  

                    checkOut.disabled = false
                    openCart.disabled = false
                    
                    closeCart.addEventListener('click', () => cart.classList.remove('cart-container-show'))
                    
                    checkOut.addEventListener('click', handleCheckOut)
                    
                    
               }else{    
                    
                    cart.querySelector("[data-cart-title]").textContent = "Empty Cart again :("
                    
                    price.textContent = `Total : ${totalPrice}`
                    
                    quantity.textContent = ` ${totalQty} : items`  
                    
                    cart.classList.remove('cart-container-show')

                    openCart.removeEventListener('click', cartShow)
                    
                    checkOut.removeEventListener('click', handleCheckOut)

                    checkOut.disabled = true
                    openCart.disabled = true

               }
     })

}


export function handleQty(e){
     import('./storeData.js').then(({Store}) => {

          const cards = document.querySelectorAll('#card-id')

          const check = Store.getCartProducts().find((c) => c.id === parseInt(e.target.parentElement.dataset.id))

          let newCartList = []

          if(e.target.dataset.qty === "increase"){

               newCartList = Store.getCartProducts().map((s) => s.id === check.id ? {...s, quantity : s.quantity === 10 ? s.quantity = 10 : s.quantity + 1 } : s) 

               e.target.nextElementSibling.innerText = newCartList.find((f) => f.id === parseInt(e.target.parentElement.dataset.id)).quantity

          }else{

               const grandParent = e.target.parentElement.parentElement.parentElement

               const checkCartList = Store.getCartProducts().map((s) => s.id === check.id ? {...s, quantity : s.quantity - 1} : s).find((f) => f.quantity < 1)
               
               newCartList = Store.getCartProducts().map((s) => s.id === check.id ? {...s, quantity : s.quantity - 1} : s).filter((f) => f.quantity >= 1)

               if(checkCartList && checkCartList.id === parseInt(e.target.parentElement.dataset.id)){
                    
                    grandParent.removeChild(e.target.parentElement.parentElement)
                    
                    cards.forEach((c) => {
                         if(c.firstElementChild.dataset.id == e.target.parentElement.dataset.id){
                              c.firstElementChild.removeChild(c.getElementsByClassName("incart-label")[0])
                         }
                    })

               }else{
                    e.target.previousElementSibling.innerText = newCartList.find((f) => f.id === parseInt(e.target.parentElement.dataset.id)).quantity
                    
               }
               
               
          }

          const qtyIcon = document.querySelector("[data-cart-icon-quantiy]")

          qtyIcon.classList.add('qty')

          const num = newCartList.reduce((total, item) => {
               return total + item.quantity
          },0)
          
          qtyIcon.innerText = num

          Store.store('cartList', newCartList)

          calculateTotal()
          
     })
}

export function checkOut(){
     import('./storeData.js').then((Store) => {
          Store.getCartProducts()
     }).then((data) => {
          console.log(data)
     })
}
