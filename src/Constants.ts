

// This should be in environment variable but it works for now
export const FOBOH_BACKEND_URL = "http://foboh-backend.vercel.app/api/v1"

// Values from the table on confluence 
export const adjustmentTypes = [{
  "id": "Fixed",
  "adjustmentTypes": "Fixed ($)"
}, {
  "id": "Dynamic",
  "adjustmentTypes": "Dynamic (%)"
}];

export const adjustmentIncrementType = [{
  "id": "Increase",
  "adjustmentMode": "Increase +"
}, {
  "id": "Decrease",
  "adjustmentMode": "Decrease -"
}]

export const basedOnArray = ["Global wholesale price"]
export const categoryArray = ["Wine", "Beer", "Liquor & Spirits", "Cider", "Premixed & Ready-to-Drink", "Other"]; 
export const segmentArray = ["Red", "White", "Rose", "Orange", "Sparkling", "Port/Dessert"]
export const brandsArray = ["High Garden", "Koyama Wines", "Lacourte-Godbillon"]
