import React, { useEffect, useState } from "react"
import axios from "axios"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Pencil, Trash } from "lucide-react"

const ProductList = () => {
    const [products, setProducts] = useState([])

  // GET PRODUCTS
  const getProducts = async () => {
    try {
      const res = await axios.get("https://mern-ecommerce-91cv.onrender.com/api/v1/product/getproduct")

      setProducts(res.data.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  // DELETE PRODUCT
//   const deleteProduct = async (id) => {

//     try {

//       await axios.delete(`http://localhost:5000/api/products/${id}`)

//       setProducts(products.filter((item) => item._id !== id))

//     } catch (error) {

//       console.log(error)

//     }

//   }
  return (
    <div className="p-6">

      {/* PAGE HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Products
        </h1>

        <Button>
          Add Product
        </Button>

      </div>


      {/* PRODUCT GRID */}

      <div className="grid grid-cols-4 gap-6">

        {products.map((product) => (

          <Card key={product._id}>

            <CardHeader>

              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-md"
              />

            </CardHeader>

            <CardContent className="space-y-2">

              <CardTitle className="text-lg">
                {product.name}
              </CardTitle>

              <Badge>
                {product.category}
              </Badge>

              <p className="font-semibold">
                ${product.price}
              </p>

              <div className="text-sm flex gap-3">

                <span>
                  RAM: {product.ram}
                </span>

                <span>
                  Storage: {product.storage}
                </span>

              </div>

              <p className="text-sm">
                Color: {product.color}
              </p>

              {/* ACTION BUTTONS */}

              <div className="flex gap-3 pt-3">

                <Button variant="outline" size="sm">
                  <Pencil size={16} />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteProduct(product._id)}
                >
                  <Trash size={16} />
                  Delete
                </Button>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>
  )
}

export default ProductList

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { Link, useParams } from "react-router-dom";

//   const [finalData, setFinalData] = useState([]);
//   useEffect(() => {
//     async function final() {
//       const data = await axios.get(
//         "https://mern-ecommerce-91cv.onrender.com/api/v1/category/getallcategory",
//       );
//       setFinalData(data.data.data);
//     }
//     final();
//   }, []);

//   const handleDeleteCategory = (id) => {
//     axios.delete(
//       `https://mern-ecommerce-91cv.onrender.com/api/v1/category/deletecategory/${id}`,
//     );
//     setFinalData(finalData.filter((item) => item._id !== id));
//   };
//     <Card>
//       <CardHeader>
//         <CardTitle>Category List</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Serial</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead>Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {finalData.map((item, index) => (
//               <TableRow key={item.name}>
//                 <TableCell className={"px-6"}>{index + 1}</TableCell>
//                 <TableCell>{item.name}</TableCell>
//                 <TableCell>{item.description}</TableCell>
//                 <TableCell>
//                   <div className="flex gap-2">
//                     <Link to={`/updatecategory/${item._id}`}>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className={"cursor-pointer"}>
//                         Edit
//                       </Button>
//                     </Link>
//                     <AlertDialog>
//                       <AlertDialogTrigger asChild>
//                         <Button
//                           size="sm"
//                           variant="destructive"
//                           className="cursor-pointer">
//                           Delete
//                         </Button>
//                       </AlertDialogTrigger>

//                       <AlertDialogContent>
//                         <AlertDialogHeader>
//                           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                           <AlertDialogDescription>
//                             This action cannot be undone. This will permanently
//                             delete this category.
//                           </AlertDialogDescription>
//                         </AlertDialogHeader>

//                         <AlertDialogFooter>
//                           <AlertDialogCancel>Cancel</AlertDialogCancel>

//                           <AlertDialogAction
//                             onClick={() => handleDeleteCategory(item._id)}
//                             className={"cursor-pointer"}>
//                             Confirm Delete
//                           </AlertDialogAction>
//                         </AlertDialogFooter>
//                       </AlertDialogContent>
//                     </AlertDialog>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>

