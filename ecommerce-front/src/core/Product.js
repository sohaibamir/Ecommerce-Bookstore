import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { read, listRelated } from "./apiCore";
import Card from "./Card";
import Layout from "./Layout";

const Product = () => {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState(false);

    const loadSingleProduct = productId => {
        read(productId).then(data => {
            if (data.error) {
                setError(data.error);
            }
            else {
                setProduct(data);
                // fetch related products
                listRelated(data._id).then(data => {
                    if (data.error) {
                        setError(data.error);
                    }
                    else {
                        setRelatedProduct(data);
                    }
                })

            }
        });
    }

    useEffect(() => {
        const productId = params.productId;
        loadSingleProduct(productId);
    }, [params])

    return (
        <Layout title={product && product.name} description={product && product.description} className="container-fluid">
            {/* <div className="row d-flex justify-content-center">{ */}
            <div className="row">
                <div className="col-8">
                    {product && product.description && (
                        <Card product={product} showViewProductButton={false} />
                    )}
                </div>

                <div className="col-4">
                    <h4>Related Products</h4>
                    {relatedProduct.map((p, i) => (
                        <div className="mb-4">
                            <Card key={i} product={p} />
                        </div>
                    ))}

                </div>
            </div>
        </Layout>
    )
}

export default Product
