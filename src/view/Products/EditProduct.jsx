import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { upload_images } from "../../utils";
import { backend } from "../../api/index";
import { useSelector } from "react-redux";
import {
  Button,
  Grid,
  makeStyles,
  TextareaAutosize,
  TextField,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
const EditProduct = () => {
  const classes = useStyles();
  const history = useHistory();

  const { id } = useParams();
  const state = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);

  const forms = useRef(null);
  const [images, setimages] = useState([]);
  const [productImages, setProductImages] = useState(["", "", "", "", "", ""]);

  const initialState = {
    skuName: "",
    skuprice: "",
    category: "",
    skuTag: "",
    stockQty: "",
    productDescription: "",
  };
  const [productData, setproductData] = useState(initialState);
  const { skuName, skuprice, productDescription, sales_tax } = productData;
  const [tags, settags] = useState([]);

  const notify = () => toast("Product Updated Successfully");

  useEffect(() => {
    fetchProduct();
    fetchCategory();
  }, []);
  useEffect(() => {
    fetchSubCategory();
  }, [productData]);

  const fetchProduct = () => {
    const product = state?.products?.find((i) => i._id === id);
    if (product) {
      setproductData({
        skuName: product.product_name,
        skuStyle: product.product_style,
        skuprice: product.product_price,
        stockQty: product.quantity,
        productDescription: product.product_description,
        category: product.product_category,
        subCategory: product.product_subcategory,
        sales_tax: product.sales_tax,
      });
      settags(
        product.product_tags.map((i) => {
          return {
            value: i,
            label: i,
          };
        })
      );
      product.product_images.map((i, ind) =>
        setProductImages((shots) =>
          shots.map((shot, index) => (index === ind ? i.image : shot))
        )
      );
    }
  };
  const fetchCategory = async () => {
    try {
      const {
        data: { data },
      } = await backend.get("/category");
      setCategories(
        data.map((i) => {
          return { value: i._id, label: i.category_name };
        })
      );
    } catch (err) {
      fetchCategory();
    }
  };
  const fetchSubCategory = async () => {
    try {
      const {
        data: { data },
      } = await backend.get("/subcategory");
      const Suboptions = data.filter(
        (i) => i.category_name._id === productData.category
      );
      setSubCategories({
        options: Suboptions.map((i) => {
          return { value: i._id, label: i.subcategory_name };
        }),
        subCategories: data,
      });
    } catch (err) {
      fetchSubCategory();
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setproductData({ ...productData, [name]: value });
  };

  const handleCategory = (e) => {
    const Suboptions = subcategories.subCategories.filter(
      (i) => i.category_name._id === e.value
    );
    setSubCategories({
      ...subcategories,
      options: Suboptions.map((i) => {
        return { value: i._id, label: i.subcategory_name };
      }),
    });

    setproductData({ ...productData, category: e.value });
  };

  const handleSubCategory = (e) => {
    setproductData({ ...productData, subCategory: e.value });
  };

  const handleChangeInputFile = (e, i) => {
    let imagess = [...images];
    imagess[i] = e.target.files[0];
    setimages(imagess);
  };

  const handleChangeTag = (e) => {
    settags(e);
    const arr = e.map((i) => i.value);
    setproductData({ ...productData, skuTag: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productImages.includes("")) {
      toast.error("Upload all images");
    } else {
      try {
        const res = await backend.put(`/product/${id}`, {
          product_name: productData.skuName,
          product_category: productData.category,
          product_subcategory: productData.subCategory,
          product_tags: productData.skuTag,
          product_description: productData.productDescription,
          product_images: productImages.map((i) => ({
            image: i,
          })),
          product_price: productData.skuprice,
          quantity: productData.stockQty,
          sales_tax,
        });
        notify();
        history.push("/products");
      } catch (error) {
        toast.error(
          error.response ? error.response.data.message : error.message
        );
      }
    }
  };

  const previewImage = async (e, i) => {
    const media = new FormData();
    Array.from(e.target.files).forEach((i) => {
      media.append("images", i);
    });
    try {
      const res = await upload_images(media);
      if (res.status !== 500 && res.data.images.length > 0) {
        handleChangeInputFile(e, i);
        setProductImages((shots) =>
          shots.map((shot, index) => (index === i ? res.data.images[0] : shot))
        );
      }
    } catch (err) {
      toast.error("This image format is not supported");
    } finally {
      e.target.value = null;
    }
  };

  return (
    <div className="mainForm">
      <div className={classes.root}>
        <Typography className={classes.heading2}>{"Edit"} Product</Typography>

        <form ref={forms} onSubmit={handleSubmit}>
          <Grid container lg={12} spacing={5}>
            <Grid item xs={12} md={12} lg={5}>
              <Grid item xs={12} md={12} lg={12}>
                <div>
                  <span>Product Name</span>
                </div>
                <TextField
                  id="outlined-uncontrolled"
                  variant="outlined"
                  type="text"
                  className="form-control"
                  name="skuName"
                  placeholder="Product Name"
                  onChange={handleChangeInput}
                  value={skuName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <div>
                  <span class="input-group-text" id="basic-addon1">
                    Product Price
                  </span>
                </div>

                <TextField
                  id="outlined-uncontrolled"
                  variant="outlined"
                  className="form-control "
                  type="number"
                  name="skuprice"
                  placeholder="00"
                  onChange={handleChangeInput}
                  value={skuprice}
                  required
                />
                {/* <small className="text-primary">This field is required</small> */}
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1">
                    Sales tax
                  </span>
                </div>
                <TextField
                  id="outlined-uncontrolled"
                  variant="outlined"
                  className="form-control "
                  type="number"
                  name="sales_tax"
                  placeholder="0%"
                  onChange={handleChangeInput}
                  value={sales_tax}
                  required
                />
              </Grid>

              <small>This field require % of sales tax on a product</small>
              <br />

              <Grid item xs={12} md={12} lg={12}>
                <CreatableSelect
                  options={options}
                  isMulti
                  name="Tag"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Tags"
                  onChange={handleChangeTag}
                  value={tags}
                />
                {/* <small className="text-primary">This field is required</small> */}
              </Grid>
              <br />

              <Grid item xs={12} md={12} lg={12}>
                <Select
                  value={
                    productData?.category && categories?.length
                      ? categories.filter(
                          (x) => x.value === productData?.category
                        )
                      : []
                  }
                  options={categories}
                  name="category"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Category"
                  onChange={handleCategory}
                />
                {/* <small className="text-primary">This field is required</small> */}
              </Grid>
              <br />

              <Grid item xs={12} md={12} lg={12}>
                <Select
                  value={
                    productData?.subCategory && subcategories?.length
                      ? subcategories.options.filter(
                          (x) => x.value === productData?.subCategory
                        )
                      : []
                  }
                  options={subcategories.options}
                  name="subcategory"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="SubCategory"
                  onChange={handleSubCategory}
                />
                {/* <small className="text-primary">This field is required</small> */}
              </Grid>
              <br />
              <Grid item xs={12} md={12} lg={12}>
                <TextareaAutosize
                  maxRows={10}
                  style={{ width: 300 }}
                  minRows={3}
                  aria-label="minimum height"
                  name="productDescription"
                  placeholder="Product Description"
                  value={productDescription}
                  onChange={handleChangeInput}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={12} lg={7}>
              <div className="d-flex flex-column">
                <div className="d-flex mb-4 file-cust ">
                  <div className="mx-2">
                    {Array.from({ length: 6 }, (v, i) => i).map((i) => (
                      <div class="custom-file mb-3">
                        <TextField
                          id="outlined-uncontrolled"
                          variant="outlined"
                          type="file"
                          name="mImage"
                          class="custom-file-input change"
                          onChange={(e) => previewImage(e, i)}
                        />
                        <label class="custom-file-label" for="customFile2">
                          {images[i] ? images[i].name : <> Image {i} Exists</>}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-white w-100 text-center  ">
                  <div className="">
                    {Boolean(productImages.length) &&
                      productImages.map((i) => (
                        <img
                          className="my-5 mx-1"
                          src={i}
                          style={{ width: "30%" }}
                          alt="preview"
                        />
                      ))}
                  </div>
                </div>
              </div>
            </Grid>

            <Grid container style={{ marginTop: 20 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={productImages.includes("")}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: 460,
    width: "max-width",
    backgroundColor: theme.palette.background.paper,
    paddingTop: 20,
    paddingBottom: 35,
    paddingLeft: 35,
    paddingRight: 35,
    borderRadius: 20,
  },
  heading2: {
    fontWeight: "bold",
    fontSize: "22px",
    lineHeight: 1.2,
    color: "#2D1967",
    marginBottom: 20,
  },
  primary: {
    margin: "auto",
  },
}));

export default EditProduct;
