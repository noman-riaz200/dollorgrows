// Test script to verify plan selection logic
console.log("Testing plan selection logic...\n");

// Mock data
const poolBalance = 1500; // User has $1500 in pool wallet
const userInvestments = [
  { amount: 100, status: "active", isActive: true },
  { amount: 500, status: "active", isActive: true }
];

const plans = [
  { id: 1, name: "$100 Plan", price: 100 },
  { id: 2, name: "$200 Plan", price: 200 },
  { id: 3, name: "$500 Plan", price: 500 },
  { id: 4, name: "$1000 Plan", price: 1000 },
  { id: 5, name: "$2000 Plan", price: 2000 }
];

// Function to check if a plan is active (same as in frontend)
function isPlanActive(plan) {
  return userInvestments.some(
    (inv) => Math.abs(inv.amount - plan.price) < 0.01 && inv.status === "active" && inv.isActive
  );
}

console.log("User Pool Balance: $" + poolBalance);
console.log("User Active Investments: " + userInvestments.map(inv => "$" + inv.amount).join(", "));
console.log("\n");

// Test each plan
plans.forEach(plan => {
  const sufficientFunds = Number(poolBalance) + 0.01 >= Number(plan.price);
  const planActive = isPlanActive(plan);
  const isPurchasable = sufficientFunds && !planActive; // Assuming not purchasing
  
  console.log(`Plan: ${plan.name} ($${plan.price})`);
  console.log(`  Sufficient funds: ${sufficientFunds ? "✅ Yes" : "❌ No"}`);
  console.log(`  Plan active: ${planActive ? "✅ Yes" : "❌ No"}`);
  console.log(`  Purchasable: ${isPurchasable ? "✅ Yes - Shows 'Select Plan'" : "❌ No"}`);
  
  if (planActive) {
    console.log(`  Button shows: "You Selected This Plan" (disabled)`);
  } else if (isPurchasable) {
    console.log(`  Button shows: "Select Plan" (clickable)`);
  } else {
    console.log(`  Button shows: "Insufficient Pool Wallet" (disabled)`);
  }
  console.log("");
});

console.log("\nExpected behavior based on requirements:");
console.log("1. $100 Plan: Already active → 'You Selected This Plan'");
console.log("2. $200 Plan: Not active, sufficient funds → 'Select Plan'");
console.log("3. $500 Plan: Already active → 'You Selected This Plan'");
console.log("4. $1000 Plan: Not active, sufficient funds → 'Select Plan'");
console.log("5. $2000 Plan: Not active, insufficient funds → 'Insufficient Pool Wallet'");