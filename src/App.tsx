import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
  FormControl, InputLabel, Select, MenuItem, Button, RadioGroup, FormControlLabel, Radio, ListItemText } from "@mui/material";
import { Product } from "./model/Product";
import { getProducts, searchProduct } from "./FobohClient";

const adjustmentTypes = ["Fixed ($)", "Dynamic (%)"];
const basedOnArray = ["Global wholesale price"]
const categoryArray = ["Wine", "Beer", "Liquor & Spirits", "Cider", "Premixed & Ready-to-Drink", "Other"]; 
const segmentArray = ["Red", "White", "Rose", "Orange", "Sparkling", "Port/Dessert"]
const brandsArray = ["High Garden", "Koyama Wines", "Lacourte-Godbillon"]

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSegment, setSelectedSegment] = useState<string>("");

  const [basedOn, setBasedOn] = useState<string>("Global wholesale price")
  const [pricingProfile, setPricingProfile] = useState<string>("global");
  const [adjustmentType, setAdjustmentType] = useState<"Fixed" | "Dynamic">("Fixed");
  const [incrementType, setIncrementType] = useState<"Increase" | "Decrease">("Increase");
  const [adjustedPrices, setAdjustedPrices] = useState<Record<string, string>>({}); 
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedFilteredProducts, setSelectedFilteredProducts] = useState<Product[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.checked;
    setFilteredProducts((prev) =>
      prev.map((product) => ({ ...product, selected }))
    );
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts()
        setProducts(products)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setSearch(searchQuery)
    if(searchQuery != ''){
      const product = await searchProduct(searchQuery)
      setFilteredProducts(product)  
    }
  };

  const toggleProductSelection = (product: Product) => {
    if(selectedFilteredProducts.includes(product)){
      setSelectedFilteredProducts((oldArray) => oldArray.filter((p) => p !== product));
    } else {
      setSelectedFilteredProducts(oldArray => [...oldArray, product])
    }
  };

  const handleChange = (event: { target: { value: string[]; }; }) => {
    const { value } = event.target;
    setSelectedProducts(value);
    const filteredProducts = products.filter(product => value.includes(product.id));
    setFilteredProducts(filteredProducts)
  };

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue)
    // I intentionally use subcategory here as there are no matching category values
    const updatedCategoryFilter = filteredProducts.filter(product => product.subcategory == categoryValue)
    setFilteredProducts(updatedCategoryFilter)
  }

  const handleSegmentChange = (segmentValue: string) => {
    setSelectedSegment(segmentValue)
    const updatedSegmentFilter = filteredProducts.filter(product => product.segmentId == segmentValue)
    setFilteredProducts(updatedSegmentFilter)
  }

  const handleBrandChange = (brandValue: string) => {
    setSelectedBrand(brandValue)
    const updatedBrandFilter = filteredProducts.filter(product => product.brand == brandValue)
    setFilteredProducts(updatedBrandFilter)
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}>

        <Box display="flex" alignItems="center" gap={2} my={2}>
          <TextField
              label="Search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              margin="normal"
              fullWidth
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel>Products</InputLabel>
                <Select
                  multiple
                  value={selectedProducts}
                  onChange={handleChange}
                  renderValue={(selected) =>
                    products
                      .filter((product) => selected.includes(product.id))
                      .map((product) => product.title)
                      .join(", ")
                  }>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      <Checkbox checked={selectedProducts.includes(product.id)} />
                      <ListItemText primary={product.title} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

                        
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categoryArray.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


            <FormControl fullWidth variant="outlined">
              <InputLabel>Segment</InputLabel>
              <Select
                value={selectedSegment}
                onChange={(e) => handleSegmentChange(e.target.value)}
              >
                {segmentArray.map((seg) => (
                  <MenuItem key={seg} value={seg}>
                    {seg}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Brand</InputLabel>
              <Select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
              >
                {brandsArray.map((productBrand) => (
                  <MenuItem key={productBrand} value={productBrand}>
                    {productBrand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </Box>


          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={() => toggleProductSelection(product)}
                      />
                    </TableCell>
                    <strong>{product.title}</strong>
                    <br />
                    SKU {product.sku}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


          <Typography variant="h6">
              Based On
            </Typography>
            <FormControl variant="outlined">
              <Select
                value={basedOn}
                onChange={(e) => setBasedOn(e.target.value)}>
                {basedOnArray.map((based) => (
                  <MenuItem key={based} value={based}>
                    {based}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>



            <Typography variant="h6">
              Set Price Adjustment Mode
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as "Fixed" | "Dynamic")}>

                {adjustmentTypes.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio />}
                    label={type}
                  />
                ))}
              </RadioGroup>
            </FormControl>
           

            <Typography variant="h6">
              The adjusted price will be calculated from {basedOn} selected above
            </Typography>

            <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Subcategory</TableCell>
                  <TableCell>Base Price</TableCell>
                  <TableCell>New Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedFilteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.subcategory}</TableCell>
                    <TableCell>${(product.globalWholesalePrice / 100).toFixed(2)}</TableCell>
                    <TableCell>
                    {adjustedPrices[product.id]
                    ? `$${adjustedPrices[product.id]}`
                    : "No Adjustments"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button variant="contained" color="primary">
              Next
            </Button>
          </Box>
        </Box>
    </Box>
  );
};

export default App;
