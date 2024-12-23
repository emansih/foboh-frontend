import { useEffect, useState } from "react";
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
  FormControl, InputLabel, Select, MenuItem, Button, RadioGroup, FormControlLabel, Radio, ListItemText, 
  SelectChangeEvent} from "@mui/material";
import { Product } from "./model/Product";
import { adjustPrice, getProducts, searchProduct } from "./FobohClient";
import { adjustmentIncrementType, adjustmentTypes, basedOnArray, brandsArray, categoryArray, segmentArray } from "./Constants";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSegment, setSelectedSegment] = useState<string>("");

  const [basedOn, setBasedOn] = useState<string>("Global wholesale price")
  const [adjustmentType, setAdjustmentType] = useState<"Fixed" | "Dynamic">("Fixed");
  const [incrementType, setIncrementType] = useState<"Increase" | "Decrease">("Increase");
  const [adjustedPrices, setAdjustedPrices] = useState<{ id: string; adjustment: number }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedFilteredProducts, setSelectedFilteredProducts] = useState<Product[]>([]);
  
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

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as unknown as string[];
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

  const handleAdjustmentChange = (productId: string, value: string) => {
    setAdjustedPrices((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === productId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].adjustment = +value;
        return updated;
      } else {        
        return [...prev, { id: productId, adjustment: +value }];
      }
    });
  };

  
  const submitAdjustmentChange = async () => {
    const productsToBeAdjusted: { id: string; adjustment: number }[] = []
    adjustedPrices.map(value => {
      const userDefinedPrice = value.adjustment
      if(userDefinedPrice > 0){
        productsToBeAdjusted.push({
          id: value.id,
          adjustment: userDefinedPrice
        })
      }
    })
    const response = await adjustPrice(adjustmentType, incrementType, productsToBeAdjusted);
    const updatedProducts = filteredProducts.map((product) => {
      const adjustmentResponse = response.find((item) => item.id === product.id);
      if (adjustmentResponse) {
        return {
          ...product,
          newWholeSalePrice: adjustmentResponse.newWholeSalePrice,
        };
      }
      return product;
    });
    setSelectedFilteredProducts(updatedProducts);
  }
    
  const getAdjustmentValue = (productId: string): string => {
    const adjustment = adjustedPrices.find((item) => item.id === productId);
    return adjustment ? adjustment.adjustment.toString() : "";
  };

  const adjustedPrice = (price: number | undefined) => {
    if(price){
      return `$${(price / 100).toFixed(2)}`
    } else {
      return "No Adjusted Price"
    }
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



            <Typography variant="subtitle1">
              Set Price Adjustment Mode
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as "Fixed" | "Dynamic")}>

                {adjustmentTypes.map((type) => (
                  <FormControlLabel
                    key={type.id}
                    value={type.id}
                    control={<Radio />}
                    label={type.adjustmentTypes}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Typography variant="subtitle1">
              Set Price Adjustment Increment Mode
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={incrementType}
                onChange={(e) => setIncrementType(e.target.value as "Increase" | "Decrease")}>
                {adjustmentIncrementType.map((type) => (
                  <FormControlLabel
                    key={type.id}
                    value={type.id}
                    control={<Radio />}
                    label={type.adjustmentMode}
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
                  <TableCell>Based On Price</TableCell>
                  <TableCell>Adjustment</TableCell>
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
                      <TextField
                         label="Adjustment"
                         value={getAdjustmentValue(product.id)} 
                         onChange={(e) => handleAdjustmentChange(product.id, e.target.value)}
                         type="number"
                         />
                    </TableCell>
                    <TableCell>{adjustedPrice(product.newWholeSalePrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button variant="contained" onClick={submitAdjustmentChange} color="primary">
              Next
            </Button>
          </Box>
        </Box>
    </Box>
  );
};

export default App;
