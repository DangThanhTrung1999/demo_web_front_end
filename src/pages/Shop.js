import React, { useEffect, useState } from "react";
import "../App.css";
import Newsletter from "../components/Layouts/Newsletter.js"
import Footer from "../components/Layouts/Footer.js"
import BannerV2 from '../components/Banner/BannerV2.js'
import Header from '../components/Header/Header.js'
import ShopBody from "../components/Shop/ShopBody";
import bg from '../assets/S3.jpg'
import axios from 'axios'
import { withRouter } from "react-router-dom";

function Shop(props) {

    const [products, setProducts] = useState([]);
    const [sortedCate, setSortedCate] = useState([]);
    let sex = props.location.pathname.split('/')[1]
    console.log('sex ',sex);
    let cate = props.location.pathname.split('/')[2] 

    useEffect(()=>{
        window.scrollTo(0,0);
        document.body.style.overflow = 'unset';
    },[])

    useEffect(() => {
        if (sex === "shop") { 
            axios.get(`http://localhost:8081/products`)
            .then(res => {   
                
                const virtualCate = [...res.data] 
                //Get all category
                const sortedcate = Object.values(virtualCate.reduce((a, {productCate}) => {
                    a[productCate] = a[productCate] || {productCate, count: 0};
                    a[productCate].count++;
                    return a;
                }, Object.create(null)));
                //Sort and splice category by posts count
                sortedcate.sort((a,b) =>  b.count - a.count)
                setSortedCate(sortedcate)
                const virtualData = []
                for(let i in res.data) { 
                    if (cate) { 
                        if ((res.data[i].productName).toLowerCase().includes(cate.toLowerCase())) {
                            virtualData.push(res.data[i])
                        } 
                    } else {
                        virtualData.push(res.data[i])
                    } 
                }
                setProducts(virtualData)
            })
        } else {
            sex.toLowerCase() === "men" ? sex = "man" : sex = "woman"
            axios.get(`http://localhost:8081/products`)
                .then(res => {
                    const virtualCate = []
                    for (let i in res.data) {
                        if (sex === "woman") {
                            if (res.data[i].productSex === "Woman") {
                                virtualCate.push(res.data[i])
                            } 
                        } else {
                            if (res.data[i].productSex === "Man") {
                                virtualCate.push(res.data[i])
                            } 
                        }
                    }
                    //Get all category
                    const sortedcate = Object.values(virtualCate.reduce((a, {productCate}) => {
                        a[productCate] = a[productCate] || {productCate, count: 0};
                        a[productCate].count++;
                        return a;
                    }, Object.create(null)));
                    // 0: {productCate: "bags", count: 7}
                    // 1: {productCate: "Tops & shirts", count: 2}
                    // 2: {productCate: "accessories", count: 2}
                    // 3: {productCate: "dress", count: 4}
                    // 4: {productCate: "paints", count: 1}
                    // 5: {productCate: "Bodysuit", count: 1}
                    // 6: {productCate: "jacket", count: 2}
                    // 7: {productCate: "bikini", count: 1}
                    //Sort and splice category by posts count
                    sortedcate.sort((a,b) =>  b.count - a.count)
                    // 0: {productCate: "bags", count: 7}
                    // 1: {productCate: "dress", count: 4}
                    // 2: {productCate: "Tops & shirts", count: 2}
                    // 3: {productCate: "accessories", count: 2}
                    // 4: {productCate: "jacket", count: 2}
                    // 5: {productCate: "paints", count: 1}
                    // 6: {productCate: "Bodysuit", count: 1}
                    // 7: {productCate: "bikini", count: 1}
                    setSortedCate(sortedcate)
                    
    
                    const virtualData = []
                    if(res.data){
                        for(let i in res.data) { 
                            if (!cate) {
                                if (res.data[i].productSex.toLowerCase() === sex) {
                                    virtualData.push(res.data[i])
                                }
                            } else {
                                if (res.data[i].productSex.toLowerCase() === sex && cate && res.data[i].productCate.toLowerCase().split(' ').join('-') === cate) {
                                    virtualData.push(res.data[i])
                                } else if (res.data[i].productSex.toLowerCase() === sex && cate && res.data[i].productCate.toLowerCase().split(' ').join('-') === cate) {
                                    virtualData.push(res.data[i])
                                }
                            }
        
                        }   
                    }
                   
                    setProducts(virtualData)
                }
            )
        }
    },[sex, cate]) 
    
    return (
        <div className="Men">
            <Header/>
            <BannerV2 bannerImage={bg} position={'120px'}/>
            <ShopBody
                products={products}
                sortedCate={sortedCate}
            />
            <Newsletter/>
            <Footer/>
        </div>
    )
}
export default withRouter(Shop);
