document.addEventListener('readystatechange', () => {
     
     let cartList = []

     import('./utils/fetchData.js').then(({FetchData}) => {
          FetchData.getData()

          .then((data) => {

               import('./utils/storeData.js')
               
               .then(({Store}) => {

                    Store.store('prodcuts',data)

                    import('./utils/display.js')
                    .then(({Display, displayDetailModal, addProductToCart, showProductsInCart}) => {

                         Display.displayProducts(data)        

                         displayDetailModal(data)
                         
                         addProductToCart(cartList)
                         
                         showProductsInCart()
                         
                         })

                    })
               })

          })
     })


