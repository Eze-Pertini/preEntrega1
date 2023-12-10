import fs from 'fs';

class ProductManager {
    constructor(path){
        this.path = path;
        this.products = [];
    }

    async getId(){
        const products = await this.getProducts();
        return products.length + 1 ;
    }

    async addProduct(product){
        if( !product.title || 
            !product.description || 
            !product.code || 
            !product.stock || 
            !product.thumbnail || 
            !product.price )
            {return console.error('Datos incompletos');}
        
        ProductManager.id++;
        const products = await this.getProducts();

        //VALIDACION DEL CODIGO
        if (products.some(p => p.code === product.code)) {
            return console.error(`Ya existe un producto con el código: ${product.code}`);
        }

        const id = await this.getId();
        const newProduct = {
            title: product.title,
            description: product.description,
            code: product.code,
            stock: product.stock,
            thumbnail: product.thumbnail,
            price: product.price,
            id: id
        }

        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
    }

    async getProducts(){
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        } catch(error){
            return [];
        }
        
    }

    async getProductById(id){
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if(!product){
            return console.error('Producto no encontrado');
        }

        return product;
    }

    async deleteProduct(id){
        const products = await this.getProducts();
        const productsDeleted = products.filter(product => product.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(productsDeleted), 'utf-8');
    }

    async updateProduct(id, productToUpdate){
        const products = await this.getProducts();
        const updatedProducts = products.map(product => {
            if(product.id === id){
                return{
                    ...product,
                    ...productToUpdate,
                    id
                }
            }
            return product;
        });

        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts), 'utf-8');
    }
} 

const test = async () => {
    const productManager = new ProductManager('./products.json');
    //  await productManager.addProduct({
    //      title: 'Notebook Asus',
    //      description: 'Asus 500 GB 16GB RAM i7',
    //      code: 1100,
    //      stock: 3,
    //      thumbnail: './iphone-13.jpg',
    //      price: 2000,
    //  });
      await productManager.addProduct({
          title: 'Iphone 14',
          description: 'Top of the tops',
          code: 4604,
          stock: 2,
          thumbnail: './iphone-14.jpg',
          price: 1500,
      });
      await productManager.addProduct({
          title: 'Notebook Asus Tuf',
          description: '2TB 16GB RAM i5',
          code: 3112,
          stock: 4,
          thumbnail: './asus-tuf-01.jpg',
          price: 900,
      });
       await productManager.addProduct({
            title: 'Samsung A54',
            description: 'Telefono standar',
            code: 3131,
            stock: 10,
            thumbnail: './A54-01.jpg',
            price: 350,
        });

    //const product2 = await productManager.getProductById(3);
    //console.log(product2);

    // await productManager.updateProduct(4, {
    //     title: 'Samsung s22'
    // });

    //await productManager.deleteProduct(1);

}

//test();

export default ProductManager;