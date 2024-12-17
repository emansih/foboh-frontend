import React, { useState } from "react";
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
  FormControl, InputLabel, Select, MenuItem, Button, RadioGroup, FormControlLabel, Radio, Container} from "@mui/material";
import { Product } from "./model/Product";

const adjustmentTypes = ["Fixed ($)", "Dynamic (%)"];
const categoryArray = ["Wine", "Beer", "Liquor & Spirits", "Cider", "Premixed & Ready-to-Drink", "Other"]; 
const segmentArray = ["Red", "White", "Rose", "Orange", "Sparkling", "Port/Dessert"]
const brandsArray = ["High Garden", "Koyama Wines", "Lacourte-Godbillon"]
const basedOnArray = ["Based on Price"]

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<string>("Fixed");
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [segment, setSegment] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [basedOn, setBasedOn] = useState<string>("Based on Price")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setFilteredProducts(
      products.filter(
        (product) =>
          product.title.toLowerCase().includes(value.toLowerCase()) ||
          product.sku.toLowerCase().includes(value.toLowerCase()) ||
          product.category.toLowerCase().includes(value.toLowerCase()) ||
          product.subcategory.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.checked;
    setFilteredProducts((prev) =>
      prev.map((product) => ({ ...product, selected }))
    );
  };

  const handleSelect = (id: number) => {
    setFilteredProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, selected: !product.selected } : product
      )
    );
  };

  const handleApplyAdjustments = () => {
    const updatedProducts = filteredProducts.map((product) => {
      if (product.selected) {
        const newPrice =
          adjustmentType === "Fixed"
            ? product.basePrice + adjustmentValue
            : product.basePrice * (1 + adjustmentValue / 100);
        return { ...product, newPrice: newPrice.toFixed(2) };
      }
      return product;
    });
    setFilteredProducts(updatedProducts);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}>

        <Box display="flex" alignItems="center" gap={2} my={2}>
          <TextField
              label="Search"
              value={search}
              onChange={handleSearch}
              margin="normal"
              fullWidth
            />
            
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
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
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {brandsArray.map((productBrand) => (
                  <MenuItem key={productBrand} value={productBrand}>
                    {productBrand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </Box>

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
                onChange={(e) => setAdjustmentType(e.target.value)}>

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
                  <TableCell padding="checkbox">
                    <Checkbox onChange={handleSelectAll} />
                  </TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Subcategory</TableCell>
                  <TableCell>Base Price</TableCell>
                  <TableCell>New Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={product.selected || false}
                        onChange={() => handleSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.subcategory}</TableCell>
                    <TableCell>${product.basePrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {product.newPrice ? `$${product.newPrice}` : "-"}
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
