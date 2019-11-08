const userCloudinary = 'YOUR_USER_CLOUDINARY' // first register in cloudinary
const userKeyCloudinary = 'YOUR_USER_CLOUDINARY' //get the k ey

class Product {
	constructor(name, price, year, img){
		this.name = name
		this.price = price
		this.year = year
		this.img = img
	}
	
	getImg(){
		const image = this.img
		const cloudUrl = 'https://api.cloudinary.com/v1_1/' + userCloudinary + '/image/upload' //cloudinary route
		const cloudPreset = userKeyCloudinary //cloudinary key
		const form = new FormData()
		form.append('file', image)
		form.append('upload_preset', cloudPreset)

		const res = axios.post(cloudUrl, form ,{
				headers:{
						'Content-type': 'multipart/form-data'
				}
		})
		.then ((res)=> {
				document.getElementsByClassName('img-container')[0].src = res.data.url
		})
			
	}
}

class Interface {
    addProduct (product){
			const list = document.getElementById('product-list')
			const element = document.createElement('div')
			element.innerHTML = `
				<div class="card text-center mb-4">
					<div class="card-body">
							<img class="img-container" style="height:200px; width:200px; object-fit:cover"/>
							<strong>Product: </strong> ${product.name}
							<strong>Precio: $</strong> ${product.price}
							<strong>Año: </strong> ${product.year}
							<a href="#" class="btn btn-danger ml-4" name="borrar">Borrar</a>
					</div>
				</div>
			`
			list.insertAdjacentElement('afterbegin', element)
    }

    resetForm(){
			document.getElementById('product-form').reset()
		}
		
    deleteProduct(element){
			if (element.name === 'borrar'){
				element.parentElement.parentElement.parentElement.remove()
				this.flashMessage('Product eliminado correctamente.', 'danger')
			}
    }
    flashMessage(message,css){
        
        const div = document.createElement('div')
        div.className = `alert alert-${css} mt-4`
        div.textContent = message
        const container = document.querySelector('.container')
        container.insertAdjacentElement('afterbegin', div )

        if(container.childNodes[1].textContent === 'Complete los campos, por favor.'){
            div.remove()
        }

        setTimeout(function(){
            div.remove()
        }, 2200)
    } 
}


//Eventos
document.getElementById('product-form')
	.addEventListener('change', (e) => {
		if(e.target.name === 'file'){
			window.file = e.target.files[0]
		}
})

document.getElementById('product-form')
	.addEventListener('submit', (e) => {

		e.preventDefault()

		const name = document.getElementById('name').value
		const price = document.getElementById('price').value
		const year = document.getElementById('year').value

		const product = new Product(name,price,year,window.file)
		product.getImg()

		/* display data */
		const interface = new Interface()
		
		if(name === '' || price === '' || year === ''){
				return interface.flashMessage('Complete los campos, por favor.', 'info')
		}

		interface.addProduct(product)
		interface.resetForm()
		interface.flashMessage('Product agregado correctamente.', 'success')

	})



document.getElementById('product-list').addEventListener('click',
    function(e){
			const interface = new Interface()
			interface.deleteProduct(e.target)
    }, false)
